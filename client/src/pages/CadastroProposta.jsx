import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { apiRequest, queryClient } from "@/lib/queryClient";

const initialDocuments = [
    { id: 1, title: "Simulacao", category: "Preenchimento do checklist", status: 'idle' },
    { id: 2, title: "Contrato Social", category: "Pessoa Juridica do Empreendimento", status: 'idle' },
    { id: 3, title: "Balanco patrimonial", category: "Pessoa Juridica do Empreendimento", status: 'idle' },
    { id: 4, title: "Balancete atualizado", subtitle: "Dos ultimos 3 meses", category: "Pessoa Juridica do Empreendimento", status: 'idle' },
    { id: 5, title: "Alvara de funcionamento", category: "Pessoa Juridica do Empreendimento", status: 'idle' },
    { id: 6, title: "Certidao de Inteiro Teor da Matricula do Imovel matriz", category: "Pessoa Juridica do Empreendimento", status: 'idle' },
    { id: 7, title: "Declaracao de Imposto de Renda", category: "Pessoa Juridica dos Socios", status: 'idle' },
    { id: 8, title: "Certidao de Casamento", category: "Pessoa Juridica dos Socios", status: 'idle' },
    { id: 9, title: "RG e CPF", category: "Pessoa Juridica dos Socios", status: 'idle' },
    { id: 10, title: "Comprovante de Endereco atualizado", category: "Pessoa Juridica dos Socios", status: 'idle' },
];

export function CadastroProposta() {
    const [, setLocation] = useLocation();
    const [documents, setDocuments] = useState(initialDocuments);

    useEffect(() => {
        console.log("[DEBUG] Documents state updated:", documents);
    }, [documents]);

    const [uploadingIds, setUploadingIds] = useState([]);
    const [proposalId, setProposalId] = useState(null);
    const [showDocuments, setShowDocuments] = useState(false);
    const { data: user } = useQuery({ queryKey: ["/api/auth/me"] });
    const userRole = user?.role || 'projetista';

    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        size: "",
        machinery: "",
        revenue: "",
        email: "",
        phone: "",
        zip: "",
        state: "",
        city: "",
        neighborhood: "",
        address: "",
        sector: "",
        creditType: "",
        projectValue: "",
        financedValue: "",
        term: "",
        gracePeriod: ""
    });

    const maskCurrency = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, "");
        value = (Number(value) / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return `R$ ${value}`;
    };

    const maskPhone = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            return value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 5) {
            return value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
            return value.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
        } else {
            return value.replace(/^(\d*)/, "($1");
        }
    };

    const maskCEP = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        return value.replace(/^(\d{5})(\d)/, "$1-$2");
    };

    const checkCEP = async (cep) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        address: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                        zip: maskCEP(cleanCep) // Ensure format is correct
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const cleanCurrency = (value) => {
        if (!value) return null;
        const digits = value.replace(/\D/g, "");
        if (!digits) return null;
        return (parseInt(digits) / 100).toFixed(2);
    };

    const handleInputChange = (field, value) => {
        let formattedValue = value;

        if (field === 'revenue' || field === 'projectValue' || field === 'financedValue') {
            formattedValue = maskCurrency(value);
        } else if (field === 'phone') {
            formattedValue = maskPhone(value);
        } else if (field === 'zip') {
            formattedValue = maskCEP(value);
            if (formattedValue.replace(/\D/g, '').length === 8) {
                checkCEP(formattedValue);
            }
        }

        setFormData(prev => ({ ...prev, [field]: formattedValue }));
    };

    const completedCount = documents.filter(d => d.status === 'done').length;
    const progress = Math.round((completedCount / documents.length) * 100);

    const handleBack = () => {
        window.history.back();
    };

    const fileInputRef = useState(null);

    const handleUploadClick = (id) => {
        const fileInput = document.getElementById(`file-upload-${id}`);
        if (fileInput) fileInput.click();
    };

    const handleFileChange = async (event, id) => {
        console.log("[DEBUG] handleFileChange started", { id });
        const file = event.target.files[0];
        if (!file) {
            console.log("[DEBUG] No file selected");
            return;
        }

        console.log("[DEBUG] File selected:", file.name);

        if (file.type !== "application/pdf") {
            console.log("[DEBUG] Invalid file type", file.type);
            setDocuments(prev => prev.map(d =>
                d.id === id ? { ...d, status: 'error', errorMsg: "Apenas arquivos PDF sao permitidos." } : d
            ));
            return;
        }

        let currentProposalId = proposalId;
        console.log("[DEBUG] Current proposalId:", currentProposalId);

        if (!currentProposalId) {
            console.log("[DEBUG] No proposalId, attempting to save draft...");
            currentProposalId = await handleSaveDraft();
            console.log("[DEBUG] Validated proposalId after saveDraft:", currentProposalId);
            if (!currentProposalId) {
                console.warn("[DEBUG] Failed to obtain proposalId. Aborting upload.");
                setDocuments(prev => prev.map(d =>
                    d.id === id ? { ...d, status: 'error', errorMsg: "Preencha o Nome da Empresa para salvar o rascunho antes de enviar." } : d
                ));
                return;
            }
        }

        const doc = documents.find(d => d.id === id);
        if (!doc) {
            console.error("[DEBUG] Document not found in state:", id);
            return;
        }

        setUploadingIds(prev => [...prev, id]);
        setDocuments(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'uploading' } : d
        ));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', doc.title);
        formData.append('category', doc.category);
        formData.append('status', 'uploaded');

        try {
            console.log("[DEBUG] sending fetch request to", `/api/proposals/${currentProposalId}/documents`);
            // We need to use fetch directly here instead of apiRequest helper because
            // apiRequest sets Content-Type to application/json automatically if data is present
            // but for FormData browser sets it automatically with boundary
            const res = await fetch(`/api/proposals/${currentProposalId}/documents`, {
                method: "POST",
                body: formData
            });

            console.log("[DEBUG] fetch response status:", res.status);

            if (!res.ok) {
                const errorData = await res.json();
                console.error("[DEBUG] fetch error response:", errorData);
                throw new Error(errorData.message || "Erro ao enviar arquivo");
            }

            const uploadedDoc = await res.json();
            console.log("[DEBUG] Upload success", { uploadedDoc, fileName: file.name, id });

            setDocuments(prev => {
                const newDocs = prev.map(d => {
                    if (d.id === id) {
                        return { ...d, status: 'done', errorMsg: null, fileName: file.name, url: uploadedDoc.url };
                    }
                    return d;
                });
                return newDocs;
            });
            queryClient.invalidateQueries({ queryKey: [`/api/proposals/${currentProposalId}`] });

        } catch (error) {
            console.error("[DEBUG] Catch block error:", error);
            setDocuments(prev => prev.map(d =>
                d.id === id ? { ...d, status: 'error', errorMsg: error.message || "Erro ao fazer upload do documento." } : d
            ));
        } finally {
            console.log("[DEBUG] Finally block executed for id:", id);
            setUploadingIds(prev => prev.filter(uid => uid !== id));
            // Reset input
            event.target.value = '';
        }
    };

    const handleDelete = (id) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status: 'idle', fileName: null, url: null } : doc
        ));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleSaveDraft = async () => {
        console.log("[DEBUG] handleSaveDraft started");
        if (!formData.companyName) {
            console.warn("[DEBUG] Validation failed: Company name is required");
            setSubmitError("Nome da empresa é obrigatório para salvar rascunho.");
            return null;
        }

        try {
            console.log("[DEBUG] Creating proposal draft...");
            const segment = (formData.industry === "Agronegocio" || formData.sector === "Agronomia") ? "Rural" : "Corporate";
            const creditLine = formData.creditType === "Fno" ? "FNO - Agro" : formData.creditType || null;

            const res = await apiRequest("POST", "/api/proposals", {
                name: formData.companyName,
                segment,
                stage: "1. Cadastro",
                status: "Rascunho",
                creditLine,
                creditType: formData.creditType || null,
                sector: formData.sector || null,
                projectValue: cleanCurrency(formData.projectValue),
                financedValue: cleanCurrency(formData.financedValue),
                term: formData.term || null,
                gracePeriod: formData.gracePeriod || null,
                score: "B",
                priority: "media",
            });
            const proposal = await res.json();
            console.log("[DEBUG] Proposal draft created:", proposal);

            if (proposal && proposal.id) {
                setProposalId(proposal.id);
                // Don't show success screen for draft, just toast or keep on page
                queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
                return proposal.id;
            }
            return null;
        } catch (error) {
            console.error("[DEBUG] Error saving draft:", error);
            setSubmitError(error.message || "Erro ao salvar rascunho.");
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!formData.companyName) {
            setSubmitError("Nome da empresa e obrigatorio.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const segment = (formData.industry === "Agronegocio" || formData.sector === "Agronomia") ? "Rural" : "Corporate";
            const creditLine = formData.creditType === "Fno" ? "FNO - Agro" : formData.creditType || null;

            const res = await apiRequest("POST", "/api/proposals", {
                name: formData.companyName,
                segment,
                stage: "1. Cadastro",
                status: "Em Analise",
                creditLine,
                creditType: formData.creditType || null,
                sector: formData.sector || null,
                projectValue: cleanCurrency(formData.projectValue),
                financedValue: cleanCurrency(formData.financedValue),
                term: formData.term || null,
                gracePeriod: formData.gracePeriod || null,
                score: "B",
                priority: "media",
            });
            const proposal = await res.json();

            if (proposal && proposal.id) {
                setProposalId(proposal.id);
                queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
                queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
                setIsSubmitting(false);
                setIsSuccess(true);
            } else {
                throw new Error("Falha ao criar proposta: ID nao retornado");
            }
        } catch (error) {
            setIsSubmitting(false);
            setSubmitError(error.message || "Erro ao cadastrar proposta.");
        }
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

    if (isSuccess && !showDocuments) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="bg-white p-12 rounded-3xl shadow-sm text-center w-full max-w-2xl mx-4">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-[#92dc49]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Proposta cadastrada<br />com sucesso</h2>
                            <p className="text-gray-500">Deseja enviar os documentos agora?</p>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    className="rounded-full px-8 py-6"
                                    onClick={() => setLocation('/propostas')}
                                    data-testid="button-view-proposal"
                                >
                                    Ver Propostas
                                </Button>
                                <Button
                                    className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-8 py-6 shadow-lg shadow-green-100"
                                    onClick={() => setShowDocuments(true)}
                                    data-testid="button-upload-documents"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Enviar Documentos
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
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#f8f9fa] z-10 py-4 -mx-8 px-8 border-b border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-gray-200" data-testid="button-back">
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Cadastro de Proposta</h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-full border-green-700 text-green-700 hover:bg-green-50" onClick={handleSaveDraft} data-testid="button-save-draft">
                            <RotateCw className="w-4 h-4 mr-2" />
                            Salvar rascunho
                        </Button>
                        <Button
                            className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 shadow-lg shadow-green-100"
                            onClick={handleSubmit}
                            data-testid="button-submit"
                        >
                            Enviar para analise
                        </Button>
                    </div>
                </div>

                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {submitError}
                    </div>
                )}

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Dados da empresa</h2>
                        <Card className="p-8 border-none shadow-none bg-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormItem
                                    label="Nome da empresa"
                                    value={formData.companyName}
                                    onChange={(v) => handleInputChange("companyName", v)}
                                    placeholder="Digite o nome da empresa"
                                    testId="input-company-name"
                                />
                                <FormItem
                                    label="Industria"
                                    value={formData.industry}
                                    onChange={(v) => handleInputChange("industry", v)}
                                    placeholder="Ex: Agronegocio"
                                    testId="input-industry"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tamanho</Label>
                                        <Select
                                            value={formData.size}
                                            onValueChange={(v) => handleInputChange("size", v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-12" data-testid="select-size">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-10">1-10 funcionarios</SelectItem>
                                                <SelectItem value="10-50">10-50 funcionarios</SelectItem>
                                                <SelectItem value="50-100">50-100 funcionarios</SelectItem>
                                                <SelectItem value="100-500">100-500 funcionarios</SelectItem>
                                                <SelectItem value="500+">500+ funcionarios</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Qtd de maquinario</Label>
                                        <Select
                                            value={formData.machinery}
                                            onValueChange={(v) => handleInputChange("machinery", v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-12" data-testid="select-machinery">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0-10">0-10</SelectItem>
                                                <SelectItem value="10-50">10-50</SelectItem>
                                                <SelectItem value="50-100">50-100</SelectItem>
                                                <SelectItem value="100+">100+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <FormItem
                                    label="Receita Bruta Anual"
                                    value={formData.revenue}
                                    onChange={(v) => handleInputChange("revenue", v)}
                                    placeholder="Ex: R$ 1.000.000"
                                    testId="input-revenue"
                                />

                                <FormItem
                                    label="E-mail"
                                    value={formData.email}
                                    onChange={(v) => handleInputChange("email", v)}
                                    placeholder="email@empresa.com"
                                    testId="input-email"
                                />
                                <FormItem
                                    label="Telefone"
                                    value={formData.phone}
                                    onChange={(v) => handleInputChange("phone", v)}
                                    placeholder="(00) 00000-0000"
                                    testId="input-phone"
                                />

                                <FormItem
                                    label="CEP da empresa"
                                    value={formData.zip}
                                    onChange={(v) => handleInputChange("zip", v)}
                                    placeholder="00000-000"
                                    testId="input-zip"
                                />
                                <div className="grid grid-cols-[100px_1fr] gap-4">
                                    <div className="space-y-2">
                                        <Label>Estado</Label>
                                        <Select
                                            value={formData.state}
                                            onValueChange={(v) => handleInputChange("state", v)}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-12" data-testid="select-state">
                                                <SelectValue placeholder="UF" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AC">AC</SelectItem>
                                                <SelectItem value="AL">AL</SelectItem>
                                                <SelectItem value="AM">AM</SelectItem>
                                                <SelectItem value="AP">AP</SelectItem>
                                                <SelectItem value="BA">BA</SelectItem>
                                                <SelectItem value="CE">CE</SelectItem>
                                                <SelectItem value="DF">DF</SelectItem>
                                                <SelectItem value="ES">ES</SelectItem>
                                                <SelectItem value="GO">GO</SelectItem>
                                                <SelectItem value="MA">MA</SelectItem>
                                                <SelectItem value="MG">MG</SelectItem>
                                                <SelectItem value="MS">MS</SelectItem>
                                                <SelectItem value="MT">MT</SelectItem>
                                                <SelectItem value="PA">PA</SelectItem>
                                                <SelectItem value="PB">PB</SelectItem>
                                                <SelectItem value="PE">PE</SelectItem>
                                                <SelectItem value="PI">PI</SelectItem>
                                                <SelectItem value="PR">PR</SelectItem>
                                                <SelectItem value="RJ">RJ</SelectItem>
                                                <SelectItem value="RN">RN</SelectItem>
                                                <SelectItem value="RO">RO</SelectItem>
                                                <SelectItem value="RR">RR</SelectItem>
                                                <SelectItem value="RS">RS</SelectItem>
                                                <SelectItem value="SC">SC</SelectItem>
                                                <SelectItem value="SE">SE</SelectItem>
                                                <SelectItem value="SP">SP</SelectItem>
                                                <SelectItem value="TO">TO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormItem
                                        label="Municipio da Empresa"
                                        value={formData.city}
                                        onChange={(v) => handleInputChange("city", v)}
                                        placeholder="Cidade"
                                        testId="input-city"
                                    />
                                </div>

                                <FormItem
                                    label="Bairro"
                                    value={formData.neighborhood}
                                    onChange={(v) => handleInputChange("neighborhood", v)}
                                    placeholder="Bairro"
                                    testId="input-neighborhood"
                                />
                                <FormItem
                                    label="Endereco completo"
                                    value={formData.address}
                                    onChange={(v) => handleInputChange("address", v)}
                                    placeholder="Rua, numero, complemento"
                                    testId="input-address"
                                />
                            </div>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Informacoes do projeto</h2>
                        <Card className="p-8 border-none shadow-none bg-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label>Setor de Atividade</Label>
                                    <Select
                                        value={formData.sector}
                                        onValueChange={(v) => handleInputChange("sector", v)}
                                    >
                                        <SelectTrigger className="bg-white border-gray-200 h-12" data-testid="select-sector">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Agronomia">Agronomia</SelectItem>
                                            <SelectItem value="Pecuaria">Pecuaria</SelectItem>
                                            <SelectItem value="Industria">Industria</SelectItem>
                                            <SelectItem value="Comercio">Comercio</SelectItem>
                                            <SelectItem value="Servicos">Servicos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Modalidade do Credito</Label>
                                    <Select
                                        value={formData.creditType}
                                        onValueChange={(v) => handleInputChange("creditType", v)}
                                    >
                                        <SelectTrigger className="bg-white border-gray-200 h-12" data-testid="select-credit-type">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fno">FNO - Agro</SelectItem>
                                            <SelectItem value="Fne">FNE</SelectItem>
                                            <SelectItem value="Fco">FCO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <FormItem
                                    label="Valor do projeto"
                                    value={formData.projectValue}
                                    onChange={(v) => handleInputChange("projectValue", v)}
                                    placeholder="Ex: 300000000"
                                    testId="input-project-value"
                                />
                                <FormItem
                                    label="Valor financiado"
                                    value={formData.financedValue}
                                    onChange={(v) => handleInputChange("financedValue", v)}
                                    placeholder="Ex: 270000000"
                                    testId="input-financed-value"
                                />

                                <FormItem
                                    label="Prazo"
                                    value={formData.term}
                                    onChange={(v) => handleInputChange("term", v)}
                                    placeholder="Ex: 420 meses"
                                    testId="input-term"
                                />
                                <FormItem
                                    label="Carencia"
                                    value={formData.gracePeriod}
                                    onChange={(v) => handleInputChange("gracePeriod", v)}
                                    placeholder="Ex: 32 meses"
                                    testId="input-grace-period"
                                />
                            </div>
                        </Card>
                    </section>

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
                                                            {doc.status === 'done' && doc.fileName && (
                                                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                                    <FileText className="w-3 h-3" />
                                                                    {doc.fileName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="file"
                                                            id={`file-upload-${doc.id}`}
                                                            className="hidden"
                                                            accept=".pdf"
                                                            onChange={(e) => handleFileChange(e, doc.id)}
                                                        />
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
                                                                    onClick={() => handleUploadClick(doc.id)}
                                                                    data-testid={`button-upload-${doc.id}`}
                                                                >
                                                                    <Upload className="w-5 h-5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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

function FormItem({ label, value, onChange, placeholder, testId }) {
    return (
        <div className="space-y-2">
            <Label className="text-gray-700">{label}</Label>
            <Input
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white border-gray-200 h-12 text-base shadow-sm focus-visible:ring-[#92dc49]"
                data-testid={testId}
            />
        </div>
    );
}
