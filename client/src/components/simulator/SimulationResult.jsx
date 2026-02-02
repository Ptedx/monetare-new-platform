import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

export function SimulationResult({ data, onBack }) {
    const { financeValue, term, rate, gracePeriod, amortizationSystem } = data;

    const calculateAmortization = () => {
        const monthlyRate = rate / 100 / 12;
        const installments = [];
        let balance = financeValue;

        // Grace Period (Interest Only)
        for (let i = 1; i <= gracePeriod; i++) {
            const interest = balance * monthlyRate;
            installments.push({
                month: i,
                installment: interest,
                interest: interest,
                amortization: 0,
                balance: balance
            });
        }

        // Amortization Period
        // We assume 'term' is the total payment period. So if term is 60 months, and grace is 12,
        // we have 60 months of amortization? Or 48? 
        // Usually "Prazo" in simulators is the amortization time. Let's assume AmortizationTerm = term.
        const amortizationMonths = term;
        let amortizationValue = 0;

        // PRICE Calculation Constants
        // PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
        const pricePayment = balance * (monthlyRate * Math.pow(1 + monthlyRate, amortizationMonths)) / (Math.pow(1 + monthlyRate, amortizationMonths) - 1);

        for (let i = 1; i <= amortizationMonths; i++) {
            const interest = balance * monthlyRate;
            let installmentAmount = 0;
            let currentAmortization = 0;

            if (amortizationSystem === 'price') {
                installmentAmount = pricePayment;
                currentAmortization = installmentAmount - interest;
            } else {
                // SAC
                currentAmortization = financeValue / amortizationMonths; // Constant Amortization
                installmentAmount = currentAmortization + interest;
            }

            balance -= currentAmortization;
            if (balance < 0) balance = 0; // Floating point correction

            installments.push({
                month: gracePeriod + i,
                installment: installmentAmount,
                interest: interest,
                amortization: currentAmortization,
                balance: balance
            });
        }

        return installments;
    };

    const rows = calculateAmortization();

    // Calculate Totals
    const totalPaid = rows.reduce((acc, row) => acc + row.installment, 0);
    const totalInterest = rows.reduce((acc, row) => acc + row.interest, 0);
    const firstInstallmentAfterGrace = rows[gracePeriod] ? rows[gracePeriod].installment : 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-4xl font-bold">Resultados de Simulação</h1>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <span className="bg-[#92dc49] text-white px-4 py-1 rounded-full text-sm font-medium">Pequeno Porte</span>
                <span className="bg-[#e8f5e0] text-[#7ab635] px-4 py-1 rounded-full text-sm font-medium border border-[#92dc49]">
                    Taxa de juros: {rate}% a.a. + IPCA (PÓS-FIXADA)
                </span>
                <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-medium border border-gray-200">
                    Sistema: {amortizationSystem?.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-8 shadow-sm">
                    <p className="text-3xl font-bold mb-1">{formatCurrency(financeValue)}</p>
                    <p className="text-gray-500">Valor financiado</p>
                </Card>
                <Card className="p-8 shadow-sm">
                    <p className="text-3xl font-bold mb-1">{formatCurrency(totalPaid)}</p>
                    <p className="text-gray-500">Total pago</p>
                </Card>
                <Card className="p-8 shadow-sm">
                    <p className="text-3xl font-bold mb-1">{formatCurrency(firstInstallmentAfterGrace)}</p>
                    <p className="text-gray-500">Primeira parcela após carência</p>
                </Card>
                <Card className="p-8 shadow-sm">
                    <p className="text-3xl font-bold mb-1">{formatCurrency(totalInterest)}</p>
                    <p className="text-gray-500">Total de juros</p>
                </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Simulação completa</h3>
            <div className="bg-[#2d3339] rounded-xl overflow-hidden shadow-lg">
                <div className="p-2 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                        <Minimize2 className="w-4 h-4" />
                    </Button>
                </div>
                <div className="max-h-[500px] overflow-auto">
                    <Table className="text-gray-300">
                        <TableHeader className="bg-[#1a1f24] sticky top-0">
                            <TableRow className="border-b-gray-700 hover:bg-transparent">
                                <TableHead className="text-white font-semibold">Mês</TableHead>
                                <TableHead className="text-white font-semibold">Parcela (R$)</TableHead>
                                <TableHead className="text-white font-semibold">Juros (R$)</TableHead>
                                <TableHead className="text-white font-semibold">Amortização (R$)</TableHead>
                                <TableHead className="text-white font-semibold">Saldo devedor (R$)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.month} className="border-b-gray-700 hover:bg-white/5">
                                    <TableCell>{String(row.month).padStart(2, '0')}</TableCell>
                                    <TableCell>{formatCurrency(row.installment)}</TableCell>
                                    <TableCell>{formatCurrency(row.interest)}</TableCell>
                                    <TableCell>{formatCurrency(row.amortization)}</TableCell>
                                    <TableCell>{formatCurrency(row.balance)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
