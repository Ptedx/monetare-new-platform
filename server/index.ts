import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { buildApp } from "./app";
import { setupWebSocket } from "./websocket";
import { sessionMiddleware } from "./auth";

(async () => {
  const app = await buildApp();
  const server = createServer(app);

  setupWebSocket(server, sessionMiddleware);

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
