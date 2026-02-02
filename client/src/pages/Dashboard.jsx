import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { ProjectMap } from "@/components/dashboard/ProjectMap";
import { DashboardFunnel } from "@/components/dashboard/DashboardFunnel";
import { DashboardTables, AgencyHeatmap } from "@/components/dashboard/DashboardTables";
import { Calendar, Download, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Dashboard() {
  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Painel</h1>
          <Button variant="outline" className="rounded-full border-green-700 text-green-700 hover:bg-green-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <Button variant="outline" className="rounded-full bg-white border-none shadow-sm text-gray-600">
            Tipo de operação
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="rounded-full bg-white border-none shadow-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Dezembro/25
          </Button>

          <Badge variant="secondary" className="bg-[#d1f2b6] text-gray-700 hover:bg-[#bce69c] cursor-pointer px-3 py-1 rounded-full font-normal">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 display-inline-block"></span>
            Rural
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-gray-700 hover:bg-blue-200 cursor-pointer px-3 py-1 rounded-full font-normal">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 display-inline-block"></span>
            Corporate
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-gray-700 hover:bg-yellow-200 cursor-pointer px-3 py-1 rounded-full font-normal">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 display-inline-block"></span>
            Middle Market
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-gray-700 hover:bg-red-200 cursor-pointer px-3 py-1 rounded-full font-normal">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 display-inline-block"></span>
            Varejo
          </Badge>
        </div>

        {/* Content */}
        <DashboardKPIs />

        <ProjectMap />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DashboardFunnel />
          <DashboardTables />
        </div>

        <AgencyHeatmap />
      </div>
    </Layout>
  );
}
