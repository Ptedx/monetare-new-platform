import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Eye, 
  RefreshCcw, 
  Bell, 
  CheckCircle2, 
  Pencil,
  Building2,
  ChevronRight
} from "lucide-react";

export function PerfilCliente() {
  const [activeTab, setActiveTab] = useState("dados");
  const [user] = useState({
    name: "Diego Santos",
    role: "Produtor rural",
    email: "diego.santos@email.com",
    avatar: "https://i.pravatar.cc/150?u=diego"
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Perfil</h1>
          
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto pb-0.5 scrollbar-none">
            <TabButton 
              label="Dados" 
              active={activeTab === "dados"} 
              onClick={() => setActiveTab("dados")} 
            />
            <TabButton 
              label="Documentos cadastrais" 
              active={activeTab === "documentos"} 
              onClick={() => setActiveTab("documentos")} 
            />
            <TabButton 
              label="Notificações" 
              active={activeTab === "notificacoes"} 
              onClick={() => setActiveTab("notificacoes")} 
            />
          </div>
        </div>

        <Card className="bg-white border-none shadow-xl shadow-gray-200/50 rounded-[40px] overflow-hidden p-8 md:p-12">
          {activeTab === "dados" && <TabDados user={user} />}
          {activeTab === "documentos" && <TabDocumentos />}
          {activeTab === "notificacoes" && <TabNotificacoes />}
        </Card>
      </div>
    </Layout>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`relative pb-4 text-sm font-bold transition-all whitespace-nowrap ${
        active ? "text-[#92dc49]" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#92dc49] rounded-full" />
      )}
    </button>
  );
}

function TabDados({ user }) {
  return (
    <div className="space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white transform transition-transform group-hover:scale-105 duration-500">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 p-2.5 bg-[#92dc49] text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 active:scale-95 transition-all">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 leading-none">{user.name}</h2>
            <Pencil className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          <span className="inline-block px-4 py-1.5 bg-[#f0f9eb] text-[#7ab635] text-[11px] font-black uppercase tracking-wider rounded-full border border-[#92dc49]/10">
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {/* Personal Data */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-gray-900 border-l-4 border-[#92dc49] pl-4 leading-none">Dados pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Tipo de pessoa</Label>
              <Select defaultValue="pf">
                <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:ring-[#92dc49]/10">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pf">Pessoa física</SelectItem>
                  <SelectItem value="pj">Pessoa jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">CPF</Label>
              <Input defaultValue="000.000.000-00" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Data de nascimento</Label>
              <div className="relative">
                <Input defaultValue="24/05/1968" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-12 focus:bg-white" />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Estado civil</Label>
              <Select defaultValue="casado">
                <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casado">Casado</SelectItem>
                  <SelectItem value="solteiro">Solteiro</SelectItem>
                  <SelectItem value="divorciado">Divorciado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">RG</Label>
              <Input defaultValue="000.000-00" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Órgão emissor</Label>
              <Input defaultValue="SSP/PA" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Nacionalidade</Label>
              <Input defaultValue="Brasileiro" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Sexo</Label>
              <Select defaultValue="masculino">
                <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">E-mail de contato</Label>
              <div className="relative">
                <Input defaultValue="diego.santos@email.com" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-12 focus:bg-white" />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Telefone de contato</Label>
              <div className="relative">
                <Input defaultValue="(00) 0000-0000" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-12 focus:bg-white" />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Data */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-gray-900 border-l-4 border-[#92dc49] pl-4 leading-none">Endereço</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">CEP</Label>
              <Input defaultValue="00.000-000" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Logradouro</Label>
              <Input defaultValue="Rua do Corvo, Zumbi do Pacheco – Jaboatão dos Guararapes, PE" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 ml-1">Bairro</Label>
              <Input defaultValue="Zumbi do Pacheco" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6 space-y-2">
                <Label className="text-xs font-bold text-gray-500 ml-1">Cidade</Label>
                <Input defaultValue="Jaboatão dos Guararapes" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
              </div>
              <div className="col-span-6 md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-gray-500 ml-1">UF</Label>
                <Select defaultValue="pe">
                  <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pe">PE</SelectItem>
                    <SelectItem value="pa">PA</SelectItem>
                    <SelectItem value="sp">SP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-6 md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-gray-500 ml-1">Número</Label>
                <Input defaultValue="14" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabDocumentos() {
  const docs = [
    { name: "Documento 4", ext: "PDF", mod: "Modificado em 23/03/2026 15:00" },
    { name: "Documento 4", ext: "PDF", mod: "Modificado em 23/03/2026 15:00" },
    { name: "Documento 4", ext: "PDF", mod: "Modificado em 23/03/2026 15:00" },
    { name: "Documento 4", ext: "PDF", mod: "Modificado em 23/03/2026 15:00" },
    { name: "Documento 4", ext: "PDF", mod: "Modificado em 23/03/2026 15:00" },
    { name: "Documento 4", ext: "PDF", mod: "Modificado em 23/03/2026 15:00" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        {docs.map((doc, i) => (
          <div key={i} className="group p-5 bg-white rounded-3xl border border-gray-50 shadow-sm hover:border-gray-200 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#92dc49]/10 group-hover:text-[#7ab635] transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">{doc.name}</h4>
                  <span className="text-[10px] bg-gray-100 text-gray-400 font-black px-1.5 py-0.5 rounded uppercase">{doc.ext}</span>
                </div>
                <p className="text-xs text-gray-400 font-medium">{doc.mod}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-[#f0f9eb] text-[#7ab635] rounded-xl hover:bg-[#92dc49] hover:text-white transition-all active:scale-95">
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-[#f0f9eb] text-[#7ab635] rounded-xl hover:bg-[#92dc49] hover:text-white transition-all active:scale-95">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabNotificacoes() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Communication Channels */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-[#92dc49] pl-4 leading-none">Canais de comunicação</h3>
        <div className="space-y-6">
          <NotificationOption 
            label="Lembretes de mensagens" 
            value="E-mail, Push" 
            options={["E-mail", "Push", "SMS"]} 
          />
          <NotificationOption 
            label="Mudança de status da operação" 
            value="E-mail, SMS, Centro de notificações" 
            options={["E-mail", "SMS", "Centro de notificações"]} 
          />
          <NotificationOption 
            label="Novidades da plataforma" 
            value="Nenhum" 
            options={["E-mail", "Nenhum"]} 
          />
          <NotificationOption 
            label="Marketing e promoções" 
            value="E-mail" 
            options={["E-mail", "SMS", "Nenhum"]} 
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-[#92dc49] pl-4 leading-none">Preferências de comunicação</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800">Atualizações de status</h4>
              <p className="text-xs text-gray-400 font-medium">Defina quais atualizações você quer receber em tempo real</p>
            </div>
            <Select defaultValue="importantes">
              <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white transition-all">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="importantes">Apenas importantes</SelectItem>
                <SelectItem value="todas">Todas as atualizações</SelectItem>
                <SelectItem value="nenhuma">Silenciar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800">Lembretes pré-vencimento</h4>
              <p className="text-xs text-gray-400 font-medium">Você ainda receberá notificações de atraso.</p>
            </div>
            <Select defaultValue="5dias">
              <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white transition-all">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5dias">5 dias antes</SelectItem>
                <SelectItem value="10dias">10 dias antes</SelectItem>
                <SelectItem value="no-dia">No dia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationOption({ label, value, options }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center group">
      <span className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors uppercase text-[11px] tracking-widest">{label}</span>
      <Select defaultValue={value}>
        <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white hover:border-[#92dc49]/30 transition-all">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
