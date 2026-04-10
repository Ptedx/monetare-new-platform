export function handleXcurveAnalyze(_body: unknown) {
  return {
    status: 200,
    body: {
      result: {
        score: 78,
        scoreNumeric: 78,
        riskLevel: "medium",
        recommendation: "review",
        rating: "AA",
        rules: [
          { name: "Compliance", score: 85, items: [] },
          { name: "Risco de Crédito", score: 72, items: [] },
          { name: "Histórico Financeiro", score: 76, items: [] },
        ],
        details: {
          creditHistory: "Bom",
          paymentBehavior: "Regular",
          debtRatio: 0.31,
          restrictions: 0,
        },
      },
    },
  };
}
