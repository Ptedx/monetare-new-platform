import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { IncomingMessage } from "http";
import { storage } from "./storage";

interface AuthenticatedSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

const clients = new Map<number, Set<AuthenticatedSocket>>();

export function setupWebSocket(server: Server, sessionParser: any) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request: IncomingMessage, socket, head) => {
    if (!request.url?.startsWith("/ws")) {
      socket.destroy();
      return;
    }

    sessionParser(request as any, {} as any, () => {
      const session = (request as any).session;
      if (!session?.passport?.user) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        (ws as AuthenticatedSocket).userId = session.passport.user;
        wss.emit("connection", ws, request);
      });
    });
  });

  wss.on("connection", (ws: AuthenticatedSocket) => {
    const userId = ws.userId!;
    ws.isAlive = true;

    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId)!.add(ws);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", async (data) => {
      try {
        const parsed = JSON.parse(data.toString());

        if (parsed.type === "send_message") {
          const { conversationId, content } = parsed;
          if (!conversationId || !content?.trim()) return;

          const msg = await storage.createMessage({
            conversationId,
            senderId: userId,
            content: content.trim(),
            read: false,
          });

          await storage.createAuditEntry({
            userId,
            action: "message_sent",
            entityType: "conversation",
            entityId: String(conversationId),
            details: `Message sent in conversation ${conversationId}`,
            ipAddress: null,
          });

          const convs = await storage.getConversationsForUser(userId);
          const conv = convs.find((c: any) => c.id === conversationId);
          const participantIds = conv?.participants?.map((p: any) => p.id) || [];

          const outgoing = JSON.stringify({
            type: "new_message",
            message: msg,
            conversationId,
          });

          for (const pid of participantIds) {
            const sockets = clients.get(pid);
            if (sockets) {
              sockets.forEach((s) => {
                if (s.readyState === WebSocket.OPEN) {
                  s.send(outgoing);
                }
              });
            }
          }
        }

        if (parsed.type === "mark_read") {
          const { conversationId } = parsed;
          if (conversationId) {
            await storage.markMessagesRead(conversationId, userId);
          }
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    });

    ws.on("close", () => {
      const userSockets = clients.get(userId);
      if (userSockets) {
        userSockets.delete(ws);
        if (userSockets.size === 0) {
          clients.delete(userId);
        }
      }
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const authWs = ws as AuthenticatedSocket;
      if (authWs.isAlive === false) return authWs.terminate();
      authWs.isAlive = false;
      authWs.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  return wss;
}
