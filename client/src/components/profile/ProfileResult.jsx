import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Download,
    Eye,
    AlertTriangle,
    XCircle,
    CheckCircle2,
    AlertOctagon,
    X,
    Search,
    CircleDashed,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";

export function ProfileResult({ searchData, onBack, isEmbedded = false }) {
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

    const decisoesData = [
        { id: 1, text: "Período de fundação > 2 anos", status: "success", sub: "OK" },
        { id: 2, text: "CNPJ é PME", status: "success", sub: "Não consta" },
        { id: 3, text: "QSA atualizado há mais de um ano", status: "success", sub: null },
        { id: 4, text: "Sócio maior de idade", status: "success", sub: null },
        { id: 5, text: "Sócio sem registro de óbito", status: "success", sub: null },
        { id: 6, text: "Sócio sem registro no CCF", status: "success", sub: null },
        { id: 7, text: "Sócio não se enquadra em score de altíssimo risco", status: "success", sub: null },
        { id: 8, text: "Sócio sem restrições ou com valor inferior a R$ 1.000,00", status: "success", sub: null },
    ];

    const complianceData = [
        { id: 1, text: "Pessoa física possui processos judiciais", status: "warning", sub: null },
        { id: 2, text: "Sócio não é PEP", status: "success", sub: "OK" },
        { id: 3, text: "CNPJ possui registro no CEIS?", status: "none", sub: "Sem resultado" },
        { id: 4, text: "CNPJ possui registro no CNAP?", status: "none", sub: "Sem resultado" },
        { id: 5, text: "Pessoa física possui antecedentes criminais?", status: "none", sub: "Sem resultado" },
        { id: 6, text: "Pessoa física possui mandados de prisão?", status: "none", sub: "Sem resultado" },
        { id: 7, text: "Pessoa física possui certificado negativo de débitos?", status: "none", sub: "Sem resultado" },
    ];

    const processosOverview = {
        total: 738,
        valorTotal: "R$ 23.948.640,00",
        poloAtivo: 196,
        poloPassivo: 558,
        poloVariado: 32
    };

    const processosLista = [
        { id: "00012345620238190001", tribunal: "TRJSP", area: "Indenização por dano material", orgao: "13 VARA CIVEL", valor: "Não informado", status: "ARQUIVADO", ultimaMov: "21/08/2024" },
        { id: "00012345620238190001-2", tribunal: "TRJSP", area: "Indenização por dano material", orgao: "13 VARA CIVEL", valor: "Não informado", status: "ARQUIVADO", ultimaMov: "21/08/2024" },
        { id: "00012345620238190001-3", tribunal: "TRJSP", area: "Indenização por dano material", orgao: "13 VARA CIVEL", valor: "Não informado", status: "ARQUIVADO", ultimaMov: "21/08/2024" },
        { id: "00012345620238190001-4", tribunal: "TRJSP", area: "Indenização por dano material", orgao: "13 VARA CIVEL", valor: "Não informado", status: "ARQUIVADO", ultimaMov: "21/08/2024" },
        { id: "00012345620238190001-5", tribunal: "TRJSP", area: "Indenização por dano material", orgao: "13 VARA CIVEL", valor: "Não informado", status: "ARQUIVADO", ultimaMov: "21/08/2024" },
        { id: "00012345620238190001-6", tribunal: "TRJSP", area: "Indenização por dano material", orgao: "13 VARA CIVEL", valor: "Não informado", status: "ARQUIVADO", ultimaMov: "21/08/2024" },
    ];

    const scrData = {
        dadosEnviados: [
            { label: "Documento", value: "527185780000179" },
            { label: "Documento", value: "527185780000179" },
            { label: "Valor da Carteira", value: "R$ 128.163.572,64", highlight: true },
            { label: "Valor Coobrigações", value: "R$ 0,00" },
            { label: "Valor de crédito a vencer", value: "R$ 127.807.074,78" },
            { label: "Valor de crédito vencido", value: "R$ 356.497,86", highlight: true },
            { label: "Valor Prejuízo", value: "R$ 0,00" },
            { label: "Limite de crédito", value: "R$ 422.970,26" },
            { label: "Crédito a liberar", value: "R$ 0,00" },
            { label: "Limite até 360 dias", value: "R$ 421.970,26" },
            { label: "Limite acima 360 dias", value: "R$ 1.000,00" },
            { label: "Risco indireto", value: "R$ 0,00" },
            { label: "Risco total", value: "R$ 128.586.542,90", highlight: true },
            { label: "Responsabilidade total", value: "R$ 128.586.542,90", highlight: true },
        ],
        aVencer: [
            { label: "Até 30 dias", value: "R$ 8.825.845,80" },
            { label: "de 31 a 60 dias", value: "R$ 4.068.364,11" },
            { label: "de 61 a 90 dias", value: "R$ 4.717.519,32" },
            { label: "de 91 a 180 dias", value: "R$ 12.970.962,21" },
            { label: "de 181 a 360 dias", value: "R$ 19.049.764,84" },
            { label: "acima de 360 dias", value: "R$ 78.174.617,50" },
        ],
        vencidos: [
            { label: "Até 30 dias", value: "R$ 356.497,86" },
            { label: "de 31 a 60 dias", value: "R$ 0,00" },
            { label: "de 61 a 90 dias", value: "R$ 0,00" },
            { label: "de 91 a 180 dias", value: "R$ 0,00" },
            { label: "de 181 a 360 dias", value: "R$ 0,00" },
            { label: "acima de 360 dias", value: "R$ 0,00" },
        ],
        modalidades: [
            { codigo: "101", descricao: "Adiantamentos a depositantes", regulamento: "Adiantamentos a depositantes", valor: "R$ 202,55" },
            { codigo: "213", descricao: "Empréstimos", regulamento: "Cheque especial", valor: "R$ 4.431,54" },
            { codigo: "214", descricao: "Empréstimos", regulamento: "Conta garantida", valor: "R$ 4.569.299,35" },
            { codigo: "215", descricao: "Empréstimos", regulamento: "Capital de giro com prazo de vencimento até 365 d", valor: "R$ 4.569.299,35" },
            { codigo: "216", descricao: "Empréstimos", regulamento: "Capital de giro com prazo de vencimento até 365 d", valor: "R$ 4.569.299,35" },
            { codigo: "217", descricao: "Empréstimos", regulamento: "Capital de giro com prazo de vencimento até 365 d", valor: "R$ 4.569.299,35" },
            { codigo: "218", descricao: "Empréstimos", regulamento: "Capital de giro com prazo de vencimento até 365 d", valor: "R$ 4.569.299,35" },
            { codigo: "219", descricao: "Empréstimos", regulamento: "Capital de giro com prazo de vencimento até 365 d", valor: "R$ 4.569.299,35" },
            { codigo: "220", descricao: "Empréstimos", regulamento: "Capital de giro com prazo de vencimento até 365 d", valor: "R$ 4.569.299,35" },
        ],
        adicionais: [
            { label: "Limite aprovado e não utilizado", value: "R$ 422.970,26", type: "success" },
            { label: "Valor total da carteira de crédito", value: "R$ 128.163.572,64", type: "success" },
            { label: "Comprometimento de Operações de crédito\nvencido + vencer até 360 dias", sub: "Percentual de comprometimento de operações de crédito é maior que 30%", value: "199,00%", type: "warning" },
            { label: "Utilização de cheque especial", sub: "Percentual de participação nas operações de crédito é maior que 30%", value: "", type: "warning" },
        ]
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/Relatorio_consulta.pdf';
        link.setAttribute('download', 'Relatorio_consulta.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const content = (
        <>
            {!isEmbedded && (
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
            )}

            <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 ${isEmbedded ? '' : 'mt-6'}`}>
                {/* Company Info */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">{isEmbedded ? 'Análise de Risco' : 'Informações da Empresa'}</h2>
                        {isEmbedded && (
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
                                    Visualizar relatório
                                </Button>
                            </div>
                        )}
                    </div>
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
                            {[
                                { id: 'validacoes', label: "Validações Primárias" },
                                { id: 'decisoes', label: "Decisões de Negócio" },
                                { id: 'scr', label: "SCR" },
                                { id: 'processos', label: "Processos" },
                                { id: 'compliance', label: "Compliance" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? "text-[#92dc49]"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#92dc49]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'validacoes' && validations.map(item => <ChecklistRow key={item.id} item={item} />)}
                        {activeTab === 'decisoes' && decisoesData.map(item => <ChecklistRow key={item.id} item={item} />)}
                        {activeTab === 'compliance' && complianceData.map(item => <ChecklistRow key={item.id} item={item} />)}

                        {activeTab === 'processos' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                        <div className="text-gray-500 text-sm mb-2">Total de processos</div>
                                        <div className="text-xl font-bold">{processosOverview.total}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                        <div className="text-gray-500 text-sm mb-2">Valor total</div>
                                        <div className="text-xl font-bold">{processosOverview.valorTotal}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                        <div className="text-gray-500 text-sm mb-2">Polo ativo</div>
                                        <div className="text-xl font-bold">{processosOverview.poloAtivo}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                        <div className="text-gray-500 text-sm mb-2">Polo passivo</div>
                                        <div className="text-xl font-bold">{processosOverview.poloPassivo}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                        <div className="text-gray-500 text-sm mb-2">Polo variado</div>
                                        <div className="text-xl font-bold">{processosOverview.poloVariado}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 max-w-sm">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Pesquise um processo"
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                        />
                                    </div>
                                    <Button variant="outline" size="icon" className="shrink-0 text-gray-500"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM9.5 9C8.67157 9 8 9.67157 8 10.5C8 11.3284 8.67157 12 9.5 12C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></Button>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-[11px] uppercase text-gray-500 font-bold">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="px-4 py-4 text-left">Número do Processo</th>
                                                <th className="px-4 py-4 text-left">Tribunal</th>
                                                <th className="px-4 py-4 text-left">Área</th>
                                                <th className="px-4 py-4 text-left">Órgão Julgador</th>
                                                <th className="px-4 py-4 text-left">Valor da Causa</th>
                                                <th className="px-4 py-4 text-left">Status</th>
                                                <th className="px-4 py-4 text-left">Última Movimentação</th>
                                                <th className="px-4 py-4 w-12 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-900 font-medium">
                                            {processosLista.map(proc => (
                                                <tr key={proc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="px-4 py-4">{proc.id}</td>
                                                    <td className="px-4 py-4">{proc.tribunal}</td>
                                                    <td className="px-4 py-4 capitalize-first">{proc.area}</td>
                                                    <td className="px-4 py-4">{proc.orgao}</td>
                                                    <td className="px-4 py-4">{proc.valor}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded-sm font-bold text-[10px]">{proc.status}</span>
                                                    </td>
                                                    <td className="px-4 py-4">{proc.ultimaMov}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        <ArrowUpRight className="w-4 h-4 text-gray-500 cursor-pointer" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="flex justify-end p-4">
                                        <div className="flex items-center gap-1">
                                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-gray-200"><ChevronsLeft className="w-4 h-4 text-gray-400" /></Button>
                                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-gray-200"><ChevronLeft className="w-4 h-4 text-gray-400" /></Button>
                                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-gray-200 shadow-sm">1</Button>
                                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500">2</Button>
                                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500">3</Button>
                                            <span className="text-gray-400 px-1">...</span>
                                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-gray-200"><ChevronRight className="w-4 h-4 text-gray-400" /></Button>
                                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-gray-200"><ChevronsRight className="w-4 h-4 text-gray-400" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'scr' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* SCR Section 1 */}
                                <div className="bg-white border text-sm border-gray-100 shadow-sm rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-6">Dados enviados</h4>
                                    <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-10">
                                        {scrData.dadosEnviados.map((d, i) => (
                                            <div key={i} className="flex gap-2 flex-col">
                                                <span className="text-gray-400 mb-1 leading-none">{d.label}</span>
                                                <span className={`font-medium ${d.highlight ? 'font-bold text-lg' : ''}`}>{d.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-6">A vencer</h4>
                                    <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-10">
                                        {scrData.aVencer.map((d, i) => (
                                            <div key={i} className="flex gap-2 flex-col">
                                                <span className="text-gray-400 mb-1 leading-none">{d.label}</span>
                                                <span className="font-medium">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-6">Vencidos</h4>
                                    <div className="grid grid-cols-3 gap-y-6 gap-x-12">
                                        {scrData.vencidos.map((d, i) => (
                                            <div key={i} className="flex gap-2 flex-col">
                                                <span className="text-gray-400 mb-1 leading-none">{d.label}</span>
                                                <span className="font-medium">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SCR Section 2 */}
                                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-6">Modalidades</h4>
                                    <div className="overflow-hidden">
                                        <table className="w-full text-xs uppercase text-gray-500 font-bold border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200">
                                                    <th className="pb-3 text-left">Código</th>
                                                    <th className="pb-3 text-left">Descrição</th>
                                                    <th className="pb-3 text-left">Regulamento</th>
                                                    <th className="pb-3 text-right">Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-900 font-medium lowercase capitalize-first">
                                                {scrData.modalidades.map((d, i) => (
                                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                        <td className="py-3 uppercase">{d.codigo}</td>
                                                        <td className="py-3">{d.descricao}</td>
                                                        <td className="py-3">{d.regulamento}</td>
                                                        <td className="py-3 text-right uppercase">{d.valor}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SCR Section 3 */}
                                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-6">Dados SCR adicionais</h4>
                                    <div className="space-y-4">
                                        {scrData.adicionais.map((d, i) => (
                                            <div key={i} className={`p-4 rounded-lg flex items-center justify-between
                                                ${d.type === 'success' ? 'bg-[#e8f5e0]' : 'bg-[#fff5e6]'}`}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 whitespace-pre-line leading-tight">{d.label}</span>
                                                    {d.sub && <span className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">{d.sub}</span>}
                                                </div>
                                                {d.value && <span className="font-bold text-gray-900">{d.value}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Report Modal */}
            {
                showReport && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animated animate-in fade-in duration-200">
                        <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-semibold text-lg">Relatório de Análise.pdf</h3>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Baixar</Button>
                                    <Button variant="ghost" size="icon" onClick={() => setShowReport(false)}><X className="w-5 h-5" /></Button>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-100 overflow-hidden">
                                <iframe
                                    src="/Relatorio_consulta.pdf#view=FitH"
                                    className="w-full h-full border-0"
                                    title="Relatório PDF"
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );

    if (isEmbedded) {
        return content;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {content}
        </div>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div className="grid grid-cols-[140px_1fr] items-baseline">
            <span className="text-gray-400 whitespace-nowrap">{label}:</span>
            <span className={`font-medium ${highlight ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>{value}</span>
        </div>
    );
}

function ChecklistRow({ item }) {
    return (
        <div
            className={`p-4 rounded-lg flex items-center gap-4 ${item.status === 'error' ? 'bg-red-50' :
                item.status === 'warning' ? 'bg-[#fff5e6]' :
                    item.status === 'none' ? 'bg-gray-100' :
                        'bg-[#e8f5e0]'
                } animate-in fade-in duration-300`}
        >
            {item.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
            {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {item.status === 'success' && <CheckCircle2 className="w-5 h-5 text-[#92dc49]" />}
            {item.status === 'none' && <CircleDashed className="w-5 h-5 text-gray-400" />}

            <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                    {item.text}
                </span>
                {item.sub && (
                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${item.status === 'error' ? 'text-red-500' :
                        item.status === 'warning' ? 'text-amber-600' :
                            'text-gray-500'
                        }`}>
                        {item.sub}
                    </span>
                )}
            </div>
        </div>
    );
}
