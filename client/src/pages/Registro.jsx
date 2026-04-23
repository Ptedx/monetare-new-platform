import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, User, Building2, Loader2, Eye, EyeOff, CheckCircle, Info } from "lucide-react";
import { userPersistence } from "@/lib/userPersistence";

const ESTADOS_BR = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatRG(value) {
  const v = value.replace(/\D/g, "").slice(0, 9);
  return v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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

function formatCNPJ(value) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatCurrency(value) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const amount = (parseFloat(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${amount}`;
}


const PF_STEPS = [
  { id: "type", title: "Qual o perfil para cadastro?", subtitle: "" },
  { id: "personal", title: "Conte-nos mais sobre você", subtitle: "Estas informações ajudam a garantir a segurança da sua conta e validar sua identidade." },
  { id: "address", title: "Onde você está?", subtitle: "Digite seu CEP para preenchermos o endereço automaticamente." },
  { id: "credentials", title: "Seu acesso SIGA", subtitle: "Para finalizar, precisamos de informações para gerar seu acesso." },
];

const PJ_STEPS = [
  { id: "type", title: "Qual o perfil para cadastro?", subtitle: "" },
  { id: "company", title: "Conte-nos mais sobre sua empresa", subtitle: "Estas informações ajudam a garantir a segurança da sua conta e validar sua identidade." },
  { id: "operational", title: "Detalhes operacionais", subtitle: "Precisamos entender melhor o tamanho e o setor do seu negócio." },
  { id: "personal", title: "Conte-nos mais sobre você (Sócio)", subtitle: "Estas informações identificam o responsável legal da conta." },
  { id: "address", title: "Onde você está?", subtitle: "Digite seu CEP para preenchermos o endereço automaticamente." },
  { id: "credentials", title: "Seu acesso SIGA", subtitle: "Para finalizar, precisamos de informações para gerar seu acesso." },
];

export function Registro() {
  const [, setLocation] = useLocation();

  const [personType, setPersonType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const [formData, setFormData] = useState({
    fullName: "",
    document: "",
    birthDate: "",
    rg: "",
    rgIssuer: "",
    nationality: "Brasileiro",
    gender: "",

    companyName: "",
    cnpj: "",
    tradeName: "",
    mainPartnerName: "",
    stateRegistration: "",
    foundedDate: "",
    industry: "",
    companySize: "",
    annualRevenue: "",
    machineryCount: "",
    employeeCount: "",

    zipCode: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    addressNumber: "",
    latitude: null,
    longitude: null,

    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    permissionId: "1004", // default client
  });

  useEffect(() => {
    const draft = userPersistence.getDraftRequest();
    if (draft) {
      setFormData(prev => ({
        ...prev,
        email: draft.email || prev.email,
        cnpj: draft.document || prev.cnpj,
        document: draft.document || prev.document,
        companyName: draft.businessName || prev.companyName,
      }));
      if (draft.document && draft.document.replace(/\D/g, "").length > 11) {
        setPersonType("PJ");
      } else if (draft.document) {
        setPersonType("PF");
      }
    }
  }, []);

  // Mock development
  const baseURL = "";

  const steps = personType === "PJ" ? PJ_STEPS : PF_STEPS;
  const totalSteps = steps.length;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCEPChange = async (value) => {
    const formattedValue = formatCEP(value);
    handleChange("zipCode", formattedValue);

    const cleanCEP = value.replace(/\D/g, "");

    if (cleanCEP.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));

          // Silent Nominatim Lookup for Coordinates integrando backend Lat Long requests
          const nominatimQuery = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brazil`;
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nominatimQuery)}&limit=1`)
            .then(res => res.json())
            .then(geoData => {
              if (geoData && geoData.length > 0) {
                setFormData(prev => ({
                  ...prev,
                  latitude: parseFloat(geoData[0].lat),
                  longitude: parseFloat(geoData[0].lon)
                }));
              }
            }).catch(console.error);
        }
      } catch (err) {
        // Silently Fail
      } finally {
        setCepLoading(false);
      }
    }
  };

  const validateCurrentStep = () => {
    const step = steps[currentStep];
    if (step.id === "type") {
      if (!personType) return "Selecione o tipo de perfil.";
    }
    if (step.id === "company") {
      if (!formData.companyName.trim()) return "Razão Social é obrigatória.";
      if (!formData.cnpj.trim()) return "CNPJ é obrigatório.";
      const cnpjDigits = formData.cnpj.replace(/\D/g, "");
      if (cnpjDigits.length !== 14) return "CNPJ deve ter 14 dígitos.";
      if (!formData.mainPartnerName.trim()) return "Nome do sócio principal é obrigatório.";
      if (!formData.foundedDate || formData.foundedDate.length !== 10) return "Data de constituição inválida.";
    }
    if (step.id === "operational") {
      if (!formData.industry) return "Setor é obrigatório.";
      if (!formData.companySize) return "Tamanho da empresa é obrigatório.";
      if (!formData.annualRevenue) return "Faturamento Anual é obrigatório.";
    }
    if (step.id === "personal") {
      if (!formData.fullName.trim()) return "Nome completo é obrigatório.";
      if (!formData.document.trim()) return "CPF é obrigatório.";
      const cpfDigits = formData.document.replace(/\D/g, "");
      if (cpfDigits.length !== 11) return "CPF deve ter 11 dígitos.";
      if (!formData.birthDate || formData.birthDate.length !== 10) return "Data de nascimento inválida.";
    }
    if (step.id === "address") {
      if (!formData.zipCode.trim()) return "CEP é obrigatório.";
      if (!formData.address.trim()) return "Logradouro é obrigatório.";
      if (!formData.city.trim()) return "Cidade é obrigatória.";
      if (!formData.state) return "Estado é obrigatório.";
    }
    if (step.id === "credentials") {
      if (!formData.email.trim()) return "E-mail é obrigatório.";
      if (!formData.password) return "Senha é obrigatória.";
      if (formData.password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
      if (formData.password !== formData.confirmPassword) return "As senhas não coincidem.";
      if (!formData.termsAccepted) return "Você precisa aceitar os Termos de Uso e Privacidade.";
    }
    return null;
  };

  const handleNext = () => {
    setError("");
    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setError("");
    if (currentStep === 0) {
      setLocation("/");
      return;
    }
    setCurrentStep((prev) => prev - 1);
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

      let isoBirthDate = null;
      if (formData.birthDate) {
        isoBirthDate = new Date(formData.birthDate + "T12:00:00.000Z").toISOString();
      }

      let isoFoundedDate = null;
      if (formData.foundedDate) {
        isoFoundedDate = new Date(formData.foundedDate + "T12:00:00.000Z").toISOString();
      }

      // Prepare payload to save locally
      const finalPayload = {
        name: personType === "PF" ? formData.fullName : formData.mainPartnerName,
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        permissionId: parseInt(formData.permissionId),
        pfType: personType === "PF" ? "FISICA" : "JURIDICA",
        userRole: 'cliente', // User's preference
        pfDetails: personType === "PF" ? {
          cpf: documentClean,
          rg: formData.rg || null,
          rgIssuer: formData.rgIssuer || null,
          birthDate: isoBirthDate,
          nationality: formData.nationality || null,
          gender: formData.gender || null,
          phone: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode.replace(/\D/g, "") || null,
        } : undefined,
        pjDetails: personType === "PJ" ? {
          cnpj: formData.cnpj.replace(/\D/g, ""),
          companyName: formData.companyName || null,
          tradeName: formData.tradeName || null,
          mainPartnerName: formData.mainPartnerName || null,
          foundedDate: isoFoundedDate,
          industry: formData.industry || null,
          companySize: formData.companySize ? formData.companySize.toUpperCase() : null,
          annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue.replace(/\D/g, "")) / 100 : null,
        } : undefined
      };

      // Save to localStorage instead of API
      userPersistence.saveUser(finalPayload);
      
      // If there was a draft, we can consider it "linked" and clear it
      userPersistence.clearDraftRequest();

      setRegistrationSuccess(true);
    } catch (err) {
      console.error("Submit Error:", err);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("O código deve ter 6 dígitos.");
      return;
    }
    setVerifying(true);
    // Mock simulation
    setTimeout(() => {
      setVerifying(false);
      setLocation("/");
    }, 1000);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1e12]">
        {/* Background Graphic overlay */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1628160424522-8692793b890a?q=80&w=2574&auto=format&fit=crop')` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#031105]/80 to-[#0c2414]/90"></div>
        </div>

        <Card className="z-10 w-full max-w-md bg-[#1a1a1a] border-[#333] p-10 rounded-2xl shadow-2xl flex flex-col pt-8">
          <CheckCircle className="w-12 h-12 text-[#92dc49] mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Cadastro realizado!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enviamos um código de verificação para o seu e-mail: <strong className="text-gray-200">{formData.email}</strong>.
            Para ativar sua conta e liberar o acesso ao sistema, insira o código de verificação abaixo:
          </p>

          <div className="bg-[#242424] rounded-xl p-4 flex flex-col gap-4 mb-6 border border-[#333]">
            <Input
              type="text"
              placeholder="000000"
              maxLength={6}
              className="text-center text-3xl tracking-[1em] font-mono h-16 bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-600 w-full ml-4"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <Button
            onClick={handleVerifyCode}
            disabled={verifying || verificationCode.length !== 6}
            className="w-[180px] bg-[#2a6836] hover:bg-[#348043] text-white font-medium rounded-lg h-11"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validar Meu E-mail'}
          </Button>

          <div className="mt-8 flex justify-between items-center text-sm border-t border-[#333] pt-6">
            <span className="text-gray-500">O código expira em 24 horas.</span>
            <button
              onClick={handleResendEmail}
              disabled={resendTimer > 0}
              className={`font-medium ${resendTimer > 0 ? 'text-gray-600' : 'text-[#92dc49] hover:underline'}`}
            >
              {resendTimer > 0 ? `Reenviar (${resendTimer}s)` : 'Reenviar código'}
            </button>
          </div>
          <Link href="/login" className="block mt-4 text-sm font-medium text-gray-500 hover:text-[#92dc49] transition-colors text-right">
            Voltar ao login
          </Link>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.id === "type") {
      return (
        <div className="grid grid-cols-2 gap-6 mt-6 w-full">
          <button
            type="button"
            onClick={() => { setPersonType("PF"); setError(""); setCurrentStep(1); }}
            className={`flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border transition-all h-[260px] ${personType === "PF"
              ? "border-[#92dc49] bg-white shadow-lg ring-2 ring-[#92dc49]/20"
              : "border-gray-100 bg-white hover:border-[#92dc49]/50 hover:shadow-md"
              }`}
          >
            <div className={`p-4 rounded-full ${personType === "PF" ? "bg-[#92dc49]/10 text-[#7ab635]" : "text-gray-400"}`}>
              <User className="w-10 h-10" />
            </div>
            <p className={`font-semibold text-lg ${personType === "PF" ? "text-gray-900" : "text-gray-600"}`}>Para mim</p>
          </button>

          <button
            type="button"
            onClick={() => { setPersonType("PJ"); setError(""); setCurrentStep(1); }}
            className={`flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border transition-all h-[260px] ${personType === "PJ"
              ? "border-[#92dc49] bg-white shadow-lg ring-2 ring-[#92dc49]/20"
              : "border-gray-100 bg-white hover:border-[#92dc49]/50 hover:shadow-md"
              }`}
          >
            <div className={`p-4 rounded-full ${personType === "PJ" ? "bg-[#92dc49]/10 text-[#7ab635]" : "text-gray-400"}`}>
              <Building2 className="w-10 h-10" />
            </div>
            <p className={`font-semibold text-lg ${personType === "PJ" ? "text-gray-900" : "text-gray-600"}`}>Para minha empresa</p>
          </button>
        </div>
      );
    }

    if (step.id === "company") {
      return (
        <div className="space-y-4 mt-6 w-full">
          <InputField label="Razão social" value={formData.companyName} onChange={(v) => handleChange("companyName", v)} placeholder="Insira a razão social da empresa" />
          <InputField label="CNPJ" value={formData.cnpj} onChange={(v) => handleChange("cnpj", formatCNPJ(v))} placeholder="00.000.000/0001-00" />
          <InputField label="Nome fantasia" value={formData.tradeName} onChange={(v) => handleChange("tradeName", v)} placeholder="Nome comercial ou fantasia" />
          <InputField label="Nome do sócio principal" value={formData.mainPartnerName} onChange={(v) => handleChange("mainPartnerName", v)} placeholder="Nome completo do sócio principal" />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Inscrição Estadual" value={formData.stateRegistration} onChange={(v) => handleChange("stateRegistration", v)} placeholder="0.000.000" />
            <div className="space-y-1.5 w-full">
              <Label className="text-gray-700 font-medium text-[13px] ml-1">Data de Constituição</Label>
              <Input
                type="date"
                max="9999-12-31"
                className="pl-4 pr-4 h-12 bg-white border-gray-200 focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl shadow-sm text-gray-700"
                value={formData.foundedDate}
                onChange={(e) => handleChange("foundedDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    }

    if (step.id === "operational") {
      return (
        <div className="space-y-4 mt-6 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 w-full">
              <Label className="text-gray-700 font-medium text-[13px] ml-1">Setor</Label>
              <Select value={formData.industry} onValueChange={(v) => handleChange("industry", v)}>
                <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl px-4 shadow-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agronegócio">Agronegócio</SelectItem>
                  <SelectItem value="Indústria">Indústria</SelectItem>
                  <SelectItem value="Comércio">Comércio</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 w-full">
              <Label className="text-gray-700 font-medium text-[13px] ml-1">Tamanho da Empresa</Label>
              <Select value={formData.companySize} onValueChange={(v) => handleChange("companySize", v)}>
                <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl px-4 shadow-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Microempresa">Microempresa (ME)</SelectItem>
                  <SelectItem value="Pequena">Pequena (EPP)</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <InputField label="Faturamento Anual Bruto (R$)" value={formData.annualRevenue} onChange={(v) => handleChange("annualRevenue", formatCurrency(v))} placeholder="R$ 0,00" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Qntd. de maquinário" value={formData.machineryCount} onChange={(v) => handleChange("machineryCount", v)} placeholder="0" type="number" />
            <InputField label="Qntd. de Funcionários" value={formData.employeeCount} onChange={(v) => handleChange("employeeCount", v)} placeholder="0" type="number" />
          </div>
        </div>
      );
    }

    if (step.id === "personal") {
      return (
        <div className="space-y-4 mt-6 w-full">
          <InputField label="Nome completo" value={formData.fullName} onChange={(v) => handleChange("fullName", v)} placeholder="Insira seu nome" />
          <InputField label="CPF" value={formData.document} onChange={(v) => handleChange("document", formatCPF(v))} placeholder="000.000.000-00" />
          <div className="space-y-1.5 w-full">
            <Label className="text-gray-700 font-medium text-[13px] ml-1">Data de nascimento</Label>
            <Input
              type="date"
              max="9999-12-31"
              className="pl-4 pr-4 h-12 bg-white border-gray-200 focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl shadow-sm text-gray-700"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="RG" value={formData.rg} onChange={(v) => handleChange("rg", formatRG(v))} placeholder="0.000.000" />
            <InputField label="Órgão emissor" value={formData.rgIssuer} onChange={(v) => handleChange("rgIssuer", v)} placeholder="SSP/DF" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nacionalidade" value={formData.nationality} onChange={(v) => handleChange("nationality", v)} placeholder="Brasileira" />
            <div className="space-y-1.5 w-full">
              <Label className="text-gray-700 font-medium text-[13px] ml-1">Sexo</Label>
              <Select value={formData.gender} onValueChange={(v) => handleChange("gender", v)}>
                <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl px-4 shadow-sm">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    }

    if (step.id === "address") {
      return (
        <div className="space-y-4 mt-6 w-full">
          <div className="space-y-1.5 w-full">
            <Label className="text-gray-700 font-medium text-[13px] ml-1">CEP</Label>
            <div className="relative">
              <Input
                type="text"
                className="pl-4 pr-10 h-12 bg-white border-gray-200 focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl shadow-sm"
                value={formData.zipCode}
                onChange={(e) => handleCEPChange(e.target.value)}
                placeholder="00.000-000"
              />
              {cepLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#92dc49]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>
          </div>

          <InputField label="Logradouro" value={formData.address} onChange={(v) => handleChange("address", v)} placeholder="Rua..." />
          <InputField label="Bairro" value={formData.neighborhood} onChange={(v) => handleChange("neighborhood", v)} placeholder="Bairro..." />

          <div className="grid grid-cols-[1fr_80px_100px] gap-4">
            <InputField label="Cidade" value={formData.city} onChange={(v) => handleChange("city", v)} placeholder="Cidade..." />
            <div className="space-y-1.5 w-full">
              <Label className="text-gray-700 font-medium text-[13px] ml-1">UF</Label>
              <Select value={formData.state} onValueChange={(v) => handleChange("state", v)}>
                <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl px-2 shadow-sm">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BR.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <InputField label="Número" value={formData.addressNumber} onChange={(v) => handleChange("addressNumber", v)} placeholder="Num..." />
          </div>
        </div>
      );
    }

    if (step.id === "credentials") {
      return (
        <div className="space-y-4 mt-6 w-full">
          <InputField label="E-mail" value={formData.email} onChange={(v) => handleChange("email", v)} placeholder="seuemail@com" type="email" />
          <InputField label="Telefone" value={formData.phone} onChange={(v) => handleChange("phone", formatPhone(v))} placeholder="(00) 00000-0000" />

          <div className="space-y-1.5 w-full">
            <Label className="text-gray-700 font-medium text-[13px] ml-1">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="pl-4 pr-10 h-12 bg-white border-gray-200 focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl shadow-sm"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="********"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 w-full">
            <Label className="text-gray-700 font-medium text-[13px] ml-1">Confirme sua senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="pl-4 pr-10 h-12 bg-white border-gray-200 focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl shadow-sm"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="********"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0a1e12]">
      {/* Background Graphic overlay (neural-tree network emulation via unsplash with dark overlay) */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1628160424522-8692793b890a?q=80&w=2574&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#031105]/80 to-[#0c2414]/90"></div>
      </div>

      <Card className="relative z-10 w-full max-w-2xl bg-[#f5f5f5] shadow-2xl rounded-[24px] p-6 sm:p-10 min-h-[500px] flex flex-col">
        {/* Top Progress Bar */}
        <div className="flex items-center gap-4 w-full mb-8">
          <button onClick={handlePrev} className="text-gray-800 hover:text-gray-500 transition-colors shrink-0 p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex gap-1.5 h-[5px]">
            {steps.map((_, stepIndex) => (
              <div key={stepIndex} className="h-full flex-1 rounded-full bg-gray-300 overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#92dc49] transition-all duration-300 ease-in-out"
                  style={{ width: currentStep > stepIndex ? '100%' : currentStep === stepIndex ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Scope */}
        <div className="flex-1 flex flex-col w-full max-w-xl mx-auto">
          <div className="text-center space-y-2 mb-2">
            <h2 className="text-[22px] font-medium text-gray-900">{steps[currentStep]?.title}</h2>
            {steps[currentStep]?.subtitle && (
              <p className="text-gray-500 text-[13px] max-w-xs mx-auto leading-relaxed">{steps[currentStep].subtitle}</p>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center w-full">
            {renderStepContent()}
          </div>

          {error && (
            <div className="p-3 mt-6 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium text-center w-full max-w-xl mx-auto">
              {error}
            </div>
          )}

          {currentStep > 0 && (
            <div className={`mt-10 flex w-full max-w-xl mx-auto ${isLastStep ? 'items-center justify-between gap-4' : 'justify-end'}`}>
              {isLastStep && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 text-[#92dc49] rounded border-gray-300 focus:ring-[#92dc49] accent-[#92dc49]"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                  />
                  <Label htmlFor="terms" className="text-[13px] text-gray-500 cursor-pointer">
                    Aceito os <span className="text-[#92dc49] font-medium hover:underline">Termos de Uso</span> e <span className="text-[#92dc49] font-medium hover:underline">Privacidade</span>
                  </Label>
                </div>
              )}

              <Button
                type="button"
                onClick={isLastStep ? handleSubmit : handleNext}
                disabled={isLoading}
                className={`h-11 px-8 bg-[#92dc49] hover:bg-[#7ab635] text-white font-semibold rounded-full shadow-lg shadow-[#92dc49]/30 transition-all text-sm w-[150px] ${isLastStep ? '' : 'ml-auto'}`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continuar'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-gray-700 font-medium text-[13px] ml-1">{label}</Label>
      <Input
        type={type}
        className="pl-4 h-12 bg-white border-gray-200 focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
