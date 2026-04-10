import * as db from "../db";
import { MockProposal, MockUser, MockDocument } from "../types";

function nextProposalId(): number {
  const ids = db.getCollection<MockProposal>("proposals").map((p) => p.id);
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

export function handleGetProposals() {
  const proposals = db.getCollection<MockProposal>("proposals");
  return { status: 200, body: proposals };
}

export function handleGetProposal(id: string) {
  const proposal = db.getById<MockProposal>("proposals", parseInt(id, 10));
  if (!proposal) return { status: 404, body: { message: "Proposta não encontrada" } };
  const documents = db.getCollection<MockDocument>("documents").filter(
    (d) => d.proposalId === parseInt(id, 10),
  );
  const user = db.getById<MockUser>("users", proposal.userId);
  const result: Record<string, unknown> = { ...proposal, documents };
  if (user) {
    const { password: _, ...safeUser } = user;
    result.user = safeUser;
  }
  return { status: 200, body: result };
}

export function handleCreateProposal(body: unknown) {
  const data = body as Record<string, unknown>;
  const proposal: MockProposal = {
    id: nextProposalId(),
    title: (data.title as string) ?? "Nova Proposta",
    type: (data.type as string) ?? "AGRO",
    requestedValue: (data.requestedValue as number) ?? 0,
    financedValue: (data.financedValue as number) ?? 0,
    term: (data.term as number) ?? 60,
    gracePeriod: (data.gracePeriod as number) ?? 12,
    purpose: (data.purpose as string) ?? "INVESTIMENTO",
    sector: (data.sector as string) ?? "",
    creditType: (data.creditType as string) ?? "FNO",
    status: "ATIVA",
    department: (data.department as string) ?? "CECAD",
    userId: (data.userId as string) ?? "",
    analystId: (data.analystId as string) ?? "",
    createdAt: new Date().toISOString(),
    companyName: (data.companyName as string) ?? "",
  };
  db.createItem<MockProposal>("proposals", proposal);
  return { status: 201, body: { proposal } };
}

export function handleUpdateProposal(id: string, body: unknown) {
  const existing = db.getById<MockProposal>("proposals", parseInt(id, 10));
  if (!existing) return { status: 404, body: { message: "Proposta não encontrada" } };
  db.updateItem<MockProposal>("proposals", parseInt(id, 10), body as Partial<MockProposal>);
  return { status: 200, body: { success: true } };
}

export function handleAssignOwner(_method: string, id: string, body: unknown) {
  const existing = db.getById<MockProposal>("proposals", parseInt(id, 10));
  if (!existing) return { status: 404, body: { message: "Proposta não encontrada" } };
  const data = body as { userId: string };
  db.updateItem<MockProposal>("proposals", parseInt(id, 10), { userId: data.userId });
  const updated = db.getById<MockProposal>("proposals", parseInt(id, 10))!;
  return { status: 200, body: { success: true, proposal: { id: updated.id, userId: updated.userId } } };
}

export function handleSimulate(body: unknown) {
  const data = body as {
    financedValue: number;
    requestedValue: number;
    term: number;
    gracePeriod: number;
    amortizationSystem?: string;
    correctionIndex?: string;
    purpose?: string;
  };

  const financedValue = data.financedValue ?? 100000;
  const requestedValue = data.requestedValue ?? financedValue;
  const amortizationTerm = data.term ?? 12;
  const gracePeriod = data.gracePeriod ?? 0;
  const amortSystem = (data.amortizationSystem ?? "PRICE").toUpperCase();
  const correctionIndex = data.correctionIndex ?? "PRE_FIXADO";
  const purpose = data.purpose ?? "INVESTIMENTO";

  // FNO Rural fixed rate: 12.10% a.a.
  const taxaAnual = 12.1;
  const taxaMensalDecimal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  const taxaMensal = taxaMensalDecimal * 100;
  const percentualFinanciado = requestedValue > 0 ? (financedValue / requestedValue) * 100 : 0;

  const tabelaAmortizacao: Array<{
    mes: number;
    parcela: number;
    juros: number;
    amortizacao: number;
    saldoDevedor: number;
  }> = [];

  let currentBalance = financedValue;

  // 1) Grace period — only interest, no amortization
  for (let mes = 1; mes <= gracePeriod; mes++) {
    const juros = currentBalance * taxaMensalDecimal;
    tabelaAmortizacao.push({
      mes,
      parcela: Number(juros.toFixed(2)),
      juros: Number(juros.toFixed(2)),
      amortizacao: 0,
      saldoDevedor: Number(currentBalance.toFixed(2)),
    });
  }

  // 2) Amortization period
  if (amortSystem === "SAC") {
    const amortConst = currentBalance / amortizationTerm;
    for (let mes = 1; mes <= amortizationTerm; mes++) {
      const juros = currentBalance * taxaMensalDecimal;
      const amort = amortConst;
      currentBalance -= amort;
      if (currentBalance < 0.01) currentBalance = 0;
      tabelaAmortizacao.push({
        mes: gracePeriod + mes,
        parcela: Number((amort + juros).toFixed(2)),
        juros: Number(juros.toFixed(2)),
        amortizacao: Number(amort.toFixed(2)),
        saldoDevedor: Number(currentBalance.toFixed(2)),
      });
    }
  } else {
    // PRICE
    const i = taxaMensalDecimal;
    const n = amortizationTerm;
    const pmt = currentBalance * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    for (let mes = 1; mes <= n; mes++) {
      const juros = currentBalance * i;
      let amort = pmt - juros;
      currentBalance -= amort;
      if (currentBalance < 0.01) currentBalance = 0;
      tabelaAmortizacao.push({
        mes: gracePeriod + mes,
        parcela: Number(pmt.toFixed(2)),
        juros: Number(juros.toFixed(2)),
        amortizacao: Number(amort.toFixed(2)),
        saldoDevedor: Number(currentBalance.toFixed(2)),
      });
    }
  }

  // Fix last row to zero
  const lastRow = tabelaAmortizacao[tabelaAmortizacao.length - 1];
  if (lastRow) {
    lastRow.saldoDevedor = 0;
  }

  const valorPrimeiraParcela = tabelaAmortizacao.find((t) => t.amortizacao > 0 || t.parcela > 0);
  const valorTotalPago = tabelaAmortizacao.reduce((sum, t) => sum + t.parcela, 0);
  const totalJuros = tabelaAmortizacao.reduce((sum, t) => sum + t.juros, 0);

  // Build rate display string
  const indexLabels: Record<string, string> = {
    PRE_FIXADO: "PÓS-FIXADA",
    IPCA: "IPCA + spread",
    CDI: "CDI + spread",
    IGPM: "IGPM + spread",
    SELIC: "SELIC + spread",
  };
  const label = indexLabels[correctionIndex] ?? "PÓS-FIXADA";

  return {
    status: 200,
    body: {
      success: true,
      message: "Simulação calculada com sucesso.",
      data: {
        valorFinanciado: financedValue,
        percentualFinanciado: Number(percentualFinanciado.toFixed(2)),
        valorTotalPago: Number(valorTotalPago.toFixed(2)),
        valorPrimeiraParcela: valorPrimeiraParcela
          ? Number(valorPrimeiraParcela.parcela.toFixed(2))
          : 0,
        totalJuros: Number(totalJuros.toFixed(2)),
        taxaJuros: `Taxa de juros: ${taxaAnual.toFixed(2)}% a.a. (${label})`,
        sistema: "FNO - Fundo Constitucional do Norte",
        modalidade: purpose,
        prazoTotal: gracePeriod + amortizationTerm,
        carencia: gracePeriod,
        taxaMensal: Number(taxaMensal.toFixed(6)),
        taxaAnual,
        tabelaAmortizacao,
      },
    },
  };
}

export function handleStats() {
  const proposals = db.getCollection<MockProposal>("proposals");
  const total = proposals.length;

  // Count by status — "onTime" vs "frozen"
  // For mock: ATIVA = onTime, other = frozen
  const frozenCount = proposals.filter((p) => p.status !== "ATIVA").length;
  const onTimeCount = total - frozenCount;

  // By department
  const deptMap: Record<string, number> = {};
  proposals.forEach((p) => {
    deptMap[p.department] = (deptMap[p.department] ?? 0) + 1;
  });
  const byDepartment = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

  // By segment
  const segMap: Record<string, number> = {};
  proposals.forEach((p) => {
    const seg = p.type === "AGRO" ? "Agro" : p.type || "Outro";
    segMap[seg] = (segMap[seg] ?? 0) + 1;
  });
  const bySegment = Object.entries(segMap).map(([name, count]) => ({
    name,
    count,
    percent: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  // Sparkline (last 6 months)
  const sparkline = proposals.map((p) => ({
    month: p.createdAt.substring(0, 7),
    count: 1,
  }));

  // Critical alerts
  const criticalAlerts: Array<{
    proposalId: number;
    proponent: string;
    stage: string;
    department: string;
    daysInStage: number;
    slaPercent: number;
    isOverdue: boolean;
  }> = [];

  return {
    status: 200,
    body: {
      onTime: { count: onTimeCount, percent: total > 0 ? Math.round((onTimeCount / total) * 100) : 0, total },
      frozen: { count: frozenCount, percent: total > 0 ? Math.round((frozenCount / total) * 100) : 0, total },
      byDepartment,
      bySegment,
      sparkline,
      criticalAlerts,
    },
  };
}

export function handleSlaAlerts() {
  return { status: 200, body: [] };
}

export function handleAgenciesStats() {
  return { status: 200, body: [] };
}
