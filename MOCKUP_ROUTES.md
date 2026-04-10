# Mockup API — Especificação Completa de Rotas

Este documento lista **todas as rotas** que o frontend chama, o que cada uma faz no fluxo real e **qual dado mock retornar** para a demonstração funcionar com `localStorage`.

> **Princípio:** O frontend já existe e não vai mudar. O mock apenas responde o que ele espera.
> **Armazenamento:** `localStorage` (browser) ou `mock-data.json` (backend mock em Express).
> **Dados pré-populados:** No primeiro acesso, injetar 1 usuário de cada perfil + 3 propostas de exemplo.

---

## 1. Pré-população (executar 1x no init)

### Usuários mock

```js
const MOCK_USERS = [
  {
    id: "admin-001",
    name: "Carlos Admin",
    email: "admin@siga.local",
    password: "admin123",
    profile: { id: 1005, description: "Administrador" },
    pfType: "FISICA",
    pfDetails: { cpf: "123.456.789-00", phone: "(11) 99999-0001" }
  },
  {
    id: "gerente-001",
    name: "Roberto Gerente",
    email: "gerente@siga.local",
    password: "gerente123",
    profile: { id: 1001, description: "Gerente de Contas" },
    pfType: "FISICA",
    pfDetails: { cpf: "234.567.890-11", phone: "(11) 99999-0002" }
  },
  {
    id: "analista-001",
    name: "Daniel Alves",
    email: "analista@siga.local",
    password: "analista123",
    profile: { id: 1002, description: "Analista" },
    pfType: "FISICA",
    pfDetails: { cpf: "345.678.901-22", phone: "(11) 99999-0003" }
  },
  {
    id: "cliente-001",
    name: "Vinícius Costa",
    email: "cliente@siga.local",
    password: "cliente123",
    profile: { id: 1004, description: "Cliente" },
    pfType: "FISICA",
    pfDetails: { cpf: "456.789.012-33", phone: "(11) 99999-0004" }
  }
];
```

### Propostas mock

```js
const MOCK_PROPOSALS = [
  {
    id: 1,
    title: "Proposta - Fazenda São João",
    type: "AGRO",
    requestedValue: 500000,
    financedValue: 400000,
    term: 60,
    gracePeriod: 12,
    purpose: "INVESTIMENTO",
    sector: "Milho",
    creditType: "FNO",
    status: "ATIVA",
    department: "GECRE",
    userId: "cliente-001",
    analystId: "analista-001",
    createdAt: "2026-03-15T10:00:00Z",
    companyName: "Fazenda São João"
  },
  {
    id: 2,
    title: "Proposta - Agropastoril MT",
    type: "AGRO",
    requestedValue: 1200000,
    financedValue: 960000,
    term: 120,
    gracePeriod: 24,
    purpose: "INVESTIMENTO",
    sector: "Soja",
    creditType: "FNO",
    status: "ATIVA",
    department: "GEOPE",
    userId: "cliente-001",
    analystId: "analista-001",
    createdAt: "2026-04-01T14:00:00Z",
    companyName: "Agropastoril MT"
  },
  {
    id: 3,
    title: "Proposta - Coop Norte",
    type: "AGRO",
    requestedValue: 750000,
    financedValue: 600000,
    term: 36,
    gracePeriod: 6,
    purpose: "CUSTEIO",
    sector: "Café",
    creditType: "FNO",
    status: "ATIVA",
    department: "CECAD",
    userId: "cliente-001",
    analystId: "analista-001",
    createdAt: "2026-04-05T09:00:00Z",
    companyName: "Coop Norte"
  }
];
```

---

## 2. Autenticação

### `POST /api/auth/login`
- **Enviado:** `{ email, password }`
- **Retorno 200:**
  ```json
  {
    "token": "mock-jwt-token-qualquer",
    "user": {
      "id": "admin-001",
      "name": "Carlos Admin",
      "email": "admin@siga.local",
      "perfil": { "id": 1005, "description": "Administrador" }
    }
  }
  ```
- **Lógica mock:** Busca no `MOCK_USERS` por email+password. Se encontrar, retorna. Se não, 401.

### `GET /api/auth/me`
- **Retorno 200:** retorna o user logado (salvo após login).

### `POST /api/auth/register`
- **Enviado:** payload completo com nome, email, password, permissionId, pfType, pfDetails/pjDetails
- **Retorno 201:**
  ```json
  {
    "user": { "id": "novo-uuid", "name": "João Novo", "email": "joao@email.com", "perfil": { "id": 1004, "description": "Cliente" } },
    "message": "Usuário criado com sucesso"
  }
  ```
- **Lógica mock:** Gera UUID, salva no array de users, retorna.

### `PUT /api/auth/:id`
- **Enviado:** `{ name, email }` (ou campos parciais)
- **Retorno 200:** `{ success: true, user: <user atualizado> }`
- **Lógica mock:** Encontra user pelo id, faz merge dos campos, salva.

### `PUT /api/auth/:id/pf`
- **Enviado:** dados de PF (cpf, phone, birthDate, etc.)
- **Retorno 200:** `{ success: true }`
- **Lógica mock:** Salva detalhes no pfDetails do user.

### `PUT /api/auth/:id/pj`
- **Enviado:** dados de PJ (cnpj, companyName, etc.)
- **Retorno 200:** `{ success: true }`

### `GET /api/auth/:document`
- **Enviado:** CPF ou CNPJ no path
- **Retorno 200:** `{ user: <dados completos do usuário> }`
- **Retorno 404:** se não encontrar
- **Lógica mock:** Busca por cpf/cnpj em todos os users.

---

## 3. Propostas

### `GET /api/proposals`
- **Retorno 200:** Array de propostas (do mock + as criadas dinamicamente)
- **Usado em:** DashboardKPIs, PipelineBoard, ProposalList, Historico, AdminPanel, ClienteDetail, ManagerDashboard

### `GET /api/proposals/:id`
- **Retorno 200:** Objeto de proposta único + `documents` array + user
  ```json
  {
    "id": 1,
    "title": "Proposta - Fazenda São João",
    "type": "AGRO",
    "requestedValue": 500000,
    "department": "GECRE",
    "status": "ATIVA",
    "user": { "id": "cliente-001", "name": "Vinícius Costa", "email": "cliente@siga.local" },
    "documents": []
  }
  ```

### `POST /api/proposals`
- **Enviado:** payload com title, type, requestedValue, financedValue, term, gracePeriod, purpose, etc.
- **Retorno 201:**
  ```json
  {
    "proposal": {
      "id": 4,
      "title": "Proposta de Crédito - João",
      "type": "AGRO",
      "requestedValue": 300000,
      "department": "CECAD",
      "status": "ATIVA",
      "userId": "cliente-001"
    }
  }
  ```
- **Lógica mock:** Gera id incremental, salva no array, retorna.

### `PUT /api/proposals/:id`
- **Enviado:** campos parciais (ex: `{ department: "GECRE" }`, `{ userId: "novo-id" }`)
- **Retorno 200:** `{ success: true }`
- **Lógica mock:** Faz merge dos campos, salva.

### `POST /api/proposals/simulate`
- **Enviado:** `{ purpose, financedValue, requestedValue, term, gracePeriod, amortizationSystem, correctionIndex }`
- **Retorno 200:**
  ```json
  {
    "success": true,
    "message": "Simulação calculada com sucesso.",
    "data": {
      "valorFinanciado": 100000,
      "percentualFinanciado": 80,
      "valorTotalPago": 107879.58,
      "valorPrimeiraParcela": 11986.62,
      "totalJuros": 7879.58,
      "taxaJuros": "Taxa de juros: 12.10% a.a. (PÓS-FIXADA)",
      "sistema": "FNO - Fundo Constitucional do Norte",
      "modalidade": "INVESTIMENTO",
      "prazoTotal": 12,
      "carencia": 3,
      "taxaMensal": 0.956387,
      "taxaAnual": 12.1,
      "tabelaAmortizacao": [
        { "mes": 1, "parcela": 0, "juros": 956.39, "amortizacao": 0, "saldoDevedor": 100956.39 },
        { "mes": 12, "parcela": 11986.62, "juros": 113.55, "amortizacao": 11873.07, "saldoDevedor": 0 }
      ]
    }
  }
  ```
- **Dica:** Calcular localmente com a mesma fórmula de amortização (SAC/PRICE). Não precisa ser exato ao centavo, só parecer convincente.

---

## 4. Documentos (Azure)

### `POST /api/proposals/:id/documents` (multipart/formData)
- **Enviado:** `FormData` com `documentFile`, `type`, `description`
- **Retorno 200:**
  ```json
  {
    "document": {
      "id": "doc-uuid",
      "type": "Contrato Social",
      "url": "https://<azure-blob>.blob.core.windows.net/proposal-1/doc-uuid.pdf",
      "createdAt": "2026-04-10T10:00:00Z"
    }
  }
  ```
- **Lógica mock:** ⚠️ **Manter upload real para Azure.** Só salvar metadados (type, url, createdAt) no mock. A URL do Azure é gerada pelo backend real. O documento aparece de verdade no front.

---

## 5. Dashboards

### `GET /api/proposals/stats`
- **Retorno 200:**
  ```json
  {
    "onTime": { "count": 2, "percent": 83, "total": 3 },
    "frozen": { "count": 1, "percent": 17, "total": 3 },
    "byDepartment": [
      { "name": "CECAD", "count": 1 },
      { "name": "GECRE", "count": 1 },
      { "name": "GEOPE", "count": 1 }
    ],
    "bySegment": [
      { "name": "Agro", "count": 3, "percent": 100 }
    ],
    "sparkline": [
      { "month": "2025-10", "count": 1 },
      { "month": "2026-04", "count": 2 }
    ],
    "criticalAlerts": [
      {
        "proposalId": 3,
        "proponent": "Coop Norte",
        "stage": "Triagem",
        "department": "CECAD",
        "daysInStage": 5,
        "slaPercent": 40,
        "isOverdue": false
      }
    ]
  }
  ```
- **Dica mock:** Gerar dinamicamente a partir das propostas existentes.

### `GET /api/proposals/sla-alerts`
- **Retorno 200:** Array de alertas (pode ser o mesmo `criticalAlerts` da stats acima).
- **Mock vazio seguro:** `[]`

### `GET /api/agencies/stats`
- **Mock seguro:** `[]` (heatmap fica com "Aguardando dados do módulo de agências").

---

## 6. XCurve & Agronavis (Integrações externas mockadas)

### `POST /api/xcurve/analyze`
- **Enviado:** `{ cpf, cnpj }` (um dos dois preenchido)
- **Retorno 200:**
  ```json
  {
    "result": {
      "score": 78,
      "scoreNumeric": 78,
      "riskLevel": "medium",
      "recommendation": "review",
      "rating": "AA",
      "rules": [
        { "name": "Compliance", "score": 85, "items": [] },
        { "name": "Risco de Crédito", "score": 72, "items": [] }
      ],
      "details": {
        "creditHistory": "Bom",
        "paymentBehavior": "Regular",
        "debtRatio": 0.31,
        "restrictions": 0
      }
    }
  }
  ```
- **Lógica mock:** Sempre retornar o mesmo score (ex: 75-80) com riskLevel variando: Alto score para propostas com valor baixo, médio para altas. **Para a demo:** score fixo 78, risco "medium".

### `POST /api/agronavis/analyze`
- **Enviado:** `{ cpf, cnpj }`
- **Retorno 200:**
  ```json
  {
    "result": {
      "areasInfo": [{
        "carCode": "MT-1234567-ABCD1234EFGH5678IJKL9012",
        "countyName": "Luciara",
        "countyUf": "MT",
        "latitude": -11.234,
        "longitude": -50.987
      }],
      "properties": [{
        "id": "prop-001",
        "realtyId": "12345",
        "realtyName": "Fazenda Esperança",
        "totalArea": 15000000,
        "arableArea": 10000000,
        "legalReserveArea": 3000000,
        "city": "Luciara",
        "state": "MT",
        "latitude": -11.234,
        "longitude": -50.987,
        "mainCulture": { "culture": "soja", "area": 8000000 }
      }],
      "compliance": {
        "criteria": [
          { "compliance": "ibama", "status_compliance": null },
          { "compliance": "trabalho_escravo", "status_compliance": null }
        ]
      },
      "financialSummary": {
        "totalIncome": 1200000,
        "totalCost": 480000
      }
    }
  }
  ```
- **Dica mock:** Retornar sempre o mesmo objeto fixo. Os dados de áreas (totalArea, arableArea) são em m² — dividir por 10000 para hectares = 1500 ha, 1000 ha, etc.

---

## 7. Timeline (Comentários & Histórico)

### `GET /api/proposals/:id/timeline`
- **Retorno 200:** Array de timeline events
  ```json
  [
    { "id": 1, "eventType": "STAGE_CREATED", "content": { "from": null, "to": "Triagem" }, "createdAt": "2026-04-05T09:00:00Z", "user": { "name": "Sistema", "role": "Sistema" } },
    { "id": 2, "eventType": "STATUS_CHANGE", "content": { "from": "TRIAGEM", "to": "TÉCNICA" }, "createdAt": "2026-04-06T14:00:00Z", "user": { "name": "Daniel Alves", "role": "Analista" } }
  ]
  ```

### `POST /api/proposals/:id/timeline`
- **Enviado:** `{ eventType: "COMMENT", content: { text: "comentario" } }`
- **Retorno 200:** `{ success: true, event: { ... } }`
- **Lógica mock:** Adiciona ao array de timeline da proposal, retorna.

---

## 8. Usuários (Admin)

### `GET /api/users`
- **Retorno 200:** Array de todos os usuários mock.

### `PUT /api/users/:id/role`
- **Enviado:** `{ permissionId: 1002 }`
- **Retorno 200:** `{ success: true, user: { id, name, email, permissionId } }`

### `GET /api/users/:id`
- **Retorno 200:** `{ user: <dados do usuário> }`

### `PUT /api/proposals/:id/owner`
- **Enviado:** `{ userId: "analista-001" }`
- **Retorno 200:** `{ success: true, proposal: { id, userId } }`

---

## 9. Visitas

### `GET /api/visitas/dashboard`
- **Mock:**
  ```json
  {
    "total": 12,
    "scheduled": 5,
    "completed": 4,
    "pending": 3
  }
  ```

### `GET /api/visitas?startDate=X&endDate=Y`
- **Mock:** `[]` (vazio é seguro).

### `POST /api/visitas`
- **Retorno 201:** `{ success: true, visita: { ... } }`

### `PUT /api/visitas/:id`
- **Retorno 200:** `{ success: true }`

---

## 10. Assinaturas de Documentos

### `GET /api/documents/:id/signatures`
- **Retorno 200:**
  ```json
  {
    "documentId": "doc-001",
    "documentStatus": "draft",
    "signatures": [
      {
        "id": 1,
        "userId": "analista-001",
        "userName": "Daniel Alves",
        "userRole": "analista",
        "status": "pending",
        "signedAt": null,
        "order": 1
      },
      {
        "id": 2,
        "userId": null,
        "userName": "A definir (Gerência)",
        "userRole": "gerente",
        "status": "pending",
        "signedAt": null,
        "order": 2
      },
      {
        "id": 3,
        "userId": "cliente-001",
        "userName": "Vinícius Costa",
        "userRole": "cliente",
        "status": "pending",
        "signedAt": null,
        "order": 3
      }
    ]
  }
  ```

### `POST /api/documents/:id/sign`
- **Enviado:** `{ action: "sign" }` ou `{ action: "reject", comment: "..." }`
- **Retorno 200:** `{ success: true }`
- **Lógica mock:** Marca status como "signed", salva timestamp.

---

## 11. Rotas externas (NÃO mockar — são públicas)

| URL | Uso | Manter? |
|---|---|---|
| `https://viacep.com.br/ws/{cep}/json/` | Autocomplete de endereço | MANTER |
| `https://nominatim.openstreetmap.org/search?...` | Geolocalização | MANTER |

---

## 12. Fluxo de Demo (1x por perfil)

### Admin
1. **Login:** `admin@siga.local` / `admin123`
2. **Dashboard:** vê painel do gerente (ManagerDashboard)
3. **Admin → Permissões:** troca perfil do analista para gerente → salva
4. **Admin → Propostas:** reatribui proposta do analista para gerente

### Gerente
1. **Login:** `gerente@siga.local` / `gerente123`
2. **Dashboard:** ManagerDashboard com KPIs, mapa, funil
3. **Pipeline:** move proposta de Triagem → Técnica (arrasta card)
4. **Lista de Propostas:** abre Agro → vê dados (xcurve/agronavis mock)

### Analista
1. **Login:** `analista@siga.local` / `analista123`
2. **Dashboard:** AnalystDashboard com gráficos
3. **Propostas:** abre Agro → aba documentos → sobe arquivo (Azure real) → assina
4. **Simulador:** preenche campos → envia → vê tabela de amortização
5. **Cadastro de Proposta:** cria nova proposta (salva no mock)

### Cliente
1. **Login:** `cliente@siga.local` / `cliente123`
2. **Propostas:** vê lista (as 3 mock + a que criou)
3. **Detalhe:** abre proposta → vê documento subido → timeline com comentários

---

## 13. Implementação mínima sugerida

### Opção A: Express local (recomendada)
- Crie `mock-server.mjs` que responde todas as rotas acima
- Cada rota lê/grava em `mock-data.json`
- Frontend apontado para `http://localhost:3000`
- Upload de docs: proxy para upload real na Azure, depois salva URL no mock-data.json

### Opção B: interceptar no cliente
- Substituir `api.js` por mock que usa `localStorage`
- Para upload: `fetch` direto para Azure

### Opção C (mais rápida): arquivo JSON estático + handlers mínimos
- `mock-data.json` pré-populado
- Só 3 handlers dinâmicos: `proposals` (CRUD), `auth` (login), `documents` (upload → salva URL)
- Resto: retorna dados estáticos do JSON

**Recomendo a Opção C** pela velocidade.
