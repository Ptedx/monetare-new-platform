import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { TriangleAlert } from "lucide-react";
import { agingData, efetividadeCanalData } from './mockData';

export function CobrancaTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left block */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                            <p className="text-[13px] text-gray-500 mb-2">Volume em atraso</p>
                            <h2 className="text-[32px] font-medium text-gray-900 mt-2">R$ 569 mi</h2>
                        </Card>
                        <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                            <p className="text-[13px] text-gray-500 mb-2">Inadimplência <span className="text-[11px] text-gray-400">DPD &gt; 30d</span></p>
                            <h2 className="text-[32px] font-medium text-gray-900 mt-2">3,2%</h2>
                        </Card>
                    </div>
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col h-[280px]">
                        <h3 className="text-[13px] font-medium text-gray-500 mb-4">Aging</h3>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={agingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => `R$ ${val}`} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                        {agingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[128px]">
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col">
                        <p className="text-[12px] text-gray-500 mb-1">Recuperado no período</p>
                        <h2 className="text-[26px] font-medium text-gray-900 mt-auto">R$ 74 mi</h2>
                    </Card>
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col">
                        <p className="text-[12px] text-gray-500 mb-1">Acordos fechados</p>
                        <h2 className="text-[26px] font-medium text-gray-900 mt-auto">1.180</h2>
                    </Card>
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col">
                        <p className="text-[12px] text-gray-500 mb-1 leading-tight">Tempo médio de regularização</p>
                        <h2 className="text-[22px] font-medium text-gray-900 mt-auto">18 dias</h2>
                    </Card>
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-[12px] text-gray-500 mb-1">Vencimento em 7 dias</p>
                        <h2 className="text-[28px] font-medium text-gray-900 mt-auto">R$ 312 mi</h2>
                    </Card>
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between col-span-2">
                        <p className="text-[12px] text-gray-500 mb-1">Vencimento em 15 dias</p>
                        <h2 className="text-[28px] font-medium text-gray-900 mt-auto">R$ 508 mi</h2>
                    </Card>
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between md:col-span-2">
                        <p className="text-[12px] text-gray-500 mb-1">Disparos realizados</p>
                        <h2 className="text-[28px] font-medium text-gray-900 mt-auto">148.000</h2>
                    </Card>
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-[12px] text-gray-500 mb-1">Pagamentos pré-vencimento</p>
                        <div className="mt-auto">
                            <h2 className="text-[28px] font-medium text-gray-900">62%</h2>
                            <p className="text-[10px] text-gray-400">dos contratos avisados</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Pós-vencimento title */}
            <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">Pós-vencimento</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex justify-between flex-col h-[130px]">
                        <p className="text-[13px] text-gray-500">Casos em cobrança ativa</p>
                        <div>
                            <h2 className="text-[28px] font-medium text-gray-900">8.950</h2>
                            <p className="text-[11px] text-[#27ae60] font-medium leading-none mt-1">12% + 2 p.p</p>
                        </div>
                    </Card>
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex justify-between flex-col h-[130px]">
                        <p className="text-[13px] text-gray-500">Casos escalados</p>
                        <div>
                            <h2 className="text-[28px] font-medium text-gray-900">1.320</h2>
                            <p className="text-[11px] text-[#27ae60] font-medium leading-none mt-1">8% + 1.5 p.p</p>
                        </div>
                    </Card>
                </div>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-6">Efetividade por canal</h3>
                    <div className="flex-1 flex items-center justify-between">
                        <div className="h-32 w-1/2 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={efetividadeCanalData}
                                        cx="50%"
                                        cy="50%"
                                        startAngle={90}
                                        endAngle={450}
                                        innerRadius={50}
                                        outerRadius={65}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {efetividadeCanalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-4 space-y-4">
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></div>WhatsApp</div><span className="font-semibold text-gray-900">57%</span></div>
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></div>E-mail</div><span className="font-semibold text-gray-900">44%</span></div>
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-[#fef08a]"></div>Ligação</div><span className="font-semibold text-gray-900">12%</span></div>
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-[#bbf7d0]"></div>Gerente</div><span className="font-semibold text-gray-900">38%</span></div>
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col h-[284px] bg-gray-50/50">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-5">Alertas</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-50/70 border border-red-100 rounded-2xl flex gap-3">
                            <TriangleAlert className="w-4 h-4 text-red-500 mt-0.5" />
                            <div>
                                <p className="text-[12px] font-medium text-gray-900">DPD 90+ subiu X%</p>
                                <p className="text-[10px] text-red-600 font-medium">Crítico</p>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-2xl flex gap-3">
                            <TriangleAlert className="w-4 h-4 text-orange-500 mt-0.5" />
                            <p className="text-[12px] font-medium text-gray-900">Promessas não cumpridas acima de Y</p>
                        </div>
                        <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-2xl flex gap-3">
                            <TriangleAlert className="w-4 h-4 text-orange-500 mt-0.5" />
                            <p className="text-[12px] font-medium text-gray-900">Concentração de atraso em 3 grupos</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
