import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Maximize2 } from 'lucide-react';

const center = [-8.0, -49.0]; // Center around North-Northeast (PA, TO, MA)

const projects = [
    // Pará
    { id: 1, name: "Fazenda Rio Amazonas (Belém)", coords: [-1.4558, -48.5044], value: 45, color: "#d97706" },
    { id: 2, name: "Agro Norte (Marabá)", coords: [-5.3800, -49.0969], value: 50, color: "#84cc16" },
    { id: 3, name: "Sítio Tapajós (Santarém)", coords: [-2.4431, -54.7083], value: 30, color: "#22c55e" },
    { id: 4, name: "Vale Verde (Altamira)", coords: [-3.2033, -52.2064], value: 35, color: "#d97706" },
    { id: 5, name: "Serra dos Carajás (Parauapebas)", coords: [-5.0686, -49.9014], value: 40, color: "#ef4444" },
    { id: 6, name: "Agro Itaituba", coords: [-4.2761, -55.9836], value: 25, color: "#3b82f6" },
    { id: 7, name: "Fazenda Castanhal", coords: [-1.2917, -47.9250], value: 30, color: "#d97706" },
    { id: 8, name: "Soja Sul PA (Redenção)", coords: [-8.0286, -50.0306], value: 55, color: "#84cc16" },

    // Mato Grosso
    { id: 9, name: "Agro Pantanal (Cuiabá)", coords: [-15.6010, -56.0974], value: 60, color: "#22c55e" },
    { id: 10, name: "Fazenda Soja MT (Sinop)", coords: [-11.8642, -55.5050], value: 70, color: "#ef4444" },
    { id: 11, name: "Rondonópolis Agro", coords: [-16.4708, -54.6356], value: 55, color: "#d97706" },
    { id: 12, name: "Celeiro do Mundo (Sorriso)", coords: [-12.5444, -55.7208], value: 65, color: "#3b82f6" },
    { id: 13, name: "Lucas do Rio Verde Grãos", coords: [-13.0639, -55.9083], value: 60, color: "#22c55e" },
    { id: 14, name: "Primavera Agro", coords: [-15.5606, -54.2981], value: 45, color: "#84cc16" },
    { id: 15, name: "Serra de Tangará", coords: [-14.6189, -57.4878], value: 40, color: "#d97706" },
    { id: 16, name: "Nova Mutum Projetos", coords: [-13.8244, -54.8911], value: 50, color: "#ef4444" },

    // Tocantins
    { id: 17, name: "Fazenda Jalapão (Palmas)", coords: [-10.1675, -48.3277], value: 45, color: "#22c55e" },
    { id: 18, name: "Araguaína Grãos", coords: [-7.1911, -48.2044], value: 50, color: "#84cc16" },
    { id: 19, name: "Gurupi Soja", coords: [-11.7292, -49.0686], value: 40, color: "#3b82f6" },
    { id: 20, name: "Agro Porto Nacional", coords: [-10.7081, -48.4172], value: 35, color: "#d97706" },
    { id: 21, name: "Vale do Paraíso (TO)", coords: [-10.1742, -48.8836], value: 30, color: "#ef4444" },
    { id: 22, name: "Guaraí Agropecuária", coords: [-8.8350, -48.5133], value: 25, color: "#22c55e" },
    { id: 23, name: "Dianópolis Projetos", coords: [-11.6236, -46.8203], value: 25, color: "#d97706" },
    { id: 24, name: "Colinas do Norte (TO)", coords: [-8.0583, -48.4764], value: 35, color: "#84cc16" },
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
                    zoom={5.5}
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
