import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Loader2, Search, User, Building2, Leaf, Briefcase, Factory, HelpCircle, Coins, ArrowUpRight, Sprout, Truck, LineChart, Flag, Calendar, SearchIcon, CheckCircle2, FileCheck2, ShieldCheck, BellRing, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userPersistence } from "@/lib/userPersistence";

// Auxiliares
const formatDisplayCurrency = (value) => {
  if (!value) return "";
  const digits = value.toString().replace(/\D/g, "");
  const amount = (parseFloat(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount;
};

const parseToFloat = (displayValue) => {
  if (!displayValue) return 0;
  return parseFloat(displayValue.toString().replace(/\D/g, "")) / 100;
};

const formatCEP = (v) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const formatCPF = (v) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2");
const formatRG = (v) => v.replace(/\D/g, "").slice(0, 9).replace(/(\d{1,2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
const formatPhone = (v) => v.replace(/\D/g, "").slice(0, 11).replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");

const ESTADOS_BR = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];
const SEXO_OPTIONS = ["Masculino", "Feminino", "Outro", "Não informado"];
const ESTADO_CIVIL_OPTIONS = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"];

// Constantes
const PROFILES = [
  { id: "pf", label: "Para mim, como pessoa física", icon: User },
  { id: "pj", label: "Para minha empresa", icon: Building2 },
  { id: "rural", label: "Para minha atividade rural", sublabel: "ou propriedade rural", icon: Leaf },
  { id: "micro", label: "Para meu micro negócio", icon: Briefcase },
  { id: "grande", label: "Para um projeto grande", sublabel: "ou infraestrutura", icon: Factory },
  { id: "nsei", label: "Ainda não sei", icon: HelpCircle },
];

const NEEDS = [
  { id: "giro", label: "Cobrir Capital de Giro", sublabel: "ou necessidade do dia a dia", icon: Coins },
  { id: "recebiveis", label: "Antecipar recebíveis", icon: ArrowUpRight },
  { id: "plantar", label: "Plantar e colher", sublabel: "ou propriedade rural", icon: Sprout },
  { id: "maquinas", label: "Máquinas e equipamentos", icon: Truck },
  { id: "expandir", label: "Expandir negócio", sublabel: "ou infraestrutura", icon: Factory },
  { id: "dividas", label: "Reorganizar dívidas", icon: LineChart },
];

const URGENCIES = [
  { id: "urgente", label: "Urgente", sublabel: "Preciso em menos de 30 dias", icon: Flag, color: "text-red-500" },
  { id: "planejado", label: "Planejado", sublabel: "Posso aguardar de 30 a 90 dias", icon: Calendar, color: "text-green-500" },
  { id: "explorando", label: "Explorando", sublabel: "Apenas vendo opções por agora", icon: SearchIcon, color: "text-blue-500" },
];

const MONTH_OPTIONS = [12, 24, 36, 48, 60, 84, 120, 144];

export function SolicitacaoCredito() {
  const [, setLocation] = useLocation();
  const [section, setSection] = useState("IDENTIFICACAO"); // "IDENTIFICACAO" ou "CADASTRO"
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    profile: "rural",
    need: "plantar",
    amountDisplay: "25000000",
    amount: 250000.0,
    months: 36,
    urgency: "planejado",
    consents: { history: true, data: false, simulation: false, offers: false },
    personal: {
      fullName: "", document: "", birthDate: "2001-01-01", nationality: "Brasileiro",
      rg: "", rgIssuer: "SSP/DF", occupation: "Produtor Rural", gender: "Masculino", civilState: "Casado(a)"
    },
    address: { zipCode: "", street: "", neighborhood: "", city: "", state: "", number: "" },
    access: { email: "", phone: "", password: "", confirmPassword: "" },
    otp: ""
  });

  // Persistência automática no localStorage a cada mudança de step
  useEffect(() => {
    userPersistence.saveDraftRequest(formData);
  }, [formData, section, step]);

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmountChange = (val) => {
    const rawDigits = val.replace(/\D/g, "");
    setFormData(prev => ({
      ...prev,
      amountDisplay: rawDigits,
      amount: parseToFloat(rawDigits)
    }));
  };

  const handleCEPChange = async (value) => {
    const formatted = formatCEP(value);
    setFormData(prev => ({ ...prev, address: { ...prev.address, zipCode: formatted } }));

    const clean = value.replace(/\D/g, "");
    if (clean.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: data.logradouro || "",
              neighborhood: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || ""
            }
          }));
        }
      } catch (e) { console.error(e); }
      finally { setCepLoading(false); }
    }
  };

  const handleNext = () => {
    if (section === "IDENTIFICACAO") {
      if (step < 6) setStep(prev => prev + 1);
      else {
        setSection("CADASTRO");
        setStep(1);
      }
    } else {
      if (step < 5) setStep(prev => prev + 1);
      else {
        setIsLoading(true);
        setTimeout(() => {
          const newUser = {
            email: formData.access.email,
            password: formData.access.password,
            name: formData.personal.fullName,
            userRole: 'cliente',
            creditRequest: formData // Atrela todo o fluxo ao usuário
          };
          userPersistence.saveUser(newUser);
          
          // Log in the user
          localStorage.setItem('userRole', newUser.userRole);
          localStorage.setItem('user', JSON.stringify({ ...newUser, permissionId: 1004 }));
          
          userPersistence.clearDraftRequest();
          setIsLoading(false);
          setLocation("/solicitacao-proposta");
        }, 1500);
      }
    }
  };

  const handlePrev = () => {
    if (section === "CADASTRO") {
      if (step > 1) setStep(prev => prev - 1);
      else {
        setSection("IDENTIFICACAO");
        setStep(6);
      }
    } else {
      if (step > 1) setStep(prev => prev - 1);
      else setLocation("/");
    }
  };

  const totalSteps = section === "IDENTIFICACAO" ? 6 : 5;

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col font-sans">
      <nav className="bg-[#22c55e] h-16 px-6 md:px-12 flex items-center justify-between shadow-sm z-50">
        <Link href="/">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-5 h-5 bg-[#22c55e] rounded-sm transform rotate-45"></div>
          </div>
        </Link>
        <Button variant="outline" className="rounded-full bg-transparent border-black/10 text-black hover:bg-black/5 font-medium px-6 h-10 border">
          Falar com especialista
        </Button>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-5xl py-4 animate-in fade-in duration-700">
          <Card className="bg-[#f2f4f2] border-none shadow-sm rounded-[40px] p-8 md:p-14 relative overflow-hidden">

            <div className="flex justify-between items-center mb-8">
              <button onClick={handlePrev} className="flex items-center text-[10px] font-black text-gray-400 hover:text-gray-600 tracking-[0.2em] uppercase gap-1">
                <ChevronLeft className="w-4 h-4" /> {section === "CADASTRO" ? "CADASTRO" : "IDENTIFICAÇÃO"}
              </button>
              <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
                ETAPA {step} de {totalSteps}
              </span>
            </div>

            <div className="flex gap-2 mb-14 h-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${step >= i + 1 ? 'bg-[#92dc49]' : 'bg-gray-200'}`} />
              ))}
            </div>

            <div className="min-h-[460px]">
              {section === "IDENTIFICACAO" ? (
                <>
                  {step === 1 && <StepIdent1 formData={formData} setFormData={setFormData} />}
                  {step === 2 && <StepIdent2 formData={formData} setFormData={setFormData} />}
                  {step === 3 && <StepIdent3 formData={formData} setFormData={setFormData} handleAmountChange={handleAmountChange} />}
                  {step === 4 && <StepIdent4 formData={formData} />}
                  {step === 5 && <StepIdent5 formData={formData} setFormData={setFormData} />}
                  {step === 6 && <StepIdent6 formData={formData} setFormData={setFormData} onBack={() => { setSection("IDENTIFICACAO"); setStep(5); }} />}
                </>
              ) : (
                <>
                  {step === 1 && <StepReg1 formData={formData} setFormData={setFormData} />}
                  {step === 2 && <StepReg2 formData={formData} setFormData={setFormData} handleCEPChange={handleCEPChange} cepLoading={cepLoading} />}
                  {step === 3 && <StepReg3 formData={formData} setFormData={setFormData} showPassword={showPassword} setShowPassword={setShowPassword} />}
                  {step === 4 && <StepReg4 formData={formData} setFormData={setFormData} />}
                  {step === 5 && <StepReg5 />}
                </>
              )}
            </div>

            <div className="flex justify-end items-center gap-4 mt-14">
              {(section === "IDENTIFICACAO" && step >= 4) && (
                <Button variant="outline" onClick={() => setStep(3)} className="rounded-full h-14 px-8 font-bold border-gray-100 text-gray-400 hover:bg-gray-50 bg-white">
                  Ajustar informações
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-[#92dc49] hover:bg-[#7ab635] text-white rounded-2xl h-14 px-10 flex items-center gap-3 font-bold text-lg shadow-lg shadow-[#92dc49]/20 transition-all active:scale-95 min-w-[200px]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : (
                  <>
                    {(section === "CADASTRO" && step === 3) ? "Confirmar" : (section === "IDENTIFICACAO" && step === 4) ? "Prosseguir para solicitação" : (section === "CADASTRO" && step === 4) ? "Confirmar" : "Continuar"}
                    {((section === "IDENTIFICACAO" && step < 4) || (section === "CADASTRO" && step < 3)) && <ChevronRight className="w-6 h-6 bg-white/20 rounded-full p-1" />}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTES IDENTIFICAÇÃO ---

function StepIdent1({ formData, setFormData }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Para quem deseja solicitar o crédito?</h2>
        <p className="text-gray-400 text-xl font-medium">Selecione o perfil que melhor descreve a sua situação.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROFILES.map((p) => (
          <SelectionCard key={p.id} icon={p.icon} label={p.label} sublabel={p.sublabel} selected={formData.profile === p.id} onClick={() => setFormData(prev => ({ ...prev, profile: p.id }))} />
        ))}
      </div>
    </div>
  );
}

function StepIdent2({ formData, setFormData }) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-gray-900">Qual a sua necessidade?</h2>
        <p className="text-gray-400 text-xl font-medium">A gente ajuda a encaixar na solução certa.</p>
      </div>
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
        <Input className="h-16 pl-16 pr-6 bg-white border-none rounded-2xl text-lg shadow-sm placeholder:text-gray-200" placeholder="Busque por sua necessidade... ex: 'plantar soja', 'trator', 'capital'" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {NEEDS.map((n) => (
          <SelectionCard key={n.id} icon={n.icon} label={n.label} sublabel={n.sublabel} selected={formData.need === n.id} onClick={() => setFormData(prev => ({ ...prev, need: n.id }))} />
        ))}
      </div>
    </div>
  );
}

function StepIdent3({ formData, handleAmountChange, setFormData }) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold text-gray-900 tracking-tight">Qual o tamanho da sua necessidade?</h2>
      <p className="text-gray-400 text-xl font-medium">Você pode informar dados aproximados, vamos refinar depois</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[32px] flex flex-col justify-center min-h-[220px]">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quanto você precisa?</h3>
          <div className="relative bg-gray-100 rounded-2xl p-2">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300">R$</div>
            <Input className="h-20 bg-transparent border-none rounded-2xl text-4xl font-bold pl-16 focus:ring-0" value={formatDisplayCurrency(formData.amountDisplay)} onChange={(e) => handleAmountChange(e.target.value)} />
          </div>
        </div>
        <div className="bg-white p-10 rounded-[32px] min-h-[220px]">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Em quantos meses deseja pagar?</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {MONTH_OPTIONS.map((m) => (
              <button key={m} onClick={() => setFormData(prev => ({ ...prev, months: m }))} className={`py-2 rounded-full text-xs font-bold transition-all ${formData.months === m ? "bg-[#92dc49] text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}>{m} meses</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Ou digite o prazo desejado:</span>
            <Input type="number" className="h-10 w-24 bg-gray-100 border-none rounded-xl text-center font-bold" value={formData.months} onChange={(e) => setFormData(prev => ({ ...prev, months: parseInt(e.target.value) || "" }))} />
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-[32px]">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Qual a urgência?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {URGENCIES.map((u) => {
            const Icon = u.icon;
            return (
              <button key={u.id} onClick={() => setFormData(prev => ({ ...prev, urgency: u.id }))} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${formData.urgency === u.id ? "border-[#92dc49] bg-[#92dc49]/5" : "border-gray-50 bg-gray-50/50"}`}>
                <div className={`p-2 rounded-xl bg-white shadow-sm ${formData.urgency === u.id ? 'text-[#92dc49]' : 'text-gray-300'}`}><Icon className="w-6 h-6" /></div>
                <div><p className="font-bold text-gray-900 text-sm">{u.label}</p><p className="text-[10px] text-gray-400">{u.sublabel}</p></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepIdent4({ formData }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold text-gray-900 tracking-tight">Este pode ser o melhor caminho</h2>
      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-2">
        <div className="bg-[#f8f9f8] p-4 text-center border-b border-gray-100 rounded-t-[38px]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Crédito para produção agrícola</span>
        </div>
        <div className="grid grid-cols-2">
          <SummaryItem label="Valor estimado" value={`R$ ${formatDisplayCurrency(formData.amountDisplay)}`} />
          <SummaryItem label="Perfil" value={PROFILES.find(p => p.id === formData.profile)?.label.split(",")[0]} />
          <SummaryItem label="Prazo" value={`${formData.months} meses`} />
          <SummaryItem label="Urgência" value={URGENCIES.find(u => u.id === formData.urgency)?.label} />
        </div>
      </div>
    </div>
  );
}

function StepIdent5({ formData, setFormData }) {
  const toggle = (k) => setFormData(p => ({ ...p, consents: { ...p.consents, [k]: !p.consents[k] } }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in duration-500">
      <div className="space-y-6">
        <h2 className="text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">Ótimo saber que esse produto lhe atende!</h2>
        <p className="text-gray-400 text-lg font-medium">Iniciaremos seu cadastro no nosso sistema, para que você consiga finalizar a sua solicitação e acompanhá-la. Confirme o consentimento para continuar.</p>
      </div>
      <div className="space-y-4">
        <ConsentItem icon={FileCheck2} title="Consulta ao histórico de crédito" desc="Autorizo o BASA a consultar meu histórico em bureaus de crédito (Serasa, SPC, SCR, Bacen) para análise de sua solicitação." checked={formData.consents.history} onToggle={() => toggle("history")} />
        <ConsentItem icon={ShieldCheck} title="Tratamento de dados pessoais" desc="Autorizo o tratamento dos meus dados para fins de concessão de crédito, conforme a Política de Privacidade do BASA." checked={formData.consents.data} onToggle={() => toggle("data")} />
        <ConsentItem icon={CheckCircle2} title="Ciência sobre a simulação" desc="Estou ciente de que a simulação e o diagnóstico não representam aprovação final de crédito." checked={formData.consents.simulation} onToggle={() => toggle("simulation")} />
        <ConsentItem icon={BellRing} title="Comunicações e ofertas" desc="Aceito receber notificações sobre outras ofertas de produtos e serviços do BASA por e-mail, SMS ou WhatsApp." isOptional checked={formData.consents.offers} onToggle={() => toggle("offers")} />
      </div>
    </div>
  );
}

function StepIdent6({ formData, setFormData }) {
  const update = (f, v) => setFormData(p => ({ ...p, personal: { ...p.personal, [f]: v } }));
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold text-gray-900">Conte-nos sobre você</h2>
      <p className="text-gray-400 text-xl font-medium tracking-tight">Precisamos de algumas informações</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Nome completo" value={formData.personal.fullName} onChange={v => update("fullName", v)} placeholder="Insira seu nome" />
        <InputField label="CPF" value={formatCPF(formData.personal.document)} onChange={v => update("document", v.replace(/\D/g, ""))} placeholder="000.000.000-00" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Data de nascimento" value={formData.personal.birthDate} onChange={v => update("birthDate", v)} type="date" />
          <InputField label="Nacionalidade" value={formData.personal.nationality} onChange={v => update("nationality", v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="RG" value={formatRG(formData.personal.rg)} onChange={v => update("rg", v.replace(/\D/g, ""))} placeholder="0.000.000-0" />
          <InputField label="Órgão emissor" value={formData.personal.rgIssuer} onChange={v => update("rgIssuer", v)} />
        </div>
        <InputField label="Ocupação / Atividade Principal" value={formData.personal.occupation} onChange={v => update("occupation", v)} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-800 ml-1">Sexo</Label>
            <Select value={formData.personal.gender} onValueChange={v => update("gender", v)}>
              <SelectTrigger className="h-14 bg-white border-none rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {SEXO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-800 ml-1">Estado civil</Label>
            <Select value={formData.personal.civilState} onValueChange={v => update("civilState", v)}>
              <SelectTrigger className="h-14 bg-white border-none rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {ESTADO_CIVIL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTES CADASTRO ---

function StepReg1({ formData, setFormData }) {
  const update = (f, v) => setFormData(p => ({ ...p, personal: { ...p.personal, [f]: v } }));
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold text-gray-900">Conte-nos sobre você</h2>
      <p className="text-gray-400 text-xl font-medium tracking-tight">Precisamos de algumas informações</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Nome completo" value={formData.personal.fullName} onChange={v => update("fullName", v)} placeholder="Insira seu nome" />
        <InputField label="CPF" value={formData.personal.document} onChange={v => update("document", v)} placeholder="000.000.000-00" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Data de nascimento" value={formData.personal.birthDate} onChange={v => update("birthDate", v)} type="date" />
          <InputField label="Nacionalidade" value={formData.personal.nationality} onChange={v => update("nationality", v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="RG" value={formData.personal.rg} onChange={v => update("rg", v)} />
          <InputField label="Órgão emissor" value={formData.personal.rgIssuer} onChange={v => update("rgIssuer", v)} />
        </div>
        <InputField label="Ocupação / Atividade Principal" value={formData.personal.occupation} onChange={v => update("occupation", v)} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-800 ml-1">Sexo</Label>
            <Select value={formData.personal.gender} onValueChange={v => update("gender", v)}>
              <SelectTrigger className="h-14 bg-white border-none rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {SEXO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-800 ml-1">Estado civil</Label>
            <Select value={formData.personal.civilState} onValueChange={v => update("civilState", v)}>
              <SelectTrigger className="h-14 bg-white border-none rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {ESTADO_CIVIL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepReg2({ formData, setFormData, handleCEPChange, cepLoading }) {
  const update = (f, v) => setFormData(p => ({ ...p, address: { ...p.address, [f]: v } }));
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold text-gray-900">Onde você está?</h2>
      <p className="text-gray-400 text-xl font-medium tracking-tight">Digite seu CEP para preenchermos o endereço automaticamente.</p>
      <div className="space-y-6">
        <div className="space-y-2 max-w-md">
          <Label className="text-xs font-bold text-gray-800 ml-1">CEP</Label>
          <div className="relative">
            <Input className="h-14 bg-white border-none rounded-xl px-6" value={formData.address.zipCode} onChange={e => handleCEPChange(e.target.value)} placeholder="00.000-000" />
            {cepLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[#92dc49]" />}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Logradouro" value={formData.address.street} onChange={v => update("street", v)} placeholder="Rua..." />
          <InputField label="Bairro" value={formData.address.neighborhood} onChange={v => update("neighborhood", v)} placeholder="Bairro..." />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><InputField label="Cidade" value={formData.address.city} onChange={v => update("city", v)} /></div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-800 ml-1">UF</Label>
              <Select value={formData.address.state} onValueChange={v => update("state", v)}>
                <SelectTrigger className="h-14 bg-white border-none rounded-xl">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BR.map(uf => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <InputField label="Número" value={formData.address.number} onChange={v => update("number", v)} placeholder="123" />
        </div>
      </div>
    </div>
  );
}

function StepReg3({ formData, setFormData, showPassword, setShowPassword }) {
  const update = (f, v) => setFormData(p => ({ ...p, access: { ...p.access, [f]: v } }));
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold text-gray-900">Seu acesso</h2>
      <p className="text-gray-400 text-xl font-medium tracking-tight">Insira um e-mail, telefone e senha para criarmos seu acesso.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="E-mail" value={formData.access.email} onChange={v => update("email", v)} placeholder="seuemail@email.com" />
        <InputField label="Telefone" value={formatPhone(formData.access.phone)} onChange={v => update("phone", v.replace(/\D/g, ""))} placeholder="(00) 00000-0000" />
        <div className="space-y-2 relative">
          <Label className="text-xs font-bold text-gray-800 ml-1">Senha</Label>
          <Input type={showPassword ? "text" : "password"} className="h-14 bg-white border-none rounded-xl px-12" value={formData.access.password} onChange={e => update("password", e.target.value)} />
          <div className="absolute left-4 top-[42px] text-gray-300"><ShieldCheck className="w-5 h-5" /></div>
          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-gray-300 transition-colors hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
        </div>
        <div className="space-y-2 relative">
          <Label className="text-xs font-bold text-gray-800 ml-1">Confirme sua senha</Label>
          <Input type={showPassword ? "text" : "password"} className="h-14 bg-white border-none rounded-xl px-12" value={formData.access.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} />
          <div className="absolute left-4 top-[42px] text-gray-300"><ShieldCheck className="w-5 h-5" /></div>
        </div>
      </div>
    </div>
  );
}

function StepReg4({ formData, setFormData }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Enviamos um código de verificação ao seu e-mail</h2>
        <p className="text-gray-400 text-lg">Por gentileza, digite o código no campo</p>
      </div>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-20 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl font-bold text-gray-900 border-b-8 border-[#92dc49] shadow-sm">
            {formData.otp[i - 1] || "9"}
          </div>
        ))}
      </div>
      <button className="text-xs font-bold text-[#92dc49] uppercase tracking-widest border border-[#92dc49]/20 rounded-full px-6 py-2">Reenviar código</button>
    </div>
  );
}

function StepReg5() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-20 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-[#92dc49]/10 rounded-full flex items-center justify-center text-[#92dc49]">
        <CheckCircle className="w-12 h-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Seu cadastro de perfil foi realizado com sucesso.</h3>
        <p className="text-gray-400 text-lg">Continuaremos com sua simulação e solicitação de crédito.</p>
      </div>
    </div>
  );
}

// --- UTILS ---

function SelectionCard({ icon: Icon, label, sublabel, selected, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-8 rounded-[32px] border-2 transition-all min-h-[200px] bg-white group ${selected ? "border-[#92dc49] ring-8 ring-[#92dc49]/5" : "border-transparent hover:border-gray-100"}`}>
      <div className={`mb-4 p-4 rounded-2xl ${selected ? "bg-[#92dc49] text-white" : "bg-gray-50 text-gray-300"}`}><Icon className="w-10 h-10" /></div>
      <p className={`font-bold text-base leading-tight px-2 ${selected ? "text-gray-900" : "text-gray-400"}`}>{label}</p>
      {sublabel && <p className="text-[10px] text-gray-300 mt-2 uppercase font-black tracking-widest">{sublabel}</p>}
    </button>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="bg-white p-10 flex flex-col items-center justify-center space-y-2 border-r border-b border-gray-50 last:border-r-0 last:border-b-0">
      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
    </div>
  );
}

function ConsentItem({ icon: Icon, title, desc, isOptional, checked, onToggle }) {
  return (
    <div onClick={onToggle} className={`p-6 rounded-[24px] border-2 transition-all cursor-pointer flex gap-5 bg-white ${checked ? 'border-[#92dc49]' : 'border-gray-50'}`}>
      <div className={`p-3 rounded-xl h-fit ${checked ? 'bg-[#92dc49] text-white' : 'bg-gray-50 text-gray-300'}`}><Icon className="w-5 h-5" /></div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">{title}{isOptional && <span className="text-[8px] text-gray-300 uppercase tracking-widest">Opcional</span>}</h4>
        <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
      </div>
      <Checkbox checked={checked} className="data-[state=checked]:bg-[#92dc49]" />
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2 w-full">
      <Label className="text-xs font-bold text-gray-800 ml-1">{label}</Label>
      <Input type={type} className="h-14 bg-white border-none rounded-xl px-6 font-medium text-gray-900" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
