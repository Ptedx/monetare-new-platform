import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";

export function Pipeline() {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSort = (key) => {
    setSortConfig(current => {
      if (current.key === key) {
        // Toggle direction
        return { ...current, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      // New key, default to desc for numbers/priority
      return { key, direction: 'desc' };
    });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  // Helper to get icon based on current sort
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronDown className="w-4 h-4 ml-2" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 ml-2" />
      : <ChevronDown className="w-4 h-4 ml-2" />; // or maybe flip it visually
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
            onClick={() => handleSort('priority')}
            className={`rounded-full border-0 px-4 ${sortConfig.key === 'priority' ? 'bg-[#92dc49] hover:bg-[#7ab635] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Prioridade
            {getSortIcon('priority')}
          </Button>

          <Button
            onClick={() => handleSort('value')}
            className={`rounded-full border-0 px-4 ${sortConfig.key === 'value' ? 'bg-[#92dc49] hover:bg-[#7ab635] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Valor
            {getSortIcon('value')}
          </Button>

          <Button
            onClick={() => handleSort('date')}
            className={`rounded-full border-0 px-4 ${sortConfig.key === 'date' ? 'bg-[#92dc49] hover:bg-[#7ab635] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Data
            {getSortIcon('date')}
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
          <PipelineBoard sortConfig={sortConfig} onCardClick={handleCardClick} />
        </div>
      </div>
    </Layout>
  );
}
