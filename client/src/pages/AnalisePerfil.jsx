import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Upload,
  Search
} from "lucide-react";

const mockAnalysis = {
  score: "A",
  riskLevel: 0.5,
  limits: {
    current: 80000000,
    used: 50000000,
    available: 30000000
  },
  indicators: [
    { name: "Histórico de Pagamento", score: 95, status: "excellent" },
    { name: "Endividamento", score: 78, status: "good" },
    { name: "Receita Líquida", score: 88, status: "excellent" },
    { name: "Garantias Disponíveis", score: 92, status: "excellent" },
    { name: "Tempo de Relacionamento", score: 65, status: "regular" },
  ]
};

export function AnalisePerfil() {
  const [searchType, setSearchType] = useState("cpf");
  const [searchValue, setSearchValue] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState({});

  const handleAnalyze = () => {
    setAnalyzed(true);
  };

  const handleAutoFill = (docId) => {
    setDocumentUploaded(prev => ({ ...prev, [docId]: true }));
  };

  const documents = [
    { id: "serasa", name: "Consulta Serasa" },
    { id: "receita", name: "Situação Receita Federal" },
    { id: "protestos", name: "Certidão de Protestos" },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Análise de Perfil</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Buscar Cliente</h3>
            <div className="space-y-4">
              <div>
                <Label>Tipo de Documento</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{searchType === 'cpf' ? 'CPF' : 'CNPJ'}</Label>
                <Input 
                  placeholder={searchType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-[#92dc49] hover:bg-[#7ab635]"
                onClick={handleAnalyze}
              >
                <Search className="w-4 h-4 mr-2" />
                Analisar Perfil
              </Button>
            </div>

            <hr className="my-6" />

            <h4 className="font-medium mb-4">Documentos Complementares</h4>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{doc.name}</span>
                  {documentUploaded[doc.id] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAutoFill(doc.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Auto
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {analyzed && (
            <div className="col-span-2">
              <Card className="p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Fernando Fagundes</h3>
                    <p className="text-gray-500">CPF: 000.000.000-00</p>
                    <p className="text-gray-500">Agronomia | 500-1000 funcionários</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">{mockAnalysis.score}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Score de Crédito</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Limite Atual</p>
                  <p className="text-xl font-bold">R$ 80.000.000</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Utilizado</p>
                  <p className="text-xl font-bold text-orange-600">R$ 50.000.000</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Disponível</p>
                  <p className="text-xl font-bold text-green-600">R$ 30.000.000</p>
                </Card>
              </div>

              <Card className="p-6">
                <h4 className="font-semibold mb-4">Indicadores de Análise</h4>
                <div className="space-y-4">
                  {mockAnalysis.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-48 text-sm">{indicator.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            indicator.status === 'excellent' ? 'bg-green-500' :
                            indicator.status === 'good' ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${indicator.score}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium">{indicator.score}%</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Cliente aprovado para novas operações</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Probabilidade de default: {mockAnalysis.riskLevel}%
                  </p>
                </div>
              </Card>
            </div>
          )}

          {!analyzed && (
            <div className="col-span-2 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Digite um CPF ou CNPJ para iniciar a análise</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
