import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Bell, User, LogOut, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export function ClientHeader() {
    const [location] = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    const navItems = [
        { label: "Propostas", path: "/propostas" },
        { label: "Simulador", path: "/simulador" },
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
        <div className="w-full flex justify-center pt-6 px-6">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm px-6 py-3 flex items-center justify-between">
                {/* Navigation */}
                <div className="flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = location === item.path || (location.startsWith('/propostas') && item.path === '/propostas');
                        const content = (
                            <span
                                className={`text-sm font-medium cursor-pointer transition-colors px-3 py-1.5 rounded-full ${isActive
                                    ? "bg-[#cceebd] text-gray-900"
                                    : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                {item.label}
                            </span>
                        );
                        // If it's already active on propostas, let's use an anchor tag to force a top-level unmount/remount in wouter 
                        // or just simple reload. To be safe with wouter, clicking a link to the current path doesn't do much. 
                        // The user wants clicking 'Propostas' to go back.
                        return item.path === '/propostas' ? (
                            <a key={item.path} href={item.path} onClick={() => window.location.href = item.path}>
                                {content}
                            </a>
                        ) : (
                            <Link key={item.path} href={item.path}>
                                {content}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 relative">
                    <div ref={notifRef}>
                        <button
                            className="relative p-2 bg-[#fbe7e8] rounded-full text-red-500 hover:bg-red-100 transition-colors"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-[1.5px] border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-14 w-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 ease-out origin-top-right">
                                <div className="flex flex-col">
                                    {notifications.map((notif, index) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${index !== notifications.length - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            {getNotifIcon(notif.type)}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <p className="font-semibold text-gray-900 text-[14px]">{notif.title}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-gray-500 text-[13px] truncate">{notif.subtitle}</p>
                                                    <p className="text-gray-400 text-[12px] whitespace-nowrap ml-4">{notif.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <Link href="/">
                            <LogOut className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
