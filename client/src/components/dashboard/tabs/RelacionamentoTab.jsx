import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup as LeafletPopup } from 'react-leaflet';
import { pipelineData, qualidadeData, managersData, visitasMapData } from './mockData';

export function RelacionamentoTab() {
    return (
        <div className="space-y-6">
            {/* 1. Grid Top */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: 4 small cards in a 2x2 grid */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6 h-[120px]">
                        <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                            <p className="text-[13px] text-gray-500 mb-2">Visitas realizadas</p>
                            <h2 className="text-3xl font-medium text-gray-900 mt-2">4.120</h2>
                        </Card>
                        <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                            <p className="text-[13px] text-gray-500 mb-2">Propostas criadas</p>
                            <h2 className="text-3xl font-medium text-gray-900 mt-2">2.940</h2>
                        </Card>
                    </div>
                    <div className="grid grid-cols-2 gap-6 h-[120px]">
                        <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                            <p className="text-[12px] text-gray-500 mb-2 leading-tight">Conversão<br />Lead &rarr; Proposta</p>
                            <h2 className="text-[22px] font-medium text-gray-900 mt-2">1.180</h2>
                        </Card>
                        <Card className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                            <p className="text-[12px] text-gray-500 mb-2 leading-tight">Conversão<br />Proposta &rarr; Contrato</p>
                            <h2 className="text-[22px] font-medium text-gray-900 mt-2">940</h2>
                        </Card>
                    </div>
                </div>

                {/* Right side: Receita estimada */}
                <div className="lg:col-span-2">
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-[13px] font-medium text-gray-500">Receita estimada do Pipeline</h3>
                            <h2 className="text-3xl font-medium text-gray-900 tracking-tight">R$ 1,72 B</h2>
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-200 font-semibold px-2 mb-2">
                            <span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span><span>JUL</span><span>AGO</span><span>SET</span><span>OUT</span><span>NOV</span><span>DEZ</span><span>JAN</span><span>FEV</span>
                        </div>
                        <div className="h-[140px] w-full -mx-1">
                            <ResponsiveContainer width="102%" height="100%">
                                <AreaChart data={pipelineData}>
                                    <defs>
                                        <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9cd649" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#9cd649" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#9cd649" strokeWidth={2} fillOpacity={1} fill="url(#colorPipeline)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 2. Grid Middle */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Qualidade (Gauge) */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-[13px] font-medium text-gray-500 mb-2">Qualidade</h3>
                        <div className="h-32 w-full flex justify-center items-end relative -mb-6 mt-2">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={qualidadeData}
                                        cx="50%"
                                        cy="100%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {qualidadeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="space-y-3 mt-10 w-full text-[13px]">
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#bedc7a]"></div><span className="text-gray-600">Documento incompleto</span></div><span className="text-gray-900">24%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e6c84c]"></div><span className="text-gray-600">Dado divergente</span></div><span className="text-gray-900">40%</span></div>
                        <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e69832]"></div><span className="text-gray-600">Impedimento cadastral</span></div><span className="text-gray-900">36%</span></div>
                    </div>
                </Card>

                {/* Ranking de Gerentes */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col lg:col-span-2">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Ranking de Gerentes (Top 5)</h3>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-[11px] uppercase tracking-wider">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400">
                                    <th className="font-medium pb-3 pt-2">GERENTE</th>
                                    <th className="font-medium pb-3 pt-2 text-right">LEADS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">VISITAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">PROP. CRIADAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">PROP. APROVADAS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">CONTRATOS</th>
                                    <th className="font-medium pb-3 pt-2 text-right">PIPELINE</th>
                                    <th className="font-medium pb-3 pt-2 text-right">CONVERSÃO</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 capitalize text-[13px] tracking-normal">
                                {managersData.map((manager, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="py-3 font-medium text-gray-900">{manager.nome}</td>
                                        <td className="py-3 text-right">{manager.leads}</td>
                                        <td className="py-3 text-right">{manager.visitas}</td>
                                        <td className="py-3 text-right">{manager.prop}</td>
                                        <td className="py-3 text-right">{manager.prop - 20}</td>
                                        <td className="py-3 text-right">{manager.contratos}</td>
                                        <td className="py-3 text-right font-medium text-gray-900">{manager.pipeline}</td>
                                        <td className="py-3 text-right text-gray-900">{manager.conversao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* 3. Grid Bottom */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Indicadores */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-6">Indicadores</h3>
                    <div className="space-y-6">
                        <div className="flex items-end justify-between border-b border-gray-50 pb-6 relative">
                            <span className="text-[13px] text-gray-600 mb-1 z-10 bg-white pr-2">Pipeline total</span>
                            <div className="absolute inset-0 top-auto bottom-8 h-12 w-[110px] left-[90px] opacity-70">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={pipelineData}>
                                        <defs>
                                            <linearGradient id="colorPipe2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#9cd649" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#9cd649" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="value" stroke="#9cd649" strokeWidth={2} fillOpacity={1} fill="url(#colorPipe2)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-right z-10 bg-white pl-2">
                                <h2 className="text-[20px] font-bold text-gray-900 leading-none">R$ 1,72 B</h2>
                                <span className="text-[10px] text-[#27ae60] font-medium">+ 12,5 %</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-[13px] text-gray-600">Pipeline parado &gt; 15 dias</span>
                            <div className="text-right">
                                <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">R$ 412 mi</h2>
                                <span className="text-[10px] text-[#27ae60] font-medium">+ 5,2 %</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-[13px] text-gray-600">Ticket médio do pipeline</span>
                            <div className="text-right">
                                <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">R$ 209.000</h2>
                                <span className="text-[10px] text-[#27ae60] font-medium">+ 8,4 %</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-[13px] text-gray-600">Ticket médio fechado</span>
                            <div className="text-right">
                                <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">R$ 190.000</h2>
                                <span className="text-[10px] text-[#27ae60] font-medium">+ 3,1 %</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Distribuição de visitas */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white lg:col-span-2 overflow-hidden flex flex-col">
                    <h3 className="text-[13px] font-medium text-gray-500 mb-4">Distribuição de visitas</h3>
                    <div className="h-[280px] w-full relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 z-0">
                        <div className="absolute top-4 left-6 z-[1000] bg-gray-400/80 backdrop-blur-sm rounded-full flex items-center px-1 border border-gray-500/20">
                            <button className="px-3 py-1 text-white hover:text-white text-sm font-semibold">-</button>
                            <span className="px-1 text-xs text-white border-x border-gray-300/40 font-medium">350%</span>
                            <button className="px-3 py-1 text-white hover:text-white text-sm font-semibold">+</button>
                        </div>
                        <MapContainer
                            center={[-9.5, -48.0]}
                            zoom={6}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            {visitasMapData.map((project, index) => (
                                <CircleMarker
                                    key={`marker-${index}`}
                                    center={[project.lat, project.lng]}
                                    pathOptions={{ color: project.color, fillColor: project.color, fillOpacity: 0.7, weight: 0 }}
                                    radius={project.z / 3.5}
                                >
                                    <LeafletPopup>
                                        <strong>{project.name}</strong><br />
                                        Volume: {project.z}
                                    </LeafletPopup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
