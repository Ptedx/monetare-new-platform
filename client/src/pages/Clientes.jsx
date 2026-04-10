import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, RefreshCw } from "lucide-react";

const tabs = ["Dados", "Propostas", "Interações", "Documentos cadastrais"];

export function Clientes() {
  const [tab, setTab] = useState("Dados");

  return (
    <Layout>
      <div className="p-6 bg-[#f1f1f1] min-h-screen">
        <Card className="p-5 border-gray-200 shadow-sm">
          <h1 className="text-5xl text-gray-900 mb-4">Ficha do cliente</h1>
          <div className="flex gap-4 border-b border-gray-200 mb-4">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`text-xs pb-2 ${tab === item ? "text-gray-900 border-b-2 border-[#92dc49]" : "text-gray-500"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Dados" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-1">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
                  alt="Diego Santos"
                  className="w-28 h-28 rounded-full object-cover"
                />
                <p className="text-2xl text-gray-900">Diego Santos</p>
                <Badge className="bg-[#1b1b1b] text-white border-none">Produtor rural</Badge>
                <Badge className="bg-gray-200 text-gray-600 border-none">Cliente desde 2016</Badge>
              </div>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Dados pessoais</h3>
                <div className="grid grid-cols-2 gap-3">
                  <FieldSelect label="Tipo de pessoa" value="Pessoa física" />
                  <Field label="CPF" value="000.000.000-00" />
                  <Field label="Data de nascimento" value="24/05/1968" />
                  <FieldSelect label="Estado civil" value="Casado" />
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  <Field label="RG" value="000.000-00" />
                  <Field label="Órgão emissor" value="SSP/PA" />
                  <Field label="Nacionalidade" value="Brasileiro" />
                  <FieldSelect label="Sexo" value="Masculino" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field label="E-mail de contato" value="diego.santos@email.com" />
                  <Field label="Telefone de contato" value="(00) 00000-0000" />
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-gray-900 mb-2">Endereço</h3>
                <div className="space-y-3">
                  <Field label="CEP" value="00.000-000" />
                  <Field label="Logradouro" value="Rua do Corvo, Zumbi do Pacheco - Jaboatão dos Guararapes, PE" />
                  <Field label="Bairro" value="Zumbi do Pacheco" />
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Cidade" value="Jaboatão dos Guararapes" />
                    <FieldSelect label="UF" value="PE" />
                    <Field label="Número" value="14" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab === "Propostas" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconBtn icon={<Search className="w-4 h-4" />} />
                <Pill text="Segmento" />
                <Pill text="Fase" />
                <Pill text="Produto" />
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent text-[10px] text-gray-400">
                      <TableHead className="pl-2">ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Fase</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data de cadastro</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="pr-2 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="text-xs">
                      <TableCell className="pl-2 py-2">57DF52875-2D</TableCell>
                      <TableCell className="py-2"><span className="text-amber-600">⚠ ATRASO</span></TableCell>
                      <TableCell className="py-2">🌾 Rural</TableCell>
                      <TableCell className="py-2">3. Análise de Crédito</TableCell>
                      <TableCell className="py-2">R$ 50.000,000</TableCell>
                      <TableCell className="py-2">15/11/2025</TableCell>
                      <TableCell className="py-2">FNO - Agro</TableCell>
                      <TableCell className="pr-2 py-2 text-right">↗</TableCell>
                    </TableRow>
                    <TableRow className="text-xs">
                      <TableCell className="pl-2 py-2">57DF52875-2D</TableCell>
                      <TableCell className="py-2"><Badge className="bg-lime-100 text-lime-700 border border-lime-200">OK</Badge></TableCell>
                      <TableCell className="py-2">🌾 Rural</TableCell>
                      <TableCell className="py-2">3. Análise de Crédito</TableCell>
                      <TableCell className="py-2">R$ 50.000,000</TableCell>
                      <TableCell className="py-2">17/11/2025</TableCell>
                      <TableCell className="py-2">FNO - Agro</TableCell>
                      <TableCell className="pr-2 py-2 text-right">↗</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {tab === "Interações" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconBtn icon={<Search className="w-4 h-4" />} />
                <Pill text="Segmento" />
                <Pill text="Fase" />
                <Pill text="Produto" />
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent text-[10px] text-gray-400">
                      <TableHead className="pl-2">Data/hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Resumo</TableHead>
                      <TableHead className="pr-2">Próximo passo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="text-xs">
                      <TableCell className="pl-2 py-3">23/01/2026 15:32</TableCell>
                      <TableCell className="py-3"><Badge className="bg-gray-100 text-gray-600 border-gray-200">Visita</Badge></TableCell>
                      <TableCell className="py-3">Atualização cadastral</TableCell>
                      <TableCell className="py-3">Reavaliado novos veículos da Fazenda Boa Vista e novos entrantes de CCF...</TableCell>
                      <TableCell className="pr-2 py-3">Aguardar envio do contrato de arrendamento</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {tab === "Documentos cadastrais" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconBtn icon={<Search className="w-4 h-4" />} />
                <IconBtn icon={<Filter className="w-4 h-4" />} />
                <Pill text="Segmento" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-white p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documento 4 <span className="text-[10px] text-gray-400">PDF</span></p>
                      <p className="text-[10px] text-gray-500">Modificado em 23/03/2026 15:00</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" className="text-[#7ab635]"><RefreshCw className="w-4 h-4" /></button>
                      <span className="w-8 h-8 rounded-md bg-lime-100 text-[#5f8f2e] inline-flex items-center justify-center"><Eye className="w-4 h-4" /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">{label}</Label>
      <Input value={value} readOnly className="h-10 bg-white" />
    </div>
  );
}

function FieldSelect({ label, value }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">{label}</Label>
      <Select value={value}>
        <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value={value}>{value}</SelectItem></SelectContent>
      </Select>
    </div>
  );
}

function Pill({ text }) {
  return <Button variant="outline" className="h-8 rounded-md bg-white border-gray-200 text-xs">{text}</Button>;
}

function IconBtn({ icon }) {
  return <button type="button" className="w-8 h-8 rounded-md border border-gray-200 bg-white inline-flex items-center justify-center text-gray-500">{icon}</button>;
}
