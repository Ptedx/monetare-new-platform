import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Clock, AlertCircle } from "lucide-react";

export function DashboardKPIs() {
    const openData = [
        { value: 6500000000 }
    ];

    /* Sparkline data */
    const sparklineData = [
        { value: 40 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 }, { value: 80 }
    ];

    const onTimeData = [
        { name: "On Time", value: 83, color: "#92dc49" },
        { name: "Late", value: 17, color: "#e5e7eb" }
    ];

    const frozenData = [
        { name: "Frozen", value: 19, color: "#92dc49" },
        { name: "Active", value: 81, color: "#e5e7eb" }
    ];

    return (
        <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Em aberto Card */}
            <Card className="p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Em aberto</p>
                        <h2 className="text-3xl font-bold">R$ 6.5B</h2>
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">+12%</span>
                            <span className="text-gray-400 text-xs ml-1">2.152 processos</span>
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

            {/* Dentro do prazo Card */}
            <Card className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Dentro do prazo</p>
                    <h2 className="text-4xl font-bold">83%</h2>
                    <p className="text-xs text-gray-400 mt-1">1.860 processos</p>
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

            {/* Congelados Card */}
            <Card className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Congelados</p>
                    <h2 className="text-4xl font-bold">19%</h2>
                    <p className="text-xs text-gray-400 mt-1">422</p>
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
