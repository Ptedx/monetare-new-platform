import { Layout } from "@/components/layout/Layout";
import { FNO_PRODUCTS, FNO_PURPOSES, FNO_RATES, getFNOAnnualRate, MARKET_BASE_RATES } from "@/config/fnoRates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowRight, Shield, TrendingUp, Clock, Percent, Leaf, Building2, Factory } from "lucide-react";

const productIcons = {
    FNO_RURAL: <Leaf className="w-6 h-6 text-[#7ab635]" />,
    FNO_ENTERPRISE: <Building2 className="w-6 h-6 text-[#7ab635]" />,
    FNO_INFRASTRUCTURE: <Factory className="w-6 h-6 text-[#7ab635]" />,
    AGRO_CUSTEIO: <Leaf className="w-6 h-6 text-amber-500" />,
};

const productColors = {
    FNO_RURAL: "border-[#92dc49]/30",
    FNO_ENTERPRISE: "border-blue-200",
    FNO_INFRASTRUCTURE: "border-purple-200",
    AGRO_CUSTEIO: "border-amber-200",
};

export function Produtos() {
    const [, setLocation] = useLocation();

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[32px] font-medium text-gray-900">Produtos FNO</h1>
                        <p className="text-gray-500 mt-1">
                            Fundo Constitucional de Financiamento da Amazônia
                        </p>
                    </div>
                    <button
                        className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full px-6 h-10 flex items-center gap-2 font-medium"
                        onClick={() => setLocation("/cadastro-proposta")}
                    >
                        Cadastrar proposta <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Product cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Object.values(FNO_PRODUCTS).map((product) => {
                        const rate = getFNOAnnualRate(product.id, "Pré-fixado", "INVESTIMENTO");
                        const rates = FNO_RATES[product.id];
                        return (
                            <Card
                                key={product.id}
                                className={`border ${productColors[product.id]} hover:shadow-md transition-shadow`}
                            >
                                <CardContent className="p-6 space-y-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#f0f9e8] rounded-xl">
                                                {productIcons[product.id]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{product.label}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{product.segment}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1.5 text-[#7ab635] mb-1">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-[11px] text-gray-500">Taxa pré-fixada</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {(rate * 100).toFixed(2)}% a.a.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1.5 text-blue-500 mb-1">
                                                <Percent className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-[11px] text-gray-500">Limite máximo</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {product.maxProjectValue >= 1_000_000
                                                    ? `R$ ${(product.maxProjectValue / 1_000_000).toFixed(0)}M`
                                                    : `R$ ${product.maxProjectValue.toLocaleString("pt-BR")}`}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                                                <Clock className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-[11px] text-gray-500">Amortização</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {product.allowedAmortization.join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Finalidades */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Finalidades disponíveis</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.values(FNO_PURPOSES)
                                                .filter((p) => p.allowedProducts.includes(product.id))
                                                .map((p) => (
                                                    <Badge
                                                        key={p.id}
                                                        variant="secondary"
                                                        className="bg-[#f0f9e8] text-[#7ab635] border-[#92dc49]/30 text-[11px] font-medium"
                                                    >
                                                        {p.label}
                                                    </Badge>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Rate details */}
                                    <details className="text-sm">
                                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700 text-xs font-medium">
                                            Detalhar taxas →
                                        </summary>
                                        <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] text-gray-600 bg-gray-50 rounded-xl p-4">
                                            <div>
                                                <span className="text-gray-400">CDI + spread</span>
                                                <p className="font-medium text-gray-900">
                                                    CDI {(rates.cdiSpread * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">IPCA + spread</span>
                                                <p className="font-medium text-gray-900">
                                                    IPCA {(rates.ipcaSpread * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Fee de estruturação</span>
                                                <p className="font-medium text-gray-900">
                                                    {(rates.structuringFee * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Registro fixo</span>
                                                <p className="font-medium text-gray-900">
                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(rates.fixedRegistrationFee)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">IOF/Tributos</span>
                                                <p className="font-medium text-gray-900">
                                                    {(rates.ioftPct * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Colateral</span>
                                                <p className="font-medium text-gray-900">
                                                    {(product.collateralAdvanceRate * 100).toFixed(0)}%
                                                </p>
                                            </div>
                                        </div>
                                    </details>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Reference rates */}
                <Card className="border-gray-100">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxas de referência do mercado</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">CDI</p>
                                <p className="text-lg font-bold text-gray-900">{(MARKET_BASE_RATES.CDI_Annual * 100).toFixed(1)}% a.a.</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">TLP</p>
                                <p className="text-lg font-bold text-gray-900">{(MARKET_BASE_RATES.TLP_Annual * 100).toFixed(1)}% a.a.</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Taxa Rural</p>
                                <p className="text-lg font-bold text-gray-900">{(MARKET_BASE_RATES.Rural_Annual * 100).toFixed(1)}% a.a.</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">PRONAF</p>
                                <p className="text-lg font-bold text-gray-900">{(MARKET_BASE_RATES.PRONAF_Annual * 100).toFixed(1)}% a.a.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
