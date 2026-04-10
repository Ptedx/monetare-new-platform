import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  Trash2,
  Search,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useLocation } from "wouter";

const initialDocs = [
  { id: 1, name: "Documento 1", status: "idle" },
  { id: 2, name: "Documento 2", status: "error", error: "Uma ### foi anexada no lugar. Envie o documento correto." },
  { id: 3, name: "Documento 3", subtitle: "Descritivo", status: "idle" },
  { id: 4, name: "Documento 4", status: "done" },
  { id: 5, name: "Documento 5", status: "idle" },
];

export function CadastroProposta() {
  const [, setLocation] = useLocation();
  const userRole = localStorage.getItem("userRole") || "projetista";
  const [flow, setFlow] = useState("solicitacao");
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [docs, setDocs] = useState(initialDocs);
  const [uploadingIds, setUploadingIds] = useState([]);

  const [formData, setFormData] = useState({
    cpfCnpj: "000.000.000-00",
    personType: "Pessoa física",
    name: "João Branco dos Santos",
    birthDate: "01/01/1992",
    email: "joao.branco@email.com",
    phone: "(00) 00000-0000",
    profile: "Produtor rural",
    dependents: "2",
    source: "Agência",
    zip: "00.000-000",
    street: "Rua do Corvo, Zumbi do Pacheco - Jaboatão dos Guararapes, PE",
    neighborhood: "Zumbi do Pacheco",
    city: "Jaboatão dos Guararapes",
    uf: "PE",
    number: "14",
    segment: "Agro",
    product: "FNO",
    creditLine: "Amazônia Rural",
    culture: "Milho",
    purpose: "Custeio",
    projectValue: "R$ 000.000.000,00",
    financedValue: "R$ 000.000.000,00",
    termMonths: "144",
    graceMonths: "24",
    correctionIndex: "Pré-fixado",
    amortization: "SAC",
    totalArea: "3.000",
    productiveArea: "2.400",
    monthlyRevenue: "R$ 000.000.000",
    assetType: "Maquinário",
    assetName: "Trator",
    assetValue: "R$ 2.400",
  });

  const setField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));
  const handleBack = () => (flow === "documentacao" ? setFlow("solicitacao") : window.history.back());

  const handleUpload = (id) => {
    setUploadingIds((p) => [...p, id]);
    setTimeout(() => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status: "done", error: "" } : d)));
      setUploadingIds((p) => p.filter((x) => x !== id));
    }, 900);
  };

  const finalizeProposal = () => {
    const newProposal = {
      id: Date.now(),
      name: "Fernando Fagundes",
      score: "B",
      status: "OK",
      segment: "Rural",
      stage: "1. CECAD",
      value: formData.projectValue,
      date: new Date().toLocaleDateString("pt-BR"),
      line: "FNO - Agro",
      registrationData: {
        personType: formData.personType,
        birthDate: formData.birthDate,
        cpf: formData.cpfCnpj,
        civilStatus: "Casado",
        dependents: formData.dependents,
        rg: "000.000-00",
        issuingAgency: "SSP/PA",
        nationality: "Brasileiro",
        gender: "Masculino",
        contactEmail: formData.email,
        contactPhone: formData.phone,
        sourceChannel: formData.source,
        cep: formData.zip,
        georeference: "Nova Canaã do Norte, MT",
        street: formData.street,
        neighborhood: formData.neighborhood,
        city: formData.city,
        uf: formData.uf,
        number: formData.number,
        latitude: "-3.2975",
        longitude: "-3.2975",
        totalArea: "1.200 ha",
      },
    };
    const all = JSON.parse(localStorage.getItem("proposals") || "[]");
    localStorage.setItem("proposals", JSON.stringify([newProposal, ...all]));
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white p-12 rounded-3xl shadow-sm text-center w-full max-w-2xl mx-4">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#92dc49]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Proposta cadastrada com sucesso</h2>
              <Button
                className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white px-8"
                onClick={() => setLocation(userRole === "cliente" ? "/propostas" : "/carteira")}
              >
                Ir para carteira
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const progressCount = 4;
  const activeProgress = flow === "solicitacao" ? step : flow === "documentacao" ? 1 : 3;

  return (
    <Layout>
      <div className="p-5 max-w-[980px] mx-auto min-h-screen">
        <Card className="p-5 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </Button>
              <h1 className="text-5xl text-gray-900">Cadastro de Proposta</h1>
            </div>
            <Button variant="outline" className="rounded-full border-[#7ab635] text-[#5f8f2e]">
              <RotateCw className="w-4 h-4 mr-2" />
              Salvar rascunho
            </Button>
          </div>

          <p className="text-sm text-gray-500 uppercase mb-3">
            {flow === "solicitacao" ? "Nova solicitação" : flow === "documentacao" ? "Documentação" : "Finalização"}
          </p>
          <div className="grid grid-cols-4 gap-1 mb-6">
            {Array.from({ length: progressCount }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full ${i + 1 <= activeProgress ? "bg-[#92dc49]" : "bg-gray-300"}`}></div>
            ))}
          </div>

          {flow === "solicitacao" && step === 1 && (
            <div className="space-y-4">
              <h2 className="text-4xl text-gray-900">Dados pessoais do seu cliente</h2>
              <div className="space-y-2">
                <Label>CPF/CNPJ</Label>
                <div className="flex gap-2">
                  <Input value={formData.cpfCnpj} onChange={(e) => setField("cpfCnpj", e.target.value)} className="h-12" />
                  <Button className="h-12 px-4 bg-[#92dc49] hover:bg-[#7ab635]">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={formData.personType} onValueChange={(v) => setField("personType", v)}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pessoa física">Pessoa física</SelectItem>
                    <SelectItem value="Pessoa jurídica">Pessoa jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome / Razão Social" value={formData.name} onChange={(v) => setField("name", v)} />
                <Field label="Data de nascimento/constituição" value={formData.birthDate} onChange={(v) => setField("birthDate", v)} />
                <Field label="E-mail" value={formData.email} onChange={(v) => setField("email", v)} />
                <Field label="Telefone" value={formData.phone} onChange={(v) => setField("phone", v)} />
                <div className="space-y-2">
                  <Label>Perfil do cliente</Label>
                  <Select value={formData.profile} onValueChange={(v) => setField("profile", v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Produtor rural">Produtor rural</SelectItem></SelectContent>
                  </Select>
                </div>
                <Field label="Número de dependentes" value={formData.dependents} onChange={(v) => setField("dependents", v)} />
              </div>
              <div className="grid grid-cols-4 gap-3 border-t border-gray-200 pt-3">
                <Field label="CEP" value={formData.zip} onChange={(v) => setField("zip", v)} />
                <div className="col-span-3"><Field label="Logradouro" value={formData.street} onChange={(v) => setField("street", v)} /></div>
                <div className="col-span-4"><Field label="Bairro" value={formData.neighborhood} onChange={(v) => setField("neighborhood", v)} /></div>
                <div className="col-span-2"><Field label="Cidade" value={formData.city} onChange={(v) => setField("city", v)} /></div>
                <div className="col-span-1">
                  <div className="space-y-2">
                    <Label>UF</Label>
                    <Select value={formData.uf} onValueChange={(v) => setField("uf", v)}>
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="PE">PE</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="col-span-1"><Field label="Número" value={formData.number} onChange={(v) => setField("number", v)} /></div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-[#295b11] px-8">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {flow === "solicitacao" && step === 2 && (
            <div className="space-y-4">
              <h2 className="text-4xl text-gray-900">Dados da proposta</h2>
              <div className="grid grid-cols-4 gap-3">
                {["Agro", "Corporate", "Middle market", "Varejo"].map((s) => (
                  <button key={s} type="button" className={`h-20 rounded-2xl border text-left px-4 text-3xl ${s === formData.segment ? "bg-[#92dc49] border-[#92dc49]" : "bg-gray-100 border-gray-200"}`} onClick={() => setField("segment", s)}>{s}</button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["FNO", "BNDES", "FDA", "FINAM", "PRONAF", "PLANO SAFRA"].map((p) => (
                  <button key={p} type="button" className={`h-12 rounded-xl border text-left px-3 ${p === formData.product ? "bg-[#92dc49] border-[#92dc49]" : "bg-white border-gray-200"}`} onClick={() => setField("product", p)}>{p}</button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Linha de crédito</Label>
                  <Select value={formData.creditLine} onValueChange={(v) => setField("creditLine", v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Amazônia Rural">Amazônia Rural</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Principal cultura</Label>
                  <Select value={formData.culture} onValueChange={(v) => setField("culture", v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Milho">Milho</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Finalidade do crédito</Label>
                  <Select value={formData.purpose} onValueChange={(v) => setField("purpose", v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Custeio">Custeio</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Valor do projeto" value={formData.projectValue} onChange={(v) => setField("projectValue", v)} />
                <Field label="Valor financiado" value={formData.financedValue} onChange={(v) => setField("financedValue", v)} />
                <Field label="Prazo (em meses)" value={formData.termMonths} onChange={(v) => setField("termMonths", v)} />
                <Field label="Carência (em meses)" value={formData.graceMonths} onChange={(v) => setField("graceMonths", v)} />
                <div className="space-y-2">
                  <Label>Índice de correção</Label>
                  <Select value={formData.correctionIndex} onValueChange={(v) => setField("correctionIndex", v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Pré-fixado">Pré-fixado</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sistema de amortização</Label>
                  <Select value={formData.amortization} onValueChange={(v) => setField("amortization", v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="SAC">SAC</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(3)} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-[#295b11] px-8">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {flow === "solicitacao" && step === 3 && (
            <div className="space-y-4">
              <h2 className="text-4xl text-gray-900">Produção e garantias</h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Área total (em hectares)" value={formData.totalArea} onChange={(v) => setField("totalArea", v)} />
                <Field label="Área produtiva (em hectares)" value={formData.productiveArea} onChange={(v) => setField("productiveArea", v)} />
                <div className="col-span-2"><Field label="Faturamento mensal" value={formData.monthlyRevenue} onChange={(v) => setField("monthlyRevenue", v)} /></div>
              </div>
              <div>
                <p className="text-3xl text-gray-900">Garantias</p>
                <p className="text-sm text-gray-500 mb-3">Imóveis, equipamentos, maquinário, etc.</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Tipo de ativo</Label>
                    <Select value={formData.assetType} onValueChange={(v) => setField("assetType", v)}>
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Maquinário">Maquinário</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <Field label="Nome do ativo" value={formData.assetName} onChange={(v) => setField("assetName", v)} />
                  <Field label="Valor do ativo" value={formData.assetValue} onChange={(v) => setField("assetValue", v)} />
                </div>
                <button type="button" className="w-full h-10 mt-2 rounded-md border border-[#8dc56a] text-[#5f8f2e] flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar garantia
                </button>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(4)} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-[#295b11] px-8">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {flow === "solicitacao" && step === 4 && (
            <div className="min-h-[360px] flex flex-col justify-between">
              <h2 className="text-[52px] leading-[56px] text-gray-900 mt-12">Um rascunho da<br />proposta foi salvo.</h2>
              <div className="flex justify-end">
                <Button onClick={() => { setFlow("documentacao"); setStep(1); }} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-[#295b11] px-8">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continuar para documentação
                </Button>
              </div>
            </div>
          )}

          {flow === "documentacao" && (
            <div className="space-y-4">
              <h2 className="text-5xl text-gray-900">Documentos</h2>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.id} className={`rounded-lg border p-3 ${doc.status === "done" ? "bg-[#cae8bc] border-[#b7daa8]" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl text-gray-900">{doc.name}</p>
                        {doc.subtitle ? <p className="text-xs text-gray-500">{doc.subtitle}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === "done" ? (
                          <>
                            <button type="button" className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            <button type="button" className="text-green-600"><Eye className="w-4 h-4" /></button>
                          </>
                        ) : uploadingIds.includes(doc.id) ? (
                          <span className="text-sm text-gray-500">...</span>
                        ) : (
                          <>
                            {doc.status === "error" ? <span className="w-12 h-12 rounded-xl bg-red-200 text-red-700 inline-flex items-center justify-center"><AlertCircle className="w-5 h-5" /></span> : null}
                            <button type="button" onClick={() => handleUpload(doc.id)} className="text-[#92dc49]"><Upload className="w-5 h-5" /></button>
                          </>
                        )}
                      </div>
                    </div>
                    {doc.error ? <p className="text-red-500 text-sm mt-1">{doc.error}</p> : null}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setFlow("finalizacao")} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-[#295b11] px-8">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {flow === "finalizacao" && (
            <div className="space-y-5">
              <h2 className="text-4xl text-gray-900">Revise a proposta</h2>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Dados pessoais</h3>
                <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <Info label="Tipo de pessoa" value={formData.personType} />
                  <Info label="CPF" value={formData.cpfCnpj} />
                  <Info label="Nome" value={formData.name} />
                  <Info label="Data de nascimento" value={formData.birthDate} />
                  <Info label="Telefone" value={formData.phone} />
                  <Info label="E-mail" value={formData.email} />
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Endereço</h3>
                <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
                  <Info label="CEP" value={formData.zip} />
                  <Info label="UF" value={formData.uf} />
                  <Info label="Logradouro" value={formData.street} />
                  <Info label="" value="" />
                  <Info label="Bairro" value={formData.neighborhood} />
                  <Info label="Cidade" value={formData.city} />
                  <Info label="Número" value={formData.number} />
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Solicitação</h3>
                <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
                  <Info label="Segmento" value={formData.segment} />
                  <Info label="Produto" value={formData.product} />
                  <Info label="Principal cultura" value={formData.culture} />
                  <Info label="Finalidade" value={formData.purpose} />
                  <Info label="Prazo" value={`${formData.termMonths} meses`} />
                  <Info label="Carência" value={`${formData.graceMonths} meses`} />
                  <Info label="Valor do projeto" value={formData.projectValue} />
                  <Info label="Valor solicitado" value={formData.financedValue} />
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Produção</h3>
                <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <Info label="Área total" value={`${formData.totalArea} ha`} />
                  <Info label="Área produtiva" value={`${formData.productiveArea} ha`} />
                  <Info label="Faturamento mensal" value={formData.monthlyRevenue} />
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Garantias</h3>
                <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <Info label="Tipo" value={formData.assetType} />
                  <Info label="Nome do ativo" value={formData.assetName} />
                  <Info label="Valor do ativo" value={formData.assetValue} />
                  <Info label="Tipo" value="Equipamento" />
                  <Info label="Nome do ativo" value="Plantadeira" />
                  <Info label="Valor do ativo" value="R$ 530.000,00" />
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Documentos</h3>
                <div className="space-y-2">
                  {docs
                    .filter((d) => d.status === "done" || d.status === "error")
                    .map((doc) => (
                      <div key={doc.id} className="rounded-lg border border-gray-200 bg-white p-3 flex items-center justify-between">
                        <div>
                          <p className="text-lg text-gray-900">{doc.name} <span className="text-xs text-gray-400">PDF</span></p>
                          <p className="text-xs text-gray-500">Modificado em 23/03/2026 15:00</p>
                        </div>
                        <span className="w-8 h-8 rounded-md bg-lime-100 text-[#5f8f2e] inline-flex items-center justify-center"><Eye className="w-4 h-4" /></span>
                      </div>
                    ))}
                </div>
              </section>

              <div className="flex justify-end">
                <Button onClick={finalizeProposal} className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-[#295b11] px-8">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Finalizar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange?.(e.target.value)} className="h-12" />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      {label ? <p className="text-xs text-gray-500">{label}</p> : null}
      {value ? <p className="text-xl text-gray-900 leading-6">{value}</p> : null}
    </div>
  );
}
