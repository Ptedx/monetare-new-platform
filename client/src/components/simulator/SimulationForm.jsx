import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import {
    FNO_PRODUCTS, FNO_PURPOSES, FNO_RATES,
    getFNOAnnualRate
} from "@/config/fnoRates";

// Parse BRL currency string to number
function parseCurrency(str) {
    if (!str) return 0;
    return Number(String(str).replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
}

export function SimulationForm({ onSubmit, initialData }) {
    const [formData, setFormData] = useState(initialData || {
        type: "agro",
        name: "",
        cpf: "",
        companyName: "",
        cnpj: "",
        cep: "",
        uf: "",
        city: "",
        neighborhood: "",
        address: "",
        projectValue: 0,
        financeValue: 0,
        term: 0,
        gracePeriod: 0,
        rate: null,
        line: "fno-agro",
        amortizationSystem: "sac",
        purpose: "",
        correctionIndex: "Pré-fixado",
    });

    // Derive active FNO config
    const activePurpose = formData.purpose ? FNO_PURPOSES[formData.purpose] : null;
    const fnoRates = FNO_RATES.FNO_RURAL;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    // Clamp a number to min/max inclusive
    const clamp = (num, min, max) => {
        if (isNaN(num)) return min;
        if (num < min) return min;
        if (num > max) return max;
        return num;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCurrencyChange = (value) => {
        const digits = String(value).replace(/\D/g, '');
        if (digits.length > 17) return;
        if (digits === "") {
            setFormData(prev => ({ ...prev, projectValue: 0, financeValue: 0 }));
            return;
        }
        const numberValue = Number(digits) / 100;
        const maxFinanced = activePurpose
            ? numberValue * (activePurpose.maxFinancedPct / 100)
            : numberValue * 0.8;

        setFormData(prev => ({
            ...prev,
            projectValue: numberValue,
            financeValue: maxFinanced,
        }));
    };

    const handleFinanceValueChange = (value) => {
        const digits = String(value).replace(/\D/g, '');
        if (digits === "") {
            setFormData(prev => ({ ...prev, financeValue: 0 }));
            return;
        }
        const val = Number(digits) / 100;
        // Clamp to max financed % of project
        const maxVal = activePurpose
            ? formData.projectValue * (activePurpose.maxFinancedPct / 100)
            : formData.projectValue * 0.8;
        const clampedVal = clamp(val, 0, maxVal);

        setFormData(prev => ({ ...prev, financeValue: clampedVal }));
    };

    const handleTermChange = (value) => {
        const num = parseInt(String(value).replace(/\D/g, '')) || 0;
        const maxTerm = activePurpose?.maxTermMonths || 18;
        const clamped = clamp(num, 1, maxTerm);
        setFormData(prev => ({ ...prev, term: clamped }));
    };

    const handleGraceChange = (value) => {
        const num = parseInt(String(value).replace(/\D/g, '')) || 0;
        const maxGrace = activePurpose?.maxGraceMonths || 0;
        const clamped = clamp(num, 0, maxGrace);
        setFormData(prev => ({ ...prev, gracePeriod: clamped }));
    };

    const handlePurposeChange = (value) => {
        const purpose = FNO_PURPOSES[value];
        if (!purpose) return;

        // Reset term and grace to defaults when purpose changes
        setFormData(prev => ({
            ...prev,
            purpose: value,
            term: Math.min(prev.term || 0, purpose.maxTermMonths) || purpose.maxTermMonths / 6,
            gracePeriod: 0,
        }));
    };

    // Calculate displayed rate
    const displayRate = getFNOAnnualRate("FNO_RURAL", formData.correctionIndex, formData.purpose);
    const rateDisplay = () => {
        const lower = (formData.correctionIndex || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (lower === "cdi") return `CDI + ${(fnoRates.cdiSpread * 100).toFixed(1)}%`;
        if (lower === "ipca") return `IPCA + ${(fnoRates.ipcaSpread * 100).toFixed(1)}%`;
        return `${(displayRate * 100).toFixed(2)}% a.a.`;
    };

    const financePct = formData.projectValue > 0
        ? (formData.financeValue / formData.projectValue * 100)
        : 0;

    const canSubmit = formData.purpose && formData.projectValue > 0 && formData.financeValue > 0 && formData.term > 0;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-[32px] font-medium text-gray-900 mb-2">Simulador FNO</h1>
            <p className="text-gray-500 mb-8">
                Fundo Constitucional de Financiamento da Amazônia — Fundo de Desenvolvimento Regional
            </p>

            {/* Finalidade dropdown */}
            <div>
                <Label className="text-gray-700 font-medium text-sm mb-2 block">Finalidade do Crédito</Label>
                {!formData.purpose && (
                    <p className="text-[11px] text-amber-500 flex items-center gap-1 mb-2">
                        <AlertCircle className="w-3 h-3" /> Selecione para liberar os campos abaixo
                    </p>
                )}
                <Select value={formData.purpose} onValueChange={handlePurposeChange}>
                    <SelectTrigger className="bg-white border-gray-200 h-12 rounded-xl focus:ring-[#92dc49]/20 shadow-none">
                        <SelectValue placeholder="Selecione a finalidade..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(FNO_PURPOSES).map(purpose => (
                            <SelectItem key={purpose.id} value={purpose.id}>
                                {purpose.label} — até {purpose.maxTermMonths}m, carência {purpose.maxGraceMonths}m, {purpose.maxFinancedPct}% do projeto
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Taxas FNO */}
            {activePurpose && (
                <div className="mt-6 p-4 bg-[#f0f9e8] border border-[#92dc49]/30 rounded-xl flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#7ab635] shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Taxas FNO para {activePurpose.label}</p>
                        <div className="grid grid-cols-2 gap-x-6 text-[12px] text-gray-600 mt-0.5">
                            <span>Pré-fixada: <b>{(displayRate * 100).toFixed(2)}% a.a.</b></span>
                            <span>CDI + spread: <b>CDI + {(fnoRates.cdiSpread * 100).toFixed(1)}%</b></span>
                            <span>IPCA + spread: <b>IPCA + {(fnoRates.ipcaSpread * 100).toFixed(1)}%</b></span>
                            <span>Fee: <b>{(fnoRates.structuringFee * 100).toFixed(0)}%</b></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Correction index + Amortization */}
            <div className="grid grid-cols-2 gap-6 mt-6 mb-8">
                <div>
                    <Label className="text-gray-700 font-medium text-sm mb-2 block">Índice de correção</Label>
                    <Select value={formData.correctionIndex} onValueChange={(v) => handleChange("correctionIndex", v)}>
                        <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {["Pré-fixado", "IPCA", "CDI", "IGPM", "SELIC"].map(idx => (
                                <SelectItem key={idx} value={idx}>{idx}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-gray-700 font-medium text-sm mb-2 block">Sistema de amortização</Label>
                    <Select value={formData.amortizationSystem} onValueChange={(v) => handleChange("amortizationSystem", v)}>
                        <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {["sac", "price"].map(a => (
                                <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Valores */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Valor do projeto</Label>
                        <Input
                            type="text"
                            placeholder="R$ 0,00"
                            value={formatCurrency(formData.projectValue)}
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            disabled={!formData.purpose}
                            className="focus-visible:ring-[#92dc49]/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Valor financiado</Label>
                        <Input
                            type="text"
                            placeholder={activePurpose ? `Até ${activePurpose.maxFinancedPct}% do projeto` : "Selecione finalidade"}
                            value={formatCurrency(formData.financeValue)}
                            onChange={(e) => handleFinanceValueChange(e.target.value)}
                            disabled={!formData.purpose}
                            className="bg-gray-50/50 focus-visible:ring-0"
                        />
                    </div>
                </div>

                {/* Financed bar */}
                {formData.projectValue > 0 && activePurpose && (
                    <div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-[#92dc49] h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(financePct, 100)}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                            {financePct.toFixed(1)}% do valor do projeto (máx {activePurpose.maxFinancedPct}%)
                        </p>
                    </div>
                )}

                {/* Term + Grace */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                            Prazo (meses)
                            {activePurpose && (
                                <span className="text-[11px] text-gray-400 font-normal">— máx {activePurpose.maxTermMonths}m</span>
                            )}
                        </Label>
                        <Input
                            type="number"
                            min={1}
                            max={activePurpose?.maxTermMonths || 18}
                            placeholder={activePurpose ? `máx ${activePurpose.maxTermMonths}` : ""}
                            value={formData.term}
                            onChange={(e) => handleTermChange(e.target.value)}
                            disabled={!formData.purpose}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                            Carência (meses)
                            {activePurpose && (
                                <span className="text-[11px] text-gray-400 font-normal">— máx {activePurpose.maxGraceMonths}m</span>
                            )}
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            max={activePurpose?.maxGraceMonths || 0}
                            placeholder={activePurpose ? `máx ${activePurpose.maxGraceMonths}` : ""}
                            value={formData.gracePeriod}
                            onChange={(e) => handleGraceChange(e.target.value)}
                            disabled={!formData.purpose}
                        />
                    </div>
                </div>

                {/* Rate summary */}
                <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Taxa aplicada</p>
                        <p className="text-xl font-bold text-gray-900">{rateDisplay()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Fee de estruturação</p>
                        <p className="text-xl font-bold text-gray-900">{(fnoRates.structuringFee * 100).toFixed(1)}%</p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        {canSubmit ? (
                            <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Parâmetros válidos</>
                        ) : (
                            <><AlertCircle className="w-4 h-4 text-amber-500" /> Preencha todos os campos</>
                        )}
                    </div>
                    <Button
                        onClick={() => {
                            const rate = getFNOAnnualRate("FNO_RURAL", formData.correctionIndex, formData.purpose);
                            onSubmit({
                                ...formData,
                                rate: rate * 100,
                                purposeLabel: activePurpose?.label,
                            });
                        }}
                        disabled={!canSubmit}
                        className="bg-[#92dc49] hover:bg-[#7ab635] px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        Simular Agora
                    </Button>
                </div>
            </div>
        </div>
    );
}
