import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DesempenhoTab } from "./tabs/DesempenhoTab";
import { VisaoGeralTab } from "./tabs/VisaoGeralTab";
import { RelacionamentoTab } from "./tabs/RelacionamentoTab";
import { OperacionalTab } from "./tabs/OperacionalTab";
import { CanaisTab } from "./tabs/CanaisTab";
import { CobrancaTab } from "./tabs/CobrancaTab";
import { FinanceiroTab } from "./tabs/FinanceiroTab";

export function PresidentDashboard() {
    const [activeTab, setActiveTab] = useState("desempenho");

    const tabs = [
        { id: "desempenho", label: "Desempenho" },
        { id: "visao-geral", label: "Visão geral" },
        { id: "relacionamento", label: "Relacionamento" },
        { id: "operacional", label: "Operacional" },
        { id: "canais", label: "Canais" },
        { id: "cobranca", label: "Cobrança" },
        { id: "financeiro", label: "Financeiro" }
    ];

    return (
        <div className="p-8 bg-[#f5f5f5] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-[40px] font-medium text-gray-900">Dashboard</h1>
                <Button variant="outline" className="rounded-full border-transparent bg-white shadow-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                </Button>
            </div>

            {/* Selectors */}
            <div className="flex gap-3 mb-8">
                <div className="bg-white rounded-xl px-4 py-2 text-[13px] font-medium text-gray-700 w-auto flex items-center justify-between gap-3 cursor-pointer border border-gray-100 hover:bg-gray-50">
                    <span>Período</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="bg-white rounded-xl px-4 py-2 text-[13px] font-medium text-gray-700 w-auto flex items-center justify-between gap-3 cursor-pointer border border-gray-100 hover:bg-gray-50">
                    <span>Localidade</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-6 px-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-[14px] font-medium transition-colors relative ${activeTab === tab.id
                            ? "text-gray-900"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9cd649]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "desempenho" && <DesempenhoTab />}
                {activeTab === "visao-geral" && <VisaoGeralTab />}
                {activeTab === "relacionamento" && <RelacionamentoTab />}
                {activeTab === "operacional" && <OperacionalTab />}
                {activeTab === "canais" && <CanaisTab />}
                {activeTab === "cobranca" && <CobrancaTab />}
                {activeTab === "financeiro" && <FinanceiroTab />}
            </div>
        </div>
    );
}
