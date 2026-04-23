import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, ArrowLeft, Building2, Users, Hash, MoreHorizontal,
    Send, AlertTriangle, AlertCircle, XCircle, CheckCircle2, Download, Eye, FileText, Search,
    ChevronDown, Filter, FileBox, Sprout, Tractor, Timer, TrendingUp, Droplets,
    Thermometer, Ruler, Gavel, Scale, Check, ChevronLeft,
    Headphones, FileEdit, ArrowRight, RefreshCw, X as XIcon
} from "lucide-react";
import { RatingCard, DetailItem, StatCard, StatusBadge, ScoreCircle, TimelineStep } from "./ProposalHelpers";
import { ProfileResult } from "../profile/ProfileResult";
import { advanceProposal, ROLE_ACTIONS } from "@/lib/proposalFlow";
import { logActivity } from "@/lib/activityLog";

const proposalTabs = [
    "Resumo", "Cadastro", "Agro", "Financeiro", "Crédito e Compliance",
    "Garantias", "Documentos", "Linha do tempo"
];

const resumoData = {
    cliente: "Fernando Freire Oliveira",
    segmento: "Agro",
    tamanho: "20-50 funcionários",
    faturamento: "R$ 2.630.000 / ano",
    cultura: "Soja",
    endereco: "Residencial Cláudio Marchetti, Rua Três – Cuiabá, MT 78076-308",
    telefone: "(00) 000000-0000",
    cpf: "000.000.000-00",
    email: "fernando@fffagundes.com.br",
    dataInicio: "02/01/2026",
    produto: "FNO",
    valorSolicitado: "R$ 850.000,00",
    prazo: "60 meses",
    taxaEstimadas: "1,2–1,5% a.m.",
    statusOperacao: "Ok",
    etapa: "Crédito",
    etapaDetalhe: "há 6 dias",
    fila: "GEOPE",
    responsavel: "Daniel Alves (analista)",
    aprovacao: "Aprovado com Condições",
    condicoes: [
        "Manter garantias reais acima de 130%",
        "Apresentar atualização semestral dos balanços",
        "Seguro agrícola obrigatório"
    ],
    motivos: [
        "Forte histórico de pagamentos",
        "Garantias robustas (imóvel rural)",
        "Setor do Agronegócio crescendo",
        "Score de crédito elevado"
    ],
    mitigadores: [
        "Reforço de garantia pessoal",
        "Acompanhamento trimestral de fluxo de caixa",
        "Restrição para novos financiamentos acima de 20%"
    ]
};

export function AgroProposalDetail({ proposal, onBack }) {
    const [, setLocation] = useLocation();
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'gerente');

    useEffect(() => {
        const handler = () => {
            setUserRole(localStorage.getItem('userRole') || 'gerente');
        };
        window.addEventListener('storage', handler);
        window.addEventListener('roleChanged', handler);
        return () => {
            window.removeEventListener('storage', handler);
            window.removeEventListener('roleChanged', handler);
        };
    }, []);

    const [activeTab, setActiveTab] = useState("Resumo");
    const [showReport, setShowReport] = useState(false);
    const [showDocAnalysis, setShowDocAnalysis] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('Matrícula');
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signed, setSigned] = useState(false);
    const [selectedFarmId, setSelectedFarmId] = useState("monte-verde");
    const [creditDetailTab, setCreditDetailTab] = useState("validacoes");
    const [selectedGuarantee, setSelectedGuarantee] = useState(null);
    const [guaranteeDetailTab, setGuaranteeDetailTab] = useState("resumo");
    const [documentsSubTab, setDocumentsSubTab] = useState("documentos");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [pendingUploadFile, setPendingUploadFile] = useState(null);
    const [selectedDocumentPreview, setSelectedDocumentPreview] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionReason, setActionReason] = useState("");

    const handleApprove = () => {
        advanceProposal(proposal.id, "APROVADA", actionReason);
        logActivity("analista", "Aprovou proposta", proposal.id, proposal.name);
        setShowApproveModal(false);
        setActionReason("");
        setLocation("/propostas");
        setTimeout(() => window.location.reload(), 100);
    };

    const handleReject = () => {
        if (!actionReason.trim()) return;
        advanceProposal(proposal.id, "REPROVADA", actionReason);
        logActivity("analista", "Reprovou proposta", proposal.id, proposal.name);
        setShowRejectModal(false);
        setActionReason("");
        setLocation("/propostas");
        setTimeout(() => window.location.reload(), 100);
    };

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
    const initialDocumentRegistry = [
        { id: "doc-1", name: "Matrícula", emission: "02/11/2025", valid: "20/11/2025", status: "OK", analysisStatus: "CONCLUÍDA", fileSize: "2.8 MB" },
        { id: "doc-2", name: "Projeto", emission: "02/11/2025", valid: "12/11/2025", status: "OK", analysisStatus: "CONCLUÍDA", fileSize: "4.1 MB" },
        { id: "doc-3", name: "IRPF 2024", emission: "02/11/2025", valid: "31/12/2025", status: "OK", analysisStatus: "CONCLUÍDA", fileSize: "1.9 MB" },
        { id: "doc-4", name: "Registro", emission: "02/11/2025", valid: "30/11/2025", status: "OK", analysisStatus: "CONCLUÍDA", fileSize: "2.4 MB" },
        { id: "doc-5", name: "IRPF 2025", emission: "02/11/2025", valid: "31/12/2026", status: "OK", analysisStatus: "CONCLUÍDA", fileSize: "2.2 MB" },
        { id: "doc-6", name: "Simulação", emission: "01/11/2025", valid: "31/12/2026", status: "OK", analysisStatus: "CONCLUÍDA", fileSize: "1.3 MB" },
    ];
    const initialSignaturesRegistry = [
        { id: "sig-1", name: "Parecer técnico", analyst: "Daniel Alves", completed: 2, total: 3, status: "PENDENTE", msg: "Sua assinatura está pendente." },
        { id: "sig-2", name: "Parecer de análise", analyst: "Daniel Alves", completed: 3, total: 3, status: "OK", msg: "" },
    ];
    // Load uploaded documents from proposal
    const uploadedDocsForProposal = (proposal?.documents || []).map((doc, i) => ({
        id: `uploaded-${i}`,
        name: doc.name,
        emission: new Date(doc.uploadedAt || Date.now()).toLocaleDateString("pt-BR"),
        valid: "Sem validade",
        status: "OK",
        analysisStatus: "AGUARDANDO",
        fileSize: doc.size > 0 ? (doc.size / (1024 * 1024)).toFixed(1) + " MB" : "—",
        fileName: doc.fileName || doc.name,
        data: doc.data || null,
    }));

    const dynamicInitialRegistry = uploadedDocsForProposal.length > 0
        ? uploadedDocsForProposal
        : initialDocumentRegistry;
    const [documentRegistry, setDocumentRegistry] = useState(dynamicInitialRegistry);

    // Update documents when proposal changes
    useEffect(() => {
        setDocumentRegistry(dynamicInitialRegistry);
    }, [proposal?.id]);

    const [signatureRegistry, setSignatureRegistry] = useState(initialSignaturesRegistry);

    const guaranteesData = {
        rural: [{ name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }, { name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }],
        urban: [{ name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }, { name: "Nome/Descrição", cpf: "20/11/2025", matricula: "********" }],
        machine: [{ name: "Nome/Descrição", cpf: "********", matricula: "********" }]
    };
    const guaranteeItems = [
        { name: "Fazenda Esperança", type: "Imóvel", value: "R$ 320.000,00", onus: "Nenhum", insurance: "Vigente", registry: "Registrado" },
        { name: "Penhor Agrícola", type: "Safra", value: "R$ 560.000,00", onus: "Hipoteca", insurance: "Vigente", registry: "Pendente" },
    ];

    const auditData = [
        { date: "16/11/25", responsible: "Projetista", event: "stage_created", details: "Técnica → Crédito" },
        { date: "16/11/25", responsible: "Projetista", event: "pendencia_created", details: "Solicitado CAR" },
    ];

    const pendenciesData = [
        { date: "16/11/25", description: "Enviar CAR atualizado", responsible: "Projetista", deadline: "20/11/25", status: "ABERTA" },
        { date: "16/11/25", description: "Atualizar matrícula", responsible: "Projetista", deadline: "20/11/25", status: "ABERTA" },
    ];
    const proposalStorageId = String(proposal?.id || "default");
    const docsStorageKey = `proposal:${proposalStorageId}:documents`;
    const signaturesStorageKey = `proposal:${proposalStorageId}:signatures`;

    useEffect(() => {
        const savedDocs = localStorage.getItem(docsStorageKey);
        const savedSignatures = localStorage.getItem(signaturesStorageKey);
        if (savedDocs) {
            try { setDocumentRegistry(JSON.parse(savedDocs)); } catch { setDocumentRegistry(initialDocumentRegistry); }
        } else {
            setDocumentRegistry(initialDocumentRegistry);
        }
        if (savedSignatures) {
            try { setSignatureRegistry(JSON.parse(savedSignatures)); } catch { setSignatureRegistry(initialSignaturesRegistry); }
        } else {
            setSignatureRegistry(initialSignaturesRegistry);
        }
    }, [proposalStorageId]);

    useEffect(() => {
        localStorage.setItem(docsStorageKey, JSON.stringify(documentRegistry));
    }, [docsStorageKey, documentRegistry]);

    useEffect(() => {
        localStorage.setItem(signaturesStorageKey, JSON.stringify(signatureRegistry));
    }, [signaturesStorageKey, signatureRegistry]);

    const handleUploadFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) setPendingUploadFile(file);
    };

    const handleConfirmUpload = () => {
        if (!pendingUploadFile) return;
        const today = new Date();
        const emission = today.toLocaleDateString("pt-BR");
        const valid = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toLocaleDateString("pt-BR");
        const mbSize = `${Math.max(0.1, pendingUploadFile.size / (1024 * 1024)).toFixed(1)} MB`;
        setDocumentRegistry((prev) => [
            ...prev,
            {
                id: `doc-${Date.now()}`,
                name: pendingUploadFile.name.replace(/\.[^/.]+$/, ""),
                emission,
                valid,
                status: "OK",
                analysisStatus: "CONCLUÍDA",
                fileSize: mbSize,
            },
        ]);
        setPendingUploadFile(null);
        setIsUploadModalOpen(false);
    };

    const handleSignAsAnalyst = (signatureName) => {
        setSignatureRegistry((prev) =>
            prev.map((item) => {
                if (item.name !== signatureName) return item;
                const nextCompleted = Math.min(item.total, item.completed + 1);
                return {
                    ...item,
                    completed: nextCompleted,
                    status: nextCompleted >= item.total ? "OK" : "PENDENTE",
                    msg: nextCompleted >= item.total ? "" : "Sua assinatura está pendente.",
                };
            }),
        );
    };

    const agroProperties = [
        {
            id: "monte-verde",
            name: "FAZENDA MONTE VERDE V, VIII E REDENÇÃO I",
            city: "Nova Canaã do Norte, MT",
            areaTotal: "3.200 ha",
            areaAgricultavel: "2.400 ha",
            reservaLegal: "800 ha",
            areaPerene: "1200 ha",
            areaTemporaria: "1200 ha",
            produtividade: "58 sc/ha",
            benchmark: "55 sc/ha",
            produtividadeHint: "+5.45% acima do benchmark",
            climate: "Tropical, Monção",
            aptidaoPrimary: "Classe 3 (abc) - Restrita",
            aptidaoSecondary: "Classe 6 - Inapta / Preserve",
            altitude: { max: "392 m", med: "283 m", min: "255 m" },
            topo: { plano: "56.2%", suave: "36.2%", ondulado: "7.4%" },
            legal: { arrendamento: "SIM", assentamento: "NÃO", meeiro: "NÃO" },
        },
        {
            id: "barra-bonita",
            name: "FAZENDA BARRA BONITA - GLEBA A-1",
            city: "Nova Canaã do Norte, MT",
            areaTotal: "2.950 ha",
            areaAgricultavel: "2.100 ha",
            reservaLegal: "850 ha",
            areaPerene: "980 ha",
            areaTemporaria: "1120 ha",
            produtividade: "54 sc/ha",
            benchmark: "52 sc/ha",
            produtividadeHint: "+3.84% acima do benchmark",
            climate: "Tropical, estação seca",
            aptidaoPrimary: "Classe 3 (ab) - Moderada",
            aptidaoSecondary: "Classe 5 - Restrição alta",
            altitude: { max: "376 m", med: "271 m", min: "244 m" },
            topo: { plano: "49.0%", suave: "40.5%", ondulado: "10.5%" },
            legal: { arrendamento: "NÃO", assentamento: "NÃO", meeiro: "SIM" },
        },
        {
            id: "tucano",
            name: "FAZENDA TUCANO MAT 1209",
            city: "Nova Canaã do Norte, MT",
            areaTotal: "3.480 ha",
            areaAgricultavel: "2.620 ha",
            reservaLegal: "860 ha",
            areaPerene: "1320 ha",
            areaTemporaria: "1300 ha",
            produtividade: "61 sc/ha",
            benchmark: "56 sc/ha",
            produtividadeHint: "+8.92% acima do benchmark",
            climate: "Tropical, quente úmido",
            aptidaoPrimary: "Classe 2 (abc) - Boa",
            aptidaoSecondary: "Classe 6 - Inapta / Preserve",
            altitude: { max: "401 m", med: "292 m", min: "260 m" },
            topo: { plano: "61.8%", suave: "31.0%", ondulado: "7.2%" },
            legal: { arrendamento: "SIM", assentamento: "NÃO", meeiro: "NÃO" },
        },
    ];
    const selectedFarm = agroProperties.find((farm) => farm.id === selectedFarmId) || agroProperties[0];
    const cadastroData = {
        personType: proposal?.registrationData?.personType || "Pessoa física",
        birthDate: proposal?.registrationData?.birthDate || "24/05/1968",
        cpf: proposal?.registrationData?.cpf || "000.000.000-00",
        civilStatus: proposal?.registrationData?.civilStatus || "Casado",
        dependents: proposal?.registrationData?.dependents || "2",
        rg: proposal?.registrationData?.rg || "000.000-00",
        issuingAgency: proposal?.registrationData?.issuingAgency || "SSP/PA",
        nationality: proposal?.registrationData?.nationality || "Brasileiro",
        gender: proposal?.registrationData?.gender || "Masculino",
        contactEmail: proposal?.registrationData?.contactEmail || "diego.santos@email.com",
        contactPhone: proposal?.registrationData?.contactPhone || "(00) 0000-0000",
        sourceChannel: proposal?.registrationData?.sourceChannel || "Agência",
        cep: proposal?.registrationData?.cep || "00.000-000",
        georeference: proposal?.registrationData?.georeference || "Nova Canaã do Norte, MT",
        street: proposal?.registrationData?.street || "Rua do Corvo, Zumbi do Pacheco",
        neighborhood: proposal?.registrationData?.neighborhood || "Zumbi do Pacheco",
        city: proposal?.registrationData?.city || "Jaboatão dos Guararapes",
        uf: proposal?.registrationData?.uf || "PE",
        number: proposal?.registrationData?.number || "14",
        latitude: proposal?.registrationData?.latitude || "-3.2975",
        longitude: proposal?.registrationData?.longitude || "-3.2975",
        totalArea: proposal?.registrationData?.totalArea || "1.200 ha",
    };
    const financeiroSeries = [
        { year: "2016", receita: 17, custo: 10 },
        { year: "2017", receita: 20, custo: 12 },
        { year: "2018", receita: 25, custo: 16 },
        { year: "2019", receita: 20, custo: 16 },
        { year: "2020", receita: 32, custo: 13 },
        { year: "2021", receita: 23, custo: 17 },
        { year: "2022", receita: 30, custo: 21 },
        { year: "2023", receita: 26, custo: 20 },
        { year: "2024", receita: 29, custo: 16 },
        { year: "2025", receita: 35, custo: 25 },
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
                                        advanceProposal(proposal.id, "PENDENTE_COMITE");
                                        logActivity("gerente", "Enviou proposta para comitê", proposal.id, proposal.name);
                                        setLocation("/propostas");
                                        setTimeout(() => window.location.reload(), 100);
                                    }}
                                >
                                    <ArrowRight className="w-5 h-5 text-gray-600" />
                                    Enviar para comitê
                                </DropdownMenuItem>
                            )}

                            {userRole === 'gerente' && (
                                <DropdownMenuItem
                                    className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1"
                                    onClick={() => {
                                        advanceProposal(proposal.id, "EM_ANALISE_JURIDICA");
                                    }}
                                >
                                    <Scale className="w-5 h-5 text-gray-600" />
                                    Enviar para jurídico
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem className="gap-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium my-1">
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                                Solicitar Open Finance
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2 bg-gray-100" />

                            {userRole === 'analista' && (
                                <DropdownMenuItem
                                    className="gap-3 py-3 cursor-pointer hover:bg-red-50 text-red-700 font-medium"
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    <XIcon className="w-5 h-5" />
                                    Reprovar proposta
                                </DropdownMenuItem>
                            )}

                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Gerente: Enviar para comitê */}
                    {userRole === 'gerente' && (
                        <Button
                            className="rounded-full px-6 bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 shadow-lg shadow-green-100"
                            onClick={() => {
                                advanceProposal(proposal.id, "PENDENTE_COMITE");
                                logActivity("gerente", "Enviou proposta para comitê", proposal.id, proposal.name);
                                setLocation("/propostas");
                                setTimeout(() => window.location.reload(), 100);
                            }}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Enviar para comitê
                        </Button>
                    )}

                    {/* Analista: Aprovar → Jurídico e Reprovar */}
                    {userRole === 'analista' && (
                        <>
                            <Button
                                className="rounded-full px-6 bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 shadow-lg shadow-green-100"
                                onClick={() => setShowApproveModal(true)}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Aprovar → Jurídico
                            </Button>
                            <Button
                                variant="destructive"
                                className="rounded-full px-6"
                                onClick={() => setShowRejectModal(true)}
                            >
                                <XIcon className="w-4 h-4 mr-2" />
                                Reprovar
                            </Button>
                        </>
                    )}
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
                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                            <Card className="col-span-12 lg:col-span-8 p-4 border-gray-200 shadow-sm">
                                <p className="text-sm text-gray-600 mb-3">Dados cadastrais</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex gap-2 text-sm"><User className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Cliente</p><p className="text-gray-900">Fernando Freire Oliveira</p></div>
                                        <div className="flex gap-2 text-sm"><Building2 className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Segmento</p><p className="text-gray-900">Agro</p></div>
                                        <div className="flex gap-2 text-sm"><Users className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Tamanho</p><p className="text-gray-900">20-50 funcionários</p></div>
                                        <div className="flex gap-2 text-sm"><Hash className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Faturamento</p><p className="text-gray-900">R$ 2.630.000 / ano</p></div>
                                        <div className="flex gap-2 text-sm"><Sprout className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Cultura principal</p><p className="text-gray-900">Soja</p></div>
                                        <div className="flex gap-2 text-sm"><MapPin className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Endereço</p><p className="text-gray-900 leading-5">Residencial Cláudio Marchetti, Rua Três – Cuiabá, MT 78076-308</p></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2 text-sm"><Phone className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Telefone</p><p className="text-gray-900">(00) 000000-0000</p></div>
                                        <div className="flex gap-2 text-sm"><Hash className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">CPF</p><p className="text-gray-900">000.000.000-00</p></div>
                                        <div className="flex gap-2 text-sm"><Mail className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">E-mail</p><p className="text-gray-900">fernando@fffagundes.com.br</p></div>
                                        <div className="flex gap-2 text-sm"><Timer className="w-4 h-4 mt-0.5 text-gray-400" /><p className="text-gray-400 min-w-[96px]">Data de início</p><p className="text-gray-900">02/01/2026</p></div>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-gray-200 pt-3">
                                    <p className="text-sm text-gray-600 mb-2">Solicitação</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                        <div className="rounded-md border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Produto</p><p className="text-lg text-gray-900">FNO</p></div>
                                        <div className="rounded-md border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Valor solicitado</p><p className="text-lg text-gray-900">R$ 850.000,00</p></div>
                                        <div className="rounded-md border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Prazo</p><p className="text-lg text-gray-900">60 meses</p></div>
                                        <div className="rounded-md border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Taxa estimada</p><p className="text-lg text-gray-900">1,2–1,5% a.m.</p></div>
                                    </div>
                                </div>
                            </Card>
                            <div className="col-span-12 lg:col-span-4 space-y-3">
                                <Card className="p-3 border-gray-200 shadow-sm">
                                    <p className="text-sm text-gray-600 mb-2">Status da Operação</p>
                                    <div className="h-9 rounded-lg bg-[#92dc49] flex items-center justify-center text-lg font-medium text-black">Ok</div>
                                </Card>
                                <Card className="p-3 border-gray-200 shadow-sm">
                                    <p className="text-sm text-gray-600 mb-1">Etapa</p>
                                    <p className="text-3xl leading-none text-gray-900">Crédito <span className="text-xs text-gray-500">há 6 dias</span></p>
                                </Card>
                                <Card className="p-3 border-gray-200 shadow-sm">
                                    <p className="text-sm text-gray-600 mb-1">Fila atual</p>
                                    <p className="text-3xl leading-none text-gray-900">GEOPE</p>
                                </Card>
                                <Card className="p-3 border-gray-200 shadow-sm">
                                    <p className="text-sm text-gray-600 mb-1">Responsável atual</p>
                                    <p className="text-3xl leading-none text-gray-900">Daniel Alves (analista)</p>
                                </Card>
                            </div>
                        </div>
                        <Card className="p-0 border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-14 bg-[#2f7d2d] text-white text-3xl font-medium flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Aprovado com Condições
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <div className="p-4 border-r border-gray-200">
                                    <p className="text-sm text-gray-700 mb-2">Condições</p>
                                    <ul className="space-y-1 text-sm text-gray-800">
                                        <li>• Manter garantias reais acima de 130%</li>
                                        <li>• Apresentar atualização semestral dos balanços</li>
                                        <li>• Seguro agrícola obrigatório</li>
                                    </ul>
                                </div>
                                <div className="p-4 border-r border-gray-200">
                                    <p className="text-sm text-gray-700 mb-2">Motivos para aprovação</p>
                                    <ul className="space-y-1 text-sm text-gray-800">
                                        <li>• Forte histórico de pagamentos</li>
                                        <li>• Garantias robustas (imóvel rural)</li>
                                        <li>• Setor do Agronegócio crescendo</li>
                                        <li>• Score de crédito elevado</li>
                                    </ul>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-700 mb-2">Mitigadores exigidos</p>
                                    <ul className="space-y-1 text-sm text-gray-800">
                                        <li>• Reforço de garantia pessoal</li>
                                        <li>• Acompanhamento trimestral de fluxo de caixa</li>
                                        <li>• Restrição para novos financiamentos acima de 20%</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="hidden">
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
                    </div>
                </TabsContent>

                <TabsContent value="Cadastro" className="mt-0 space-y-4">
                    <Card className="p-4 border-gray-200 shadow-sm">
                        <h3 className="text-3xl font-semibold text-gray-900 mb-4">Dados pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1"><p className="text-sm text-gray-700">Tipo de pessoa</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.personType}</div></div>
                            <div className="space-y-1"><p className="text-sm text-gray-700">CPF</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.cpf}</div></div>
                            <div className="space-y-1"><p className="text-sm text-gray-700">Data de nascimento</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.birthDate}</div></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1"><p className="text-sm text-gray-700">Estado civil</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.civilStatus}</div></div>
                                <div className="space-y-1"><p className="text-sm text-gray-700">Número de dependentes</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.dependents}</div></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1"><p className="text-sm text-gray-700">RG</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.rg}</div></div>
                                <div className="space-y-1"><p className="text-sm text-gray-700">Órgão emissor</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.issuingAgency}</div></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1"><p className="text-sm text-gray-700">Nacionalidade</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.nationality}</div></div>
                                <div className="space-y-1"><p className="text-sm text-gray-700">Sexo</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.gender}</div></div>
                            </div>
                            <div className="space-y-1"><p className="text-sm text-gray-700">E-mail de contato</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.contactEmail}</div></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1"><p className="text-sm text-gray-700">Telefone de contato</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.contactPhone}</div></div>
                                <div className="space-y-1"><p className="text-sm text-gray-700">Canal de Origem</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.sourceChannel}</div></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-gray-200 shadow-sm">
                        <h3 className="text-3xl font-semibold text-gray-900 mb-4">Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-3">
                                <div className="space-y-1"><p className="text-sm text-gray-700">CEP</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.cep}</div></div>
                                <div className="space-y-1"><p className="text-sm text-gray-700">Logradouro</p><div className="min-h-[48px] rounded-md border border-gray-300 bg-white px-3 py-2 text-lg leading-6">{cadastroData.street}</div></div>
                                <div className="space-y-1"><p className="text-sm text-gray-700">Bairro</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.neighborhood}</div></div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700">Georreferenciamento</p>
                                <div className="h-[196px] rounded-xl border border-gray-300 overflow-hidden">
                                    <img src="https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=400&center=lonlat:-51.2,-10.3&zoom=8&marker=lonlat:-51.2,-10.3;color:%233f7f3f;size:large&apiKey=demo" alt="Mapa de georreferenciamento" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-3 md:col-span-2">
                                <div className="col-span-2 space-y-1"><p className="text-sm text-gray-700">Cidade</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.city}</div></div>
                                <div className="col-span-1 space-y-1"><p className="text-sm text-gray-700">UF</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.uf}</div></div>
                                <div className="col-span-1 space-y-1"><p className="text-sm text-gray-700">Número</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.number}</div></div>
                                <div className="col-span-1 space-y-1"><p className="text-sm text-gray-700">Latitude</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.latitude}</div></div>
                                <div className="col-span-1 space-y-1"><p className="text-sm text-gray-700">Longitude</p><div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg">{cadastroData.longitude}</div></div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-sm text-gray-700">Área total</p>
                                <div className="h-12 rounded-md border border-gray-300 bg-white px-3 flex items-center text-lg w-[220px]">{cadastroData.totalArea}</div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="Financeiro" className="mt-0 space-y-4">
                    <Card className="p-4 border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-600 mb-3">Desempenho financeiro</p>
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Receita média anual</p><p className="text-lg">R$ 8.200.00</p><p className="text-[10px] text-green-600">+5% YoY</p></div>
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Endividamento Total</p><p className="text-lg">R$ 1,2 MM</p><p className="text-[10px] text-gray-500">Estável</p></div>
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">DSCR</p><p className="text-lg">1.85x</p><p className="text-[10px] text-green-600">Bom</p></div>
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Alavancagem</p><p className="text-lg">0.27x</p><p className="text-[10px] text-green-600">Bom</p></div>
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Comprometimento</p><p className="text-lg">32%</p><p className="text-[10px] text-amber-600">Moderado</p></div>
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Risco de inadimplência</p><p className="text-lg">AA</p><p className="text-[10px] text-green-600">0.2% • Muito baixo</p></div>
                            <div className="rounded border border-gray-200 p-2"><p className="text-[10px] text-gray-400">Perda esperada</p><p className="text-lg">25%</p></div>
                        </div>
                        <div className="h-[250px] mb-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={financeiroSeries} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#84cc16" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="#84cc16" stopOpacity={0.03} />
                                        </linearGradient>
                                        <linearGradient id="cusGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#facc15" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="#facc15" stopOpacity={0.03} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 10 }} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="receita" stroke="#3f8f2a" strokeWidth={2} fill="url(#recGrad)" />
                                    <Area type="monotone" dataKey="custo" stroke="#d99900" strokeWidth={2} fill="url(#cusGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent text-[10px] text-gray-400">
                                    <TableHead className="pl-0">Ano</TableHead>
                                    <TableHead>Receita bruta</TableHead>
                                    <TableHead>Custos totais</TableHead>
                                    <TableHead className="pr-0 text-right">Margem bruta</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">2025</TableCell><TableCell className="py-1.5">R$ 4,5 MM</TableCell><TableCell className="py-1.5">R$ 4,5 MM</TableCell><TableCell className="py-1.5 pr-0 text-right">40% (R$ 1.8 MM)</TableCell></TableRow>
                                <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">2024</TableCell><TableCell className="py-1.5">R$ 3,9 MM</TableCell><TableCell className="py-1.5">R$ 4,5 MM</TableCell><TableCell className="py-1.5 pr-0 text-right">40% (R$ 1.8 MM)</TableCell></TableRow>
                                <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">2023</TableCell><TableCell className="py-1.5">R$ 3,9 MM</TableCell><TableCell className="py-1.5">R$ 4,5 MM</TableCell><TableCell className="py-1.5 pr-0 text-right">40% (R$ 1.8 MM)</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </Card>

                    <Card className="p-4 border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-600 mb-3">Resumo financeiro das propriedades</p>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="rounded border border-gray-200 p-3"><p className="text-[10px] text-gray-400">Receita total</p><p className="text-2xl">R$ 19.613.406,24</p></div>
                            <div className="rounded border border-gray-200 p-3"><p className="text-[10px] text-gray-400">Custo total</p><p className="text-2xl">R$ 12.715.402,11</p></div>
                            <div className="rounded border border-gray-200 p-3"><p className="text-[10px] text-gray-400">Resultado total</p><p className="text-2xl">R$ 6.898.004,13</p></div>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div className="border-t border-gray-200 pt-3">
                                <p className="text-gray-500 mb-1">FAZENDA MONTE VERDE V, VIII E REDENÇÃO I</p>
                                <div className="grid grid-cols-4"><p>Participação do proprietário</p><p>Receita</p><p>Custo</p><p>Resultado</p></div>
                                <div className="grid grid-cols-4 text-sm mt-1"><p>24,138%</p><p>R$ 3.536.457,49</p><p>R$ 2.098.297,38</p><p>R$ 1.438.160,11</p></div>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <p className="text-gray-500 mb-1">FAZENDA BARRA BONITA - GLEBA A-1</p>
                                <div className="grid grid-cols-4"><p>Participação do proprietário</p><p>Receita</p><p>Custo</p><p>Resultado</p></div>
                                <div className="grid grid-cols-4 text-sm mt-1"><p>24,138%</p><p>R$ 3.536.457,49</p><p>R$ 2.098.297,38</p><p>R$ 1.438.160,11</p></div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <Card className="p-4 border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-600 mb-3">Indicadores Detalhados</p>
                            <Table>
                                <TableHeader><TableRow className="hover:bg-transparent text-[10px] text-gray-400"><TableHead className="pl-0">Indicador</TableHead><TableHead>Valor</TableHead><TableHead>Benchmark</TableHead><TableHead className="pr-0 text-right">Status</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">DSCR</TableCell><TableCell>1.85x</TableCell><TableCell>&gt; 1.25x</TableCell><TableCell className="pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Bom (acima do benchmark)</Badge></TableCell></TableRow>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">Margem EBITDA</TableCell><TableCell>25%</TableCell><TableCell>&gt; 20%</TableCell><TableCell className="pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Bom (Saudável)</Badge></TableCell></TableRow>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">Liquidez Corrente</TableCell><TableCell>1.6x</TableCell><TableCell>&gt; 1.0x</TableCell><TableCell className="pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Bom (Liquidez Adequada)</Badge></TableCell></TableRow>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">Índice de Cobertura (Interest Coverage)</TableCell><TableCell>4.2x</TableCell><TableCell>&gt; 2.5x</TableCell><TableCell className="pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Bom (Cobertura Folgada)</Badge></TableCell></TableRow>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">ROE (Retorno sobre Patrimônio)</TableCell><TableCell>14%</TableCell><TableCell>&gt; 10%</TableCell><TableCell className="pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Bom (Rentabilidade Positiva)</Badge></TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                        <Card className="p-4 border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-600 mb-3">Capacidade de pagamento</p>
                            <div className="flex items-center gap-5 mb-4">
                                <div className="relative w-40 h-24 overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-40 w-40 rounded-full border-[14px] border-[#d5e7c7]"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-40 w-40 rounded-full border-[14px] border-transparent border-t-[#f4c62d] border-r-[#7eb83f] border-b-[#2f7d2d] rotate-[-30deg]"></div>
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-1 text-center">
                                        <p className="text-2xl font-semibold text-gray-800">8.5/10</p>
                                        <p className="text-[10px] text-gray-400">SCORE</p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2 text-sm">
                                    <div className="border-b border-gray-200 pb-1"><p className="text-gray-500">Geração de Caixa Mensal</p><p className="text-2xl text-gray-900">R$ 180.000</p></div>
                                    <div className="border-b border-gray-200 pb-1"><p className="text-gray-500">Compromisso Mensal Estimado</p><p className="text-2xl text-gray-900">R$ 58.000</p></div>
                                    <div><p className="text-gray-500">Margem Disponível</p><p className="text-2xl text-gray-900">R$ 122.000</p></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="Crédito e Compliance" className="mt-0 space-y-3">
                    <Card className="p-4 border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 mb-3">Status de Compliance</p>
                        <div className="grid grid-cols-3 divide-x divide-gray-200">
                            <div className="text-center px-4">
                                <p className="text-2xl text-gray-900 mb-2">SCR: Regular</p>
                                <div className="w-8 h-8 rounded-full border border-green-600 mx-auto mb-2 flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></div>
                                <Badge className="bg-green-700 text-white rounded-full px-3 py-0.5">Sem restrições</Badge>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-2xl text-gray-900 mb-2">PEP: Negativo</p>
                                <div className="w-8 h-8 rounded-full border border-green-600 mx-auto mb-2 flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></div>
                                <Badge className="bg-green-700 text-white rounded-full px-3 py-0.5">Sem exposição pública</Badge>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-2xl text-gray-900 mb-2">Hard Stops: 0</p>
                                <div className="w-8 h-8 rounded-full border border-green-600 mx-auto mb-2 flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></div>
                                <Badge className="bg-green-700 text-white rounded-full px-3 py-0.5">Nenhum bloqueio crítico</Badge>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-12 gap-3">
                        <Card className="col-span-12 lg:col-span-6 p-4 border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-3">Score de Crédito</p>
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div className="bg-[#fff5f5] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                    {/* Score Gauge Arc — same as Análise de Perfil */}
                                    <div className="relative w-56 h-28 mt-2 flex justify-center items-end">
                                        <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
                                            {/* Background Arc */}
                                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#fca5a5" strokeWidth="6" strokeLinecap="round" />
                                            {/* Progress Arc based on score */}
                                            <path d="M 10 50 A 40 40 0 0 1 45 18" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                                        </svg>
                                        {/* Score Content */}
                                        <div className="flex flex-col items-center z-10 -mb-2">
                                            <div className="mb-2 bg-red-100 p-2 rounded-full">
                                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                            </div>
                                            <span className="text-5xl font-bold text-gray-900 tracking-tighter">400</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Composição do Score</p>
                                    <div className="space-y-2 text-xs">
                                        {[
                                            ["Histórico de Pagamentos", "95%"],
                                            ["Utilização de Crédito", "30%"],
                                            ["Idade do Crédito", "80%"],
                                            ["Mix de Crédito", "70%"],
                                            ["Consultas Recentes", "90%"],
                                        ].map(([label, pct]) => (
                                            <div key={label}>
                                                <div className="flex justify-between mb-0.5"><span>{label}</span><span>{pct}</span></div>
                                                <div className="h-1 bg-gray-200 rounded"><div className="h-1 bg-green-700 rounded" style={{ width: pct }}></div></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="col-span-12 lg:col-span-6 p-4 border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-2">Decisão do motor</p>
                            <p className="text-4xl text-gray-900 mb-3">Reprovado</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 mt-0.5" />Possui contratos com grande quantidade de parcelas</li>
                                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 mt-0.5" />Possui utilização de alto valor de crédito do tipo emergencial nos últimos 3 meses</li>
                                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 mt-0.5" />Possui pouco volume de pagamentos em dia</li>
                                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 mt-0.5" />Possui histórico de atraso nos últimos 3 meses</li>
                            </ul>
                        </Card>
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                        <Card className="col-span-12 lg:col-span-6 p-4 border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-3">Histórico de Consultas Bureau</p>
                            <Table>
                                <TableHeader><TableRow className="hover:bg-transparent text-[10px] text-gray-400"><TableHead className="pl-0">Data</TableHead><TableHead>Bureau</TableHead><TableHead>Motivo</TableHead><TableHead className="pr-0 text-right">Status</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">15/10/2025</TableCell><TableCell className="py-1.5">Serasa</TableCell><TableCell className="py-1.5">Nova operação</TableCell><TableCell className="py-1.5 pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Concluído</Badge></TableCell></TableRow>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">15/10/2025</TableCell><TableCell className="py-1.5">Boa vista</TableCell><TableCell className="py-1.5">Análise periódica</TableCell><TableCell className="py-1.5 pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Concluído</Badge></TableCell></TableRow>
                                    <TableRow className="text-xs"><TableCell className="pl-0 py-1.5">15/10/2025</TableCell><TableCell className="py-1.5">SPC Brasil</TableCell><TableCell className="py-1.5">Prospecção</TableCell><TableCell className="py-1.5 pr-0 text-right"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">Concluído</Badge></TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </Card>

                        <Card className="col-span-12 lg:col-span-3 p-4 border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-3">Sanções & Listas Restritivas</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between"><div><p>OFAC/ONU</p><p className="text-xs text-gray-500">Negativo</p></div><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                <div className="flex items-center justify-between"><div><p>Lista de Embargos IBAMA</p><p className="text-xs text-gray-500">Negativo</p></div><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                <div className="flex items-center justify-between"><div><p>Lista de Trabalho Escravo</p><p className="text-xs text-gray-500">Negativo</p></div><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                            </div>
                        </Card>

                        <Card className="col-span-12 lg:col-span-3 p-4 border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-3">Anotações Negativas e Protestos</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between"><div><p>Protestos em cartório</p><p className="text-xs text-gray-500">0</p></div><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                <div className="flex items-center justify-between"><div><p>Inadimplência (BACEN)</p><p className="text-xs text-gray-500">R$0</p></div><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                <div className="flex items-center justify-between"><div><p>Ações Judiciais relevantes</p><p className="text-xs text-gray-500">0</p></div><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-4 border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 mb-2">Detalhamento</p>
                        <div className="flex items-center gap-4 border-b border-gray-200 mb-3">
                            <button type="button" onClick={() => setCreditDetailTab("validacoes")} className={`text-sm pb-2 ${creditDetailTab === "validacoes" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>Validações Primárias</button>
                            <button type="button" onClick={() => setCreditDetailTab("decisoes")} className={`text-sm pb-2 ${creditDetailTab === "decisoes" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>Decisões de Negócio</button>
                            <button type="button" onClick={() => setCreditDetailTab("scr")} className={`text-sm pb-2 ${creditDetailTab === "scr" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>SCR</button>
                            <button type="button" onClick={() => setCreditDetailTab("processos")} className={`text-sm pb-2 ${creditDetailTab === "processos" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>Processos</button>
                            <button type="button" onClick={() => setCreditDetailTab("compliance")} className={`text-sm pb-2 ${creditDetailTab === "compliance" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>Compliance</button>
                        </div>
                        {creditDetailTab === "validacoes" && (
                            <div className="space-y-2">
                                <div className="rounded-md border border-red-100 bg-red-50 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" /> CPNJ possui restrições no CADIN</p><p className="text-[10px] text-red-500 mt-1">RESTRIÇÃO DETECTADA</p></div>
                                <div className="rounded-md border border-amber-100 bg-amber-50 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> CPNJ possui ações judiciais</p></div>
                                <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> CNPJ Ativo</p><p className="text-[10px] text-green-600 mt-1">OK</p></div>
                                <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> CPNJ Recuperação Judicial;?</p><p className="text-[10px] text-green-600 mt-1">Não consta</p></div>
                                <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> CPNJ sem registro no CCF</p></div>
                                <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> CPNJ não é de altíssimo risco</p></div>
                            </div>
                        )}
                        {creditDetailTab === "decisoes" && (
                            <div className="space-y-2">
                                {[
                                    ["Período de fundação > 2 anos", "OK"],
                                    ["CPNJ é PME", "Não consta"],
                                    ["QSA atualizado há mais de um ano", ""],
                                    ["Sócio maior de idade", ""],
                                    ["Sócio sem registro de óbito", ""],
                                    ["Sócio sem registro no CCF", ""],
                                    ["Sócio não se enquadra em score de altíssimo risco", ""],
                                    ["Sócio sem restrições ou com valor inferior a R$ 1.000,00", ""],
                                ].map(([title, sub]) => (
                                    <div key={title} className="rounded-md border border-lime-100 bg-lime-100 p-3">
                                        <p className="text-xl text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" />{title}</p>
                                        {sub ? <p className="text-[10px] text-green-700 mt-1">{sub}</p> : null}
                                    </div>
                                ))}
                            </div>
                        )}
                        {creditDetailTab === "scr" && (
                            <div className="space-y-3">
                                <Card className="p-3 border-gray-300 shadow-none">
                                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                        <div><p className="text-xs text-gray-500">Documento</p><p className="font-semibold">527185780000179</p></div>
                                        <div><p className="text-xs text-gray-500">Documento</p><p className="font-semibold">527185780000179</p></div>
                                        <div><p className="text-xs text-gray-500">Valor da Carteira</p><p className="font-semibold">R$ 128.163.572,64</p></div>
                                        <div><p className="text-xs text-gray-500">Valor Coobrigações</p><p>R$ 0,00</p></div>
                                        <div><p className="text-xs text-gray-500">Valor de crédito a vencer</p><p>R$ 127.807.074,78</p></div>
                                        <div><p className="text-xs text-gray-500">Valor de crédito vencido</p><p>R$ 356.497,86</p></div>
                                        <div><p className="text-xs text-gray-500">Valor Prejuízo</p><p>R$ 0,00</p></div>
                                        <div><p className="text-xs text-gray-500">Limite de crédito</p><p>R$ 422.970,26</p></div>
                                        <div><p className="text-xs text-gray-500">Crédito a liberar</p><p>R$ 0,00</p></div>
                                    </div>
                                    <div className="border-t border-gray-200 mt-3 pt-3 grid grid-cols-3 gap-6 text-sm">
                                        <div><p className="font-medium mb-1">A vencer</p><p>Até 30 dias<br /><span className="font-semibold">R$ 8.825.846,80</span></p><p className="mt-1">de 91 a 180 dias<br /><span className="font-semibold">R$ 12.970.962,21</span></p></div>
                                        <div><p className="font-medium mb-1">&nbsp;</p><p>de 31 a 60 dias<br /><span className="font-semibold">R$ 4.068.364,11</span></p><p className="mt-1">de 181 a 360 dias<br /><span className="font-semibold">R$ 19.049.764,84</span></p></div>
                                        <div><p className="font-medium mb-1">&nbsp;</p><p>de 61 a 90 dias<br /><span className="font-semibold">R$ 4.717.519,32</span></p><p className="mt-1">acima de 360 dias<br /><span className="font-semibold">R$ 78.174.617,50</span></p></div>
                                    </div>
                                </Card>
                                <Card className="p-3 border-gray-300 shadow-none">
                                    <p className="text-sm mb-2">Modalidades</p>
                                    <Table>
                                        <TableHeader><TableRow className="hover:bg-transparent text-[10px] text-gray-400"><TableHead className="pl-0">CÓDIGO</TableHead><TableHead>DESCRIÇÃO</TableHead><TableHead>REGULAMENTO</TableHead><TableHead className="pr-0 text-right">VALOR</TableHead></TableRow></TableHeader>
                                        <TableBody>{[["101", "Adiantamentos e depositantes", "Adiantamentos e depositantes", "R$ 202,55"], ["213", "Empréstimos", "Cheque especial", "R$ 4.631,54"], ["214", "Empréstimos", "Conta garantida", "R$ 4.965.399,18"]].map((row) => <TableRow key={row[0]} className="text-xs"><TableCell className="pl-0 py-1.5">{row[0]}</TableCell><TableCell className="py-1.5">{row[1]}</TableCell><TableCell className="py-1.5">{row[2]}</TableCell><TableCell className="py-1.5 pr-0 text-right">{row[3]}</TableCell></TableRow>)}</TableBody>
                                    </Table>
                                </Card>
                            </div>
                        )}
                        {creditDetailTab === "processos" && (
                            <div className="rounded-2xl bg-gray-100 p-4">
                                <div className="grid grid-cols-5 gap-3 mb-4">
                                    <div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Total de processos</p><p className="text-4xl mt-3">738</p></div>
                                    <div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Valor total</p><p className="text-4xl mt-3">R$ 23.948.640,00</p></div>
                                    <div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Polo ativo</p><p className="text-4xl mt-3">196</p></div>
                                    <div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Polo passivo</p><p className="text-4xl mt-3">558</p></div>
                                    <div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Polo variado</p><p className="text-4xl mt-3">32</p></div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-10 w-[300px] bg-white rounded-xl border border-gray-200 px-3 flex items-center gap-2"><Search className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Pesquise um processo</span></div>
                                    <button type="button" className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center"><Filter className="w-4 h-4 text-gray-500" /></button>
                                </div>
                                <Table>
                                    <TableHeader><TableRow className="hover:bg-transparent text-[10px] text-gray-500"><TableHead className="pl-0">NÚMERO DO PROCESSO</TableHead><TableHead>TRIBUNAL</TableHead><TableHead>ÁREA</TableHead><TableHead>ÓRGÃO JULGADOR</TableHead><TableHead>VALOR DA CAUSA</TableHead><TableHead>STATUS</TableHead><TableHead>ÚLTIMA MOVIMENTAÇÃO</TableHead><TableHead className="pr-0"></TableHead></TableRow></TableHeader>
                                    <TableBody>{Array.from({ length: 6 }).map((_, i) => <TableRow key={i} className="text-xs"><TableCell className="pl-0 py-2">00012345620238190001</TableCell><TableCell className="py-2">TRJSP</TableCell><TableCell className="py-2">Indenização por dano material</TableCell><TableCell className="py-2">13 VARA CÍVEL</TableCell><TableCell className="py-2">Não informado</TableCell><TableCell className="py-2"><Badge className="bg-slate-200 text-slate-700">ARQUIVADO</Badge></TableCell><TableCell className="py-2">21/08/2024</TableCell><TableCell className="pr-0 py-2 text-right">↗</TableCell></TableRow>)}</TableBody>
                                </Table>
                            </div>
                        )}
                        {creditDetailTab === "compliance" && (
                            <div className="space-y-2">
                                <div className="rounded-md border border-amber-100 bg-amber-50 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Pessoa física possui processos judiciais</p></div>
                                <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Sócio não é PEP</p><p className="text-[10px] text-green-700 mt-1">OK</p></div>
                                <div className="rounded-md border border-gray-200 bg-gray-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-gray-400" /> CNPJ possui registro no CEIS?</p><p className="text-[10px] text-gray-500 mt-1">Sem resultado</p></div>
                                <div className="rounded-md border border-gray-200 bg-gray-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-gray-400" /> CNPJ possui registro no CNAP?</p><p className="text-[10px] text-gray-500 mt-1">Sem resultado</p></div>
                                <div className="rounded-md border border-gray-200 bg-gray-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-gray-400" /> Pessoa física possui antecedentes criminais?</p><p className="text-[10px] text-gray-500 mt-1">Sem resultado</p></div>
                                <div className="rounded-md border border-gray-200 bg-gray-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-gray-400" /> Pessoa física possui mandados de prisão?</p><p className="text-[10px] text-gray-500 mt-1">Sem resultado</p></div>
                                <div className="rounded-md border border-gray-200 bg-gray-100 p-3"><p className="text-xl text-gray-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-gray-400" /> Pessoa física possui certificado negativo de débitos?</p><p className="text-[10px] text-gray-500 mt-1">Sem resultado</p></div>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="Agro" className="mt-0 space-y-4">
                    <Card className="p-4 border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-600 mb-3">Capacidade produtiva</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="h-[180px] rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/36555/24855"
                                    alt="Mapa da propriedade"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-2">Área e uso da terra</p>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área total</p><p className="text-sm font-semibold">3.200 ha</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área agricultável</p><p className="text-sm font-semibold">2.400 ha</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Reserva legal</p><p className="text-sm font-semibold">800 ha</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área perene</p><p className="text-sm font-semibold">1200 ha</p></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área temporária</p><p className="text-sm font-semibold">1200 ha</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Produtividade</p><p className="text-sm font-semibold">58 sc/ha</p><p className="text-[10px] text-green-600">+5.45% acima do benchmark</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Benchmark regional</p><p className="text-sm font-semibold">55 sc/ha</p></div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-none text-[10px] text-gray-400">
                                            <TableHead className="pl-0">Cultura</TableHead>
                                            <TableHead>Área (ha)</TableHead>
                                            <TableHead>Margem</TableHead>
                                            <TableHead>Prod. projetada</TableHead>
                                            <TableHead className="text-right pr-0">Prod. estimada</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="border-none hover:bg-transparent text-xs">
                                            <TableCell className="pl-0 py-1.5 font-medium">Soja</TableCell>
                                            <TableCell className="py-1.5">1400</TableCell>
                                            <TableCell className="py-1.5">24%</TableCell>
                                            <TableCell className="py-1.5">60 sc/ha</TableCell>
                                            <TableCell className="py-1.5 text-right pr-0">84.000 sc</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-600 mb-3">Tendência de Produtividade (5 anos)</p>
                        <div className="h-[170px] relative rounded border border-gray-100 px-3 pt-3 pb-6">
                            <div className="absolute left-0 top-3 bottom-6 w-10 text-[10px] text-gray-400 flex flex-col justify-between">
                                <span>180 sc/ha</span>
                                <span>70 sc/ha</span>
                                <span>50 sc/ha</span>
                                <span>40 sc/ha</span>
                                <span>0</span>
                            </div>
                            <div className="ml-10 h-full">
                                <div className="h-[125px] flex items-end gap-2">
                                    {[40, 38, 44, 46, 44, 48, 58].map((value, index) => (
                                        <div key={index} className="flex-1 bg-[#92dc49] rounded-t-sm opacity-95" style={{ height: `${value * 2}px` }}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                                    <span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-600 mb-2">Etapas da safra</p>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-none text-[10px] text-gray-400">
                                    <TableHead className="pl-0">Cultura</TableHead>
                                    <TableHead>Início do plantio</TableHead>
                                    <TableHead>Fim do plantio</TableHead>
                                    <TableHead>Colheita</TableHead>
                                    <TableHead className="pr-0 text-right">Ciclo (dias)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-none hover:bg-transparent text-xs">
                                    <TableCell className="pl-0 py-2 font-medium">Soja</TableCell>
                                    <TableCell className="py-2">05/10/2026</TableCell>
                                    <TableCell className="py-2">20/10/2026</TableCell>
                                    <TableCell className="py-2">10/01/2027</TableCell>
                                    <TableCell className="py-2 pr-0 text-right">95</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>

                    <Card className="p-4 border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-600 mb-3">Propriedades</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {agroProperties.map((farm) => {
                                const isSelected = selectedFarmId === farm.id;
                                return (
                                    <button
                                        key={farm.id}
                                        type="button"
                                        onClick={() => setSelectedFarmId(farm.id)}
                                        className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                            isSelected
                                                ? "border-[#92dc49] bg-[#92dc49] text-white"
                                                : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                                        }`}
                                    >
                                        <p className="text-[11px] font-semibold uppercase">{farm.name}</p>
                                        <p className={`text-xs mt-1 flex items-center gap-1 ${isSelected ? "opacity-90" : "text-gray-500"}`}>
                                            <MapPin className="w-3 h-3" />
                                            {farm.city}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card className="p-4 border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-600 mb-3">Capacidade produtiva</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="h-[180px] rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/36555/24855"
                                    alt="Mapa da propriedade"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Área e uso da terra</p>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área total</p><p className="text-sm font-semibold">{selectedFarm.areaTotal}</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área agricultável</p><p className="text-sm font-semibold">{selectedFarm.areaAgricultavel}</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Reserva legal</p><p className="text-sm font-semibold">{selectedFarm.reservaLegal}</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área perene</p><p className="text-sm font-semibold">{selectedFarm.areaPerene}</p></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Área temporária</p><p className="text-sm font-semibold">{selectedFarm.areaTemporaria}</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Produtividade</p><p className="text-sm font-semibold">{selectedFarm.produtividade}</p><p className="text-[10px] text-green-600">{selectedFarm.produtividadeHint}</p></div>
                                    <div className="border border-gray-200 rounded p-2"><p className="text-[10px] text-gray-400">Benchmark regional</p><p className="text-sm font-semibold">{selectedFarm.benchmark}</p></div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-none text-[10px] text-gray-400">
                                            <TableHead className="pl-0">Cultura</TableHead>
                                            <TableHead>Área (ha)</TableHead>
                                            <TableHead>Margem</TableHead>
                                            <TableHead>Prod. projetada</TableHead>
                                            <TableHead className="text-right pr-0">Prod. estimada</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="border-none hover:bg-transparent text-xs">
                                            <TableCell className="pl-0 py-1.5 font-medium">Soja</TableCell>
                                            <TableCell className="py-1.5">1400</TableCell>
                                            <TableCell className="py-1.5">24%</TableCell>
                                            <TableCell className="py-1.5">60 sc/ha</TableCell>
                                            <TableCell className="py-1.5 text-right pr-0">84.000 sc</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="p-3 border-gray-200 shadow-none">
                            <p className="text-[13px] text-gray-600 mb-2">Clima</p>
                            <div className="flex items-center gap-2">
                                <span className="text-base">☀️</span>
                                <p className="text-[30px] leading-none font-semibold text-gray-900">{selectedFarm.climate}</p>
                                <Badge className="ml-1 h-5 rounded-full bg-green-700 text-white text-[9px] px-2 py-0">AMAZÔNIA</Badge>
                            </div>
                            <p className="text-[12px] text-gray-500 mt-2 leading-4">
                                Caracterizado por temperaturas altas o ano todo e uma estação seca curta seguida de fortes chuvas de monção.
                            </p>
                        </Card>

                        <Card className="p-3 border-gray-200 shadow-none">
                            <p className="text-[13px] text-gray-600 mb-2">Laudo de aptidão agrícola</p>
                            <div className="space-y-2">
                                <div className="rounded-lg border border-amber-200 bg-[#fffbea] p-2.5 flex items-start gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-800 leading-4">{selectedFarm.aptidaoPrimary}</p>
                                        <p className="text-[12px] text-gray-600 leading-4">Terras com aptidão regular para lavouras nos níveis de manejo A, B e C, indicando limitações médias na produção.</p>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-red-200 bg-[#fff5f5] p-2.5 flex items-start gap-2">
                                    <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5" />
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-800 leading-4">{selectedFarm.aptidaoSecondary}</p>
                                        <p className="text-[12px] text-gray-600 leading-4">Terras inaptas para uso agrícola, indicadas exclusivamente para preservação da flora e fauna nativas.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="p-3 border-gray-200 shadow-none">
                            <p className="text-[13px] text-gray-600 mb-2">Altitude e topografia</p>
                            <div className="flex items-center justify-between text-[12px] text-gray-600 mb-2">
                                <span>{selectedFarm.altitude.max} máx.</span>
                                <span>{selectedFarm.altitude.med} méd.</span>
                                <span>{selectedFarm.altitude.min} mín.</span>
                            </div>
                            <div className="grid grid-cols-3 gap-y-1 gap-x-3 text-[12px] text-gray-700">
                                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7BC043]"></span><span className="font-medium">Plano</span> {selectedFarm.topo.plano}</p>
                                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#275D2B]"></span><span className="font-medium">Suave Ondulado</span> {selectedFarm.topo.suave}</p>
                                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7a2f2f]"></span><span className="font-medium">Ondulado</span> {selectedFarm.topo.ondulado}</p>
                                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef476f]"></span><span className="font-medium">Montanhosa</span> 0.0%</p>
                                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span><span className="font-medium">Ingrime</span> 0.0%</p>
                                <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#d9a404]"></span><span className="font-medium">Forte ondulada</span> 0.0%</p>
                            </div>
                        </Card>

                        <Card className="p-3 border-gray-200 shadow-none">
                            <p className="text-[13px] text-gray-600 mb-2">Dados faltantes</p>
                            <ul className="space-y-1 text-[13px] text-red-700">
                                <li>x Dados de Safra (Ausente)</li>
                                <li>x Arquivo KML/Geo (Ausente)</li>
                                <li>x Compliance Ambiental (Vazio)</li>
                                <li>x Polígonos de Desmatamento (Ausente)</li>
                            </ul>
                        </Card>
                    </div>

                    <Card className="p-3 border-gray-200 shadow-none">
                        <p className="text-[13px] text-gray-600 mb-2">Dados legais e monitoramento (compliance)</p>
                        <div className="flex flex-wrap gap-1.5 text-[12px] mb-2.5">
                            <Badge className={selectedFarm.legal.arrendamento === "SIM" ? "h-6 rounded-full bg-lime-100 text-lime-700 border border-lime-200 font-medium" : "h-6 rounded-full bg-red-100 text-red-700 border border-red-200 font-medium"}>Arrendamento: {selectedFarm.legal.arrendamento}</Badge>
                            <Badge className={selectedFarm.legal.assentamento === "SIM" ? "h-6 rounded-full bg-lime-100 text-lime-700 border border-lime-200 font-medium" : "h-6 rounded-full bg-red-100 text-red-700 border border-red-200 font-medium"}>Assentamento: {selectedFarm.legal.assentamento}</Badge>
                            <Badge className={selectedFarm.legal.meeiro === "SIM" ? "h-6 rounded-full bg-lime-100 text-lime-700 border border-lime-200 font-medium" : "h-6 rounded-full bg-red-100 text-red-700 border border-red-200 font-medium"}>Meeiro/Parceiro: {selectedFarm.legal.meeiro}</Badge>
                        </div>
                        <p className="text-base text-gray-800 font-medium">Registro no Cartório</p>
                        <p className="text-[13px] text-gray-600 mt-1">Matrícula: 1209</p>
                        <p className="text-[13px] text-gray-600">Livro: 02</p>
                        <p className="text-[13px] text-gray-600">Páginas: 01 à 02</p>
                        <p className="text-[13px] text-gray-600">MT (Nova Canaã do Norte)</p>
                        <p className="text-[10px] text-gray-400 mt-2">ID único: MT-5106216-FE553D7E8E0647B4B70E692C06E46A38</p>
                    </Card>
                </TabsContent>

                <TabsContent value="Assinaturas" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <div className="flex items-center gap-4 mb-6"><Button variant="outline" className="rounded-full bg-white border-gray-200"><Filter className="w-4 h-4 mr-2" />Tipo</Button></div>
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Analista</TableHead><TableHead>Assinaturas</TableHead><TableHead>Status</TableHead><TableHead className="w-[300px]">Mensagem</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{signaturesData.map((item, index) => (<TableRow key={index} className="h-16"><TableCell className="font-medium">{item.name}</TableCell><TableCell><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">D</div>{item.analyst}</div></TableCell><TableCell>{item.completed} de {item.total}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell><TableCell className="text-gray-500 text-sm">{item.msg}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100" onClick={() => setShowSignatureModal(true)}><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
                    </Card>
                </TabsContent>

                <TabsContent value="Documentação" className="mt-0">
                    <Card className="p-6 border-gray-100 shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none" placeholder="Faça uma pesquisa..." /></div><Button variant="outline" className="rounded-full bg-white border-gray-200"><Filter className="w-4 h-4 mr-2" />Tipo</Button></div>
                            <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium border-0" onClick={() => setShowDocAnalysis(true)}>Analisar Documentos</Button>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2"><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Matrícula do imóvel prestes a vencer. (Faltam 3 dias)</span></div><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm font-medium">Projeto vencido.</span></div></div>
                        <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-[300px]">Nome</TableHead><TableHead>Data de emissão</TableHead><TableHead>Data de validade</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{documentsData.map((doc, index) => (<TableRow key={index} className="h-14"><TableCell className="font-medium">{doc.name}</TableCell><TableCell>{doc.emission}</TableCell><TableCell>{doc.valid}</TableCell><TableCell><StatusBadge status={doc.status} /></TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100"><MoreHorizontal className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100" onClick={() => setShowSignatureModal(true)}><ArrowLeft className="w-4 h-4 rotate-180" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
                    </Card>
                </TabsContent>

                <TabsContent value="Garantias" className="mt-0">
                    {!selectedGuarantee ? (
                        <Card className="p-5 border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-600 mb-4">Resumo das Garantias</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="text-xs text-gray-500 mb-2">Cobertura total</p>
                                    <p className="text-4xl text-gray-900 mb-2">142%</p>
                                    <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                                        <div className="absolute left-0 top-0 h-2 bg-green-700 rounded-full" style={{ width: "73%" }}></div>
                                        <div className="absolute left-[47%] -top-5 text-[11px] text-green-700">100%</div>
                                        <div className="absolute right-[24%] -top-5 text-[11px] text-[#92dc49]">142%</div>
                                    </div>
                                    <p className="text-sm text-gray-700">Excedente de R$ 670.000</p>
                                </div>
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="text-xs text-gray-500 mb-2">Loan-to-value</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-4xl text-gray-900">55%</p>
                                            <p className="text-sm text-gray-700 mt-1">Margem de segurança saudável</p>
                                        </div>
                                        <div className="relative w-48 h-24">
                                            <svg viewBox="0 0 200 100" className="w-full h-full">
                                                <defs>
                                                    <linearGradient id="ltvGrad" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#166534" />
                                                        <stop offset="100%" stopColor="#84cc16" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M20,80 A80,80 0 0,1 180,80" fill="none" stroke="#e5e7eb" strokeWidth="18" strokeLinecap="round" />
                                                <path d="M20,80 A80,80 0 0,1 100,0" fill="none" stroke="url(#ltvGrad)" strokeWidth="18" strokeLinecap="round" />
                                                <text x="100" y="80" textAnchor="middle" className="fill-[#2f7d2d]" style={{ fontSize: "40px", fontWeight: 600 }}>55%</text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent text-[10px] text-gray-400">
                                        <TableHead className="pl-0">Nome/Descrição</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Valor Líquido</TableHead>
                                        <TableHead>Ônus</TableHead>
                                        <TableHead>Seguro</TableHead>
                                        <TableHead>Registro</TableHead>
                                        <TableHead className="pr-0 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guaranteeItems.map((item) => (
                                        <TableRow key={item.name} className="text-2xl border-none">
                                            <TableCell className="pl-0 py-2">{item.name}</TableCell>
                                            <TableCell className="py-2">{item.type}</TableCell>
                                            <TableCell className="py-2">{item.value}</TableCell>
                                            <TableCell className="py-2">{item.onus}</TableCell>
                                            <TableCell className="py-2">{item.insurance}</TableCell>
                                            <TableCell className="py-2">{item.registry}</TableCell>
                                            <TableCell className="pr-0 py-2 text-right">
                                                <button type="button" onClick={() => { setSelectedGuarantee(item); setGuaranteeDetailTab("resumo"); }} className="inline-flex w-7 h-7 rounded-full bg-gray-100 items-center justify-center">↗</button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    ) : (
                        <Card className="p-4 border-gray-200 shadow-sm space-y-4">
                            <button type="button" onClick={() => setSelectedGuarantee(null)} className="text-sm text-gray-500 flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Garantia</button>
                            <div className="flex items-center gap-3">
                                <h3 className="text-5xl text-gray-900">Fazenda Esperança</h3>
                                <Badge className="bg-amber-100 text-amber-900 rounded-full px-3">Em análise</Badge>
                                <Badge className="bg-red-100 text-red-700 rounded-full px-3">⚠ Requer atenção</Badge>
                            </div>
                            <div className="flex items-center gap-4 border-b border-gray-200">
                                <button type="button" onClick={() => setGuaranteeDetailTab("resumo")} className={`pb-2 ${guaranteeDetailTab === "resumo" ? "border-b-2 border-[#92dc49] text-gray-900" : "text-gray-500"}`}>Resumo</button>
                                <button type="button" onClick={() => setGuaranteeDetailTab("imovel")} className={`pb-2 ${guaranteeDetailTab === "imovel" ? "border-b-2 border-[#92dc49] text-gray-900" : "text-gray-500"}`}>Dados do imóvel</button>
                                <button type="button" onClick={() => setGuaranteeDetailTab("registro")} className={`pb-2 ${guaranteeDetailTab === "registro" ? "border-b-2 border-[#92dc49] text-gray-900" : "text-gray-500"}`}>Registro</button>
                                <button type="button" onClick={() => setGuaranteeDetailTab("area")} className={`pb-2 ${guaranteeDetailTab === "area" ? "border-b-2 border-[#92dc49] text-gray-900" : "text-gray-500"}`}>Área e exploração</button>
                                <button type="button" onClick={() => setGuaranteeDetailTab("compliance")} className={`pb-2 ${guaranteeDetailTab === "compliance" ? "border-b-2 border-[#92dc49] text-gray-900" : "text-gray-500"}`}>Compliance</button>
                                <button type="button" onClick={() => setGuaranteeDetailTab("docs")} className={`pb-2 ${guaranteeDetailTab === "docs" ? "border-b-2 border-[#92dc49] text-gray-900" : "text-gray-500"}`}>Documentos</button>
                            </div>

                            {guaranteeDetailTab === "resumo" && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div><p className="text-gray-500">ID</p><p className="text-2xl">GAR-2026-000184</p></div>
                                        <div><p className="text-gray-500">Tipo</p><p className="text-2xl">Imóvel rural</p></div>
                                        <div><p className="text-gray-500">Status</p><p className="text-2xl">Em análise</p></div>
                                        <div><p className="text-gray-500">Origem dos dados</p><p className="text-2xl">Agronavis + preenchimento interno</p></div>
                                        <div><p className="text-gray-500">Garantidor Principal</p><p className="text-2xl">Agropecuária Santa Aurora Ltda</p></div>
                                        <div><p className="text-gray-500">CPF/CNPJ</p><p className="text-2xl">12.345.678/0001-90</p></div>
                                        <div><p className="text-gray-500">Valor da operação</p><p className="text-2xl">R$ 4.800.000,00</p></div>
                                        <div><p className="text-gray-500">Operação vinculada</p><p className="text-2xl">Crédito de Investimento Rural</p></div>
                                        <div><p className="text-gray-500">Situação documental</p><p className="text-2xl">Parcialmente válida</p></div>
                                        <div><p className="text-gray-500">Situação socioambiental</p><p className="text-2xl text-red-700">Atenção</p></div>
                                        <div><p className="text-gray-500">Recomendação preliminar</p><p className="text-2xl">Em análise</p></div>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 p-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Cobertura da operação</p>
                                            <p className="text-6xl">119%</p>
                                            <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden mt-2">
                                                <div className="absolute left-0 top-0 h-2 bg-green-700 rounded-full" style={{ width: "54%" }}></div>
                                                <div className="absolute left-[42%] -top-5 text-[11px] text-green-700">100%</div>
                                                <div className="absolute left-[52%] -top-5 text-[11px] text-[#92dc49]">119%</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><p className="text-gray-500">Valor de mercado</p><p className="text-4xl">R$ 8.200.000,00</p></div>
                                            <div><p className="text-gray-500">Valor da operação</p><p className="text-4xl">R$ 4.800.000,00</p></div>
                                            <div><p className="text-gray-500">Valor aceito como garantia</p><p className="text-4xl">R$ 5.740.000,00</p></div>
                                            <div><p className="text-gray-500">Folga de cobertura</p><p className="text-4xl">R$ 940.000,00</p></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {guaranteeDetailTab === "imovel" && (
                                <div className="space-y-4 text-sm">
                                    <div><p className="text-gray-500">CAR</p><p className="text-2xl">MT-5102504-7F8A9C1D23B44567A890BCDEF1234567</p></div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div><p className="text-gray-500">Nome do Imóvel</p><p className="text-2xl">Fazenda Esperança</p></div>
                                        <div><p className="text-gray-500">Município</p><p className="text-2xl">Primavera do Leste</p></div>
                                        <div><p className="text-gray-500">UF</p><p className="text-2xl">MT</p></div>
                                        <div><p className="text-gray-500">Arrendatário / Parceiro</p><p className="text-2xl">Não</p></div>
                                        <div><p className="text-gray-500">Proprietário</p><p className="text-2xl">Agropecuária Santa Aurora Ltda</p></div>
                                        <div><p className="text-gray-500">Latitude</p><p className="text-2xl">-15.563214</p></div>
                                        <div><p className="text-gray-500">Longitude</p><p className="text-2xl">-54.298741</p></div>
                                        <div><p className="text-gray-500">Imóvel em assentamento rural</p><p className="text-2xl">Não</p></div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3"><p className="text-gray-500 mb-2">Titulares</p><div className="grid grid-cols-2 gap-4"><p className="text-2xl">Agropecuária Santa Aurora LTDA<br /><span className="text-xl">Titular Principal - CNPJ 12.345.678/0001-90</span></p><p className="text-2xl">João Carlos Ferreira<br /><span className="text-xl">Segundo titular — CPF 123.456.789-10</span></p></div></div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <p className="text-gray-500 mb-2">Polígono CAR</p>
                                        <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200 relative">
                                            <img
                                                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/36555/24855"
                                                alt="Polígono CAR"
                                                className="w-full h-full object-cover"
                                            />
                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
                                                {/* Octagon-like polygon — irregular terrain boundary */}
                                                <polygon
                                                    points="120,240 60,180 80,110 180,60 300,45 420,70 510,140 540,210 480,260 350,280 220,270"
                                                    fill="rgba(146, 220, 73, 0.22)"
                                                    stroke="#92dc49"
                                                    strokeWidth="2.5"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Vertex dots */}
                                                {[
                                                    [120,240],[60,180],[80,110],[180,60],[300,45],[420,70],[510,140],[540,210],[480,260],[350,280],[220,270]
                                                ].map(([cx, cy], i) => (
                                                    <circle key={i} cx={cx} cy={cy} r="4" fill="#92dc49" stroke="white" strokeWidth="1.5" />
                                                ))}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {guaranteeDetailTab === "registro" && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div><p className="text-gray-500">Matrícula n°</p><p className="text-2xl">18.742</p></div>
                                        <div><p className="text-gray-500">Livro</p><p className="text-2xl">2</p></div>
                                        <div><p className="text-gray-500">Página</p><p className="text-2xl">153</p></div>
                                        <div></div>
                                        <div><p className="text-gray-500">Cartório / Cidade</p><p className="text-2xl">Registro de Imóveis — Primavera do Leste</p></div>
                                        <div><p className="text-gray-500">UF</p><p className="text-2xl">MT</p></div>
                                        <div><p className="text-gray-500">KML Disponível</p><p className="text-2xl">Sim</p></div>
                                        <div><p className="text-gray-500">QTD. Proprietários</p><p className="text-2xl">2</p></div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-4"><div><p className="text-gray-500">Titular principal</p><p className="text-2xl">Agropecuária Santa Aurora Ltda</p></div><div><p className="text-gray-500">Documento</p><p className="text-2xl">12.345.678/0001-90</p></div><div><p className="text-gray-500">Segundo titular</p><p className="text-2xl">João Carlos Ferreira</p></div><div><p className="text-gray-500">Documento</p><p className="text-2xl">123.456.789-10</p></div></div>
                                    <div className="border-t border-gray-200 pt-3 grid grid-cols-3 gap-4"><div><p className="text-gray-500">Matrícula encontrada</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Titular confere com proponente</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Há coproprietário</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Há Arrendamento</p><p className="text-2xl">NÃO</p></div><div><p className="text-gray-500">Divergência documental</p><p className="text-2xl">NÃO</p></div><div><p className="text-gray-500">Necessita validação jurídica</p><p className="text-2xl">SIM ⚠</p></div></div>
                                </div>
                            )}

                            {guaranteeDetailTab === "area" && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div><p className="text-gray-500">Área total</p><p className="text-2xl">2.450,00 ha</p></div><div><p className="text-gray-500">Área agricultivável</p><p className="text-2xl">1.820,00 ha</p></div><div><p className="text-gray-500">Área temporária agricultivável</p><p className="text-2xl">1.650,00 ha</p></div>
                                        <div><p className="text-gray-500">Área perene agricultivável</p><p className="text-2xl">170,00 ha</p></div><div><p className="text-gray-500">Reserva legal</p><p className="text-2xl">420,00 ha (17,1%)</p></div><div><p className="text-gray-500">APP</p><p className="text-2xl">96,00 ha</p></div>
                                        <div><p className="text-gray-500">Vegetação nativa</p><p className="text-2xl">505,00 ha</p></div><div><p className="text-gray-500">Área irrigada</p><p className="text-2xl">310,00 ha</p></div><div><p className="text-gray-500">Área do pivô</p><p className="text-2xl">280,00 ha</p></div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 grid grid-cols-3 gap-4"><div><p className="text-gray-500">Vol. anual permitido (irrigação)</p><p className="text-2xl">1.250.000 m³</p></div><div><p className="text-gray-500">Cultura principal</p><p className="text-2xl">Soja</p></div><div><p className="text-gray-500">Área da cultura principal</p><p className="text-2xl">1.140,00 ha</p></div><div><p className="text-gray-500">Capacidade de silos</p><p className="text-2xl">18.000 toneladas</p></div><div><p className="text-gray-500">Bovinos</p><p className="text-2xl">420 cabeças</p></div><div><p className="text-gray-500">Aves / Suínos</p><p className="text-2xl">Não há</p></div></div>
                                    <div className="border-t border-gray-200 pt-3"><p className="text-gray-500 mb-2">Safras registradas</p><Table><TableHeader><TableRow className="hover:bg-transparent text-[10px] text-gray-400"><TableHead className="pl-0">Período</TableHead><TableHead>Cultura</TableHead><TableHead className="pr-0">Área</TableHead></TableRow></TableHeader><TableBody><TableRow className="text-xs"><TableCell className="pl-0 py-1">09/2023 – 03/2024</TableCell><TableCell className="py-1">◉ Soja</TableCell><TableCell className="pr-0 py-1">1.120 ha</TableCell></TableRow><TableRow className="text-xs"><TableCell className="pl-0 py-1">03/2024 – 08/2024</TableCell><TableCell className="py-1">◉ Milho</TableCell><TableCell className="pr-0 py-1">780 ha</TableCell></TableRow><TableRow className="text-xs"><TableCell className="pl-0 py-1">09/2024 – 03/2025</TableCell><TableCell className="py-1">◉ Soja</TableCell><TableCell className="pr-0 py-1">1.140 ha</TableCell></TableRow></TableBody></Table></div>
                                </div>
                            )}

                            {guaranteeDetailTab === "compliance" && (
                                <div className="space-y-4 text-sm">
                                    <p className="text-gray-500">Compliance do produtor</p>
                                    <div className="space-y-2 border-t border-gray-200 pt-3">
                                        <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-2xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> IBAMA</p><p className="text-xs text-green-700">Sem registro</p></div>
                                        <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-2xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> Trabalho escravo</p><p className="text-xs text-green-700">Sem registro</p></div>
                                        <div className="rounded-md border border-lime-100 bg-lime-100 p-3"><p className="text-2xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> Embargo ambiental</p><p className="text-xs text-green-700">Sem registro</p></div>
                                        <div className="rounded-md border border-amber-100 bg-amber-50 p-3"><p className="text-2xl flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Restrição socioambiental geral</p><p className="text-xs text-amber-700">Em monitoramento</p></div>
                                    </div>
                                    <p className="text-gray-500">Compliance da propriedade</p>
                                    <div className="border-t border-gray-200 pt-3 grid grid-cols-3 gap-4"><div><p className="text-gray-500">Status socioambiental</p><p className="text-2xl">ATENÇÃO</p></div><div><p className="text-gray-500">Área com alerta de desmatamento</p><p className="text-2xl">3,8 ha interceptados</p></div><div><p className="text-gray-500">Polígonos de desmatamento</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Reserva legal informada</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">APP informada</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Necessita análise de compliance</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Impede aceitação automática</p><p className="text-2xl">SIM</p></div><div><p className="text-gray-500">Exige condicionante?</p><p className="text-2xl">SIM</p></div></div>
                                </div>
                            )}

                            {guaranteeDetailTab === "docs" && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            ["CAR", "Recebido", "Confere com consulta Agronavis"],
                                            ["Matrícula atualizada", "Recebido", "Exigir certidão mais recente em 30 dias"],
                                            ["Mapa / KML", "Recebido", "Validado"],
                                            ["Documento societário", "Recebido", "Sem divergência"],
                                            ["Certidão de ônus reais", "Pendente", "Obrigatório antes do aceite final"],
                                            ["Certidão ambiental complementar", "Pendente", "Solicitar ao cliente"],
                                            ["Parecer jurídico", "Em elaboração", "Dependente da certidão de ônus reais"],
                                            ["Parecer de compliance", "Em elaboração", "Dependente da validação do alerta de desmatamento"],
                                        ].map(([title, status, desc]) => (
                                            <div key={title} className="rounded-xl border border-gray-200 p-3">
                                                <p className="text-2xl">{title} <Badge className={status === "Recebido" ? "bg-lime-100 text-lime-800" : status === "Pendente" ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-800"}>{status}</Badge></p>
                                                <p className="text-xl text-gray-700 mt-1">{desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <p className="text-gray-500 text-sm mb-2">PENDÊNCIAS</p>
                                        <ul className="space-y-1 text-2xl">
                                            <li>Certidão de ônus reais</li>
                                            <li>Certidão ambiental complementar</li>
                                            <li>Atualização da matrícula</li>
                                            <li>Parecer jurídico</li>
                                            <li>Parecer de compliance</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="Documentos" className="mt-0">
                    <Card className="p-4 border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 border-b border-gray-200 mb-4">
                            <button type="button" onClick={() => setDocumentsSubTab("documentos")} className={`pb-2 ${documentsSubTab === "documentos" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>Documentos</button>
                            <button type="button" onClick={() => setDocumentsSubTab("assinaturas")} className={`pb-2 ${documentsSubTab === "assinaturas" ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}>Assinaturas <span className="text-red-500 text-xs align-top">●</span></button>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <button type="button" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center"><Search className="w-4 h-4 text-gray-500" /></button>
                                <button type="button" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center"><Filter className="w-4 h-4 text-gray-500" /></button>
                                <Button variant="outline" className="h-9 rounded-full bg-white border-gray-200 text-gray-700"><ChevronDown className="w-4 h-4 mr-1" />Tipo</Button>
                            </div>
                            {documentsSubTab === "documentos" && (
                                <Button className="rounded-full h-9 px-4 bg-[#92dc49] hover:bg-[#7ab635] text-white" onClick={() => setIsUploadModalOpen(true)}>Subir documento</Button>
                            )}
                        </div>

                        {documentsSubTab === "documentos" ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent text-[10px] text-gray-400">
                                        <TableHead className="pl-0">Nome</TableHead>
                                        <TableHead>Data de emissão</TableHead>
                                        <TableHead>Data de validade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Status da análise</TableHead>
                                        <TableHead className="pr-0 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documentRegistry.map((doc) => (
                                        <TableRow key={doc.id} className="text-sm">
                                            <TableCell className="pl-0 py-2">{doc.name}</TableCell>
                                            <TableCell className="py-2">{doc.emission}</TableCell>
                                            <TableCell className="py-2">{doc.valid}</TableCell>
                                            <TableCell className="py-2"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">OK</Badge></TableCell>
                                            <TableCell className="py-2"><Badge className="bg-green-700 text-white">{doc.analysisStatus}</Badge></TableCell>
                                            <TableCell className="py-2 pr-0 text-right">
                                                <div className="inline-flex gap-2">
                                                    <button type="button" className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">...</button>
                                                    <button type="button" onClick={() => setSelectedDocumentPreview(doc)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">↗</button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent text-[10px] text-gray-400">
                                        <TableHead className="pl-0">Nome</TableHead>
                                        <TableHead>Analista</TableHead>
                                        <TableHead>Assinaturas</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Mensagem</TableHead>
                                        <TableHead className="pr-0 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {signatureRegistry.map((item) => (
                                        <TableRow key={item.id} className="text-sm">
                                            <TableCell className="pl-0 py-2">{item.name}</TableCell>
                                            <TableCell className="py-2"><span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-green-600 inline-flex items-center justify-center text-white text-[9px]">A</span>{item.analyst}</span></TableCell>
                                            <TableCell className="py-2">{item.completed} de {item.total}</TableCell>
                                            <TableCell className="py-2"><Badge className={item.status === "OK" ? "bg-lime-100 text-lime-700 border border-lime-200" : "bg-amber-100 text-amber-800 border border-amber-200"}>{item.status}</Badge></TableCell>
                                            <TableCell className="py-2">{item.msg}</TableCell>
                                            <TableCell className="py-2 pr-0 text-right">
                                                <div className="inline-flex gap-2">
                                                    <button type="button" className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">...</button>
                                                    <button type="button" onClick={() => setSelectedDocumentPreview({ name: item.name, fileSize: "3.8 MB" })} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">↗</button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
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
                    <ProfileResult isEmbedded={true} />
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

            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <DialogTitle className="text-4xl text-gray-900">Upload de arquivo</DialogTitle>
                    </div>
                    <div className="p-6">
                        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer">
                            <FileText className="w-10 h-10 mx-auto text-gray-500 mb-3" />
                            <p className="text-2xl text-gray-800">Arraste o arquivo aqui</p>
                            <p className="text-gray-500">ou <span className="text-[#2f7d2d] underline">Escolha um arquivo</span></p>
                            <input type="file" className="hidden" onChange={handleUploadFileChange} />
                        </label>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 mb-4"><span>Formatos suportados: .pdf, .xls, .docx</span><span>Tamanho máximo: 15 MB</span></div>
                        {pendingUploadFile && (
                            <div className="rounded-xl border border-gray-200 p-3">
                                <div className="flex items-center justify-between"><p className="text-2xl">{pendingUploadFile.name}</p><button type="button" onClick={() => setPendingUploadFile(null)}>×</button></div>
                                <p className="text-sm text-gray-500">{`${Math.max(0.1, pendingUploadFile.size / (1024 * 1024)).toFixed(1)} MB`}</p>
                                <div className="h-1.5 bg-gray-200 rounded mt-2"><div className="h-1.5 bg-[#92dc49] rounded" style={{ width: "30%" }}></div></div>
                                <p className="text-xs text-right mt-1 text-gray-500">30%</p>
                            </div>
                        )}
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleConfirmUpload} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white" disabled={!pendingUploadFile}>Pronto</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedDocumentPreview} onOpenChange={(open) => !open && setSelectedDocumentPreview(null)}>
                <DialogContent className="max-w-[1200px] h-[90vh] p-0 bg-[#1f1f1f] border-none">
                    <div className="h-full grid grid-cols-[260px_1fr_320px] gap-3 p-3">
                        <Card className="p-4 bg-white/95">
                            <Button variant="outline" className="w-full justify-start rounded-full mb-4" onClick={() => setSelectedDocumentPreview(null)}><ChevronLeft className="w-4 h-4 mr-1" />Fernando Fagundes</Button>
                            <h4 className="text-xl text-gray-900 mb-2">{selectedDocumentPreview?.name || "Parecer de análise"}</h4>
                            <p className="text-sm text-gray-500">Data de envio: 24/01/2026</p>
                            <p className="text-sm text-gray-500">Responsável: Daniel Alves (Analista)</p>
                            <p className="text-sm text-gray-500">Tempo de espera: 2d</p>
                        </Card>
                        <div className="bg-white rounded-xl overflow-hidden">
                            {selectedDocumentPreview?.data ? (
                                <iframe src={selectedDocumentPreview.data} className="w-full h-full min-h-[90%]" title={selectedDocumentPreview.name || "Documento"} />
                            ) : (
                                <>
                                    <div className="h-20 bg-[#00523a]"></div>
                                    <div className="p-6 text-sm text-gray-800 leading-6">
                                        <p className="font-semibold mb-2">IX - OUTRAS CONSIDERAÇÕES</p>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vulputate dui non mauris pellentesque, eu ornare eros porttitor...</p>
                                        <p className="font-semibold mt-6 mb-2">X - CONCLUSÃO</p>
                                        <p>De acordo com as informações apresentadas na peça técnica, econômica e financeira, o crédito demonstra viabilidade...</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <Card className="p-4 bg-white/95">
                            <h4 className="text-2xl mb-3">Status de Assinatura (2/3)</h4>
                            <div className="space-y-3 text-sm mb-4">
                                <div><p className="text-green-700">☑ Analista</p><p className="text-gray-500">Daniel Alves - 000.000.000-00</p></div>
                                <div><p className="text-green-700">☑ Supervisor</p><p className="text-gray-500">Ronaldo H - 000.000.000-00</p></div>
                                <div><p className="text-gray-500">☐ Gerente (Você)</p><p className="text-gray-500">Aguardando...</p></div>
                            </div>
                            <Button className="w-full rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white mb-2" onClick={() => handleSignAsAnalyst(selectedDocumentPreview?.name || "Parecer técnico")}>Assinar</Button>
                            <Button variant="outline" className="w-full rounded-full mb-2">Baixar documento</Button>
                            <Button variant="outline" className="w-full rounded-full">Solicitar complemento</Button>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

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

            {/* Signature Modal Overlay */}
            {showSignatureModal && (
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
                                <span className="font-bold text-[15px] text-gray-700">{proposal?.name || "Fazenda Boa Esperança"}</span>
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
            )}

            {/* Approve Modal (Analista) */}
            <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Aprovar proposta → Enviar ao Jurídico</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">
                            Ao aprovar, a proposta será enviada para análise jurídica.
                            Adicione o motivo para embasar sua decisão (opcional):
                        </p>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#92dc49]"
                            placeholder="Ex: Documentação completa, garantias adequadas, scoring dentro do limite..."
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => { setShowApproveModal(false); setActionReason(""); }}>
                                Cancelar
                            </Button>
                            <Button className="bg-[#92dc49] hover:bg-[#7ab635] text-white" onClick={handleApprove}>
                                Confirmar aprovação
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reprovar proposta</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">
                            Informe o motivo da reprovação. Esta informação será registrada no histórico da proposta.
                        </p>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                            placeholder="Ex: Documentação incompleta, garantias insuficientes..."
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => { setShowRejectModal(false); setActionReason(""); }}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleReject} disabled={!actionReason.trim()}>
                                Confirmar reprovação
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
