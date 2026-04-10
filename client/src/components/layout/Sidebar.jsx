import { useState } from "react";
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
  GraduationCap,
  ChevronLeft
} from "lucide-react";

const menuItems = {
  analise: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Columns3, label: "Pipeline", path: "/pipeline" },
    { icon: User, label: "Clientes", path: "/clientes" },
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

function isActivePath(location, path) {
  if (path === '/dashboard') return location === '/' || location === '/dashboard';
  if (path === '/propostas') return location.startsWith('/propostas');
  return location === path || location.startsWith(path + '/');
}

const iconRailWidth = 72;
const menuPanelWidth = 232;

export function Sidebar() {
  const [location] = useLocation();
  const userRole = localStorage.getItem('userRole') || 'gerente';
  const [expanded, setExpanded] = useState(false);

  const roleNames = {
    gerente: 'Gerente de Contas',
    analista: 'Analista',
    projetista: 'Projetista',
    posvenda: 'Pós Venda',
    gerencial: 'Gerencial',
    juridico: 'Jurídico'
  };

  const getHomeLink = () => {
    if (userRole === 'posvenda') return '/cobranca';
    if (userRole === 'analista') return '/carteira';
    if (userRole === 'juridico') return '/propostas';
    if (userRole === 'cliente') return '/propostas';
    if (userRole === 'projetista') return '/pipeline';
    return '/dashboard';
  };

  const filteredMenuItems = {
    analise: menuItems.analise.filter(item => {
      if (userRole === 'ambregulatorio' || userRole === 'gerencial') return item.label === 'Dashboard';
      if (userRole === 'posvenda') return item.label === 'Cobrança' || item.label === 'Seguros';
      if (item.label === "Carteira") return userRole === 'analista' || userRole === 'projetista';
      if (item.label === "Propostas") return userRole === 'gerente';
      if (item.label === "Cobrança" || item.label === "Seguros") return false;
      if (item.label === "Canais" || item.label === "Visitas") return userRole === 'gerente';
      return true;
    }),
    ferramentas: menuItems.ferramentas.filter(item => {
      if (userRole === 'ambregulatorio' || userRole === 'posvenda' || userRole === 'gerencial') return false;
      if (item.label === "Cadastro de Proposta") return userRole === 'projetista' || userRole === 'gerente';
      if (item.label === "Simulador" && userRole === 'analista') return false;
      return true;
    })
  };

  const totalWidth = iconRailWidth + (expanded ? menuPanelWidth : 0);

  return (
    <div
      className="flex h-full overflow-hidden rounded-2xl shadow-lg bg-white relative"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ width: `${totalWidth}px`, transition: 'width 0.25s ease' }}
    >
      {/* ── Icon Rail (always visible, 72px) ── */}
      <div className="w-[72px] flex-shrink-0 border-r border-gray-200 flex flex-col items-center justify-between py-6 px-2 bg-white">
        <div className="flex flex-col gap-4 items-center w-full">

          {/* Home */}
          <Link href={getHomeLink()}>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${
                isActivePath(location, getHomeLink()) ? 'bg-[#92dc49]' : 'hover:bg-gray-100'
              }`}>
                <Home className={`w-8 h-8 ${isActivePath(location, getHomeLink()) ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className="text-[11px] text-gray-600 whitespace-nowrap">Home</span>
            </div>
          </Link>

          {/* Aprender */}
          {userRole === 'projetista' && (
            <Link href="/aprender">
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${
                  location.startsWith('/aprender') ? 'bg-[#92dc49]' : 'hover:bg-gray-100'
                }`}>
                  <GraduationCap className={`w-8 h-8 ${location.startsWith('/aprender') ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className="text-[11px] text-gray-600 whitespace-nowrap">Aprender</span>
              </div>
            </Link>
          )}

          {/* Chat */}
          <Link href="/chat">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className={`rounded-2xl p-2 w-full flex justify-center transition-colors ${
                location === '/chat' ? 'bg-[#92dc49]' : 'hover:bg-gray-100'
              }`}>
                <MessageSquare className={`w-8 h-8 ${location === '/chat' ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className="text-[11px] text-gray-600 whitespace-nowrap">Chat</span>
            </div>
          </Link>
        </div>

        {/* Bottom action icons */}
        <div className="flex flex-col gap-2">
          {userRole !== 'gerencial' && userRole !== 'juridico' ? (
            <>
              <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300" title="Suporte">
                <Headphones className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300" title="Notificações">
                <Megaphone className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-300" title="Configurações">
                <Settings className="w-4 h-4 text-gray-700" />
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-100 rounded-lg p-2 w-10 h-10 mx-auto flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <Settings className="w-5 h-5 text-gray-700" />
              </div>
              <Link href="/">
                <div className="bg-white border rounded-lg p-2 w-10 h-10 mx-auto flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <LogOut className="w-5 h-5 text-gray-700" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Menu Panel (animated) ── */}
      <div
        className="flex flex-col justify-between py-6 px-4 bg-white overflow-y-auto"
        style={{
          width: `${menuPanelWidth}px`,
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col gap-6">

          {/* Search bar */}
          <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-full px-3 py-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="truncate">Faça uma pesquisa...</span>
            </div>
          </div>

          {/* Análise */}
          {filteredMenuItems.analise.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Análise</span>
              <div className="flex flex-col gap-1">
                {filteredMenuItems.analise.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${
                      isActivePath(location, item.path) ? 'bg-[#e8f5e0]' : 'hover:bg-gray-100'
                    }`}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-base truncate">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ferramentas */}
          {filteredMenuItems.ferramentas.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-900">Ferramentas</span>
              <div className="flex flex-col gap-1">
                {filteredMenuItems.ferramentas.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${
                      isActivePath(location, item.path) ? 'bg-[#e8f5e0]' : 'hover:bg-gray-100'
                    }`}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-base truncate">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User pill */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-3xl p-2">
          <div className="w-7 h-7 rounded-full bg-[#c8ff93] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-700" />
          </div>
          <span className="text-[11px] font-medium flex-1 truncate">{roleNames[userRole] || 'Usuário'}</span>
          <Link href="/">
            <LogOut className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 flex-shrink-0" />
          </Link>
        </div>
      </div>

      {/* Collapse arrow */}
      <div
        className="absolute top-6 flex items-center justify-center cursor-pointer z-10 group"
        style={{ left: `${expanded ? menuPanelWidth : 0}px`, transition: 'left 0.25s ease' }}
      >
        <button
          className="w-5 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          <ChevronLeft className="w-3 h-3 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
