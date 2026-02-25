import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Filter, Search, ArrowUpDown, ArrowUpRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

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

const clientMockProposals = [
  {
    id: 101,
    name: "Custeio Agro",
    hash: "id78f094vf",
    statusBadge: "⚠ 1 pendência",
    statusType: "error",
    value: "R$ 25.000",
    date: "15/11/2025",
    tab: "Em aberto"
  },
  {
    id: 102,
    name: "Investimento Agro",
    hash: "52fsddsE395",
    statusBadge: "Em análise de crédito",
    statusType: "neutral",
    value: "R$ 70.000",
    date: "15/11/2025",
    tab: "Em aberto"
  },
  {
    id: 103,
    name: "Investimento Agro",
    hash: "a8876h09ffersp",
    statusBadge: "Contratado",
    statusType: "success",
    value: "R$ 70.000",
    date: "13/02/2025",
    tab: "Contratados"
  }
];

const juridicoMockProposals = [
  {
    id: 201,
    name: "Victor Oliveira de Sá",
    hash: "lM3312f324",
    value: "50.250,34",
    statusBadge: "A ANALISAR",
    statusType: "neutral" // gray
  },
  {
    id: 202,
    name: "Sebastião de Souza",
    hash: "287posSrQ42",
    value: "50.250,34",
    statusBadge: "EM ASSINATURA",
    statusType: "warning" // yellow
  },
  {
    id: 203,
    name: "Paula Diniz",
    hash: "a8876h09ffersp",
    value: "75.000,00",
    statusBadge: "ASSINADO",
    statusType: "success" // green
  }
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

export function ProposalList({ onSelectProposal, title, userRole }) {
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first

  const [clientTab, setClientTab] = useState("Todos");
  const [clientProposals, setClientProposals] = useState([]);
  const [juridicoProposals, setJuridicoProposals] = useState([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (userRole === 'cliente') {
      const storedClient = localStorage.getItem("clientProposals");
      if (storedClient) {
        setClientProposals(JSON.parse(storedClient));
      } else {
        setClientProposals(clientMockProposals);
        localStorage.setItem("clientProposals", JSON.stringify(clientMockProposals));
      }
    } else if (userRole === 'juridico') {
      const storedJuridico = localStorage.getItem("juridicoProposals");
      if (storedJuridico) {
        setJuridicoProposals(JSON.parse(storedJuridico));
      } else {
        setJuridicoProposals(juridicoMockProposals);
        localStorage.setItem("juridicoProposals", JSON.stringify(juridicoMockProposals));
      }
    } else {
      const stored = localStorage.getItem("proposals");
      if (stored) {
        setProposals(JSON.parse(stored));
      } else {
        setProposals(initialMockProposals);
        localStorage.setItem("proposals", JSON.stringify(initialMockProposals));
      }
    }
  }, [userRole]);

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
  };

  // Parsing date "DD/MM/YYYY" for sorting
  const parseDate = (dateStr) => {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  // ----- CLIENT VIEW -----
  if (userRole === 'cliente') {
    const filteredClientProposals = clientProposals.filter(p => clientTab === "Todos" || p.tab === clientTab);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl text-gray-900">Suas propostas</h1>
          <Button
            className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full px-4 h-10 gap-2 font-medium"
            onClick={() => setLocation('/cadastro-proposta')}
          >
            <Plus className="w-4 h-4" /> Nova proposta
          </Button>
        </div>

        <div className="flex gap-2 mb-6 bg-white/50 p-1.5 rounded-xl border border-gray-100/50 w-fit">
          {["Todos", "Em aberto", "Contratados", "Finalizados"].map((tab) => (
            <button
              key={tab}
              onClick={() => setClientTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${clientTab === tab
                ? "bg-[#cceebd] text-gray-900 shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredClientProposals.map((proposal) => (
            <div
              key={proposal.id}
              onClick={() => onSelectProposal(proposal)}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:border-[#92dc49] hover:shadow-md transition-all group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{proposal.name}</span>
                  <span className="text-xs text-gray-400 font-mono">{proposal.hash}</span>
                </div>
                <div>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${proposal.statusType === 'error' ? 'bg-red-100 text-red-600' :
                    proposal.statusType === 'success' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                    {proposal.statusBadge}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-bold text-gray-900">{proposal.value}</span>
                  <span className="text-xs text-gray-400">{proposal.date}</span>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-[#92dc49] transition-colors" />
              </div>
            </div>
          ))}
          {filteredClientProposals.length === 0 && (
            <div className="text-center py-10 text-gray-500 bg-white border border-gray-100 rounded-xl">
              Nenhuma proposta encontrada nesta categoria.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----- JURIDICO VIEW -----
  if (userRole === 'juridico') {
    const filteredJuridico = juridicoProposals.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.hash.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="p-8 w-full max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl text-gray-900 mb-8">Caixa de Entrada</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50">
              <Search className="w-4 h-4 text-gray-600" />
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-b-gray-100">
                  <TableHead className="w-[30%] text-gray-500 font-medium">Cliente</TableHead>
                  <TableHead className="text-gray-500 font-medium">Proposta</TableHead>
                  <TableHead className="text-gray-500 font-medium">Valor (R$)</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-right text-gray-500 font-medium">Abrir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJuridico.map((proposal) => (
                  <TableRow
                    key={proposal.id}
                    className="cursor-pointer hover:bg-gray-50/80 border-b-gray-50"
                    onClick={() => onSelectProposal(proposal)}
                  >
                    <TableCell className="font-medium text-gray-900">{proposal.name}</TableCell>
                    <TableCell className="text-gray-600">{proposal.hash}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{proposal.value}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${proposal.statusType === 'neutral' ? 'bg-gray-200 text-gray-700' :
                          proposal.statusType === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                        {proposal.statusBadge}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex w-8 h-8 rounded-lg bg-gray-100 items-center justify-center group-hover:bg-[#cceebd] transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-gray-600" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredJuridico.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 bg-white">
                      Nenhuma proposta encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-2 mt-6 text-sm text-gray-500 items-center">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">&lt;&lt;</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">&lt;</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#92dc49] bg-[#f0f4f1] text-gray-900 font-bold">1</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">2</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">3</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">...</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">&gt;</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">&gt;&gt;</span>
          </div>
        </div>
      </div>
    );
  }

  // ----- DEFAULT VIEW -----
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
            <Select onValueChange={(val) => setSegmentFilter(val)}>
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

