import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download
} from "lucide-react";

const mockHistory = [
  { 
    id: "PROP-2024-001", 
    client: "Faz. Soledade", 
    value: "R$ 550.000.000", 
    status: "approved",
    date: "25/01/2024",
    analyst: "João Silva"
  },
  { 
    id: "PROP-2024-002", 
    client: "Fernando Fagundes", 
    value: "R$ 50.000.000", 
    status: "pending",
    date: "20/01/2024",
    analyst: "Maria Santos"
  },
  { 
    id: "PROP-2023-089", 
    client: "Faz. Aurora", 
    value: "R$ 250.000.000", 
    status: "approved",
    date: "28/11/2023",
    analyst: "Carlos Oliveira"
  },
  { 
    id: "PROP-2023-078", 
    client: "Vale do Cedro", 
    value: "R$ 70.000.000", 
    status: "rejected",
    date: "15/10/2023",
    analyst: "Ana Paula"
  },
  { 
    id: "PROP-2023-065", 
    client: "Faz. Girassol", 
    value: "R$ 100.000.000", 
    status: "approved",
    date: "10/09/2023",
    analyst: "João Silva"
  },
  { 
    id: "PROP-2023-042", 
    client: "Faz. Casa Branca", 
    value: "R$ 30.000.000", 
    status: "approved",
    date: "05/07/2023",
    analyst: "Maria Santos"
  },
];

function getStatusBadge(status) {
  switch(status) {
    case 'approved':
      return (
        <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm">
          <CheckCircle className="w-3 h-3" />
          Aprovada
        </span>
      );
    case 'rejected':
      return (
        <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full text-sm">
          <XCircle className="w-3 h-3" />
          Rejeitada
        </span>
      );
    case 'pending':
      return (
        <span className="flex items-center gap-1 text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-sm">
          <Clock className="w-3 h-3" />
          Em Análise
        </span>
      );
    default:
      return null;
  }
}

export function Historico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                placeholder="Buscar por cliente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="pending">Em Análise</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo Período</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">ID</th>
                <th className="text-left p-4 font-medium text-gray-600">Cliente</th>
                <th className="text-left p-4 font-medium text-gray-600">Valor</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Data</th>
                <th className="text-left p-4 font-medium text-gray-600">Analista</th>
                <th className="text-left p-4 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-sm">{item.id}</td>
                  <td className="p-4 font-medium">{item.client}</td>
                  <td className="p-4">{item.value}</td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4 text-gray-500">{item.date}</td>
                  <td className="p-4 text-gray-500">{item.analyst}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {filteredHistory.length} de {mockHistory.length} resultados
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-[#92dc49] text-white border-none">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
