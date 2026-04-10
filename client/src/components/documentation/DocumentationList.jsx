import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Folder, Clock, User, AlertTriangle, ChevronDown } from "lucide-react";

export function DocumentationList({ onSelectClient }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const proposals = JSON.parse(localStorage.getItem("proposals") || "[]");
        const derived = proposals.map(p => ({
            id: p.id,
            name: p.name || p.companyName || "Proposta " + p.id,
            date: p.createdAt ? new Date(p.createdAt).toLocaleString("pt-BR") : new Date().toLocaleString("pt-BR"),
            user: p.analystId || "Ronaldo",
            hasAlert: false,
        }));
        setClients(derived);
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Buscar proposta..."
                        className="pl-10 bg-white rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClients.map((client) => (
                    <Card
                        key={client.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white"
                        onClick={() => onSelectClient(client)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 font-semibold text-gray-800">
                                <Folder className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <span className="break-words">{client.name}</span>
                            </div>
                            {client.hasAlert && (
                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{client.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{client.user}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <p className="text-sm text-gray-400">
                Mostrando {filteredClients.length} de {clients.length} resultados
            </p>
        </div>
    );
}
