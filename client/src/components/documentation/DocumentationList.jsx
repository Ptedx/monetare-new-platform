import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Folder, Clock, User, AlertTriangle, ChevronDown } from "lucide-react";

const mockClients = [
    { id: 1, name: "Fernando Fagundes", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: true },
    { id: 2, name: "Colheita Alegre", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 3, name: "Faz. Água Límpida", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 4, name: "Cláudio & Ronaldo Agro", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 5, name: "Atlântida Farm", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 6, name: "Faz. Vale do Cedro", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 7, name: "Faz. Barra Funda", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 8, name: "Cerano", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 9, name: "Fernando & CIA", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 10, name: "Souza&Santos Agro", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 11, name: "TerraFina", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 12, name: "Ouro de Prata", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 13, name: "Canto das Águas", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 14, name: "Faz. Sr. Sereno", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 15, name: "Faz. Pleiades", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 16, name: "Faz. Híades", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
    { id: 17, name: "Ceres Agro", date: "12/11/25 18:20", user: "Ronaldo", hasAlert: false },
];

export function DocumentationList({ onSelectClient }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = mockClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Data de adição" // Placeholder matching image design hint, though functionalities as search
                        className="pl-10 bg-white rounded-full"
                        readOnly // Based on image it looks like a dropdown or strict filter, keeping simple for now
                    />
                    <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
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
                Mostrando {filteredClients.length} de {mockClients.length} resultados
            </p>
        </div>
    );
}
