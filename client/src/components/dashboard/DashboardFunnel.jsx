import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const stageLabels = [
    { key: "1. Cadastro", label: "Cadastro" },
    { key: "2. Análise Técnica", label: "Tecnica" },
    { key: "3. Análise de Crédito", label: "Credito" },
    { key: "4. Análise de Garantias", label: "Garantias" },
    { key: "5. Formalização", label: "Formalizacao" },
    { key: "6. Contratado", label: "Contrato" },
];

const colors = ["#92dc49", "#86c93f", "#7ab635", "#6ea32b", "#629021", "#567d1d"];

export function DashboardFunnel() {
    const { data: stats, isLoading } = useQuery({ queryKey: ["/api/dashboard/stats"] });

    if (isLoading) {
        return (
            <Card className="p-6 h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </Card>
        );
    }

    const byStage = stats?.byStage || {};

    const funnelData = stageLabels.map((s, i) => ({
        stage: s.label,
        value: byStage[s.key] || 0,
        color: colors[i] || "#567d1d",
    }));

    const maxValue = Math.max(...funnelData.map(d => d.value), 1);

    return (
        <Card className="p-6 h-full flex flex-col" data-testid="dashboard-funnel">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h3 className="text-lg font-semibold">Funil</h3>
                    <p className="text-sm text-gray-500">Etapa</p>
                </div>
                <span className="text-sm text-gray-500">Quantidade</span>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3">
                {funnelData.map((item, index) => {
                    const isSmall = item.value < 1;
                    const barWidth = isSmall ? '4px' : `${(item.value / maxValue) * 100}%`;

                    return (
                        <div key={index} className="flex items-center">
                            <div className="w-24 text-sm text-gray-500 font-medium shrink-0">
                                {item.stage}
                            </div>

                            <div className="flex-1 flex justify-center">
                                <div
                                    className="relative flex items-center justify-center rounded-[4px] shadow-sm transition-all duration-500 h-8"
                                    style={{
                                        width: barWidth,
                                        backgroundColor: item.color,
                                        minWidth: isSmall ? '6px' : 'auto'
                                    }}
                                >
                                    {isSmall ? (
                                        <span className="absolute left-full ml-2 text-xs font-bold text-gray-700 whitespace-nowrap">
                                            {item.value}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-white drop-shadow-sm">
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
