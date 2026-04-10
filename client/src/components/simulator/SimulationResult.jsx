import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Maximize2, Minimize2, ArrowUp, TrendingUp, Percent, FileText, Download } from "lucide-react";
import { useLocation } from "wouter";

export function SimulationResult({ data, onBack }) {
    const [, setLocation] = useLocation();
    const d = data?.data || {};

    const formatCurrency = (value) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);

    // Download amortization table as CSV
    const downloadCSV = () => {
        if (!d.tabelaAmortizacao) return;
        const headers = ["Mês", "Parcela (R$)", "Juros (R$)", "Amortização (R$)", "Saldo Devedor (R$)"];
        const rows = d.tabelaAmortizacao.map(row => [
            row.mes,
            row.parcela.toFixed(2),
            row.juros.toFixed(2),
            row.amortizacao.toFixed(2),
            row.saldoDevedor.toFixed(2),
        ]);
        const csv = ["\ufeff" + [headers, ...rows].map(r => r.join(";")).join("\n")][0];
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `simulacao_fno_${d.modalidade || "resultado"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-[32px] font-medium text-gray-900 leading-tight">Resultados da Simulação</h1>
                        <p className="text-gray-500 text-sm mt-0.5">{d.sistema || "FNO"}</p>
                    </div>
                </div>
                <Button
                    className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full px-6"
                    onClick={() => setLocation("/cadastro-proposta")}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    Cadastrar Proposta
                </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <Badge variant="secondary" className="bg-[#e8f5e0] text-[#7ab635] border-[#92dc49] font-medium px-3 py-1.5 rounded-full">
                    {d.modalidade || ""}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 border border-gray-200 font-medium px-3 py-1.5 rounded-full">
                    {d.taxaJuros || ""}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 border border-gray-200 font-medium px-3 py-1.5 rounded-full">
                    {d.prazoTotal || 0} meses + {(d.carencia || 0)} meses carência
                </Badge>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <Card className="p-6 shadow-sm border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#e8f5e0] rounded-lg">
                            <TrendingUp className="w-4 h-4 text-[#7ab635]" />
                        </div>
                    </div>
                    <p className="text-[13px] text-gray-500">Valor financiado</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(d.valorFinanciado)}
                    </p>
                </Card>

                <Card className="p-6 shadow-sm border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ArrowUp className="w-4 h-4 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-[13px] text-gray-500">Total pago</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(d.valorTotalPago)}
                    </p>
                </Card>

                <Card className="p-6 shadow-sm border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Percent className="w-4 h-4 text-amber-500" />
                        </div>
                    </div>
                    <p className="text-[13px] text-gray-500">Total de juros</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(d.totalJuros)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        {d.percentualFinanciado > 0 ? `${d.percentualFinanciado}%` : ""} do projeto
                    </p>
                </Card>

                <Card className="p-6 shadow-sm border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-[13px] text-gray-500">Primeira parcela</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(d.valorPrimeiraParcela)}
                    </p>
                </Card>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-3 gap-5 mb-8">
                <Card className="p-5 shadow-sm border-gray-100">
                    <p className="text-[13px] text-gray-500">Taxa mensal</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                        {d.taxaMensal ? `${d.taxaMensal.toFixed(4)}%` : "—"}
                    </p>
                </Card>
                <Card className="p-5 shadow-sm border-gray-100">
                    <p className="text-[13px] text-gray-500">Taxa anual</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                        {d.taxaAnual ? `${d.taxaAnual.toFixed(2)}% a.a.` : "—"}
                    </p>
                </Card>
                <Card className="p-5 shadow-sm border-gray-100">
                    <p className="text-[13px] text-gray-500">Prazo total</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                        {d.prazoTotal || 0} meses
                        {d.carencia > 0 && <span className="text-sm text-gray-400 ml-1">(+{d.carencia}m carência)</span>}
                    </p>
                </Card>
            </div>

            {/* Amortization table */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Simulação completa</h3>
                <Button
                    variant="outline"
                    className="rounded-full border-gray-200"
                    onClick={downloadCSV}
                >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar tabela
                </Button>
            </div>

            <div className="bg-[#2d3339] rounded-xl overflow-hidden shadow-lg">
                <div className="p-2 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                        <Minimize2 className="w-4 h-4" />
                    </Button>
                </div>
                <div className="max-h-[500px] overflow-auto">
                    <Table className="text-gray-300">
                        <TableHeader className="bg-[#1a1f24] sticky top-0">
                            <TableRow className="border-b-gray-700 hover:bg-transparent">
                                <TableHead className="text-white font-semibold">Mês</TableHead>
                                <TableHead className="text-white font-semibold">Parcela (R$)</TableHead>
                                <TableHead className="text-white font-semibold">Juros (R$)</TableHead>
                                <TableHead className="text-white font-semibold">Amortização (R$)</TableHead>
                                <TableHead className="text-white font-semibold">Saldo devedor (R$)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(d.tabelaAmortizacao || []).map((row) => (
                                <TableRow key={row.mes} className={`border-b-gray-700 hover:bg-white/5 ${
                                    row.mes <= (d.carencia || 0) ? "bg-amber-50/10" : ""
                                }`}>
                                    <TableCell>
                                        {String(row.mes).padStart(2, "0")}
                                        {row.mes <= (d.carencia || 0) && (
                                            <span className="block text-[10px] text-amber-400">carência</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatCurrency(row.parcela)}</TableCell>
                                    <TableCell>{formatCurrency(row.juros)}</TableCell>
                                    <TableCell>{formatCurrency(row.amortizacao)}</TableCell>
                                    <TableCell>{formatCurrency(row.saldoDevedor)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
