import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChevronUp } from "lucide-react";
import { qualidadeOpData, canaisRankingData } from './mockData';

export function CanaisTab() {
    return (
        <div className="space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Projetistas ativos</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">142</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Propostas submetidas</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">845</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Tempo médio de correção</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">1,8 d</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Conversão &gt; Aprovação</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">72%</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Conversão &gt; Contrato</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">58%</h2>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Qualidade (Gauge) */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between lg:col-span-1 border border-gray-100">
                    <div>
                        <h3 className="text-[13px] font-medium text-gray-500 mb-2">Qualidade</h3>
                        <div className="h-40 w-full flex justify-center items-end relative -mb-8 mt-2">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={qualidadeOpData}
                                        cx="50%"
                                        cy="100%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {qualidadeOpData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="space-y-3 mt-12 w-full text-[13px]">
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#bedc7a]"></div><span className="text-gray-600">Documento incompleto</span></div><span className="font-semibold text-gray-900">24%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e6c84c]"></div><span className="text-gray-600">Dado divergente</span></div><span className="font-semibold text-gray-900">13%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e69832]"></div><span className="text-gray-600">Impedimento cadastral</span></div><span className="font-semibold text-gray-900">9%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#d35400]"></div><span className="text-gray-600">Garantia pendente</span></div><span className="font-semibold text-gray-900">25%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#c0392b]"></div><span className="text-gray-600">Seguro obrigatório/pendente</span></div><span className="font-semibold text-gray-900">29%</span></div>
                    </div>
                </Card>

                {/* Ranking de Projetistas (Top 5) */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white lg:col-span-2 overflow-hidden flex flex-col">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Ranking de Projetistas (Top 5)</h3>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-[11px] uppercase tracking-wider">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-3 pt-2">PROJETISTA</th>
                                    <th className="font-medium pb-3 pt-2 text-right">SUBMETIDAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">COMPLETAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">DILIGÊNCIAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">TEMPO DE CORREÇÃO</th>
                                    <th className="font-medium pb-3 pt-2 text-right">APROVADAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">PIPELINE</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 font-medium capitalize text-[13px] tracking-normal">
                                {canaisRankingData.slice(0, 5).map((d, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-4 text-gray-900">{d.projetista}</td>
                                        <td className="py-4 text-right">{d.submetidas}</td>
                                        <td className="py-4 text-right">{d.completas}</td>
                                        <td className="py-4 text-right">{d.diligencias}</td>
                                        <td className="py-4 text-right">{d.tempo}</td>
                                        <td className="py-4 text-right">{d.aprovadas}</td>
                                        <td className="py-4 text-right">{d.pipeline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* accordion Tabelas */}
            <div className="pt-2">
                <div className="flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-widest gap-2 mb-4 ml-2">
                    <ChevronUp className="w-3 h-3" />
                    TABELAS
                </div>

                {/* Ranking de Projetistas Completo */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Ranking de Projetistas (Completo)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] uppercase tracking-wider">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-3 pt-2">PROJETISTA</th>
                                    <th className="font-medium pb-3 pt-2 text-right">SUBMETIDAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">COMPLETAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">DILIGÊNCIAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">TEMPO DE CORREÇÃO</th>
                                    <th className="font-medium pb-3 pt-2 text-right">APROVADAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">PIPELINE</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 font-medium capitalize text-[13px] tracking-normal">
                                {canaisRankingData.map((d, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-4 text-gray-900">{d.projetista}</td>
                                        <td className="py-4 text-right">{d.submetidas}</td>
                                        <td className="py-4 text-right">{d.completas}</td>
                                        <td className="py-4 text-right">{d.diligencias}</td>
                                        <td className="py-4 text-right">{d.tempo}</td>
                                        <td className="py-4 text-right">{d.aprovadas}</td>
                                        <td className="py-4 text-right">{d.pipeline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
