import React from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import { funnelData, gaugeData, dpdData } from './mockData';

export function VisaoGeralTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Funil Comercial */}
                <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
                    <h3 className="text-sm font-medium text-gray-500 mb-6">Funil comercial</h3>
                    <div className="flex flex-col gap-2">
                        {funnelData.map((stage, index) => (
                            <div key={stage.name} className="flex items-center justify-between group">
                                <span className="text-sm text-gray-500 w-32 truncate">{stage.name}</span>
                                <div className="flex-1 px-4 flex justify-center">
                                    <div
                                        className="h-6 rounded-md flex items-center justify-center text-xs font-semibold text-white truncate transition-all group-hover:brightness-110"
                                        style={{
                                            backgroundColor: stage.fill,
                                            width: `${Math.max(10, (stage.value / funnelData[0].value) * 100)}%`, // Ensure minimum width for visibility
                                            maxWidth: '100%'
                                        }}
                                    >
                                        {stage.value}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400 w-32 text-right">
                                    {index > 0 ? `↓ ${(stage.value / funnelData[index - 1].value * 100).toFixed(0)}% de conversão` : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Tempo por etapa Table */}
                <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Tempo por etapa</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-2">ETAPA</th>
                                    <th className="font-medium pb-2 text-right">PENDENTES</th>
                                    <th className="font-medium pb-2 text-right">SLA MÉDIO</th>
                                    <th className="font-medium pb-2 text-right">SLA ESTOURADO</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                <tr className="border-b border-gray-50">
                                    <td className="py-2.5 font-medium">Cadastro</td>
                                    <td className="py-2.5 text-right">1.200</td>
                                    <td className="py-2.5 text-right">2 d</td>
                                    <td className="py-2.5 text-right">18%</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="py-2.5 font-medium">Risco</td>
                                    <td className="py-2.5 text-right">1.450</td>
                                    <td className="py-2.5 text-right">4 d</td>
                                    <td className="py-2.5 text-right bg-red-100/50 text-red-700 rounded-md">22%</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="py-2.5 font-medium">Técnica</td>
                                    <td className="py-2.5 text-right">2.300</td>
                                    <td className="py-2.5 text-right">10 d</td>
                                    <td className="py-2.5 text-right bg-red-200/60 text-red-800 font-medium rounded-md">28%</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="py-2.5 font-medium">Alçada</td>
                                    <td className="py-2.5 text-right">780</td>
                                    <td className="py-2.5 text-right">3 d</td>
                                    <td className="py-2.5 text-right">15%</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 font-medium">Formalização</td>
                                    <td className="py-2.5 text-right">1.050</td>
                                    <td className="py-2.5 text-right">5 d</td>
                                    <td className="py-2.5 text-right bg-red-100/80 text-red-700 rounded-md">24%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Qualidade (Gauge) */}
                <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Qualidade</h3>
                        <div className="h-40 w-full flex justify-center items-end relative -mb-8 mt-2">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={gaugeData}
                                        cx="50%"
                                        cy="100%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-3 mt-12 w-full text-[13px]">
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#c8ff93]"></div><span className="text-gray-600">Documento incompleto</span></div><span className="font-semibold text-gray-900">24%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#f1c40f]"></div><span className="text-gray-600">Dado divergente</span></div><span className="font-semibold text-gray-900">13%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#e67e22]"></div><span className="text-gray-600">Impedimento cadastral</span></div><span className="font-semibold text-gray-900">9%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#d35400]"></div><span className="text-gray-600">Garantia pendente</span></div><span className="font-semibold text-gray-900">25%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#c0392b]"></div><span className="text-gray-600">Seguro obrigatório/pendente</span></div><span className="font-semibold text-gray-900">26%</span></div>
                    </div>
                </Card>

                {/* Problemas mais recorrentes */}
                <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Problemas mais recorrentes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-2">MOTIVO</th>
                                    <th className="font-medium pb-2 text-right">QUANTIDADE</th>
                                    <th className="font-medium pb-2 text-right">TEMPO DE CORREÇÃO</th>
                                    <th className="font-medium pb-2 text-right">ÁREA</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Documento vencido</td><td className="py-2.5 text-right">420</td><td className="py-2.5 text-right">3 d</td><td className="py-2.5 text-right">Cadastro</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Divergência CNAE</td><td className="py-2.5 text-right">190</td><td className="py-2.5 text-right">2 d</td><td className="py-2.5 text-right">Cadastro</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">DRE inconsistente</td><td className="py-2.5 text-right">350</td><td className="py-2.5 text-right">5 d</td><td className="py-2.5 text-right">Risco</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">SCR restrição não declarada</td><td className="py-2.5 text-right">210</td><td className="py-2.5 text-right">4 d</td><td className="py-2.5 text-right">Risco</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Projeto incompleto</td><td className="py-2.5 text-right">510</td><td className="py-2.5 text-right">7 d</td><td className="py-2.5 text-right">Técnico</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Garantia insuficiente</td><td className="py-2.5 text-right">260</td><td className="py-2.5 text-right">6 d</td><td className="py-2.5 text-right">Técnico</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Falta de laudo ambiental</td><td className="py-2.5 text-right">180</td><td className="py-2.5 text-right">8 d</td><td className="py-2.5 text-right">Técnico</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Reanálise por mudança de limite</td><td className="py-2.5 text-right">140</td><td className="py-2.5 text-right">4 d</td><td className="py-2.5 text-right">Alçada</td></tr>
                                <tr className="border-b border-gray-50"><td className="py-2.5 truncate max-w-[120px]">Pendência assinatura</td><td className="py-2.5 text-right">300</td><td className="py-2.5 text-right">5 d</td><td className="py-2.5 text-right">Formalização</td></tr>
                                <tr><td className="py-2.5 truncate max-w-[120px]">Registro cartório atrasado</td><td className="py-2.5 text-right">230</td><td className="py-2.5 text-right">9 d</td><td className="py-2.5 text-right">Jurídico</td></tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Saúde da Carteira */}
            <Card className="p-6 border-none shadow-sm rounded-3xl bg-white w-full">
                <h3 className="text-sm font-medium text-gray-500 mb-6">Saúde da Carteira</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left KPIs */}
                    <div className="md:col-span-1 border-r border-gray-100 pr-4 flex flex-col justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Saldo em carteira</p>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">R$ 17,8 B</h2>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Contratos ativos</p>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">92.698</h2>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Recuperado (no período)</p>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">3.450</h2>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Renegociado</p>
                            <h2 className="text-xl font-bold text-gray-900">4.980</h2>
                        </div>
                    </div>

                    {/* Bar Chart DPD */}
                    <div className="md:col-span-3">
                        <p className="text-sm text-gray-600 mb-4">Inadimplência por DPD (Dias de Atraso)</p>
                        <div className="h-[250px] w-full mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dpdData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                                        {dpdData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

    );
}
