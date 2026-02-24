import { Link, useLocation } from "wouter";
import { Bell, User, LogOut } from "lucide-react";

export function ClientHeader() {
    const [location] = useLocation();

    const navItems = [
        { label: "Propostas", path: "/propostas" },
        { label: "Simulador", path: "/simulador" },
        { label: "Pagamentos", path: "/pagamentos" },
    ];

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
                <div className="flex items-center gap-3">
                    <button className="relative p-2 bg-[#fbe7e8] rounded-full text-red-500 hover:bg-red-100 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                            1
                        </span>
                    </button>

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
