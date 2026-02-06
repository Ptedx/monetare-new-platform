
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    ChevronLeft,
    Download,
    CheckCircle2,
    FileText,
    Share2,
    ShieldCheck
} from "lucide-react";

export function RegulatoryEventDetail({ onBack }) {
    return (
        <div className="p-8 bg-white min-h-screen font-sans max-w-5xl mx-auto">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900"
                onClick={onBack}
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Voltar
            </Button>

            {/* Header */}
            <div className="mb-8">
                <p className="text-gray-500 text-sm mb-1">Evento regulatório</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">fno.extract.validated</h1>
                <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-100 border-none uppercase tracking-wide px-3 py-1">
                    Inconformidade Detectada
                </Badge>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-gray-100 pb-8">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Data e hora</p>
                    <p className="font-semibold text-gray-900">29/01/2026 14:50 (BRT)</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 mb-1">Órgão</p>
                    <p className="font-semibold text-gray-900">Sudam / MIDR</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 mb-1">Correlation ID</p>
                    <p className="font-semibold text-gray-900 font-mono">journey-850064</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 mb-1">Usuário</p>
                    <p className="font-semibold text-gray-900">Sistema</p>
                </div>
            </div>

            {/* Contexto Regulatório */}
            <div className="mb-12 border-b border-gray-100 pb-8">
                <h3 className="text-gray-400 text-sm mb-6 uppercase tracking-wider font-medium">Contexto Regulatório</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Obrigação</p>
                        <p className="font-semibold text-gray-900 text-lg">Extrato FNO - Janeiro 2026</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Processo</p>
                        <p className="font-semibold text-gray-900 text-lg">Fundo Constitucional do Norte</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Evento anterior</p>
                        <p className="font-semibold text-gray-900 font-mono">fno.extract.generated</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Evento seguinte</p>
                        <p className="font-semibold text-gray-900 font-mono">scr3040.file.generated</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Status após este evento</p>
                        <p className="font-bold text-gray-900 uppercase">INCONFORME</p>
                    </div>
                </div>
            </div>

            {/* Resultado da Validação */}
            <div className="mb-12 border-b border-gray-100 pb-8">
                <h3 className="text-gray-400 text-sm mb-6 uppercase tracking-wider font-medium">Resultado da Validação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Tipo</p>
                        <p className="font-semibold text-gray-900">Inconforme</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Regra violada</p>
                        <p className="font-semibold text-gray-900 font-mono">FNO-RG-014</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Campo afetado</p>
                        <p className="font-semibold text-gray-900">Valor Contratado</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400 mb-1">Valor informado</p>
                        <p className="font-medium text-gray-900">R$ 1.200.000,00</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Valor apurado</p>
                        <p className="font-medium text-gray-900">R$ 1.185.000,00</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Diferença</p>
                        <p className="font-medium text-gray-900">R$ 15.000,00</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400 mb-1">Classificação de risco</p>
                        <p className="font-bold text-gray-900 uppercase">MÉDIO</p>
                    </div>
                </div>
            </div>

            {/* Evidências Técnicas */}
            <div className="mb-12">
                <h3 className="text-gray-400 text-sm mb-6 uppercase tracking-wider font-medium">Evidências técnicas</h3>

                <Card className="p-6 bg-gray-50 border-gray-100 shadow-none">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <FileText className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">extrato_fno_jan_2026.csv</p>
                            <p className="text-sm text-gray-500">29/01/2026 14:32</p>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 mb-6 font-mono text-[10px] text-gray-600 break-all leading-relaxed">
                        <strong className="block text-gray-500 mb-2 uppercase tracking-wide">HASH (SHA-256)</strong>
                        d8cb53d7e2cc4f8ae376083c4920d1a77cc2ef99456365d54cb108cbfe52d87ccfdac08995a664730d689190c4ff9ef920b63f555bcad0ec
                        2c38df5ce9013db3a74c0f053de1efed4b03b3a72c287645dcbcac24e8b01dc692f5565a674d1aca3a0365051249a383bb45311bd0db15b4c9
                        b06db4c2f46fe6a02c094e41535b9ea6a824f19e831627e8d863ad84e400cc2191af31dc07ec3729f92e91876329b373876cd7e4ce665eb309
                        8c35f69344c52a04023c1873542d489850dda9b062b7cc362ce5722f0f8058dbbba1c5635f932108525b958101451de5715855c4622ecf375
                        57320b20b5c28ab45078cac0e212159a44355201c9d3827845fccd9f6c12822aa23480ba9d5eeca65d72074a323da342c21233a0b7Dee7a0e
                        132100cc7520bae9359650d8116738dc1a62c3f0569df43ec7ced79f899651d65cb41acc5
                    </div>

                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-6">
                        <CheckCircle2 className="w-4 h-4" />
                        Integridade verificada
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-full border-green-600 text-green-700 hover:bg-green-50 px-6">
                            Ver evidência
                        </Button>
                        <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6">
                            Exportar
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Metadados Footer */}
            <div className="text-xs text-gray-400 border-t border-gray-100 pt-8 space-y-1">
                <p>ID do evento: EVT-20260129-00042</p>
                <p>Versão do sistema: v4.8.2</p>
                <p>Ambiente: Produção</p>
                <p>Registro imutável desde: 29/01/2026 14:50</p>
            </div>
        </div>
    );
}
