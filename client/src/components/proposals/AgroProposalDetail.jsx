import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, ArrowLeft, Building2, Users, Hash, MoreHorizontal,
    Send, AlertTriangle, XCircle, CheckCircle2, Download, Eye, FileText, Search,
    ChevronDown, Filter, FileBox
} from "lucide-react";
import { RatingCard, DetailItem, StatCard, StatusBadge, ScoreCircle, TimelineStep } from "./ProposalHelpers";

const proposalTabs = [
    "Resumo", "Assinaturas", "Perfil", "Projeto", "Linha do tempo",
    "Documentação", "Garantias", "Pendências", "Auditoria"
];

export function AgroProposalDetail({ proposal, onBack }) {
    const [activeTab, setActiveTab] = useState("Resumo");
    const [showReport, setShowReport] = useState(false);

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
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-4">
                            <Card className="p-6 h-full border-gray-100 shadow-md">
                                <h3 className="text-xl font-bold mb-6 text-gray-900">Dados Cadastrais</h3>
                                <div className="space-y-1">
                                    <DetailItem icon={Building2} label="Empresa" value={proposal?.name || "Fernando Fagundes"} />
                                    <DetailItem icon={Building2} label="Indústria" value="Agronomia" />
                                    <DetailItem icon={Users} label="Tamanho" value="500-1000 funcionários" />
                                    <DetailItem icon={Hash} label="Faturamento" value="R$ 300.000.000 / ano" />
                                    <div className="my-6 border-t border-gray-100" />
                                    <DetailItem icon={User} label="Cliente" value="Fernando Fagundes" />
                                    <DetailItem icon={Hash} label="CPF" value="000.000.000-00" />
                                    <div className="my-6 border-t border-gray-100" />
                                    <DetailItem icon={Mail} label="E-mail" value="fernando@fffagundes.com.br" />
                                    <DetailItem icon={Phone} label="Telefone" value="(00) 000000-0000" />
                                    <DetailItem icon={MapPin} label="Endereço" value="Residencial Cláudio Marchetti, Rua Três – Cuiabá, MT 78076-308" />
                                    <div className="my-6 border-t border-gray-100" />
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-400">Limite atual</span>
                                        <span className="text-sm font-medium text-gray-900">R$ 000.000.000,00</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs text-gray-400">Rating Interno</span>
                                        <span className="text-sm font-medium text-gray-900">0.5%</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-6">
                                        <p className="text-xs text-gray-400 mb-3">Histórico</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center"><p className="text-sm font-medium">Proposta anterior</p><Badge className="bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 text-[10px]">FINALIZADO</Badge></div>
                                            <div className="flex justify-between items-center"><p className="text-sm font-medium">Proposta anterior</p><Badge className="bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 text-[10px]">FINALIZADO</Badge></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                                <StatCard label="Valor da proposta" value={proposal?.value || "R$ 50.000.000,00"} />
                                <StatCard label="Linha de crédito" value={proposal?.line || "FNO - Agro"} />
                                <StatCard label="Alertas" value="3" sub={<div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-orange-500"></div><div className="w-2 h-2 rounded-full bg-yellow-400"></div></div>} />
                                <StatCard label="Etapa" value="" sub={<Badge variant="secondary" className="bg-orange-50 text-orange-600 font-normal">An. Técnica</Badge>} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <RatingCard title="Rating Financeiro" value={proposal?.rating || "A+"} color={proposal?.rating?.includes('C') ? 'orange' : 'green'} />
                                <RatingCard title="Rating de Garantia" value="C-" color="orange" />
                                <RatingCard title="Score Geoespacial" value="72/100" color="yellow" />
                            </div>
                            <div className="grid grid-cols-2 gap-6 h-full">
                                <Card className="p-5 border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">Alertas & Compliance</h3>
                                    <div className="space-y-2">
                                        <div className="p-3 bg-red-50 rounded-md border border-red-100 flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><div><p className="text-xs font-bold text-red-700">Prodes (Desmatamento pós-2008)</p><p className="text-[10px] text-red-500 uppercase font-bold">DETECTADO — CRÍTICO</p></div></div>
                                        <div className="p-3 bg-orange-50 rounded-md border border-orange-100 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" /><div><p className="text-xs font-bold text-orange-700">Sobreposição de Reserva Legal</p><p className="text-[10px] text-orange-600">0,5%</p></div></div>
                                        <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /><div><p className="text-xs font-bold text-green-700">Divergência (Declarada X Desenhada)</p><p className="text-[10px] text-green-600">&lt; 1% — OK</p></div></div>
                                    </div>
                                </Card>
                                <Card className="p-5 border-gray-100 shadow-sm bg-gray-50/50">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">Sugestão de Precificação</h3>
                                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                        <p className="text-sm font-bold text-gray-900 mb-2">Risco climático médio detectado na região.</p>
                                        <p className="text-sm font-bold text-gray-900">Motor sugere aumentar spread em 0.5% ou exigir 130% de garantia.</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- Other Tabs (Reused) --- */}
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
                            <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium border-0">Analisar Documentos</Button>
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
                    <Card className="p-6 border-gray-100 shadow-md">
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

            {/* Same Dialog Component */}
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
        </div>
    );
}
