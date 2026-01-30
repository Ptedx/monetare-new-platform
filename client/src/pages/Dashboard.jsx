import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, FileText, Clock, CheckCircle } from "lucide-react";

const mockMetrics = [
  { label: "Total em Propostas", value: "R$ 2.165.000.000", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Propostas Ativas", value: "47", change: "+8", trend: "up", icon: FileText },
  { label: "Em Análise", value: "23", change: "-3", trend: "down", icon: Clock },
  { label: "Finalizadas (Mês)", value: "18", change: "+5", trend: "up", icon: CheckCircle },
];

const pipelineData = [
  { stage: "GEPEC", value: 585000000, proposals: 3, color: "#92dc49" },
  { stage: "GECRE", value: 350000000, proposals: 2, color: "#86c93f" },
  { stage: "GEOPE", value: 270000000, proposals: 1, color: "#7ab635" },
  { stage: "GERPF/PJ", value: 180000000, proposals: 2, color: "#6ea32b" },
  { stage: "GERIS", value: 780000000, proposals: 3, color: "#629021" },
];

const recentProposals = [
  { name: "Faz. Soledade", value: "R$ 550.000.000", analyst: "Ag. Brasília", status: "AA", days: 5 },
  { name: "Faz. Aurora", value: "R$ 250.000.000", analyst: "Ag. Brasília", status: "A", days: 8 },
  { name: "Fernando Fagundes", value: "R$ 50.000.000", analyst: "Ag. Brasília", status: "A", days: 16 },
  { name: "Vale do Cedro", value: "R$ 70.000.000", analyst: "Ag. Brasília", status: "C", days: 5 },
];

export function Dashboard() {
  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Select defaultValue="2024">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Agência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Agências</SelectItem>
                <SelectItem value="brasilia">Ag. Brasília</SelectItem>
                <SelectItem value="sp">Ag. São Paulo</SelectItem>
                <SelectItem value="rj">Ag. Rio de Janeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {mockMetrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className="w-8 h-8 text-[#92dc49]" />
                <span className={`text-sm flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pipeline por Etapa</h3>
            <div className="space-y-4">
              {pipelineData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-24 text-sm">{item.stage}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div 
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ 
                        width: `${(item.value / 780000000) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    >
                      <span className="text-xs text-white font-medium">{item.proposals}</span>
                    </div>
                  </div>
                  <span className="w-32 text-right text-sm font-medium">
                    R$ {(item.value / 1000000).toFixed(0)}M
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Propostas Recentes</h3>
            <div className="space-y-3">
              {recentProposals.map((proposal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{proposal.name}</p>
                    <p className="text-sm text-gray-500">{proposal.analyst}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{proposal.value}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        proposal.status === 'AA' ? 'bg-green-100 text-green-700' :
                        proposal.status === 'A' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>{proposal.status}</span>
                      <span className="text-xs text-gray-500">{proposal.days} dias</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
          <div className="h-64 flex items-end gap-4">
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((month, index) => {
              const height = [45, 62, 78, 55, 89, 95, 72, 68, 82, 91, 85, 76][index];
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-[#92dc49] rounded-t-lg transition-all hover:bg-[#7ab635]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">{month}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
