import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle } from "lucide-react";

export function ProfileSearch({ onAnalyze }) {
    const [searchType, setSearchType] = useState("cpf");
    const [searchValue, setSearchValue] = useState("");
    const [documentUploaded, setDocumentUploaded] = useState({});

    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskCNPJ = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const unmask = (value) => value.replace(/\D/g, '');

    const handleMaskedChange = (value) => {
        const rawValue = unmask(value);

        // Validation limits
        if (searchType === "cpf" && rawValue.length > 11) return;
        if (searchType === "cnpj" && rawValue.length > 14) return;

        // Apply mask
        const maskFunction = searchType === "cpf" ? maskCPF : maskCNPJ;
        const maskedValue = maskFunction(value);
        setSearchValue(maskedValue);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setSearchValue(""); // Clear value on type change
    };

    const handleAutoFill = (docId) => {
        setDocumentUploaded(prev => ({ ...prev, [docId]: true }));
    };

    const documents = [
        { id: "serasa", name: "Consulta Serasa" },
        { id: "receita", name: "Situação Receita Federal" },
        { id: "protestos", name: "Certidão de Protestos" },
    ];

    const handleAnalyzeClick = () => {
        // Basic validation before analyzing
        const rawValue = unmask(searchValue);
        if (searchType === "cpf" && rawValue.length < 11) return; // Could add alert
        if (searchType === "cnpj" && rawValue.length < 14) return; // Could add alert

        onAnalyze({ type: searchType, value: searchValue });
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Buscar Cliente</h3>
            <div className="space-y-4">
                <div>
                    <Label>Tipo de Documento</Label>
                    <Select value={searchType} onValueChange={handleSearchTypeChange}>
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
                        onChange={(e) => handleMaskedChange(e.target.value)}
                        maxLength={searchType === 'cpf' ? 14 : 18}
                    />
                </div>
                <Button
                    className="w-full bg-[#92dc49] hover:bg-[#7ab635]"
                    onClick={handleAnalyzeClick}
                    disabled={!searchValue} // Disable if empty
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
    );
}
