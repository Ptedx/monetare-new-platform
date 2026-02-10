import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Download, Loader2 } from "lucide-react";

// Translation map for audit actions
const actionTranslations = {
  user_registered: "Registro de Usuário",
  proposal_created: "Proposta Criada",
  proposal_updated: "Proposta Atualizada",
  credit_analysis_created: "Análise de Crédito",
  message_sent: "Mensagem Enviada",
  document_uploaded: "Documento Enviado",
};

function translateAction(action) {
  return actionTranslations[action] || action;
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function Historico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Determine days param based on dateFilter
  const daysParam = dateFilter === "all" ? null : 
                    dateFilter === "30" ? 30 :
                    dateFilter === "90" ? 90 :
                    dateFilter === "365" ? 365 : null;

  // Fetch audit trail data
  const { data: auditEntries = [], isLoading } = useQuery({
    queryKey: ["/api/audit-trail", daysParam],
    queryFn: async () => {
      const url = new URL("/api/audit-trail", window.location.origin);
      if (daysParam) {
        url.searchParams.append("days", String(daysParam));
      }
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch audit trail");
      return response.json();
    },
  });

  // Client-side filtering and pagination
  const filteredEntries = useMemo(() => {
    return auditEntries.filter(item => {
      const matchesSearch = 
        translateAction(item.action).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [auditEntries, searchTerm]);

  // Pagination state
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Histórico</h1>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Buscar por ação ou detalhes..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                data-testid="input-search-audit"
              />
            </div>
            <Select value={dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger className="w-[150px]" data-testid="select-date-filter">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo Período</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-12" data-testid="loader-audit-trail">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : paginatedEntries.length === 0 ? (
            <div className="flex items-center justify-center p-12" data-testid="text-no-records">
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">Ação</th>
                  <th className="text-left p-4 font-medium text-gray-600">Entidade</th>
                  <th className="text-left p-4 font-medium text-gray-600">Detalhes</th>
                  <th className="text-left p-4 font-medium text-gray-600">Data</th>
                  <th className="text-left p-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors" data-testid={`row-audit-${item.id}`}>
                    <td className="p-4 font-mono text-sm">{item.id}</td>
                    <td className="p-4 font-medium">{translateAction(item.action)}</td>
                    <td className="p-4 text-gray-600">{item.entityType || "-"}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">{item.details || "-"}</td>
                    <td className="p-4 text-gray-500">{formatDate(item.createdAt)}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" data-testid={`button-view-${item.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {filteredEntries.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500" data-testid="text-results-count">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredEntries.length)} de {filteredEntries.length} resultados
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                data-testid="button-prev-page"
              >
                Anterior
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? "bg-[#92dc49] text-white border-none" : ""}
                  data-testid={`button-page-${page}`}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                data-testid="button-next-page"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
