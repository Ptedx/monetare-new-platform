import React from "react";
import { Layout } from "@/components/layout/Layout";
import { ChevronRight, ArrowDownUp, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockPayments = [
    { id: 1, hash: 'a8876h09ffersp', tipo: "Crédito (1 de 420)", valor: "R$ 2.750", vencimento: "28/12/2025", status: "PAGO" },
    { id: 2, hash: 'a8876h09ffersp', tipo: "Crédito (2 de 420)", valor: "R$ 2.750", vencimento: "28/01/2026", status: "VENCIDO" },
    { id: 3, hash: 'a8876h09ffersp', tipo: "Seguro (2 de 420)", valor: "R$ 2.300", vencimento: "28/01/2026", status: "VENCIDO" },
    { id: 4, hash: 'a8876h09ffersp', tipo: "Crédito (3 de 420)", valor: "R$ 2.750", vencimento: "28/02/2026", status: "A VENCER" },
    { id: 5, hash: 'a8876h09ffersp', tipo: "Seguro (3 de 420)", valor: "R$ 2.300", vencimento: "28/02/2026", status: "A VENCER" },
    { id: 6, hash: 'a8876h09ffersp', tipo: "Crédito (4 de 420)", valor: "R$ 2.750", vencimento: "28/03/2026", status: "PREVISTO" },
    { id: 7, hash: 'a8876h09ffersp', tipo: "Seguro (4 de 420)", valor: "R$ 2.300", vencimento: "28/03/2026", status: "PREVISTO" },
    { id: 8, hash: 'a8876h09ffersp', tipo: "Crédito (5 de 420)", valor: "R$ 2.750", vencimento: "28/04/2026", status: "PREVISTO" },
    { id: 9, hash: 'a8876h09ffersp', tipo: "Seguro (5 de 420)", valor: "R$ 2.300", vencimento: "28/04/2026", status: "PREVISTO" },
    { id: 10, hash: 'a8876h09ffersp', tipo: "Crédito (6 de 420)", valor: "R$ 2.750", vencimento: "28/05/2026", status: "PREVISTO" },
    { id: 11, hash: 'a8876h09ffersp', tipo: "Seguro (6 de 420)", valor: "R$ 2.300", vencimento: "28/05/2026", status: "PREVISTO" },
    { id: 12, hash: 'a8876h09ffersp', tipo: "Crédito (7 de 420)", valor: "R$ 2.750", vencimento: "28/06/2026", status: "PREVISTO" },
    { id: 13, hash: 'a8876h09ffersp', tipo: "Seguro (7 de 420)", valor: "R$ 2.300", vencimento: "28/06/2026", status: "PREVISTO" },
];

const getBadgeStyle = (status) => {
    switch (status) {
        case 'OK': return 'bg-green-100 text-green-700';
        case 'VENCIDO': return 'bg-red-500 text-white';
        case 'A VENCER': return 'bg-[#fcba03] text-white'; // yellow typical alert
        case 'PAGO': return 'bg-green-100 text-green-700';
        case 'PREVISTO': return 'bg-gray-100 text-gray-400 border border-gray-200';
        default: return 'bg-gray-100 text-gray-600';
    }
};

export function Pagamentos() {
    return (
        <Layout>
            <div className="w-full text-gray-900 pb-10 fade-in duration-300">
                <h1 className="text-4xl font-semibold mb-8 text-gray-900">Cobranças</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 relative">
                        <span className="text-sm text-gray-500 mb-3 block">Saldo devedor total</span>
                        <span className="text-2xl font-bold text-gray-900">R$ 64.000,32</span>
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 relative">
                        <span className="text-sm text-gray-500 mb-3 block">Prestações</span>
                        <span className="text-2xl font-bold text-gray-900">324</span>
                    </div>
                    {/* Em atraso card with yellow border/accent */}
                    <div className="bg-[#fffdf7] border border-[#fce9b8] shadow-sm rounded-2xl p-6 relative">
                        <span className="text-sm text-gray-500 mb-3 block">Em atraso</span>
                        <span className="text-2xl font-bold text-gray-900">10</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Button variant="outline" className="gap-2 bg-gray-50/50 border-gray-200 text-gray-600">
                        <ArrowDownUp className="w-3 h-3" /> Em aberto <ChevronRight className="w-3 h-3 rotate-90" />
                    </Button>
                    <Button variant="outline" className="gap-2 bg-gray-50/50 border-gray-200 text-gray-600">
                        Proposta <ChevronRight className="w-3 h-3 rotate-90" />
                    </Button>
                    <Button variant="outline" className="gap-2 bg-gray-50/50 border-gray-200 text-gray-600">
                        Período de emissão <ChevronRight className="w-3 h-3 rotate-90" />
                    </Button>
                    <Button variant="outline" className="gap-2 bg-gray-50/50 border-gray-200 text-gray-600">
                        Período de vencimento <ChevronRight className="w-3 h-3 rotate-90" />
                    </Button>
                    <Button variant="outline" className="gap-2 bg-gray-50/50 border-gray-200 text-gray-600">
                        Status <ChevronRight className="w-3 h-3 rotate-90" />
                    </Button>

                    <Button variant="ghost" className="text-gray-500 hover:text-gray-900 ml-auto gap-2">
                        <Trash2 className="w-4 h-4" /> Limpar
                    </Button>
                </div>

                <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-sm font-medium text-gray-500 flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Proposta</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500"><div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Tipo</div></th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500"><div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Valor (R$)</div></th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500"><div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Vencimento</div></th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500"><div className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" /> Status</div></th>
                                <th className="py-4 px-6 text-right text-sm font-medium text-gray-500">Abrir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPayments.map(payment => (
                                <tr key={payment.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer group">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-700">{payment.hash}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{payment.tipo}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-800">{payment.valor}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{payment.vencimento}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getBadgeStyle(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="bg-gray-100 rounded p-1.5 w-7 h-7 inline-flex items-center justify-center group-hover:bg-[#92dc49] group-hover:text-white transition-colors ml-auto">
                                            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
