import { useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

// Simulated Data
const tutoriais = [
    {
        id: 1,
        title: "Criação da Carta Consulta",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Subindo propostas agro",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Subindo propostas corporate",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Subindo propostas varejo",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Dicas FNO",
        category: "Dicas",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Normas para FDA",
        category: "Normativo",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "Como qualificar um cliente",
        category: "Atendimento",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "Tudo sobre simulação",
        category: "Atendimento",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=600&auto=format&fit=crop"
    }
];

export function Aprender() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTutorials = tutoriais.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="w-full h-full p-10 lg:p-16 overflow-y-auto">

                {/* Header Setup */}
                <div className="flex flex-col items-center max-w-2xl mx-auto mb-20 mt-10">
                    <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-8">
                        Busque um material
                    </h1>
                    <div className="relative w-full max-w-[500px]">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Pesquisar materiais..."
                            className="w-full bg-[#f4f5f7] border-none rounded-full h-12 pl-12 pr-4 text-[15px] focus-visible:ring-1 focus-visible:ring-gray-300 placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* Categories Section */}
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-[22px] font-semibold text-gray-900 tracking-tight mb-8">
                        Educacional e normativos
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTutorials.map((tutorial) => (
                            <Link key={tutorial.id} href={`/aprender/${tutorial.id}`}>
                                <Card className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer group flex flex-col h-full bg-white">
                                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                                        <img
                                            src={tutorial.img}
                                            alt={tutorial.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Gradient Fade to blend the image into the white card beautifully */}
                                        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1 pb-4">
                                        <h3 className="font-semibold text-gray-900 leading-snug text-[14px] mb-6 line-clamp-2">
                                            {tutorial.title}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                            <span>{tutorial.category}</span>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                                                <span>{tutorial.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {filteredTutorials.length === 0 && (
                        <div className="text-center text-gray-400 py-10">
                            Nenhum material encontrado.
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
}
