import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Eye, EyeOff, Lock, Mail, ChevronRight, ChevronLeft, User, FileText,
  Building2, MapPin, Phone, Loader2, CheckCircle2, IdCard
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

const ESTADOS_BR = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatCNPJ(value) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCEP(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

const PF_STEPS = [
  { id: "type", label: "Tipo de Conta" },
  { id: "personal", label: "Dados Pessoais" },
  { id: "address", label: "Endereço" },
  { id: "credentials", label: "Acesso" },
];

const PJ_STEPS = [
  { id: "type", label: "Tipo de Conta" },
  { id: "company", label: "Dados da Empresa" },
  { id: "representative", label: "Representante" },
  { id: "address", label: "Endereço" },
  { id: "credentials", label: "Acesso" },
];

export function Registro() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [personType, setPersonType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    document: "",
    rg: "",
    birthDate: "",
    maritalStatus: "",
    motherName: "",
    monthlyIncome: "",
    occupation: "",
    companyName: "",
    tradeName: "",
    industry: "",
    companySize: "",
    annualRevenue: "",
    foundedDate: "",
    machineryCount: "",
    employeeCount: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const steps = personType === "PJ" ? PJ_STEPS : PF_STEPS;
  const totalSteps = steps.length;
  const progress = personType ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 0 && !personType) {
      setError("Selecione o tipo de conta.");
      return;
    }

    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setError("");
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  const validateCurrentStep = () => {
    const step = steps[currentStep];
    if (step.id === "type") {
      if (!personType) return "Selecione CPF ou CNPJ.";
    }
    if (step.id === "personal") {
      if (!formData.fullName.trim()) return "Nome completo é obrigatório.";
      if (!formData.document.trim()) return "CPF é obrigatório.";
      const cpfDigits = formData.document.replace(/\D/g, "");
      if (cpfDigits.length !== 11) return "CPF deve ter 11 dígitos.";
    }
    if (step.id === "company") {
      if (!formData.companyName.trim()) return "Razão social é obrigatória.";
      if (!formData.document.trim()) return "CNPJ é obrigatório.";
      const cnpjDigits = formData.document.replace(/\D/g, "");
      if (cnpjDigits.length !== 14) return "CNPJ deve ter 14 dígitos.";
      if (!formData.fullName.trim()) return "Nome do responsável legal é obrigatório.";
    }
    if (step.id === "representative") {
      if (!formData.fullName.trim()) return "Nome do representante é obrigatório.";
    }
    if (step.id === "address") {
      if (!formData.city.trim()) return "Cidade é obrigatória.";
      if (!formData.state) return "Estado é obrigatório.";
    }
    if (step.id === "credentials") {
      if (!formData.email.trim()) return "E-mail é obrigatório.";
      if (!formData.password) return "Senha é obrigatória.";
      if (formData.password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
      if (formData.password !== formData.confirmPassword) return "As senhas não coincidem.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const documentClean = formData.document.replace(/\D/g, "");
      const payload = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        personType,
        document: documentClean,
        fullName: formData.fullName,
        tradeName: formData.tradeName || null,
        phone: formData.phone || null,
        role: "cliente",
        pfDetails: personType === "PF" ? {
          cpf: documentClean,
          rg: formData.rg || null,
          birthDate: formData.birthDate || null,
          maritalStatus: formData.maritalStatus || null,
          motherName: formData.motherName || null,
          monthlyIncome: formData.monthlyIncome || null,
          occupation: formData.occupation || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode.replace(/\D/g, "") || null,
          neighborhood: formData.neighborhood || null,
        } : undefined,
        pjDetails: personType === "PJ" ? {
          cnpj: documentClean,
          companyName: formData.companyName || null,
          tradeName: formData.tradeName || null,
          industry: formData.industry || null,
          companySize: formData.companySize || null,
          annualRevenue: formData.annualRevenue || null,
          foundedDate: formData.foundedDate || null,
          machineryCount: formData.machineryCount || null,
          employeeCount: formData.employeeCount || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode.replace(/\D/g, "") || null,
          neighborhood: formData.neighborhood || null,
        } : undefined,
      };

      await apiRequest("POST", "/api/auth/register", payload);
      setIsSuccess(true);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("409")) {
        setError("Já existe uma conta com este e-mail ou documento.");
      } else {
        setError("Erro ao criar conta. Verifique os dados e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1628160424522-8692793b890a?q=80&w=2574&auto=format&fit=crop')` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#7ab635]/90 to-[#92dc49]/70"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:flex flex-col text-white space-y-6">
            <h1 className="text-7xl font-bold tracking-tighter">S.I.G.A</h1>
            <p className="text-2xl font-light text-white/90">Sistema Integrado<br />de Gestão Amazônica</p>
          </div>
          <div className="flex justify-center lg:justify-end w-full">
            <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl p-8 md:p-10 bg-white/95">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#92dc49]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900" data-testid="text-register-success">Conta criada com sucesso!</h2>
                <p className="text-gray-500 text-sm">Sua conta foi registrada. Agora você pode fazer login na plataforma.</p>
                <Button
                  onClick={() => setLocation("/")}
                  data-testid="button-go-login"
                  className="w-full h-12 bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold text-lg rounded-full shadow-lg shadow-[#92dc49]/40"
                >
                  Ir para o Login <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.id === "type") {
      return (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">Selecione o tipo de conta que deseja criar:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { setPersonType("PF"); setCurrentStep(0); }}
              data-testid="button-select-pf"
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                personType === "PF"
                  ? "border-[#92dc49] bg-[#92dc49]/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <User className={`w-8 h-8 ${personType === "PF" ? "text-[#7ab635]" : "text-gray-400"}`} />
              <div className="text-center">
                <p className={`font-semibold ${personType === "PF" ? "text-[#7ab635]" : "text-gray-700"}`}>Pessoa Física</p>
                <p className="text-xs text-gray-400 mt-1">CPF</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setPersonType("PJ"); setCurrentStep(0); }}
              data-testid="button-select-pj"
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                personType === "PJ"
                  ? "border-[#92dc49] bg-[#92dc49]/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Building2 className={`w-8 h-8 ${personType === "PJ" ? "text-[#7ab635]" : "text-gray-400"}`} />
              <div className="text-center">
                <p className={`font-semibold ${personType === "PJ" ? "text-[#7ab635]" : "text-gray-700"}`}>Pessoa Jurídica</p>
                <p className="text-xs text-gray-400 mt-1">CNPJ</p>
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (step.id === "personal") {
      return (
        <div className="space-y-4">
          <InputField icon={<User className="w-4 h-4" />} label="Nome Completo *" value={formData.fullName} onChange={(v) => handleChange("fullName", v)} placeholder="Seu nome completo" testId="input-fullname" />
          <InputField icon={<IdCard className="w-4 h-4" />} label="CPF *" value={formData.document} onChange={(v) => handleChange("document", formatCPF(v))} placeholder="000.000.000-00" testId="input-cpf" />
          <InputField icon={<FileText className="w-4 h-4" />} label="RG" value={formData.rg} onChange={(v) => handleChange("rg", v)} placeholder="Número do RG" testId="input-rg" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Data de Nascimento" value={formData.birthDate} onChange={(v) => handleChange("birthDate", v)} placeholder="DD/MM/AAAA" type="date" testId="input-birthdate" />
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Estado Civil</Label>
              <Select value={formData.maritalStatus} onValueChange={(v) => handleChange("maritalStatus", v)}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl" data-testid="select-marital-status">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  <SelectItem value="uniao_estavel">União Estável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <InputField label="Nome da Mãe" value={formData.motherName} onChange={(v) => handleChange("motherName", v)} placeholder="Nome completo da mãe" testId="input-mother" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Renda Mensal" value={formData.monthlyIncome} onChange={(v) => handleChange("monthlyIncome", v)} placeholder="R$ 0,00" testId="input-income" />
            <InputField label="Profissão" value={formData.occupation} onChange={(v) => handleChange("occupation", v)} placeholder="Sua profissão" testId="input-occupation" />
          </div>
          <InputField icon={<Phone className="w-4 h-4" />} label="Telefone" value={formData.phone} onChange={(v) => handleChange("phone", formatPhone(v))} placeholder="(00) 00000-0000" testId="input-phone" />
        </div>
      );
    }

    if (step.id === "company") {
      return (
        <div className="space-y-4">
          <InputField icon={<Building2 className="w-4 h-4" />} label="Razão Social *" value={formData.companyName} onChange={(v) => handleChange("companyName", v)} placeholder="Nome da empresa" testId="input-company-name" />
          <InputField label="Nome Fantasia" value={formData.tradeName} onChange={(v) => handleChange("tradeName", v)} placeholder="Nome fantasia" testId="input-trade-name" />
          <InputField icon={<IdCard className="w-4 h-4" />} label="CNPJ *" value={formData.document} onChange={(v) => handleChange("document", formatCNPJ(v))} placeholder="00.000.000/0000-00" testId="input-cnpj" />
          <InputField label="Nome do Responsável Legal *" value={formData.fullName} onChange={(v) => handleChange("fullName", v)} placeholder="Nome completo" testId="input-representative-name" />
          <InputField icon={<Phone className="w-4 h-4" />} label="Telefone" value={formData.phone} onChange={(v) => handleChange("phone", formatPhone(v))} placeholder="(00) 00000-0000" testId="input-phone-pj" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Setor</Label>
              <Select value={formData.industry} onValueChange={(v) => handleChange("industry", v)}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl" data-testid="select-industry">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agronegocio">Agronegócio</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                  <SelectItem value="comercio">Comércio</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="construcao">Construção</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Porte</Label>
              <Select value={formData.companySize} onValueChange={(v) => handleChange("companySize", v)}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl" data-testid="select-company-size">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="me">Microempresa</SelectItem>
                  <SelectItem value="epp">EPP</SelectItem>
                  <SelectItem value="medio">Médio Porte</SelectItem>
                  <SelectItem value="grande">Grande Porte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Receita Bruta Anual" value={formData.annualRevenue} onChange={(v) => handleChange("annualRevenue", v)} placeholder="R$ 0,00" testId="input-revenue" />
            <InputField label="N. de Funcionários" value={formData.employeeCount} onChange={(v) => handleChange("employeeCount", v)} placeholder="Ex: 50" testId="input-employees" />
          </div>
        </div>
      );
    }

    if (step.id === "representative") {
      return (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">Dados complementares do representante legal:</p>
          <InputField icon={<FileText className="w-4 h-4" />} label="RG do Representante" value={formData.rg} onChange={(v) => handleChange("rg", v)} placeholder="Número do RG" testId="input-rg-pj" />
          <InputField label="Data de Nascimento" value={formData.birthDate} onChange={(v) => handleChange("birthDate", v)} placeholder="DD/MM/AAAA" type="date" testId="input-birthdate-pj" />
          <InputField label="Nome da Mãe" value={formData.motherName} onChange={(v) => handleChange("motherName", v)} placeholder="Nome completo" testId="input-mother-pj" />
          <InputField label="Qtd. de Maquinário" value={formData.machineryCount} onChange={(v) => handleChange("machineryCount", v)} placeholder="Ex: 10" testId="input-machinery" />
        </div>
      );
    }

    if (step.id === "address") {
      return (
        <div className="space-y-4">
          <InputField icon={<MapPin className="w-4 h-4" />} label="CEP" value={formData.zipCode} onChange={(v) => handleChange("zipCode", formatCEP(v))} placeholder="00000-000" testId="input-cep" />
          <InputField label="Endereço" value={formData.address} onChange={(v) => handleChange("address", v)} placeholder="Rua, número, complemento" testId="input-address" />
          <InputField label="Bairro" value={formData.neighborhood} onChange={(v) => handleChange("neighborhood", v)} placeholder="Bairro" testId="input-neighborhood" />
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <InputField label="Cidade *" value={formData.city} onChange={(v) => handleChange("city", v)} placeholder="Cidade" testId="input-city" />
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Estado *</Label>
              <Select value={formData.state} onValueChange={(v) => handleChange("state", v)}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl" data-testid="select-state">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BR.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    }

    if (step.id === "credentials") {
      return (
        <div className="space-y-4">
          <InputField icon={<Mail className="w-4 h-4" />} label="E-mail *" value={formData.email} onChange={(v) => handleChange("email", v)} placeholder="seu@email.com" type="email" testId="input-register-email" />
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium text-sm">Senha *</Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 group-focus-within:bg-[#92dc49]/10 group-focus-within:text-[#92dc49] transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                data-testid="input-register-password"
                className="pl-12 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium text-sm">Confirmar Senha *</Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 group-focus-within:bg-[#92dc49]/10 group-focus-within:text-[#92dc49] transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                data-testid="input-register-confirm-password"
                className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1628160424522-8692793b890a?q=80&w=2574&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#7ab635]/90 to-[#92dc49]/70"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
        <div className="hidden lg:flex flex-col text-white space-y-6">
          <div>
            <h1 className="text-7xl font-bold tracking-tighter">S.I.G.A</h1>
            <p className="text-2xl font-light text-white/90">Sistema Integrado<br />de Gestão Amazônica</p>
          </div>
          <div className="w-16 h-1 bg-white/50 rounded-full my-6"></div>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Plataforma completa para análise de crédito, monitoramento de garantias e gestão de projetos rurais e corporativos.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end w-full">
          <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl p-8 md:p-10 bg-white/95 max-h-[85vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight" data-testid="text-register-title">Criar Conta</h2>
                <p className="text-gray-500 text-sm">{steps[currentStep]?.label}</p>
              </div>

              {personType && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Etapa {currentStep + 1} de {totalSteps}</span>
                    <span className="text-xs font-semibold text-[#92dc49]">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-200 [&>*]:bg-[#92dc49]" data-testid="progress-register" />
                </div>
              )}

              <div className="min-h-[280px]">
                {renderStepContent()}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium" data-testid="text-register-error">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    data-testid="button-prev-step"
                    className="flex-1 h-12 rounded-full border-gray-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                  </Button>
                )}
                {isLastStep ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    data-testid="button-submit-register"
                    className="flex-1 h-12 bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold rounded-full shadow-lg shadow-[#92dc49]/40"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar Conta <ChevronRight className="w-5 h-5 ml-1" /></>}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    data-testid="button-next-step"
                    className="flex-1 h-12 bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold rounded-full shadow-lg shadow-[#92dc49]/40"
                  >
                    Continuar <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                )}
              </div>

              <div className="text-center pt-1">
                <Link href="/">
                  <span className="text-xs text-gray-500 hover:text-[#7ab635] cursor-pointer" data-testid="link-back-to-login">
                    Já tem uma conta? <span className="font-semibold text-[#7ab635]">Faça login</span>
                  </span>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center z-10 text-white/50 text-xs">
        &copy; 2026 Monetare. Todos os direitos reservados.
      </div>
    </div>
  );
}

function InputField({ icon, label, value, onChange, placeholder, type = "text", testId }) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium text-sm">{label}</Label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 group-focus-within:bg-[#92dc49]/10 group-focus-within:text-[#92dc49] transition-colors">
            {icon}
          </div>
        )}
        <Input
          type={type}
          className={`${icon ? "pl-12" : "pl-4"} h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={testId}
        />
      </div>
    </div>
  );
}
