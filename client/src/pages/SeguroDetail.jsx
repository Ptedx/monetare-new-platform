import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, PenTool, ChevronLeft, Briefcase, DollarSign, Building2, Users, Receipt, User, Phone, FileDigit, Mail, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocation } from "wouter";

export function SeguroDetail() {
    const [, setLocation] = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [signed, setSigned] = useState(false);

    return (
        <Layout>
            <div className="p-8 max-w-[1200px] mx-auto min-h-screen pb-20 bg-[#f8f9fa]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLocation('/seguros')}
                            className="hover:bg-gray-200 p-2 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8 text-gray-800" />
                        </button>
                        <h1 className="text-3xl font-semibold text-gray-900">Victor Oliveira de Sá</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="rounded-lg text-gray-600 border-gray-300">
                            <FileText className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-lg text-gray-600 border-gray-300">
                            <Download className="w-5 h-5" />
                        </Button>
                        <Button
                            className={`rounded-lg flex items-center gap-2 border shadow-sm transition-colors ${signed ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'}`}
                            onClick={() => setModalOpen(true)}
                        >
                            <PenTool className="w-4 h-4" />
                            Assinaturas {signed ? '1/3' : '0/3'}
                        </Button>
                    </div>
                </div>

                {/* Top Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8 text-[13px]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><Briefcase className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Empresa</span>
                            <span className="text-gray-900 font-medium">Victor Oliveira de Sá</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><DollarSign className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Valor</span>
                            <span className="text-gray-900 font-medium">R$ 50.000.000</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><Building2 className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Indústria</span>
                            <span className="text-gray-900 font-medium">Agronomia</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><Users className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Tamanho</span>
                            <span className="text-gray-900 font-medium">500-1000 funcionários</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><Receipt className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Faturamento</span>
                            <span className="text-gray-900 font-medium">R$ 300.000.000 / ano</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><User className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Cliente</span>
                            <span className="text-gray-900 font-medium">Victor Oliveira de Sá</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><Phone className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">Telefone</span>
                            <span className="text-gray-900 font-medium">(00) 000000-0000</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><FileDigit className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">CPF</span>
                            <span className="text-gray-900 font-medium">000.000.000-00</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <div className="w-8 flex justify-center text-gray-400"><Mail className="w-4 h-4" /></div>
                            <span className="text-gray-500 w-24">E-mail</span>
                            <span className="text-blue-600 hover:underline cursor-pointer font-medium">victor@desaoliveira.com.br</span>
                        </div>
                    </div>
                </div>

                {/* Content Cards */}
                <Card className="p-8 border-gray-200 shadow-sm rounded-3xl bg-white space-y-10">

                    {/* Dados do crédito */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Dados do crédito</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="border border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                <span className="text-xs flex items-center gap-1 text-gray-500 mb-1"><DollarSign className="w-3 h-3" /> Valor segurado</span>
                                <span className="font-semibold text-gray-900">R$ 250.000</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs flex items-center gap-1 text-gray-500 mb-1"><span className="text-[10px]">🍃</span> Cultura</span>
                                <span className="font-semibold text-gray-900">Soja</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs flex items-center gap-1 text-gray-500 mb-1"><span className="text-[10px]">🗺️</span> Área</span>
                                <span className="font-semibold text-gray-900">80 ha</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                <span className="text-xs flex items-center gap-1 text-gray-500 mb-1"><span className="text-[10px]">📍</span> Município/UF</span>
                                <span className="font-semibold text-gray-900">Santarém/PA</span>
                            </div>
                        </div>
                    </div>

                    {/* Proteções exigidas */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Proteções exigidas</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-800">Seguro agrícola</div>
                            <div className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-800">Proagro</div>
                            <div className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-800">Seguro Benfeitorias</div>
                        </div>
                    </div>

                    {/* Apólice */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Apólice</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Seguradora</span>
                                <span className="font-semibold text-gray-900">X</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Apólice</span>
                                <span className="font-semibold text-gray-900">456789</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Vigência</span>
                                <span className="font-semibold text-gray-900">01/01/25 – 31/12/25</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Status</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span className="font-semibold text-gray-900 text-sm">Ativa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coberturas */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Coberturas</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 py-1 px-3">
                                <Check className="w-3 h-3 mr-1" /> Seca
                            </Badge>
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 py-1 px-3">
                                <Check className="w-3 h-3 mr-1" /> Granizo
                            </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">LMI</span>
                                <span className="font-semibold text-gray-900">R$ 300.000</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Franquia</span>
                                <span className="font-semibold text-gray-900">10%</span>
                            </div>
                        </div>
                    </div>

                    {/* Prêmio */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Prêmio</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Bruto</span>
                                <span className="font-semibold text-gray-900">R$ 18.000</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0 text-green-700">
                                <span className="text-xs text-green-600/70 block mb-1">Subvenção</span>
                                <span className="font-semibold">R$ 7.000</span>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0 text-red-700 bg-red-50/30">
                                <span className="text-xs text-red-600/70 block mb-1">Produtor paga</span>
                                <span className="font-semibold">R$ 11.000</span>
                            </div>
                        </div>
                    </div>

                    {/* Sinistros */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Sinistros</h3>
                        <div className="border border-gray-200 rounded-xl p-4 text-center text-gray-400 text-sm">
                            Nenhum sinistro registrado
                        </div>
                    </div>

                    {/* Consentimento Open Finance */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Consentimento Open Finance</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="border border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Status</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span className="font-semibold text-gray-900 text-sm">Ativa</span>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-3 shrink-0">
                                <span className="text-xs text-gray-500 block mb-1">Escopo</span>
                                <span className="font-semibold text-gray-900 text-sm">Apólice + Prêmio + Sinistro</span>
                            </div>
                        </div>
                    </div>

                </Card>
            </div>

            {/* Assinaturas Modal Overlay implementation */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex DialogOverlay bg-black/50 backdrop-blur-sm justify-center items-center">
                    <div className="flex max-w-[1200px] w-full mx-4 h-[85vh] bg-transparent">
                        {/* Context Left Panel */}
                        <div className="w-[280px] bg-transparent flex flex-col gap-4 self-start mt-8 relative left-10">
                            <Button
                                variant="outline"
                                className="bg-white rounded-xl shadow border-none justify-start px-4 py-6 w-full max-w-[240px]"
                                onClick={() => setModalOpen(false)}
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                <span className="font-semibold text-[15px]">Victor Oliveira de Sá</span>
                            </Button>

                            <div className="bg-white rounded-2xl shadow-sm p-4 text-sm w-full max-w-[240px]">
                                <h4 className="font-semibold text-gray-800 mb-2">Contrato de Seguro</h4>
                                <p className="text-gray-500 mb-1">Data de envio: 24/01/2026</p>
                                <p className="text-gray-500 mb-1">Responsável: Daniel Alves (Analista)</p>
                                <p className="text-gray-500">Tempo de espera: 2d</p>
                            </div>
                        </div>

                        {/* Document Preview (Center) */}
                        <div className="flex-1 bg-white mx-10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="bg-gray-100 p-4 border-b text-center text-sm font-medium text-gray-500">
                                Visualização do Documento
                            </div>
                            <div className="flex-1 overflow-auto p-8 relative flex justify-center bg-gray-50">
                                <div className="w-full max-w-[700px] min-h-[900px] bg-white shadow-sm border p-12">
                                    <div className="text-center mb-10 border-b pb-4">
                                        <h2 className="text-2xl font-bold">Proposta de Seguro</h2>
                                        <p className="text-gray-500 mt-2">Nro. Processo Susep: 15414.632234/2019-33</p>
                                    </div>

                                    <div className="space-y-6 text-sm">
                                        <div className="border border-gray-300 p-4">
                                            <h4 className="font-bold mb-2 text-xs bg-gray-100 p-1 -mt-4 mx-[-16px] px-4">Dados do Seguro</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p><span className="font-semibold">Nome do Segurado:</span> Victor Oliveira de Sá</p>
                                                    <p><span className="font-semibold">CPF:</span> 000.000.000-00</p>
                                                    <p><span className="font-semibold">Endereço:</span> Fazenda Colheita Feliz, Zona Rural</p>
                                                </div>
                                                <div>
                                                    <p><span className="font-semibold">Vigência:</span> 01/01/2026 a 31/12/2026</p>
                                                    <p><span className="font-semibold">Apólice:</span> 456789</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border border-gray-300 p-4">
                                            <h4 className="font-bold mb-2 text-xs bg-gray-100 p-1 -mt-4 mx-[-16px] px-4">Dados do Risco e Coberturas</h4>
                                            <div className="space-y-2">
                                                <p>As coberturas contratadas envolvem os riscos climáticos (Seca, Granizo) nas áreas delimitadas no croqui em anexo.</p>
                                                <p><span className="font-semibold">Franquia:</span> 10% sobre o LMI aplicado.</p>
                                                <p><span className="font-semibold">LMI:</span> R$ 300.000,00</p>
                                            </div>
                                        </div>

                                        <div className="mt-20 pt-10 border-t flex justify-around">
                                            <div className="text-center w-64 border-t border-black mt-20 pt-2">
                                                Victor Oliveira de Sá<br />
                                                <span className="text-xs text-gray-500">Proponente / Segurado</span>
                                            </div>
                                            <div className="text-center w-64 border-t border-black mt-20 pt-2">
                                                Ronaldo R.<br />
                                                <span className="text-xs text-gray-500">Corretor / Representante</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Right Sidebar */}
                        <div className="w-[300px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Status de Assinatura ({signed ? '1' : '0'}/3)</h3>
                            </div>
                            <div className="p-6 flex-1 space-y-6">
                                {/* Analista */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Analista</h4>
                                        <p className="text-xs text-gray-500">Daniel Alves - 000.000.000-00</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">Aguardando...</p>
                                    </div>
                                </div>

                                {/* Cliente */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        {signed ? (
                                            <div className="w-4 h-4 rounded bg-[#92dc49] flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Cliente</h4>
                                        <p className="text-xs text-gray-500">Victor Oliveira de Sá - 000.000.000-00</p>
                                        <p className={`text-[11px] mt-0.5 ${signed ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                            {signed ? 'Assinado em 24/01/2026' : 'Aguardando...'}
                                        </p>
                                    </div>
                                </div>

                                {/* Gerente */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">Gerente</h4>
                                        <p className="text-xs text-gray-500">Ronaldo R - 000.000.000-00</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">Aguardando...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-3 bg-gray-50">
                                {!signed && (
                                    <Button
                                        className="w-full bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full py-6 font-semibold shadow-md shadow-green-100"
                                        onClick={() => {
                                            setSigned(true);
                                            setTimeout(() => setModalOpen(false), 1000); // Close after 1s on sign
                                        }}
                                    >
                                        Assinar
                                    </Button>
                                )}
                                <Button variant="outline" className="w-full text-green-700 border-green-700 hover:bg-green-50 rounded-full py-6 font-semibold bg-white">
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar documento
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
