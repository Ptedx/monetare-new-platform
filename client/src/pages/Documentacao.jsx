import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Documentacao() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all proposals for the current user
  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ["/api/proposals"],
  });

  // Fetch documents for each proposal
  const { data: allDocuments, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/proposals/documents"],
    queryFn: async () => {
      if (!proposals || proposals.length === 0) return [];

      const allDocs = [];
      for (const proposal of proposals) {
        const response = await fetch(
          `/api/proposals/${proposal.id}/documents`,
          { credentials: "include" }
        );
        if (response.ok) {
          const docs = await response.json();
          // Add proposal name to each document
          const docsWithProposal = docs.map((doc) => ({
            ...doc,
            proposalName: proposal.name,
          }));
          allDocs.push(...docsWithProposal);
        }
      }
      return allDocs;
    },
    enabled: proposals && proposals.length > 0,
  });

  // Filter documents by search term
  const filteredDocuments = useMemo(() => {
    if (!allDocuments) return [];
    if (!searchTerm) return allDocuments;

    return allDocuments.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allDocuments, searchTerm]);

  const isLoading = proposalsLoading || documentsLoading;

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

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Documentação</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-document-search"
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredDocuments.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-testid="text-no-documents"
          >
            Nenhum documento encontrado
          </div>
        )}

        {/* Documents Table */}
        {!isLoading && filteredDocuments.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Proposta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow
                    key={doc.id}
                    data-testid={`row-document-${doc.id}`}
                  >
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{doc.proposalName}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString("pt-BR")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
}
