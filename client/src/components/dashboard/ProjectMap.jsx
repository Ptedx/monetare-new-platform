import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Maximize2 } from 'lucide-react';

const center = [-15.793889, -47.882778]; // Brasilia DF

const projects = [
    { id: 1, name: "Faz. Soledade", coords: [-15.7801, -47.9292], value: 50, color: "#d97706" }, // Orange
    { id: 2, name: "Aurora", coords: [-15.8267, -47.9216], value: 30, color: "#84cc16" }, // Lime
    { id: 3, name: "Vale do Cedro", coords: [-15.7500, -47.8800], value: 20, color: "#22c55e" }, // Green
    { id: 4, name: "Barra Funda", coords: [-15.8000, -47.8500], value: 40, color: "#d97706" },
    { id: 5, name: "São João", coords: [-15.8500, -47.9500], value: 25, color: "#ef4444" }, // Red
    { id: 6, name: "Santa Luzia", coords: [-15.7200, -47.8000], value: 35, color: "#3b82f6" }, // Blue
    { id: 7, name: "Agro Sul", coords: [-15.9000, -47.7500], value: 60, color: "#d97706" },
];

export function ProjectMap() {
    return (
        <Card className="mb-6 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Distribuição de projetos</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                        <Filter className="w-4 h-4 mr-2" />
                        Todas as agências
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="h-[400px] w-full relative z-0">
                <MapContainer
                    center={center}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    {projects.map((project) => (
                        <CircleMarker
                            key={project.id}
                            center={project.coords}
                            pathOptions={{ color: project.color, fillColor: project.color, fillOpacity: 0.7, weight: 0 }}
                            radius={project.value / 1.5} // Scale radius
                        >
                            <Popup>
                                <strong>{project.name}</strong>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </Card>
    );
}
