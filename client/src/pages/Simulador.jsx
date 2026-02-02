import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SimulationForm } from "@/components/simulator/SimulationForm";
import { SimulationResult } from "@/components/simulator/SimulationResult";

export function Simulador() {
  const [step, setStep] = useState("form"); // 'form' | 'result'
  const [simulationData, setSimulationData] = useState(null);

  const handleSimulate = (data) => {
    setSimulationData(data);
    setStep("result");
  };

  const handleBack = () => {
    setStep("form");
  };

  return (
    <Layout>
      <div className="p-8">
        {step === "form" ? (
          <SimulationForm onSubmit={handleSimulate} initialData={simulationData} />
        ) : (
          <SimulationResult data={simulationData} onBack={handleBack} />
        )}
      </div>
    </Layout>
  );
}
