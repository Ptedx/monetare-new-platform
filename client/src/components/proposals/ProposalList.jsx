import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Filter, Search, ArrowUpDown, ArrowUpRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

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
  if (status === "ATRASO") return "text-red-500 font-bold";
  if (status === "REPROVADA" || status === "REJEITADA") return "text-red-500 font-bold";
  if (status === "OK") return "text-green-500 font-bold";
  if (status === "PENDENTE_COMITE") return "text-amber-600 font-bold";
  if (status === "EM_ANALISE_JURIDICA") return "text-blue-600 font-bold";
  if (status === "EM_SEGURO") return "text-green-600 font-bold";
  return "text-gray-500 font-bold";
};

const getStatusDotColor = (status) => {
  if (status === "ATRASO" || status === "REPROVADA" || status === "REJEITADA") return "bg-red-500";
  if (status === "PENDENTE_COMITE") return "bg-amber-500";
  if (status === "EM_ANALISE_JURIDICA" || status === "EM_SEGURO") return "bg-blue-500";
  return "bg-green-500";
};

export function ProposalList({ onSelectProposal, title, userRole }) {
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const [clientTab, setClientTab] = useState("Todos");
  const [juridicoProposals, setJuridicoProposals] = useState([]);
  const [, setLocation] = useLocation();

  // Read proposals directly from localStorage
  useEffect(() => {
    if (userRole === 'cliente') {
      const stored = localStorage.getItem("clientProposals");
      setProposals(stored ? JSON.parse(stored) : []);
    } else if (userRole === 'juridico') {
      const stored = JSON.parse(localStorage.getItem("proposals") || "[]");
      setJuridicoProposals(stored.filter(p => p.status === "EM_ANALISE_JURIDICA"));
    } else if (userRole === 'analista') {
      const stored = JSON.parse(localStorage.getItem("proposals") || "[]");
      // Same filter as PipelineBoard
      const skipStages = new Set([
        "EM_ANALISE_JURIDICA", "EM_SEGURO", "SEGURO_COTADO",
        "FINALIZADA", "REPROVADA", "APROVADA"
      ]);
      setProposals(stored.filter(p => !skipStages.has(p.stage)));
    } else {
      const stored = localStorage.getItem("proposals");
      setProposals(stored ? JSON.parse(stored) : []);
    }
  }, [userRole]);

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
  };

  const parseDate = (dateStr) => {
    const parts = dateStr.split('/');
    if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date(0) : d;
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("pt-BR");
  };

  // Map proposal data to client view
  const clientProposals = proposals.map((p) => {
    const statusBadge = p.statusBadge || (p.status === "ATIVA" ? "Em análise" : p.status || "Em aberto");
    const statusType = p.statusType || (p.status === "APROVADA" ? "success" : "neutral");
    const tab = p.tab || (p.status === "APROVADA" ? "Contratados" : "Em aberto");
    return { ...p, statusBadge, statusType, tab };
  });

  const filteredClientProposals = clientProposals.filter(p => clientTab === "Todos" || p.tab === clientTab);

  const filteredJuridico = juridicoProposals.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.hash || "").toLowerCase().includes(search.toLowerCase())
  );

  // ----- CLIENT VIEW -----
  if (userRole === 'cliente') {
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

        {proposals.length > 0 && (
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
        )}

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
                  <span className="text-xs text-gray-400 font-mono">{proposal.hash || `#${proposal.id}`}</span>
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
                  <span className="text-lg font-bold text-gray-900">{proposal.value || formatCurrency(proposal.requestedValue)}</span>
                  <span className="text-xs text-gray-400">{proposal.date || formatDate(proposal.createdAt)}</span>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-[#92dc49] transition-colors" />
              </div>
            </div>
          ))}
          {filteredClientProposals.length === 0 && (
            <div className="text-center py-10 text-gray-500 bg-white border border-gray-100 rounded-xl">
              {proposals.length === 0 ? "Nenhuma proposta cadastrada ainda. Clique em 'Nova proposta' para começar." : "Nenhuma proposta encontrada nesta categoria."}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----- JURIDICO VIEW -----
  if (userRole === 'juridico') {
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
                      <div className="inline-flex w-8 h-8 rounded-lg bg-gray-100 items-center justify-center transition-colors">
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
        </div>
      </div>
    );
  }

  // ----- DEFAULT VIEW (Analista, Gerente, etc.) -----
  const filteredProposals = proposals
    .filter(p => {
      const matchesSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.value || "").includes(search) ||
        (p.line || "").toLowerCase().includes(search.toLowerCase());
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
              {filteredProposals.length > 0 ? filteredProposals.map((proposal) => (
                <TableRow
                  key={proposal.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectProposal(proposal)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <span>{proposal.name}</span>
                      {proposal.score && <Badge className={`${getScoreColor(proposal.score)} text-white border-0`}>{proposal.score}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(proposal.status)}`}></div>
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
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {proposals.length === 0 ? "Nenhuma proposta cadastrada ainda." : "Nenhuma proposta encontrada."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
