import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RegulatoryDashboard } from "@/components/dashboard/RegulatoryDashboard";
import { AnalystDashboard } from "@/components/dashboard/AnalystDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";

export function Dashboard() {
  const userRole = localStorage.getItem('userRole') || 'gerente';

  return (
    <Layout>
      {userRole === 'ambregulatorio' ? (
        <RegulatoryDashboard />
      ) : (
        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Painel</h1>
            <Button variant="outline" className="rounded-full border-green-700 text-green-700 hover:bg-green-50">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Dynamic Content based on Role */}
          {userRole === 'analista' ? <AnalystDashboard /> : <ManagerDashboard />}
        </div>
      )}
    </Layout>
  );
}

