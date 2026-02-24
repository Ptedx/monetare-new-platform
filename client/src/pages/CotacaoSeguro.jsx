import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ArrowRight, Briefcase, DollarSign, Building2, Users, Receipt, User, Phone, FileDigit, Mail, Check, FileText, Download, Send } from "lucide-react";
import { useLocation } from "wouter";

const proposals = [
    { id: 1, name: "Victor de Sá", active: true },
    { id: 2, name: "Faz. Colheita Alegre", active: true },
    { id: 3, name: "Faz. Universeg", active: true },
    { id: 4, name: "Fazenda do Gigante", active: true },
    { id: 5, name: "Faz. FerroMato", active: true },
    { id: 6, name: "Faz. Recanto dos Patos", active: false },
    { id: 7, name: "Faz. Aurora", active: false },
    { id: 8, name: "Faz. Girassol", active: false },
    { id: 9, name: "FFFagundes", active: false },
    { id: 10, name: "FFFagundes", active: false },
    { id: 11, name: "FFFagundes", active: false },
];

export function CotacaoSeguro() {
    const [, setLocation] = useLocation();
    const [step, setStep] = useState(1);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [signed, setSigned] = useState(false);

    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <Layout>
            <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
                <div className="bg-[#f8f9fa] rounded-[40px] p-10 pb-20 min-h-[600px] shadow-sm border border-gray-100">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    if (step === 3) {
                                        setStep(2);
                                    } else if (step === 2) {
                                        setStep(1);
                                    } else {
                                        setLocation('/seguros');
                                    }
                                }}
                                className="hover:bg-gray-200 p-2 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-8 h-8 text-gray-800" />
                            </button>
                            <h1 className="text-4xl font-semibold text-gray-900">Cotação de Seguro</h1>
                        </div>

                        {step !== 3 && (
                            <Button
                                className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-6 shadow-lg shadow-green-100 flex items-center gap-2"
                                onClick={() => {
                                    if (step === 1 && selectedProposal) {
                                        setStep(2);
                                    }
                                }}
                                disabled={step === 1 && !selectedProposal}
                            >
                                <>
                                    Prosseguir
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            </Button>
                        )}
                        {step === 3 && (
                            <Button
                                className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-6 shadow-lg shadow-green-100 flex items-center gap-2"
                                onClick={() => setModalOpen(true)}
                            >
                                <Send className="w-4 h-4" />
                                Enviar para assinatura
                            </Button>
                        )}
                    </div>

                    {step === 1 && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-6 ml-14">
                                <p className="text-gray-800 font-medium">Selecione uma proposta.</p>
                            </div>

                            <div className="ml-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {proposals.map((prop) => (
                                    <div
                                        key={prop.id}
                                        onClick={() => prop.active && setSelectedProposal(prop.id)}
                                        className={`
                      p-5 rounded-2xl cursor-pointer transition-all border
                      ${!prop.active ? 'bg-gray-200 text-gray-500 opacity-60 border-transparent cursor-not-allowed' : ''}
                      ${prop.active && selectedProposal !== prop.id ? 'bg-white shadow-sm border-transparent hover:border-[#92dc49] hover:shadow-md' : ''}
                      ${selectedProposal === prop.id ? 'bg-[#f4fce8] border-[#92dc49] text-[#2c4210] shadow-md ring-1 ring-[#92dc49]' : ''}
                    `}
                                    >
                                        <span className="font-medium">{prop.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="ml-14 animate-in slide-in-from-right-8 duration-500">

                            {/* Informações Consolidadas do Cliente */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-[13px]">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Empresa</span>
                                            <span className="text-gray-900 font-medium truncate">Victor Oliveira de Sá</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Valor</span>
                                            <span className="text-gray-900 font-medium">R$ 50.000.000</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Indústria</span>
                                            <span className="text-gray-900 font-medium">Agronomia</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Tamanho</span>
                                            <span className="text-gray-900 font-medium">500-1000 funcionários</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Receipt className="w-3.5 h-3.5" /> Faturamento</span>
                                            <span className="text-gray-900 font-medium">R$ 300.000.000 / ano</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Cliente</span>
                                            <span className="text-gray-900 font-medium">Victor Oliveira de Sá</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Telefone</span>
                                            <span className="text-gray-900 font-medium">(00) 000000-0000</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><FileDigit className="w-3.5 h-3.5" /> CPF</span>
                                            <span className="text-gray-900 font-medium">000.000.000-00</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> E-mail</span>
                                            <span className="text-blue-600 font-medium">victor@desaoliveira.com.br</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tipos de seguro */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Tipos de seguro</h3>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-green-400 transition-colors">
                                        <input type="radio" name="seguro_tipo" className="accent-[#92dc49] w-4 h-4 cursor-pointer" defaultChecked />
                                        <span className="text-sm font-medium text-gray-700">Rural / Safra</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-green-400 transition-colors">
                                        <input type="radio" name="seguro_tipo" className="accent-[#92dc49] w-4 h-4 cursor-pointer" />
                                        <span className="text-sm font-medium text-gray-700">Prestamista</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-green-400 transition-colors">
                                        <input type="radio" name="seguro_tipo" className="accent-[#92dc49] w-4 h-4 cursor-pointer" />
                                        <span className="text-sm font-medium text-gray-700">Bem / Equipamento</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-green-400 transition-colors">
                                        <input type="radio" name="seguro_tipo" className="accent-[#92dc49] w-4 h-4 cursor-pointer" />
                                        <span className="text-sm font-medium text-gray-700">Empresarial</span>
                                    </label>
                                </div>
                            </div>

                            {/* Objeto Segurado */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Objeto segurado</h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Cultura</span>
                                        <span className="font-semibold text-gray-900">Soja</span>
                                    </div>
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Área</span>
                                        <span className="font-semibold text-gray-900">120 ha</span>
                                    </div>
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Município/UF</span>
                                        <span className="font-semibold text-gray-900">Santarém/PA</span>
                                    </div>
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Valor segurado</span>
                                        <span className="font-semibold text-gray-900">R$ 800.000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Coberturas */}
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Coberturas</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="outline" className="border-gray-200 bg-white text-gray-700 py-2 px-4 shadow-sm text-sm font-medium">
                                        <Check className="w-4 h-4 mr-2 text-green-500" /> Granizo
                                    </Badge>
                                    <Badge variant="outline" className="border-gray-200 bg-white text-gray-700 py-2 px-4 shadow-sm text-sm font-medium">
                                        <Check className="w-4 h-4 mr-2 text-green-500" /> Seca
                                    </Badge>
                                    <Badge variant="outline" className="border-gray-200 bg-white text-gray-700 py-2 px-4 shadow-sm text-sm font-medium">
                                        Franquia: 10%
                                    </Badge>
                                    <Badge variant="outline" className="border-gray-200 bg-white text-gray-700 py-2 px-4 shadow-sm text-sm font-medium">
                                        Condições especiais: padrão
                                    </Badge>
                                </div>
                            </div>

                            {/* Ofertas (Horizontal Scroll) */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Ofertas</h3>

                                {/* Scroll container with hidden scrollbar */}
                                <div
                                    ref={scrollRef}
                                    className={`flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 ${isDragging ? 'cursor-grabbing select-none snap-none' : 'snap-x hover:cursor-grab'}`}
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    onMouseDown={onMouseDown}
                                    onMouseLeave={onMouseLeave}
                                    onMouseUp={onMouseUp}
                                    onMouseMove={onMouseMove}
                                >
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                    .snap-x::-webkit-scrollbar { display: none; }
                  `}} />

                                    {/* Card 1 - Seguradora A (Recomendado) */}
                                    <Card className="min-w-[400px] p-6 rounded-3xl border-2 border-green-100 bg-green-50/20 shadow-sm relative snap-start shrink-0">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Seguradora A</h4>
                                                <Badge className="bg-[#DCFCC4] text-green-800 hover:bg-green-200 border-none uppercase text-[10px] tracking-wider font-semibold pointer-events-none">
                                                    RECOMENDADO
                                                </Badge>
                                            </div>
                                            <Button
                                                className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full px-6 shadow-md shadow-green-100 font-semibold gap-2"
                                                onClick={() => {
                                                    setSelectedOffer({
                                                        id: 'A',
                                                        name: 'Seguradora A',
                                                        premio: 'R$ 2.900/ano',
                                                        franquia: '10%',
                                                        seca: true,
                                                        granizo: true,
                                                        emissao: '1 dia'
                                                    });
                                                    setStep(3);
                                                }}
                                            >
                                                + Selecionar
                                            </Button>
                                        </div>

                                        <div className="flex gap-4 mb-6">
                                            <div className="bg-white border border-green-100 rounded-xl p-3 flex-1">
                                                <span className="text-xs text-gray-500 mb-1 block">Prêmio</span>
                                                <span className="font-bold text-gray-900">R$ 2.900/ano</span>
                                            </div>
                                            <div className="bg-white border border-green-100 rounded-xl p-3 flex-1">
                                                <span className="text-xs text-gray-500 mb-1 block">Franquia</span>
                                                <span className="font-bold text-gray-900">10%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-3">
                                                <Badge variant="outline" className="bg-white border-green-100 text-gray-600 py-1.5"><Check className="w-3.5 h-3.5 mr-1 text-green-500" /> Seca</Badge>
                                                <Badge variant="outline" className="bg-white border-green-100 text-gray-600 py-1.5"><Check className="w-3.5 h-3.5 mr-1 text-green-500" /> Granizo</Badge>
                                                <Badge variant="outline" className="bg-white border-green-100 text-gray-600 py-1.5">Emissão: 1 dia</Badge>
                                            </div>
                                            <div className="flex gap-2 text-gray-400">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:text-gray-600 rounded-md"><FileText className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:text-gray-600 rounded-md"><Download className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Card 2 - Seguradora B (Menor Preço) */}
                                    <Card className="min-w-[400px] p-6 rounded-3xl border border-gray-200 bg-white shadow-sm relative snap-start shrink-0">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Seguradora B</h4>
                                                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none uppercase text-[10px] tracking-wider font-semibold pointer-events-none">
                                                    MENOR PRÊMIO
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="rounded-full px-6 font-semibold border-gray-300 text-gray-600 hover:bg-gray-50 gap-2"
                                                onClick={() => {
                                                    setSelectedOffer({
                                                        id: 'B',
                                                        name: 'Seguradora B',
                                                        premio: 'R$ 2.650/ano',
                                                        franquia: '15%',
                                                        seca: false,
                                                        granizo: true,
                                                        emissao: '2 dias'
                                                    });
                                                    setStep(3);
                                                }}
                                            >
                                                Selecionar
                                            </Button>
                                        </div>

                                        <div className="flex gap-4 mb-6">
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex-1">
                                                <span className="text-xs text-gray-500 mb-1 block">Prêmio</span>
                                                <span className="font-bold text-gray-900">R$ 2.650/ano</span>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex-1">
                                                <span className="text-xs text-gray-500 mb-1 block">Franquia</span>
                                                <span className="font-bold text-gray-900">15%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-3">
                                                <Badge variant="outline" className="bg-white border-gray-200 text-gray-600 py-1.5"><Check className="w-3.5 h-3.5 mr-1 text-gray-400" /> Granizo</Badge>
                                                <Badge variant="outline" className="bg-white border-gray-200 text-gray-600 py-1.5">Emissão: 2 dia</Badge>
                                            </div>
                                            <div className="flex gap-2 text-gray-400">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 hover:text-gray-600 rounded-md"><FileText className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 hover:text-gray-600 rounded-md"><Download className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Card 3 - Seguradora C (Placeholder) */}
                                    <Card className="min-w-[400px] p-6 rounded-3xl border border-gray-200 bg-white shadow-sm relative snap-start shrink-0 opacity-80">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Seguradora C</h4>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="rounded-full px-6 font-semibold border-gray-300 text-gray-600 hover:bg-gray-50 gap-2"
                                                onClick={() => {
                                                    setSelectedOffer({
                                                        id: 'C',
                                                        name: 'Seguradora C',
                                                        premio: 'R$ 3.100/ano',
                                                        franquia: '10%',
                                                        seca: true,
                                                        granizo: false,
                                                        emissao: '5 dias'
                                                    });
                                                    setStep(3);
                                                }}
                                            >
                                                Selecionar
                                            </Button>
                                        </div>

                                        <div className="flex gap-4 mb-6">
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex-1">
                                                <span className="text-xs text-gray-500 mb-1 block">Prêmio</span>
                                                <span className="font-bold text-gray-900">R$ 3.100/ano</span>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex-1">
                                                <span className="text-xs text-gray-500 mb-1 block">Franquia</span>
                                                <span className="font-bold text-gray-900">10%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex gap-3">
                                                <Badge variant="outline" className="bg-white border-gray-200 text-gray-600 py-1.5"><Check className="w-3.5 h-3.5 mr-1 text-gray-400" /> Seca</Badge>
                                                <Badge variant="outline" className="bg-white border-gray-200 text-gray-600 py-1.5">Emissão: 5 dias</Badge>
                                            </div>
                                        </div>
                                    </Card>

                                </div>
                            </div>

                        </div>
                    )}

                    {step === 3 && (
                        <div className="ml-14 animate-in slide-in-from-right-8 duration-500">

                            {/* Informações Consolidadas do Cliente */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-[13px]">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Empresa</span>
                                            <span className="text-gray-900 font-medium truncate">Victor Oliveira de Sá</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Valor</span>
                                            <span className="text-gray-900 font-medium">R$ 50.000.000</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Indústria</span>
                                            <span className="text-gray-900 font-medium">Agronomia</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Tamanho</span>
                                            <span className="text-gray-900 font-medium">500-1000 funcionários</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Receipt className="w-3.5 h-3.5" /> Faturamento</span>
                                            <span className="text-gray-900 font-medium">R$ 300.000.000 / ano</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Cliente</span>
                                            <span className="text-gray-900 font-medium">Victor Oliveira de Sá</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Telefone</span>
                                            <span className="text-gray-900 font-medium">(00) 000000-0000</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><FileDigit className="w-3.5 h-3.5" /> CPF</span>
                                            <span className="text-gray-900 font-medium">000.000.000-00</span>
                                        </div>
                                        <div className="flex items-center gap-4 border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 w-24 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> E-mail</span>
                                            <span className="text-blue-600 font-medium">victor@desaoliveira.com.br</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detalhes do seguro (Selected offer summary) */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes do seguro</h3>
                                {/* Selected Card Summary */}
                                {selectedOffer && (
                                    <Card className="max-w-[500px] p-6 rounded-3xl border border-gray-200 bg-white shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">{selectedOffer.name}</h4>

                                        <div className="flex gap-4 mb-6">
                                            <div className="bg-white border text-sm border-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                                                <span className="text-gray-500">Prêmio:</span>
                                                <span className="font-bold text-gray-900">{selectedOffer.premio}</span>
                                            </div>
                                            <div className="bg-white border text-sm border-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                                                <span className="text-gray-500">Franquia:</span>
                                                <span className="font-bold text-gray-900">{selectedOffer.franquia}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-3">
                                                {selectedOffer.seca && <Badge variant="outline" className="bg-white border-green-200 text-gray-900 py-1.5"><Check className="w-3.5 h-3.5 mr-1 text-green-500" /> Seca</Badge>}
                                                {selectedOffer.granizo && <Badge variant="outline" className="bg-white border-green-200 text-gray-900 py-1.5"><Check className="w-3.5 h-3.5 mr-1 text-green-500" /> Granizo</Badge>}
                                                <Badge variant="outline" className="bg-white border-gray-200 text-gray-600 py-1.5">Emissão: {selectedOffer.emissao}</Badge>
                                            </div>
                                            <div className="flex gap-2 text-gray-400">
                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 hover:text-gray-600 rounded-md border-gray-200"><FileText className="w-4 h-4" /></Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 hover:text-gray-600 rounded-md border-gray-200"><Download className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>

                            {/* Tipos de seguro (Read-only view) */}
                            <div className="mb-8 opacity-90 pointer-events-none">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Tipo de seguro</h3>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 bg-[#f4fce8] px-5 py-2.5 rounded-full border border-[#92dc49] transition-colors">
                                        <div className="w-4 h-4 rounded-full bg-[#92dc49] flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#2c4210]">Rural / Safra</span>
                                    </label>
                                    <label className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 transition-colors">
                                        <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                                        <span className="text-sm font-medium text-gray-500">Prestamista</span>
                                    </label>
                                    <label className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 transition-colors">
                                        <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                                        <span className="text-sm font-medium text-gray-500">Bem / Equipamento</span>
                                    </label>
                                    <label className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 transition-colors">
                                        <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                                        <span className="text-sm font-medium text-gray-500">Empresarial</span>
                                    </label>
                                </div>
                            </div>

                            {/* Objeto Segurado */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Objeto segurado</h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Cultura</span>
                                        <span className="font-semibold text-gray-900">Soja</span>
                                    </div>
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-32 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Área</span>
                                        <span className="font-semibold text-gray-900">120 ha</span>
                                    </div>
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Município/UF</span>
                                        <span className="font-semibold text-gray-900">Santarém/PA</span>
                                    </div>
                                    <div className="bg-white border text-sm border-gray-200 rounded-xl p-3 w-48 shrink-0">
                                        <span className="text-xs flex items-center gap-1 text-gray-500 mb-1">Valor segurado</span>
                                        <span className="font-semibold text-gray-900">R$ 800.000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Assinaturas Modal Overlay */}
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

                                            // Append to Seguros table
                                            const selectedPropName = proposals.find(p => p.id === selectedProposal)?.name || "Victor Oliveira de Sá";
                                            const newSeguro = {
                                                id: Date.now(),
                                                cliente: selectedPropName,
                                                proposta: "N" + Math.floor(Math.random() * 1000000) + "S",
                                                prestacao: "1 de 12",
                                                valor: selectedOffer?.premio?.split('/')[0] || "R$ 0,00",
                                                renovacao: "24/01/2027",
                                                status: "PREVISTO"
                                            };
                                            const existing = JSON.parse(localStorage.getItem('addedSeguros') || '[]');
                                            localStorage.setItem('addedSeguros', JSON.stringify([newSeguro, ...existing]));

                                            setTimeout(() => {
                                                setModalOpen(false);
                                                setLocation('/seguros'); // redirect to list after signing
                                            }, 1000);
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
