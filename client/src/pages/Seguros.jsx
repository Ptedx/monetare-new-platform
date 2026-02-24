import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Filter, Trash2, ArrowUpRight } from "lucide-react";
import { useLocation } from "wouter";

const donutData = [
    { name: 'Prestamista', value: 400, color: '#1B4332' },
    { name: 'Rural', value: 300, color: '#4ADE80' },
    { name: 'Empresarial', value: 300, color: '#7ab635' },
    { name: 'Equipamento', value: 200, color: '#06B6D4' },
];

const renovacaoProxima = [
    { id: 1, proponente: "Coop. Santa Luzia", prazo: "13 dias", produto: "PRESTAMISTA" },
    { id: 2, proponente: "Faz. Vale Verde", prazo: "16 dias", produto: "SEGURO RURAL" },
    { id: 3, proponente: "José da Silva", prazo: "20 dias", produto: "SEGURO RURAL" },
    { id: 4, proponente: "FFFagundes", prazo: "21 dias", produto: "PRESTAMISTA" },
    { id: 5, proponente: "Cereano", prazo: "25 dias", produto: "PRESTAMISTA" },
];

const mockSeguros = [
    { id: 1, cliente: "Diego Rodrigues", proposta: "83fse427lopr", prestacao: "1 de 420", valor: "R$ 754,27", renovacao: "28/01/2025", status: "VENCIDO" },
    { id: 2, cliente: "Sebastião de Souza", proposta: "287posSrQ42", prestacao: "2 de 420", valor: "R$ 1.424,95", renovacao: "28/02/2025", status: "A VENCER" },
    { id: 3, cliente: "Paula Diniz", proposta: "IM3312f324", prestacao: "2 de 420", valor: "R$ 1.292,47", renovacao: "28/03/2025", status: "PREVISTO" },
];

export function Seguros() {
    const [, setLocation] = useLocation();
    const [segurosList, setSegurosList] = useState(mockSeguros);

    useEffect(() => {
        try {
            const added = JSON.parse(localStorage.getItem('addedSeguros') || '[]');
            setSegurosList([...added, ...mockSeguros]);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'A VENCER': return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none">A VENCER</Badge>;
            case 'PREVISTO': return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-none">PREVISTO</Badge>;
            case 'VENCIDO': return <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-none">VENCIDO</Badge>;
            case 'PAGO': return <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-none">PAGO</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const getProductBadge = (product) => {
        switch (product) {
            case 'PRESTAMISTA': return <Badge className="bg-[#E5E7EB] text-gray-600 hover:bg-gray-200 border-none uppercase text-[10px] tracking-wider font-semibold">PRESTAMISTA</Badge>;
            case 'SEGURO RURAL': return <Badge className="bg-[#DCFCC4] text-green-800 hover:bg-green-200 border-none uppercase text-[10px] tracking-wider font-semibold">SEGURO RURAL</Badge>;
            default: return <Badge>{product}</Badge>;
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-[1600px] mx-auto min-h-screen pb-20 bg-[#e5e7eb]/40">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Seguros</h1>
                    <Button
                        className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-6 font-semibold shadow-lg shadow-green-100"
                        onClick={() => setLocation('/cotacao-seguro')}
                    >
                        + Nova cotação
                    </Button>
                </div>

                {/* KPIs Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-sm text-gray-500">Prêmio total</p>
                        <h2 className="text-3xl font-bold mt-2 text-gray-900">R$ 1.540.000</h2>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-sm text-gray-500">Prêmio mensal</p>
                        <h2 className="text-3xl font-bold mt-2 text-gray-900">R$ 128.333</h2>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-sm text-gray-500">Propostas em aberto</p>
                        <h2 className="text-3xl font-bold mt-2 text-gray-900">R$ 3.250.000</h2>
                    </Card>
                </div>

                {/* Charts & Renewals grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Donut Chart Card */}
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Distribuição por Produto</h2>
                        <div className="flex h-[220px] items-center">
                            <div className="w-1/2 h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            stroke="none"
                                            dataKey="value"
                                        >
                                            {donutData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 flex flex-col justify-center gap-3 pl-4">
                                {donutData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm text-gray-600 font-medium">{item.name} ({Math.round((item.value / 1200) * 100)}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Renewal Next Card */}
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Renovação próxima</h2>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse h-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-[11px] text-gray-500 font-medium">
                                        <th className="pb-2 font-medium">Proponente</th>
                                        <th className="pb-2 font-medium">Prazo restante</th>
                                        <th className="pb-2 font-medium">Produto contratado</th>
                                        <th className="pb-2 font-medium text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {renovacaoProxima.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-50 last:border-none">
                                            <td className="py-2.5 font-medium text-gray-800">{item.proponente}</td>
                                            <td className="py-2.5 text-gray-500">{item.prazo}</td>
                                            <td className="py-2.5">{getProductBadge(item.produto)}</td>
                                            <td className="py-2.5 text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-600 ml-auto flex items-center justify-center">
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Filters and Table Section */}
                <div className="bg-[#f8f9fa] border border-gray-200 flex flex-col rounded-3xl p-6 shadow-sm">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-3 mb-6 items-center">
                        <Button variant="outline" className="bg-white border-gray-200 rounded-lg text-gray-600 px-4">
                            <Filter className="w-4 h-4 mr-2" />
                            Em aberto
                        </Button>

                        <Select>
                            <SelectTrigger className="w-[140px] bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Proposta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Período de emissão" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Qualquer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[190px] bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Período de renovação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Qualquer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[120px] bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vencido">Vencido</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex-1"></div>

                        <Button variant="outline" className="text-gray-600 border-gray-300 rounded-lg hover:bg-gray-100 px-4">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpar
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-sm text-gray-500 font-medium">
                                    <th className="pb-4 pt-2 px-4 font-medium flex items-center gap-2">Cliente</th>
                                    <th className="pb-4 pt-2 px-4 font-medium">Proposta</th>
                                    <th className="pb-4 pt-2 px-4 font-medium">Prestação</th>
                                    <th className="pb-4 pt-2 px-4 font-medium">Valor (R$)</th>
                                    <th className="pb-4 pt-2 px-4 font-medium">Renovação</th>
                                    <th className="pb-4 pt-2 px-4 font-medium">Status</th>
                                    <th className="pb-4 pt-2 px-4 font-medium text-right">Abrir</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {segurosList.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="py-5 px-4 font-medium text-gray-900">{item.cliente}</td>
                                        <td className="py-5 px-4 text-gray-600">{item.proposta}</td>
                                        <td className="py-5 px-4 text-gray-600">{item.prestacao}</td>
                                        <td className="py-5 px-4 text-gray-900 font-medium">{item.valor}</td>
                                        <td className="py-5 px-4 text-gray-600">{item.renovacao}</td>
                                        <td className="py-5 px-4">{getStatusBadge(item.status)}</td>
                                        <td className="py-5 px-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 ml-auto flex items-center justify-center"
                                                onClick={() => setLocation(`/seguros/${item.proposta}`)}
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-end items-center gap-6 mt-6 pt-4 text-[13px] text-gray-500 border-t border-gray-200">
                        <span>Propostas total: {13 + segurosList.length}</span>
                        <span>Ticket médio: R$ 5.424.000</span>
                        <span>Volume total: R$ 85.340.000</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
