import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, ArrowLeft, Building2, Users, Hash, MoreHorizontal,
    Send, AlertTriangle, Download, Eye, FileText, Search,
    ChevronDown, Filter, FileBox, Plus
} from "lucide-react";
import { DetailItem, StatCard, StatusBadge, ScoreCircle, TimelineStep } from "./ProposalHelpers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentViewer } from "@/components/DocumentViewer";

const proposalTabs = [
    "Resumo", "Assinaturas", "Documentação", "Garantias", "Perfil", "Projeto", "Pendências", "Auditoria"
];

// Helper to calculate progress based on stage
const getProgress = (stage) => {
    const stages = ["1. Cadastro", "2. Técnica", "3. Crédito", "4. Jurídico", "5. Aprovação"];
    const index = stages.findIndex(s => stage?.includes(s.split(". ")[1])); // Simple matching
    if (index === -1) return 10; // Default start
    return Math.round(((index + 1) / stages.length) * 100);
}

export function CorporateProposalDetail({ proposal: initialProposal, onBack }) {
    const [activeTab, setActiveTab] = useState("Resumo");
    const [showReport, setShowReport] = useState(false);

    const { data: fullProposal, isLoading } = useQuery({
        queryKey: [`/api/proposals/${initialProposal?.id}`],
        enabled: !!initialProposal?.id,
    });

    // Use fetched data or fallback to initial prop (which might be incomplete)
    const proposal = fullProposal || initialProposal;
    const client = fullProposal?.client;
    const clientDetails = client?.details;
    const analyst = fullProposal?.analyst;
    const manager = fullProposal?.manager;
    const timeline = fullProposal?.timeline || [];

    const handleDownload = () => {
        alert("Download iniciado (simulação).");
    };

    // Formatter helpers
    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val) || 0);
    const formatDate = (date) => date ? format(new Date(date), "dd/MM/yy HH:mm", { locale: ptBR }) : "-";

    const progress = getProgress(proposal?.stage);

    // Mock Data (Corporate Specific)
    const signaturesData = [
        { name: "Parecer técnico", date: "24/01/2025", completed: 1, total: 3, status: "PENDENTE", msg: "Sua assinatura está pendente." },
        { name: "Parecer de análise", date: "24/01/2025", completed: 3, total: 3, status: "OK", msg: "" },
    ];

    const documentsData = [
        { name: "Matrícula", emission: "02/11/2025", valid: "20/01/2025", status: "A VENCER" },
        { name: "Projeto", emission: "02/11/2025", valid: "12/01/2025", status: "VENCIDO" },
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
                    <h1 className="text-3xl font-bold text-gray-900">{proposal?.name || "Vale do Cedro"}</h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full px-6 border-gray-300 text-gray-600 hover:bg-gray-50">
                        Ações
                        <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    <Button className="rounded-full px-6 bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 shadow-lg shadow-green-100">
                        Enviar Parecer de Análise
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
                    <div className="grid grid-cols-12 gap-6">
                        {/* Main Content (Dados Cadastrais) - Full width for this layout */}
                        <div className="col-span-12 space-y-8">

                            <Card className="p-8 border-gray-100 shadow-sm bg-white">
                                <h3 className="text-xl font-bold mb-8 text-gray-900">Dados Cadastrais</h3>

                                <div className="grid grid-cols-4 gap-8">
                                    {/* Row 1 */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Building2 className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Empresa</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{clientDetails?.companyName || client?.fullName || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Tamanho</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{clientDetails?.companySize || clientDetails?.employeeCount || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Cliente</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{client?.fullName || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">E-mail</span>
                                        </div>
                                        <p className="font-semibold text-gray-900 truncate" title={client?.email}>{client?.email || "-"}</p>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Building2 className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Indústria</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{clientDetails?.industry || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Hash className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Faturamento</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{clientDetails?.annualRevenue ? formatCurrency(clientDetails.annualRevenue) + " / ano" : "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Hash className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">CPF/CNPJ</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{clientDetails?.cnpj || clientDetails?.cpf || client?.document || "000.000.000-00"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Telefone</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{client?.phone || "(00) 00000-0000"}</p>
                                    </div>

                                    {/* Row 3 */}
                                    <div className="space-y-1 col-span-2">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Endereço</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {clientDetails?.address
                                                ? `${clientDetails.address}${clientDetails.city ? `, ${clientDetails.city}` : ''}${clientDetails.state ? ` - ${clientDetails.state}` : ''}`
                                                : "Endereço não cadastrado"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <span className="text-xs font-semibold uppercase">Limite atual</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{proposal?.creditAnalysis?.approvedLimit ? formatCurrency(proposal.creditAnalysis.approvedLimit) : "R$ 0,00"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <span className="text-xs font-semibold uppercase">Rating Interno</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{proposal?.score || "0.0"}%</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Additional Mock Tabs for Plantio / Pecuária */}
                            <Tabs defaultValue="plantio" className="w-full">
                                <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 mb-6">
                                    <TabsTrigger value="plantio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#92dc49] data-[state=active]:text-[#92dc49] pb-2 px-0 mr-6">
                                        <span className="flex items-center gap-2"><span className="text-lg">🌱</span> Plantio</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="pecuaria" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#92dc49] data-[state=active]:text-[#92dc49] pb-2 px-0">
                                        <span className="flex items-center gap-2"><span className="text-lg">🐄</span> Pecuária</span>
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="plantio" className="mt-0">
                                    <Card className="p-8 border-dashed border-2 border-gray-200 bg-gray-50 flex flex-col items-center justify-center h-48">
                                        <p className="text-gray-400 font-medium">Dados de Plantio (Integração Futura)</p>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="pecuaria" className="mt-0">
                                    <Card className="p-8 border-dashed border-2 border-gray-200 bg-gray-50 flex flex-col items-center justify-center h-48">
                                        <p className="text-gray-400 font-medium">Dados de Pecuária (Integração Futura)</p>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* Timeline Feed (Kept at bottom or separate? User said it exists in Corporate Summary) */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Linha do tempo</h3>
                                <Card className="p-4 mb-6">
                                    <div className="relative">
                                        <input className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-lg text-sm outline-none border border-transparent focus:border-gray-200" placeholder="Escreva um comentário..." />
                                        <Button size="icon" variant="ghost" className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"><FileText className="w-4 h-4" /></Button>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button variant="secondary" size="sm" className="h-7 text-xs bg-gray-100 text-gray-500 hover:bg-gray-200">@ Mencionar...</Button>
                                    </div>
                                </Card>

                                <div className="space-y-6 pl-2">
                                    {timeline && timeline.length > 0 ? (
                                        timeline.map((event) => (
                                            <div className="flex gap-4 relative" key={event.id}>
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm">
                                                            <span className="font-bold">Sistema</span>: {event.action}
                                                        </p>
                                                        <span className="text-xs text-gray-400">{formatDate(event.createdAt)}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{event.details}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 text-sm">Nenhuma atividade recente.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Assinaturas" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Data de envio</TableHead><TableHead>Assinaturas</TableHead><TableHead>Status</TableHead><TableHead className="w-[300px]">Mensagem</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{signaturesData.map((item, index) => (<TableRow key={index} className="h-16"><TableCell className="font-medium">{item.name}</TableCell><TableCell className="text-gray-600">{item.date}</TableCell><TableCell>{item.completed} de {item.total}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell><TableCell className="text-gray-500 text-sm">{item.msg}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
                    </Card>
                </TabsContent>

                <TabsContent value="Documentação" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-4">
                                <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none" placeholder="Faça uma pesquisa..." /></div>
                                <Button variant="outline" className="rounded-full bg-white border-gray-200"><Filter className="w-4 h-4 mr-2" />Tipo</Button>
                                <Button variant="outline" className="rounded-full bg-white border-gray-200"><Users className="w-4 h-4 mr-2" />Pessoas</Button>
                            </div>
                            <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium border-0">Analisar Documentos</Button>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2"><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Matrícula do imóvel prestes a vencer. (Faltam 3 dias)</span></div><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Projeto vencido.</span></div></div>

                        {/* New Document Viewer Integration */}
                        <DocumentViewer
                            documents={(proposal?.documents || []).map(doc => ({
                                ...doc,
                                id: doc.id,
                                title: doc.title || doc.fileName || "Sem Título",
                                type: doc.fileType || 'pdf',
                                url: doc.url || null,
                                date: doc.createdAt,
                                status: doc.status
                            }))}
                        />

                        <div className="mt-8 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400">
                            <FileBox className="w-12 h-12 mb-4 text-gray-300" />
                            <p>Arraste um arquivo para fazer upload</p>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="Garantias" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md space-y-8 bg-gray-50/50">
                        {/* Imóveis rurais */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-semibold text-gray-700">Imóveis rurais</h4>
                            </div>
                            <Card className="overflow-hidden border-0 shadow-sm">
                                <Table>
                                    <TableHeader className="bg-white">
                                        <TableRow>
                                            <TableHead className="w-[40%]">Nome/Descrição</TableHead>
                                            <TableHead className="text-right">CPF/CNPJ</TableHead>
                                            <TableHead className="text-right">Matrícula</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guaranteesData.rural.map((item, i) => (
                                            <TableRow key={i} className="bg-white hover:bg-gray-50">
                                                <TableCell className="font-medium text-gray-500 py-4">{item.name}</TableCell>
                                                <TableCell className="text-gray-500 text-right py-4">{item.cpf}</TableCell>
                                                <TableCell className="text-right font-mono text-gray-400 py-4">{item.matricula}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                            <div className="flex justify-end mt-4">
                                <Button variant="outline" className="rounded-full text-green-700 border-green-700 hover:bg-green-50"><Plus className="w-4 h-4 mr-2" /> Adicionar imóvel</Button>
                            </div>
                        </div>

                        {/* Imóveis urbanos */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-semibold text-gray-700">Imóveis urbanos</h4>
                            </div>
                            <Card className="overflow-hidden border-0 shadow-sm">
                                <Table>
                                    <TableHeader className="bg-white">
                                        <TableRow>
                                            <TableHead className="w-[40%]">Nome/Descrição</TableHead>
                                            <TableHead className="text-right">CPF/CNPJ</TableHead>
                                            <TableHead className="text-right">Matrícula</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guaranteesData.urban.map((item, i) => (
                                            <TableRow key={i} className="bg-white hover:bg-gray-50">
                                                <TableCell className="font-medium text-gray-500 py-4">{item.name}</TableCell>
                                                <TableCell className="text-gray-500 text-right py-4">{item.cpf}</TableCell>
                                                <TableCell className="text-right font-mono text-gray-400 py-4">{item.matricula}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                            <div className="flex justify-end mt-4">
                                <Button variant="outline" className="rounded-full text-green-700 border-green-700 hover:bg-green-50"><Plus className="w-4 h-4 mr-2" /> Adicionar imóvel</Button>
                            </div>
                        </div>

                        {/* Máquinas */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-semibold text-gray-700">Pré-existente: Máquina</h4>
                            </div>
                            <Card className="overflow-hidden border-0 shadow-sm">
                                <Table>
                                    <TableHeader className="bg-white">
                                        <TableRow>
                                            <TableHead className="w-[40%]">Nome/Descrição</TableHead>
                                            <TableHead className="text-right">CPF/CNPJ</TableHead>
                                            <TableHead className="text-right">Matrícula</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guaranteesData.machine.map((item, i) => (
                                            <TableRow key={i} className="bg-white hover:bg-gray-50">
                                                <TableCell className="font-medium text-gray-500 py-4">{item.name}</TableCell>
                                                <TableCell className="text-gray-500 text-right py-4">{item.cpf}</TableCell>
                                                <TableCell className="text-right font-mono text-gray-400 py-4">{item.matricula}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="Perfil" className="mt-0">
                    <Card className="p-8 border-gray-100 shadow-md">
                        <div className="flex items-center justify-between mb-8"><h3 className="text-xl font-bold text-gray-900">Análise de Risco</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-50" onClick={handleDownload}>
                                    <Download className="w-4 h-4 mr-2" /> Baixar análise
                                </Button>
                                <Button className="bg-[#92dc49] hover:bg-[#7ab635] text-white border-0" onClick={() => setShowReport(true)}>
                                    <Eye className="w-4 h-4 mr-2" /> Visualizar relatório
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-10">
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Nome:</span>
                                <span className="font-medium text-gray-900">Fundação Agrônoma das Silva</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Capital social:</span>
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-900">R$ 2.000.000,00</span>
                                    <span className="text-gray-400">Score:</span>
                                    <span className="font-bold text-gray-900">400 (Risco Alto)</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">CNPJ:</span>
                                <span className="font-medium text-gray-900">00.000.000/0000-00</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Qtd. de funcionários:</span>
                                <span className="font-medium text-gray-900">200-500</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Fundação:</span>
                                <span className="font-medium text-gray-900">05/10/2020 (5 anos)</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Tipo de sociedade:</span>
                                <span className="font-medium text-gray-900">Limitada</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Município:</span>
                                <span className="font-medium text-gray-900">Lauro de Freitas/BA</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Opção tributária:</span>
                                <span className="font-medium text-gray-900">Simples</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Endereço:</span>
                                <span className="font-medium text-gray-900">Avenida Brigadeiro Mário Epinghaus, s/n 1º Andar, Centro — 42700-000</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <span className="text-sm text-gray-500">Ramo de atividade:</span>
                                <span className="font-medium text-gray-900">Agronegócio</span>
                            </div>
                        </div>
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4"><h4 className="font-bold text-gray-900">Resumo da Análise</h4><span className="text-xs text-gray-400">ID: c88vs777f7s87hf-84292849-fsFEEq0ship0-3</span><span className="text-xs text-gray-400 block ml-auto">Data de execução: 10/11/2025, 15:47</span></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-100"><p className="text-xs text-gray-400 font-bold mb-2">RAZÃO 1</p><p className="text-base font-semibold text-gray-800">Possui contratos com grande quantidade de parcelas</p></div>
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-100"><p className="text-xs text-gray-400 font-bold mb-2">RAZÃO 2</p><p className="text-base font-semibold text-gray-800">Possui utilização de alto valor de crédito do tipo emergencial nos últimos 3 meses</p></div>
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-100"><p className="text-xs text-gray-400 font-bold mb-2">RAZÃO 3</p><p className="text-base font-semibold text-gray-800">Possui pouco volume de pagamentos em dia</p></div>
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-100"><p className="text-xs text-gray-400 font-bold mb-2">RAZÃO 4</p><p className="text-base font-semibold text-gray-800">Possui histórico de atraso nos últimos 3 meses</p></div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4"><h4 className="font-bold text-gray-900">Análise de Risco</h4></div>
                            <div className="bg-red-50 p-4 rounded-md border border-red-100">
                                <p className="text-sm text-red-800 font-medium">Score de Crédito</p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="Projeto" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        {/* New Vertical Layout */}
                        <div className="flex flex-col gap-6">
                            {/* Address Section */}
                            <div>
                                <label className="text-xs text-gray-500 font-semibold uppercase">Endereço completo</label>
                                <p className="text-xl font-medium text-gray-900 mt-1">Q. 612 Sul Alameda 2, 16 - Arse, Palmas - TO, 77022-096</p>
                            </div>

                            {/* Info Cards Grid */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Localização</label>
                                    <p className="font-medium text-gray-900">Palmas, TO</p>
                                </div>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Para construção?</label>
                                    <p className="font-medium text-gray-900">Não</p>
                                </div>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Empreendimento dos Sócios?</label>
                                    <p className="font-medium text-gray-900">Sim</p>
                                </div>
                                <div className="bg-white p-4 border border-transparent rounded-lg">
                                    {/* Empty filler or extended logic */}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Registro do Imóvel</label>
                                    <p className="font-medium text-gray-900">Ok</p>
                                </div>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Ônus</label>
                                    <p className="font-medium text-gray-900">Ok</p>
                                </div>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Existe financiamento?</label>
                                    <p className="font-medium text-gray-900">Não</p>
                                </div>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <label className="text-xs text-gray-500 block mb-1">Avaliação do Imóvel</label>
                                    <p className="font-medium text-gray-900">Ok</p>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div>
                                <label className="text-lg font-bold text-gray-900 mb-4 block">Localização</label>
                                <div className="w-full h-[500px] bg-slate-200 rounded-xl overflow-hidden relative group">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight="0"
                                        marginWidth="0"
                                        src={`https://maps.google.com/maps?q=-10.243542,-48.324286&t=k&z=19&ie=UTF8&iwloc=&output=embed`}
                                        className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                    ></iframe>

                                    {/* Overlay for interaction styling if needed, currently transparent */}
                                    <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    * Coordenadas ajustáveis no código: <code className="bg-gray-100 px-1 rounded">-10.243542, -48.324286</code>
                                </p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* --- PENDÊNCIAS Tab (Same as Agro) --- */}
                <TabsContent value="Pendências" className="mt-0">
                    <Card className="min-h-[600px] p-0 border-gray-100 shadow-sm overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-white border-b border-gray-100">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[150px] font-semibold text-gray-400">Data</TableHead>
                                    <TableHead className="w-[300px] font-semibold text-gray-400">Descrição</TableHead>
                                    <TableHead className="font-semibold text-gray-400">Responsável</TableHead>
                                    <TableHead className="font-semibold text-gray-400">Prazo</TableHead>
                                    <TableHead className="font-semibold text-gray-400">Situação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendenciesData.map((item, index) => (
                                    <TableRow key={index} className="h-16 hover:bg-gray-50/50 border-b border-gray-50">
                                        <TableCell className="font-medium text-gray-900">{item.date}</TableCell>
                                        <TableCell className="text-gray-900 font-medium">{item.description}</TableCell>
                                        <TableCell className="text-gray-600 font-medium">{item.responsible}</TableCell>
                                        <TableCell className="text-gray-600 font-medium">{item.deadline}</TableCell>
                                        <TableCell className="text-gray-600 font-bold uppercase text-xs">
                                            {item.status}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* --- AUDITORIA Tab (Same as Agro) --- */}
                <TabsContent value="Auditoria" className="mt-0">
                    <Card className="min-h-[600px] p-0 border-gray-100 shadow-sm overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-white border-b border-gray-100">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[150px] font-semibold text-gray-400">Data</TableHead>
                                    <TableHead className="w-[200px] font-semibold text-gray-400">Responsável</TableHead>
                                    <TableHead className="font-semibold text-gray-400">Evento</TableHead>
                                    <TableHead className="font-semibold text-gray-400">Detalhes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditData.map((log, index) => (
                                    <TableRow key={index} className="h-16 hover:bg-gray-50/50 border-b border-gray-50">
                                        <TableCell className="font-medium text-gray-900">{log.date}</TableCell>
                                        <TableCell className="text-gray-600">{log.responsible}</TableCell>
                                        <TableCell className="text-gray-900 font-medium">{log.event}</TableCell>
                                        <TableCell className="text-gray-600">{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialog Implementation - Added Here */}
            <Dialog open={showReport} onOpenChange={setShowReport}>
                <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <DialogTitle>Relatório de Análise - {proposal?.name || "Vale do Cedro"}</DialogTitle>
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
        </div>
    );
}
