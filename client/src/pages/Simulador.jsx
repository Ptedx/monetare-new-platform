import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SimulationForm } from "@/components/simulator/SimulationForm";
import { SimulationResult } from "@/components/simulator/SimulationResult";
import { api } from "@/services/api";

export function Simulador() {
  const [step, setStep] = useState("form");
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (formData) => {
    setLoading(true);
    try {
      const indexMap = {
        "Pré-fixado": "PRE_FIXADO",
        "PRE_FIXADO": "PRE_FIXADO",
        "IPCA": "IPCA",
        "CDI": "CDI",
        "IGPM": "IGPM",
        "SELIC": "SELIC",
      };
      const amortMap = {
        "price": "PRICE",
        "sac": "SAC",
        "PRICE": "PRICE",
        "SAC": "SAC",
      };

      const payload = {
        purpose: formData.purpose,
        financedValue: formData.financeValue,
        requestedValue: formData.projectValue,
        term: formData.term,
        gracePeriod: formData.gracePeriod,
        amortizationSystem: amortMap[formData.amortizationSystem] || "PRICE",
        correctionIndex: indexMap[formData.correctionIndex] || "PRE_FIXADO",
      };

      const data = await api.post("/api/proposals/simulate", payload);
      setApiResult(data);
      setStep("result");
    } catch (err) {
      console.error("Erro na simulação:", err);
      alert(err.message || "Erro ao calcular simulação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("form");
    setApiResult(null);
  };

  return (
    <Layout>
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-[#92dc49] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Calculando simulação...</p>
          </div>
        ) : step === "form" ? (
          <SimulationForm onSubmit={handleSimulate} initialData={apiResult ? {
            ...apiResult.formData,
            projectValue: apiResult.data?.valorFinanciado || 0,
            financeValue: apiResult.data?.valorFinanciado || 0,
          } : null} />
        ) : (
          <SimulationResult data={apiResult} onBack={handleBack} />
        )}
      </div>
    </Layout>
  );
}
