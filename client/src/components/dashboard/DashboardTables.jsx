import { Card } from "@/components/ui/card";
import { ArrowUpRight, Snowflake } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const alerts = [
    { proponent: "Coop. Santa Luzia", stage: "Crédito", sla: "80%", slaColor: "default" },
    { proponent: "Faz. Vale Verde", stage: "Registro", sla: "frozen", slaColor: "frozen" },
    { proponent: "José da Silva", stage: "Técnica", sla: "50%", slaColor: "default" },
    { proponent: "FFFagundes", stage: "Crédito", sla: "50%", slaColor: "default" },
    { proponent: "Cereano", stage: "Crédito", sla: "50%", slaColor: "default" },
];

const agenciesData = [
    { name: "Ag. Belém Leste", triagem: 4, tecnica: 59, credito: 24, garantias: 24, juridico: 75, contrato: 27, registro: 65, desembolso: 16 },
    { name: "Ag. Paragominas", triagem: 24, tecnica: 27, credito: 59, garantias: 75, juridico: 4, contrato: 65, registro: 16, desembolso: 24 },
    { name: "Ag. Castanhal", triagem: 59, tecnica: 4, credito: 75, garantias: 24, juridico: 27, contrato: 24, registro: 65, desembolso: 16 },
    { name: "Ag. Tailândia", triagem: 4, tecnica: 24, credito: 59, garantias: 75, juridico: 100, contrato: 65, registro: 27, desembolso: 100 },
    { name: "Ag. Bragança", triagem: 24, tecnica: 59, credito: 24, garantias: 24, juridico: 27, contrato: 75, registro: 65, desembolso: 16 },
    { name: "Ag. Redenção", triagem: 75, tecnica: 24, credito: 59, garantias: 24, juridico: 4, contrato: 27, registro: 65, desembolso: 16 },
    { name: "Ag. Canaã dos Carajás", triagem: 4, tecnica: 59, credito: 82, garantias: 100, juridico: 82, contrato: 59, registro: 24, desembolso: 16 },
    { name: "Ag. Barcarena", triagem: 59, tecnica: 24, credito: 4, garantias: 16, juridico: 24, contrato: 27, registro: 75, desembolso: 65 },
    { name: "Ag. Tailândia", triagem: 75, tecnica: 59, credito: 65, garantias: 24, juridico: 27, contrato: 24, registro: 16, desembolso: 4 },
    { name: "Ag. Rondon do Pará", triagem: 24, tecnica: 4, credito: 59, garantias: 24, juridico: 75, contrato: 27, registro: 65, desembolso: 16 },
];

// Helper to determine cell color based on value for Heatmap effect
const getCellClass = (value) => {
    if (value >= 100) return "bg-[#3e5714] text-white"; // Darkest green
    if (value >= 75) return "bg-[#4a6a18] text-white";
    if (value >= 60) return "bg-[#567d1d] text-white";
    if (value >= 40) return "bg-[#7ab635] text-white"; // Medium green
    if (value >= 20) return "bg-[#92dc49] text-gray-900"; // Light green
    if (value > 5) return "bg-[#d1f2b6] text-gray-900"; // Very light green
    return "bg-white text-gray-500";
};

export function DashboardTables() {
    return (
        /* Critical Alerts - Style matched to Photo 1 */
        <Card className="p-6 h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold">Alertas críticos</h3>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* Custom Table-like Layout using Grid/Divs for better "card row" styling */}
            <div className="w-full">
                {/* Header */}
                <div className="grid grid-cols-12 px-4 mb-2 text-sm font-semibold text-gray-900 leading-none">
                    <div className="col-span-6">Proponente</div>
                    <div className="col-span-3">Etapa</div>
                    <div className="col-span-3">SLA</div>
                </div>

                {/* Rows */}
                <div className="space-y-2">
                    {alerts.map((alert, i) => (
                        <div key={i} className="grid grid-cols-12 items-center bg-gray-50/50 hover:bg-gray-100 rounded-lg py-3 px-4 transition-colors">
                            <div className="col-span-6 font-medium text-gray-800 text-sm">
                                {alert.proponent}
                            </div>
                            <div className="col-span-3 text-sm text-gray-600">
                                {alert.stage}
                            </div>
                            <div className="col-span-3 text-sm">
                                {alert.sla === 'frozen' ? (
                                    <Snowflake className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <span className="font-semibold text-gray-700">{alert.sla}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

export function AgencyHeatmap() {
    return (
        <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Filas por agência</h3>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]"></TableHead>
                            <TableHead className="text-center text-xs">Triagem</TableHead>
                            <TableHead className="text-center text-xs">Técnica</TableHead>
                            <TableHead className="text-center text-xs">Crédito</TableHead>
                            <TableHead className="text-center text-xs">Garantias</TableHead>
                            <TableHead className="text-center text-xs">Jurídico</TableHead>
                            <TableHead className="text-center text-xs">Contrato</TableHead>
                            <TableHead className="text-center text-xs">Registro</TableHead>
                            <TableHead className="text-center text-xs">Desembolso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {agenciesData.map((agency, i) => (
                            <TableRow key={i} className="border-0 hover:bg-transparent">
                                <TableCell className="font-medium text-xs text-gray-600 py-1">{agency.name}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.triagem)}`}>{agency.triagem}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.tecnica)}`}>{agency.tecnica}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.credito)}`}>{agency.credito}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.garantias)}`}>{agency.garantias}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.juridico)}`}>{agency.juridico}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.contrato)}`}>{agency.contrato}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.registro)}`}>{agency.registro}</TableCell>
                                <TableCell className={`text-center text-xs border border-white font-medium py-1 ${getCellClass(agency.desembolso)}`}>{agency.desembolso}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}
