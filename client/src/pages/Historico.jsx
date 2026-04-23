import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, XCircle, Clock, Trash2
} from "lucide-react";
import { getActivityLog, roleLabels, roleColor, logActivity } from "@/lib/activityLog";

function getStatusBadge(action) {
  if (action.includes("Aprovou") || action.includes("aprovada") || action.includes("enviou")) return { icon: CheckCircle, label: "Realizada", cls: "bg-green-100 text-green-700" };
  if (action.includes("Reprovou") || action.includes("Rejeitou")) return { icon: XCircle, label: action.includes("Reprov") ? "Reprovada" : "Rejeitada", cls: "bg-red-100 text-red-700" };
  return { icon: Clock, label: "Ação", cls: "bg-gray-100 text-gray-600" };
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function Historico() {
  const [, setLocation] = useLocation();
  const userRole = localStorage.getItem('userRole') || 'gerente';
  const [logs, setLogs] = useState(getActivityLog(userRole));
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const logsToShow = logs.filter(l => {
    const matchesSearch = !searchTerm ||
      (l.action || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.detail || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || l.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleClearLog = () => {
    if (!window.confirm("Limpar todo o histórico?")) return;
    localStorage.removeItem("siga:activityLog");
    setLogs([]);
  };

  return (
    <Layout>
      <div className="p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Histórico de Atividades</h1>
          {logsToShow.length > 0 && (
            <Button variant="outline" onClick={handleClearLog}>
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>

        {logsToShow.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">Nenhuma atividade registrada ainda.</p>
            <p className="text-gray-400 text-sm">As atividades aparecerão aqui conforme você usar a plataforma.</p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {logsToShow.map((log) => {
                const badge = getStatusBadge(log.action);
                const Icon = badge.icon;
                return (
                  <Card key={log.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleColor[log.role] || 'bg-gray-100 text-gray-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      {log.detail && <p className="text-xs text-gray-500 truncate">{log.detail}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${roleColor[log.role] || 'bg-gray-100 text-gray-700'}`}>
                        {roleLabels[log.role] || log.role}
                      </span>
                      <span className="text-xs text-gray-400 w-28 text-right">{formatTime(log.timestamp)}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <p className="text-sm text-gray-400 mt-4 text-right">
              {logsToShow.length} registros
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
