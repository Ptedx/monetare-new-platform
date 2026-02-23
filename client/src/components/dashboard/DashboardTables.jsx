import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const getCellClass = (value) => {
    if (value >= 100) return "bg-[#3e5714] text-white";
    if (value >= 75) return "bg-[#4a6a18] text-white";
    if (value >= 60) return "bg-[#567d1d] text-white";
    if (value >= 40) return "bg-[#7ab635] text-white";
    if (value >= 20) return "bg-[#92dc49] text-gray-900";
    if (value > 5) return "bg-[#d1f2b6] text-gray-900";
    return "bg-white text-gray-500";
};

export function DashboardTables() {
    const { data: proposals, isLoading } = useQuery({ queryKey: ["/api/proposals"] });

    if (isLoading) {
        return (
            <Card className="p-6 h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </Card>
        );
    }

    const proposalsList = proposals || [];

    const alerts = proposalsList
        .slice(0, 5)
        .map(p => {
            const createdAt = p.createdAt ? new Date(p.createdAt) : null;
            const daysSinceCreation = createdAt ? Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)) : 0;
            let slaLabel = "-";
            if (p.status === 'Congelado') {
                slaLabel = "Congelado";
            } else if (daysSinceCreation > 30) {
                slaLabel = "Atrasado";
            } else {
                slaLabel = `${daysSinceCreation}d`;
            }
            return {
                proponent: p.name,
                stage: p.stage?.replace(/^\d+\.\s*/, '') || '-',
                sla: slaLabel,
            };
        });

    return (
        <Card className="p-6 h-full" data-testid="dashboard-alerts">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold">Alertas criticos</h3>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="w-full">
                <div className="grid grid-cols-12 px-4 mb-2 text-sm font-semibold text-gray-900 leading-none">
                    <div className="col-span-6">Proponente</div>
                    <div className="col-span-3">Etapa</div>
                    <div className="col-span-3">SLA</div>
                </div>

                <div className="space-y-2">
                    {alerts.length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-sm">
                            Nenhuma proposta encontrada.
                        </div>
                    )}
                    {alerts.map((alert, i) => (
                        <div key={i} className="grid grid-cols-12 items-center bg-gray-50/50 hover:bg-gray-100 rounded-lg py-3 px-4 transition-colors" data-testid={`alert-row-${i}`}>
                            <div className="col-span-6 font-medium text-gray-800 text-sm">
                                {alert.proponent}
                            </div>
                            <div className="col-span-3 text-sm text-gray-600">
                                {alert.stage}
                            </div>
                            <div className="col-span-3 text-sm">
                                <span className="font-semibold text-gray-700">{alert.sla}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

export function AgencyHeatmap() {
    const { data: stats, isLoading } = useQuery({ queryKey: ["/api/dashboard/stats"] });

    if (isLoading) {
        return (
            <Card className="p-6 mt-6 flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </Card>
        );
    }

    const byStage = stats?.byStage || {};
    const stageKeys = Object.keys(byStage);

    if (stageKeys.length === 0) {
        return (
            <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Filas por agencia</h3>
                <p className="text-sm text-gray-400 text-center py-4">Sem dados disponiveis.</p>
            </Card>
        );
    }

    const headers = stageKeys.map(k => k.replace(/^\d+\.\s*/, ''));

    return (
        <Card className="p-6 mt-6" data-testid="dashboard-heatmap">
            <h3 className="text-lg font-semibold mb-4">Filas por agencia</h3>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]"></TableHead>
                            {headers.map((h, i) => (
                                <TableHead key={i} className="text-center text-xs">{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableCell className="font-medium text-xs text-gray-600 py-1">Total</TableCell>
                            {stageKeys.map((k, i) => (
                                <TableCell key={i} className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(byStage[k] || 0)}`}>
                                    {byStage[k] || 0}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
