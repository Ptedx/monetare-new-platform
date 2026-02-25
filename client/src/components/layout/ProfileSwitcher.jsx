import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Repeat, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export function ProfileSwitcher() {
    const [, setLocation] = useLocation();
    const [currentRole, setCurrentRole] = useState(localStorage.getItem('userRole') || 'gerente');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentRole(localStorage.getItem('userRole') || 'gerente');
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleRoleChange = (newRole) => {
        setIsLoading(true);
        setCurrentRole(newRole);
        localStorage.setItem('userRole', newRole);
        // Dispatch an event so other components (like Sidebar) can detect the change
        window.dispatchEvent(new Event('storage'));


        // Set a quick target redirect based on the role to match login flow
        let redirectPath = "/dashboard";
        if (newRole === 'cliente') {
            redirectPath = "/propostas";
        } else if (newRole === 'posvenda') {
            redirectPath = "/cobranca";
        } else if (newRole === 'juridico') {
            redirectPath = "/propostas";
        }

        // Use wouter for navigation
        setLocation(redirectPath);

        // Force a small reload if already on the path to ensure components that don't listen to 'storage' update
        if (window.location.pathname === redirectPath) {
            window.location.reload();
        } else {
            // Artificial delay to show the spinner briefly if the route transition is too fast
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    return (
        <div className="fixed top-2 right-8 z-[100] flex items-center bg-white rounded-full shadow border border-gray-200 pr-2 pl-1 py-1 transition-all hover:shadow-md scale-90 origin-top-right">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-2 ${isLoading ? 'bg-green-100' : 'bg-[#f0f4f1]'}`}>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 text-green-700 animate-spin" />
                ) : (
                    <Repeat className="w-4 h-4 text-green-700" />
                )}
            </div>
            <Select value={currentRole} onValueChange={handleRoleChange} disabled={isLoading}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 w-[180px] bg-transparent text-sm font-medium text-gray-700 h-8 p-0 disabled:opacity-50">
                    <SelectValue placeholder="Trocar Perfil">
                        {isLoading ? "Trocando perfil..." : undefined}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[101]">
                    <SelectItem value="gerente">Gerente de Contas</SelectItem>
                    <SelectItem value="analista">Analista</SelectItem>
                    <SelectItem value="projetista">Projetista</SelectItem>
                    <SelectItem value="ambregulatorio">Ambiente Regulatório</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="posvenda">Pós Venda</SelectItem>
                    <SelectItem value="gerencial">Gerencial</SelectItem>
                    <SelectItem value="juridico">Jurídico</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
