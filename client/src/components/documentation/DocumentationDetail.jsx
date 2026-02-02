import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Eye, Send, MoreHorizontal, ArrowUpRight, Search, Filter, AlertTriangle, Building, User, Mail, Phone, MapPin, FileText, CheckCircle, Clock, ChevronRight } from "lucide-react";

export function DocumentationDetail({ client, onBack }) {
    const [activeTab, setActiveTab] = useState("Documentação");

    // Mock data specifically for the detail view
    const documents = [
        { id: 1, name: "Matrícula", emission: "02/11/2025", validity: "20/11/2025", status: "A VENCER" },
        { id: 2, name: "Projeto", emission: "02/11/2025", validity: "12/11/2025", status: "VENCIDO" },
        { id: 3, name: "IRPF 2024", emission: "02/11/2025", validity: "31/12/2025", status: "OK" },
        { id: 4, name: "Registro", emission: "02/11/2025", validity: "30/11/2025", status: "OK" },
        { id: 5, name: "IRPF 2025", emission: "02/11/2025", validity: "31/12/2026", status: "OK" },
        { id: 6, name: "Simulação", emission: "01/11/2025", validity: "31/12/2026", status: "OK" },
        { id: 7, name: "Matrícula 2", emission: "02/11/2025", validity: "20/11/2025", status: "A VENCER" },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case "A VENCER":
                return <Badge className="bg-orange-400 hover:bg-orange-500 text-white border-0">A VENCER</Badge>;
            case "VENCIDO":
                return <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">VENCIDO</Badge>;
            case "OK":
                return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">OK</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const tabs = ["Resumo", "Assinaturas", "Perfil", "Projeto", "Linha do tempo", "Documentação", "Garantias", "Pendências", "Auditoria"];

    return (
        <div className="space-y-6 bg-white rounded-xl shadow-sm p-6 min-h-[800px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-3xl font-bold">{client?.name || "Fernando Fagundes"}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Analisar Documentos
                    </Button>
                    <Button variant="outline" className="rounded-full">
                        Ações
                        <MoreHorizontal className="w-4 h-4 ml-2" />
                    </Button>
                    <Button className="bg-[#92dc49] hover:bg-[#7ab635] text-black rounded-full">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar para comitê
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-transparent border-b rounded-none h-auto p-0">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#92dc49] data-[state=active]:bg-transparent px-4 py-2"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="Documentação" className="mt-0 space-y-6">
                    {/* Alerts */}
                    <div className="bg-red-100 border border-red-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-red-800">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="font-medium">Matrícula do imóvel prestes a vencer. (Faltam 3 dias)</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-800">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="font-medium">Projeto vencido.</span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                            <Search className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="rounded-full">
                            Tipo
                            <MoreHorizontal className="w-4 h-4 ml-2 opacity-50" />
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-transparent">
                                    <TableHead className="w-[300px]">Nome</TableHead>
                                    <TableHead>Data de emissão</TableHead>
                                    <TableHead>Data de validade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>{doc.emission}</TableCell>
                                        <TableCell>{doc.validity}</TableCell>
                                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* --- Reuse Content from Proposals --- */}
                <TabsContent value="Resumo" className="mt-0">
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Dados Cadastrais</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500 w-20">Empresa</span>
                                    <span className="text-sm">{client?.name || "Fernando Fagundes"}</span>
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
                                    <p className="text-xs text-gray-500">Valor projetado</p>
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

                <TabsContent value="Garantias" className="mt-0">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Garantias Oferecidas</h3>
                            <Button className="bg-[#92dc49] hover:bg-[#7ab635]">Adicionar Garantia</Button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { type: "Imóvel Rural", value: "R$ 25.000.000", location: "Fazenda Soledade - MT", status: "Avaliado" },
                                { type: "Imóvel Rural", value: "R$ 15.000.000", location: "Fazenda Aurora - MT", status: "Pendente" },
                                { type: "Penhor Agrícola", value: "R$ 10.000.000", location: "Safra 2024/2025", status: "Em análise" },
                            ].map((guarantee, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{guarantee.type}</p>
                                        <p className="text-sm text-gray-500">{guarantee.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{guarantee.value}</p>
                                        <span className={`text-xs px-2 py-1 rounded ${guarantee.status === 'Avaliado' ? 'bg-green-100 text-green-700' :
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
                        <h3 className="text-lg font-semibold mb-6">Histórico</h3>
                        <div className="relative">
                            {[
                                { date: "15/01/2024", event: "Cliente criado", user: "João Silva", status: "completed" },
                                { date: "16/01/2024", event: "Documentos enviados", user: "Maria Santos", status: "completed" },
                                { date: "18/01/2024", event: "Análise inicial", user: "Sistema", status: "completed" },
                                { date: "20/01/2024", event: "Pendência: Matrícula", user: "Carlos Oliveira", status: "pending" },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 mb-6 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-green-500' :
                                            item.status === 'pending' ? 'bg-orange-500' :
                                                'bg-gray-300'
                                            }`}>
                                            {item.status === 'completed' ? <CheckCircle className="w-4 h-4 text-white" /> :
                                                item.status === 'pending' ? <Clock className="w-4 h-4 text-white" /> :
                                                    <ChevronRight className="w-4 h-4 text-white" />}
                                        </div>
                                        {index < 3 && ( // Simple check for line
                                            <div className={`w-0.5 h-full min-h-[40px] ${item.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
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
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="font-medium">Documento DRE faltante</p>
                                        <p className="text-sm text-gray-500">Criado em 20/01/2024 por Carlos Oliveira</p>
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
                                    <p className="font-medium">Termo de Consentimento</p>
                                    <p className="text-sm text-gray-500">Assinatura do cliente</p>
                                </div>
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm">Pendente</span>
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
                                    <p className="font-medium">Expansão da Fazenda</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Objetivo</label>
                                    <p className="font-medium">Aquisição de insumos</p>
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
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="Auditoria" className="mt-0">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Log de Auditoria</h3>
                        <div className="space-y-3">
                            {[
                                { action: "Cliente criado", user: "João Silva", date: "25/01/2024 14:32" },
                                { action: "Documento anexado", user: "Maria Santos", date: "24/01/2024 10:15" },
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
    );
}
