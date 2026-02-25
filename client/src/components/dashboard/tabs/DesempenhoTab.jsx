import React from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup as LeafletPopup } from 'react-leaflet';
import { sparklineData1, sparklineData2, sparklineData3, sparklineData4, mapData } from './mockData';

export function DesempenhoTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Column: 4 KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-5 border border-gray-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[13px] text-gray-500">Carteira</p>
                            <h2 className="text-[26px] font-medium text-black leading-none tracking-tight">R$ 18 B</h2>
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-200 font-semibold px-2 mb-2">
                            <span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span><span>JUL</span><span>AGO</span><span>SET</span><span>OUT</span><span>NOV</span><span>DEZ</span><span>JAN</span><span>FEV</span>
                        </div>
                        <div className="h-14 w-full -mx-1">
                            <ResponsiveContainer width="102%" height="100%">
                                <AreaChart data={sparklineData1}>
                                    <defs>
                                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9cd649" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#9cd649" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#9cd649" strokeWidth={2} fillOpacity={1} fill="url(#colorGreen)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-5 border border-gray-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[13px] text-gray-500">Propostas ativas</p>
                            <h2 className="text-[26px] font-medium text-black leading-none tracking-tight">65.250</h2>
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-200 font-semibold px-2 mb-2">
                            <span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span><span>JUL</span><span>AGO</span><span>SET</span><span>OUT</span><span>NOV</span><span>DEZ</span><span>JAN</span><span>FEV</span>
                        </div>
                        <div className="h-14 w-full -mx-1">
                            <ResponsiveContainer width="102%" height="100%">
                                <AreaChart data={sparklineData2}>
                                    <defs>
                                        <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f1c40f" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f1c40f" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#f1c40f" strokeWidth={2} fillOpacity={1} fill="url(#colorYellow)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-5 border border-gray-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[13px] text-gray-500">Contratos ativos</p>
                            <h2 className="text-[26px] font-medium text-black leading-none tracking-tight">92.698</h2>
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-200 font-semibold px-2 mb-2">
                            <span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span><span>JUL</span><span>AGO</span><span>SET</span><span>OUT</span><span>NOV</span><span>DEZ</span><span>JAN</span><span>FEV</span>
                        </div>
                        <div className="h-14 w-full -mx-1">
                            <ResponsiveContainer width="102%" height="100%">
                                <AreaChart data={sparklineData3}>
                                    <defs>
                                        <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3498db" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} fillOpacity={1} fill="url(#colorBlue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-5 border border-gray-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[13px] text-gray-500">Desembolso</p>
                            <h2 className="text-[26px] font-medium text-black leading-none tracking-tight">R$ 12,4 B</h2>
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-200 font-semibold px-2 mb-2">
                            <span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span><span>JUL</span><span>AGO</span><span>SET</span><span>OUT</span><span>NOV</span><span>DEZ</span><span>JAN</span><span>FEV</span>
                        </div>
                        <div className="h-14 w-full -mx-1">
                            <ResponsiveContainer width="102%" height="100%">
                                <AreaChart data={sparklineData4}>
                                    <defs>
                                        <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8a74e6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8a74e6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#8a74e6" strokeWidth={2} fillOpacity={1} fill="url(#colorPurple)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Indicadores */}
                <Card className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white h-full">
                    <h3 className="text-[13px] text-gray-500 font-medium mb-6">Indicadores</h3>
                    <div className="space-y-0">
                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="text-[15px] text-gray-500">Ticket médio</span>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-[16px] text-black">R$ 192.000,00</span>
                                <span className="text-[11px] font-semibold text-[#27ae60] w-12 text-right tracking-tight">+1,2 %</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="text-[15px] text-gray-500">Tempo médio do ciclo</span>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-[16px] text-black">30 - 40 d</span>
                                <span className="text-[11px] font-semibold w-12 text-right"></span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="text-[15px] text-gray-500">Taxa de conversão</span>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-[16px] text-black">32%</span>
                                <span className="text-[11px] font-semibold text-[#27ae60] w-12 text-right tracking-tight">+ 8,88 pp</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="text-[15px] text-gray-500">Inadimplência geral</span>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-[16px] text-black">3,2%</span>
                                <span className="text-[11px] font-semibold text-[#27ae60] w-12 text-right tracking-tight">- 2,2 pp</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[15px] text-gray-600">Volume por produto</span>
                            </div>
                            {/* Horizontal Stacked Bar Mock */}
                            <div className="h-3.5 w-full flex gap-1 rounded-full overflow-hidden">
                                <div className="bg-[#c8ff93] h-full rounded-full" style={{ width: '38%' }}></div>
                                <div className="bg-[#9cd649] h-full rounded-full" style={{ width: '22%' }}></div>
                                <div className="bg-[#599321] h-full rounded-full" style={{ width: '26%' }}></div>
                                <div className="bg-[#294a11] h-full rounded-full" style={{ width: '14%' }}></div>
                            </div>
                            {/* Legend */}
                            <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400 font-medium">
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#c8ff93]"></div>MM (20%) — R$ 3,5 B</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#9cd649]"></div>Varejo (15%) — R$ 2,6 B</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#599321]"></div>Agro (48%) — R$ 8,7 B</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#294a11]"></div>Corporate (17%) — R$ 3,0 B</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bubble Map Section */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col mt-6 overflow-hidden">
                <div className="px-6 pt-5 pb-2 font-semibold text-black text-[13px] tracking-tight">
                    Distribuição de projetos
                </div>

                <div className="h-[400px] w-full relative bg-[#f9fafb] z-0">
                    {/* Map controls */}
                    <div className="absolute top-4 left-6 z-[1000] bg-gray-400/80 backdrop-blur-sm rounded-full flex items-center px-1 border border-gray-500/20">
                        <button className="px-3 py-1 text-white hover:text-white text-sm font-semibold">-</button>
                        <span className="px-1 text-xs text-white border-x border-gray-300/40 font-medium">350%</span>
                        <button className="px-3 py-1 text-white hover:text-white text-sm font-semibold">+</button>
                    </div>

                    <MapContainer
                        center={[-1.4, -48.4]}
                        zoom={10}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        {mapData.map((project, index) => (
                            <CircleMarker
                                key={`marker-${index}`}
                                center={[project.lat, project.lng]}
                                pathOptions={{ color: project.color, fillColor: project.color, fillOpacity: 0.7, weight: 0 }}
                                radius={project.z / 15}
                            >
                                <LeafletPopup>
                                    <strong>{project.name}</strong><br />
                                    Volume: {project.z}
                                </LeafletPopup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>

        </div>
    );
}
