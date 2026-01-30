import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  User, 
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile
} from "lucide-react";

const mockContacts = [
  { name: "João Silva", role: "Analista GEPEC", online: true, lastMessage: "Ok, vou verificar a documentação" },
  { name: "Maria Santos", role: "Analista GECRE", online: true, lastMessage: "Proposta aprovada!" },
  { name: "Carlos Oliveira", role: "Gerente GEOPE", online: false, lastMessage: "Aguardando parecer técnico" },
  { name: "Ana Paula", role: "Analista GERPF", online: false, lastMessage: "Documentos recebidos" },
];

const mockMessages = [
  { sender: "João Silva", message: "Bom dia! Recebi a proposta do Fernando Fagundes para análise.", time: "09:00", isMe: false },
  { sender: "Você", message: "Bom dia João! Sim, é uma proposta de R$ 50 milhões para FNO-Agro.", time: "09:05", isMe: true },
  { sender: "João Silva", message: "Entendi. Preciso verificar a documentação. Os documentos já foram todos enviados?", time: "09:07", isMe: false },
  { sender: "Você", message: "A maioria sim, mas ainda falta o DRE atualizado.", time: "09:10", isMe: true },
  { sender: "João Silva", message: "Ok, vou verificar a documentação disponível e te retorno com o parecer preliminar até amanhã.", time: "09:12", isMe: false },
];

export function Chat() {
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-80 border-r bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar conversas..." className="pl-9" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {mockContacts.map((contact, index) => (
              <div 
                key={index}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  selectedContact.name === contact.name ? 'bg-[#e8f5e0]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.role}</p>
                  <p className="text-xs text-gray-400 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex items-center justify-between p-4 bg-white border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                {selectedContact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-xs text-gray-500">{selectedContact.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.isMe 
                    ? 'bg-[#92dc49] text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {!msg.isMe && (
                    <p className="text-xs font-medium text-gray-500 mb-1">{msg.sender}</p>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-white/70' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </Button>
              <Input 
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button variant="ghost" size="sm">
                <Smile className="w-5 h-5 text-gray-500" />
              </Button>
              <Button 
                onClick={handleSend}
                className="bg-[#92dc49] hover:bg-[#7ab635]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
