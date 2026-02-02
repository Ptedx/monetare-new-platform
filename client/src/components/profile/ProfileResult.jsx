import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileResult({ searchData, onBack }) {
    // Mock data - In a real app, this would come from an API based on searchData
    const mockAnalysis = {
        name: "Fernando Fagundes",
        document: searchData?.value || "000.000.000-00",
        sector: "Agronomia",
        employees: "500-1000 funcionários",
        score: "A",
        riskLevel: 0.5,
        limits: {
            current: 80000000,
            used: 50000000,
            available: 30000000
        },
        indicators: [
            { name: "Histórico de Pagamento", score: 95, status: "excellent" },
            { name: "Endividamento", score: 78, status: "good" },
            { name: "Receita Líquida", score: 88, status: "excellent" },
            { name: "Garantias Disponíveis", score: 92, status: "excellent" },
            { name: "Tempo de Relacionamento", score: 65, status: "regular" },
        ]
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h2 className="text-2xl font-bold">Resultado da Análise</h2>
            </div>

            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-semibold">{mockAnalysis.name}</h3>
                        <p className="text-gray-500">Documento: {mockAnalysis.document}</p>
                        <p className="text-gray-500">{mockAnalysis.sector} | {mockAnalysis.employees}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-4xl font-bold text-blue-600">{mockAnalysis.score}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Score de Crédito</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <p className="text-sm text-gray-500">Limite Atual</p>
                    <p className="text-xl font-bold">{formatCurrency(mockAnalysis.limits.current)}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-gray-500">Utilizado</p>
                    <p className="text-xl font-bold text-orange-600">{formatCurrency(mockAnalysis.limits.used)}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-gray-500">Disponível</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(mockAnalysis.limits.available)}</p>
                </Card>
            </div>

            <Card className="p-6">
                <h4 className="font-semibold mb-4">Indicadores de Análise</h4>
                <div className="space-y-4">
                    {mockAnalysis.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <span className="w-48 text-sm">{indicator.name}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${indicator.status === 'excellent' ? 'bg-green-500' :
                                            indicator.status === 'good' ? 'bg-blue-500' :
                                                'bg-orange-500'
                                        }`}
                                    style={{ width: `${indicator.score}%` }}
                                />
                            </div>
                            <span className="w-12 text-right font-medium">{indicator.score}%</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Cliente aprovado para novas operações</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                        Probabilidade de default: {mockAnalysis.riskLevel}%
                    </p>
                </div>
            </Card>
        </div>
    );
}
