import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Columns3,
  Briefcase,
  Calculator,
  User,
  FileText,
  History,
  Home,
  MessageSquare,
  Headphones,
  Megaphone,
  Settings,
  LogOut,
  Search,
  FilePlus,
  DollarSign,
  ShieldCheck,
  MapPin,
  GraduationCap
} from "lucide-react";

const menuItems = {
  analise: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Columns3, label: "Pipeline", path: "/pipeline" },
    { icon: Briefcase, label: "Propostas", path: "/propostas" },
    { icon: Briefcase, label: "Carteira", path: "/carteira" },
    { icon: Megaphone, label: "Canais", path: "/canais" },
    { icon: MapPin, label: "Visitas", path: "/visitas" },
    { icon: DollarSign, label: "Cobrança", path: "/cobranca" },
    { icon: ShieldCheck, label: "Seguros", path: "/seguros" },
  ],
  ferramentas: [
    { icon: FilePlus, label: "Cadastro de Proposta", path: "/cadastro-proposta" },
    { icon: Calculator, label: "Simulador", path: "/simulador" },
    { icon: User, label: "Análise de Perfil", path: "/perfil" },
    { icon: FileText, label: "Documentação", path: "/documentacao" },
    { icon: History, label: "Histórico", path: "/historico" },
  ]
};

export function Sidebar() {
  const [location] = useLocation();
  const userRole = localStorage.getItem('userRole') || 'gerente';

  const roleNames = {
    gerente: 'Gerente de Contas',
    analista: 'Analista',
    projetista: 'Projetista',
    posvenda: 'Pós Venda',
    gerencial: 'Gerencial',
    juridico: 'Jurídico'
  };

  // Filter logic
  const filteredMenuItems = {
    analise: menuItems.analise.filter(item => {
      // Gerencial and Ambregulatorio: Only Dashboard
      if (userRole === 'ambregulatorio' || userRole === 'gerencial') {
        return item.label === 'Dashboard';
      }

      // Cliente: Only Propostas
      if (userRole === 'cliente') {
        return item.label === 'Propostas';
      }

      // Posvenda: Only Cobrança and Seguros
      if (userRole === 'posvenda') {
        return item.label === 'Cobrança' || item.label === 'Seguros';
      }

      // Carteira: Only for Analista and Projetista
      if (item.label === "Carteira") {
        return userRole === 'analista' || userRole === 'projetista';
      }
      // Propostas: Only for Gerente AND Cliente
      if (item.label === "Propostas") {
        return userRole === 'gerente' || userRole === 'cliente';
      }

      // Cobrança and Seguros: Only for Posvenda and maybe someone else? Hide for others for now.
      if (item.label === "Cobrança" || item.label === "Seguros") {
        return userRole === 'posvenda';
      }

      // Canais and Visitas: Only for Gerente
      if (item.label === "Canais" || item.label === "Visitas") {
        return userRole === 'gerente';
      }

      // Default: show for all (Dashboard, Pipeline)
      return true;
    }),
    ferramentas: menuItems.ferramentas.filter(item => {
      // Ambregulatorio, Posvenda and Gerencial: No tools
      if (userRole === 'ambregulatorio' || userRole === 'posvenda' || userRole === 'gerencial') {
        return false;
      }

      // Cliente: Specific tools
      if (userRole === 'cliente') {
        // "ferramentas de cadastrar propostas, documentação e histórico., simulador"
        return ["Cadastro de Proposta", "Documentação", "Histórico", "Simulador"].includes(item.label);
      }

      // Cadastro de Proposta: Only for Projetista, Cliente and Gerente
      if (item.label === "Cadastro de Proposta") {
        return userRole === 'projetista' || userRole === 'cliente' || userRole === 'gerente';
      }

      // Análise de Perfil: Not for Cliente
      if (item.label === "Análise de Perfil" && userRole === 'cliente') {
        return false;
      }

      // Simulador: Hide for analista
      if (item.label === "Simulador" && userRole === 'analista') {
        return false;
      }

      // Others (Simulador, Perfil, Docs, Histórico) are for everyone
      return true;
    })
  };

  const getHomeLink = () => {
    if (userRole === 'cliente' || userRole === 'juridico') return '/propostas';
    if (userRole === 'posvenda') return '/cobranca';
    return '/dashboard';
  };

  return (
    <div className="flex h-full overflow-hidden rounded-2xl shadow-lg bg-white">
      <div className="w-[72px] border-r border-gray-200 flex flex-col items-center justify-between py-6 px-2 bg-white">
        <div className="flex flex-col gap-4 items-center">
          {userRole !== 'ambregulatorio' && (
            <>
              <Link href={getHomeLink()}>
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${location === '/' || location === '/dashboard' || ((userRole === 'cliente' || userRole === 'juridico') && location === '/propostas') || (userRole === 'posvenda' && location === '/cobranca') ? 'bg-[#92dc49]' : 'hover:bg-gray-100'}`}>
                    <Home className={`w-8 h-8 ${location === '/' || location === '/dashboard' || ((userRole === 'cliente' || userRole === 'juridico') && location === '/propostas') || (userRole === 'posvenda' && location === '/cobranca') ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-[11px] text-gray-600">Home</span>
                </div>
              </Link>
              {userRole === 'projetista' && (
                <Link href="/aprender">
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${location.startsWith('/aprender') ? 'bg-[#92dc49]' : 'hover:bg-gray-100'}`}>
                      <GraduationCap className={`w-8 h-8 ${location.startsWith('/aprender') ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className="text-[11px] text-gray-600 font-medium">Aprender</span>
                  </div>
                </Link>
              )}
              {userRole !== 'gerencial' && userRole !== 'juridico' && (
                <Link href="/chat">
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${location === '/chat' ? 'bg-[#92dc49]' : 'hover:bg-gray-100'}`}>
                      <MessageSquare className={`w-8 h-8 ${location === '/chat' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className="text-[11px] text-gray-600">Chat</span>
                  </div>
                </Link>
              )}
            </>
          )}
          {userRole === 'ambregulatorio' && (
            <Link href="/dashboard">
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${location === '/dashboard' ? 'bg-[#92dc49]' : 'hover:bg-gray-100'}`}>
                  <Home className={`w-8 h-8 ${location === '/dashboard' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className="text-[11px] text-gray-600">Home</span>
              </div>
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {userRole !== 'gerencial' && userRole !== 'juridico' ? (
            <>
              <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300">
                <Headphones className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300">
                <Megaphone className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300">
                <Settings className="w-4 h-4 text-gray-700" />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              <div className="bg-gray-100 rounded-lg p-2 w-10 h-10 mx-auto flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <Settings className="w-5 h-5 text-gray-700" />
              </div>
              <Link href="/">
                <div className="bg-white border rounded-lg p-2 w-10 h-10 mx-auto flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <LogOut className="w-5 h-5 text-gray-700" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {userRole !== 'gerencial' && userRole !== 'juridico' && !location.startsWith('/aprender') && (
        <div className="flex-1 flex flex-col justify-between py-6 px-4 bg-white w-[248px]">
          <div className="flex flex-col gap-6">
            <button className="flex items-center justify-between bg-gray-100 border border-black rounded-full px-3 py-1.5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Faça uma pesquisa...</span>
              </div>
              <span className="bg-gray-300 rounded-full px-2 py-0.5 text-xs">⌘ + K</span>
            </button>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Análise</span>
              <div className="flex flex-col gap-1">
                {filteredMenuItems.analise.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${location === item.path ? 'bg-[#e8f5e0]' : 'hover:bg-gray-100'
                      }`}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-base">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Ferramentas</span>
              <div className="flex flex-col gap-1">
                {filteredMenuItems.ferramentas.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${location === item.path ? 'bg-[#e8f5e0]' : 'hover:bg-gray-100'
                      }`}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-base">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-3xl p-2">
            <div className="w-7 h-7 rounded-full bg-[#c8ff93] flex items-center justify-center">
              <User className="w-4 h-4 text-gray-700" />
            </div>
            <span className="text-[11px] font-medium flex-1">{roleNames[userRole] || 'Usuário'}</span>
            <Link href="/">
              <LogOut className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
