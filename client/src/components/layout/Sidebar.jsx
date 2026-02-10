import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
  FilePlus
} from "lucide-react";

const menuItems = {
  analise: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ['gerente', 'analista'] },
    { icon: Columns3, label: "Pipeline", path: "/pipeline", roles: ['gerente', 'analista'] },
    { icon: Briefcase, label: "Propostas", path: "/propostas", roles: ['cliente', 'projetista'] },
  ],
  ferramentas: [
    { icon: FilePlus, label: "Cadastro de Proposta", path: "/cadastro-proposta", roles: ['cliente', 'projetista'] },
    { icon: Calculator, label: "Simulador", path: "/simulador", roles: ['cliente', 'projetista', 'gerente', 'analista'] },
    { icon: User, label: "Análise de Perfil", path: "/perfil", roles: ['gerente', 'analista'] },
    { icon: FileText, label: "Documentação", path: "/documentacao", roles: ['cliente', 'projetista', 'gerente', 'analista'] },
    { icon: History, label: "Histórico", path: "/historico", roles: ['cliente', 'projetista', 'gerente', 'analista'] },
  ]
};

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { data: user } = useQuery({ queryKey: ["/api/auth/me"] });
  const userRole = user?.role || 'cliente';

  const roleNames = {
    gerente: 'Gerente de Contas',
    analista: 'Analista',
    projetista: 'Projetista',
    cliente: 'Cliente'
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      queryClient.clear();
      setLocation("/");
    } catch (e) {
      setLocation("/");
    }
  };

  const filteredMenuItems = {
    analise: menuItems.analise.filter(item => item.roles.includes(userRole)),
    ferramentas: menuItems.ferramentas.filter(item => item.roles.includes(userRole))
  };

  const isClienteOrProjetista = userRole === 'cliente' || userRole === 'projetista';
  const displayName = isClienteOrProjetista ? 'Usuário' : (user?.fullName || roleNames[userRole] || 'Usuario');

  return (
    <div className="flex h-full overflow-hidden rounded-2xl shadow-lg bg-white">
      <div className="w-[72px] border-r border-gray-200 flex flex-col items-center justify-between py-6 px-2 bg-white">
        <div className="flex flex-col gap-4 items-center">
          {userRole !== 'ambregulatorio' && (
            <>
              <Link href="/dashboard">
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${location === '/' || location === '/dashboard' ? 'bg-[#92dc49]' : 'hover:bg-gray-100'}`}>
                    <Home className={`w-8 h-8 ${location === '/' || location === '/dashboard' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-[11px] text-gray-600">Home</span>
                </div>
              </Link>
              <Link href="/chat">
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${location === '/chat' ? 'bg-[#92dc49]' : 'hover:bg-gray-100'}`}>
                    <MessageSquare className={`w-8 h-8 ${location === '/chat' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-[11px] text-gray-600">Chat</span>
                </div>
              </Link>
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
          <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300">
            <Headphones className="w-4 h-4 text-gray-700" />
          </div>
          <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300">
            <Megaphone className="w-4 h-4 text-gray-700" />
          </div>
          <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300">
            <Settings className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-6 px-4 bg-white w-[248px]">
        <div className="flex flex-col gap-6">
          <button className="flex items-center justify-between bg-gray-100 border border-black rounded-full px-3 py-1.5 text-sm text-gray-500" data-testid="button-search">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Faca uma pesquisa...</span>
            </div>
            <span className="bg-gray-300 rounded-full px-2 py-0.5 text-xs">Cmd + K</span>
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-900">Analise</span>
            <div className="flex flex-col gap-1">
              {filteredMenuItems.analise.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${location === item.path ? 'bg-[#e8f5e0]' : 'hover:bg-gray-100'
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
                  <div
                    data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${location === item.path ? 'bg-[#e8f5e0]' : 'hover:bg-gray-100'
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
          <span className="text-[11px] font-medium flex-1 truncate" data-testid="text-user-name">{displayName}</span>
          <button onClick={handleLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
