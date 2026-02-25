import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Repeat } from "lucide-react";

export function ProfileSwitcher() {
    const currentRole = localStorage.getItem('userRole') || 'gerente';

    const handleRoleChange = (newRole) => {
        localStorage.setItem('userRole', newRole);
        // Set a quick target redirect based on the role to match login flow
        let redirectPath = "/dashboard";
        if (newRole === 'cliente') {
            redirectPath = "/propostas";
        } else if (newRole === 'posvenda') {
            redirectPath = "/cobranca";
        }

        // Attempt to redirect if we aren't already on the designated landing page
        if (window.location.pathname !== redirectPath) {
            window.location.href = redirectPath;
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="fixed top-2 right-8 z-[100] flex items-center bg-white rounded-full shadow border border-gray-200 pr-2 pl-1 py-1 transition-all hover:shadow-md scale-90 origin-top-right">
            <div className="w-8 h-8 flex items-center justify-center bg-[#f0f4f1] rounded-full mr-2">
                <Repeat className="w-4 h-4 text-green-700" />
            </div>
            <Select value={currentRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 w-[180px] bg-transparent text-sm font-medium text-gray-700 h-8 p-0">
                    <SelectValue placeholder="Trocar Perfil" />
                </SelectTrigger>
                <SelectContent className="z-[101]">
                    <SelectItem value="gerente">Gerente de Contas</SelectItem>
                    <SelectItem value="analista">Analista</SelectItem>
                    <SelectItem value="projetista">Projetista</SelectItem>
                    <SelectItem value="ambregulatorio">Ambiente Regulatório</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="posvenda">Pós Venda</SelectItem>
                    <SelectItem value="gerencial">Gerencial</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
