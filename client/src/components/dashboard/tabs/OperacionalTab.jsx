import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TriangleAlert, ChevronUp } from "lucide-react";
import { qualidadeOpData, problemasData, alertasOpData, analystsData } from './mockData';

export function OperacionalTab() {
    return (
        <div className="space-y-6">
            {/* 1. Grid Top 6 KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Propostas concluídas</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">1.250</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Propostas em análise</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">430</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Tempo médio de análise</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">2,5 d</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Propostas pendentes</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">890</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Diligências geradas</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">340</h2>
                </Card>
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <p className="text-[13px] text-gray-500 mb-2">Impedimentos</p>
                    <h2 className="text-[28px] font-medium text-gray-900 mt-4">112</h2>
                </Card>
            </div>

            {/* 2. Grid Middle (Qualidade, Problemas, Alertas) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Qualidade (Gauge) */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col lg:col-span-1">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-2">Qualidade</h3>
                    <div className="h-28 w-full flex justify-center items-end relative -mb-4 mt-2">
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
                                    paddingAngle={2}
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
                    <div className="space-y-3 mt-8 w-full text-[11px] font-medium uppercase text-gray-500">
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#bedc7a]"></div><span className="normal-case text-gray-600">Documento incompleto</span></div><span className="text-gray-900">24%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e6c84c]"></div><span className="normal-case text-gray-600">Dado divergente</span></div><span className="text-gray-900">13%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e69832]"></div><span className="normal-case text-gray-600">Impedimento cadastral</span></div><span className="text-gray-900">9%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#d35400]"></div><span className="normal-case text-gray-600">Garantia pendente</span></div><span className="text-gray-900">25%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#c0392b]"></div><span className="normal-case text-gray-600">Seguro obrigatório/pendente</span></div><span className="text-gray-900">29%</span></div>
                    </div>
                </Card>

                {/* Problemas recorrentes */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white lg:col-span-2 overflow-hidden flex flex-col">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Problemas mais recorrentes</h3>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-[11px] uppercase tracking-wider">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-3 pt-2">MOTIVO</th>
                                    <th className="font-medium pb-3 pt-2 text-right">QUANTIDADE</th>
                                    <th className="font-medium pb-3 pt-2 text-right">TEMPO DE CORREÇÃO</th>
                                    <th className="font-medium pb-3 pt-2 text-right">ÁREA</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 capitalize text-[13px] tracking-normal">
                                {problemasData.map((prob, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="py-3 font-medium text-gray-900">{prob.motivo}</td>
                                        <td className="py-3 text-right">{prob.quantidade}</td>
                                        <td className="py-3 text-right">{prob.tempo} d</td>
                                        <td className="py-3 text-right text-gray-500 uppercase text-[11px] font-medium">{prob.area}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Alertas */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col lg:col-span-1">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Alertas</h3>
                    <div className="space-y-3 flex-1">
                        {alertasOpData.map((alert, i) => (
                            <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${alert.criticidade === 'Crítico' ? 'bg-red-50/50 border-red-100/50' : alert.criticidade === 'Alta' ? 'bg-orange-50/50 border-orange-100/50' : 'bg-yellow-50/50 border-yellow-100/50'}`}>
                                <div className="mt-0.5">
                                    <TriangleAlert className={`w-4 h-4 ${alert.criticidade === 'Crítico' ? 'text-red-500' : alert.criticidade === 'Alta' ? 'text-orange-500' : 'text-yellow-500'}`} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-medium text-gray-900 leading-snug">{alert.mensagem}</p>
                                    {alert.criticidade === 'Crítico' && <p className="text-[10px] text-red-500 mt-0.5">Crítico</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* accordion Tabelas */}
            <div className="pt-2">
                <div className="flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-widest gap-2 mb-4 ml-2">
                    <ChevronUp className="w-3 h-3" />
                    TABELAS
                </div>

                {/* Desempenho Analistas Table */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Analistas</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] uppercase tracking-wider">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-3 pt-2">ANALISTA</th>
                                    <th className="font-medium pb-3 pt-2 text-right">EM FILA</th>
                                    <th className="font-medium pb-3 pt-2 text-right">EM ANÁLISE</th>
                                    <th className="font-medium pb-3 pt-2 text-right">CONCLUÍDAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">SLA MÉDIO</th>
                                    <th className="font-medium pb-3 pt-2 text-right">SLA ESTOURADO</th>
                                    <th className="font-medium pb-3 pt-2 text-right">DILIGÊNCIAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">RETRABALHO</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 capitalize text-[13px] tracking-normal">
                                {analystsData.map((analyst, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="py-4 font-medium text-gray-900">{analyst.nome}</td>
                                        <td className="py-4 text-right">{analyst.fila}</td>
                                        <td className="py-4 text-right">{analyst.analise}</td>
                                        <td className="py-4 text-right">{analyst.concluidas}</td>
                                        <td className="py-4 text-right">{analyst.slaMedio}</td>
                                        <td className="py-4 text-right">{analyst.estourado}</td>
                                        <td className="py-4 text-right">{analyst.fila * 2}</td>
                                        <td className="py-4 text-right">{analyst.estourado}</td>
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
