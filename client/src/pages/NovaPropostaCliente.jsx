import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Eye, 
  Upload, 
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  TrendingUp,
  Clock,
  CircleDollarSign,
  Info
} from "lucide-react";

// Helpers
const formatCurrency = (v) => {
  const digits = String(v).replace(/\D/g, "");
  if (!digits) return "";
  const amount = (parseFloat(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${amount}`;
};

export function NovaPropostaCliente() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    financial: {
      activityRevenue: "",
      harvestRevenue: "",
      propertyArea: "",
      productionCost: "",
      hasOwnProperty: false,
    },
    activity: {
      mainCulture: "Soja",
      secondaryCultures: "",
      plantedArea: "1400 ha",
      expectedProductivity: "1200 sc/ha",
      harvestBudget: "",
      revenueExpectation: "",
      hasSalesContract: "Não",
      municipality: "Santarém",
      state: "PA",
      carNumber: "",
    },
    guarantees: [
      { id: Date.now(), type: "Imóvel", ownership: "Meu nome", description: "Matrícula nº 1234", value: "60000000" },
    ],
    documents: [
      { id: 1, name: "RG / CNH (frente)", category: "pessoais", status: "idle" },
      { id: 2, name: "RG / CNH (verso)", category: "pessoais", status: "error", error: "O documento enviado está ilegível. Por favor, envie novamente." },
      { id: 3, name: "Comprovante de residência", category: "pessoais", status: "idle", subtitle: "Desritivo" },
      { id: 4, name: "Matrícula do imóvel rural", category: "rural", status: "done", fileName: "matricula_fazenda.pdf" },
      { id: 5, name: "CAR (Cadastro Ambiental Rural)", category: "rural", status: "idle" },
      { id: 6, name: "Projeto técnico", category: "rural", status: "idle" },
    ]
  });

  const updateFinancial = (f, v) => setFormData(p => ({ ...p, financial: { ...p.financial, [f]: v } }));
  const updateActivity = (f, v) => setFormData(p => ({ ...p, activity: { ...p.activity, [f]: v } }));

  const finalizeProposal = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || "João Branco de Souza Alves";
    
    const newProposal = {
      id: Date.now(),
      name: userName,
      score: "B",
      status: "OK",
      segment: "Rural",
      type: "Rural",
      stage: "1. CECAD",
      value: "R$ 250.000,00",
      rawValue: 250000,
      date: new Date().toLocaleDateString("pt-BR"),
      line: "FNO Custeio - Amazônia Rural",
      companyName: userName,
      createdAt: new Date().toISOString(),
      registrationData: {
        contactEmail: user.email || "joao.branco@email.com",
        contactPhone: user.phone || "(00) 0000-0000",
        city: formData.activity.municipality || "Santarém",
        uf: formData.activity.state || "PA",
      },
      documents: formData.documents
        .filter((d) => d.status === "done")
        .map((d) => ({
          name: d.name,
          fileName: d.fileName || "",
          uploadedAt: new Date().toISOString(),
        })),
    };

    // Save to managers/analysts list
    const all = JSON.parse(localStorage.getItem("proposals") || "[]");
    localStorage.setItem("proposals", JSON.stringify([newProposal, ...all]));

    // Sync to client proposals
    const clientAll = JSON.parse(localStorage.getItem("clientProposals") || "[]");
    clientAll.unshift({
      id: newProposal.id,
      name: newProposal.name,
      value: newProposal.value,
      date: newProposal.date,
      hash: `#${newProposal.id}`,
      statusBadge: "Em análise",
      statusType: "neutral",
      tab: "Em aberto",
    });
    localStorage.setItem("clientProposals", JSON.stringify(clientAll));
  };

  const handleNext = () => {
    if (step === 4) {
      setIsProcessing(true);
      return;
    }
    if (step < 8) {
      if (step === 7) {
        setIsLoading(true);
        finalizeProposal();
        setTimeout(() => {
          setIsLoading(false);
          setStep(prev => prev + 1);
        }, 1500);
      } else {
        setStep(prev => prev + 1);
      }
    } else {
      setLocation("/propostas");
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
    else setLocation("/propostas");
  };

  if (isProcessing) {
    return <ProcessingScreen onComplete={() => { setIsProcessing(false); setStep(5); }} />;
  }

  const currentSegment = step <= 3 ? 1 : step === 4 ? 2 : step >= 5 && step <= 7 ? 3 : 4;
  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <button onClick={handlePrev} className="flex items-center text-[10px] font-black text-gray-400 hover:text-gray-600 tracking-[0.2em] uppercase gap-1">
              <ChevronLeft className="w-4 h-4" /> {step >= 5 ? "FORMALIZAÇÃO" : step === 4 ? "DOCUMENTAÇÃO" : "SOLICITAÇÃO DE CRÉDITO"}
            </button>
            <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase transition-all">
              ETAPA {step >= 8 ? 6 : step >= 5 ? (step - 4) + 1 : step} de {step >= 5 ? 6 : 4}
            </span>
          </div>

          <div className="flex gap-2 mb-10 h-1.5 px-1">
            {[1, 2, 3].map((s) => {
              const filledSegments = step >= 8 ? 3 : step >= 7 ? 2 : step >= 5 ? 1 : step >= 3 ? 2 : 1;
              
              return (
                <div key={s} className={`flex-1 rounded-full transition-all duration-700 ${filledSegments >= s ? 'bg-[#92dc49]' : 'bg-gray-200'}`} />
              );
            })}
          </div>

          <Card className={`${(step === 5 || step === 8) ? 'bg-white' : 'bg-[#f2f4f2]'} border-none shadow-sm rounded-[32px] p-8 md:px-12 md:py-10 relative overflow-hidden transition-colors duration-500`}>
            <div className="min-h-[400px]">
              {step === 1 && <StepFinancial formData={formData} updateFinancial={updateFinancial} />}
              {step === 2 && <StepRuralActivity formData={formData} updateActivity={updateActivity} />}
              {step === 3 && <StepGuarantees formData={formData} setFormData={setFormData} />}
              {step === 4 && <StepDocs formData={formData} setFormData={setFormData} />}
              {step === 5 && <StepResult />}
              {step === 6 && <StepSummary formData={formData} />}
              {step === 7 && <StepChecks />}
              {step === 8 && <StepSuccess />}
            </div>

            {step < 8 && (
              <div className="flex justify-end items-center gap-4 mt-12 pt-8 border-t border-gray-100/50">
                {step === 5 && (
                  <Button variant="outline" className="rounded-full h-12 px-8 font-bold border-gray-200 text-gray-500 hover:bg-gray-50 bg-[#f8f9fa] shadow-sm">
                    Ajustar parâmetros da simulação
                  </Button>
                )}
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading} 
                  className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-full h-12 px-10 flex items-center gap-3 font-bold shadow-lg shadow-[#92dc49]/20 transition-all active:scale-95"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                      {step === 5 ? "Revisar e formalizar" : step === 6 ? "Confirmar" : step === 7 ? "Enviar pedido de proposta" : "Continuar"} 
                      {step !== 7 && <ChevronRight className="w-4 h-4" />}
                      {step === 7 && <TrendingUp className="w-4 h-4" />}
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function StepReview() {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-16">
      <div className="w-28 h-28 bg-[#92dc49]/10 rounded-full flex items-center justify-center text-[#92dc49] animate-bounce-subtle shadow-inner">
        <CheckCircle2 className="w-14 h-14" />
      </div>
      <div className="text-center space-y-3 max-w-md mx-auto">
        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">Tudo pronto!</h3>
        <p className="text-gray-400 text-xl font-medium leading-relaxed">Sua proposta foi formalizada e enviada para análise final. Em breve entraremos em contato.</p>
      </div>
    </div>
  );
}

// Sub-components as per screenshots
function StepSummary({ formData }) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Revise sua solicitação</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
        <SummarySection title="Dados pessoais">
          <SummaryField label="Tipo de pessoa" value="Pessoa física" />
          <SummaryField label="CPF" value="000.000.000-00" />
          <SummaryField label="Nome" value="João Branco de Souza Alves" />
          <SummaryField label="Data de nascimento" value="01/01/1992" />
          <SummaryField label="Telefone" value="(00) 0000-0000" />
          <SummaryField label="E-mail" value="joao.branco@email.com" />
          <SummaryField label="Ocupação" value="Produtor Rural — Agricultura" />
        </SummarySection>

        <SummarySection title="Endereço">
          <SummaryField label="CEP" value="00.000-000" />
          <SummaryField label="UF" value="PA" />
          <SummaryField label="Logradouro" value="Rua do Corvo, Zumbi do Pacheco" />
          <SummaryField label="Bairro" value="Rua do Corvo" />
          <SummaryField label="Cidade" value="Zumbi do Pacheco" />
          <SummaryField label="Número" value="14" />
        </SummarySection>

        <SummarySection title="Produção">
          <SummaryField label="Área total" value="2400 ha" />
          <SummaryField label="Área produtiva" value="1400 ha" />
          <SummaryField label="Faturamento mensal" value="R$ 270.000.000,00" />
        </SummarySection>

        <div className="col-span-full">
          <SummarySection title="Garantias">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryField label="Tipo" value="Equipamento" />
              <SummaryField label="Nome do ativo" value="Trator" />
              <SummaryField label="Valor do ativo" value="R$ 530.000,00" />
              
              <SummaryField label="Tipo" value="Equipamento" />
              <SummaryField label="Nome do ativo" value="Plantadeira" />
              <SummaryField label="Valor do ativo" value="R$ 530.000,00" />
            </div>
          </SummarySection>
        </div>

        <div className="col-span-full border-t border-gray-100 pt-10">
          <SummarySection title="Detalhes do crédito">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <SummaryField label="Linha de crédito" value="FNO Custeio" />
              <SummaryField label="CET" value="9,2% a.a." />
              <SummaryField label="Fonte" value="FNO (Fundo do Norte)" />
              <SummaryField label="Amortização" value="SAC" />
              <SummaryField label="Valor aprovado" value="R$ 250.000,00" />
              <SummaryField label="1ª parcela" value="R$ 8.819" />
              <SummaryField label="Prazo" value="36 meses" />
              <SummaryField label="Última parcela" value="R$ 6.961" />
              <SummaryField label="Carência" value="12 meses" />
              <SummaryField label="Total a pagar" value="R$ 281.430" />
              <SummaryField label="Taxa de juros" value="7,5% a.a." />
            </div>
          </SummarySection>
        </div>

        <div className="col-span-full border-t border-gray-100 pt-10">
          <SummarySection title="Documentos">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-gray-900">Documento 4 <span className="text-[10px] font-black text-gray-300 uppercase ml-1">PDF</span></p>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide">Modificado em 23/03/2026 15:00</p>
                  </div>
                </div>
                <div className="p-2 bg-[#f0f9eb] text-[#7ab635] rounded-xl cursor-not-allowed">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-gray-900">Documento 2 <span className="text-[10px] font-black text-gray-300 uppercase ml-1">PDF</span></p>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide">Modificado em 23/03/2026 15:00</p>
                  </div>
                </div>
                <div className="p-2 bg-[#f0f9eb] text-[#7ab635] rounded-xl cursor-not-allowed">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </SummarySection>
        </div>
      </div>
    </div>
  );
}

function SummarySection({ title, children }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase border-b border-gray-200 pb-2">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SummaryField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-[15px] font-bold text-gray-900 leading-tight">{value}</p>
    </div>
  );
}

function StepChecks() {
  const [checks, setChecks] = useState({
    veracity: true,
    bureau: false,
    orientative: false,
    siga: false
  });

  const items = [
    { id: 'veracity', title: 'Confirmo a veracidade das informações prestadas', desc: 'Declaro que todas as informações, documentos e dados fornecidos nesta jornada são verdadeiros e atualizados, sob pena das sanções legais aplicáveis.' },
    { id: 'bureau', title: 'Autorizo a análise de crédito completa', desc: 'Autorizo o BASA a realizar consultas junto ao SCR, Bacen e demais bureaus de crédito necessários para a análise desta proposta.' },
    { id: 'orientative', title: 'Ciente das condições orientativas', desc: 'Estou ciente de que os valores e condições apresentados na simulação são orientativos e podem ser ajustados após análise documental e jurídica completa.' },
    { id: 'siga', title: 'Autorizo o envio da documentação ao SIGA', desc: 'Autorizo o encaminhamento do meu dossiê para a esteira interna de análise de crédito do BASA (Sistema SIGA).' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex flex-col justify-center space-y-4 max-w-sm">
        <h2 className="text-[40px] font-bold text-gray-900 leading-tight tracking-tight">Formalização da solicitação</h2>
        <p className="text-gray-400 font-medium leading-relaxed">Ao clicar em \"Enviar pedido de proposta\", você formaliza sua intenção. O banco terá até 5 dias úteis para retornar com a proposta final de crédito.</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`p-6 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer ${checks[item.id] ? 'bg-white border-[#92dc49] shadow-lg shadow-[#92dc49]/5' : 'bg-white border-transparent hover:border-gray-100'}`}
            onClick={() => setChecks(p => ({ ...p, [item.id]: !p[item.id] }))}
          >
            <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${checks[item.id] ? 'bg-[#92dc49] border-[#92dc49] text-white' : 'border-gray-200'}`}>
              {checks[item.id] && <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div className="space-y-1">
              <p className={`font-bold transition-colors ${checks[item.id] ? 'text-gray-900' : 'text-gray-700'}`}>{item.title}</p>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepSuccess() {
  const [, setLocation] = useLocation();
  return (
    <div className="space-y-12 py-10 animate-in fade-in zoom-in duration-700 flex flex-col items-center text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-[#92dc49]/20 blur-3xl rounded-full scale-150" />
        <TrendingUp className="w-24 h-24 relative animate-bounce text-[#92dc49]" />
      </div>

      <div className="space-y-4 max-w-xl">
        <h2 className="text-[40px] font-bold text-gray-900 leading-tight tracking-tight">Pedido formalizado!</h2>
        <p className="text-gray-400 text-lg font-medium leading-relaxed">Seu pedido foi recebido e encaminhado para a esteira interna de análise. Você pode acompanhar o status em tempo real através do seu acesso.</p>
      </div>

      <div className="bg-[#fcfdfc] border-2 border-dashed border-gray-100 rounded-[32px] p-8 md:px-16 space-y-2 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#92dc49]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] relative">PROTOCOLO</p>
        <p className="text-2xl font-black text-[#7ab635] tracking-tight relative">BSA-2026-04-783421</p>
        <p className="text-[10px] font-bold text-gray-400 relative">Válido por 45 dias.</p>
      </div>

      <div className="w-full max-w-4xl space-y-10 pt-10">
        <p className="text-sm font-black text-gray-900 uppercase tracking-widest">O que acontece agora?</p>
        
        <div className="relative px-6">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full" />
          <div className="absolute left-6 w-[35%] top-1/2 -translate-y-1/2 h-1 bg-[#92dc49] rounded-full transition-all duration-1000" />
          
          <div className="relative flex justify-between">
            <SuccessTimelineItem status="complete" icon={<CheckCircle2 className="w-4 h-4" />} label="Pedido formalizado" date="20/01/2026 - 15:24" />
            <SuccessTimelineItem status="active" label="Análise" date="Em andamento..." />
            <SuccessTimelineItem status="pending" label="Contato do especialista" date="A iniciar" />
            <SuccessTimelineItem status="pending" label="Proposta definitiva" date="A iniciar" />
            <SuccessTimelineItem status="pending" label="Contratação e liberação" date="A iniciar" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-10">
        <Button variant="outline" className="rounded-full h-14 px-10 font-bold border-gray-200 text-gray-600 hover:bg-gray-50">Falar com especialista</Button>
        <Button onClick={() => setLocation("/propostas")} className="rounded-full h-14 px-12 bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold shadow-xl shadow-[#92dc49]/30 transition-all hover:scale-105 active:scale-95">Acompanhar solicitação</Button>
      </div>
    </div>
  );
}

function SuccessTimelineItem({ status, icon, label, date }) {
  return (
    <div className="flex flex-col items-center gap-4 relative z-10 w-32">
      <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-all duration-500 ${status === 'complete' ? 'bg-[#92dc49] text-white' : status === 'active' ? 'bg-white border-[#92dc49] text-[#92dc49] ring-4 ring-[#92dc49]/10' : 'bg-gray-100 text-gray-300'}`}>
        {icon || <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-[#92dc49] animate-pulse' : ''}`} />}
      </div>
      <div className="space-y-1 text-center">
        <p className={`text-[11px] font-bold ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'} leading-none`}>{label}</p>
        <p className="text-[9px] text-gray-400 font-medium whitespace-nowrap">{date}</p>
      </div>
    </div>
  );
}

function StepResult() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="space-y-2">
        <h2 className="text-[40px] font-bold text-gray-900 tracking-tight">Aqui está o resultado da sua simulação</h2>
        <p className="text-gray-400 text-lg font-medium">Esta é uma simulação orientativa e pode não refletir os valores após análise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 rounded-[24px] border-2 border-[#92dc49] bg-white overflow-hidden shadow-xl shadow-[#92dc49]/10">
        <div className="p-8 border-b md:border-b-0 md:border-r border-[#92dc49]/20 flex flex-col justify-center bg-[#fcfdfc]">
          <h3 className="text-2xl font-black text-gray-900 leading-tight">FNO Custeio<br />Agrícola</h3>
        </div>
        <div className="p-8 border-b md:border-b-0 md:border-r border-[#92dc49]/20 text-center space-y-1">
          <p className="text-[32px] font-black text-[#295b11]">250.000</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">Crédito pré-aprovado</p>
        </div>
        <div className="p-8 border-b md:border-b-0 md:border-r border-[#92dc49]/20 text-center flex flex-col justify-center items-center">
          <p className="text-[32px] font-black text-[#295b11] leading-none">9,2%</p>
          <p className="text-xl font-black text-[#295b11] mb-1">a.a.</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Custo Efetivo Total</p>
        </div>
        <div className="p-8 border-b md:border-b-0 md:border-r border-[#92dc49]/20 text-center space-y-1 flex flex-col justify-center items-center">
          <p className="text-[32px] font-black text-[#295b11]">36</p>
          <p className="text-xl font-black text-[#295b11] mb-1 leading-none">meses</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Prazo</p>
        </div>
        <div className="p-8 text-center bg-[#fcfdfc] flex flex-col justify-center items-center">
          <p className="text-[32px] font-black text-[#295b11]">R$ 7.743</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Parcela média</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
           <h4 className="font-bold text-gray-900">Detalhes da simulação</h4>
        </div>
        <div className="p-0">
          <DetailRow label="Linha de crédito" value="FNO Custeio" />
          <DetailRow label="Fonte" value="FNO (Fundo do Norte)" />
          <DetailRow label="Valor aprovado" value="R$ 250.000,00" />
          <DetailRow label="Prazo" value="36 meses" />
          <DetailRow label="Carência" value="12 meses" />
          <DetailRow label="Taxa de juros" value="7,5% a.a." />
          <DetailRow label="CET" value="9,2% a.a." />
          <DetailRow label="Amortização" value="SAC" />
          <DetailRow label="1ª parcela" value="R$ 8.819" />
          <DetailRow label="Última parcela" value="R$ 6.961" />
          <DetailRow label="Total a pagar" value="R$ 281.430" isLast />
        </div>
      </div>
    </div>
  );
}

function ProcessingScreen({ onComplete }) {
  const [stage, setStage] = useState(0);
  const stages = [
    "Validação cadastral",
    "Consulta ao bureau",
    "Cálculo de score",
    "Validação documental",
    "Enquadramento final"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-3xl w-full bg-[#f2f4f2] border-none shadow-sm rounded-[32px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-[40px] font-bold text-gray-900 leading-tight">Processando sua simulação...</h2>
          </div>
          <div className="flex-1 space-y-3 w-full">
            {stages.map((s, i) => (
              <div key={s} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${i <= stage ? 'bg-white shadow-sm' : 'bg-transparent opacity-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${i < stage ? 'bg-[#92dc49] text-white' : i === stage ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-200'}`}>
                  {i < stage ? <CheckCircle2 className="w-4 h-4" /> : i === stage ? <div className="w-2 h-2 rounded-full bg-white animate-ping" /> : null}
                </div>
                <span className={`font-bold transition-all ${i === stage ? 'text-gray-900 scale-105 origin-left' : 'text-gray-600'}`}>{s}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

function StepFinancial({ formData, updateFinancial }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Dados financeiros</h2>
        <p className="text-gray-400 text-lg font-medium">Precisamos de algumas informações financeiras da sua produção</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-bold text-gray-800">Receita da Atividade</Label>
          <div className="space-y-6">
            <InputField label="Receita por safra / ano" value={formatCurrency(formData.financial.harvestRevenue)} onChange={v => updateFinancial("harvestRevenue", v.replace(/\D/g, ""))} placeholder="R$ 0,00" />
            <InputField label="Custo de produção" value={formatCurrency(formData.financial.productionCost)} onChange={v => updateFinancial("productionCost", v.replace(/\D/g, ""))} placeholder="R$ 0,00" />
          </div>
        </div>
        <div className="space-y-4">
          <Label className="text-sm font-bold text-gray-800">Área e Propriedade</Label>
          <div className="space-y-6">
            <InputField label="Área total de propriedades" value={formData.financial.propertyArea} onChange={v => updateFinancial("propertyArea", v)} placeholder="1300 ha" />
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <span className="font-bold text-gray-800">Possui imóvel em seu nome?</span>
              <Switch checked={formData.financial.hasOwnProperty} onCheckedChange={v => updateFinancial("hasOwnProperty", v)} className="data-[state=checked]:bg-[#92dc49]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRuralActivity({ formData, updateActivity }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Sua atividade rural</h2>
        <p className="text-gray-400 text-lg font-medium">Precisamos de alguns detalhes sobre sua atividade para identificar a melhor linha de financiamento.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-6">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Cultura e produção</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600 ml-1">Cultura principal</Label>
              <Select value={formData.activity.mainCulture} onValueChange={v => updateActivity("mainCulture", v)}>
                <SelectTrigger className="h-14 bg-white border-none rounded-xl shadow-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Soja">Soja</SelectItem><SelectItem value="Milho">Milho</SelectItem></SelectContent>
              </Select>
            </div>
            <InputField label="Culturas secundárias" value={formData.activity.secondaryCultures} onChange={v => updateActivity("secondaryCultures", v)} placeholder="Ex.: Milho, feijão..." />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Área plantada" value={formData.activity.plantedArea} onChange={v => updateActivity("plantedArea", v)} />
              <InputField label="Produtividade esperada" value={formData.activity.expectedProductivity} onChange={v => updateActivity("expectedProductivity", v)} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Orçamento e metas</h3>
          <div className="space-y-4">
            <InputField label="Orçamento da safra" value={formatCurrency(formData.activity.harvestBudget)} onChange={v => updateActivity("harvestBudget", v.replace(/\D/g, ""))} placeholder="R$ 0,00" />
            <InputField label="Expectativa de receita" value={formatCurrency(formData.activity.revenueExpectation)} onChange={v => updateActivity("revenueExpectation", v.replace(/\D/g, ""))} placeholder="R$ 0,00" />
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600 ml-1">Já tem contratos de venda?</Label>
              <Select value={formData.activity.hasSalesContract} onValueChange={v => updateActivity("hasSalesContract", v)}>
                <SelectTrigger className="h-14 bg-white border-none rounded-xl shadow-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Sim">Sim</SelectItem><SelectItem value="Não">Não</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepGuarantees({ formData, setFormData }) {
  const updateG = (id, f, v) => {
    setFormData(p => ({
      ...p,
      guarantees: p.guarantees.map(g => g.id === id ? { ...g, [f]: v } : g)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Garantias</h2>
        <p className="text-gray-400 text-lg font-medium">Imóveis, equipamentos, maquinário, etc.</p>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {formData.guarantees.map((g) => (
          <div key={g.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/50 rounded-2xl border border-white/20">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600">Tipo de ativo</Label>
              <Select value={g.type} onValueChange={v => updateG(g.id, "type", v)}>
                <SelectTrigger className="h-12 bg-white border-none rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Imóvel">Imóvel</SelectItem><SelectItem value="Veículo">Veículo</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600">Titularidade</Label>
              <Select value={g.ownership} onValueChange={v => updateG(g.id, "ownership", v)}>
                <SelectTrigger className="h-12 bg-white border-none rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Meu nome">Meu nome</SelectItem><SelectItem value="Terceiros">Terceiros</SelectItem></SelectContent>
              </Select>
            </div>
            <InputField label="Descrição" value={g.description} onChange={v => updateG(g.id, "description", v)} placeholder="Matrícula nº..." />
            <InputField label="Valor estimado" value={formatCurrency(g.value)} onChange={v => updateG(g.id, "value", v.replace(/\D/g, ""))} />
          </div>
        ))}
        <Button variant="outline" onClick={() => setFormData(p => ({ ...p, guarantees: [...p.guarantees, { id: Date.now(), type: "Imóvel", ownership: "Meu nome", description: "", value: "" }] }))} className="w-full h-12 rounded-xl border border-dashed border-[#92dc49] text-[#7ab635] font-bold flex items-center justify-center gap-2 hover:bg-[#92dc49]/5 transition-colors">
          <Plus className="w-5 h-5" /> Adicionar garantia
        </Button>
      </div>
    </div>
  );
}

function StepDocs({ formData, setFormData }) {
  const [uploading, setUploading] = useState(null);

  const simulateUpload = (id) => {
    setUploading(id);
    setTimeout(() => {
      setFormData(p => ({
        ...p,
        documents: p.documents.map(d => d.id === id ? { ...d, status: "done", fileName: "arquivo_enviado.pdf", error: null } : d)
      }));
      setUploading(null);
    }, 1200);
  };

  const removeDoc = (id) => {
    setFormData(p => ({
      ...p,
      documents: p.documents.map(d => d.id === id ? { ...d, status: "idle", fileName: null } : d)
    }));
  };

  const renderDoc = (doc) => (
    <div key={doc.id} className="space-y-1">
      <div className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${doc.status === 'done' ? 'bg-[#cae8bc]/40 border-[#cae8bc]' : 'bg-white border-transparent shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${doc.status === 'done' ? 'bg-[#92dc49] text-white' : 'bg-gray-50 text-gray-400'}`}>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-gray-900">{doc.name}</h4>
            {doc.subtitle && <p className="text-xs text-gray-400">{doc.subtitle}</p>}
            {doc.status === 'done' && <p className="text-xs text-green-700 font-bold mt-0.5">{doc.fileName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {doc.status === 'done' ? (
            <>
              <button onClick={() => removeDoc(doc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><Eye className="w-5 h-5" /></button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => simulateUpload(doc.id)} 
                disabled={uploading === doc.id} 
                className="p-2 text-[#92dc49] hover:bg-[#92dc49]/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading === doc.id ? <Loader2 className="animate-spin w-6 h-6" /> : <Upload className="w-6 h-6" />}
              </button>
              {doc.status === 'error' && (
                <div className="p-2 bg-red-100 text-red-500 rounded-xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {doc.status === 'error' && <p className="text-red-500 text-xs font-bold pl-2">{doc.error}</p>}
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Documentos pessoais</h2>
        <div className="space-y-4">
          {formData.documents.filter(d => d.category === 'pessoais').map(renderDoc)}
        </div>
      </div>
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Documentos da atividade rural</h2>
        <div className="space-y-4">
          {formData.documents.filter(d => d.category === 'rural').map(renderDoc)}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isLast }) {
  return (
    <div className={`flex items-center justify-between p-4 px-6 ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2 w-full group">
      <Label className="text-xs font-bold text-gray-500 ml-1 group-focus-within:text-[#7ab635] transition-colors">{label}</Label>
      <Input type={type} className="h-14 bg-white border-none rounded-xl px-6 font-medium text-gray-900 shadow-sm focus:shadow-md transition-all placeholder:text-gray-300 ring-0" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
