import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Filter, Trash2, RotateCw } from "lucide-react";
import { useLocation, useParams } from "wouter";

const mockParcels = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    proposta: "a8876h09ffersp",
    prestacao: `${i + 1} de 420`,
    valor: "R$ 2.750",
    vencimento: `28/${((i + 11) % 12) + 1 < 10 ? '0' : ''}${((i + 11) % 12) + 1}/${2025 + Math.floor((i + 11) / 12)}`,
    status: i === 0 ? "PAGO" : i === 1 ? "VENCIDO" : i === 2 ? "A VENCER" : "PREVISTO"
}));

export function CobrancaDetail() {
    const [, setLocation] = useLocation();
    const params = useParams();
    const clientName = params?.id ? decodeURIComponent(params.id) : "Victor Oliveira de Sá";

    const getStatusBadge = (status) => {
        switch (status) {
            case 'A VENCER': return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none uppercase text-[10px] tracking-wider font-semibold">A VENCER</Badge>;
            case 'PREVISTO': return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-none uppercase text-[10px] tracking-wider font-semibold">PREVISTO</Badge>;
            case 'VENCIDO': return <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-none uppercase text-[10px] tracking-wider font-semibold">VENCIDO</Badge>;
            case 'PAGO': return <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-none uppercase text-[10px] tracking-wider font-semibold">PAGO</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-[1200px] mx-auto min-h-screen pb-20 bg-[#f8f9fa]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLocation('/cobranca')}
                            className="hover:bg-gray-200 p-2 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8 text-gray-800" />
                        </button>
                        <h1 className="text-3xl font-semibold text-gray-900">{clientName}</h1>
                    </div>

                    <Button className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-8 font-semibold shadow-lg shadow-green-100">
                        Renegociar
                    </Button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-sm text-gray-500 mb-2">Valor consolidado</p>
                        <h2 className="text-3xl font-bold text-gray-900">R$ 67.000</h2>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-sm text-gray-500 mb-2">Saldo devedor</p>
                        <h2 className="text-3xl font-bold text-gray-900">R$ 64.250</h2>
                    </Card>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between">
                        <p className="text-sm text-gray-500 mb-2">Quantidade quitada</p>
                        <h2 className="text-3xl font-bold text-gray-900">R$ 2.750</h2>
                    </Card>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6 items-center bg-gray-50 p-2 rounded-2xl w-max border border-gray-100">
                        <Button variant="ghost" className="bg-transparent text-gray-600 px-3 hover:bg-gray-200 rounded-xl h-9">
                            <Filter className="w-4 h-4 mr-2" />
                            Em aberto
                        </Button>

                        <Select>
                            <SelectTrigger className="w-[120px] bg-white border-transparent shadow-sm rounded-xl h-9">
                                <SelectValue placeholder="Proposta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[160px] bg-white border-transparent shadow-sm rounded-xl h-9">
                                <SelectValue placeholder="Período de emissão" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Qualquer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[180px] bg-white border-transparent shadow-sm rounded-xl h-9">
                                <SelectValue placeholder="Período de vencimento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Qualquer</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[100px] bg-white border-transparent shadow-sm rounded-xl h-9">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vencido">Vencido</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="w-px h-6 bg-gray-200 mx-2"></div>

                        <Button variant="ghost" className="text-gray-500 hover:text-gray-700 bg-white shadow-sm border border-transparent rounded-xl h-9">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpar
                        </Button>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[13px] text-gray-500 font-medium">
                                    <th className="pb-4 px-4 font-medium flex items-center gap-2">Proposta</th>
                                    <th className="pb-4 px-4 font-medium">Prestação</th>
                                    <th className="pb-4 px-4 font-medium">Valor (R$)</th>
                                    <th className="pb-4 px-4 font-medium">Vencimento</th>
                                    <th className="pb-4 px-4 font-medium">Status</th>
                                    <th className="pb-4 px-4 font-medium text-right text-transparent">Renegociar</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {mockParcels.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
                                        <td className="py-3.5 px-4 text-gray-600 font-medium">{item.proposta}</td>
                                        <td className="py-3.5 px-4 text-gray-900">{item.prestacao}</td>
                                        <td className="py-3.5 px-4 text-gray-900">{item.valor}</td>
                                        <td className="py-3.5 px-4 text-gray-600">{item.vencimento}</td>
                                        <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200 text-gray-500 ml-auto flex items-center justify-center">
                                                <RotateCw className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
