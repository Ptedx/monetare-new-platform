import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  User,
  Search,
  MoreVertical,
  Paperclip,
  Check,
  ChevronDown,
  ChevronRight,
  Settings,
  Info,
  CheckCheck,
  Link as LinkIcon
} from "lucide-react";

// Mock Data Structure
const contactSections = [
  {
    title: "Recentes e não lidos",
    items: [
      { id: 1, name: "Marcos Antônio", role: "Analista", avatar: "https://github.com/shadcn.png", online: true, lastMessage: "Boa tarde!", time: "16:42", unread: 0, status: "read" },
      { id: 2, name: "Victor Gomes", role: "Engenheiro", online: false, lastMessage: "Qual é o nome do cliente?", time: "12:32", unread: 3 },
      { id: 3, name: "José Reis", role: "Gerente", online: true, lastMessage: "Deu tudo certo.", time: "11:50", unread: 0, status: "read" }
    ]
  },
  {
    title: "Agência",
    items: [
      { id: 4, name: "Chelly Júnior", role: "Analista", online: true, lastMessage: "Preciso de uma ajuda...", time: "2d", unread: 0, status: "sent" },
      { id: 5, name: "Juliana Alvares", role: "Assistente", online: false, lastMessage: "Boa tarde. Tudo bem?", time: "3d", unread: 0 }
    ]
  },
  { title: "Área de Engenharia", items: [] },
  { title: "Área de Crédito/Risco", items: [] },
  { title: "Comitê de crédito", items: [] },
  { title: "Área Jurídica", items: [] },
  { title: "Área Financeira", items: [] },
];

const initialMessages = [
  { id: 1, sender: "Marcos Antônio", text: "Bom dia. Está tudo de acordo em relação a documentação do Sr. Fagundes?", time: "09:02", isMe: true, date: "Ontem", status: "read" },
  { id: 2, sender: "Você", text: "Bom dia. Sim, tudo correto.", time: "09:05", isMe: false, date: "Ontem" },
  { id: 3, sender: "Marcos Antônio", text: "Boa tarde!", time: "16:42", isMe: true, date: "Hoje", status: "read" },
];

export function Chat() {
  const [activeSection, setActiveSection] = useState("Agência");
  const [selectedContact, setSelectedContact] = useState(contactSections[0].items[0]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleSection = (title) => {
    setActiveSection(activeSection === title ? null : title);
  };

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "Marcos Antônio", // Simulating 'Me' in this context based on mockup
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      date: "Hoje",
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setMessageText("");

    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "Você",
        text: "Mensagem recebida.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        date: "Hoje"
      }]);
    }, 2000);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Layout>
      <div className="flex h-full bg-white rounded-xl overflow-hidden shadow-sm m-4 border border-gray-100">
        {/* Sidebar */}
        <div className="w-80 border-r bg-white flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input placeholder="Faça uma pesquisa..." className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl" />
              <span className="absolute right-3 top-2.5 text-xs text-gray-400 border border-gray-200 rounded px-1">⌘ + K</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {contactSections.map((section, idx) => (
              <div key={idx} className="mb-2">
                {section.title !== "Recentes e não lidos" && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {activeSection === section.title ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {section.title}
                  </button>
                )}

                {section.title === "Recentes e não lidos" && (
                  <p className="px-4 py-2 text-xs text-gray-400">{section.title}</p>
                )}

                {(section.title === "Recentes e não lidos" || activeSection === section.title) && (
                  <div className="space-y-1 mt-1">
                    {section.items.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all ${selectedContact?.id === contact.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="relative">
                          <img src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="font-semibold text-sm text-gray-900 truncate">{contact.name}</p>
                            <span className="text-[10px] text-gray-400 font-medium">{contact.time}</span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <p className="text-xs text-gray-500 truncate w-[140px]">{contact.lastMessage}</p>
                            {contact.unread > 0 ? (
                              <span className="w-4 h-4 bg-[#92dc49] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">{contact.unread}</span>
                            ) : contact.status === 'read' && (
                              <CheckCheck className="w-3 h-3 text-[#92dc49]" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#edf5e6]/30"> {/* Light greenish gray background */}
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => { }}><ChevronDown className="w-5 h-5 rotate-90" /></button>
              <img src={selectedContact?.avatar || `https://ui-avatars.com/api/?name=${selectedContact?.name || "User"}`} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-bold text-gray-900">{selectedContact?.name || "Selecione um contato"}</h3>
                <p className="text-xs text-gray-500">{selectedContact?.role || "Analista"}</p>
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
            {Object.keys(groupedMessages).map((date, idx) => (
              <div key={idx}>
                <div className="flex justify-center mb-6">
                  <span className="bg-gray-200/80 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{date}</span>
                </div>
                <div className="space-y-4">
                  {groupedMessages[date].map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[60%] relative group`}>
                        <div className={`px-4 py-3 text-sm shadow-sm ${msg.isMe
                            ? 'bg-[#dcf8c6] text-gray-800 rounded-2xl rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-2xl rounded-tl-none'
                          }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          <span>{msg.time}</span>
                          {msg.isMe && (
                            msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-[#92dc49]" /> : <Check className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white m-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600"><Paperclip className="w-5 h-5" /></button>
            <button className="text-gray-400 hover:text-gray-600"><LinkIcon className="w-5 h-5" /></button>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escreva sua mensagem..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
            <button onClick={handleSend} className="w-10 h-10 bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(146,220,73,0.3)] transition-all transform active:scale-95">
              <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
