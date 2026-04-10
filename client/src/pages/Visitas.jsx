import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight, MoreHorizontal, CircleCheck, Clock3, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (time, dayText, name, bgColor) =>
    L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${bgColor}; padding: 6px 10px; border-radius: 12px; font-size: 10px; font-weight: 500; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); width: max-content; font-family: ui-sans-serif, system-ui, sans-serif;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <span style="font-weight: 700; font-size: 11px; line-height: 1;">${time} <span style="font-weight: 400; font-size: 9px; opacity: 0.8;">${dayText}</span></span>
                <span style="font-size: 10px; line-height: 1.2;">${name}</span>
            </div>
        </div>`,
        iconSize: [128, 24],
        iconAnchor: [64, 24],
    });

const baseVisits = [
    {
        id: 1,
        nome: "Guilherme Azevedo",
        endereco: "Edifício Amazônia Center, Q. 501 Sul, Palmas - TO, 77016-002",
        dataHora: "2026-02-11T15:00",
        lat: -10.19,
        lng: -48.32,
        dayLabel: "hoje",
        bgColor: "#8cc63f",
    },
    {
        id: 2,
        nome: "Paulo Henrique Gomes",
        endereco: "Av. Teotônio Segurado, Plano Diretor Sul, Palmas - TO",
        dataHora: "2026-02-12T15:00",
        lat: -10.18,
        lng: -48.33,
        dayLabel: "amanhã",
        bgColor: "#d9f99d",
    },
    {
        id: 3,
        nome: "Aline Rodrigues",
        endereco: "Q. 304 Norte, Palmas - TO",
        dataHora: "2026-02-12T17:00",
        lat: -10.195,
        lng: -48.31,
        dayLabel: "amanhã",
        bgColor: "#d9f99d",
    },
];

export function Visitas() {
    const [, navigate] = useLocation();
    const [activeTab, setActiveTab] = useState("agenda");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visits, setVisits] = useState(baseVisits);
    const [novoAgendamento, setNovoAgendamento] = useState({ nome: "", dataHora: "", endereco: "" });
    const [selectedDay, setSelectedDay] = useState(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [finishStep, setFinishStep] = useState(1);
    const [opportunities, setOpportunities] = useState([]);

    const days = Array.from({ length: 28 }, (_, i) => i + 1);

    const getDayAndTime = (dateIso) => {
        const dateObj = new Date(dateIso);
        const day = dateObj.getDate();
        const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        return { day, time };
    };

    const kpis = useMemo(() => {
        const todayVisits = visits.filter((v) => v.dayLabel === "hoje").length;
        return [
            { label: "Visitas realizadas na semana", value: "2", subValue: "1 hoje" },
            { label: "Visitas agendadas na semana", value: String(visits.length), subValue: `${todayVisits} hoje` },
            { label: "Conversão pós-visita", value: "73%", subValue: null },
        ];
    }, [visits]);

    const resetFinishFlow = () => {
        setFinishStep(1);
        setOpportunities([]);
    };

    const openFinishModal = (visit) => {
        setSelectedVisit(visit);
        resetFinishFlow();
        setIsFinishModalOpen(true);
    };

    const handleAgendar = () => {
        if (!novoAgendamento.nome || !novoAgendamento.dataHora || !novoAgendamento.endereco) return;

        const newDate = new Date(novoAgendamento.dataHora);
        const today = new Date("2026-02-11T10:00:00");
        const isToday = newDate.toDateString() === today.toDateString();
        const isTomorrow = newDate.toDateString() === new Date(today.getTime() + 86400000).toDateString();

        const newVisit = {
            id: Date.now(),
            ...novoAgendamento,
            lat: -10.186 + Math.random() * 0.02,
            lng: -48.325 + Math.random() * 0.02,
            dayLabel: isToday ? "hoje" : isTomorrow ? "amanhã" : "agendada",
            bgColor: isToday ? "#8cc63f" : "#d9f99d",
        };

        setVisits((prev) => [newVisit, ...prev].slice(0, 5));
        setNovoAgendamento({ nome: "", dataHora: "", endereco: "" });
        setIsModalOpen(false);
    };

    const selectedDayVisits = visits.filter((v) => getDayAndTime(v.dataHora).day === selectedDay);

    return (
        <Layout>
            <div className="p-8 bg-[#f5f5f5] min-h-screen space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kpis.map((kpi, index) => (
                        <Card key={index} className="p-6 border border-gray-100 shadow-sm rounded-[24px] bg-white">
                            <p className="text-[13px] text-gray-500 mb-4">{kpi.label}</p>
                            <h2 className="text-[32px] font-medium text-gray-900 mb-1 leading-none">{kpi.value}</h2>
                            {kpi.subValue && <span className="text-[11px] text-gray-400">{kpi.subValue}</span>}
                        </Card>
                    ))}
                </div>

                <Card className="border border-gray-100 shadow-sm rounded-[24px] bg-white overflow-hidden p-6 pb-2">
                    <div className="flex items-center gap-6 border-b border-gray-100 mb-6 pb-2">
                        {["Agenda", "Mapa", "Lista"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`text-[14px] font-medium transition-colors relative ${activeTab === tab.toLowerCase() ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#8cc63f]" />}
                            </button>
                        ))}
                    </div>

                    {activeTab === "agenda" && (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <button className="text-gray-400 hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
                                <span className="text-[18px] font-medium text-gray-900">Fevereiro</span>
                                <button className="text-gray-400 hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
                            </div>

                            <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-lg overflow-hidden text-[12px]">
                                {["D", "S", "T", "Q", "Q", "S", "S"].map((day) => (
                                    <div key={day} className="py-3 text-center text-gray-500 font-medium border-r border-b border-gray-100 uppercase text-[11px]">
                                        {day}
                                    </div>
                                ))}

                                {days.map((day) => {
                                    const isToday = day === 11;
                                    const isPast = day < 11;
                                    const dayEvents = visits.filter((v) => getDayAndTime(v.dataHora).day === day);
                                    const hasEvents = dayEvents.length > 0;

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => {
                                                setSelectedDay(day);
                                                setIsDayModalOpen(true);
                                            }}
                                            className={`min-h-[140px] p-2 border-r border-b border-gray-100 transition-colors cursor-pointer hover:bg-gray-50/80 ${isPast ? "bg-gray-50/50" : "bg-white"}`}
                                        >
                                            <div className="flex justify-start mb-2">
                                                <span className={`w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-[#8cc63f] text-white font-medium" : "text-gray-900 font-medium"}`}>
                                                    {day.toString().padStart(2, "0")}
                                                </span>
                                            </div>
                                            {hasEvents && (
                                                <div className="space-y-1.5 mt-1">
                                                    {dayEvents.slice(0, 3).map((event) => (
                                                        <div key={event.id} className="flex items-start text-[9.5px] leading-tight text-gray-500">
                                                            <div className="w-[34px] opacity-60">{getDayAndTime(event.dataHora).time}</div>
                                                            <div className="flex-1 truncate">{event.nome}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
                                <DialogContent className="sm:max-w-[425px] rounded-[24px] bg-[#f5f5f5] p-6 border-0 shadow-lg">
                                    <DialogHeader>
                                        <DialogTitle className="text-[20px] font-medium text-gray-900 mb-4">
                                            Agendamentos do dia {selectedDay?.toString().padStart(2, "0")}/02
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                        {selectedDayVisits.length === 0 && (
                                            <div className="text-[13px] text-gray-500 text-center py-4">Nenhum agendamento para este dia.</div>
                                        )}
                                        {selectedDayVisits.map((visit) => (
                                            <div key={visit.id} className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[13px] font-medium text-gray-900">{visit.nome}</span>
                                                    <span className="text-[11px] font-medium text-[#8cc63f] bg-[#8cc63f]/10 px-2 py-0.5 rounded-full">
                                                        {getDayAndTime(visit.dataHora).time}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-gray-500 line-clamp-1">{visit.endereco || "Endereço não preenchido"}</span>
                                                <div className="pt-1">
                                                    <Button onClick={() => openFinishModal(visit)} className="h-8 rounded-full bg-[#d9f99d] text-[#1f2a16] hover:bg-[#c7f17f]">
                                                        <CircleCheck className="w-4 h-4 mr-1.5" />
                                                        Finalizar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    {activeTab === "mapa" && (
                        <div className="h-[600px] w-full rounded-xl overflow-hidden relative border border-gray-100">
                            <MapContainer center={[-10.1844, -48.3336]} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                <ZoomControl position="topright" />
                                {visits.map((visit) => (
                                    <Marker
                                        key={visit.id}
                                        position={[visit.lat, visit.lng]}
                                        icon={createCustomIcon(getDayAndTime(visit.dataHora).time, visit.dayLabel, visit.nome, visit.bgColor)}
                                    >
                                        <Popup>
                                            <div className="space-y-1 text-xs">
                                                <p className="font-semibold">{visit.nome}</p>
                                                <p>{visit.endereco}</p>
                                                <Button className="h-7 rounded-full bg-[#d9f99d] text-[#1f2a16] hover:bg-[#c7f17f] text-xs" onClick={() => openFinishModal(visit)}>
                                                    Finalizar
                                                </Button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )}

                    {activeTab === "lista" && (
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
                                    {visits.map((visit) => (
                                        <tr key={visit.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-900">{visit.nome}</td>
                                            <td className="px-6 py-4">{visit.endereco}</td>
                                            <td className="px-6 py-4">
                                                {new Date(visit.dataHora).toLocaleString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-[#8cc63f] text-white hover:bg-[#7bc026] hover:text-white" onClick={() => openFinishModal(visit)}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            <Dialog
                open={isFinishModalOpen}
                onOpenChange={(open) => {
                    setIsFinishModalOpen(open);
                    if (!open) resetFinishFlow();
                }}
            >
                <DialogContent className="sm:max-w-[980px] p-0 border-0 bg-transparent shadow-none">
                    <div className="grid grid-cols-[1fr_260px] gap-6">
                        <div className="bg-white rounded-xl p-8 min-h-[360px]">
                            {finishStep < 4 && (
                                <div className="flex items-center justify-center gap-2 mb-14">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className={`w-10 h-2 rounded-full ${finishStep >= step ? "bg-[#8cc63f]" : "bg-[#dbe7d0]"}`} />
                                    ))}
                                </div>
                            )}

                            {finishStep === 1 && (
                                <div className="max-w-[520px] mx-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-center text-[18px] font-medium mb-6">A visita foi finalizada?</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button className="h-24 bg-[#d9f99d] text-[#2d4f1f] hover:bg-[#c7f17f] rounded-md text-base" onClick={() => setFinishStep(2)}>Sim</Button>
                                        <Button className="h-24 bg-[#f7d9de] text-[#b84d60] hover:bg-[#f4c8d0] rounded-md text-base" onClick={() => setIsFinishModalOpen(false)}>Não</Button>
                                    </div>
                                </div>
                            )}

                            {finishStep === 2 && (
                                <div className="max-w-[520px] mx-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-center text-[18px] font-medium mb-6">O cliente vai querer seguir?</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button className="h-24 bg-[#d9f99d] text-[#2d4f1f] hover:bg-[#c7f17f] rounded-md text-base" onClick={() => setFinishStep(3)}>Sim</Button>
                                        <Button className="h-24 bg-[#f7d9de] text-[#b84d60] hover:bg-[#f4c8d0] rounded-md text-base" onClick={() => setIsFinishModalOpen(false)}>Não</Button>
                                    </div>
                                </div>
                            )}

                            {finishStep === 3 && (
                                <div className="max-w-[620px] mx-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-center text-[18px] font-medium mb-6">Quais foram as oportunidades identificadas?</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {["Crédito de custeio", "Crédito de investimento", "Pecuária", "Comercialização", "Seguro", "Sustentabilidade", "Internacionalização"].map((item) => {
                                            const active = opportunities.includes(item);
                                            return (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => setOpportunities((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))}
                                                    className={`text-xs px-3 h-7 rounded-md border ${active ? "bg-[#8cc63f] text-white border-[#8cc63f]" : "bg-white text-gray-600 border-gray-200"}`}
                                                >
                                                    + {item}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center mt-8">
                                        <Button className="h-8 rounded-full bg-[#8cc63f] hover:bg-[#7bc026]" onClick={() => setFinishStep(4)}>
                                            Avançar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {finishStep === 4 && (
                                <div className="h-full flex flex-col items-center justify-center py-8">
                                    <div className="flex items-center justify-center mb-4">
                                        <CircleCheck className="w-16 h-16 text-[#8cc63f]" />
                                    </div>
                                    <p className="text-[34px] font-medium text-gray-900 mb-12">Registrado com sucesso.</p>
                                    <Button className="h-11 px-7 rounded-full border border-[#8aa56e] bg-white text-[#4f6b35] hover:bg-[#f5f9f1]" onClick={() => navigate("/cadastro-proposta")}>
                                        Cadastrar proposta
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl p-4 h-fit shadow-sm">
                            <h3 className="text-[34px] font-medium text-gray-900 mb-3 leading-tight">{selectedVisit?.nome || "Cliente"}</h3>
                            <div className="space-y-2 text-[13px] text-gray-600 mb-5">
                                <div className="flex items-start gap-2">
                                    <Clock3 className="w-4 h-4 mt-0.5 text-gray-400" />
                                    <span>
                                        {selectedVisit
                                            ? new Date(selectedVisit.dataHora).toLocaleString("pt-BR", {
                                                weekday: "short",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "--"}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                    <span>{selectedVisit?.endereco || "Endereço da visita"}</span>
                                </div>
                                <button type="button" className="text-left text-gray-700 underline">Abrir no Mapa</button>
                            </div>
                            <Button className="h-9 rounded-full bg-[#d9f99d] text-[#1f2a16] hover:bg-[#c7f17f]">
                                <CircleCheck className="w-4 h-4 mr-1" />
                                Finalizar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
