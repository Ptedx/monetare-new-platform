import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Filter, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialMockProposals = [
  {
    id: 1,
    name: "Fernando Fagundes",
    score: "AA",
    status: "ATRASO",
    segment: "Rural",
    stage: "3. Análise de Crédito",
    value: "R$ 270.000.000",
    date: "15/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 2,
    name: "Fazenda do Gigante",
    score: "A",
    status: "OK",
    segment: "Rural",
    stage: "3. Análise de Crédito",
    value: "R$ 270.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 3,
    name: "Faz Aurora",
    score: "B",
    status: "OK",
    segment: "Rural",
    stage: "2. Análise Técnica",
    value: "R$ 150.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 4,
    name: "Faz Ouro Preto",
    score: "A",
    status: "OK",
    segment: "Rural",
    stage: "3. Análise de Crédito",
    value: "R$ 270.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 5,
    name: "Faz Porto",
    score: "C",
    status: "OK",
    segment: "Rural",
    stage: "2. Análise Técnica",
    value: "R$ 150.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 6,
    name: "Fernando & CIA",
    score: "B",
    status: "OK",
    segment: "Corporate",
    stage: "3. Análise de Crédito",
    value: "R$ 270.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 7,
    name: "Faz Girassol",
    score: "A",
    status: "OK",
    segment: "Rural",
    stage: "2. Análise Técnica",
    value: "R$ 150.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
  {
    id: 8,
    name: "Faz Nova Jornada",
    score: "A",
    status: "OK",
    segment: "Rural",
    stage: "4. Análise de Garantias",
    value: "R$ 270.000.000",
    date: "17/11/2025",
    line: "FNO - Agro",
  },
];

const getScoreColor = (score) => {
  switch (score) {
    case "AA": return "bg-green-500 hover:bg-green-600";
    case "A": return "bg-green-400 hover:bg-green-500";
    case "B": return "bg-yellow-400 hover:bg-yellow-500";
    case "C": return "bg-orange-400 hover:bg-orange-500";
    default: return "bg-gray-400 hover:bg-gray-500";
  }
};

const getStatusColor = (status) => {
  return status === "ATRASO" ? "text-red-500 font-bold" : "text-green-500 font-bold";
};

export function ProposalList({ onSelectProposal, title }) {
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first

  useEffect(() => {
    const stored = localStorage.getItem("proposals");
    if (stored) {
      setProposals(JSON.parse(stored));
    } else {
      setProposals(initialMockProposals);
      localStorage.setItem("proposals", JSON.stringify(initialMockProposals));
    }
  }, []);

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
  };

  // Parsing date "DD/MM/YYYY" for sorting
  const parseDate = (dateStr) => {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  const filteredProposals = proposals
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.value.includes(search) ||
        p.line.toLowerCase().includes(search.toLowerCase());
      const matchesSegment = segmentFilter === 'all' || p.segment === segmentFilter;
      return matchesSearch && matchesSegment;
    })
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">{title || "Propostas aguardando análise"}</h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente, documento..."
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-48">
            <Select onValueChange={(val) => setSearch(val === 'all' ? '' : val)}>
              <SelectTrigger className="h-10 bg-transparent border-0 ring-0 focus:ring-0 text-gray-500 hover:text-gray-900 shadow-none px-0 gap-2 w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Segmento" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={handleSort} className="h-8 flex items-center gap-1 hover:bg-gray-100 px-2 -ml-2 text-gray-500 font-medium">
                    Data
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Linha de Crédito</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow
                  key={proposal.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectProposal(proposal)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <span>{proposal.name}</span>
                      <Badge className={`${getScoreColor(proposal.score)} text-white border-0`}>
                        {proposal.score}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${proposal.status === 'ATRASO' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className={getStatusColor(proposal.status)}>{proposal.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>{proposal.segment === 'Rural' ? '🌾' : '🏢'}</span>
                      {proposal.segment}
                    </div>
                  </TableCell>
                  <TableCell>{proposal.stage}</TableCell>
                  <TableCell>{proposal.value}</TableCell>
                  <TableCell>{proposal.date}</TableCell>
                  <TableCell>{proposal.line}</TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </TableCell>
                </TableRow>
              ))}
              {filteredProposals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nenhuma proposta encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 mt-4 text-sm text-gray-500">
          <span>&lt;&lt;</span>
          <span>&lt;</span>
          <span className="font-bold text-black">1</span>
          <span>2</span>
          <span>3</span>
          <span>&gt;</span>
          <span>&gt;&gt;</span>
        </div>
      </div>
    </div>
  );
}
