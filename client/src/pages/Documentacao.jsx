import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Folder, 
  ChevronRight,
  Download,
  Eye,
  Upload
} from "lucide-react";

const documentCategories = [
  {
    name: "Manuais Operacionais",
    icon: Folder,
    documents: [
      { name: "Manual de Crédito Rural", size: "2.4 MB", date: "15/01/2024" },
      { name: "Procedimentos de Análise", size: "1.8 MB", date: "10/01/2024" },
      { name: "Fluxo de Aprovação", size: "856 KB", date: "08/01/2024" },
    ]
  },
  {
    name: "Normativos",
    icon: Folder,
    documents: [
      { name: "Resolução BACEN 4.966", size: "1.2 MB", date: "05/01/2024" },
      { name: "Circular BNDES", size: "980 KB", date: "03/01/2024" },
      { name: "Manual FNO", size: "3.1 MB", date: "01/01/2024" },
    ]
  },
  {
    name: "Templates",
    icon: Folder,
    documents: [
      { name: "Modelo Contrato Financiamento", size: "245 KB", date: "20/12/2023" },
      { name: "Termo de Garantia", size: "180 KB", date: "18/12/2023" },
      { name: "Declaração de Responsabilidade", size: "95 KB", date: "15/12/2023" },
    ]
  },
  {
    name: "Treinamentos",
    icon: Folder,
    documents: [
      { name: "Capacitação Análise de Crédito", size: "15.2 MB", date: "10/12/2023" },
      { name: "Workshop Garantias", size: "8.7 MB", date: "05/12/2023" },
    ]
  },
];

export function Documentacao() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = documentCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.documents.some(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Documentação</h1>
          <Button className="bg-[#92dc49] hover:bg-[#7ab635]">
            <Upload className="w-4 h-4 mr-2" />
            Upload Documento
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Categorias</h3>
              <div className="space-y-2">
                {documentCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                      selectedCategory?.name === category.name 
                        ? 'bg-[#e8f5e0] text-[#5a8a2a]' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{category.documents.length}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="col-span-3">
            {selectedCategory ? (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Documentação
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{selectedCategory.name}</span>
                </div>

                <div className="space-y-3">
                  {selectedCategory.documents.map((doc, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#92dc49]" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredCategories.map((category, index) => (
                  <Card 
                    key={index}
                    className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#e8f5e0] flex items-center justify-center">
                        <Folder className="w-6 h-6 text-[#92dc49]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.documents.length} documentos</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {category.documents.slice(0, 2).map((doc, docIndex) => (
                        <p key={docIndex} className="text-sm text-gray-600 truncate">
                          • {doc.name}
                        </p>
                      ))}
                      {category.documents.length > 2 && (
                        <p className="text-sm text-gray-400">
                          +{category.documents.length - 2} mais
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
