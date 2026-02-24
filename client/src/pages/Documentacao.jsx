import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Search,
  Folder,
  Clock,
  User,
  AlertTriangle,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentViewer } from "@/components/DocumentViewer";

export function Documentacao() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Fetch all proposals for the current user (Client sees only their own)
  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ["/api/proposals"],
  });

  // Fetch documents for the selected proposal OR all if searching? 
  // For the folder view, we might not need documents yet.
  // But strictly following the previous pattern, let's load documents when needed.
  // Actually, to show "alert" on folder if something is missing, we might need data, 
  // but let's stick to the user request: Folders -> Documents.

  const { data: proposalDocuments, isLoading: documentsLoading } = useQuery({
    queryKey: [`/api/proposals/${selectedProposal?.id}/documents`],
    enabled: !!selectedProposal,
    queryFn: async () => {
      if (!selectedProposal) return [];
      const res = await fetch(`/api/proposals/${selectedProposal.id}/documents`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    }
  });

  const filteredProposals = useMemo(() => {
    if (!proposals) return [];
    if (!searchTerm) return proposals;
    return proposals.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proposals, searchTerm]);

  // If inside a proposal, filter documents by search? 
  // The search bar in the new design seems to be for Proposals (Folders).
  // We can treat it as such for the main view.

  const getStatusBadge = (status) => {
    if (status === "uploaded") {
      return (
        <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/15 no-default-hover-elevate">
          Enviado
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/15 no-default-hover-elevate">
        Pendente
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  if (proposalsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Documentação</h1>

          {!selectedProposal ? (
            /* Proposal Folders View */
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar proposta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white rounded-full"
                  />
                  {/* <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" /> */}
                </div>
              </div>

              {filteredProposals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma proposta encontrada.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProposals.map((proposal) => (
                    <Card
                      key={proposal.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                          <Folder className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <span className="break-words line-clamp-1">{proposal.name}</span>
                        </div>
                        {/* Placeholder for alert if needed */}
                        {/* <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" /> */}
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(proposal.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* We can show user name or just 'Cliente' since they see their own */}
                          {/* <User className="w-4 h-4" />
                                            <span>Usuario</span> */}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-400">
                Mostrando {filteredProposals.length} de {proposals.length} resultados
              </p>
            </div>
          ) : (
            /* Document List View */
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setSelectedProposal(null)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Folder className="w-5 h-5 text-gray-600" />
                  {selectedProposal.name}
                </h2>
              </div>

              {documentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : !proposalDocuments || proposalDocuments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-md bg-gray-50/50">
                  Nenhum documento encontrado para esta proposta.
                </div>
              ) : (
                <div className="border rounded-md bg-white">
                  <DocumentViewer
                    documents={proposalDocuments.map(doc => ({
                      ...doc,
                      title: doc.title || doc.fileName || "Sem Título",
                      type: doc.fileType || 'pdf',
                      date: doc.createdAt,
                      url: doc.url || null
                    }))}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
