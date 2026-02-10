import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Clock, AlertCircle, Loader2 } from "lucide-react";

const formatCurrency = (value) => {
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function DashboardKPIs() {
    const { data: stats, isLoading } = useQuery({ queryKey: ["/api/dashboard/stats"] });

    const sparklineData = [
        { value: 40 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 }, { value: 80 }
    ];

    const totalProposals = stats?.totalProposals || 0;
    const totalProjectValue = stats?.totalProjectValue || 0;

    const byStage = stats?.byStage || {};
    const frozenCount = byStage["6. Contratado"] || 0;
    const activeCount = totalProposals - frozenCount;
    const onTimePercentValue = totalProposals > 0 ? Math.round((activeCount / totalProposals) * 100) : 0;
    const onTimePercent = activeCount;
    const frozenPercent = totalProposals > 0 ? Math.round((frozenCount / totalProposals) * 100) : 0;

    const onTimeData = [
        { name: "On Time", value: onTimePercentValue, color: "#92dc49" },
        { name: "Late", value: 100 - onTimePercentValue, color: "#e5e7eb" }
    ];

    const frozenData = [
        { name: "Frozen", value: frozenPercent, color: "#92dc49" },
        { name: "Active", value: 100 - frozenPercent, color: "#e5e7eb" }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-6 mb-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="p-6 h-24 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-6 mb-6">
            <Card className="p-6 relative overflow-hidden" data-testid="kpi-open-value">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Em aberto</p>
                        <h2 className="text-3xl font-bold">{formatCurrency(totalProjectValue)}</h2>
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-gray-400 text-xs ml-1">{totalProposals} processos</span>
                        </div>
                    </div>
                    <div className="h-[60px] w-[120px] absolute right-4 bottom-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Line type="monotone" dataKey="value" stroke="#7ab635" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Card>

            <Card className="p-6 flex items-center justify-between" data-testid="kpi-on-time">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Dentro do prazo</p>
                    <h2 className="text-4xl font-bold">{onTimePercentValue}%</h2>
                    <p className="text-xs text-gray-400 mt-1">{onTimePercent} processos</p>
                </div>
                <div className="h-[80px] w-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={onTimeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={35}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                {onTimeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-0 right-0 p-2">
                        <Clock className="w-4 h-4 text-[#92dc49]" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 flex items-center justify-between" data-testid="kpi-frozen">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Congelados</p>
                    <h2 className="text-4xl font-bold">{frozenPercent}%</h2>
                    <p className="text-xs text-gray-400 mt-1">{frozenCount}</p>
                </div>
                <div className="h-[80px] w-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={frozenData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={35}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                {frozenData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-0 right-0 p-2">
                        <AlertCircle className="w-4 h-4 text-[#92dc49]" />
                    </div>
                </div>
            </Card>
        </div>
    );
}
