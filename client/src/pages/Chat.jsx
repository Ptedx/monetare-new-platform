import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Search,
  User,
  Paperclip,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Settings,
  Info,
  Plus,
  Loader2,
  MessageSquare,
  Link as LinkIcon
} from "lucide-react";

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Hoje";
  if (isSameDay(date, yesterday)) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function groupMessagesByDate(messages) {
  const groups = {};
  for (const msg of messages) {
    const label = formatDateLabel(msg.createdAt || msg.sentAt || msg.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
  }
  return groups;
}

export function Chat() {
  const qc = useQueryClient();
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewConvDropdown, setShowNewConvDropdown] = useState(false);
  const scrollRef = useRef(null);
  const wsRef = useRef(null);

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: conversations, isLoading: convsLoading } = useQuery({
    queryKey: ["/api/chat/conversations"],
  });

  const { data: availableUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/chat/users"],
  });

  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ["/api/chat/conversations", selectedConvId, "messages"],
    enabled: !!selectedConvId,
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          qc.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
          if (selectedConvId) {
            qc.invalidateQueries({
              queryKey: ["/api/chat/conversations", selectedConvId, "messages"],
            });
          }
        }
      } catch (e) {
        // ignore non-JSON messages
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [qc, selectedConvId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedConvId && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "mark_read", conversationId: selectedConvId })
      );
      qc.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
    }
  }, [selectedConvId, qc]);

  const handleSend = useCallback(() => {
    if (!messageText.trim() || !selectedConvId) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "send_message",
          conversationId: selectedConvId,
          content: messageText.trim(),
        })
      );
      setMessageText("");
      setTimeout(() => {
        qc.invalidateQueries({
          queryKey: ["/api/chat/conversations", selectedConvId, "messages"],
        });
        qc.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      }, 300);
    }
  }, [messageText, selectedConvId, qc]);

  const handleSelectConversation = (convId) => {
    setSelectedConvId(convId);
    setShowNewConvDropdown(false);
  };

  const handleStartConversation = async (userId) => {
    try {
      const res = await apiRequest("POST", "/api/chat/conversations", { userId });
      const conv = await res.json();
      await qc.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      setSelectedConvId(conv.id);
      setShowNewConvDropdown(false);
    } catch (e) {
      console.error("Falha ao criar conversa:", e);
    }
  };

  const selectedConversation = conversations?.find((c) => c.id === selectedConvId);

  const getOtherParticipant = (conv) => {
    if (!conv || !currentUser) return { name: "", role: "" };
    if (conv.otherUser) return conv.otherUser;
    if (conv.participants) {
      const other = conv.participants.find((p) => p.id !== currentUser.id);
      return other || { name: "Usuário", role: "" };
    }
    return { name: conv.name || "Usuário", role: conv.role || "" };
  };

  const filteredConversations = (conversations || []).filter((conv) => {
    if (!searchQuery.trim()) return true;
    const other = getOtherParticipant(conv);
    return other.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const groupedMessages = messages ? groupMessagesByDate(messages) : {};

  if (userLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full" data-testid="loading-chat">
          <Loader2 className="w-8 h-8 animate-spin text-[#92dc49]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-full bg-white rounded-xl overflow-hidden shadow-sm m-4 border border-gray-100">
        {/* Left Panel */}
        <div className="w-80 border-r bg-white flex flex-col">
          <div className="p-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Faça uma pesquisa..."
                className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-conversations"
              />
            </div>
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNewConvDropdown(!showNewConvDropdown)}
                data-testid="button-new-conversation"
              >
                <Plus className="w-5 h-5" />
              </Button>
              {showNewConvDropdown && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                      Iniciar conversa
                    </p>
                    {usersLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      </div>
                    ) : availableUsers?.length > 0 ? (
                      availableUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleStartConversation(user.id)}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          data-testid={`button-start-conv-${user.id}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                            {user.role && (
                              <p className="text-xs text-gray-500">{user.role}</p>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-500">Nenhum usuário disponível</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {convsLoading ? (
              <div className="flex justify-center py-8" data-testid="loading-conversations">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center" data-testid="empty-conversations">
                <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">Inicie uma conversa com outro usuário</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const isSelected = selectedConvId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all ${
                        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                      data-testid={`conversation-item-${conv.id}`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-1">
                          <p className="font-semibold text-sm text-gray-900 truncate" data-testid={`text-conv-name-${conv.id}`}>
                            {other.name || other.username || "Usuário"}
                          </p>
                          <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">
                            {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ""}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-0.5 gap-1">
                          <p className="text-xs text-gray-500 truncate" data-testid={`text-conv-preview-${conv.id}`}>
                            {conv.lastMessage || other.role || ""}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span
                              className="w-5 h-5 bg-[#92dc49] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm flex-shrink-0"
                              data-testid={`badge-unread-${conv.id}`}
                            >
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className="flex-1 flex flex-col bg-[#edf5e6]/30">
          {!selectedConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4" data-testid="empty-chat">
              <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400 text-lg">Selecione uma conversa</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900" data-testid="text-chat-participant-name">
                      {getOtherParticipant(selectedConversation).name ||
                        getOtherParticipant(selectedConversation).username ||
                        "Usuário"}
                    </h3>
                    <p className="text-xs text-gray-500" data-testid="text-chat-participant-role">
                      {getOtherParticipant(selectedConversation).role || ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                  <Settings className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                  <Info className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {msgsLoading ? (
                  <div className="flex justify-center py-8" data-testid="loading-messages">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : messages?.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <p className="text-sm text-gray-400">Nenhuma mensagem ainda</p>
                  </div>
                ) : (
                  Object.keys(groupedMessages).map((dateLabel, idx) => (
                    <div key={idx}>
                      <div className="flex justify-center mb-6">
                        <span className="bg-gray-200/80 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {dateLabel}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {groupedMessages[dateLabel].map((msg) => {
                          const isMe = msg.senderId === currentUser?.id;
                          const isRead = msg.read || msg.isRead;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                              data-testid={`message-${msg.id}`}
                            >
                              <div className="max-w-[60%] relative group">
                                <div
                                  className={`px-4 py-3 text-sm shadow-sm ${
                                    isMe
                                      ? "bg-[#dcf8c6] text-gray-800 rounded-2xl rounded-tr-none"
                                      : "bg-white text-gray-800 rounded-2xl rounded-tl-none"
                                  }`}
                                >
                                  {msg.content || msg.text}
                                </div>
                                <div
                                  className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 ${
                                    isMe ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <span>{formatTime(msg.createdAt || msg.sentAt || msg.timestamp)}</span>
                                  {isMe &&
                                    (isRead ? (
                                      <CheckCheck className="w-3 h-3 text-[#92dc49]" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white m-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <LinkIcon className="w-5 h-5" />
                </button>
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  data-testid="input-message"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(146,220,73,0.3)] transition-all transform active:scale-95"
                  data-testid="button-send-message"
                >
                  <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
