import React, { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronDown, Paperclip, MoreHorizontal, ArrowUpRight, Search, Filter, PenTool, CheckCircle, Clock, Download, Check, FileText, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function JuridicoProposalDetail({ proposal, onBack }) {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("Dossiê");
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signed, setSigned] = useState(false);
    const [showDocAnalysis, setShowDocAnalysis] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('Matrícula');
    const tabs = ["Dossiê", "Documentos", "Assinaturas", "Registro de Garantias"];

    const primaryButtonText = activeTab === "Registro de Garantias"
        ? "Enviar garantias para registro"
        : (signed ? "Enviar para Cotação e Seguro" : "Gerar Contrato / Instrumento");

    const renderDossie = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Esquerda: Linha do tempo */}
            <div className="lg:col-span-7 border-r border-gray-100 pr-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Linha do tempo</h3>

                <div className="bg-white border rounded-xl p-3 shadow-sm mb-6">
                    <input
                        type="text"
                        placeholder="Escreva um comentário..."
                        className="w-full text-sm outline-none px-2 py-1 mb-2 placeholder-gray-400"
                    />
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100">
                            <Paperclip className="w-3.5 h-3.5" /> Anexar...
                        </button>
                    </div>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {/* Timeline Item 1 */}
                    <div className="relative flex items-start gap-4 mb-8">
                        <div className="w-8 h-8 rounded-full bg-[#92dc49] text-white flex items-center justify-center font-bold text-sm z-10 shrink-0">A</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Daniel Alves <span className="font-normal text-gray-500">(Analista)</span> criou uma pendência na proposta:
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">16/11/25 15:00</span>
                            </div>

                            <div className="mt-3 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Data</th>
                                            <th className="px-4 py-2 font-medium">Descrição</th>
                                            <th className="px-4 py-2 font-medium">Responsável</th>
                                            <th className="px-4 py-2 font-medium">Prazo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-gray-100 bg-white">
                                            <td className="px-4 py-3 text-gray-600">16/11/25</td>
                                            <td className="px-4 py-3 text-gray-900">Enviar CAR atualizado</td>
                                            <td className="px-4 py-3 text-gray-600">Projetista</td>
                                            <td className="px-4 py-3 text-gray-600">20/11</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative flex items-start gap-4 mb-8 mt-6">
                        <div className="w-8 h-8 rounded-full bg-[#92dc49] text-white flex items-center justify-center font-bold text-sm z-10 shrink-0">A</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-900">
                                    Daniel Alves <span className="font-normal text-gray-500">(Analista)</span> evoluiu esta proposta para a etapa <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold">Crédito</span>
                                    <br /><span className="font-normal text-gray-500">após 6 dias na etapa anterior.</span>
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">16/11/25 15:00</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Item 3 */}
                    <div className="relative flex items-start gap-4 mb-8 mt-6">
                        <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-sm z-10 shrink-0">R</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-900">
                                    Ronaldo Portobello <span className="font-normal text-gray-500">(Projetista)</span> evoluiu esta proposta para a etapa <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold">Técnica</span>
                                    <br /><span className="font-normal text-gray-500">após 3 dias na etapa anterior.</span>
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">10/11/25 10:00</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Item 4 */}
                    <div className="relative flex items-start gap-4 mb-8 mt-6">
                        <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-sm z-10 shrink-0">R</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-900">
                                    Ronaldo Portobello <span className="font-normal text-gray-500">(Projetista)</span> adicionou um comentário na proposta:
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">10/11/25 15:00</span>
                            </div>

                            <div className="bg-white border rounded-xl p-4 shadow-sm text-sm text-gray-700">
                                Pré-análise e simulação realizada. Cliente deseja seguir com a configuração presente no arquivo que anexei.
                                <div className="mt-3">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 w-fit">
                                        <Paperclip className="w-3.5 h-3.5" /> Simulação
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Direita: Resumo */}
            <div className="lg:col-span-5 space-y-4 pl-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 font-medium mb-1">Valor da proposta</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">R$ 50.000.000,00</span>
                            <span className="px-2 py-0.5 bg-[#92dc49] text-white text-xs font-bold rounded-full">AA</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Etapa</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-gray-900">Crédito</span>
                                <span className="text-gray-400 text-sm">→ Jurídico</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 font-medium mb-1">Linha de crédito</p>
                        <span className="text-xl font-bold text-gray-900">Não rural</span>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                            <span className="inline-block px-8 py-1.5 bg-[#92dc49] text-white text-sm font-bold rounded-full shadow-sm">Ok</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-100 pl-4 justify-center">
                            <p className="text-sm text-gray-500 font-medium mb-1">Andamento</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">58%</span>
                                <div className="w-6 h-6 rounded-full border-4 border-gray-100 border-t-[#92dc49] border-r-[#92dc49] transform rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">Dados cadastrais</h4>
                    <div className="grid grid-cols-[130px_1fr] gap-y-3 gap-x-4 text-sm break-words">
                        <div className="text-gray-400 flex items-center justify-end gap-2"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Empresa</div>
                        <div className="text-gray-900 font-medium">Victor Oliveira de Sá</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Indústria</div>
                        <div className="text-gray-900">Agronomia</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Faturamento</div>
                        <div className="text-gray-900">R$ 300.000.000 / ano</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Tamanho</div>
                        <div className="text-gray-900">500-1000 funcionários</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><UserIcon /> Cliente</div>
                        <div className="text-gray-900">Fernando Fagundes</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><PhoneIcon /> Telefone</div>
                        <div className="text-gray-900">(00) 000000-0000</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><HashIcon /> CPF</div>
                        <div className="text-gray-900">000.000.000-00</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><MailIcon /> E-mail</div>
                        <div className="text-gray-900">victor.oli@pdiniz.com.br</div>

                        <div className="text-gray-400 flex items-center justify-end gap-2"><MapPinIcon /> Endereço</div>
                        <div className="text-gray-900">Residencial Claúdio Marchetti, Rua Três - Cuiabá, MT 78076-308</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">Condições Aprovadas</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="border border-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><CoinIcon /> Valor</p>
                            <p className="text-base font-medium text-gray-900">R$ 50.000.000</p>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-400 flex items-center gap-1"><PercentIcon /> Taxa</p>
                            <p className="text-base font-medium text-gray-900">4,75% a.a. + IPCA</p>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-400 flex items-center gap-1"><CalendarIcon /> Prazo</p>
                            <p className="text-base font-medium text-gray-900">420 meses</p>
                        </div>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-3">
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><ShieldIcon /> Garantias</p>
                        <p className="text-sm font-medium text-gray-900">...</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDocumentos = () => (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <Search className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <Filter className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm ml-2">
                    <ChevronDown className="w-3.5 h-3.5" /> Tipo
                </button>
            </div>
            <Table>
                <TableHeader className="bg-transparent border-b-gray-100">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-medium text-gray-500 w-[20%]">Nome</TableHead>
                        <TableHead className="font-medium text-gray-500 w-[20%]">Data de emissão</TableHead>
                        <TableHead className="font-medium text-gray-500 w-[20%]">Data de validade</TableHead>
                        <TableHead className="font-medium text-gray-500 w-[20%]">Status</TableHead>
                        <TableHead className="text-right font-medium text-gray-500">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[
                        { nome: 'Matrícula', em: '02/11/2025', val: '20/11/2025' },
                        { nome: 'Projeto', em: '02/11/2025', val: '12/11/2025' },
                        { nome: 'IRPF 2024', em: '02/11/2025', val: '31/12/2025' },
                        { nome: 'Registro', em: '02/11/2025', val: '30/11/2025' },
                        { nome: 'IRPF 2025', em: '02/11/2025', val: '31/12/2026' },
                        { nome: 'Simulação', em: '01/11/2025', val: '31/12/2026' }
                    ].map((doc, i) => (
                        <TableRow key={i} className="hover:bg-gray-50/50 border-b-gray-50">
                            <TableCell className="font-medium text-gray-800"><div className="flex items-center gap-1"><ChevronDown className="w-3.5 h-3.5 text-gray-400" /> {doc.nome}</div></TableCell>
                            <TableCell className="text-gray-600">{doc.em}</TableCell>
                            <TableCell className="text-gray-600">{doc.val}</TableCell>
                            <TableCell>
                                <span className="inline-flex w-7 h-7 bg-[#2da64f] text-white text-[10px] font-bold items-center justify-center rounded-full">OK</span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-500" onClick={() => { setSelectedDoc(doc.nome); setShowDocAnalysis(true); }}><MoreHorizontal className="w-4 h-4" /></button>
                                    <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-500" onClick={() => { setSelectedDoc(doc.nome); setShowDocAnalysis(true); }}><ArrowUpRight className="w-4 h-4" /></button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    const renderAssinaturas = () => (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-transparent border-b-gray-100">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-medium text-gray-500 w-[25%]"><div className="flex items-center gap-1"><ChevronDown className="w-3.5 h-3.5" /> Nome</div></TableHead>
                        <TableHead className="font-medium text-gray-500 w-[20%]"><div className="flex items-center gap-1"><ChevronDown className="w-3.5 h-3.5" /> Data de envio</div></TableHead>
                        <TableHead className="font-medium text-gray-500 w-[35%]">Mensagem</TableHead>
                        <TableHead className="text-right font-medium text-gray-500">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="hover:bg-gray-50/50 border-b-gray-50">
                        <TableCell className="font-medium text-gray-800">Minuta</TableCell>
                        <TableCell className="text-gray-600">24/01/2026</TableCell>
                        <TableCell className="text-gray-600">{signed ? "" : "Sua assinatura está pendente."}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <div className="flex rounded-md border border-yellow-200 overflow-hidden text-xs cursor-pointer hover:opacity-80 transition-colors" onClick={() => setShowSignatureModal(true)}>
                                    <button className={`flex items - center gap - 1 px - 3 py - 1.5 font - medium transition - colors pointer - events - none ${signed ? 'bg-gray-200 text-gray-600' : 'bg-[#fceea5] text-yellow-800'} `}>
                                        <PenTool className="w-3.5 h-3.5" /> {signed ? "Assinado" : "Assinar"}
                                    </button>
                                    <span className="px-2 py-1.5 bg-gray-50 text-gray-500 border-l border-yellow-200 font-medium">{signed ? '3/3' : '2/3'}</span>
                                </div>
                                <button className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 shadow-sm" onClick={() => setShowSignatureModal(true)}><ArrowUpRight className="w-4 h-4" /></button>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50/50 border-b-gray-50">
                        <TableCell className="font-medium text-gray-800">Contrato de Seguro</TableCell>
                        <TableCell className="text-gray-600">24/01/2026</TableCell>
                        <TableCell className="text-gray-600"></TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs cursor-pointer hover:opacity-80 transition-colors" onClick={() => setShowSignatureModal(true)}>
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-600 font-medium pointer-events-none">
                                        <PenTool className="w-3.5 h-3.5" /> Assinado
                                    </button>
                                    <span className="px-2 py-1.5 bg-gray-50 text-gray-500 border-l border-gray-200 font-medium">3/3</span>
                                </div>
                                <button className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 shadow-sm" onClick={() => setShowSignatureModal(true)}><ArrowUpRight className="w-4 h-4" /></button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );

    const renderGarantias = () => (
        <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800">Imóveis rurais</h3>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-transparent border-b-gray-100">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-medium text-gray-500">Nome/Descrição</TableHead>
                            <TableHead className="font-medium text-gray-500">CPF/CNPJ</TableHead>
                            <TableHead className="font-medium text-gray-500">Matrícula</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-gray-50/50 border-b-gray-50">
                            <TableCell className="font-medium text-gray-800">Fazenda Boa Vista</TableCell>
                            <TableCell className="text-gray-600">82.341.222/0001-99</TableCell>
                            <TableCell className="text-gray-600 font-mono">152.098</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-gray-50/50 border-white">
                            <TableCell className="font-medium text-gray-800">Sítio Esperança</TableCell>
                            <TableCell className="text-gray-600">12.441.555/0001-33</TableCell>
                            <TableCell className="text-gray-600 font-mono">88.421</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] w-full mx-auto">
            {/* Header section with back button and actions */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <div className="flex items-center justify-center gap-3">
                            <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tight">{proposal.name}</h1>
                            {signed && (
                                <span className="px-3 py-1 bg-[#efffdb] text-[#558b2f] border border-[#dcebc0] text-[11px] font-bold rounded-full mt-1">
                                    ASSINADO
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 text-gray-700 bg-white shadow-sm">
                            <ChevronDown className="w-4 h-4" /> Ações
                        </button>
                        {signed ? (
                            <button
                                className="px-5 py-2 bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full text-sm font-medium shadow-sm shadow-[#92dc49]/30 transition-colors"
                                onClick={() => {
                                    localStorage.setItem('userRole', 'posvenda');
                                    window.dispatchEvent(new Event('storage'));
                                    setLocation(`/seguros/${proposal.id}`);
                                    setTimeout(() => window.location.reload(), 100);
                                }}
                            >
                                Enviar para Cotação e Seguro
                            </button>
                        ) : (
                            <button className="px-5 py-2 bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full text-sm font-medium shadow-sm shadow-[#92dc49]/30 transition-colors">
                                {primaryButtonText}
                            </button>
                        )}
                    </div>
                </div>
                <div className="ml-12 text-sm text-gray-500">
                    Protocolo: <span className="font-mono">{proposal.hash || proposal.id}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8 ml-12 overflow-x-auto hide-scrollbar">
                <ul className="flex flex-wrap text-sm font-medium text-center gap-x-8">
                    {tabs.map((tab) => (
                        <li className="me-2" key={tab}>
                            <button
                                href="#"
                                className={`inline - block pb - 3 whitespace - nowrap ${activeTab === tab
                                    ? "text-gray-900 border-b-2 border-[#92dc49]"
                                    : "text-gray-400 hover:text-gray-600 hover:border-b-2 hover:border-gray-300"
                                    } `}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(tab);
                                }}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ml-12">
                {activeTab === "Dossiê" && renderDossie()}
                {activeTab === "Documentos" && renderDocumentos()}
                {activeTab === "Assinaturas" && renderAssinaturas()}
                {activeTab === "Registro de Garantias" && renderGarantias()}
            </div>

            {/* Document Analysis Modal */}
            <Dialog open={showDocAnalysis} onOpenChange={setShowDocAnalysis}>
                <DialogContent className="max-w-[100vw] w-screen h-screen bg-[#333333] border-none rounded-none p-4 flex gap-4 overflow-hidden">
                    {/* Left Sidebar - Documents List (Floating Card) */}
                    <div className="w-56 bg-[#f8f9fa] rounded-2xl flex flex-col p-4 shadow-2xl" style={{ height: '50%' }}>
                        <div className="flex items-center gap-2 mb-6">
                            <button className="h-8 w-8 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-200" onClick={() => setShowDocAnalysis(false)}>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-xs truncate">{proposal?.name || "Victor Oliveira"}</span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 px-2">Documentos</p>

                            <div
                                onClick={() => setSelectedDoc('Matrícula')}
                                className={`p - 3 rounded - xl text - xs font - bold flex items - center gap - 3 cursor - pointer transition - all border ${selectedDoc === 'Matrícula' ? 'bg-[#efffdb] text-[#558b2f] border-[#dcebc0] shadow-sm' : 'hover:bg-white text-gray-500 border-transparent hover:border-gray-100 hover:shadow-sm'} `}
                            >
                                <FileText className={`w - 4 h - 4 ${selectedDoc === 'Matrícula' ? 'fill-[#558b2f] text-transparent' : 'text-gray-400'} `} />
                                Matrícula
                            </div>

                            <div
                                onClick={() => setSelectedDoc('Projeto')}
                                className={`p - 3 rounded - xl text - xs font - bold flex items - center gap - 3 cursor - pointer transition - all border ${selectedDoc === 'Projeto' ? 'bg-[#efffdb] text-[#558b2f] border-[#dcebc0] shadow-sm' : 'hover:bg-white text-gray-500 border-transparent hover:border-gray-100 hover:shadow-sm'} `}
                            >
                                <FileText className={`w - 4 h - 4 ${selectedDoc === 'Projeto' ? 'fill-[#558b2f] text-transparent' : 'text-gray-400'} `} />
                                Projeto
                            </div>
                        </div>
                    </div>

                    {/* Center - Image Viewer */}
                    <div className="flex-1 flex items-center justify-center relative rounded-2xl overflow-hidden bg-[#222]">
                        <div className="w-full h-full overflow-auto flex items-center justify-center p-8 custom-scrollbar-dark">
                            <div className="relative shadow-2xl origin-center">
                                <div className="w-[500px] h-[700px] bg-[#fdfbf7] relative text-[9px] font-serif leading-relaxed p-10 select-none shadow-black/50 shadow-2xl">
                                    <div className="absolute top-0 right-0 p-4 text-right text-[10px]">Cuiabá, <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">05</span> de <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">novembro</span> de <span className="text-blue-700 bg-blue-100/50 px-1 border border-blue-400">1998.</span></div>

                                    <div className="mt-8 text-justify">
                                        <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">IMÓVEL:-</span> Terreno situado na Rua <span className="bg-gray-200 text-transparent rounded px-2">XXXXXX</span>, constituído pelo <span className="border border-blue-600 text-blue-800 bg-blue-50/30 px-1">lote nº 17 da quadra 8</span>, de forma irregular, encerrando a área de 670,00m2. Documento referente a: {selectedDoc}.
                                    </div>

                                    <div className="mt-6 text-justify">
                                        <span className="font-bold border border-blue-600 text-blue-800 bg-blue-50/30 px-1">PROPRIETÁRIO:-</span> <span className="bg-blue-100/50 border border-blue-400 px-1 text-blue-800">Victor Oliveira de Sá</span>.
                                    </div>

                                    <div className="mt-10 flex justify-center opacity-70">
                                        <div className="text-center">
                                            <div className="border-b border-black w-32 mb-1"></div>
                                            <span>Oficial Substituto</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Checklist (Floating Card) */}
                    <div className="w-72 bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden" style={{ height: '50%' }}>
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">Checklist do Documento</h3>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div className="space-y-1">
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#92dc49] rounded-full text-white p-0.5 mt-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Proprietário</p>
                                        <p className="text-xs text-green-600 font-bold mt-1">Compatível com a proposta.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <button className="w-full bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full font-bold shadow-lg shadow-green-100 transition-all h-12 flex justify-center items-center" onClick={() => setShowDocAnalysis(false)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Signature Modal Overlay */}
            {showSignatureModal && (
                <div className="fixed inset-0 z-[100] flex bg-[#333]/60 backdrop-blur-sm justify-center items-center overflow-auto">
                    <div className="flex max-w-[1240px] w-full mx-4 h-[85vh] bg-transparent gap-6">
                        {/* Context Left Panel */}
                        <div className="w-[260px] flex flex-col gap-4 self-start mt-8">
                            <button
                                className="bg-white rounded-xl shadow-sm border-none flex items-center px-4 py-6 w-full text-left hover:bg-gray-50 transition-colors"
                                onClick={() => setShowSignatureModal(false)}
                            >
                                <ChevronLeft className="w-5 h-5 mr-2 text-gray-400" />
                                <span className="font-bold text-[15px] text-gray-700">{proposal?.name || "Victor Oliveira"}</span>
                            </button>

                            <div className="bg-white rounded-2xl shadow-sm p-5 text-sm w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#92dc49]"></div>
                                <h4 className="font-bold text-gray-900 mb-2 text-[15px]">Minuta</h4>
                                <div className="space-y-1 text-gray-500 text-[13px]">
                                    <p>Data de envio: 24/01/2026</p>
                                    <p>Responsável: Jurídico</p>
                                    <p>Tempo de espera: 2d</p>
                                </div>
                            </div>
                        </div>

                        {/* Document Preview (Center) */}
                        <div className="flex-1 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
                            <div className="bg-[#00502b] text-white px-8 py-5 flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-xl tracking-tight leading-none">banco da<br /><span className="text-lg">amazônia</span></span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <h2 className="text-xl font-medium tracking-wide">Minuta da Proposta</h2>
                            </div>

                            <div className="flex-1 overflow-auto p-12 bg-gray-50/30 custom-scrollbar">
                                <div className="text-gray-800 space-y-6 text-[14px] leading-relaxed max-w-[650px] mx-auto text-justify">
                                    <h3 className="font-bold text-[15px]">TERMO DE MINUTA</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vulputate dui non mauris pellentesque, eu ornare eros porttitor. Ut facilisis et ex ac rutrum. Donec neque metus, tempor quis mi non.</p>
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
                                        <p className="text-[11px] text-gray-500">Daniel Alves</p>
                                    </div>
                                </div>

                                {/* Jurídico (Você) */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {signed ? (
                                            <div className="w-4 h-4 rounded bg-[#92dc49] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                        ) : (
                                            <div className="w-4 h-4 rounded border border-gray-300"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-bold text-gray-900">Jurídico (Você)</h4>
                                        <p className="text-[11px] text-gray-500">juridico@gmail.com</p>
                                        <p className={`text - [10px] text - gray - 400 mt - 1`}>{signed ? 'Hoje 10h00' : 'Aguardando...'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-3 bg-white border-t border-gray-50">
                                {!signed && (
                                    <button
                                        className="w-full bg-[#92dc49] hover:bg-[#7ab635] flex items-center justify-center text-white rounded-full py-3 text-sm font-semibold shadow-sm transition-colors"
                                        onClick={() => {
                                            setSigned(true);
                                            setTimeout(() => setShowSignatureModal(false), 800);
                                        }}
                                    >
                                        Assinar
                                    </button>
                                )}
                                <button className="w-full text-green-700 border border-green-700 hover:bg-green-50 rounded-full py-3 text-sm font-semibold bg-white flex items-center justify-center transition-colors">
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar documento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Icons for the layout where generic Lucide icons aren't perfect
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
const HashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></svg>
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
const PercentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
