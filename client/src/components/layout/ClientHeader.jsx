import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Bell, User, LogOut, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export function ClientHeader() {
    const [location] = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);
    const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

    const navItems = [
        { label: "Início", path: "/propostas" },
        { label: "Produtos", path: "/produtos" },
        { label: "Solicitação", path: "/solicitacao-proposta" },
        { label: "Pagamentos", path: "/pagamentos" },
    ];

    const notifications = [
        { id: 1, title: "Prestação vencida.", subtitle: "Custeio Agro - id78f094vf", date: "15/02/2026 - 15:30", type: "error" },
        { id: 2, title: "Faltam 5 dias para o vencimento da sua prestação.", subtitle: "Custeio Agro - id78f094vf", date: "10/02/2026 - 15:30", type: "warning" },
        { id: 3, title: "Faltam 10 dias para o vencimento da sua prestação.", subtitle: "Custeio Agro - id78f094vf", date: "31/01/2026 - 15:30", type: "warning" },
        { id: 4, title: "Contrato finalizado.", subtitle: "Custeio Agro - id78f094vf", date: "31/01/2026 - 15:30", type: "success" },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getNotifIcon = (type) => {
        switch (type) {
            case 'error': return <div className="p-2 border border-red-200 bg-red-50 rounded-xl text-red-500"><AlertCircle className="w-5 h-5" /></div>;
            case 'warning': return <div className="p-2 border border-yellow-200 bg-yellow-50 rounded-xl text-yellow-500"><Clock className="w-5 h-5" /></div>;
            case 'success': return <div className="p-2 border border-green-200 bg-green-50 rounded-xl text-green-500"><CheckCircle2 className="w-5 h-5" /></div>;
            default: return null;
        }
    };

    return (
        <header className="w-full h-20 bg-white shadow-sm flex items-center px-6 md:px-12 fixed top-0 left-0 z-[60] border-b border-gray-100">
            {/* Logo */}
            <div className="flex-shrink-0">
                <Link href="/propostas">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-[#92dc49] rounded-lg rotate-12 flex items-center justify-center shadow-lg shadow-[#92dc49]/20">
                            <span className="text-white font-bold text-xl -rotate-12 italic">A</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation (Centered) */}
            <nav className="flex-1 flex justify-center items-center gap-8">
                {navItems.map((item) => {
                    const isActive = location === item.path || (location.startsWith('/propostas') && item.path === '/propostas');
                    return (
                        <Link key={item.path} href={item.path}>
                            <span
                                className={`text-sm font-medium cursor-pointer transition-all ${isActive
                                    ? "text-gray-900 after:content-[''] after:block after:w-1 after:h-1 after:bg-[#92dc49] after:rounded-full after:mx-auto after:mt-1 font-bold"
                                    : "text-gray-400 hover:text-gray-900"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-4 relative">
                <div ref={notifRef} className="relative">
                    <button
                        className="p-2.5 bg-[#fbe7e8] rounded-2xl text-red-500 hover:bg-red-100 transition-all active:scale-95"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-14 w-[450px] bg-white rounded-[32px] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 ease-out origin-top-right p-2">
                            <div className="flex flex-col gap-1">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="p-5 rounded-3xl flex gap-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
                                    >
                                        <div className="transition-transform group-hover:scale-105">
                                            {getNotifIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="font-bold text-gray-900 text-[15px]">{notif.title}</p>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <p className="text-gray-400 text-[13px] font-medium truncate">{notif.subtitle}</p>
                                                <p className="text-gray-400 text-[11px] font-medium whitespace-nowrap ml-4 uppercase tracking-wider">{notif.date.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/meu-perfil">
                    <div className="flex items-center gap-3 p-1 pl-1 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-100/50 transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white">
                            <img
                                src="https://i.pravatar.cc/150?u=diego"
                                alt="User"
                                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    );
}
