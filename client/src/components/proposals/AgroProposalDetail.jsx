import { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, ArrowLeft, Building2, Users, Hash, MoreHorizontal,
    Send, AlertTriangle, AlertCircle, XCircle, CheckCircle2, Download, Eye, FileText, Search,
    ChevronDown, Filter, FileBox, Sprout, Tractor, Timer, TrendingUp, Droplets,
    Thermometer, Ruler, Gavel, Scale
} from "lucide-react";
import { RatingCard, DetailItem, StatCard, StatusBadge, ScoreCircle, TimelineStep } from "./ProposalHelpers";

const proposalTabs = [
    "Resumo", "Assinaturas", "Perfil", "Projeto", "Linha do tempo",
    "Documentação", "Garantias", "Pendências", "Auditoria"
];

export function AgroProposalDetail({ proposal, onBack }) {
    const [activeTab, setActiveTab] = useState("Resumo");
    const [showReport, setShowReport] = useState(false);
    const [showDocAnalysis, setShowDocAnalysis] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('Matrícula');

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Analise_Risco_Fernando_Fagundes.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Download iniciado (simulação).");
    };

    // Mock Data (Agro Specific)
    const signaturesData = [
        { name: "Parecer técnico", analyst: "Daniel Alves", completed: 2, total: 3, status: "PENDENTE", msg: "Sua assinatura está pendente." },
        { name: "Parecer de análise", analyst: "Daniel Alves", completed: 3, total: 3, status: "OK", msg: "" },
    ];

    const documentsData = [
        { name: "Matrícula", emission: "02/11/2025", valid: "20/11/2025", status: "A VENCER" },
        { name: "Projeto", emission: "02/11/2025", valid: "12/11/2025", status: "VENCIDO" },
        { name: "IRPF 2024", emission: "02/11/2025", valid: "31/12/2025", status: "OK" },
        { name: "Registro", emission: "02/11/2025", valid: "30/11/2025", status: "OK" },
        { name: "IRPF 2025", emission: "02/11/2025", valid: "31/12/2026", status: "OK" },
        { name: "Simulação", emission: "01/11/2025", valid: "31/12/2026", status: "OK" },
    ];

    const guaranteesData = {
        rural: [{ name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }, { name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }],
        urban: [{ name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }, { name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }],
        machine: [{ name: "Nome/Descrição", cpf: "********", matricula: "********" }]
    };

    const auditData = [
        { date: "16/11/25", responsible: "Projetista", event: "stage_created", details: "Técnica → Crédito" },
        { date: "16/11/25", responsible: "Projetista", event: "pendencia_created", details: "Solicitado CAR" },
    ];

    const pendenciesData = [
        { date: "16/11/25", description: "Enviar CAR atualizado", responsible: "Projetista", deadline: "20/11/25", status: "ABERTA" },
        { date: "16/11/25", description: "Atualizar matrícula", responsible: "Projetista", deadline: "20/11/25", status: "ABERTA" },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">{proposal?.name || "Fernando Fagundes"}</h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full px-6 border-gray-300 text-gray-600 hover:bg-gray-50">
                        Ações
                        <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    <Button className="rounded-full px-6 bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 shadow-lg shadow-green-100">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar para comitê
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start mb-8 bg-transparent p-0 border-b border-gray-200">
                    {proposalTabs.map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className={`
                                rounded-none border-b-2 border-transparent px-6 py-3 text-gray-500
                                data-[state=active]:border-[#92dc49] data-[state=active]:text-gray-900 data-[state=active]:font-semibold data-[state=active]:bg-transparent
                                hover:text-gray-700 transition-colors
                            `}
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="Resumo" className="mt-0">
                    <div className="space-y-6">
                        <Card className="p-6 border-gray-100 shadow-md">
                            <h3 className="text-xl font-bold mb-6 text-gray-900">Dados Cadastrais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-4">
                                    <DetailItem icon={Building2} label="Empresa" value={proposal?.name || "Fernando Fagundes"} />
                                    <DetailItem icon={Building2} label="Indústria" value="Agronomia" />
                                </div>
                                <div className="space-y-4">
                                    <DetailItem icon={Users} label="Tamanho" value="500-1000 funcionários" />
                                    <DetailItem icon={Hash} label="Faturamento" value="R$ 300.000.000 / ano" />
                                </div>
                                <div className="space-y-4">
                                    <DetailItem icon={User} label="Cliente" value="Fernando Fagundes" />
                                    <DetailItem icon={Hash} label="CPF" value="000.000.000-00" />
                                </div>
                                <div className="space-y-4">
                                    <DetailItem icon={Mail} label="E-mail" value="fernando@fffagundes.com.br" />
                                    <DetailItem icon={Phone} label="Telefone" value="(00) 000000-0000" />
                                </div>
                                <div className="col-span-full border-t border-gray-100 mt-2 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <DetailItem icon={MapPin} label="Endereço" value="Residencial Cláudio Marchetti, Rua Três – Cuiabá, MT 78076-308" />
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400">Limite atual</p>
                                            <p className="text-sm font-medium text-gray-900">R$ 000.000.000,00</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400">Rating Interno</p>
                                            <p className="text-sm font-medium text-gray-900">0.5%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Tabs defaultValue="Plantio" className="w-full">
                            <div className="flex items-center gap-4 mb-6">
                                <TabsList className="bg-transparent p-0 border-b border-gray-200 w-auto justify-start h-auto">
                                    <TabsTrigger
                                        value="Plantio"
                                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#92dc49] data-[state=active]:text-[#92dc49] data-[state=active]:shadow-none rounded-none px-4 py-2 text-gray-400 font-semibold text-sm gap-2"
                                    >
                                        <Sprout className="w-4 h-4" />
                                        Plantio
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Pecuária"
                                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#92dc49] data-[state=active]:text-[#92dc49] data-[state=active]:shadow-none rounded-none px-4 py-2 text-gray-400 font-semibold text-sm gap-2"
                                    >
                                        <Tractor className="w-4 h-4" />
                                        Pecuária
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="Plantio" className="mt-0 space-y-6">
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Left Main Column */}
                                    <div className="col-span-12 lg:col-span-8 space-y-6">
                                        {/* DRE Section */}
                                        <Card className="p-6 border-gray-100 shadow-sm">
                                            <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">DRE (Últimos 3 anos)</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent border-none text-[10px] text-gray-400 uppercase">
                                                        <TableHead className="pl-0">Ano</TableHead>
                                                        <TableHead>Receita Bruta (R$)</TableHead>
                                                        <TableHead>Resultado Operacional (R$)</TableHead>
                                                        <TableHead>Margem Líquida</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {[
                                                        { year: 2023, receita: "32.000.000", result: "6.400.000", margin: 20 },
                                                        { year: 2024, receita: "34.500.000", result: "7.245.000", margin: 21 },
                                                        { year: 2025, receita: "36.800.000", result: "7.360.000", margin: 20 },
                                                    ].map((item, i) => (
                                                        <TableRow key={i} className="border-none hover:bg-gray-50">
                                                            <TableCell className="font-bold text-gray-900 pl-0 py-2">{item.year}</TableCell>
                                                            <TableCell className="text-gray-600 py-2">{item.receita}</TableCell>
                                                            <TableCell className="text-gray-600 py-2">{item.result}</TableCell>
                                                            <TableCell className="py-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-gray-700 w-10">{item.margin},0%</span>
                                                                    <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-[#92dc49]" style={{ width: `${item.margin * 2.5}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Card>

                                        {/* Capacidade e Mapa */}
                                        <Card className="p-6 border-gray-100 shadow-sm">
                                            <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">Capacidade produtiva</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                                {/* Map Side */}
                                                <div className="space-y-4">
                                                    <div className="w-full h-[220px] bg-slate-100 rounded-lg overflow-hidden relative group">
                                                        <img src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/36555/24855" alt="Satellite Map" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />

                                                        {/* Mock Overlay Polygons (CSS placeholders) */}
                                                        <div className="absolute top-[20%] left-[30%] w-[30%] h-[40%] border-2 border-yellow-400 bg-yellow-400/20 rounded-md transform rotate-12"></div>
                                                        <div className="absolute top-[50%] left-[50%] w-[25%] h-[35%] border-2 border-blue-400 bg-blue-400/20 rounded-md transform -rotate-6"></div>
                                                        <div className="absolute top-[30%] left-[60%] w-[20%] h-[30%] border-2 border-green-400 bg-green-400/20 rounded-md"></div>

                                                        <div className="absolute top-2 right-2 bg-white/90 p-1 rounded shadow-sm">
                                                            <MapPin className="w-3 h-3 text-gray-600" />
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] text-gray-400 hover:text-[#92dc49] transition-colors flex items-center gap-1">
                                                        Exportar shapefile <ArrowLeft className="w-3 h-3 rotate-[135deg]" />
                                                    </button>
                                                </div>

                                                {/* Stats Side */}
                                                <div>
                                                    <div className="mb-6">
                                                        <p className="text-[10px] text-gray-400 uppercase mb-2">Área e uso da terra</p>
                                                        <div className="flex gap-4">
                                                            <div className="p-3 bg-gray-50 rounded border border-gray-100 flex-1">
                                                                <p className="text-[9px] text-gray-400 uppercase mb-1">Área Total</p>
                                                                <p className="text-lg font-bold text-gray-900">3.200 ha</p>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded border border-gray-100 flex-1">
                                                                <p className="text-[9px] text-gray-400 uppercase mb-1">Área produtiva</p>
                                                                <p className="text-lg font-bold text-gray-900">2.400 ha</p>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded border border-gray-100 flex-1">
                                                                <p className="text-[9px] text-gray-400 uppercase mb-1">Reserva Legal</p>
                                                                <p className="text-lg font-bold text-gray-900">800 ha</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4 mt-2">
                                                            <div className="p-3 bg-gray-50 rounded border border-gray-100 flex-1">
                                                                <p className="text-[9px] text-gray-400 uppercase mb-1">Situação fundiária</p>
                                                                <p className="text-lg font-bold text-gray-900">100% <span className="text-xs font-normal text-gray-500">próprio</span></p>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded border border-gray-100 flex-1">
                                                                <p className="text-[9px] text-gray-400 uppercase mb-1">CAR</p>
                                                                <p className="text-lg font-bold text-gray-900">Regular</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Table>
                                                        <TableHeader><TableRow className="border-none text-[9px] text-gray-400 uppercase hover:bg-transparent"><TableHead className="pl-0 h-6">Cultura</TableHead><TableHead className="h-6">Área (ha)</TableHead><TableHead className="h-6">Margem</TableHead><TableHead className="h-6">Prod. projetada</TableHead><TableHead className="h-6 text-right">Prod. estimada</TableHead></TableRow></TableHeader>
                                                        <TableBody>
                                                            {[
                                                                { name: "Soja", color: "bg-yellow-400", area: 1400, margin: "24%", proj: "60 sc/ha", est: "84.000 sc" },
                                                                { name: "Milho", color: "bg-blue-600", area: 700, margin: "18%", proj: "90 sc/ha", est: "63.000 sc" },
                                                                { name: "Algodão", color: "bg-cyan-400", area: 200, margin: "26%", proj: "280 @/ha", est: "56.000 @" },
                                                                { name: "Café", color: "bg-orange-600", area: 100, margin: "22%", proj: "-", est: "-" },
                                                            ].map((c, i) => (
                                                                <TableRow key={i} className="border-none hover:bg-transparent text-[11px]">
                                                                    <TableCell className="pl-0 py-1 font-medium"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${c.color}`}></div>{c.name}</div></TableCell>
                                                                    <TableCell className="py-1">{c.area}</TableCell>
                                                                    <TableCell className="py-1">{c.margin}</TableCell>
                                                                    <TableCell className="py-1 text-gray-500">{c.proj}</TableCell>
                                                                    <TableCell className="py-1 text-right font-medium">{c.est}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Solo and Hídrica Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="p-6 border-gray-100 shadow-sm">
                                                <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">Solo</h3>

                                                <div className="mb-5">
                                                    <p className="text-[10px] text-gray-400 uppercase mb-2">Tipo e Topografia</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className="bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 text-[10px] font-bold">Solo argiloso</Badge>
                                                        <Badge variant="outline" className="text-[10px] font-medium text-gray-600 bg-white">Área apta para soja</Badge>
                                                        <Badge variant="outline" className="text-[10px] font-medium text-gray-600 bg-white flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Declive 12%</Badge>
                                                    </div>
                                                </div>

                                                <div className="mb-5">
                                                    <p className="text-[10px] text-gray-400 uppercase mb-2">Laudo Agronômico</p>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="p-2 border border-gray-100 rounded text-center">
                                                            <p className="text-[9px] text-gray-400">Nitrogênio (N)</p>
                                                            <p className="font-bold text-sm text-gray-800">Médio</p>
                                                        </div>
                                                        <div className="p-2 border border-gray-100 rounded text-center">
                                                            <p className="text-[9px] text-gray-400">Fósforo (P)</p>
                                                            <p className="font-bold text-sm text-gray-800">Alto</p>
                                                        </div>
                                                        <div className="p-2 border border-gray-100 rounded text-center">
                                                            <p className="text-[9px] text-gray-400">Potássio (K)</p>
                                                            <p className="font-bold text-sm text-gray-800">Médio</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase mb-2">Índice NPK</p>
                                                    <div className="flex justify-between items-end mb-1 px-1">
                                                        <div className="text-center">
                                                            <span className="text-xl font-bold text-gray-900 block">10</span>
                                                            <span className="text-[8px] text-gray-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Nitrogênio (N)</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-xl font-bold text-gray-900 block">20</span>
                                                            <span className="text-[8px] text-gray-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div> Fósforo (P)</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-xl font-bold text-gray-900 block">10</span>
                                                            <span className="text-[8px] text-gray-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Potássio (K)</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full flex overflow-hidden mt-3">
                                                        <div className="bg-[#92dc49] h-full w-[25%]"></div>
                                                        <div className="bg-yellow-400 h-full w-[50%]"></div>
                                                        <div className="bg-orange-400 h-full w-[25%]"></div>
                                                    </div>
                                                </div>
                                            </Card>

                                            <Card className="p-6 border-gray-100 shadow-sm flex flex-col">
                                                <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">Situação hídrica</h3>

                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Droplets className="w-4 h-4 text-blue-500" />
                                                        <p className="text-xl font-bold text-gray-900">800 mm</p>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 pl-6">No próximo semestre</p>
                                                </div>

                                                <div className="mb-2">
                                                    <p className="text-[10px] text-gray-400 uppercase mb-2">Média histórica de chuva</p>
                                                    {/* Bar Chart */}
                                                    <div className="h-28 flex items-end gap-1 border-b border-gray-200 pb-0 relative">
                                                        {/* Y-axis labels mock */}
                                                        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-300">
                                                            <span>300mm</span>
                                                            <span>150mm</span>
                                                            <span>50mm</span>
                                                        </div>

                                                        {[40, 70, 50, 48, 40, 15, 10, 10, 20, 30, 60, 80].map((h, i) => (
                                                            <div key={i} className="flex-1 flex flex-col justify-end group h-full">
                                                                <div className="bg-[#5e8b3f] opacity-80 group-hover:opacity-100 rounded-t-sm transition-all relative" style={{ height: `${h}%` }}></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between text-[8px] text-gray-400 mt-1 uppercase">
                                                        <span>jan</span><span>fev</span><span>mar</span><span>abr</span><span>mai</span><span>jun</span><span>jul</span><span>ago</span><span>set</span><span>out</span><span>nov</span><span>dez</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 mb-1">Umidade média do solo</p>
                                                        <p className="text-2xl font-bold text-gray-900">31%</p>
                                                    </div>
                                                    <div className="space-y-1 text-right">
                                                        <p className="text-[9px] text-green-600 font-bold flex items-center justify-end gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Capacidade hídrica adequada</p>
                                                        <p className="text-[9px] text-red-500 font-medium flex items-center justify-end gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Sem irrigação</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Right Side Sidebar */}
                                    <div className="col-span-12 lg:col-span-4 space-y-6">
                                        {/* Precificação Header */}
                                        <Card className="p-4 border-l-4 border-l-black bg-white shadow-sm">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Sugestão de Precificação</p>
                                            <p className="text-sm font-medium text-gray-900 leading-snug">
                                                <span className="font-bold">Risco climático médio detectado na região.</span> Motor sugere aumentar spread em 0.5% ou exigir 30% de garantia.
                                            </p>
                                        </Card>

                                        {/* Alertas & Compliance */}
                                        <Card className="p-5 border-gray-100 shadow-sm">
                                            <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">Alertas & Compliance</h3>
                                            <div className="space-y-3">
                                                <div className="p-3 bg-red-50 rounded-md border border-red-100 flex items-start gap-3">
                                                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Prodes (Desmatamento pós-2008)</p>
                                                        <p className="text-[9px] text-red-500 uppercase font-bold mt-0.5">DETECTADO — CRÍTICO</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-orange-50 rounded-md border border-orange-100 flex items-start gap-3">
                                                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Sobreposição de Reserva Legal</p>
                                                        <p className="text-[9px] text-orange-600 font-bold mt-0.5">0,5%</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-orange-50 rounded-md border border-orange-100 flex items-start gap-3">
                                                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Risco climático médio</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Divergência (Declarada X Desenhada)</p>
                                                        <p className="text-[9px] text-green-600 font-bold mt-0.5">&lt; 1% — OK</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Não sobrepõe Terra Indígena</p>
                                                        <p className="text-[9px] text-green-600 font-bold mt-0.5">0% — OK</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Não está em lista de trabalho slaver</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">CAR em dia</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">Não possui embargo IBAMA</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Ratings Radar Chart (Mock) */}
                                        <Card className="p-6 border-gray-100 shadow-sm flex flex-col">
                                            <h3 className="text-xs text-gray-400 font-bold uppercase mb-2">Ratings</h3>
                                            <div className="w-full aspect-square flex items-center justify-center relative -mt-6">
                                                {/* Custom SVG Radar Chart */}
                                                <svg viewBox="-20 -20 240 240" className="w-full h-full drop-shadow-xl">
                                                    <defs>
                                                        <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
                                                            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                                                            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Background Triangle */}
                                                    <polygon points="100,10 190,160 10,160" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                                                    <line x1="100" y1="10" x2="100" y2="160" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                                                    <line x1="100" y1="85" x2="190" y2="160" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                                                    <line x1="100" y1="85" x2="10" y2="160" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />

                                                    {/* Data Polygon */}
                                                    <polygon points="100,60 180,160 60,160" fill="url(#radarGrad)" stroke="#ef4444" strokeWidth="0.5" opacity="0.9" />

                                                    {/* Labels */}
                                                    <text x="100" y="5" textAnchor="middle" fontSize="10" className="fill-gray-500 font-bold">CRÉDITO</text>
                                                    <text x="100" y="15" textAnchor="middle" fontSize="10" className="fill-red-500 font-bold">400</text>

                                                    <text x="5" y="175" textAnchor="start" fontSize="10" className="fill-gray-500 font-bold">GARANTIA</text>
                                                    <text x="15" y="185" textAnchor="start" fontSize="10" className="fill-yellow-500 font-bold">600</text>

                                                    <text x="195" y="175" textAnchor="end" fontSize="10" className="fill-gray-500 font-bold">Risco de Mercado</text>
                                                    <text x="195" y="185" textAnchor="end" fontSize="10" className="fill-green-500 font-bold">940</text>
                                                </svg>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* Bottom Row: Imobilizado & Safra */}
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Capital Imobilizado */}
                                    <div className="col-span-12 lg:col-span-4">
                                        <Card className="p-6 border-gray-100 shadow-sm h-full">
                                            <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">Capital Imobilizado</h3>

                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Total • 11 equipamentos</p>
                                                    <p className="text-xl font-bold text-gray-900">R$ 7.660.000</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {/* Tiny icons with counters */}
                                                    <div className="flex flex-col items-center">
                                                        <Tractor className="w-5 h-5 text-gray-300" />
                                                        <Badge className="bg-[#92dc49] text-white text-[8px] h-4 px-1 rounded-full mt-1">x6</Badge>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <Tractor className="w-5 h-5 text-gray-300" />
                                                        <Badge className="bg-[#92dc49] text-white text-[8px] h-4 px-1 rounded-full mt-1">x3</Badge>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <Tractor className="w-5 h-5 text-gray-300" />
                                                        <Badge className="bg-[#92dc49] text-white text-[8px] h-4 px-1 rounded-full mt-1">x2</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table>
                                                <TableHeader><TableRow className="border-none text-[9px] text-gray-400 uppercase hover:bg-transparent"><TableHead className="pl-0 h-6">Equipamento</TableHead><TableHead className="h-6 text-center">Qtd.</TableHead><TableHead className="h-6 text-right">Valor unit. (R$)</TableHead><TableHead className="h-6 text-right">Valor total (R$)</TableHead></TableRow></TableHeader>
                                                <TableBody>
                                                    <TableRow className="border-none hover:bg-gray-50 text-[11px]">
                                                        <TableCell className="pl-0 py-2 font-medium flex items-center gap-2"><Tractor className="w-3 h-3 text-gray-400" /> Trator</TableCell>
                                                        <TableCell className="py-2 text-center">6</TableCell>
                                                        <TableCell className="py-2 text-right text-gray-500">450.000</TableCell>
                                                        <TableCell className="py-2 text-right font-medium">2.700.000</TableCell>
                                                    </TableRow>
                                                    <TableRow className="border-none hover:bg-gray-50 text-[11px]">
                                                        <TableCell className="pl-0 py-2 font-medium flex items-center gap-2"><Tractor className="w-3 h-3 text-gray-400" /> Colheitadeira</TableCell>
                                                        <TableCell className="py-2 text-center">3</TableCell>
                                                        <TableCell className="py-2 text-right text-gray-500">1.200.000</TableCell>
                                                        <TableCell className="py-2 text-right font-medium">3.600.000</TableCell>
                                                    </TableRow>
                                                    <TableRow className="border-none hover:bg-gray-50 text-[11px]">
                                                        <TableCell className="pl-0 py-2 font-medium flex items-center gap-2"><Sprout className="w-3 h-3 text-gray-400" /> Plantadeira</TableCell>
                                                        <TableCell className="py-2 text-center">2</TableCell>
                                                        <TableCell className="py-2 text-right text-gray-500">680.000</TableCell>
                                                        <TableCell className="py-2 text-right font-medium">1.360.000</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </div>

                                    {/* Safra por Cultura */}
                                    <div className="col-span-12 lg:col-span-8">
                                        <Card className="p-6 border-gray-100 shadow-sm h-full">
                                            <h3 className="text-xs text-gray-400 font-bold uppercase mb-4">Safra por Cultura</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-none text-[10px] text-gray-400 uppercase hover:bg-transparent">
                                                        <TableHead className="pl-0">Cultura</TableHead>
                                                        <TableHead>Início do plantio</TableHead>
                                                        <TableHead>Fim do plantio</TableHead>
                                                        <TableHead>Colheita</TableHead>
                                                        <TableHead>Ciclo (dias)</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {[
                                                        { name: "Soja", start: "05/10/2026", end: "20/10/2026", harvest: "10/01/2027", cycle: "95" },
                                                        { name: "Milho", start: "20/01/2027", end: "05/02/2027", harvest: "15/05/2027", cycle: "115" },
                                                        { name: "Algodão", start: "01/12/2026", end: "10/12/2026", harvest: "30/06/2027", cycle: "210" },
                                                        { name: "Café", start: "01/09/2026", end: "30/09/2026", harvest: "15/05/2027", cycle: "Anual" },
                                                    ].map((item, i) => (
                                                        <TableRow key={i} className="border-none hover:bg-gray-50 text-xs">
                                                            <TableCell className="pl-0 py-3 font-medium flex items-center gap-2">
                                                                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                                    <Sprout className="w-2.5 h-2.5 text-gray-500" />
                                                                </div>
                                                                {item.name}
                                                            </TableCell>
                                                            <TableCell className="py-3 text-gray-900">{item.start}</TableCell>
                                                            <TableCell className="py-3 text-gray-900">{item.end}</TableCell>
                                                            <TableCell className="py-3 text-gray-900">{item.harvest}</TableCell>
                                                            <TableCell className="py-3 text-gray-900">{item.cycle}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="Pecuária" className="mt-0 space-y-6">
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Main Column (Left - 75%) */}
                                    <div className="col-span-12 lg:col-span-9 space-y-6">

                                        {/* Desempenho Financeiro Chart & Stats */}
                                        <Card className="p-6 border-gray-100 shadow-sm">
                                            <h3 className="text-gray-600 font-medium mb-4">Desempenho financeiro</h3>

                                            <div className="h-[250px] w-full mb-6 relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={[
                                                        { year: '2016', value: 17, cost: 10 },
                                                        { year: '2017', value: 20, cost: 12 },
                                                        { year: '2018', value: 17, cost: 10 },
                                                        { year: '2019', value: 25, cost: 16 },
                                                        { year: '2020', value: 27, cost: 14 },
                                                        { year: '2021', value: 33, cost: 12 },
                                                        { year: '2022', value: 23, cost: 15 },
                                                        { year: '2023', value: 28, cost: 20 },
                                                        { year: '2024', value: 31, cost: 18 },
                                                        { year: '2025', value: 27, cost: 22 },
                                                        { year: '2026', value: 34, cost: 16 },
                                                        { year: '2027', value: 38, cost: 25 },
                                                    ]}>
                                                        <defs>
                                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.1} />
                                                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#facc15" stopOpacity={0.1} />
                                                                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                                        <YAxis hide />
                                                        <RechartsTooltip
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            labelStyle={{ color: '#6b7280', fontSize: '10px' }}
                                                        />
                                                        <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                                                        <Area type="monotone" dataKey="cost" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="grid grid-cols-5 gap-4">
                                                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Receita média anual</p>
                                                    <p className="text-lg font-bold text-gray-900">R$ 8.200.00</p>
                                                </div>
                                                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Custo médio anual</p>
                                                    <p className="text-lg font-bold text-gray-900">R$ 6.800.000</p>
                                                </div>
                                                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">EBITDA médio</p>
                                                    <p className="text-lg font-bold text-gray-900">R$ 1.400.000</p>
                                                </div>
                                                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Margem média histórica</p>
                                                    <p className="text-lg font-bold text-gray-900">17%</p>
                                                </div>
                                                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Volatilidade da margem</p>
                                                    <p className="text-lg font-medium text-gray-900">Moderada</p>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Custo e Margem Projetado */}
                                        <Card className="p-6 border-gray-100 shadow-sm">
                                            <h3 className="text-gray-600 font-medium mb-4">Custo e margem da engorda (projetado)</h3>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className="p-4 border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Custo médio da engorda</p>
                                                    <p className="text-xl font-bold text-gray-900">R$ 2.350 <span className="text-xs font-normal text-gray-400">/ cabeça</span></p>
                                                </div>
                                                <div className="p-4 border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Preço médio de venda esperado</p>
                                                    <p className="text-xl font-bold text-gray-900">R$ 3.200 <span className="text-xs font-normal text-gray-400">/ cabeça</span></p>
                                                </div>
                                                <div className="p-4 border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Margem projetada da operação</p>
                                                    <p className="text-xl font-bold text-gray-900">29%</p>
                                                </div>
                                                <div className="p-4 border border-gray-100 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 mb-1">Break-even</p>
                                                    <p className="text-xl font-bold text-gray-900">R$ 2.750 <span className="text-xs font-normal text-gray-400">/ cabeça</span></p>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Bottom Row: Ativos & Ciclo & Ração */}
                                        <div className="grid grid-cols-12 gap-6">
                                            {/* Ativos Biológicos */}
                                            <div className="col-span-12 lg:col-span-5">
                                                <Card className="p-6 border-gray-100 shadow-sm h-full">
                                                    <h3 className="text-gray-600 font-medium mb-4">Ativos biológicos</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 border border-gray-100 rounded-lg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="text-[10px] text-gray-500">Bezerros</p>
                                                            </div>
                                                            <div className="mb-1">
                                                                <span className="text-2xl font-bold">40%</span>
                                                                <p className="text-[10px] text-gray-400">1.200 un.</p>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-[#92dc49]" style={{ width: '40%' }}></div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 border border-gray-100 rounded-lg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="text-[10px] text-gray-500">Garrotes</p>
                                                            </div>
                                                            <div className="mb-1">
                                                                <span className="text-2xl font-bold">33%</span>
                                                                <p className="text-[10px] text-gray-400">900 un.</p>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-[#92dc49]" style={{ width: '33%' }}></div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 border border-gray-100 rounded-lg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="text-[10px] text-gray-500">Vacas Matrizes</p>
                                                            </div>
                                                            <div className="mb-1">
                                                                <span className="text-2xl font-bold">12%</span>
                                                                <p className="text-[10px] text-gray-400">650 un.</p>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-[#92dc49]" style={{ width: '12%' }}></div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 border border-gray-100 rounded-lg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="text-[10px] text-gray-500">Boi Gordo</p>
                                                            </div>
                                                            <div className="mb-1">
                                                                <span className="text-2xl font-bold">11%</span>
                                                                <p className="text-[10px] text-gray-400">300 un.</p>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-[#92dc49]" style={{ width: '11%' }}></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                                        <p className="text-[10px] text-gray-400 mb-2">Detalhamento</p>
                                                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mb-2">
                                                            <div className="h-full bg-[#78ac55] w-[60%]"></div>
                                                            <div className="h-full bg-[#e6a85c] w-[40%]"></div>
                                                        </div>
                                                        <div className="flex justify-between text-[9px] text-gray-500">
                                                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#78ac55] rounded-sm"></div> Machos Adultos 1260 (60%)</div>
                                                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#e6a85c] rounded-sm"></div> Fêmeas Adultas 790 (40%)</div>
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-1 text-[9px] text-gray-400"><div className="w-2 h-2 bg-gray-300 rounded-sm"></div> Garrotes (Machos e fêmeas) — 900</div>

                                                        <div className="mt-4 space-y-2">
                                                            <div className="p-2 bg-green-50 rounded border border-green-100 flex items-center gap-2">
                                                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                                <span className="text-[10px] text-green-800">Distribuição equilibrada, com foco em ciclo produtivo.</span>
                                                            </div>
                                                            <div className="p-2 bg-orange-50 rounded border border-orange-100 flex items-center gap-2">
                                                                <AlertTriangle className="w-3 h-3 text-orange-500" />
                                                                <span className="text-[10px] text-orange-800">Boi gordo não é aceito como lastro financeiro por risco de descaminho.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>

                                            {/* Ciclo & Ração */}
                                            <div className="col-span-12 lg:col-span-7 space-y-6">
                                                {/* Ciclo */}
                                                <Card className="p-6 border-gray-100 shadow-sm">
                                                    <h3 className="text-gray-600 font-medium mb-4">Ciclo de operação</h3>
                                                    <p className="text-[10px] text-gray-400 mb-1">Tempo total</p>
                                                    <p className="text-xl font-bold text-gray-900 mb-4">27 meses</p>

                                                    <div className="space-y-1">
                                                        <div className="flex gap-1 h-8 w-full">
                                                            {[...Array(12)].map((_, i) => <div key={`y1-${i}`} className="flex-1 bg-[#86bc5e] rounded-sm opacity-90 hover:opacity-100 transition-opacity"></div>)}
                                                            <div className="w-16 flex items-center justify-end text-[10px] text-gray-400 font-medium">1º ano</div>
                                                        </div>
                                                        <div className="flex gap-1 h-8 w-full">
                                                            {[...Array(10)].map((_, i) => <div key={`y2-${i}`} className="flex-1 bg-[#dec057] rounded-sm opacity-90 hover:opacity-100 transition-opacity"></div>)}
                                                            {[...Array(2)].map((_, i) => <div key={`y2-e-${i}`} className="flex-1 bg-[#d98b48] rounded-sm opacity-90 hover:opacity-100 transition-opacity"></div>)}
                                                            <div className="w-16 flex items-center justify-end text-[10px] text-gray-400 font-medium">2º ano</div>
                                                        </div>
                                                        <div className="flex gap-1 h-8 w-full">
                                                            {[...Array(3)].map((_, i) => <div key={`y3-${i}`} className="flex-1 bg-[#d98b48] rounded-sm opacity-90 hover:opacity-100 transition-opacity"></div>)}
                                                            <div className="flex-grow"></div>
                                                            <div className="w-16 flex items-center justify-end text-[10px] text-gray-400 font-medium">3º ano</div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex gap-4 text-[10px] text-gray-500">
                                                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#86bc5e] rounded-sm"></div> Cria (10 meses)</div>
                                                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#dec057] rounded-sm"></div> Recria (12 meses)</div>
                                                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#d98b48] rounded-sm"></div> Engorda (5 meses)</div>
                                                    </div>
                                                </Card>

                                                {/* Ração */}
                                                <Card className="p-6 border-gray-100 shadow-sm">
                                                    <h3 className="text-gray-600 font-medium mb-4">Ração</h3>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 mb-1">Custo da ração</p>
                                                            <p className="text-xl font-bold text-gray-900">R$ 38.000 / mês</p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                                            <p className="text-[10px] text-orange-600 font-medium leading-tight w-24">Dependência externa Média</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] text-gray-400 mb-2">Tipos de ração</p>
                                                        <div className="flex gap-3">
                                                            <div className="p-3 border border-gray-100 rounded-md bg-white shadow-sm flex-1 text-sm font-medium text-gray-700">Milho</div>
                                                            <div className="p-3 border border-gray-100 rounded-md bg-white shadow-sm flex-1 text-sm font-medium text-gray-700">Farelo de soja</div>
                                                        </div>
                                                        <div className="p-3 border border-gray-100 rounded-md bg-white shadow-sm w-full mt-3 text-sm font-medium text-gray-700">Suplementação mineral</div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Column (Right - 25%) */}
                                    <div className="col-span-12 lg:col-span-3 space-y-6">
                                        {/* Alertas */}
                                        <Card className="p-5 border-gray-100 shadow-sm">
                                            <h3 className="text-gray-600 font-medium mb-4">Alertas</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 mb-2">Riscos naturais</p>
                                                    <div className="space-y-2">
                                                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800">Predadores (onça pintada)</p>
                                                                    <p className="text-[9px] text-orange-600 font-bold mt-0.5">Médio</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800">Risco climático indireto (seca)</p>
                                                                    <p className="text-[9px] text-orange-600 font-bold mt-0.5">Moderado</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800">Risco sanitário</p>
                                                                    <p className="text-[9px] text-green-600 font-bold mt-0.5">Baixo</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-[10px] text-gray-400 mb-2">Risco de descaminho</p>
                                                    <div className="space-y-2">
                                                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800">Facilidade de desvio do ativo</p>
                                                                    <p className="text-[9px] text-red-500 font-bold mt-0.5">Alta</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800">Controle de rastreabilidade</p>
                                                                    <p className="text-[9px] text-orange-600 font-bold mt-0.5">Médio</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800">Histórico de incidentes</p>
                                                                    <p className="text-[9px] text-green-600 font-bold mt-0.5">Nenhum registrado</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Ratings */}
                                        <Card className="p-6 border-gray-100 shadow-sm flex flex-col">
                                            <h3 className="text-gray-600 font-medium mb-2">Ratings</h3>
                                            <div className="w-full aspect-square flex items-center justify-center relative -mt-6">
                                                {/* Reusing the responsive Radar Chart SVG structure */}
                                                <svg viewBox="-20 -20 240 240" className="w-full h-full drop-shadow-xl">
                                                    <defs>
                                                        <linearGradient id="radarGradPc" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
                                                            <stop offset="50%" stopColor="#facc15" stopOpacity="0.8" />
                                                            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
                                                        </linearGradient>
                                                    </defs>
                                                    <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                                                    <line x1="100" y1="10" x2="100" y2="190" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                                                    <line x1="10" y1="100" x2="190" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />

                                                    {/* Diamond Shape for this one based on image? No, image is diamond/rotated square */}
                                                    {/* Actually the image shows a diamond shape (rotated square) for the background grid, and a diamond shape for the data. */}
                                                    {/* Same layout as Plantio but rotated? Or just same Radar?
                                                        The Plantio one I implemented was triangle.
                                                        The reference video/image might show a diamond.
                                                        I will implement a Diamond style radar here to match Pecuária reference better if implied.
                                                        Reference shows 4 axes: Natural, Financeiro, Operacional, Descaminho.
                                                        So Diamond (4 points) is correct.
                                                     */}

                                                    {/* Axes Labels */}
                                                    <text x="100" y="0" textAnchor="middle" fontSize="8" className="fill-gray-500">Natural</text>
                                                    <text x="100" y="8" textAnchor="middle" fontSize="8" className="fill-yellow-500 font-bold">62</text>

                                                    <text x="200" y="100" textAnchor="start" fontSize="8" className="fill-gray-500">Financeiro</text>
                                                    <text x="200" y="110" textAnchor="start" fontSize="8" className="fill-green-500 font-bold">82</text>

                                                    <text x="100" y="205" textAnchor="middle" fontSize="8" className="fill-gray-500">Operacional</text>
                                                    <text x="100" y="213" textAnchor="middle" fontSize="8" className="fill-green-500 font-bold">76</text>

                                                    <text x="0" y="100" textAnchor="end" fontSize="8" className="fill-gray-500">Descaminho</text>
                                                    <text x="0" y="110" textAnchor="end" fontSize="8" className="fill-yellow-500 font-bold">45</text>

                                                    <text x="100" y="105" textAnchor="middle" fontSize="12" className="fill-gray-800 font-bold">72</text>
                                                    <text x="100" y="115" textAnchor="middle" fontSize="8" className="fill-gray-500">Risco médio</text>

                                                    {/* Data Polygon (Mocked shape) */}
                                                    <polygon points="100,40 160,100 130,160 60,100" fill="url(#radarGradPc)" stroke="#65a30d" strokeWidth="1" opacity="0.9" />
                                                </svg>
                                            </div>
                                        </Card>

                                        {/* Dados da Propriedade */}
                                        <Card className="p-5 border-gray-100 shadow-sm">
                                            <h3 className="text-gray-600 font-medium mb-4">Dados da propriedade</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="p-2 border border-gray-100 rounded text-center">
                                                    <p className="text-[8px] text-gray-400 mb-1">Área total</p>
                                                    <p className="text-sm font-bold text-gray-900">2.800 ha</p>
                                                </div>
                                                <div className="p-2 border border-gray-100 rounded text-center">
                                                    <p className="text-[8px] text-gray-400 mb-1">Área produtiva</p>
                                                    <p className="text-sm font-bold text-gray-900">2.200 ha</p>
                                                </div>
                                                <div className="p-2 border border-gray-100 rounded text-center">
                                                    <p className="text-[8px] text-gray-400 mb-1">Reserva legal</p>
                                                    <p className="text-sm font-bold text-gray-900">600 ha</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </TabsContent>

                <TabsContent value="Assinaturas" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <div className="flex items-center gap-4 mb-6"><Button variant="outline" className="rounded-full bg-white border-gray-200"><Filter className="w-4 h-4 mr-2" />Tipo</Button></div>
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Analista</TableHead><TableHead>Assinaturas</TableHead><TableHead>Status</TableHead><TableHead className="w-[300px]">Mensagem</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{signaturesData.map((item, index) => (<TableRow key={index} className="h-16"><TableCell className="font-medium">{item.name}</TableCell><TableCell><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">D</div>{item.analyst}</div></TableCell><TableCell>{item.completed} de {item.total}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell><TableCell className="text-gray-500 text-sm">{item.msg}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
                    </Card>
                </TabsContent>

                <TabsContent value="Documentação" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none" placeholder="Faça uma pesquisa..." /></div><Button variant="outline" className="rounded-full bg-white border-gray-200"><Filter className="w-4 h-4 mr-2" />Tipo</Button></div>
                            <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium border-0" onClick={() => setShowDocAnalysis(true)}>Analisar Documentos</Button>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2"><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Matrícula do imóvel prestes a vencer. (Faltam 3 dias)</span></div><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Projeto vencido.</span></div></div>
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Data de emissão</TableHead><TableHead>Data de validade</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{documentsData.map((doc, index) => (<TableRow key={index} className="h-14"><TableCell className="font-medium">{doc.name}</TableCell><TableCell>{doc.emission}</TableCell><TableCell>{doc.valid}</TableCell><TableCell><StatusBadge status={doc.status} /></TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
                    </Card>
                </TabsContent>

                <TabsContent value="Garantias" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md space-y-8">
                        <div><h4 className="text-sm font-semibold text-gray-500 mb-4">Imóveis rurais</h4><div className="bg-white rounded-lg border border-gray-100 overflow-hidden"><Table><TableHeader className="bg-gray-50"><TableRow><TableHead>Nome/Descrição</TableHead><TableHead>CPF/CNPJ</TableHead><TableHead className="text-right">Matrícula</TableHead></TableRow></TableHeader><TableBody>{guaranteesData.rural.map((item, i) => (<TableRow key={i}><TableCell className="font-medium text-gray-500">{item.name}</TableCell><TableCell className="text-gray-500">{item.cpf}</TableCell><TableCell className="text-right font-mono text-gray-400">{item.matricula}</TableCell></TableRow>))}</TableBody></Table></div></div>
                        <div><h4 className="text-sm font-semibold text-gray-500 mb-4">Imóveis urbanos</h4><div className="bg-white rounded-lg border border-gray-100 overflow-hidden"><Table><TableHeader className="bg-gray-50"><TableRow><TableHead>Nome/Descrição</TableHead><TableHead>CPF/CNPJ</TableHead><TableHead className="text-right">Matrícula</TableHead></TableRow></TableHeader><TableBody>{guaranteesData.urban.map((item, i) => (<TableRow key={i}><TableCell className="font-medium text-gray-500">{item.name}</TableCell><TableCell className="text-gray-500">{item.cpf}</TableCell><TableCell className="text-right font-mono text-gray-400">{item.matricula}</TableCell></TableRow>))}</TableBody></Table></div></div>
                    </Card>
                </TabsContent>

                <TabsContent value="Projeto" className="mt-0">
                    {/* Static Header Card */}
                    <Card className="p-6 border-gray-100 shadow-md mb-8">
                        <div className="grid grid-cols-4 gap-4 mb-8"><ScoreCircle label="Score produtivo" value={825} max={1000} /><ScoreCircle label="Score ambiental" value={677} max={1000} /><ScoreCircle label="Score fundiário" value={238} max={1000} /><ScoreCircle label="Score de crédito" value={576} max={1000} /></div>
                        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-gray-800">Geoespacial</h3><Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-50"><FileText className="w-4 h-4 mr-2" />Exportar shapefile</Button></div>
                        <div className="w-full h-[500px] bg-slate-200 rounded-xl overflow-hidden relative group"><img src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/36555/24855" alt="Satellite Map" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" /><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-yellow-400 bg-yellow-400/10 box-content"></div><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-36 -ml-36 bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">K</div></div>
                    </Card>


                </TabsContent>

                <TabsContent value="Perfil" className="mt-0">
                    <Card className="p-8 border-gray-100 shadow-md">
                        <div className="flex items-center justify-between mb-8"><h3 className="text-xl font-bold text-gray-900">Análise de Risco</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="text-green-700 border-green-700 hover:bg-green-50"
                                    onClick={handleDownload}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar análise
                                </Button>
                                <Button
                                    className="bg-[#92dc49] hover:bg-[#7ab635] text-white border-0"
                                    onClick={() => setShowReport(true)}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Visualizar relatório
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-10"><div className="grid grid-cols-[100px_1fr] gap-4 items-center"><span className="text-sm text-gray-500">Nome:</span><span className="font-medium text-gray-900">Fundação Agrônoma das Silva</span></div><div className="grid grid-cols-[140px_1fr] gap-4 items-center"><span className="text-sm text-gray-500">Capital social:</span><div className="flex items-center gap-4"><span className="font-medium text-gray-900">R$ 2.000.000,00</span><span className="text-gray-400">Score:</span><span className="font-bold text-gray-900">400 (Risco Alto)</span></div></div></div>
                        <div className="mb-10"><div className="flex justify-between items-end mb-4"><h4 className="font-bold text-gray-900">Resumo da Análise</h4></div><div className="grid grid-cols-2 gap-4"><div className="bg-gray-100 p-4 rounded-md"><p className="text-xs text-gray-500 font-bold mb-1">RAZÃO 1</p><p className="text-sm font-medium text-gray-800">Possui contratos com grande quantidade de parcelas</p></div><div className="bg-gray-100 p-4 rounded-md"><p className="text-xs text-gray-500 font-bold mb-1">RAZÃO 2</p><p className="text-sm font-medium text-gray-800">Possui utilização de alto valor de crédito do tipo emergencial</p></div></div></div>
                    </Card>
                </TabsContent>

                <TabsContent value="Linha do tempo" className="mt-0">
                    <div className="grid grid-cols-12 gap-6 h-[700px]">
                        {/* Feed Column */}
                        <div className="col-span-12 lg:col-span-7 h-full overflow-y-auto pr-2 custom-scrollbar">
                            <h3 className="font-bold text-lg mb-6 sticky top-0 bg-white z-10 py-2">Linha do tempo</h3>
                            <div className="space-y-6">
                                <Card className="p-6 border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                            <p className="text-sm"><span className="font-bold">Daniel Alves</span> (Analista) criou uma pendência na proposta:</p>
                                        </div>
                                        <span className="text-xs text-gray-400">10/11/25 15:33</span>
                                    </div>
                                    <div className="mt-4 bg-gray-50 rounded-lg border border-gray-100 p-0 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-100">
                                                <TableRow className="h-8">
                                                    <TableHead className="h-8 text-xs font-semibold">Data</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold">Descrição</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold">Responsável</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold">Prazo</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="border-0">
                                                    <TableCell className="py-3 text-xs">16/11/25</TableCell>
                                                    <TableCell className="py-3 text-xs font-medium">Enviar CAR atualizado</TableCell>
                                                    <TableCell className="py-3 text-xs">Projetista</TableCell>
                                                    <TableCell className="py-3 text-xs">20/11</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>

                                <div className="pl-2 relative border-l-2 border-gray-100 ml-3 space-y-8 py-2">
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-green-500 ring-4 ring-white"></div>
                                        <div className="flex justify-between">
                                            <p className="text-sm"><span className="font-bold">Daniel Alves</span> (Analista) evoluiu esta proposta para a etapa <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-gray-100 text-gray-600">Célula</Badge></p>
                                            <span className="text-xs text-gray-400">10/11/25 15:30</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">após 5 dias na etapa anterior.</p>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                        <div className="flex justify-between">
                                            <p className="text-sm"><span className="font-bold">Ronaldo Portobello</span> (Projetista) evoluiu esta proposta para a etapa <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-gray-100 text-gray-600">Técnica</Badge></p>
                                            <span className="text-xs text-gray-400">10/11/25 15:00</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">após 3 dias na etapa anterior.</p>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-white"></div>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm"><span className="font-bold">Ronaldo Portobello</span> (Projetista) adicionou um comentário na proposta:</p>
                                            <span className="text-xs text-gray-400">10/11/25 15:00</span>
                                        </div>
                                        <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                            <p className="text-sm text-gray-600 italic">"Pré-análise e simulação realizada. Cliente deseja seguir com a configuração presente no arquivo que anexei."</p>
                                            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs bg-white">
                                                <FileBox className="w-3 h-3 mr-2" />
                                                Simulação
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stages Column */}
                        <div className="col-span-12 lg:col-span-5 border-l border-gray-100 pl-8 pt-12">
                            <div className="sticky top-12">
                                <TimelineStep label="Aguardando decisão" status="future" isLast={false} />
                                <TimelineStep label="Envio do parecer" date="20/01/2025 - 15h24" status="current" isLast={false} />
                                <TimelineStep label="Análise de Crédito" date="20/01/2025 - 15h24" status="completed" isLast={false} />
                                <TimelineStep label="Análise Técnica" date="20/01/2025 - 15h24" status="completed" isLast={false} />
                                <TimelineStep label="Cadastro" date="20/01/2025 - 15h24" status="completed" isLast={true} />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Pendências" className="mt-0">
                    <Card className="min-h-[600px] p-0 border-gray-100 shadow-sm overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-white border-b border-gray-100"><TableRow className="hover:bg-transparent"><TableHead className="w-[150px] font-semibold text-gray-400">Data</TableHead><TableHead className="w-[300px] font-semibold text-gray-400">Descrição</TableHead><TableHead className="font-semibold text-gray-400">Responsável</TableHead><TableHead className="font-semibold text-gray-400">Prazo</TableHead><TableHead className="font-semibold text-gray-400">Situação</TableHead></TableRow></TableHeader>
                            <TableBody>{pendenciesData.map((item, index) => (<TableRow key={index} className="h-16 hover:bg-gray-50/50 border-b border-gray-50"><TableCell className="font-medium text-gray-900">{item.date}</TableCell><TableCell className="text-gray-900 font-medium">{item.description}</TableCell><TableCell className="text-gray-600 font-medium">{item.responsible}</TableCell><TableCell className="text-gray-600 font-medium">{item.deadline}</TableCell><TableCell className="text-gray-600 font-bold uppercase text-xs">{item.status}</TableCell></TableRow>))}</TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="Auditoria" className="mt-0">
                    <Card className="min-h-[600px] p-0 border-gray-100 shadow-sm overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-white border-b border-gray-100"><TableRow className="hover:bg-transparent"><TableHead className="w-[150px] font-semibold text-gray-400">Data</TableHead><TableHead className="w-[200px] font-semibold text-gray-400">Responsável</TableHead><TableHead className="font-semibold text-gray-400">Evento</TableHead><TableHead className="font-semibold text-gray-400">Detalhes</TableHead></TableRow></TableHeader>
                            <TableBody>{auditData.map((log, index) => (<TableRow key={index} className="h-16 hover:bg-gray-50/50 border-b border-gray-50"><TableCell className="font-medium text-gray-900">{log.date}</TableCell><TableCell className="text-gray-600">{log.responsible}</TableCell><TableCell className="text-gray-900 font-medium">{log.event}</TableCell><TableCell className="text-gray-600">{log.details}</TableCell></TableRow>))}</TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Report Dialog */}
            <Dialog open={showReport} onOpenChange={setShowReport}>
                <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <DialogTitle>Relatório de Análise - Fernando Fagundes</DialogTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download</Button>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto">
                        <div className="w-[595px] h-[842px] bg-white shadow-2xl flex flex-col">
                            {/* Mock PDF Content */}
                            <div className="p-12 bg-white flex-1">
                                <div className="w-full h-8 bg-gray-200 rounded mb-8"></div>
                                <div className="w-2/3 h-6 bg-gray-200 rounded mb-12"></div>

                                <div className="space-y-4">
                                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                                    <div className="w-3/4 h-4 bg-gray-100 rounded"></div>
                                </div>

                                <div className="mt-12 p-8 border border-dashed border-gray-300 rounded-lg text-center text-gray-400">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                                    <p>Visualização de PDF simulada.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Document Analysis Modal */}
            <Dialog open={showDocAnalysis} onOpenChange={setShowDocAnalysis}>
                <DialogContent className="max-w-[100vw] w-screen h-screen bg-[#333333] border-none rounded-none p-4 flex gap-4 overflow-hidden">

                    {/* Left Sidebar - Documents List (Floating Card) */}
                    <div className="w-56 bg-[#f8f9fa] rounded-2xl flex flex-col p-4 shadow-2xl" style={{ height: '50%' }}>
                        <div className="flex items-center gap-2 mb-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => setShowDocAnalysis(false)}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-xs truncate">Fernando Fagundes</span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 px-2">Documentos</p>

                            {/* Matrícula Item */}
                            <div
                                onClick={() => setSelectedDoc('Matrícula')}
                                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-3 cursor-pointer transition-all border ${selectedDoc === 'Matrícula' ? 'bg-[#efffdb] text-[#558b2f] border-[#dcebc0] shadow-sm' : 'hover:bg-white text-gray-500 border-transparent hover:border-gray-100 hover:shadow-sm'}`}
                            >
                                <FileText className={`w-4 h-4 ${selectedDoc === 'Matrícula' ? 'fill-[#558b2f] text-transparent' : 'text-gray-400'}`} />
                                Matrícula
                            </div>

                            {/* CPF Item */}
                            <div
                                onClick={() => setSelectedDoc('CPF')}
                                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-3 cursor-pointer transition-all border ${selectedDoc === 'CPF' ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm' : 'hover:bg-white text-gray-500 border-transparent hover:border-gray-100 hover:shadow-sm'}`}
                            >
                                <FileText className={`w-4 h-4 ${selectedDoc === 'CPF' ? 'text-purple-500' : 'text-gray-400'}`} />
                                CPF
                            </div>
                        </div>
                    </div>

                    {/* Center - Image Viewer */}
                    <div className="flex-1 flex items-center justify-center relative rounded-2xl overflow-hidden bg-[#222]">
                        <div className="w-full h-full overflow-auto flex items-center justify-center p-8 custom-scrollbar-dark">

                            {selectedDoc === 'Matrícula' ? (
                                <div className="relative shadow-2xl origin-center">
                                    {/* Placeholder for Document Image */}
                                    <div className="w-[500px] h-[700px] bg-[#fdfbf7] relative text-[9px] font-serif leading-relaxed p-10 select-none shadow-black/50 shadow-2xl">
                                        {/* Simulate Old Paper Texture/Color */}
                                        <div className="absolute top-0 right-0 p-4 text-right text-[10px]">São Paulo, <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">05</span> de <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">novembro</span> de <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">1998.</span></div>

                                        <div className="mt-8 text-justify">
                                            <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">IMÓVEL:-</span> Terreno situado na Rua <span className="bg-gray-200 text-transparent rounded px-2">XXXXXX</span>, constituído pelo <span className="border border-blue-600 text-blue-800 bg-blue-50/30 px-1">lote nº 17 da quadra 8</span>, do <span className="bg-gray-200 text-transparent rounded px-2">XXXXXX</span> 29º Subdistrito - Santo Amaro, de forma irregular, medindo 19,20m de frente; 33,10m do lado direito de quem da rua olha o imóvel, confrontando com o lote nº 16; 27,90m do lado esquerdo confrontando com o lote nº 1, e 25,50m nos fundos confrontando com os lotes 2 e 3, encerrando a área de 670,00m2. Contribuinte:- <span className="bg-gray-200 text-transparent rounded px-2">000.000.0000-0</span>
                                        </div>

                                        <div className="mt-6 text-justify">
                                            <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">PROPRIETÁRIO:-</span> <span className="bg-blue-100/50 border border-blue-400 px-1 text-blue-800">FERNANDO FAGUNDES</span>, brasileiro, casado, proprietário, residente e domiciliado nesta Capital, na Rua <span className="bg-gray-200 text-transparent rounded px-2">XXXXXX</span>, nº <span className="bg-gray-200 text-transparent rounded px-2">000</span>, apto <span className="bg-gray-200 text-transparent rounded px-2">00</span>.
                                        </div>

                                        <div className="mt-6 text-justify">
                                            <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">REGISTRO ANTERIOR:-</span> TR. nº <span className="bg-gray-200 text-transparent rounded px-2">000.000</span> deste Serviço Registral, feita em 4/12/67.
                                        </div>

                                        <div className="mt-10 flex justify-center opacity-70">
                                            <div className="text-center">
                                                <div className="border-b border-black w-32 mb-1"></div>
                                                <span>Oficial Substituto</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-justify">
                                            <span className="bg-blue-100/50 border border-blue-400 px-1 text-blue-800 font-bold text-[8px] block w-fit mb-1">Av.1/286.162:-</span> Pelo formal de partilha de 13 de outubro de 1998, do Juízo de Direito da 5ª Vara e respectivo Ofício da Família e Sucessões desta Capital, extraído do processo nº <span className="bg-gray-200 text-transparent px-1">0000</span>, e de conformidade com a certidão de casamento expedida em 3/4/61 pelo Registro Civil do 1º Subdistrito - Sé, desta Capital, extraída do registro nº <span className="bg-gray-200 text-transparent px-1">0000</span> feito às fls. <span className="bg-gray-200 text-transparent px-1">000</span> do Lv. B-45, procede-se a presente para constar que <span className="bg-gray-200 text-transparent px-1">XXXXX</span> é casado desde 3/12/31, com <span className="bg-gray-200 text-transparent px-1">XXXXX</span>, sob o regime da comunhão de bens. Data da matrícula.
                                        </div>

                                        <div className="absolute right-4 top-1/2 -rotate-90 origin-right text-gray-400 text-[6px] tracking-[4px]">
                                            11117-9 - AB 891921
                                        </div>

                                        {/* Vertical barcode strip simulation */}
                                        <div className="absolute right-2 top-20 bottom-20 w-0.5 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgDNjd8YNAAAAABJRU5ErkJggg==')] opacity-20"></div>

                                    </div>

                                    {/* Zoom Controls Overlay */}
                                    <div className="absolute bottom-6 right-6 bg-[#444] text-white rounded-full px-3 py-1 text-[10px] flex items-center gap-2 shadow-lg backdrop-blur-md bg-opacity-80">
                                        <button className="hover:text-gray-300">-</button>
                                        <span className="font-mono">350%</span>
                                        <button className="hover:text-gray-300">+</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative shadow-2xl origin-center">
                                    <img src="/images/id_fake.png" alt="Documento CNH" className="max-w-[500px] rounded-lg shadow-2xl" />

                                    {/* Highlights for CNH (Estimated Positions) */}
                                    {/* Nome */}
                                    <div className="absolute top-[18%] left-[24%] w-[38%] h-[5%] bg-purple-500/20 rounded-full border border-purple-400/50 mix-blend-multiply"></div>
                                    {/* CPF */}
                                    <div className="absolute top-[29%] left-[20%] w-[25%] h-[4%] bg-purple-500/20 rounded-full border border-purple-400/50 mix-blend-multiply"></div>
                                    {/* Data Nascimento */}
                                    <div className="absolute top-[28%] left-[48%] w-[18%] h-[4%] bg-purple-500/20 rounded-full border border-purple-400/50 mix-blend-multiply"></div>
                                    {/* Validade */}
                                    <div className="absolute top-[51%] left-[20%] w-[22%] h-[4%] bg-purple-500/20 rounded-full border border-purple-400/50 mix-blend-multiply"></div>


                                    {/* Zoom Controls Overlay */}
                                    <div className="absolute bottom-6 right-6 bg-[#444] text-white rounded-full px-3 py-1 text-[10px] flex items-center gap-2 shadow-lg backdrop-blur-md bg-opacity-80">
                                        <button className="hover:text-gray-300">-</button>
                                        <span className="font-mono">100%</span>
                                        <button className="hover:text-gray-300">+</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Right Sidebar - Checklist (Floating Card) */}
                    <div className="w-72 bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden" style={{ height: '50%' }}>
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">Checklist do Documento</h3>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            {selectedDoc === 'Matrícula' ? (
                                <>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Endereço</p>
                                                <p className="text-xs text-gray-400 mt-1">Lote 17 Quadra 8 Santo Amaro</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-purple-500 rounded-full text-white p-0.5 mt-0.5 shadow-sm"><FileText className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Data do documento</p>
                                                <p className="text-xs text-gray-400 mt-1">05/11/1998</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-red-500 rounded-full text-white p-0.5 mt-0.5 shadow-sm"><XCircle className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Proprietário</p>
                                                <p className="text-xs text-red-500 font-bold mt-1">Não encontrado.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1 opacity-50">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <div className="w-4 h-4 border-2 border-gray-200 rounded ml-0.5"></div>
                                            <p className="text-sm font-medium">Segundo proprietário</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 opacity-50">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <div className="w-4 h-4 border-2 border-gray-200 rounded ml-0.5"></div>
                                            <p className="text-sm font-medium">Averbação</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Nome</p>
                                                <p className="text-xs text-gray-400 mt-1">Carlos Henrique Almeida</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">CPF</p>
                                                <p className="text-xs text-gray-400 mt-1">Regular na Receita Federal</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Data de Nascimento</p>
                                                <p className="text-xs text-gray-400 mt-1">Maior de 18 anos</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <Button className="w-full bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full font-bold shadow-lg shadow-green-100 transition-all h-12" onClick={() => setShowDocAnalysis(false)}>
                                Avançar
                                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                            </Button>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    );
}
