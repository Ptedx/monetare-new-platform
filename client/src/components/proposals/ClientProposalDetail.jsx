import React, { useState } from "react";
import { ChevronRight, Clock, FileWarning, AlertCircle, Briefcase, DollarSign, Building2, Users, Receipt, MapPin, ReceiptText, Download, Sprout, Map, Banknote, ArrowDownUp, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for the Resumo tab
const mockResumoData = {
    etapa: "Análise de crédito",
    andamento: "15%",
    status: "Em espera",
    cadastrais: {
        empresa: "Fernando Fagundes",
        valor: "R$ 50.000.000",
        industria: "Agronomia",
        tamanho: "500-1000 funcionários",
        faturamento: "R$ 300.000.000 / ano",
        endereco: "Residencial Claúdio Marchetti, Rua Três - Cuiabá, MT 78076-308"
    },
    seguro: {
        seguradora: {
            tipo: "Rural / Safra",
            premio: "R$ 3.950/ano",
            franquia: "10%",
            coberturas: ["Seca", "Granizo"],
            emissao: "1 dia"
        },
        objeto: {
            cultura: "Soja",
            area: "120 ha",
            municipio: "Santarém/PA",
            valorSegurado: "R$ 800.000"
        }
    }
};

const timelineSteps = [
    { label: "Cadastro", date: "20/01/2026 - 15:24", status: "completed" },
    { label: "Triagem", date: "21/01/2026 - 14:30", status: "completed" },
    { label: "An. Crédito", date: "Pendência detectada", status: "error" },
    { label: "An. Jurídica", date: "A iniciar", status: "pending" },
    { label: "Emissão", date: "A iniciar", status: "pending" },
    { label: "Registro", date: "A iniciar", status: "pending" },
];

const mockDocs = [
    { id: 1, nome: "Matrícula", hasWarning: false, emissao: "02/11/2025", validade: "20/11/2025", status: "A VENCER" },
    { id: 2, nome: "CAR", hasWarning: true, emissao: "02/11/2025", validade: "12/11/2025", status: "VENCIDO" },
    { id: 3, nome: "IRPF 2024", hasWarning: false, emissao: "02/11/2025", validade: "31/12/2025", status: "OK" },
    { id: 4, nome: "Registro", hasWarning: false, emissao: "02/11/2025", validade: "30/11/2025", status: "OK" },
    { id: 5, nome: "IRPF 2025", hasWarning: false, emissao: "02/11/2025", validade: "31/12/2026", status: "OK" },
    { id: 6, nome: "Simulação", hasWarning: false, emissao: "01/11/2025", validade: "31/12/2026", status: "OK" },
];

const mockPayments = [
    { id: 1, tipo: "Crédito (1 de 420)", valor: "R$ 2.750", vencimento: "28/12/2025", status: "PAGO" },
    { id: 2, tipo: "Crédito (2 de 420)", valor: "R$ 2.750", vencimento: "28/01/2026", status: "VENCIDO" },
    { id: 3, tipo: "Seguro (2 de 420)", valor: "R$ 2.300", vencimento: "28/01/2026", status: "VENCIDO" },
    { id: 4, tipo: "Crédito (3 de 420)", valor: "R$ 2.750", vencimento: "28/02/2026", status: "A VENCER" },
    { id: 5, tipo: "Seguro (3 de 420)", valor: "R$ 2.300", vencimento: "28/02/2026", status: "A VENCER" },
    { id: 6, tipo: "Crédito (4 de 420)", valor: "R$ 2.750", vencimento: "28/03/2026", status: "PREVISTO" },
    { id: 7, tipo: "Seguro (4 de 420)", valor: "R$ 2.300", vencimento: "28/03/2026", status: "PREVISTO" },
    { id: 8, tipo: "Crédito (5 de 420)", valor: "R$ 2.750", vencimento: "28/04/2026", status: "PREVISTO" },
];

const getBadgeStyle = (status) => {
    switch (status) {
        case 'OK': return 'bg-green-100 text-green-700';
        case 'VENCIDO': return 'bg-red-500 text-white';
        case 'A VENCER': return 'bg-orange-500 text-white';
        case 'PAGO': return 'bg-green-100 text-green-700';
        case 'PREVISTO': return 'bg-gray-100 text-gray-400 border border-gray-200';
        default: return 'bg-gray-100 text-gray-600';
    }
};

export function ClientProposalDetail({ proposal, onBack }) {
    const [activeTab, setActiveTab] = useState("Resumo");

    return (
        <div className="w-full text-gray-900 pb-10">
            {/* Header */}
            <div className="mb-8 cursor-pointer" onClick={onBack}>
                <span className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
                    Suas propostas / {proposal.name} {proposal.hash}
                </span>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-semibold text-gray-900">{proposal.name}</h1>
                {activeTab === 'Documentação' && (
                    <Button className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full px-6 gap-2">
                        <ReceiptText className="w-4 h-4" /> Subir documento
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 mb-8 pt-2">
                {["Resumo", "Documentação", "Pagamentos"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-base font-medium relative transition-colors ${activeTab === tab
                            ? "text-[#7ab635]"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {tab}
                        {tab === "Documentação" && (
                            <span className="absolute -top-1 -right-4 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                1
                            </span>
                        )}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#92dc49] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Alert Banner that appears on Resumo and Documentacao tabs */}
            {(activeTab === "Resumo" || activeTab === "Documentação") && (
                <div className="bg-[#fbe7e8] border border-red-100 rounded-2xl p-5 flex items-start gap-3 mb-6 animate-in fade-in duration-300">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <p className="text-gray-900 font-medium">Sua proposta possui 1 pendência <span className="font-bold">documental</span>.</p>
                        {activeTab === "Resumo" ? (
                            <button
                                onClick={() => setActiveTab("Documentação")}
                                className="text-sm text-gray-500 hover:text-gray-900 mt-1"
                            >
                                Abrir "Documentação"
                            </button>
                        ) : (
                            <span className="text-sm text-gray-500 mt-1 block">Acesse "Documentação" para saber mais.</span>
                        )}
                    </div>
                </div>
            )}

            {/* Content - Resumo */}
            {activeTab === "Resumo" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* 3 Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                            <span className="text-sm text-gray-500 mb-2 block">Etapa</span>
                            <span className="text-xl font-semibold">{mockResumoData.etapa}</span>
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex justify-between items-center">
                            <div>
                                <span className="text-sm text-gray-500 mb-2 block">Andamento</span>
                                <span className="text-xl font-semibold">{mockResumoData.andamento}</span>
                            </div>
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        className="text-gray-100"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="text-[#92dc49]"
                                        strokeDasharray={`${parseInt(mockResumoData.andamento)}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                </svg>
                                <Clock className="w-4 h-4 text-[#92dc49] absolute" />
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                            <span className="text-sm text-gray-500 mb-2 block">Status</span>
                            <span className="inline-flex bg-[#f5b027] text-white px-8 py-2 rounded-lg font-bold w-full justify-center">
                                {mockResumoData.status}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
                        <span className="text-sm font-medium text-gray-500 mb-8 block">Linha do tempo</span>
                        <div className="relative">
                            <div className="absolute top-2 left-[5%] right-[5%] h-1 bg-gray-200 rounded-full" />
                            {/* Progress bar up to error */}
                            <div className="absolute top-2 left-[5%] w-[40%] h-1 bg-[#92dc49] rounded-l-full" />

                            <div className="flex justify-between relative z-10 w-full">
                                {timelineSteps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-3 w-32 text-center">
                                        <div className={`w-5 h-5 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center
                      ${step.status === 'completed' ? 'bg-[#92dc49]' :
                                                step.status === 'error' ? 'bg-red-500' :
                                                    'bg-gray-300'}`}
                                        />
                                        <div>
                                            <span className="block text-sm font-semibold text-gray-900">{step.label}</span>
                                            <span className={`block text-xs mt-1 ${step.status === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                                                {step.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dados Cadastrais */}
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
                        <span className="text-sm font-medium text-gray-500 mb-6 block">Dados cadastrais</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span className="w-24 text-sm text-gray-500">Empresa</span>
                                <span className="text-sm font-medium text-gray-900">{mockResumoData.cadastrais.empresa}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="w-24 text-sm text-gray-500">Valor</span>
                                <span className="text-sm font-medium text-gray-900">{mockResumoData.cadastrais.valor}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="w-24 text-sm text-gray-500">Indústria</span>
                                <span className="text-sm font-medium text-gray-900">{mockResumoData.cadastrais.industria}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="w-24 text-sm text-gray-500">Tamanho</span>
                                <span className="text-sm font-medium text-gray-900">{mockResumoData.cadastrais.tamanho}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Receipt className="w-4 h-4 text-gray-400" />
                                <span className="w-24 text-sm text-gray-500">Faturamento</span>
                                <span className="text-sm font-medium text-gray-900">{mockResumoData.cadastrais.faturamento}</span>
                            </div>
                            <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                <span className="w-24 text-sm text-gray-500 shrink-0">Endereço</span>
                                <span className="text-sm font-medium text-gray-900">{mockResumoData.cadastrais.endereco}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Cards - Seguro & Objeto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-medium text-gray-500">Detalhes do seguro</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-400">
                                        <ReceiptText className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-400">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Seguradora</h3>

                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-800">{mockResumoData.seguro.seguradora.tipo}</span>
                                <span className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-800">Prêmio: {mockResumoData.seguro.seguradora.premio}</span>
                                <span className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-800">Franquia: {mockResumoData.seguro.seguradora.franquia}</span>

                                {mockResumoData.seguro.seguradora.coberturas.map(cob => (
                                    <span key={cob} className="px-4 py-2 border border-[#92dc49] bg-[#f4faed] rounded-lg text-sm font-medium text-gray-800 flex items-center gap-1">
                                        <span className="text-[#92dc49]">✓</span> {cob}
                                    </span>
                                ))}

                                <span className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-800">Emissão: {mockResumoData.seguro.seguradora.emissao}</span>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 mt-[42px]">Objeto segurado</h3>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Sprout className="w-3 h-3" /> Cultura</span>
                                    <span className="text-sm font-semibold text-gray-900">{mockResumoData.seguro.objeto.cultura}</span>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Map className="w-3 h-3" /> Área</span>
                                    <span className="text-sm font-semibold text-gray-900">{mockResumoData.seguro.objeto.area}</span>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Município/UF</span>
                                    <span className="text-sm font-semibold text-gray-900">{mockResumoData.seguro.objeto.municipio}</span>
                                </div>
                            </div>
                            <div className="w-1/2 border border-gray-200 rounded-lg p-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Banknote className="w-3 h-3" /> Valor segurado</span>
                                <span className="text-sm font-semibold text-gray-900">{mockResumoData.seguro.objeto.valorSegurado}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content - Documentação */}
            {activeTab === "Documentação" && (
                <div className="animate-in fade-in duration-300">
                    <div className="w-full bg-white rounded-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 text-sm font-medium text-gray-500 flex items-center gap-1">
                                        <ArrowDownUp className="w-3 h-3" /> Nome
                                    </th>
                                    <th className="py-4 text-sm font-medium text-gray-500">
                                        <div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Data de emissão</div>
                                    </th>
                                    <th className="py-4 text-sm font-medium text-gray-500">
                                        <div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Data de validade</div>
                                    </th>
                                    <th className="py-4 text-sm font-medium text-gray-500">
                                        <div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Status</div>
                                    </th>
                                    <th className="py-4 px-2 text-right text-sm font-medium text-gray-500">Abrir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockDocs.map(doc => (
                                    <tr key={doc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer group">
                                        <td className="py-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                                            {doc.nome}
                                            {doc.hasWarning && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">{doc.emissao}</td>
                                        <td className="py-4 text-sm text-gray-600">{doc.validade}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getBadgeStyle(doc.status)}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className="bg-gray-100 rounded p-1.5 w-7 h-7 inline-flex items-center justify-center group-hover:bg-[#92dc49] group-hover:text-white transition-colors ml-auto">
                                                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Content - Pagamentos */}
            {activeTab === "Pagamentos" && (
                <div className="animate-in fade-in duration-300">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-16 flex items-center justify-center min-h-[400px]">
                        <div className="text-center max-w-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Fique tranquilo.</h3>
                            <p className="text-gray-500">Os pagamentos dessa proposta estarão disponíveis após o registro de seu contrato.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
