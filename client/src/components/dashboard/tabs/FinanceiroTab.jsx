import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { TriangleAlert } from "lucide-react";
import { receitaProjetadaData, composicaoReceitaData } from './mockData';

export function FinanceiroTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Col */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between h-[130px]">
                            <p className="text-[13px] text-gray-500">Lucro</p>
                            <h2 className="text-[28px] font-medium text-gray-900">R$ 1,25 mi</h2>
                        </Card>
                        <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between h-[130px]">
                            <p className="text-[13px] text-gray-500">Vencido</p>
                            <h2 className="text-[28px] font-medium text-gray-900">R$ 450.000</h2>
                        </Card>
                        <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between h-[130px]">
                            <p className="text-[13px] text-gray-500">Inadimplência</p>
                            <h2 className="text-[28px] font-medium text-gray-900">R$ 850.000</h2>
                        </Card>
                        <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between h-[130px]">
                            <p className="text-[13px] text-gray-500">Recuperado</p>
                            <h2 className="text-[28px] font-medium text-gray-900">R$ 320.000</h2>
                        </Card>
                    </div>
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col h-[320px]">
                        <h3 className="text-[13px] font-medium text-gray-500 mb-6">Receita Projetada</h3>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={receitaProjetadaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => `R$ ${val}`} />
                                    <Bar dataKey="value" fill="#d1e6d1" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white flex flex-col h-[284px]">
                        <h3 className="text-[13px] font-medium text-gray-500 mb-4">A receber</h3>
                        <div className="mt-auto space-y-5">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50"><span className="text-[13px] text-gray-600">Em até 30 dias</span><span className="font-semibold text-gray-900">R$ 5.200.000</span></div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50"><span className="text-[13px] text-gray-600">Entre 31 a 60 dias</span><span className="font-semibold text-gray-900">R$ 3.800.000</span></div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50"><span className="text-[13px] text-gray-600">Entre 61 a 90 dias</span><span className="font-semibold text-gray-900">R$ 2.400.000</span></div>
                            <div className="flex justify-between items-center"><span className="text-[13px] text-gray-600">Em mais de 90 dias</span><span className="font-semibold text-gray-900">R$ 1.100.000</span></div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white flex flex-col h-[284px]">
                        <h3 className="text-[13px] font-medium text-gray-500 mb-4">A vencer</h3>
                        <div className="mt-auto space-y-5">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50"><span className="text-[13px] text-gray-600">Em até 30 dias</span><span className="font-semibold text-gray-900">R$ 8.500.000</span></div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50"><span className="text-[13px] text-gray-600">Entre 31 a 60 dias</span><span className="font-semibold text-gray-900">R$ 6.200.000</span></div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50"><span className="text-[13px] text-gray-600">Entre 61 a 90 dias</span><span className="font-semibold text-gray-900">R$ 4.700.000</span></div>
                            <div className="flex justify-between items-center"><span className="text-[13px] text-gray-600">Em mais de 90 dias</span><span className="font-semibold text-gray-900">R$ 2.900.000</span></div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white flex flex-col">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-6">Composição da receita</h3>
                    <div className="flex-1 flex items-center justify-between">
                        <div className="h-32 w-1/2 relative mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={composicaoReceitaData}
                                        cx="50%"
                                        cy="100%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {composicaoReceitaData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-6 space-y-6">
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-3 text-gray-600"><div className="w-3 h-3 rounded-full bg-[#bbf7d0]"></div>Juros</div><span className="font-semibold text-gray-900">45%</span></div>
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-3 text-gray-600"><div className="w-3 h-3 rounded-full bg-[#fef08a]"></div>Tarifas</div><span className="font-semibold text-gray-900">25%</span></div>
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-3 text-gray-600"><div className="w-3 h-3 rounded-full bg-[#eab308]"></div>Seguros</div><span className="font-semibold text-gray-900">20%</span></div>
                            <div className="flex justify-between items-center text-[12px]"><div className="flex items-center gap-3 text-gray-600"><div className="w-3 h-3 rounded-full bg-[#d97706]"></div>Outros</div><span className="font-semibold text-gray-900">10%</span></div>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white flex flex-col bg-gray-50/50">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-6">Alertas</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl flex gap-3 h-[80px]">
                            <TriangleAlert className="w-4 h-4 text-red-500 mt-1" />
                            <div>
                                <p className="text-[12px] font-medium text-gray-900 leading-tight">Aumento de vencidos</p>
                                <p className="text-[10px] text-red-600 font-medium mt-1">Crítico</p>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50/70 border border-orange-100 rounded-2xl flex gap-3 h-[80px]">
                            <TriangleAlert className="w-4 h-4 text-orange-500 mt-1" />
                            <p className="text-[12px] font-medium text-gray-900 leading-tight">Seguro vencido impactando risco</p>
                        </div>
                        <div className="p-4 bg-orange-50/70 border border-orange-100 rounded-2xl flex gap-3 h-[80px]">
                            <TriangleAlert className="w-4 h-4 text-orange-500 mt-1" />
                            <p className="text-[12px] font-medium text-gray-900 leading-tight">Queda de receita projetada</p>
                        </div>
                        <div className="p-4 bg-orange-50/70 border border-orange-100 rounded-2xl flex gap-3 h-[80px]">
                            <TriangleAlert className="w-4 h-4 text-orange-500 mt-1" />
                            <p className="text-[12px] font-medium text-gray-900 leading-tight">Concentração excessiva</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
