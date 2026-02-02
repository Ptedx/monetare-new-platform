import { Card } from "@/components/ui/card";

const funnelData = [
    { stage: "Triagem", value: 1000, label: "1.000", color: "#92dc49" },
    { stage: "Técnica", value: 500, label: "500", color: "#86c93f" },
    { stage: "Crédito", value: 400, label: "100", color: "#7ab635" },
    { stage: "Garantias", value: 300, label: "50", color: "#6ea32b" },
    { stage: "Jurídico", value: 200, label: "20", color: "#629021" },
    { stage: "Contrato", value: 100, label: "10", color: "#567d1d" },
    { stage: "Registro", value: 50, label: "0,5", color: "#4a6a18" },
    { stage: "Desembolso", value: 10, label: "0,1", color: "#3e5714" },
];

export function DashboardFunnel() {
    const maxValue = 1000;

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h3 className="text-lg font-semibold">Funil</h3>
                    <p className="text-sm text-gray-500">Etapa</p>
                </div>
                <span className="text-sm text-gray-500">Volume (R$ milhões)</span>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3">
                {funnelData.map((item, index) => {
                    // Min width for visibility of very small values
                    const isSmall = item.value < 60;
                    const barWidth = isSmall ? '4px' : `${(item.value / maxValue) * 100}%`;
                    const barHeight = isSmall ? 'h-8' : 'h-8';

                    return (
                        <div key={index} className="flex items-center">
                            {/* Label */}
                            <div className="w-24 text-sm text-gray-500 font-medium shrink-0">
                                {item.stage}
                            </div>

                            {/* Bar Container (Centered) */}
                            <div className="flex-1 flex justify-center">
                                <div
                                    className={`relative flex items-center justify-center rounded-[4px] shadow-sm transition-all duration-500 ${barHeight}`}
                                    style={{
                                        width: barWidth,
                                        backgroundColor: item.color,
                                        minWidth: isSmall ? '6px' : 'auto'
                                    }}
                                >
                                    {/* Value Label */}
                                    {isSmall ? (
                                        <span className="absolute left-full ml-2 text-xs font-bold text-gray-700 whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-white drop-shadow-sm">
                                            {item.label}
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
