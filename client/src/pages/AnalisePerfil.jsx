import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProfileSearch } from "@/components/profile/ProfileSearch";
import { ProfileResult } from "@/components/profile/ProfileResult";
import { User } from "lucide-react";

export function AnalisePerfil() {
  const [step, setStep] = useState('search'); // 'search' | 'result'
  const [searchData, setSearchData] = useState(null);

  const handleAnalyze = (data) => {
    setSearchData(data);
    setStep('result');
  };

  const handleBack = () => {
    setStep('search');
    setSearchData(null);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Análise de Perfil</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {step === 'search' && (
            <>
              <div className="col-span-1">
                <ProfileSearch onAnalyze={handleAnalyze} />
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Digite um CPF ou CNPJ para iniciar a análise</p>
                </div>
              </div>
            </>
          )}

          {step === 'result' && (
            <div className="col-span-3"> {/* Result takes full width or you can keep it col-span-2 if you want sidebar logic */}
              <ProfileResult searchData={searchData} onBack={handleBack} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
