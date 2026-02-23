import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { RegulatoryDashboard } from "@/components/dashboard/RegulatoryDashboard";
import { AnalystDashboard } from "@/components/dashboard/AnalystDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";

export function Dashboard() {
  const { data: user, isLoading } = useQuery({ queryKey: ["/api/auth/me"] });
  const userRole = user?.role || 'gerente';

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]" data-testid="dashboard-loading">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {userRole === 'ambregulatorio' ? (
        <RegulatoryDashboard />
      ) : (
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold" data-testid="text-dashboard-title">Painel</h1>
            <Button variant="outline" className="rounded-full border-green-700 text-green-700 hover:bg-green-50" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {userRole === 'analista' ? <AnalystDashboard /> : <ManagerDashboard />}
        </div>
      )}
    </Layout>
  );
}
