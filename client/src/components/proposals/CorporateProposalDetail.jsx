import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, ArrowLeft, Building2, Users, Hash, MoreHorizontal,
    Send, AlertTriangle, Download, Eye, FileText, Search,
    ChevronDown, Filter, FileBox, Plus, Check, ChevronLeft, CheckCircle2, XCircle,
    Headphones, FileEdit, ArrowRight, RefreshCw, X as XIcon
} from "lucide-react";
import { DetailItem, StatCard, StatusBadge, ScoreCircle, TimelineStep } from "./ProposalHelpers";
import { ProfileResult } from "../profile/ProfileResult";

const proposalTabs = [
    "Resumo", "Assinaturas", "Documentação", "Garantias", "Perfil", "Projeto", "Pendências", "Auditoria"
];

export function CorporateProposalDetail({ proposal, onBack }) {
    const [, setLocation] = useLocation();
    const userRole = localStorage.getItem('userRole') || 'gerente';
    const [activeTab, setActiveTab] = useState("Resumo");
    const [showReport, setShowReport] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signed, setSigned] = useState(false);
    const [showDocAnalysis, setShowDocAnalysis] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('Matrícula');

    const handleDownload = () => {
        alert("Download iniciado (simulação).");
    };

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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-full px-6 border-gray-300 text-gray-600 hover:bg-gray-50">
                                Ações
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-xl mt-2 border-gray-100">

                            <DropdownMenuItem asChild className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium">
                                <a href="/pdf_acoes.pdf" download="pdf_acoes.pdf" className="flex items-center w-full">
                                    <Download className="w-4 h-4 text-purple-600" />
                                    <span className="text-purple-600 underline decoration-purple-600/30 underline-offset-4">Gerar FIP-03</span>
                                </a>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <Headphones className="w-5 h-5 text-gray-600" />
                                Acionar BPO
                            </DropdownMenuItem>

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <FileEdit className="w-4 h-4 text-gray-600 ml-0.5" />
                                Registrar observação
                            </DropdownMenuItem>

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <FileEdit className="w-4 h-4 text-gray-600 ml-0.5" />
                                Solicitar complemento
                            </DropdownMenuItem>

                            {userRole === 'gerente' && (
                                <DropdownMenuItem
                                    className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1"
                                    onClick={() => {
                                        localStorage.setItem('userRole', 'juridico');
                                        window.dispatchEvent(new Event('storage'));
                                        setLocation('/propostas');
                                        if (window.location.pathname === '/propostas') {
                                            window.location.reload();
                                        }
                                    }}
                                >
                                    <Scale className="w-5 h-5 text-gray-600" />
                                    Enviar para jurídico
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <ArrowRight className="w-5 h-5 text-gray-600" />
                                Mover para An. de Risco
                            </DropdownMenuItem>

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <Send className="w-5 h-5 text-gray-600" />
                                Enviar para comitê
                            </DropdownMenuItem>

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <Send className="w-5 h-5 text-gray-600" />
                                Encaminhar para aprovação
                            </DropdownMenuItem>

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                                Solicitar Open Finance
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2 bg-gray-100" />

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-red-50 text-red-700 font-medium">
                                <XIcon className="w-5 h-5" />
                                Reprovar proposta
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
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
rounded - none border - b - 2 border - transparent px - 6 py - 3 text - gray - 500
data - [state = active]: border - [#92dc49] data - [state = active]: text - gray - 900 data - [state = active]: font - semibold data - [state = active]: bg - transparent
hover: text - gray - 700 transition - colors
    `}
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="Resumo" className="mt-0">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Main Content Column */}
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-4 gap-4">
                                <StatCard label="Valor da proposta" value={proposal?.value || "R$ 270.000.000,00"} />
                                <StatCard label="Etapa" value="Crédito + Jurídico" />
                                <StatCard label="Linha de crédito" value="Não rural" />
                                <div className="grid grid-cols-2 gap-2">
                                    <StatCard label="Andamento" value="58%" sub={
                                        /* Static Circle for Progress */
                                        <div className="relative w-5 h-5">
                                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                                <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                                <path className="text-green-500" strokeDasharray="58, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                            </svg>
                                        </div>
                                    } />
                                    <StatCard label="Status" value="" sub={<Badge className="bg-[#92dc49] hover:bg-[#7ab635]">Ok</Badge>} />
                                </div>
                            </div>

                            {/* Timeline Feed */}
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
                                    <div className="flex gap-4 relative">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm"><span className="font-bold">Daniel Alves</span> (Analista) criou uma pendência na proposta:</p>
                                                <span className="text-xs text-gray-400">10/11/25 15:33</span>
                                            </div>
                                            <div className="mt-3 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
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
                                                            <TableCell className="py-2 text-xs">16/11/25</TableCell>
                                                            <TableCell className="py-2 text-xs font-medium">Enviar CAR atualizado</TableCell>
                                                            <TableCell className="py-2 text-xs">Projetista</TableCell>
                                                            <TableCell className="py-2 text-xs">20/11</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 relative">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm"><span className="font-bold">Daniel Alves</span> (Analista) evoluiu esta proposta para a etapa <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-gray-100 text-gray-600">Crédito</Badge></p>
                                                <span className="text-xs text-gray-400">10/11/25 15:30</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">após 5 dias na etapa anterior.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 relative">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm"><span className="font-bold">Ronaldo Portobello</span> (Projetista) evoluiu esta proposta para a etapa <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-gray-100 text-gray-600">Técnica</Badge></p>
                                                <span className="text-xs text-gray-400">10/11/25 15:00</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">após 3 dias na etapa anterior.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 relative">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm"><span className="font-bold">Ronaldo Portobello</span> (Projetista) adicionou um comentário na proposta:</p>
                                                <span className="text-xs text-gray-400">10/11/25 15:00</span>
                                            </div>
                                            {/* Could add comment content here if needed */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="col-span-12 lg:col-span-4">
                            <Card className="p-6 h-full border-gray-100 shadow-md">
                                <h3 className="text-xl font-bold mb-6 text-gray-900">Resumo</h3>
                                <div className="space-y-1">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-300"><Building2 className="w-full h-full" /></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 font-medium">Empresa</p>
                                            <p className="text-sm font-medium text-gray-800">FFFagundes LTDA</p>
                                        </div>
                                    </div>
                                    <DetailItem icon={Building2} label="Indústria" value="Agronomia" />
                                    <DetailItem icon={Users} label="Tamanho" value="500-1000 funcionários" />
                                    <div className="my-6 border-t border-gray-100" />
                                    <DetailItem icon={User} label="Analista" value="Rodrigo" />
                                    <DetailItem icon={User} label="Projetista" value="Ronaldo Portobello" />
                                    <div className="my-6 border-t border-gray-100" />
                                    <DetailItem icon={Mail} label="E-mail" value="francisco@fffagundes.com.br" />
                                    <DetailItem icon={Phone} label="Telefone" value="(00) 000000-0000" />
                                    <DetailItem icon={MapPin} label="Endereço" value="Residencial Cláudio Marchetti, Rua Três – Cuiabá, MT 78076-308" />

                                    <div className="flex gap-2 mt-6">
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200"><Phone className="w-4 h-4 text-gray-600" /></Button>
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200"><Mail className="w-4 h-4 text-gray-600" /></Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Assinaturas" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Data de envio</TableHead><TableHead>Assinaturas</TableHead><TableHead>Status</TableHead><TableHead className="w-[300px]">Mensagem</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{signaturesData.map((item, index) => (<TableRow key={index} className="h-16"><TableCell className="font-medium">{item.name}</TableCell><TableCell className="text-gray-600">{item.date}</TableCell><TableCell>{item.completed} de {item.total}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell><TableCell className="text-gray-500 text-sm">{item.msg}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100" onClick={() => setShowSignatureModal(true)}><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
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
                            <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium border-0" onClick={() => setShowDocAnalysis(true)}>Analisar Documentos</Button>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2"><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Matrícula do imóvel prestes a vencer. (Faltam 3 dias)</span></div><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Projeto vencido.</span></div></div>
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Data de emissão</TableHead><TableHead>Data de validade</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{documentsData.map((doc, index) => (<TableRow key={index} className="h-14"><TableCell className="font-medium">{doc.name}</TableCell><TableCell>{doc.emission}</TableCell><TableCell>{doc.valid}</TableCell><TableCell><StatusBadge status={doc.status} /></TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100" onClick={() => setShowSignatureModal(true)}><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>

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
                    <ProfileResult isEmbedded={true} />
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
                                    ></iframe >

                                    {/* Overlay for interaction styling if needed, currently transparent */}
                                    < div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl" ></div >
                                </div >
                                <p className="text-xs text-gray-400 mt-2">
                                    * Coordenadas ajustáveis no código: <code className="bg-gray-100 px-1 rounded">-10.243542, -48.324286</code>
                                </p>
                            </div >
                        </div >
                    </Card >
                </TabsContent >

                {/* --- PENDÊNCIAS Tab (Same as Agro) --- */}
                < TabsContent value="Pendências" className="mt-0" >
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
                </TabsContent >

                {/* --- AUDITORIA Tab (Same as Agro) --- */}
                < TabsContent value="Auditoria" className="mt-0" >
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
                </TabsContent >
            </Tabs >

            {/* Dialog Implementation - Added Here */}
            < Dialog open={showReport} onOpenChange={setShowReport} >
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
            </Dialog >

            {/* Document Analysis Modal */}
            < Dialog open={showDocAnalysis} onOpenChange={setShowDocAnalysis} >
                <DialogContent className="max-w-[100vw] w-screen h-screen bg-[#333333] border-none rounded-none p-4 flex gap-4 overflow-hidden">
                    {/* Left Sidebar - Documents List (Floating Card) */}
                    <div className="w-56 bg-[#f8f9fa] rounded-2xl flex flex-col p-4 shadow-2xl" style={{ height: '50%' }}>
                        <div className="flex items-center gap-2 mb-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => setShowDocAnalysis(false)}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-xs truncate">{proposal?.name || "Vale do Cedro"}</span>
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
                                onClick={() => setSelectedDoc('CNPJ')}
                                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-3 cursor-pointer transition-all border ${selectedDoc === 'CNPJ' ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm' : 'hover:bg-white text-gray-500 border-transparent hover:border-gray-100 hover:shadow-sm'}`}
                            >
                                <FileText className={`w-4 h-4 ${selectedDoc === 'CNPJ' ? 'text-purple-500' : 'text-gray-400'}`} />
                                CNPJ
                            </div>
                        </div>
                    </div>

                    {/* Center - Image Viewer */}
                    <div className="flex-1 flex items-center justify-center relative rounded-2xl overflow-hidden bg-[#222]">
                        <div className="w-full h-full overflow-auto flex items-center justify-center p-8 custom-scrollbar-dark">
                            {selectedDoc === 'Matrícula' ? (
                                <div className="relative shadow-2xl origin-center">
                                    <div className="w-[500px] h-[700px] bg-[#fdfbf7] relative text-[9px] font-serif leading-relaxed p-10 select-none shadow-black/50 shadow-2xl">
                                        <div className="absolute top-0 right-0 p-4 text-right text-[10px]">São Paulo, <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">05</span> de <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">novembro</span> de <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">1998.</span></div>

                                        <div className="mt-8 text-justify">
                                            <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">IMÓVEL:-</span> Terreno situado na Rua <span className="bg-gray-200 text-transparent rounded px-2">XXXXXX</span>, constituído pelo <span className="border border-blue-600 text-blue-800 bg-blue-50/30 px-1">lote nº 17 da quadra 8</span>, do <span className="bg-gray-200 text-transparent rounded px-2">XXXXXX</span> 29º Subdistrito - Santo Amaro, de forma irregular, medindo 19,20m de frente; 33,10m do lado direito de quem da rua olha o imóvel, confrontando com o lote nº 16; 27,90m do lado esquerdo confrontando com o lote nº 1, e 25,50m nos fundos confrontando com os lotes 2 e 3, encerrando a área de 670,00m2.
                                        </div>

                                        <div className="mt-6 text-justify">
                                            <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">PROPRIETÁRIO:-</span> <span className="bg-blue-100/50 border border-blue-400 px-1 text-blue-800">EMPRESA X LTDA</span>, com sede nesta Capital.
                                        </div>

                                        <div className="mt-10 flex justify-center opacity-70">
                                            <div className="text-center">
                                                <div className="border-b border-black w-32 mb-1"></div>
                                                <span>Oficial Substituto</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Zoom Controls Overlay */}
                                    <div className="absolute bottom-6 right-6 bg-[#444] text-white rounded-full px-3 py-1 text-[10px] flex items-center gap-2 shadow-lg backdrop-blur-md bg-opacity-80">
                                        <button className="hover:text-gray-300">-</button>
                                        <span className="font-mono">350%</span>
                                        <button className="hover:text-gray-300">+</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative shadow-2xl origin-center text-white">
                                    <div className="text-center p-8 border border-dashed border-gray-600 rounded-xl">
                                        <p>Documento {selectedDoc} não disponível para visualização.</p>
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
                                            <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Proprietário</p>
                                                <p className="text-xs text-green-600 font-bold mt-1">Compatível com a proposta.</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">CNPJ</p>
                                                <p className="text-xs text-gray-400 mt-1">Regular na Receita Federal</p>
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
            </Dialog >

            {/* Signature Modal Overlay */}
            {
                showSignatureModal && (
                    <div className="fixed inset-0 z-50 flex DialogOverlay bg-[#333]/60 backdrop-blur-sm justify-center items-center">
                        <div className="flex max-w-[1240px] w-full mx-4 h-[85vh] bg-transparent gap-6">
                            {/* Context Left Panel */}
                            <div className="w-[260px] flex flex-col gap-4 self-start mt-8">
                                <Button
                                    variant="outline"
                                    className="bg-white rounded-xl shadow-sm border-none justify-start px-4 py-6 w-full"
                                    onClick={() => setShowSignatureModal(false)}
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2 text-gray-400" />
                                    <span className="font-bold text-[15px] text-gray-700">{proposal?.name || "Vale do Cedro"}</span>
                                </Button>

                                <div className="bg-white rounded-2xl shadow-sm p-5 text-sm w-full relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#92dc49]"></div>
                                    <h4 className="font-bold text-gray-900 mb-2 text-[15px]">Parecer de análise</h4>
                                    <div className="space-y-1 text-gray-500 text-[13px]">
                                        <p>Data de envio: 24/01/2026</p>
                                        <p>Responsável: Daniel Alves (Analista)</p>
                                        <p>Tempo de espera: 2d</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview (Center) */}
                            <div className="flex-1 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
                                {/* Dark green header */}
                                <div className="bg-[#00502b] text-white px-8 py-5 flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-1">
                                            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[14px] border-b-[#92dc49] border-r-[8px] border-r-transparent transform -rotate-12"></div>
                                            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[14px] border-b-white border-r-[8px] border-r-transparent transform rotate-12"></div>
                                        </div>
                                        <span className="font-bold text-xl tracking-tight leading-none">banco da<br /><span className="text-lg">amazônia</span></span>
                                    </div>
                                    <div className="h-10 w-px bg-white/20"></div>
                                    <h2 className="text-xl font-medium tracking-wide">Parecer de análise</h2>
                                </div>

                                <div className="flex-1 overflow-auto p-12 bg-gray-50/30 custom-scrollbar">
                                    <div className="text-gray-800 space-y-6 text-[14px] leading-relaxed max-w-[650px] mx-auto text-justify">
                                        <h3 className="font-bold text-[15px]">IX - OUTRAS CONSIDERAÇÕES</h3>

                                        <p><span className="font-bold">9.1.</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vulputate dui non mauris pellentesque, eu ornare eros porttitor. Ut facilisis et ex ac rutrum. Donec neque metus, tempor quis mi non, pretium ullamcorper sem. Maecenas pharetra posuere neque eu rhoncus. Integer est metus, sagittis eu bibendum sed, finibus sed lorem. Etiam mattis eu magna dignissim eleifend. Nullam eros mauris, hendrerit quis dictum fringilla, semper et nisl. In sit amet erat ut dui mattis ultricies ac id felis.</p>

                                        <p><span className="font-bold">9.2.</span> Nulla at tellus vel metus vehicula ornare. Maecenas varius, sapien nec dapibus pretium, libero felis aliquet velit, quis dignissim tortor turpis vel dui. Nunc at ante imperdiet, vestibulum lectus efficitur, varius turpis. Cras finibus, turpis eget dignissim tincidunt, diam risus imperdiet augue, id ultrices tellus nibh id neque. Aliquam suscipit malesuada sapien eu placerat. Pellentesque blandit risus neque, non fermentum diam elementum ut. Vivamus blandit ante at egestas pretium.</p>

                                        <p><span className="font-bold">9.3.</span> Praesent at condimentum mauris, eget cursus erat. Vestibulum nec malesuada nisl. Nulla pretium, quam ac blandit lacinia, elit est imperdiet urna, vel commodo eros nisi vestibulum libero. Nam vel iaculis ex. Nam magna enim, pretium a ultrices ut, ullamcorper vitae tellus. Duis neque mauris, ullamcorper quis lorem sed, posuere porttitor elit. Nunc at felis dui. Praesent iaculis felis id neque laoreet, sit amet scelerisque quam volutpat.</p>

                                        <h3 className="font-bold text-[15px] mt-8">X - CONCLUSÃO</h3>

                                        <p><span className="font-bold">10.1.</span> De acordo com as informações apresentadas na peça técnica, econômica e financeira, o crédito demonstra viabilidade razão pela qual a equipe de análise manifesta-se favorável ao deferimento do crédito, nas condições estabelecidas conforme abaixo:</p>

                                        <div className="pl-8 space-y-2 mt-4">
                                            <p><span className="font-bold">10.1.1.</span> Recurso: FNO - Amazônia empresarial</p>
                                            <p><span className="font-bold">10.1.2.</span> Valor do financiamento: R$ 8.000.000,00</p>
                                            <p><span className="font-bold">10.1.3.</span> Prazo (em meses):</p>
                                            <div className="pl-12 grid grid-cols-[100px_1fr] gap-y-1">
                                                <span className="font-bold">10.1.3.1.</span><span>Carência: <span className="ml-[30px]">24</span></span>
                                                <span className="font-bold">10.1.3.2.</span><span>Amortização: <span className="ml-[10px]">120</span></span>
                                                <span className="font-bold">10.1.3.3.</span><span>Total: <span className="ml-[54px]">144</span></span>
                                            </div>
                                            <p className="mt-4"><span className="font-bold">10.1.4.</span> Encargos</p>
                                            <div className="pl-12 text-gray-700 leading-tight mt-1">
                                                <p>Taxa de Juros (a.a.): 0,00% COMP. TFCpós (ESTIMADAS) MÊS REF: 01/2026 - S/BÔNUS: x,xxxxxx / C/BÔNUS: x,xxxxxx. Município com Fator de Localização Prioritário ou Não Prioritário.</p>
                                                <p className="mt-2">Encargos na Carência 100% Exigidos. A taxa de juros estimada na Análise foi calculada utilizando o IPCA...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Right Sidebar */}
                            <div className="w-[280px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col self-start mt-8">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-[15px] font-bold text-gray-900">Status de Assinatura ({signed ? '3' : '2'}/3)</h3>
                                </div>
                                <div className="p-6 flex-1 space-y-6">
                                    {/* Analista */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5"><div className="w-4 h-4 rounded bg-[#92dc49] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div></div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900">Analista</h4>
                                            <p className="text-[11px] text-gray-500">Daniel Alves - 000.000.000-00</p>
                                            <p className="text-[10px] text-gray-400">12/12/25 15h30</p>
                                        </div>
                                    </div>

                                    {/* Supervisor */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5"><div className="w-4 h-4 rounded bg-[#92dc49] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div></div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900">Supervisor</h4>
                                            <p className="text-[11px] text-gray-500">Ronaldo R - 000.000.000-00</p>
                                            <p className="text-[10px] text-gray-400">12/12/25 15h30</p>
                                        </div>
                                    </div>

                                    {/* Gerente (Você) */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {signed ? (
                                                <div className="w-4 h-4 rounded bg-[#92dc49] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                            ) : (
                                                <div className="w-4 h-4 rounded border border-gray-300"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900">Gerente (Você)</h4>
                                            <p className="text-[11px] text-gray-500">Ronaldo R - 000.000.000-00</p>
                                            <p className={`text-[10px] text-gray-400 mt-1`}>{signed ? '24/01/26 10h00' : 'Aguardando...'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-3 bg-white border-t border-gray-50">
                                    {!signed && (
                                        <Button
                                            className="w-full bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full py-5 text-sm font-semibold shadow-sm"
                                            onClick={() => {
                                                setSigned(true);
                                                setTimeout(() => setShowSignatureModal(false), 1000);
                                            }}
                                        >
                                            Assinar
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full text-green-700 border-green-700 hover:bg-green-50 rounded-full py-5 text-sm font-semibold bg-white">
                                        <Download className="w-4 h-4 mr-2" />
                                        Baixar documento
                                    </Button>
                                    <Button variant="outline" className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full py-5 text-sm font-semibold bg-white">
                                        Solicitar complemento
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
