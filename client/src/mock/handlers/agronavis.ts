export function handleAgronavisAnalyze(_body: unknown) {
  return {
    status: 200,
    body: {
      result: {
        areasInfo: [
          {
            carCode: "MT-1234567-ABCD1234EFGH5678IJKL9012",
            countyName: "Luciara",
            countyUf: "MT",
            latitude: -11.234,
            longitude: -50.987,
          },
        ],
        properties: [
          {
            id: "prop-001",
            realtyId: "12345",
            realtyName: "Fazenda Esperança",
            totalArea: 15000000,
            arableArea: 10000000,
            legalReserveArea: 3000000,
            city: "Luciara",
            state: "MT",
            latitude: -11.234,
            longitude: -50.987,
            mainCulture: { culture: "soja", area: 8000000 },
          },
        ],
        compliance: {
          criteria: [
            { compliance: "ibama", status_compliance: null },
            { compliance: "trabalho_escravo", status_compliance: null },
          ],
        },
        financialSummary: {
          totalIncome: 1200000,
          totalCost: 480000,
        },
      },
    },
  };
}
