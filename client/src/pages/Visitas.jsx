import React, { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, MoreHorizontal, Navigation, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createCustomIcon = (time, dayText, name, bgColor) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${bgColor}; padding: 6px 10px; border-radius: 12px; font-size: 10px; font-weight: 500; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); width: max-content; font-family: ui-sans-serif, system-ui, sans-serif;">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span style="font-weight: 700; font-size: 11px; line-height: 1;">${time} <span style="font-weight: 400; font-size: 9px; opacity: 0.8;">${dayText}</span></span>
                    <span style="font-size: 10px; line-height: 1.2;">${name}</span>
                 </div>
               </div>`,
        iconSize: [120, 24],
        iconAnchor: [60, 24]
    });
};

const kpis = [
    { label: 'Visitas realizadas na semana', value: '3', subValue: '1 hoje' },
    { label: 'Visitas agendadas na semana', value: '11', subValue: '3 hoje' },
    { label: 'Conversão pós-visita', value: '73%', subValue: null }
];

export function Visitas() {
    const [activeTab, setActiveTab] = useState('agenda');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for new appointments
    const [agendamentos, setAgendamentos] = useState([]);
    const [novoAgendamento, setNovoAgendamento] = useState({ nome: '', dataHora: '', endereco: '' });

    // State for daily view modal
    const [selectedDay, setSelectedDay] = useState(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);

    const handleAgendar = () => {
        if (!novoAgendamento.nome || !novoAgendamento.dataHora) return;

        // Convert datetime-local value to a date object
        const dateObj = new Date(novoAgendamento.dataHora);
        const day = dateObj.getDate();
        const time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        setAgendamentos([...agendamentos, { ...novoAgendamento, day, time }]);
        setNovoAgendamento({ nome: '', dataHora: '', endereco: '' });
        setIsModalOpen(false);
    };

    // Generate calendar days for visual representation map based on mockup (starts on a Sunday, 1 is Sunday)
    const days = Array.from({ length: 28 }, (_, i) => i + 1);

    return (
        <Layout>
            <div className="p-8 bg-[#f5f5f5] min-h-screen space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-[32px] font-medium text-gray-900">Visitas</h1>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-gray-100/50 rounded-full text-[13px] font-medium text-gray-700 border-gray-200">
                                <Plus className="w-4 h-4 mr-2" />
                                Agendar visita
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[24px] bg-[#f5f5f5] p-6 border-0 shadow-lg">
                            <DialogHeader>
                                <DialogTitle className="text-[20px] font-medium text-gray-900 mb-4">Nova visita</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium text-gray-900">Identifique quem você visitará</Label>
                                    <Input
                                        placeholder="Nome"
                                        className="h-10 rounded-xl border-gray-200 bg-white"
                                        value={novoAgendamento.nome}
                                        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, nome: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium text-gray-900">Quando será a visita?</Label>
                                    <Input
                                        type="datetime-local"
                                        placeholder="Selecione uma data e horário"
                                        className="h-10 rounded-xl border-gray-200 bg-white text-gray-500"
                                        value={novoAgendamento.dataHora}
                                        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, dataHora: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium text-gray-900">Qual é o endereço?</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Escreva o endereço..."
                                            className="h-10 rounded-xl border-gray-200 bg-white pl-9"
                                            value={novoAgendamento.endereco}
                                            onChange={(e) => setNovoAgendamento({ ...novoAgendamento, endereco: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button className="bg-[#8cc63f] hover:bg-[#7bc026] text-white rounded-full px-8" onClick={handleAgendar}>
                                        Agendar
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kpis.map((kpi, index) => (
                        <Card key={index} className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white">
                            <p className="text-[13px] text-gray-500 mb-4">{kpi.label}</p>
                            <h2 className="text-[32px] font-medium text-gray-900 mb-1 leading-none">{kpi.value}</h2>
                            {kpi.subValue && <span className="text-[11px] text-gray-400">{kpi.subValue}</span>}
                        </Card>
                    ))}
                </div>

                {/* Main Content Card */}
                <Card className="border border-gray-100 shadow-sm rounded-[24px] bg-white overflow-hidden p-6 pb-2">

                    {/* Tabs */}
                    <div className="flex items-center gap-6 border-b border-gray-100 mb-6 pb-2">
                        {['Agenda', 'Mapa', 'Lista'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`text-[14px] font-medium transition-colors relative ${activeTab === tab.toLowerCase() ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#8cc63f]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'agenda' && (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <button className="text-gray-400 hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
                                <span className="text-[18px] font-medium text-gray-900">Fevereiro</span>
                                <button className="text-gray-400 hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-lg overflow-hidden text-[12px]">
                                {/* Days Header */}
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                                    <div key={day} className="py-3 text-center text-gray-500 font-medium border-r border-b border-gray-100 uppercase text-[11px]">
                                        {day}
                                    </div>
                                ))}

                                {/* Calendar Cells */}
                                {days.map(day => {
                                    const isToday = day === 11;
                                    const isPast = day < 11;
                                    const hasEvents = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27].includes(day);

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => {
                                                setSelectedDay(day);
                                                setIsDayModalOpen(true);
                                            }}
                                            className={`min-h-[140px] p-2 border-r border-b border-gray-100 transition-colors cursor-pointer hover:bg-gray-50/80 ${isPast ? 'bg-gray-50/50' : 'bg-white'}`}
                                        >
                                            <div className="flex justify-start mb-2">
                                                <span className={`w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#8cc63f] text-white font-medium' : 'text-gray-900 font-medium'}`}>
                                                    {day.toString().padStart(2, '0')}
                                                </span>
                                            </div>

                                            {/* Mock Events rendering logic for full days combined with real events */}
                                            {hasEvents && (
                                                <div className="space-y-1.5 mt-1">
                                                    <div className="flex items-start text-[9.5px] leading-tight text-gray-500">
                                                        <div className="w-[30px] opacity-60">13:00</div>
                                                        <div className="flex-1 truncate truncate">{'Guilherme Azevedo'}</div>
                                                    </div>
                                                    <div className="flex items-start text-[9.5px] leading-tight text-gray-500">
                                                        <div className="w-[30px] opacity-60">14:30</div>
                                                        <div className="flex-1 truncate">{'Heitor da Conceição...'}</div>
                                                    </div>
                                                    <div className="flex items-start text-[9.5px] leading-tight text-gray-500">
                                                        <div className="w-[30px] opacity-60">15:20</div>
                                                        <div className="flex-1 truncate truncate">{'Heitor da Conceição...'}</div>
                                                    </div>
                                                    <div className="flex items-start text-[9.5px] leading-tight text-gray-500">
                                                        <div className="w-[30px] opacity-60">17:00</div>
                                                        <div className="flex-1 truncate">{'Heitor da Conceição...'}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Dynamically added events */}
                                            {agendamentos.filter(a => a.day === day).length > 0 && (
                                                <div className="space-y-1.5 mt-1.5 pt-1.5 border-t border-gray-100">
                                                    {agendamentos.filter(a => a.day === day).map((ag, i) => (
                                                        <div key={i} className="flex items-start text-[9.5px] leading-tight text-gray-500">
                                                            <div className="w-[30px] font-medium text-[#8cc63f]">{ag.time}</div>
                                                            <div className="flex-1 truncate text-gray-900 font-medium">{ag.nome}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Daily View Modal */}
                            <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
                                <DialogContent className="sm:max-w-[425px] rounded-[24px] bg-[#f5f5f5] p-6 border-0 shadow-lg">
                                    <DialogHeader>
                                        <DialogTitle className="text-[20px] font-medium text-gray-900 mb-4">
                                            Agendamentos do dia {selectedDay?.toString().padStart(2, '0')}/02
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                        {(() => {
                                            const dayHasEvents = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27].includes(selectedDay);
                                            const addedEvents = agendamentos.filter(a => a.day === selectedDay);

                                            if (!dayHasEvents && addedEvents.length === 0) {
                                                return <div className="text-[13px] text-gray-500 text-center py-4">Nenhum agendamento para este dia.</div>;
                                            }

                                            return (
                                                <>
                                                    {dayHasEvents && (
                                                        <>
                                                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[13px] font-medium text-gray-900">Guilherme Azevedo</span>
                                                                    <span className="text-[11px] font-medium text-[#8cc63f] bg-[#8cc63f]/10 px-2 py-0.5 rounded-full">13:00</span>
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 line-clamp-1">Endereço do cliente</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[13px] font-medium text-gray-900">Heitor da Conceição...</span>
                                                                    <span className="text-[11px] font-medium text-[#8cc63f] bg-[#8cc63f]/10 px-2 py-0.5 rounded-full">14:30</span>
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 line-clamp-1">Endereço comercial</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[13px] font-medium text-gray-900">Heitor da Conceição...</span>
                                                                    <span className="text-[11px] font-medium text-[#8cc63f] bg-[#8cc63f]/10 px-2 py-0.5 rounded-full">15:20</span>
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 line-clamp-1">Endereço comercial 2</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[13px] font-medium text-gray-900">Heitor da Conceição...</span>
                                                                    <span className="text-[11px] font-medium text-[#8cc63f] bg-[#8cc63f]/10 px-2 py-0.5 rounded-full">17:00</span>
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 line-clamp-1">Local da visita final</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {addedEvents.map((ag, i) => (
                                                        <div key={`added-${i}`} className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[13px] font-medium text-gray-900">{ag.nome}</span>
                                                                <span className="text-[11px] font-medium text-[#8cc63f] bg-[#8cc63f]/10 px-2 py-0.5 rounded-full">{ag.time}</span>
                                                            </div>
                                                            <span className="text-[11px] text-gray-500 line-clamp-1">{ag.endereco || 'Endereço não preenchido'}</span>
                                                        </div>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button variant="ghost" className="text-gray-500 hover:text-gray-900" onClick={() => setIsDayModalOpen(false)}>
                                            Voltar
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </div>
                    )} {/* End Agenda Tab */}

                    {/* Mapa Tab */}
                    {activeTab === 'mapa' && (
                        <div className="h-[600px] w-full rounded-xl overflow-hidden relative border border-gray-100">
                            <MapContainer
                                center={[-10.1844, -48.3336]} // Palmas, TO coordinates
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                <ZoomControl position="topright" />

                                {/* Mock Markers */}
                                <Marker position={[-10.18, -48.33]} icon={createCustomIcon('15:00', 'amanhã', 'Paulo Henrique G...', '#d9f99d')}>
                                    <Popup>Detalhes da Visita 1</Popup>
                                </Marker>
                                <Marker position={[-10.19, -48.32]} icon={createCustomIcon('15:00', 'hoje', 'Guilherme Azevedo', '#8cc63f')}>
                                    <Popup>Detalhes da Visita 2</Popup>
                                </Marker>
                                <Marker position={[-10.195, -48.31]} icon={createCustomIcon('17:00', 'hoje', 'Heitor da Concei...', '#8cc63f')}>
                                    <Popup>Detalhes da Visita 3</Popup>
                                </Marker>
                                <Marker position={[-10.21, -48.32]} icon={createCustomIcon('12:00', 'amanhã', 'Thiago Octavio S...', '#d9f99d')}>
                                    <Popup>Detalhes da Visita 4</Popup>
                                </Marker>

                            </MapContainer>
                        </div>
                    )} {/* End Mapa Tab */}

                    {/* Lista Tab */}
                    {activeTab === 'lista' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[12px] text-gray-500">
                                <thead className="text-[11px] text-gray-400 border-b border-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 font-normal">Nome</th>
                                        <th className="px-6 py-4 font-normal">Endereço</th>
                                        <th className="px-6 py-4 font-normal">Data e hora</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5, 6].map((row, index) => (
                                        <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-900">Ronaldo Campos</td>
                                            <td className="px-6 py-4">Edifício Amazônia Center - Q. 501 Sul Avenida Joaquim Teotônio Segurado - Plano Diretor Sul, Palmas - TO, 77016-002</td>
                                            <td className="px-6 py-4">10/02/2026 15:30</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-[#8cc63f] text-white hover:bg-[#7bc026] hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                        </div>
                    )} {/* End Lista Tab */}

                </Card>
            </div>
        </Layout>
    );
}
