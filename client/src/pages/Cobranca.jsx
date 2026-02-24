import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Filter, Trash2, ArrowUpRight } from "lucide-react";
import { useLocation } from "wouter";

const billingData = [
    { month: 'jan/25', dark: 120, light: 40 },
    { month: 'fev/25', dark: 100, light: 80 },
    { month: 'mai/25', dark: 140, light: 70 },
    { month: 'abr/25', dark: 105, light: 50 },
    { month: 'jun/25', dark: 120, light: 45 },
    { month: 'jul/25', dark: 125, light: 40 },
    { month: 'ago/25', dark: 110, light: 70 },
    { month: 'set/25', dark: 120, light: 25 },
    { month: 'out/25', dark: 80, light: 60 },
    { month: 'nov/25', dark: 95, light: 30 },
    { month: 'dez/25', dark: 105, light: 85 },
    { month: 'jan/26', dark: 80, light: 20 },
    { month: 'fev/26', dark: 0, light: 180 },
];

const sparklineData = [
    { value: 40 }, { value: 35 }, { value: 60 }, { value: 50 }, { value: 30 }, { value: 45 }, { value: 35 }
];

const mockCobrancas = [
    { id: 1, cliente: "Victor Oliveira de Sá", proposta: "287posSrQ42", prestacao: "2 de 420", valor: "R$ 1.424,95", vencimento: "28/02/2025", status: "A VENCER" },
    { id: 2, cliente: "Paula Diniz", proposta: "IM3312f324", prestacao: "2 de 420", valor: "R$ 1.292,47", vencimento: "28/03/2025", status: "PREVISTO" },
    { id: 3, cliente: "Diego Rodrigues", proposta: "83fse427lopr", prestacao: "1 de 420", valor: "R$ 754,27", vencimento: "28/01/2025", status: "VENCIDO" },
    { id: 4, cliente: "Sebastião de Souza", proposta: "a8876h09ffersp", prestacao: "1 de 420", valor: "R$ 2.750,00", vencimento: "28/01/2025", status: "PAGO" },
];

export function Cobranca() {
    const [, setLocation] = useLocation();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'A VENCER': return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none">A VENCER</Badge>;
            case 'PREVISTO': return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-none">PREVISTO</Badge>;
            case 'VENCIDO': return <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-none">VENCIDO</Badge>;
            case 'PAGO': return <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-none">PAGO</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-[1600px] mx-auto min-h-screen pb-20 bg-[#e5e7eb]/40">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Pagamento e Cobrança</h1>

                {/* Chart Section */}
                <Card className="p-6 mb-6 border-none shadow-sm rounded-3xl bg-white">
                    <h2 className="text-sm font-medium text-gray-500 mb-4">Histórico de Faturamento</h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={billingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="dark" stackId="a" fill="#7ab635" radius={[0, 0, 4, 4]} barSize={40} />
                                <Bar dataKey="light" stackId="a" fill="#c8ff93" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* KPIs Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between items-start min-h-[140px]">
                        <p className="text-sm text-gray-500 mb-4">Em aberto</p>
                        <h2 className="text-[32px] font-bold mt-auto text-gray-900">R$ 5.420.000</h2>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between items-start min-h-[140px]">
                        <p className="text-sm text-gray-500 mb-4">Previsto</p>
                        <div className="flex items-center gap-4 mt-auto w-full">
                            <h2 className="text-[32px] font-bold text-gray-900">R$ 3.250.000</h2>
                            <div className="w-16 h-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparklineData}>
                                        <Line type="monotone" dataKey="value" stroke="#7ab635" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between items-start min-h-[140px]">
                        <p className="text-sm text-gray-500 mb-4">Em atraso</p>
                        <h2 className="text-4xl font-bold mt-auto text-gray-900 bg-[#fdfaf5] py-2 px-4 rounded-xl">10</h2>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-[#ffe6e6] flex flex-col justify-between items-start min-h-[140px]">
                        <p className="text-sm text-gray-600 mb-4">Inadimplência</p>
                        <h2 className="text-4xl font-bold mt-auto text-gray-900">12%</h2>
                    </Card>
                </div>

                {/* Filters and Table Section */}
                <div className="bg-[#f8f9fa] border border-gray-200 flex flex-col rounded-3xl p-6 shadow-sm">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-3 mb-6 items-center">
                        <Button variant="outline" className="bg-white border-gray-200 rounded-full text-gray-600 px-4">
                            <Filter className="w-4 h-4 mr-2" />
                            Em aberto
                        </Button>

                        <Select>
                            <SelectTrigger className="w-[140px] bg-white border-gray-200 rounded-full">
                                <SelectValue placeholder="Proposta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-full">
                                <SelectValue placeholder="Período de emissão" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Qualquer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[190px] bg-white border-gray-200 rounded-full">
                                <SelectValue placeholder="Período de vencimento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Qualquer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[120px] bg-white border-gray-200 rounded-full">
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
                                    <th className="pb-4 pt-2 px-4 font-medium">Vencimento</th>
                                    <th className="pb-4 pt-2 px-4 font-medium">Status</th>
                                    <th className="pb-4 pt-2 px-4 font-medium text-right">Abrir</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {mockCobrancas.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="py-5 px-4 font-medium text-gray-900">{item.cliente}</td>
                                        <td className="py-5 px-4 text-gray-600">{item.proposta}</td>
                                        <td className="py-5 px-4 text-gray-600">{item.prestacao}</td>
                                        <td className="py-5 px-4 text-gray-900 font-medium">{item.valor}</td>
                                        <td className="py-5 px-4 text-gray-600">{item.vencimento}</td>
                                        <td className="py-5 px-4">{getStatusBadge(item.status)}</td>
                                        <td className="py-5 px-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 ml-auto flex items-center justify-center"
                                                onClick={() => setLocation(`/cobranca/${encodeURIComponent(item.cliente)}`)}
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
                        <span>Propostas total: 24</span>
                        <span>Ticket médio: R$ 10.424.000</span>
                        <span>Volume total: R$ 254.424.000</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
