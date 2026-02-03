import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Download,
    Eye,
    AlertTriangle,
    XCircle,
    CheckCircle2,
    AlertOctagon,
    X
} from "lucide-react";

export function ProfileResult({ searchData, onBack }) {
    const [activeTab, setActiveTab] = useState("validacoes");
    const [showReport, setShowReport] = useState(false);

    // Mock data matching the image
    const companyInfo = {
        name: "Fundação Agrônoma dos Silva",
        cnpj: "00.000.000/0000-00",
        founded: "05/10/2020 (5 anos)",
        municipality: "Lauro de Freitas/BA",
        address: "Avenida Brigadeiro Mário Epingaus, s/n 1º Andar, Centro — 42700-971",
        capital: "R$ 2.000.000,00",
        employees: "200-500",
        societyType: "Limitada",
        taxOption: "Simples",
        activity: "Agronegócio",
        score: "400 (Risco Alto)"
    };

    const analysisSummary = {
        id: "c88vs777f7s87hf-84292849-fsFEEqGshp0-3",
        date: "10/11/2025, 15:47",
        reasons: [
            { id: 1, title: "RAZÃO 1", text: "Possui contratos com grande quantidade de parcelas" },
            { id: 2, title: "RAZÃO 2", text: "Possui utilização de alto valor de crédito do tipo emergencial nos últimos 3 meses" },
            { id: 3, title: "RAZÃO 3", text: "Possui pouco volume de pagamentos em dia" },
            { id: 4, title: "RAZÃO 4", text: "Possui histórico de atraso nos últimos 3 meses" },
        ]
    };

    const validations = [
        { id: 1, text: "CPNJ possui restrições no CADIN", status: "error", sub: "RESTRIÇÃO DETECTADA" },
        { id: 2, text: "CPNJ possui ações judiciais", status: "warning", sub: null },
        { id: 3, text: "CNPJ Ativo", status: "success", sub: "OK" },
        { id: 4, text: "CNPJ Recuperação Judicial?", status: "success", sub: "Não consta" },
        { id: 5, text: "CNPJ sem registro no CCF", status: "success", sub: null },
        { id: 6, text: "CNPJ não é de altíssimo risco", status: "success", sub: null },
    ];

    const handleDownload = () => {
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('download', 'Analise_Risco_Credito.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Download do PDF iniciado!");
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-normal text-gray-900">Análise de Risco de Crédito</h1>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full px-6"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar análise
                    </Button>
                    <Button
                        className="bg-[#92dc49] hover:bg-[#7ab635] text-white border-0 rounded-full px-6 transition-all shadow-md shadow-green-100"
                        onClick={() => setShowReport(true)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Relatório
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                {/* Company Info */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Informações da Empresa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12 text-sm">
                        <div className="space-y-3">
                            <InfoRow label="Nome" value={companyInfo.name} />
                            <InfoRow label="CNPJ" value={companyInfo.cnpj} />
                            <InfoRow label="Fundação" value={companyInfo.founded} />
                            <InfoRow label="Município" value={companyInfo.municipality} />
                            <div className="grid grid-cols-[80px_1fr]">
                                <span className="text-gray-400">Endereço:</span>
                                <span className="text-gray-900 font-medium">{companyInfo.address}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="Capital social" value={companyInfo.capital} />
                            <InfoRow label="Qtd. de funcionários" value={companyInfo.employees} />
                            <InfoRow label="Tipo de sociedade" value={companyInfo.societyType} />
                            <InfoRow label="Opção tributária" value={companyInfo.taxOption} />
                            <InfoRow label="Ramo de atividade" value={companyInfo.activity} />
                        </div>
                        <div>
                            <InfoRow label="Score" value={companyInfo.score} highlight />
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section className="mb-10">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Resumo da Análise</h2>
                        <div className="text-xs text-gray-400">
                            <span className="mr-8">ID: {analysisSummary.id}</span>
                            <span>Data de execução: {analysisSummary.date}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisSummary.reasons.map(reason => (
                            <div key={reason.id} className="bg-gray-100 p-4 rounded-lg">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">{reason.title}</span>
                                <p className="text-sm font-medium text-gray-800 leading-snug">{reason.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Risk Score */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Análise de Risco</h2>
                    <div className="bg-[#fff5f5] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <p className="text-gray-400 text-sm absolute top-6 left-6">Score de Crédito</p>

                        {/* Score Gauge */}
                        <div className="relative w-64 h-32 mt-4 flex justify-center items-end">
                            {/* SVG Arc */}
                            <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
                                {/* Background Arc */}
                                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#fee2e2" strokeWidth="6" strokeLinecap="round" />
                                {/* Progress Arc (Partial) */}
                                <path d="M 10 50 A 40 40 0 0 1 45 18" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                            </svg>

                            {/* Score Content */}
                            <div className="flex flex-col items-center z-10 -mb-2">
                                <div className="mb-2 bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-500 fill-red-100" />
                                </div>
                                <span className="text-5xl font-bold text-gray-900 tracking-tighter">400</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Detalhamento</h2>
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex gap-8">
                            {["Validações Primárias", "Decisões de Negócio", "SCR", "Processos", "Compliance"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab.toLowerCase().split(' ')[0]
                                            ? "text-[#92dc49]"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab.toLowerCase().split(' ')[0] && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#92dc49]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {validations.map(item => (
                            <div
                                key={item.id}
                                className={`p-4 rounded-lg flex items-center gap-4 ${item.status === 'error' ? 'bg-red-50' :
                                        item.status === 'warning' ? 'bg-amber-50' :
                                            'bg-[#e8f5e0]'
                                    }`}
                            >
                                {item.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                                {item.status === 'warning' && <AlertOctagon className="w-5 h-5 text-amber-500" />}
                                {item.status === 'success' && <CheckCircle2 className="w-5 h-5 text-[#92dc49]" />}

                                <div className="flex flex-col">
                                    <span className={`font-medium ${item.status === 'error' ? 'text-gray-900' :
                                            item.status === 'warning' ? 'text-gray-900' :
                                                'text-gray-900'
                                        }`}>
                                        {item.text}
                                    </span>
                                    {item.sub && (
                                        <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${item.status === 'error' ? 'text-red-400' :
                                                item.status === 'success' ? 'text-gray-500' : ''
                                            }`}>
                                            {item.sub}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Report Modal */}
            {showReport && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animated animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-lg">Relatório de Análise.pdf</h3>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Baixar</Button>
                                <Button variant="ghost" size="icon" onClick={() => setShowReport(false)}><X className="w-5 h-5" /></Button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center">
                            <div className="bg-white shadow-2xl w-full max-w-3xl min-h-full p-12 text-gray-800">
                                {/* Mock PDF Content structure */}
                                <div className="border-b-2 border-gray-900 pb-4 mb-8 flex justify-between items-end">
                                    <h1 className="text-3xl font-bold font-serif">Relatório Oficial</h1>
                                    <span className="text-sm">Confidencial</span>
                                </div>
                                <div className="space-y-6 font-serif">
                                    <p className="text-justify leading-relaxed">Este documento certifica a análise de crédito realizada para a empresa <strong>Fundação Agrônoma dos Silva</strong>. A análise foi conduzida seguindo os rigorosos padrões de compliance e risco desta instituição.</p>

                                    <div className="bg-gray-50 p-6 border border-gray-200">
                                        <h4 className="font-bold mb-2">Dados da Operação</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Data da Solicitação: 10/11/2025</li>
                                            <li>Protocolo: #99283-AB</li>
                                            <li>Status: <span className="text-red-600 font-bold">Risco Alto</span></li>
                                        </ul>
                                    </div>

                                    <p className="text-justify leading-relaxed">
                                        Foi constatado um score de crédito de 400 pontos. Recomendamos cautela na aprovação de novos limites de crédito até que as pendências listadas no sistema CADIN sejam regularizadas.
                                    </p>

                                    <div className="h-40"></div> {/* Spacing */}

                                    <div className="flex justify-between mt-20 pt-8 border-t border-gray-300">
                                        <div className="text-center">
                                            <div className="h-12 w-32 border-b border-black mb-2"></div>
                                            <span className="text-xs uppercase">Analista Responsável</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="h-12 w-32 border-b border-black mb-2"></div>
                                            <span className="text-xs uppercase">Gerente de Risco</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div className="grid grid-cols-[140px_1fr] items-baseline">
            <span className="text-gray-400 whitespace-nowrap">{label}:</span>
            <span className={`font-medium truncate ${highlight ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>{value}</span>
        </div>
    );
}
