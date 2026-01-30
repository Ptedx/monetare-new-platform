import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Download
} from "lucide-react";

const proposalTabs = [
  "Resumo", "Assinaturas", "Documentos", "Garantias", 
  "Projeto", "Perfil", "Pendências", "Linha do tempo", "Auditoria"
];

const mockDocuments = [
  { name: "Contrato Social", status: "uploaded", date: "15/01/2024" },
  { name: "Balanço Patrimonial", status: "uploaded", date: "15/01/2024" },
  { name: "DRE", status: "pending", date: null },
  { name: "Certidão Negativa", status: "pending", date: null },
  { name: "CNPJ", status: "uploaded", date: "10/01/2024" },
];

const mockGuarantees = [
  { type: "Imóvel Rural", value: "R$ 25.000.000", location: "Fazenda Soledade - MT", status: "Avaliado" },
  { type: "Imóvel Rural", value: "R$ 15.000.000", location: "Fazenda Aurora - MT", status: "Pendente" },
  { type: "Penhor Agrícola", value: "R$ 10.000.000", location: "Safra 2024/2025", status: "Em análise" },
];

const mockTimeline = [
  { date: "15/01/2024", event: "Proposta criada", user: "João Silva", status: "completed" },
  { date: "16/01/2024", event: "Documentos enviados", user: "Maria Santos", status: "completed" },
  { date: "18/01/2024", event: "Análise GEPEC iniciada", user: "Sistema", status: "completed" },
  { date: "20/01/2024", event: "Pendência: Documento faltante", user: "Carlos Oliveira", status: "pending" },
  { date: "Aguardando", event: "Aprovação GECRE", user: "-", status: "future" },
];

export function Propostas() {
  const [activeTab, setActiveTab] = useState("Resumo");
  const [documentStates, setDocumentStates] = useState({});

  const handleAutoFill = (docName) => {
    setDocumentStates(prev => ({
      ...prev,
      [docName]: 'uploaded'
    }));
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">Fernando Fagundes</h1>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">A</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Exportar</Button>
            <Button className="bg-[#92dc49] hover:bg-[#7ab635]">Aprovar</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b rounded-none h-auto p-0">
            {proposalTabs.map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#92dc49] data-[state=active]:bg-transparent px-4 py-2"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Resumo" className="mt-0">
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Dados Cadastrais</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">Empresa</span>
                    <span className="text-sm">Fernando Fagundes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">Indústria</span>
                    <span className="text-sm">Agronomia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">Tamanho</span>
                    <span className="text-sm">500-1000 funcionários</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">Cliente</span>
                    <span className="text-sm">Fernando Fagundes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">CPF</span>
                    <span className="text-sm">000.000.000-00</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">E-mail</span>
                    <span className="text-sm">fernando@fffagundes.com.br</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-20">Telefone</span>
                    <span className="text-sm">(00) 000000-0000</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <span className="text-sm text-gray-500 w-20">Endereço</span>
                    <span className="text-sm">Residencial Cláudio Marchetti, Rua Três – Cuiabá, MT 78076-308</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 col-span-2">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">Valor da proposta</p>
                    <p className="text-xl font-bold">R$ 50.000.000,00</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">Linha de crédito</p>
                    <p className="text-lg font-semibold">FNO - Agro</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">Vencimento</p>
                    <p className="text-lg font-semibold">28/11/2029</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">Precificação</p>
                    <p className="text-lg font-semibold">IPCA + 4.5%</p>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-3">Histórico de Propostas</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Proposta anterior</p>
                      <p className="text-xs text-gray-500">28/11/2023</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">FINALIZADO</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Proposta anterior</p>
                      <p className="text-xs text-gray-500">28/11/2020</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">FINALIZADO</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="Documentos" className="mt-0">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Documentos da Proposta</h3>
                <Button className="bg-[#92dc49] hover:bg-[#7ab635]">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Manual
                </Button>
              </div>
              <div className="space-y-4">
                {mockDocuments.map((doc, index) => {
                  const isUploaded = documentStates[doc.name] === 'uploaded' || doc.status === 'uploaded';
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {isUploaded && <p className="text-xs text-gray-500">Enviado em {doc.date || new Date().toLocaleDateString('pt-BR')}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isUploaded ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Baixar
                            </Button>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAutoFill(doc.name)}
                              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                              Preencher Automaticamente
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-1" />
                              Carregar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Garantias" className="mt-0">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Garantias Oferecidas</h3>
                <Button className="bg-[#92dc49] hover:bg-[#7ab635]">Adicionar Garantia</Button>
              </div>
              <div className="space-y-4">
                {mockGuarantees.map((guarantee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{guarantee.type}</p>
                      <p className="text-sm text-gray-500">{guarantee.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{guarantee.value}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        guarantee.status === 'Avaliado' ? 'bg-green-100 text-green-700' :
                        guarantee.status === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{guarantee.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[#e8f5e0] rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Total em Garantias</span>
                  <span className="font-bold text-lg">R$ 50.000.000,00</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Cobertura: 100% do valor da proposta</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Linha do tempo" className="mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Histórico da Proposta</h3>
              <div className="relative">
                {mockTimeline.map((item, index) => (
                  <div key={index} className="flex gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'pending' ? 'bg-orange-500' :
                        'bg-gray-300'
                      }`}>
                        {item.status === 'completed' ? <CheckCircle className="w-4 h-4 text-white" /> :
                         item.status === 'pending' ? <Clock className="w-4 h-4 text-white" /> :
                         <ChevronRight className="w-4 h-4 text-white" />}
                      </div>
                      {index < mockTimeline.length - 1 && (
                        <div className={`w-0.5 h-full min-h-[40px] ${
                          item.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-gray-500">{item.user}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Pendências" className="mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Pendências</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">Documento DRE faltante</p>
                      <p className="text-sm text-gray-500">Criado em 20/01/2024 por Carlos Oliveira</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Resolver</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Avaliação de garantia pendente</p>
                      <p className="text-sm text-gray-500">Criado em 18/01/2024 por Sistema</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Resolver</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Assinaturas" className="mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Assinaturas Necessárias</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Contrato de Financiamento</p>
                    <p className="text-sm text-gray-500">Assinatura do cliente</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm">Pendente</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Termo de Garantia</p>
                    <p className="text-sm text-gray-500">Assinatura do cliente</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm">Pendente</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Declaração de Responsabilidade</p>
                    <p className="text-sm text-gray-500">Assinatura do gerente</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">Assinado</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Projeto" className="mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Detalhes do Projeto</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Nome do Projeto</label>
                    <p className="font-medium">Expansão da Fazenda Fagundes</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Objetivo</label>
                    <p className="font-medium">Aquisição de terras e maquinário agrícola</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Prazo de Execução</label>
                    <p className="font-medium">24 meses</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Área Total</label>
                    <p className="font-medium">5.000 hectares</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Cultura Principal</label>
                    <p className="font-medium">Soja e Milho</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Previsão de Retorno</label>
                    <p className="font-medium">R$ 75.000.000 / safra</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Perfil" className="mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Análise de Perfil</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Score de Crédito</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">A</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating Interno</p>
                      <p className="text-2xl font-bold">0.5%</p>
                      <p className="text-xs text-gray-400">Probabilidade de default</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Limites</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Limite Atual</span>
                      <span className="font-medium">R$ 80.000.000,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Utilizado</span>
                      <span className="font-medium">R$ 50.000.000,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Disponível</span>
                      <span className="font-medium text-green-600">R$ 30.000.000,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="Auditoria" className="mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Log de Auditoria</h3>
              <div className="space-y-3">
                {[
                  { action: "Proposta visualizada", user: "João Silva", date: "25/01/2024 14:32" },
                  { action: "Documento anexado", user: "Maria Santos", date: "24/01/2024 10:15" },
                  { action: "Status alterado para GECRE", user: "Sistema", date: "23/01/2024 16:45" },
                  { action: "Parecer emitido", user: "Carlos Oliveira", date: "22/01/2024 09:00" },
                  { action: "Garantia adicionada", user: "João Silva", date: "20/01/2024 11:30" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.user}</p>
                    </div>
                    <span className="text-xs text-gray-400">{log.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
