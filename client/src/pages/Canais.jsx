import React, { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/196c0332d38cb935cfca227d28f7cecfa70b412e/br-states.json";

// Mock Data
const kpis = [
    { label: 'Leads novos na semana', value: '32' },
    { label: 'Leads qualificados', value: '83%' },
    { label: 'Reuniões marcadas', value: '8' }
];

const conversaoCanalData = [
    { name: 'Projetistas', value: 45, fill: '#8cc63f' },
    { name: 'Agências', value: 35, fill: '#cfdbbd' },
    { name: 'Portal', value: 15, fill: '#cfdbbd' },
    { name: 'Parceiros', value: 15, fill: '#cfdbbd' }
];

const rankingTags = [
    { name: 'Máquinas', value: 55 },
    { name: 'Soja', value: 32 },
    { name: 'Palma', value: 10 },
    { name: 'Energia', value: 1 },
    { name: 'Café', value: 1 }
];

const ufsData = [
    { uf: 'Tocantins', count: 565 },
    { uf: 'Pará', count: 496 },
    { uf: 'Mato Grosso', count: 412 },
    { uf: 'Goiás', count: 322 },
    { uf: 'Distrito Federal', count: 270 },
    { uf: 'Amazonas', count: 234 },
    { uf: 'Maranhão', count: 127 },
    { uf: 'Bahia', count: 76 }
];

const leadsData = Array(7).fill({
    nome: 'Ronaldo Campos',
    porte: 'GRANDE',
    atividade: 'Agronomia',
    municipio: 'Palmas, TO',
    score: '400',
    ultimoContato: '10/02/2026 15:30'
});

export function Canais() {
    return (
        <Layout>
            <div className="p-8 bg-[#f5f5f5] min-h-screen space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-[32px] font-medium text-gray-900">Canais e oportunidades</h1>
                    <div>
                        <Button variant="outline" className="bg-white rounded-full text-sm font-medium h-9 text-gray-700">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Fevereiro/2026
                        </Button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kpis.map((kpi, index) => (
                        <Card key={index} className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white">
                            <p className="text-[13px] text-gray-500 mb-2">{kpi.label}</p>
                            <h2 className="text-[28px] font-medium text-gray-900">{kpi.value}</h2>
                        </Card>
                    ))}
                </div>

                {/* Graphics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white flex flex-col h-[280px]">
                        <h3 className="text-[13px] font-medium text-gray-500 mb-6">Conversão por canal</h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={conversaoCanalData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A3A3A3' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A3A3A3' }} ticks={[0, 25, 50, 75, 100]} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                        {conversaoCanalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white h-[280px]">
                        <h3 className="text-[13px] font-medium text-gray-500 mb-6">Ranking de tags</h3>
                        <div className="space-y-4">
                            {rankingTags.map((tag, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="text-[12px] text-gray-600 w-16">{tag.name}</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#8cc63f] rounded-full" style={{ width: `${tag.value}%` }} />
                                    </div>
                                    <span className="text-[12px] text-gray-400 w-8 text-right">{tag.value}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Map and Region Row */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white">
                    <h3 className="text-[13px] font-medium text-gray-900 mb-6">Mapa de oportunidades</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-100/50 rounded-[20px] flex items-center justify-center p-4 relative min-h-[400px]">
                            {/* Map Visualization */}
                            <div className="w-full h-full">
                                <ComposableMap
                                    projection="geoMercator"
                                    projectionConfig={{
                                        scale: 550,
                                        center: [-55, -15] // Center of Brazil
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => {
                                                const ufName = geo.properties.nome;
                                                const ufData = ufsData.find(d => d.uf === ufName);

                                                // Determine color based on count (mock logic)
                                                let fillColor = "#e5f5e0"; // default/pouco
                                                if (ufData) {
                                                    if (ufData.count > 500) fillColor = "#006d2c";
                                                    else if (ufData.count > 400) fillColor = "#31a354";
                                                    else if (ufData.count > 300) fillColor = "#74c476";
                                                    else if (ufData.count > 200) fillColor = "#a1d99b";
                                                    else fillColor = "#c7e9c0";
                                                }

                                                return (
                                                    <Geography
                                                        key={geo.rsmKey}
                                                        geography={geo}
                                                        fill={fillColor}
                                                        stroke="#ffffff"
                                                        strokeWidth={0.5}
                                                        style={{
                                                            default: { outline: "none" },
                                                            hover: { fill: "#8cc63f", outline: "none", cursor: "pointer" },
                                                            pressed: { outline: "none" },
                                                        }}
                                                    />
                                                );
                                            })
                                        }
                                    </Geographies>
                                </ComposableMap>
                            </div>

                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-gray-500 bg-white/80 p-2 rounded-xl backdrop-blur-sm">
                                <span>Pouco</span>
                                <div className="flex bg-white p-1 rounded-full px-2 gap-1 shadow-sm">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#e5f5e0]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#c7e9c0]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#a1d99b]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#74c476]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#31a354]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#006d2c]"></div>
                                </div>
                                <span>Muito</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[14px] font-medium text-gray-900 mb-4">Selecione uma UF</h4>
                            <div className="space-y-2">
                                {ufsData.map((uf, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl">
                                        <span className="text-[13px] text-gray-700">{uf.uf}</span>
                                        <span className="bg-gray-400 text-white text-[10px] px-2 py-0.5 rounded-full">{uf.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Leads Table Row */}
                <div className="space-y-4">
                    <h3 className="text-[14px] font-medium text-gray-900">Leads</h3>
                    <Card className="border border-gray-100 shadow-sm rounded-[24px] bg-white overflow-hidden">
                        {/* Filters Bar */}
                        <div className="p-4 border-b border-gray-50 flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-gray-50 border-gray-200">
                                <Search className="h-4 w-4 text-gray-500" />
                            </Button>
                            <div className="flex gap-2 text-[12px]">
                                <select className="h-8 rounded-lg border-gray-200 bg-gray-50 px-3 pr-8 focus:ring-0 text-gray-700"><option>UF</option></select>
                                <select className="h-8 rounded-lg border-gray-200 bg-gray-50 px-3 pr-8 focus:ring-0 text-gray-700"><option>Atividade</option></select>
                                <select className="h-8 rounded-lg border-gray-200 bg-gray-50 px-3 pr-8 focus:ring-0 text-gray-700"><option>Oportunidade</option></select>
                                <select className="h-8 rounded-lg border-gray-200 bg-gray-50 px-3 pr-8 focus:ring-0 text-gray-700"><option>Porte</option></select>
                            </div>
                            <Button variant="ghost" className="h-8 ml-auto text-gray-500 text-[12px]">
                                Limpar
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[12px] text-gray-500">
                                <thead className="text-[11px] text-gray-400 border-b border-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 font-normal">Nome</th>
                                        <th className="px-6 py-4 font-normal">Porte</th>
                                        <th className="px-6 py-4 font-normal">Atividade</th>
                                        <th className="px-6 py-4 font-normal">Município</th>
                                        <th className="px-6 py-4 font-normal">Score inicial</th>
                                        <th className="px-6 py-4 font-normal">Último contato</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leadsData.map((lead, index) => (
                                        <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-900">{lead.nome}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-[#e5f5e0] text-[#31a354] px-2.5 py-1 rounded-full text-[10px] font-medium">{lead.porte}</span>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-1.5">
                                                <LeafIcon /> {lead.atividade}
                                            </td>
                                            <td className="px-6 py-4">{lead.municipio}</td>
                                            <td className="px-6 py-4 flex items-center gap-1">
                                                {lead.score}
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block ml-1"></span>
                                            </td>
                                            <td className="px-6 py-4">{lead.ultimoContato}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-[#8cc63f] text-white hover:bg-[#7bc026] hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination (Visual only) */}
                        <div className="p-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                            <span>Mostrando # de ### resultados</span>
                            <div className="flex gap-1">
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer">&laquo;</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer">&lt;</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer bg-gray-100 text-gray-900">1</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer hover:bg-gray-50">2</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer hover:bg-gray-50">3</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer hover:bg-gray-50">...</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer">&gt;</div>
                                <div className="w-6 h-6 flex justify-center items-center border rounded cursor-pointer">&raquo;</div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </Layout>
    );
}

function LeafIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    );
}
