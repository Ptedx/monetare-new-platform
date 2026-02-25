import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Leaf, Building2, Layers, Wallet } from "lucide-react";

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
        financeValue: 50000000,
        term: 60,
        gracePeriod: 12,
        rate: 4.5,
        line: "fno-agro",
        amortizationSystem: "sac"
    });

    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskCNPJ = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const unmask = (value) => value.replace(/\D/g, '');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMaskedChange = (field, value, maskFunction) => {
        const rawValue = unmask(value);

        if (field === "cpf" && rawValue.length > 11) return;
        if (field === "cnpj" && rawValue.length > 14) return;
        if (field === "cep" && rawValue.length > 8) return;

        const maskedValue = maskFunction(value);
        setFormData(prev => ({ ...prev, [field]: maskedValue }));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleCurrencyChange = (field, value) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '');

        // Limit to prevent overflow (approx 17 digits ~ 99 Trillion)
        if (digits.length > 17) return;

        if (digits === "") {
            handleChange(field, 0);
            return;
        }

        // Input is treated as cents
        const numberValue = Number(digits) / 100;
        handleChange(field, numberValue);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-[32px] font-medium text-gray-900 mb-6">Simulador</h1>
            <p className="text-gray-500 mb-8">Qual é o produto que melhor atende seu cliente?</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Agro */}
                <div
                    onClick={() => handleChange("type", "agro")}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col h-[120px] ${formData.type === "agro"
                        ? "border-[#8cc63f] bg-white ring-1 ring-[#8cc63f] shadow-sm"
                        : "border-gray-100 bg-white hover:border-[#8cc63f]/50 shadow-sm"
                        }`}
                >
                    <div className="w-full flex justify-end">
                        <Leaf className="w-6 h-6 text-[#8cc63f]" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-gray-900 mt-auto text-[16px]">Agro</span>
                </div>

                {/* Corporate */}
                <div
                    onClick={() => handleChange("type", "corporate")}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col h-[120px] ${formData.type === "corporate"
                        ? "border-[#8cc63f] bg-white ring-1 ring-[#8cc63f] shadow-sm"
                        : "border-gray-100 bg-white hover:border-[#8cc63f]/50 shadow-sm"
                        }`}
                >
                    <div className="w-full flex justify-end">
                        <Building2 className="w-6 h-6 text-[#8cc63f]" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-gray-900 mt-auto text-[16px]">Corporate</span>
                </div>

                {/* Middle market */}
                <div
                    onClick={() => handleChange("type", "middle_market")}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col h-[120px] ${formData.type === "middle_market"
                        ? "border-[#8cc63f] bg-white ring-1 ring-[#8cc63f] shadow-sm"
                        : "border-gray-100 bg-white hover:border-[#8cc63f]/50 shadow-sm"
                        }`}
                >
                    <div className="w-full flex justify-end">
                        <Layers className="w-6 h-6 text-[#8cc63f]" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-gray-900 mt-auto text-[16px]">Middle market</span>
                </div>

                {/* Varejo */}
                <div
                    onClick={() => handleChange("type", "varejo")}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col h-[120px] ${formData.type === "varejo"
                        ? "border-[#8cc63f] bg-white ring-1 ring-[#8cc63f] shadow-sm"
                        : "border-gray-100 bg-white hover:border-[#8cc63f]/50 shadow-sm"
                        }`}
                >
                    <div className="w-full flex justify-end">
                        <Wallet className="w-6 h-6 text-[#8cc63f]" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-gray-900 mt-auto text-[16px]">Varejo</span>
                </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Nome completo</Label>
                        <Input
                            placeholder="Escreva o nome do cliente..."
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={(e) => handleMaskedChange("cpf", e.target.value, maskCPF)}
                            maxLength={14}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Razão social da empresa</Label>
                        <Input
                            placeholder="Escreva o nome da empresa do cliente..."
                            value={formData.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CNPJ</Label>
                        <Input
                            placeholder="00.000.000/0000-00"
                            value={formData.cnpj}
                            onChange={(e) => handleMaskedChange("cnpj", e.target.value, maskCNPJ)}
                            maxLength={18}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>CEP da empresa</Label>
                        <Input
                            placeholder="00000-000"
                            value={formData.cep}
                            onChange={(e) => handleMaskedChange("cep", e.target.value, maskCEP)}
                            maxLength={9}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Estado da empresa</Label>
                        <Select value={formData.uf} onValueChange={(v) => handleChange("uf", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DF">DF</SelectItem>
                                <SelectItem value="MT">MT</SelectItem>
                                <SelectItem value="GO">GO</SelectItem>
                                <SelectItem value="SP">SP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Município da Empresa</Label>
                        <Input
                            placeholder="Cidade"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Bairro</Label>
                        <Input
                            placeholder="Bairro"
                            value={formData.neighborhood}
                            onChange={(e) => handleChange("neighborhood", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Endereço completo</Label>
                        <Input
                            placeholder="Rua, número, complemento"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-2">
                        <Label>Valor do projeto</Label>
                        <Input
                            type="text"
                            placeholder="R$ 0,00"
                            value={formatCurrency(formData.projectValue)}
                            onChange={(e) => handleCurrencyChange("projectValue", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Valor financiado</Label>
                        <Input
                            type="text"
                            placeholder="R$ 0,00"
                            className="bg-gray-100/50"
                            value={formatCurrency(formData.financeValue)}
                            onChange={(e) => handleCurrencyChange("financeValue", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <Button
                        onClick={() => onSubmit(formData)}
                        className="bg-[#92dc49] hover:bg-[#7ab635] px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        Simular Agora
                    </Button>
                </div>
            </div>
        </div>
    );
}
