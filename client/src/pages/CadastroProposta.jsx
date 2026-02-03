import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
    ChevronLeft,
    Upload,
    Trash2,
    Eye,
    RotateCw,
    CheckCircle2,
    AlertCircle,
    FileText
} from "lucide-react";
import { useLocation } from "wouter";

// Document List Data Structure
const initialDocuments = [
    { id: 1, title: "Simulação", category: "Preenchimento do checklist", status: 'done' }, // Mocking one already done
    { id: 2, title: "Contrato Social", category: "Pessoa Jurídica do Empreendimento", status: 'idle' },
    { id: 3, title: "Balanço patrimonial", category: "Pessoa Jurídica do Empreendimento", status: 'error', errorMsg: "Uma Declaração de Imposto de Renda foi anexada no lugar. Envie o documento correto." },
    { id: 4, title: "Balancete atualizado", subtitle: "Dos últimos 3 meses", category: "Pessoa Jurídica do Empreendimento", status: 'idle' },
    { id: 5, title: "Alvará de funcionamento", category: "Pessoa Jurídica do Empreendimento", status: 'done' },
    { id: 6, title: "Certidão de Inteiro Teor da Matrícula do Imóvel matriz", category: "Pessoa Jurídica do Empreendimento", status: 'idle' },
    { id: 7, title: "Declaração de Imposto de Renda", category: "Pessoa Jurídica dos Sócios", status: 'idle' },
    { id: 8, title: "Certidão de Casamento", category: "Pessoa Jurídica dos Sócios", status: 'idle' },
    { id: 9, title: "RG e CPF", category: "Pessoa Jurídica dos Sócios", status: 'idle' },
    { id: 10, title: "Comprovante de Endereço atualizado", category: "Pessoa Jurídica dos Sócios", status: 'idle' },
];

export function CadastroProposta() {
    const [, setLocation] = useLocation(); // using wouter's hook
    // const navigate = useNavigate(); // Removed
    const [documents, setDocuments] = useState(initialDocuments);
    const [uploadingIds, setUploadingIds] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        companyName: "Fernando Fagundes",
        industry: "Agronegócio",
        size: "100-500",
        machinery: "50-100",
        revenue: "R$ 1.300.200.000",
        email: "financeiro@fffagundes.com.br",
        phone: "(11) 000000000",
        zip: "70865-000",
        state: "DF",
        city: "Brasília",
        neighborhood: "Asa Norte",
        address: "Quadra SQN 410",
        sector: "Agronomia",
        creditType: "Fno",
        projectValue: "R$ 300.000.000",
        financedValue: "R$ 270.000.000",
        term: "420 meses",
        gracePeriod: "32 meses"
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Calculate Progress
    const completedCount = documents.filter(d => d.status === 'done').length;
    const progress = Math.round((completedCount / documents.length) * 100);

    // Navigation helper
    const handleBack = () => {
        // wouter doesn't have useHistory/useNavigate(-1). 
        // We can use window.history.back() for "back" behavior
        window.history.back();
    };

    const handleUpload = (id) => {
        // Start "simulation"
        setUploadingIds(prev => [...prev, id]);

        // Update doc status to uploading (optional visual, but we use the spinner in the button)
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status: 'uploading' } : doc
        ));

        // Simulate network delay
        setTimeout(() => {
            setDocuments(prev => prev.map(doc =>
                doc.id === id ? { ...doc, status: 'done', errorMsg: null } : doc
            ));
            setUploadingIds(prev => prev.filter(uid => uid !== id));
        }, 1500);
    };

    const handleDelete = (id) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status: 'idle' } : doc
        ));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const userRole = localStorage.getItem('userRole') || 'projetista'; // Default to projetista for creation flow usually

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const newProposal = {
                id: Date.now(), // simple unique ID
                name: formData.companyName,
                score: "B", // Initial score default
                status: "OK",
                segment: (formData.industry === "Agronegócio" || formData.sector === "Agronomia") ? "Rural" : "Corporate",
                stage: "1. Cadastro",
                value: formData.projectValue,
                date: new Date().toLocaleDateString('pt-BR'),
                line: formData.creditType === "Fno" ? "FNO - Agro" : "Outro"
            };

            const existingProposals = JSON.parse(localStorage.getItem("proposals") || "[]");
            localStorage.setItem("proposals", JSON.stringify([newProposal, ...existingProposals]));

            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSubmitting) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="bg-white p-12 rounded-3xl shadow-sm text-center w-full max-w-2xl mx-4">
                        <div className="flex flex-col items-center justify-center gap-6">
                            <h2 className="text-2xl font-bold text-gray-900">Cadastro de Proposta</h2>
                            <div className="w-16 h-16 border-4 border-[#92dc49] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500">Processando cadastro...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (isSuccess) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="bg-white p-12 rounded-3xl shadow-sm text-center w-full max-w-2xl mx-4">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-[#92dc49]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Proposta cadastrada<br />com sucesso</h2>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    className="rounded-full px-8 py-6"
                                    onClick={() => setLocation(userRole === 'gerente' ? '/propostas' : '/carteira')}
                                >
                                    Visualizar
                                </Button>
                                <Button
                                    className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-8 py-6 shadow-lg shadow-green-100"
                                    onClick={() => setLocation(userRole === 'gerente' ? '/propostas' : '/carteira')}
                                >
                                    Ir para {userRole === 'gerente' ? 'Propostas' : 'Carteira'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto min-h-screen pb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#f8f9fa] z-10 py-4 -mx-8 px-8 border-b border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-gray-200">
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Cadastro de Proposta</h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-full border-green-700 text-green-700 hover:bg-green-50">
                            <RotateCw className="w-4 h-4 mr-2" />
                            Salvar rascunho
                        </Button>
                        <Button
                            className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 shadow-lg shadow-green-100"
                            onClick={handleSubmit}
                        >
                            Enviar para análise
                        </Button>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-8">

                    {/* Dados da Empresa */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Dados da empresa</h2>
                        <Card className="p-8 border-none shadow-none bg-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormItem
                                    label="Nome da empresa"
                                    value={formData.companyName}
                                    onChange={(v) => handleInputChange("companyName", v)}
                                    placeholder="Fernando Fagundes"
                                />
                                <FormItem
                                    label="Indústria"
                                    value={formData.industry}
                                    onChange={(v) => handleInputChange("industry", v)}
                                    placeholder="Agronegócio"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tamanho</Label>
                                        <Select
                                            value={formData.size}
                                            onValueChange={(v) => handleInputChange("size", v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="100-500">100-500 funcionários</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Qtd de maquinário</Label>
                                        <Select
                                            value={formData.machinery}
                                            onValueChange={(v) => handleInputChange("machinery", v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="50-100">50-100</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <FormItem
                                    label="Receita Bruta Anual"
                                    value={formData.revenue}
                                    onChange={(v) => handleInputChange("revenue", v)}
                                />

                                <FormItem
                                    label="E-mail"
                                    value={formData.email}
                                    onChange={(v) => handleInputChange("email", v)}
                                />
                                <FormItem
                                    label="Telefone"
                                    value={formData.phone}
                                    onChange={(v) => handleInputChange("phone", v)}
                                />

                                <FormItem
                                    label="CEP da empresa"
                                    value={formData.zip}
                                    onChange={(v) => handleInputChange("zip", v)}
                                />
                                <div className="grid grid-cols-[100px_1fr] gap-4">
                                    <div className="space-y-2">
                                        <Label>Estado</Label>
                                        <Select
                                            value={formData.state}
                                            onValueChange={(v) => handleInputChange("state", v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DF">DF</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormItem
                                        label="Município da Empresa"
                                        value={formData.city}
                                        onChange={(v) => handleInputChange("city", v)}
                                    />
                                </div>

                                <FormItem
                                    label="Bairro"
                                    value={formData.neighborhood}
                                    onChange={(v) => handleInputChange("neighborhood", v)}
                                />
                                <FormItem
                                    label="Endereço completo"
                                    value={formData.address}
                                    onChange={(v) => handleInputChange("address", v)}
                                />
                            </div>
                        </Card>
                    </section>

                    {/* Informações do projeto */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Informações do projeto</h2>
                        <Card className="p-8 border-none shadow-none bg-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label>Setor de Atividade</Label>
                                    <Select
                                        value={formData.sector}
                                        onValueChange={(v) => handleInputChange("sector", v)}
                                    >
                                        <SelectTrigger className="bg-white border-gray-200 h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Agronomia">Agronomia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Modalidade do Crédito</Label>
                                    <Select
                                        value={formData.creditType}
                                        onValueChange={(v) => handleInputChange("creditType", v)}
                                    >
                                        <SelectTrigger className="bg-white border-gray-200 h-12">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fno">FNO - Agro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <FormItem
                                    label="Valor do projeto"
                                    value={formData.projectValue}
                                    onChange={(v) => handleInputChange("projectValue", v)}
                                />
                                <FormItem
                                    label="Valor financiado"
                                    value={formData.financedValue}
                                    onChange={(v) => handleInputChange("financedValue", v)}
                                />

                                <FormItem
                                    label="Prazo"
                                    value={formData.term}
                                    onChange={(v) => handleInputChange("term", v)}
                                />
                                <FormItem
                                    label="Carência"
                                    value={formData.gracePeriod}
                                    onChange={(v) => handleInputChange("gracePeriod", v)}
                                />
                            </div>
                        </Card>
                    </section>

                    {/* Lista de documentos */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Lista de documentos</h2>

                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">Preenchimento do checklist</h3>
                                <span className="text-sm font-medium text-gray-500"><strong className="text-[#92dc49] text-base">{progress}%</strong> preenchido</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-gray-200 [&>*]:bg-[#92dc49]" />
                        </div>

                        <div className="space-y-8">
                            {/* Group by category if needed, but mockup shows flat list mainly separated by titles. We will map them flat for now but adding headers if category changes could be an improvement. For this task, strict flat list with headers inserted manually or logic. Let's use logic. */}
                            {Object.entries(
                                documents.reduce((acc, doc) => {
                                    (acc[doc.category] = acc[doc.category] || []).push(doc);
                                    return acc;
                                }, {})
                            ).map(([category, categoryDocs]) => (
                                <div key={category}>
                                    <h4 className="font-semibold text-gray-800 mb-4">{category}</h4>
                                    <div className="space-y-3">
                                        {categoryDocs.map((doc) => (
                                            <div key={doc.id} className="relative">
                                                <div
                                                    className={`
                                                        p-4 rounded-lg border border-transparent shadow-sm flex items-center justify-between transition-all duration-300
                                                        ${doc.status === 'done' ? 'bg-[#dcfcc4] border-[#bce69c]' : 'bg-white'}
                                                        ${doc.status === 'error' ? 'bg-red-50 border-red-100' : ''}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {doc.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                                        {doc.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                                        <div>
                                                            <p className={`font-medium ${doc.status === 'done' ? 'text-green-900' : 'text-gray-900'}`}>{doc.title}</p>
                                                            {doc.subtitle && <p className="text-xs text-gray-500">{doc.subtitle}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* Actions based on Status */}
                                                        {doc.status === 'done' ? (
                                                            <>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="text-red-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                                                                <Button variant="ghost" size="icon" className="text-green-700 hover:bg-green-100"><Eye className="w-4 h-4" /></Button>
                                                            </>
                                                        ) : uploadingIds.includes(doc.id) ? (
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                                                        ) : (
                                                            <>
                                                                {doc.status === 'error' && <Button variant="ghost" size="icon" className="bg-red-200 text-red-600 hover:bg-red-300 rounded-lg w-8 h-8"><AlertCircle className="w-4 h-4" /></Button>}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-green-600 hover:bg-green-50"
                                                                    onClick={() => handleUpload(doc.id)}
                                                                >
                                                                    <Upload className="w-5 h-5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Error Message */}
                                                {doc.status === 'error' && doc.errorMsg && (
                                                    <p className="text-xs text-red-500 mt-1 ml-2">{doc.errorMsg}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

// Helper Component for Form Inputs
function FormItem({ label, value, onChange, placeholder }) {
    return (
        <div className="space-y-2">
            <Label className="text-gray-700">{label}</Label>
            <Input
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white border-gray-200 h-12 text-base shadow-sm focus-visible:ring-[#92dc49]"
            />
        </div>
    );
}
