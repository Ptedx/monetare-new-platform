/**
 * FNO - Fundo Constitucional de Financiamento da Amazônia
 * Parâmetros oficiais de produto, taxas e políticas.
 * Fonte: Banco da Amazônia - Manual de Crédito / PDF SIGA consolidado.
 */

export const FNO_PRODUCTS = {
    FNO_RURAL: {
        id: "FNO_RURAL",
        label: "FNO - Amazônia Rural",
        segment: "Agro",
        funding: "FNO",
        maxProjectValue: 10_000_000,        // R$ 10M limite de política
        collateralAdvanceRate: 0.70,         // 70% do valor do colateral
        insuranceType: "Seguro rural",
        allowedAmortization: ["SAC", "PRICE", "BULLET"],
        allowedIndexes: ["Fixa", "CDI", "IPCA", "Pré-fixado"],
        defaultAmortization: "SAC",
        defaultIndex: "Pré-fixado",
    },
    FNO_ENTERPRISE: {
        id: "FNO_ENTERPRISE",
        label: "FNO - Amazônia Empresarial",
        segment: "PJ",
        funding: "FNO",
        maxProjectValue: 10_000_000,
        collateralAdvanceRate: 0.70,
        insuranceType: "Patrimonial",
        allowedAmortization: ["SAC", "PRICE", "BULLET"],
        allowedIndexes: ["Fixa", "CDI", "IPCA", "Pré-fixado"],
        defaultAmortization: "SAC",
        defaultIndex: "Pré-fixado",
    },
    FNO_INFRASTRUCTURE: {
        id: "FNO_INFRASTRUCTURE",
        label: "FNO - Amazônia Infraestrutura",
        segment: "PJ",
        funding: "FNO",
        maxProjectValue: 25_000_000,
        collateralAdvanceRate: 0.70,
        insuranceType: "Patrimonial",
        allowedAmortization: ["SAC", "PRICE", "BULLET"],
        allowedIndexes: ["Fixa", "CDI", "IPCA", "Pré-fixado"],
        defaultAmortization: "SAC",
        defaultIndex: "Pré-fixado",
    },
    AGRO_CUSTEIO: {
        id: "AGRO_CUSTEIO",
        label: "Custeio",
        segment: "Agro",
        funding: "FNO/PRONAF",
        maxProjectValue: 3_000_000,
        collateralAdvanceRate: 0.65,
        insuranceType: "Seguro rural",
        allowedAmortization: ["CPR", "SAC"],
        allowedIndexes: ["Fixa", "CDI", "IPCA", "Pré-fixado"],
        defaultAmortization: "CPR",
        defaultIndex: "Pré-fixado",
    },
};

export const FNO_PURPOSES = {
    CUSTEIO: {
        id: "CUSTEIO",
        label: "Custeio da safra",
        maxTermMonths: 18,         // Até 18 meses incluindo safra
        maxGraceMonths: 0,         // Sem carência para custeio
        maxFinancedPct: 80,        // Máx 80% do valor do projeto
        allowedProducts: ["FNO_RURAL", "FNO_ENTERPRISE", "AGRO_CUSTEIO"],
        description: "Financia insumos, mão de obra e despesas operacionais da safra",
    },
    INVESTIMENTO: {
        id: "INVESTIMENTO",
        label: "Investimento",
        maxTermMonths: 120,        // Até 10 anos
        maxGraceMonths: 24,        // Até 24 meses de carência
        maxFinancedPct: 80,        // Máx 80% do valor do projeto
        allowedProducts: ["FNO_RURAL", "FNO_ENTERPRISE", "FNO_INFRASTRUCTURE"],
        description: "Financia aquisição de máquinas, equipamentos, irrigação, benfeitorias",
    },
    COMERCIALIZACAO: {
        id: "COMERCIALIZACAO",
        label: "Comercialização",
        maxTermMonths: 12,
        maxGraceMonths: 2,
        maxFinancedPct: 90,        // Até 90% para comercialização via LC
        allowedProducts: ["FNO_RURAL", "FNO_ENTERPRISE"],
        description: "Financia letras de comercialização para cooperativas e associações",
    },
};

/**
 * Taxas FNO por produto (do PDF SIGA consolidado).
 * Para taxa indexada (CDI/IPCA): spread = taxa_base + spread adicional.
 */
export const FNO_RATES = {
    FNO_RURAL: {
        fixedAnnualRate: 0.10,       // 10% a.a. pré-fixada
        riskSpread: 0.015,           // 1,5% spread de risco
        operationalSpread: 0.006,    // 0,6% spread operacional
        cdiSpread: 0.022,            // CDI + 2,2% a.a.
        ipcaSpread: 0.030,           // IPCA + 3% a.a.
        structuringFee: 0.010,       // 1% fee de estruturação
        fixedRegistrationFee: 800,   // R$ 800 registro fixo
        insurancePct: 0,             // Seguro embutido na taxa
        ioftPct: 0.004,              // IOF/Trib 0,4%
        retainerPct: 0.005,          // Retainer/PDD 0,5%
    },
    FNO_ENTERPRISE: {
        fixedAnnualRate: 0.14,       // 14% a.a.
        riskSpread: 0.020,
        operationalSpread: 0.008,
        cdiSpread: 0.035,
        ipcaSpread: 0.045,
        structuringFee: 0.015,
        fixedRegistrationFee: 1_500,
        insurancePct: 0,
        ioftPct: 0.004,
        retainerPct: 0.010,
    },
    FNO_INFRASTRUCTURE: {
        fixedAnnualRate: 0.14,
        riskSpread: 0.020,
        operationalSpread: 0.008,
        cdiSpread: 0.035,
        ipcaSpread: 0.045,
        structuringFee: 0.015,
        fixedRegistrationFee: 1_500,
        insurancePct: 0,
        ioftPct: 0.004,
        retainerPct: 0.010,
    },
    AGRO_CUSTEIO: {
        fixedAnnualRate: 0.08,       // 8% a.a. custeio (subsidiado)
        riskSpread: 0.010,
        operationalSpread: 0.004,
        cdiSpread: 0.015,
        ipcaSpread: 0.020,
        structuringFee: 0.005,
        fixedRegistrationFee: 500,
        insurancePct: 0,
        ioftPct: 0.004,
        retainerPct: 0.005,
    },
};

// Taxas base de mercado (do PDF)
export const MARKET_BASE_RATES = {
    CDI_Annual: 0.150,      // 15% a.a.
    TLP_Annual: 0.072,      // 7,2% a.a.
    Rural_Annual: 0.145,    // 14,5% a.a.
    PRONAF_Annual: 0.080,   // 8% a.a.
};

export const SPREAD_BASE = {
    PF: 0.060,
    Middle: 0.045,
    Corporate: 0.035,
    Agro: 0.040,
};

/**
 * Calcula a taxa anual efetiva do FNO dado o produto, indexador e finalidade.
 * @param {string} productId  - ID do produto (FNO_RURAL, etc.)
 * @param {string} indexType  - 'Fixa', 'CDI', 'IPCA', 'Pré-fixado'
 * @param {string} purposeId  - ID da finalidade (CUSTEIO, INVESTIMENTO, COMERCIALIZACAO)
 * @returns {number} Taxa anual (decimal)
 */
export function getFNOAnnualRate(productId, indexType, purposeId) {
    const rates = FNO_RATES[productId];
    if (!rates) return 0.10; // fallback

    const normalized = (indexType || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalized === "pré-fixado" || normalized === "préfixado" || normalized === "fixa") {
        if (productId === "AGRO_CUSTEIO") {
            return rates.fixedAnnualRate;
        }
        return rates.fixedAnnualRate + rates.riskSpread + rates.operationalSpread;
    }

    if (normalized === "cdi") {
        return MARKET_BASE_RATES.CDI_Annual + rates.cdiSpread +
               MARKET_BASE_RATES.CDI_Annual * (rates.riskSpread + rates.operationalSpread);
    }

    if (normalized === "ipca") {
        const estimatedIPCA = 0.045;
        return estimatedIPCA + rates.ipcaSpread +
               estimatedIPCA * (rates.riskSpread + rates.operationalSpread);
    }

    return rates.fixedAnnualRate + rates.riskSpread + rates.operationalSpread;
}
