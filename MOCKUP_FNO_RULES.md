# Regras FNO — Validação para Cadastro de Proposta e Simulador

Este documento contém **todas as regras de negócio do FNO** necessárias para validar campos e calcular resultados no mock.

---

## 1. Finalidades do Crédito

O frontend oferece 3 finalidades. Cada uma tem limites de prazo, carência e percentual financiado:

| Finalidade | ID | Prazo máx | Carência máx | % máx. financiado | Funding | Seg. típico |
|---|---|---|---|---|---|---|
| **Custeio da safra** | `CUSTEIO` | 18 meses | **0 meses** | 80% do projeto | FNO/PRONAF | Seguro rural |
| **Investimento** | `INVESTIMENTO` | 120 meses | 24 meses | 80% do projeto | FNO | Seguro rural |
| **Comercialização** | `COMERCIALIZACAO` | 12 meses | 2 meses | 90% do projeto | FNO | Patrimonial |

### Regras de validação

```
valor_projeto  > 0
valor_financiado > 0
valor_financiado / valor_projeto * 100 <= max_financed_pct_da_finalidade
prazo >= 1 e prazo <= prazo_max_da_finalidade
carencia >= 0 e carencia <= carencia_max_da_finalidade
```

### Produtos permitidos por finalidade

```
CUSTEIO        → FNO_RURAL, FNO_ENTERPRISE, AGRO_CUSTEIO
INVESTIMENTO   → FNO_RURAL, FNO_ENTERPRISE, FNO_INFRASTRUCTURE
COMERCIALIZACAO → FNO_RURAL, FNO_ENTERPRISE
```

---

## 2. Limites de Política (R$)

| Produto | Segmento | Limite de política |
|---|---|---|
| **FNO - Amazônia Rural** | Agro / PF | R$ 10.000.000,00 |
| **FNO - Amazônia Empresarial** | PJ | R$ 10.000.000,00 |
| **FNO - Amazônia Infraestrutura** | PJ | R$ 25.000.000,00 |
| **Custeio (Agro)** | Agro | R$ 3.000.000,00 |

---

## 3. Taxas de Juros FNO

### FNO - Amazônia Rural (Agro / PF)

| Parâmetro | Valor |
|---|---|
| **Taxa pré-fixada (a.a.)** | 10,00% |
| Spread de risco | 1,50% a.a. |
| Spread operacional | 0,60% a.a. |
| **Total pré-fixada efetiva** | **12,10% a.a.** |
| CDI spread (sobre CDI) | CDI + 2,20% a.a. |
| IPCA spread (sobre IPCA) | IPCA + 3,00% a.a. |
| Fee de estruturação | 1,0% |
| Registro fixo | R$ 800,00 |
| IOF/Tributos | 0,4% |
| Retainer/PDD | 0,5% |
| Advance rate do colateral | 70% |

### FNO - Amazônia Empresarial (PJ)

| Parâmetro | Valor |
|---|---|
| **Taxa pré-fixada (a.a.)** | 14,00% |
| Spread de risco | 2,00% a.a. |
| Spread operacional | 0,80% a.a. |
| **Total pré-fixada efetiva** | **16,80% a.a.** |
| CDI spread (sobre CDI) | CDI + 3,50% a.a. |
| IPCA spread (sobre IPCA) | IPCA + 4,50% a.a. |
| Fee de estruturação | 1,5% |
| Registro fixo | R$ 1.500,00 |
| IOF/Tributos | 0,4% |
| Retainer/PDD | 1,0% |
| Advance rate do colateral | 70% |

### FNO - Amazônia Infraestrutura

| Parâmetro | Valor |
|---|---|
| **Igual ao Empresarial** | Mesmas taxas acima |

### Custeio Agro (Agro / PF — subsidiado)

| Parâmetro | Valor |
|---|---|
| **Taxa pré-fixada (a.a.)** | 8,00% |
| Spread de risco | 1,00% a.a. |
| Spread operacional | 0,40% a.a. |
| **Total pré-fixada efetiva** | **9,40% a.a.** |
| CDI spread (sobre CDI) | CDI + 1,50% a.a. |
| IPCA spread (sobre IPCA) | IPCA + 2,00% a.a. |
| Fee de estruturação | 0,5% |
| Registro fixo | R$ 500,00 |
| IOF/Tributos | 0,4% |
| Retainer/PDD | 0,5% |

---

## 4. Taxas base de mercado (referência)

| Taxa | Valor |
|---|---|
| CDI anual | 15,0% a.a. |
| TLP anual | 7,2% a.a. |
| Rural anual | 14,5% a.a. |
| PRONAF anual | 8,0% a.a. |

### Spread base por segmento

| Segmento | Spread base |
|---|---|
| Pessoa física | 6,0% a.a. |
| Middle market | 4,5% a.a. |
| Corporate | 3,5% a.a. |
| Agro | 4,0% a.a. |

---

## 5. Cálculo da taxa final

### Pré-fixada
```
taxa_efetiva = fixa + risco + operacional
```

Exemplos:
- Rural: 10 + 1.5 + 0.6 = **12,10% a.a.**
- Empresarial: 14 + 2.0 + 0.8 = **16,80% a.a.**
- Custeio: 8 + 1.0 + 0.4 = **9,40% a.a.**

### CDI
```
taxa = CDI_base + cdi_spread + (CDI_base * (risco + operacional))
```

### IPCA
```
taxa = IPCA_estimado(4.5%) + ipca_spread + (IPCA_estimado * (risco + operacional))
```

### Conversão para mensal
```
taxa_mensal = (1 + taxa_anual)^(1/12) - 1
```

---

## 6. Amortização

### Sistemas suportados

| Produto | SAC | PRICE | BULLET | SPOT | CPR |
|---|:---:|:---:|:---:|:---:|:---:|
| FNO Rural | ✅ | ✅ | ✅ | ❌ | ✅ |
| FNO Empresarial | ✅ | ✅ | ✅ | ❌ | ❌ |
| FNO Infra | ✅ | ✅ | ✅ | ❌ | ❌ |
| Custeio Agro | ✅ | ✅ | ❌ | ❌ | ✅ |

### SAC (parcelas decrescentes)
```
amortizacao_constante = valor_financiado / n_parcelas
juros_mês = saldo_devedor * taxa_mensal
parcela_mês = amortizacao_constante + juros_mês
```

### PRICE (parcelas fixas — fórmula PMT)
```
pmt = PV * [i * (1+i)^n] / [(1+i)^n - 1]
onde:
  PV = valor_financiado
  i  = taxa_mensal
  n  = n_parcelas
```

### Carência
- Durante carência: paga **apenas juros** (parcela = saldo * taxa_mensal)
- Após carência: inicia amortização pelo sistema escolhido

---

## 7. Campos obrigatórios no POST `/api/proposals`

```json
{
  "title": "string",
  "type": "AGRO",
  "requestedValue": 250000.00,
  "financedValue": 200000.00,
  "term": 24,
  "gracePeriod": 6,
  "purpose": "INVESTIMENTO",
  "correctionIndex": "IPCA",
  "amortization": "SAC",
  "clientDocumentNumber": "12345678900",
  "sector": "Soja",
  "creditType": "FNO",
  "email": "cliente@email.com",
  "companyName": "nome"
}
```

---

## 8. Índice de correção suportados

| Frontend | Backend |
|---|---|
| `Pré-fixado` | `PRE_FIXADO` |
| `IPCA` | `IPCA` |
| `CDI` | `CDI` |
| `IGPM` | `IGPM` |
| `SELIC` | `SELIC` |

---

## 9. Mock mínimo: resposta de simulação

Quando o frontend chama `POST /api/proposals/simulate`, o mock deve retornar pelo menos:

```json
{
  "success": true,
  "message": "Simulação calculada com sucesso.",
  "data": {
    "valorFinanciado": 200000,
    "percentualFinanciado": 80,
    "valorTotalPago": 215000.00,
    "valorPrimeiraParcela": 18500.00,
    "totalJuros": 15000.00,
    "taxaJuros": "Taxa de juros: 12.10% (PÓS-FIXADA)",
    "sistema": "FNO - Fundo Constitucional do Norte",
    "modalidade": "INVESTIMENTO",
    "prazoTotal": 24,
    "carencia": 6,
    "taxaMensal": 0.9563,
    "taxaAnual": 12.10,
    "tabelaAmortizacao": [
      { "mes": 1, "parcela": 0, "juros": 1912.77, "amortizacao": 0, "saldoDevedor": 201912.77 },
      { "mes": 24, "parcela": 18500.00, "juros": 113.55, "amortizacao": 18386.45, "saldoDevedor": 0 }
    ]
  }
}
```

---

## 10. Resumo de validação rápida

| Campo | Regra |
|---|---|
| `valor_projeto` | > 0, <= 25M para Infra, <= 10M Rural/Empresarial, <= 3M Custeio |
| `valor_financiado` | > 0, <= `valor_projeto * max_pct / 100` |
| `prazo` | >= 1, <= max da finalidade |
| `carencia` | >= 0, <= max da finalidade |
| `purpose` | `"CUSTEIO"` \| `"INVESTIMENTO"` \| `"COMERCIALIZACAO"` |
| `correctionIndex` | `"PRE_FIXADO"` \| `"IPCA"` \| `"CDI"` \| `"IGPM"` \| `"SELIC"` |
| `amortizationSystem` | `"SAC"` \| `"PRICE"` (ou `"BULLET"` para FNO Rural/Empresarial/Infra) |
