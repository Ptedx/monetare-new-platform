import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    FileText,
    History,
    Search,
    Download
} from "lucide-react";
import { RegulatoryEventDetail } from './RegulatoryEventDetail';

export function RegulatoryDashboard() {
    const [selectedEvent, setSelectedEvent] = useState(null);

    if (selectedEvent) {
        return <RegulatoryEventDetail onBack={() => setSelectedEvent(null)} />;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans w-full max-w-full overflow-hidden">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Monitoramento de Conformidade Regulatória</h1>

                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700 font-normal shadow-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        Período: Janeiro/2026
                    </Button>
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700 font-normal shadow-sm">
                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                        Órgão regulador: Todos
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-sm text-gray-500 mb-2">Total</p>
                    <p className="text-4xl font-bold text-gray-900">76</p>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-sm text-gray-500 mb-2">Em conformidade</p>
                    <p className="text-4xl font-bold text-gray-900">67</p>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-sm text-gray-500 mb-2">Pendentes</p>
                    <p className="text-4xl font-bold text-gray-900">1</p>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-red-100/50">
                    <p className="text-sm text-gray-600 mb-2">Não-conforme</p>
                    <p className="text-4xl font-bold text-gray-900">1</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* Main Table Section - Add min-w-0 to prevent grid blowout */}
                <div className="xl:col-span-2 space-y-6 min-w-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm overflow-hidden">
                        <h3 className="text-xl font-semibold text-gray-700 mb-6">Obrigações regulatórias</h3>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="text-xs text-gray-400 uppercase font-light border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 font-normal whitespace-nowrap px-2">Ente Regulador</th>
                                        <th className="py-3 font-normal whitespace-nowrap px-2">Obrigação</th>
                                        <th className="py-3 font-normal whitespace-nowrap px-2">Referência</th>
                                        <th className="py-3 font-normal whitespace-nowrap px-2">Arquivo</th>
                                        <th className="py-3 font-normal whitespace-nowrap px-2">Status</th>
                                        <th className="py-3 font-normal whitespace-nowrap px-2">Última atualização</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-gray-700">BCB</td>
                                            <td className="py-4 px-2 text-gray-600">SCR 3040</td>
                                            <td className="py-4 px-2 text-gray-600">Janeiro 2026</td>
                                            <td className="py-4 px-2 text-gray-500 max-w-[150px] truncate">scr3040_202601_basa.pdf</td>
                                            <td className="py-4 px-2">
                                                <div className="inline-flex items-center bg-[#92dc49]/20 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    REGULAR
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex items-center justify-between text-gray-500 gap-2">
                                                    <div>
                                                        <p className="text-xs whitespace-nowrap">Entregue em</p>
                                                        <p className="text-xs font-medium whitespace-nowrap">21/01/2026</p>
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" className="h-8 min-w-[32px] bg-gray-100 border-none font-bold">1</Button>
                            <Button variant="outline" size="sm" className="h-8 min-w-[32px] border-none text-gray-500">2</Button>
                            <Button variant="outline" size="sm" className="h-8 min-w-[32px] border-none text-gray-500">3</Button>
                            <span className="flex items-center text-gray-400">..</span>
                            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-xl p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">Histórico de submissões e logs</h3>
                        </div>

                        <div className="overflow-x-auto w-full pb-2">
                            <table className="w-full text-xs text-left min-w-[800px]">
                                <thead className="text-gray-400 font-light border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 font-normal min-w-[100px] px-2">Data/Hora</th>
                                        <th className="py-3 font-normal min-w-[120px] px-2">Ente regulador</th>
                                        <th className="py-3 font-normal min-w-[150px] px-2">Evento</th>
                                        <th className="py-3 font-normal min-w-[100px] px-2">Resultado</th>
                                        <th className="py-3 font-normal min-w-[120px] px-2">Correlation ID</th>
                                        <th className="py-3 font-normal px-2">Usuário</th>
                                        <th className="py-3 font-normal text-right px-2">Evidência</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-gray-600">
                                    <tr className="hover:bg-gray-50/50">
                                        <td className="py-3 px-2 align-top">
                                            <p className="font-bold text-gray-900">29/01/2026</p>
                                            <p className="text-gray-400">14:32</p>
                                        </td>
                                        <td className="py-3 px-2 align-top font-medium">Sudam / MIDR</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-500">fno.extract.generated</td>
                                        <td className="py-3 px-2 align-top">Arquivo criado</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-400">journey-850064</td>
                                        <td className="py-3 px-2 align-top">Sistema</td>
                                        <td className="py-3 px-2 align-top text-right">
                                            <div className="inline-flex items-center gap-2 group cursor-pointer justify-end">
                                                <span className="text-gray-500 group-hover:text-green-600 transition-colors">extrato.csv</span>
                                                <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50">
                                        <td className="py-3 px-2 align-top">
                                            <p className="font-bold text-gray-900">29/01/2026</p>
                                            <p className="text-gray-400">14:50</p>
                                        </td>
                                        <td className="py-3 px-2 align-top font-medium">Sudam / MIDR</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-500">fno.extract.validated</td>
                                        <td className="py-3 px-2 align-top">Divergência</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-400">journey-850064</td>
                                        <td className="py-3 px-2 align-top">Sistema</td>
                                        <td className="py-3 px-2 align-top text-right">
                                            <div className="inline-flex items-center gap-2 group cursor-pointer justify-end">
                                                <span className="text-gray-500 group-hover:text-green-600 transition-colors">extrato.csv</span>
                                                <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50">
                                        <td className="py-3 px-2 align-top">
                                            <p className="font-bold text-gray-900">29/01/2026</p>
                                            <p className="text-gray-400">15:10</p>
                                        </td>
                                        <td className="py-3 px-2 align-top font-medium">BACEN</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-500">scr3040.file.generated</td>
                                        <td className="py-3 px-2 align-top">SCR gerado</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-400">journey-850064</td>
                                        <td className="py-3 px-2 align-top">Sistema</td>
                                        <td className="py-3 px-2 align-top text-right">
                                            <div className="inline-flex items-center gap-2 group cursor-pointer justify-end">
                                                <span className="text-gray-500 group-hover:text-green-600 transition-colors">scr3040.xml</span>
                                                <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50">
                                        <td className="py-3 px-2 align-top">
                                            <p className="font-bold text-gray-900">29/01/2026</p>
                                            <p className="text-gray-400">14:22</p>
                                        </td>
                                        <td className="py-3 px-2 align-top font-medium">BACEN</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-500">status_changed</td>
                                        <td className="py-3 px-2 align-top">STA aceito</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-400">journey-850064</td>
                                        <td className="py-3 px-2 align-top">Sistema</td>
                                        <td className="py-3 px-2 align-top text-right">
                                            <div className="inline-flex items-center gap-2 group cursor-pointer justify-end">
                                                <span className="text-gray-500 group-hover:text-green-600 transition-colors">protocolo.pdf</span>
                                                <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50">
                                        <td className="py-3 px-2 align-top">
                                            <p className="font-bold text-gray-900">29/01/2026</p>
                                            <p className="text-gray-400">16:05</p>
                                        </td>
                                        <td className="py-3 px-2 align-top font-medium">Auditoria</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-500">evidence.generated</td>
                                        <td className="py-3 px-2 align-top">ZIP criado</td>
                                        <td className="py-3 px-2 align-top font-mono text-gray-400">journey-850064</td>
                                        <td className="py-3 px-2 align-top">Sistema</td>
                                        <td className="py-3 px-2 align-top text-right">
                                            <div className="inline-flex items-center gap-2 group cursor-pointer justify-end">
                                                <span className="text-gray-500 group-hover:text-green-600 transition-colors">evidence.zip</span>
                                                <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Section - Min-width 0 to prevent blowout */}
                <div className="space-y-6 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-600">Pendências / Divergências</h3>

                    {/* Card 1: Non-Conformity */}
                    <Card className="p-5 border border-red-100 shadow-sm bg-white space-y-4">
                        <div className="inline-flex items-center bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
                            Não-conforme
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Sudam / MIDR</p>
                            <p className="text-sm text-gray-500">Extrato FNO</p>
                        </div>
                        <p className="text-sm text-red-500 font-medium">Valor contratado não confere</p>
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-green-600 text-green-700 hover:bg-green-50 px-6"
                                onClick={() => setSelectedEvent(true)}
                            >
                                Revisar
                            </Button>
                        </div>
                    </Card>

                    {/* Card 2: Pendency */}
                    <Card className="p-5 border border-yellow-100 shadow-sm bg-white space-y-4">
                        <div className="inline-flex items-center bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></div>
                            Pendência
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">BCB</p>
                            <p className="text-sm text-gray-500">Balanço de Risco Global</p>
                        </div>
                        <p className="text-sm text-gray-500">Vencimento: 31/01/2026</p>
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-green-600 text-green-700 hover:bg-green-50 px-6"
                                onClick={() => setSelectedEvent(true)}
                            >
                                Ver
                            </Button>
                        </div>
                    </Card>

                    {/* Card 3: Pendency */}
                    <Card className="p-5 border border-yellow-100 shadow-sm bg-white space-y-4">
                        <div className="inline-flex items-center bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></div>
                            Pendência
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">BCB</p>
                            <p className="text-sm text-gray-500">Balanço de Risco Global</p>
                        </div>
                        <p className="text-sm text-gray-500">Vencimento: 02/02/2026</p>
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-green-600 text-green-700 hover:bg-green-50 px-6"
                                onClick={() => setSelectedEvent(true)}
                            >
                                Ver
                            </Button>
                        </div>
                    </Card>

                    {/* Card 4: Action */}
                    <Card className="p-5 border border-gray-100 shadow-sm bg-white space-y-4">
                        <div className="inline-flex items-center bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></div>
                            Pendência
                        </div>
                        <p className="font-bold text-gray-900">SUDAM</p>

                        <div className="flex gap-2 w-full pt-2">
                            <Button variant="outline" className="flex-1 rounded-full border-gray-300 text-gray-600 text-xs">
                                Ações <ChevronRight className="w-3 h-3 ml-1 rotate-90" />
                            </Button>
                            <Button
                                className="flex-1 rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold text-xs"
                                onClick={() => setSelectedEvent(true)}
                            >
                                Verificar pendências
                            </Button>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
