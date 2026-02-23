import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Filter, Search, ArrowUpDown, Loader2, Wheat, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
};

const getScoreColor = (score) => {
  switch (score) {
    case "AA": return "bg-green-500";
    case "A": return "bg-green-400";
    case "B": return "bg-yellow-400";
    case "C": return "bg-orange-400";
    default: return "bg-gray-400";
  }
};

const getStatusColor = (status) => {
  if (!status) return "text-gray-500 font-bold";
  return status === "ATRASO" ? "text-red-500 font-bold" : "text-green-500 font-bold";
};

export function ProposalList({ onSelectProposal, title, userRole }) {
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const proposals = (rawProposals || []).map(mapProposalToRow);

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
  };

  const filteredProposals = proposals
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.value.includes(search) ||
        p.line.toLowerCase().includes(search.toLowerCase());
      const matchesSegment = segmentFilter === 'all' || p.segment === segmentFilter;

      // Client Filter: Only show proposals where name includes "Fernando" (Mocking own proposals)
      const matchesClient = userRole === 'cliente' ? p.name.includes('Fernando') : true;

      return matchesSearch && matchesSegment && matchesClient;
    })
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.dateRaw - b.dateRaw : b.dateRaw - a.dateRaw;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="proposals-loading">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6" data-testid="text-proposals-title">{title || "Propostas aguardando analise"}</h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente, documento..."
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>

          <div className="w-48">
            <Select onValueChange={(val) => { setSegmentFilter(val); if (val === 'all') setSearch(''); }}>
              <SelectTrigger className="h-10 bg-transparent border-0 ring-0 focus:ring-0 text-gray-500 hover:text-gray-900 shadow-none px-0 gap-2 w-auto" data-testid="select-segment-filter">
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
                  <Button variant="ghost" onClick={handleSort} className="h-8 flex items-center gap-1 hover:bg-gray-100 px-2 -ml-2 text-gray-500 font-medium" data-testid="button-sort-date">
                    Data
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Linha de Credito</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow
                  key={proposal.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectProposal(proposal)}
                  data-testid={`row-proposal-${proposal.id}`}
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
                      {proposal.segment === 'Rural' ? (
                        <Wheat className="w-4 h-4 text-green-600" />
                      ) : (
                        <Building2 className="w-4 h-4 text-blue-600" />
                      )}
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500" data-testid="text-no-proposals">
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
