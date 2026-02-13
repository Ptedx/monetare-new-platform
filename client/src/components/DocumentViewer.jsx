import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, Image as ImageIcon, File, X, ChevronRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DocumentViewer({ documents = [], initialDocumentId, onClose }) {
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        if (documents.length > 0) {
            if (initialDocumentId) {
                const found = documents.find(d => d.id === initialDocumentId);
                setSelectedDoc(found || documents[0]);
            } else {
                setSelectedDoc(documents[0]);
            }
        }
    }, [documents, initialDocumentId]);

    const handleDownload = (doc) => {
        // Simulating download for now as we don't have real file URLs in the DB schema for all docs yet
        // In a real app, this would use doc.url or trigger a backend download endpoint
        const link = document.createElement('a');
        link.href = doc.url || '#'; // Fallback
        link.download = doc.fileName || doc.title || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`Download iniciado para: ${doc.title}`);
    };

    if (!documents || documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-gray-400 bg-gray-50 border rounded-lg">
                <File className="w-12 h-12 mb-4 opacity-20" />
                <p>Nenhum documento disponível para visualização.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] min-h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Sidebar List */}
            <div className="w-1/3 min-w-[300px] border-r border-gray-100 flex flex-col bg-gray-50/30">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-semibold text-gray-700">Documentos</h3>
                    <span className="text-xs text-gray-400">{documents.length} arquivos</span>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                        {documents.map((doc) => (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc)}
                                className={`
                                    flex items-start gap-3 p-3 rounded-lg text-left transition-all
                                    ${selectedDoc?.id === doc.id ? "bg-white shadow-sm border border-gray-100" : "hover:bg-gray-100 border border-transparent"}
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                    ${selectedDoc?.id === doc.id ? "bg-[#92dc49]/10 text-[#7ab635]" : "bg-gray-100 text-gray-400"}
                                `}>
                                    {doc.type?.includes("image") ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${selectedDoc?.id === doc.id ? "text-gray-900" : "text-gray-600"}`}>
                                        {doc.title || doc.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400 capitalize">{doc.category || "Geral"}</span>
                                        {doc.status && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${doc.status === 'valid' || doc.status === 'uploaded' || doc.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {doc.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {selectedDoc?.id === doc.id && <ChevronRight className="w-4 h-4 text-[#92dc49]" />}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col bg-gray-50/50">
                {selectedDoc ? (
                    <>
                        {/* Preview Header */}
                        <div className="h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between shadow-sm z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{selectedDoc.title || selectedDoc.name}</h2>
                                <p className="text-xs text-gray-400 flex items-center gap-2">
                                    Enviado em {selectedDoc.date || selectedDoc.createdAt ? new Date(selectedDoc.date || selectedDoc.createdAt).toLocaleDateString() : "-"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload(selectedDoc)}
                                    className="gap-2 text-gray-600 hover:text-[#92dc49] hover:border-[#92dc49]"
                                >
                                    <Download className="w-4 h-4" />
                                    Baixar
                                </Button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 p-8 overflow-auto flex items-center justify-center">
                            <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-3xl w-full min-h-[500px] flex items-center justify-center relative border border-gray-200">
                                {selectedDoc.type?.includes("image") ? (
                                    <img src={selectedDoc.url} alt={selectedDoc.title} className="max-w-full max-h-full object-contain" />
                                ) : selectedDoc.type?.includes("pdf") ? (
                                    <iframe src={selectedDoc.url} className="w-full h-[800px]" title="PDF Preview"></iframe>
                                ) : (
                                    <div className="text-center p-12">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FileText className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualização não disponível</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">
                                            Este formato de arquivo não pode ser visualizado diretamente no navegador.
                                            Por favor, faça o download para visualizar.
                                        </p>
                                        <Button
                                            onClick={() => handleDownload(selectedDoc)}
                                            className="mt-6 bg-[#92dc49] hover:bg-[#7ab635]"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Baixar Arquivo
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Selecione um documento para visualizar details
                    </div>
                )}
            </div>
        </div>
    );
}
