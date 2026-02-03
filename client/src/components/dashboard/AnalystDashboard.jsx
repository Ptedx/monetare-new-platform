import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ANALYST_DATA = {
    sparkline: [
        { value: 40 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 }, { value: 80 }
    ],
    onTime: [
        { name: "On Time", value: 83, color: "#92dc49" },
        { name: "Late", value: 17, color: "#e5e7eb" }
    ],
    frozen: [
        { name: "Frozen", value: 19, color: "#92dc49" },
        { name: "Active", value: 81, color: "#e5e7eb" }
    ],
    segments: [
        { name: 'Varejo', value: 20, color: '#3f3f3f' },
        { name: 'Middle Market', value: 15, color: '#556b2f' },
        { name: 'Corporate', value: 30, color: '#6b8e23' },
        { name: 'Agro', value: 35, color: '#3CB371' },
    ],
    stages: [
        { name: "GEPEC", value: 62 },
        { name: "GECRE", value: 115 },
        { name: "CEOPE", value: 40 },
        { name: "GER", value: 78 },
        { name: "GERIS", value: 140 },
        { name: "CCONS", value: 115 },
        { name: "GEJUR", value: 70 },
        { name: "COGEC", value: 84 },
        { name: "DIREX", value: 118 },
    ],
    alerts: [
        { proponent: "Coop. Santa Luzia", rating: "AA", stage: "Crédito", sla: "80%" },
        { proponent: "Faz. Vale Verde", rating: "AA", stage: "Registro", sla: "*" },
        { proponent: "José da Silva", rating: "AA", stage: "Técnica", sla: "50%" },
        { proponent: "FFFagundes", rating: "AA", stage: "Crédito", sla: "50%" },
        { proponent: "Cereano", rating: "AA", stage: "Crédito", sla: "50%" },
    ]
};

export function AnalystDashboard() {
    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* A tratar */}
                <Card className="p-6 flex flex-col justify-center">
                    <p className="text-sm text-gray-500 mb-1">A tratar</p>
                    <h2 className="text-4xl font-bold">29</h2>
                </Card>

                {/* Em aberto */}
                <Card className="p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Em aberto</p>
                            <h2 className="text-3xl font-bold">R$ 2,27B</h2>
                            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">+52%</span>
                                <span className="text-gray-400 text-xs ml-1">240 processos</span>
                            </div>
                        </div>
                        <div className="h-[50px] w-[80px] absolute right-4 bottom-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ANALYST_DATA.sparkline}>
                                    <Line type="monotone" dataKey="value" stroke="#7ab635" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Dentro do prazo */}
                <Card className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Dentro do prazo</p>
                        <h2 className="text-4xl font-bold">83%</h2>
                        <p className="text-xs text-gray-400 mt-1">23 processos</p>
                    </div>
                    <div className="h-[70px] w-[70px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ANALYST_DATA.onTime}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={22}
                                    outerRadius={30}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {ANALYST_DATA.onTime.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Clock className="w-4 h-4 text-[#92dc49]" />
                        </div>
                    </div>
                </Card>

                {/* Congelados */}
                <Card className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Congelados</p>
                        <h2 className="text-4xl font-bold">19%</h2>
                        <p className="text-xs text-gray-400 mt-1">4 processos</p>
                    </div>
                    <div className="h-[70px] w-[70px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ANALYST_DATA.frozen}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={22}
                                    outerRadius={30}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {ANALYST_DATA.frozen.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <AlertCircle className="w-4 h-4 text-[#92dc49]" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribution Chart */}
                <Card className="p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-base font-medium">Distribuição por Segmento</CardTitle>
                    </CardHeader>
                    <div className="h-[250px] flex items-center">
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ANALYST_DATA.segments}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {ANALYST_DATA.segments.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-2">
                            {ANALYST_DATA.segments.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                                    <span>{entry.name}</span>
                                    {/* <span className="text-gray-400">({entry.value}%)</span> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Alerts Table */}
                <Card className="p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-base font-medium">Alertas críticos</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100">
                                    <th className="text-left font-normal pb-2">Proponente</th>
                                    <th className="text-left font-normal pb-2">Etapa</th>
                                    <th className="text-left font-normal pb-2">Etapa</th>
                                    <th className="text-left font-normal pb-2">SLA</th>
                                    <th className="pb-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ANALYST_DATA.alerts.map((alert, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="py-2.5">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-[#92dc49] text-black hover:bg-[#7ab635] rounded px-1.5 py-0 text-[10px] font-bold">
                                                    {alert.rating}
                                                </Badge>
                                                <span>{alert.proponent}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 text-gray-600">{alert.stage}</td>
                                        <td className="py-2.5 text-gray-600">{alert.stage}</td>
                                        <td className="py-2.5 text-gray-600">{alert.sla}</td>
                                        <td className="py-2.5 text-right">
                                            <ArrowUpRight className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Bottom Bar Chart */}
            <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-base font-medium">Filas por etapa</CardTitle>
                </CardHeader>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ANALYST_DATA.stages} barSize={40}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#666' }}
                                dy={10}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#d1f2b6"
                                radius={[4, 4, 0, 0]}
                                activeBar={{ fill: "#92dc49" }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
