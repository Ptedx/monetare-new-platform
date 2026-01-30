import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, DollarSign, Percent, Calendar, FileText, Upload } from "lucide-react";

export function Simulador() {
  const [valor, setValor] = useState(50000000);
  const [prazo, setPrazo] = useState(60);
  const [taxa, setTaxa] = useState(4.5);
  const [carencia, setCarencia] = useState(12);
  const [linha, setLinha] = useState("fno-agro");
  const [documentUploaded, setDocumentUploaded] = useState({});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const parcela = (valor * (1 + (taxa/100) * (prazo/12))) / prazo;
  const totalJuros = parcela * prazo - valor;
  const totalPagar = valor + totalJuros;

  const documents = [
    { id: "balanco", name: "Balanço Patrimonial" },
    { id: "dre", name: "DRE - Demonstração de Resultados" },
    { id: "faturamento", name: "Comprovante de Faturamento" },
  ];

  const handleAutoFill = (docId) => {
    setDocumentUploaded(prev => ({ ...prev, [docId]: true }));
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Simulador</h1>
          <Button className="bg-[#92dc49] hover:bg-[#7ab635]">
            <Calculator className="w-4 h-4 mr-2" />
            Nova Simulação
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Parâmetros da Simulação</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Linha de Crédito</Label>
                    <Select value={linha} onValueChange={setLinha}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a linha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fno-agro">FNO - Agro</SelectItem>
                        <SelectItem value="fne-rural">FNE - Rural</SelectItem>
                        <SelectItem value="bndes-agro">BNDES Agro</SelectItem>
                        <SelectItem value="pronaf">PRONAF</SelectItem>
                        <SelectItem value="pronamp">PRONAMP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Valor do Financiamento</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input 
                        type="text"
                        value={formatCurrency(valor)}
                        className="pl-9"
                        readOnly
                      />
                    </div>
                    <Slider
                      value={[valor]}
                      onValueChange={([v]) => setValor(v)}
                      min={1000000}
                      max={200000000}
                      step={1000000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>R$ 1 Mi</span>
                      <span>R$ 200 Mi</span>
                    </div>
                  </div>

                  <div>
                    <Label>Prazo (meses)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        value={prazo}
                        onChange={(e) => setPrazo(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                    <Slider
                      value={[prazo]}
                      onValueChange={([v]) => setPrazo(v)}
                      min={12}
                      max={120}
                      step={6}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>12 meses</span>
                      <span>120 meses</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Carência (meses)</Label>
                    <Select value={String(carencia)} onValueChange={(v) => setCarencia(Number(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Período de carência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 meses</SelectItem>
                        <SelectItem value="12">12 meses</SelectItem>
                        <SelectItem value="18">18 meses</SelectItem>
                        <SelectItem value="24">24 meses</SelectItem>
                        <SelectItem value="36">36 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Taxa de Juros (% a.a.)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input 
                        type="number"
                        step="0.1"
                        value={taxa}
                        onChange={(e) => setTaxa(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">IPCA + {taxa}%</p>
                  </div>

                  <div>
                    <Label>Sistema de Amortização</Label>
                    <Select defaultValue="sac">
                      <SelectTrigger>
                        <SelectValue placeholder="Sistema de amortização" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sac">SAC - Sistema de Amortização Constante</SelectItem>
                        <SelectItem value="price">PRICE - Parcelas Fixas</SelectItem>
                        <SelectItem value="sacre">SACRE - Sistema Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <h4 className="font-medium mb-4">Documentos para Análise</h4>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span>{doc.name}</span>
                    </div>
                    {documentUploaded[doc.id] ? (
                      <span className="text-green-600 text-sm flex items-center gap-1">
                        ✓ Documento carregado
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAutoFill(doc.id)}
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          Preencher Automaticamente
                        </Button>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-1" />
                          Carregar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-gradient-to-br from-[#92dc49] to-[#7ab635] text-white">
              <h3 className="text-lg font-semibold mb-6">Resultado da Simulação</h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Valor Financiado</p>
                  <p className="text-2xl font-bold">{formatCurrency(valor)}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Parcela Mensal Estimada</p>
                  <p className="text-2xl font-bold">{formatCurrency(parcela)}</p>
                  <p className="text-xs opacity-60">Após período de carência</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Total de Juros</p>
                  <p className="text-xl font-bold">{formatCurrency(totalJuros)}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Valor Total a Pagar</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPagar)}</p>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-white text-[#92dc49] hover:bg-gray-100">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Gerar Proposta
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-4">
              <h4 className="font-medium mb-3">Condições da Linha</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Linha</span>
                  <span className="font-medium">FNO - Agro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa Mínima</span>
                  <span className="font-medium">IPCA + 3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa Máxima</span>
                  <span className="font-medium">IPCA + 7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prazo Máximo</span>
                  <span className="font-medium">120 meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Carência Máxima</span>
                  <span className="font-medium">36 meses</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
