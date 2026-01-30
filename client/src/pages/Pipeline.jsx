import { Layout } from "@/components/layout/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Flag, Clock, Building, AlertCircle } from "lucide-react";

const pipelineStages = [
  {
    name: "1. GEPEC",
    value: "R$ 585.000.000",
    count: 3,
    cards: [
      { name: "Faz. Soledade", value: "R$ 550.000.000", rating: "AA", analyst: "Ag. Brasília", days: 5, type: "Rural" },
      { name: "Faz. Casa Branca", value: "R$ 30.000.000", rating: "C", analyst: "Ag. Brasília", days: 8, type: "Rural" },
      { name: "Faz. Águas Claras", value: "R$ 5.000.000", rating: "D", analyst: "Ag. Brasília", days: 18, type: "Rural" },
    ]
  },
  {
    name: "2. GECRE",
    value: "R$ 350.000.000",
    count: 2,
    cards: [
      { name: "Faz. Aurora", value: "R$ 250.000.000", rating: "A", analyst: "Ag. Brasília", days: 8, type: "Rural", hasPendency: true },
      { name: "Faz. Girassol", value: "R$ 100.000.000", rating: "B", analyst: "Ag. Brasília", days: 5, type: "Rural" },
    ]
  },
  {
    name: "3. GEOPE",
    value: "R$ 270.000.000",
    count: 1,
    cards: [
      { name: "Fernando Fagundes", value: "R$ 50.000.000", rating: "A", analyst: "Ag. Brasília", days: 16, type: "Rural", hasPendency: true, hasFlag: true },
    ]
  },
  {
    name: "4. GERPF/PJ/MIP/RED",
    value: "R$ 180.000.000",
    count: 2,
    cards: [
      { name: "Vale do Cedro", value: "R$ 70.000.000", rating: "C", analyst: "Ag. Brasília", days: 5, type: "Corporate" },
      { name: "Faz. Barra Funda", value: "R$ 110.000.000", rating: "B", analyst: "Ag. Brasília", days: 2, type: "Corporate" },
    ]
  },
];

function getRatingColor(rating) {
  switch(rating) {
    case 'AA': return 'bg-green-500';
    case 'A': return 'bg-blue-500';
    case 'B': return 'bg-yellow-500';
    case 'C': return 'bg-orange-500';
    case 'D': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function KanbanCard({ card }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm">{card.name}</h4>
        {card.hasFlag && <Flag className="w-4 h-4 text-orange-500" />}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold">{card.value}</span>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${getRatingColor(card.rating)}`}>
          {card.rating}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Building className="w-3 h-3" />
        <span>{card.analyst}</span>
        <Clock className="w-3 h-3 ml-2" />
        <span>{card.days} dias</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{card.type}</span>
        {card.hasPendency && (
          <div className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="w-3 h-3" />
            <span>2 pendências</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Pipeline() {
  return (
    <Layout>
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Pipeline</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <Filter className="w-4 h-4 text-gray-500" />
          </div>
          <Select defaultValue="prioridade">
            <SelectTrigger className="w-[120px] bg-[#92dc49] text-white border-none">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prioridade">Prioridade</SelectItem>
              <SelectItem value="valor">Valor</SelectItem>
              <SelectItem value="data">Data</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Classe</SelectItem>
              <SelectItem value="aa">AA</SelectItem>
              <SelectItem value="a">A</SelectItem>
              <SelectItem value="b">B</SelectItem>
              <SelectItem value="c">C</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Segmento</SelectItem>
              <SelectItem value="rural">Rural</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Agência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Agência</SelectItem>
              <SelectItem value="brasilia">Ag. Brasília</SelectItem>
              <SelectItem value="sp">Ag. São Paulo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full">
            {pipelineStages.map((stage, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] bg-gray-50 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">{stage.name}</h3>
                  <p className="text-lg font-bold">{stage.value}</p>
                  <p className="text-xs text-gray-500">{stage.count} propostas</p>
                </div>
                <div className="space-y-3">
                  {stage.cards.map((card, cardIndex) => (
                    <KanbanCard key={cardIndex} card={card} />
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex-shrink-0 w-[240px] bg-gray-50 rounded-lg p-4 opacity-60">
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 mb-1">5. GERIS</h3>
                <p className="text-lg font-bold">R$ 780.000.000</p>
                <p className="text-xs text-gray-500">3 propostas</p>
              </div>
            </div>

            <div className="flex-shrink-0 w-[240px] bg-gray-50 rounded-lg p-4 opacity-40">
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 mb-1">6. CCONS</h3>
                <p className="text-lg font-bold">R$ 0</p>
                <p className="text-xs text-gray-500">0 propostas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
