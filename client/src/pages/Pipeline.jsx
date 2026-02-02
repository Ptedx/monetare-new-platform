import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";

export function Pipeline() {
  const [sortBy, setSortBy] = useState('priority'); // Default sort
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  // If a card is selected, show details
  if (selectedCard) {
    return (
      <Layout>
        <ProposalDetail proposal={selectedCard} onBack={handleBack} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 h-[calc(100vh-64px)] flex flex-col pt-0">
        <div className="flex items-center justify-between py-6">
          <h1 className="text-4xl font-bold">Pipeline</h1>
        </div>

        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200">
            <Search className="w-4 h-4 text-gray-500" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200">
            <Filter className="w-4 h-4 text-gray-500" />
          </Button>

          <Button
            onClick={() => setSortBy('priority')}
            className={`rounded-full border-0 px-4 ${sortBy === 'priority' ? 'bg-[#92dc49] hover:bg-[#7ab635] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Prioridade
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          <Button
            onClick={() => setSortBy('value')}
            className={`rounded-full border-0 px-4 ${sortBy === 'value' ? 'bg-[#92dc49] hover:bg-[#7ab635] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Valor
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          <Button
            onClick={() => setSortBy('date')}
            className={`rounded-full border-0 px-4 ${sortBy === 'date' ? 'bg-[#92dc49] hover:bg-[#7ab635] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Data
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 px-4">
            Filtrar agência
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          <div className="ml-auto flex gap-2">
            <Button variant="ghost" className="rounded-full text-xs text-gray-400 bg-gray-100/50 hover:bg-gray-100">
              Municípios não Prioritários
            </Button>
            <Button variant="ghost" className="rounded-full text-xs text-gray-400 bg-gray-100/50 hover:bg-gray-100">
              Municípios Prioritários
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden">
          <PipelineBoard sortBy={sortBy} onCardClick={handleCardClick} />
        </div>
      </div>
    </Layout>
  );
}
