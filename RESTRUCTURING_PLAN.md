# Plataforma SIGA Local — Plano de Reformulação Mock

> **Objetivo:** Remover dados mock pré-preenchidos dos perfis Cliente, Analista e Gerente. Tudo começa vazio e é preenchido dinamicamente via `localStorage`, simulando uma aplicação real.

---

## 1. Princípio: Abordagem Client-Side Mock (Opção B do MOCKUP_ROUTES)

**Por quê:** O backend Express atual está vazio (`routes.ts` sem rotas). Os componentes React fazem chamadas para `/api/*` via `queryClient`. Não há necessidade de um servidor Express — interceptar no client é mais rápido e simples.

**Como:** Substituir/criar um `api.ts` local que intercepta TODAS as chamadas `/api/*` que o frontend faz e responde via `localStorage`. O `queryClient.ts` usa `fetch` diretamente — então o mock intercepta `fetch`.

---

## 2. Arquitetura do Mock

### 2.1. Onde criar
```
client/src/mock/
  api.ts          — handlers mocks (substitui chamadas ao backend)
  data.ts         — inicialização e helpers localStorage
  types.ts        — types TypeScript para mock data
  seed.ts         — dados iniciais mínimos (APENAS contas demo, ZERO dados de negócio)
```

### 2.2. Como funciona
1. Criar `client/src/mock/api.ts` que **exporta funções** com a mesma assinatura que as chamadas de API reais (ex: `login(email, password)`, `getProposals()`, etc.)
2. **Substituir** todas as chamadas de `fetch('/api/...')` no frontend para usar `mockApi` em vez de `fetch`
3. Alternativa ainda mais simples: criar um **Service Worker** ou **wrapper no `queryClient`** que roteia para mock

**Melhor caminho pelo prazo apertado:**
Criar um módulo `mock-api.ts` que expõe funções síncronas/async que manipulam `localStorage`. As páginas do frontend importam `mockApi` em vez de usar `fetch` diretamente.

### 2.3. Alternativa mais prática: Interceptação via rewire de fetch

Como o `queryClient` usa `fetch` nativo (`client/src/lib/queryClient.ts` linha 32), a abordagem mais limpa que **não exige mudar todas as páginas** é:

No `client/src/main.tsx`, antes do React renderizar:
```ts
import { setupMockApi } from './mock/setup';
setupMockApi(); // intercepta fetch e responde via localStorage
```

Assim, TODO o código existente continua funcionando — chama `fetch('/api/...')` e recebe resposta do mock. **Zero mudanças nas páginas existentes.**

---

## 3. Dados — Estado Inicial

### 3.1. Usuários (SEED — pré-populados)
Os únicos dados iniciais são as **4 contas demo** para login (do MOCKUP_ROUTES.md):

```
admin@siga.local / admin123     → Administrador
gerente@siga.local / gerente123 → Gerente de Contas
analista@siga.local / analista123 → Analista
cliente@siga.local / cliente123 → Cliente
```

Estes NUNCA mudam. São a seed mínima.

### 3.2. Tudo mais começa VAZIO:
| Coleção | Estado Inicial | Notas |
|---------|---------------|-------|
| `proposals` | `[]` | Zero propostas. Criadas dinamicamente via formulário |
| `documents` | `[]` | Zero documentos |
| `timeline` | `{ proposalId: [] }` | Zero events |
| `visits` | `[]` | Zero visitas |
| `payments` | `[]` | Zero pagamentos |
| `signatures` | `[]` | Zero assinaturas |

### 3.3. localStorage Keys
```
sigaplatform:users        ← array de users (seed + novos registros)
sigaplatform:proposals    ← array de propostas
sigaplatform:documents    ← array de documentos
sigaplatform:timeline     ← { proposalId: events[] }
sigaplatform:visits       ← array de visitas
sigaplatform:auth         ← { token, userId } (sessão atual)
sigaplatform:uploads      ← metadados de uploads Azure
sigaplatform:initialized  ← "true" (flag para seed 1x)
```

---

## 4. Implementação Passo a Passo

### Fase 1: Mock Layer (prioridade MÁXIMA)
1. **Criar `client/src/mock/setup.ts`** — intercepta `window.fetch`, roteia `/api/*` para handlers mock
2. **Criar `client/src/mock/handlers.ts`** — cada rota do MOCKUP_ROUTES.md tem um handler
3. **Criar `client/src/mock/db.ts`** — wrappers de get/set/delete no localStorage
4. **Criar `client/src/mock/seed.ts`** — injeta 4 users demo na primeira inicialização
5. **Criar `client/src/mock/integrations.ts`** — responses mock para xcurve e agronavis (sempre retornam o mesmo objeto fixo)
6. **Modificar `client/src/main.tsx`** — importar `setupMockApi()` antes do render

### Fase 2: Páginas dos Perfis (Cliente, Analista, Gerente)
7. **Criar páginas** referenciadas em `App.tsx` que ainda não existem como arquivos:
   - Login, Dashboard, Pipeline, Propostas, Simulador, etc.
8. **Cada página** importa do mock layer via `fetch('/api/...')` (interceptado automaticamente)

### Fase 3: Integrações Externas
9. **Proposals/simulate** — calcular tabela de amortização local (fórmula SAC/PRICE)
10. **xcurve/agronavis** — retornar objetos fixos convincentes
11. **Document uploads** — manter upload real para Azure, salvar só metadados no mock

---

## 5. Detalhes dos Handlers Mock

### 5.1. Auth
| Rota | Lógica |
|------|--------|
| `POST /api/auth/login` | Busca user em `sigaplatform:users` por email+password. Retorna user + token mock. |
| `GET /api/auth/me` | Retorna user de `sigaplatform:auth`. 401 se não logado. |
| `POST /api/auth/register` | Gera UUID, salva em `sigaplatform:users`, retorna 201. |
| `PUT /api/auth/:id` | Merge dos campos no user encontrado. |
| `PUT /api/auth/:id/pf` | Salva em `user.pfDetails`. |
| `PUT /api/auth/:id/pj` | Salva em `user.pjDetails`. |
| `GET /api/auth/:document` | Busca user por CPF/CNPJ em pfDetails/pjDetails. |

### 5.2. Propostas
| Rota | Lógica |
|------|--------|
| `GET /api/proposals` | Retorna array de `sigaplatform:proposals`. |
| `GET /api/proposals/:id` | Retorna proposta + documents + user. |
| `POST /api/proposals` | Gera id incremental, salva, retorna 201. |
| `PUT /api/proposals/:id` | Merge dos campos. |
| `POST /api/proposals/simulate` | Calcula tabela SAC/PRICE local, retorna resultado. |
| `GET /api/proposals/stats` | Gera dinamicamente a partir das propostas existentes. |
| `GET /api/proposals/sla-alerts` | Gera a partir de propostas com dias em stage. |

### 5.3. Documentos
| Rota | Lógica |
|------|--------|
| `POST /api/proposals/:id/documents` | Upload real Azure + salva metadados em mock. |
| `GET /api/documents/:id/signatures` | Retorna signatures da proposal. |
| `POST /api/documents/:id/sign` | Marca signature como "signed". |

### 5.4. Timeline
| Rota | Lógica |
|------|--------|
| `GET /api/proposals/:id/timeline` | Retorna eventos de `sigaplatform:timeline[proposalId]`. |
| `POST /api/proposals/:id/timeline` | Adiciona evento ao array. |

### 5.5. Usuários (Admin)
| Rota | Lógica |
|------|--------|
| `GET /api/users` | Retorna todos os users. |
| `PUT /api/users/:id/role` | Atualiza `permissionId` do user. |
| `GET /api/users/:id` | Retorna user específico. |

### 5.6. Visitas
| Rota | Lógica |
|------|--------|
| `GET /api/visitas/dashboard` | Retorna contagem total/scheduled/completed/pending. |
| `GET /api/visitas` | Retorna array filtrado por data. |
| `POST /api/visitas` | Cria visita, retorna 201. |
| `PUT /api/visitas/:id` | Atualiza visita. |

### 5.7. Integrações (mock fixo)
| Rota | Lógica |
|------|--------|
| `POST /api/xcurve/analyze` | Sempre retorna score 78, riskLevel "medium", regras fixas. |
| `POST /api/agronavis/analyze` | Sempre retorna o mesmo objeto fixo do MOCKUP_ROUTES.md. |

---

## 6. Interceptação de Fetch — Implementação

```ts
// client/src/mock/setup.ts
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url;

  if (url.startsWith('/api/')) {
    // Extrair method, body, params
    const method = init?.method || 'GET';
    const body = init?.body ? JSON.parse(init.body as string) : undefined;

    // Rotear para handler correto
    const handler = matchRoute(method, url, body);
    if (handler) {
      const result = await handler();
      return new Response(JSON.stringify(result), {
        status: result.status || 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return originalFetch(input, init);
};
```

**Por que isso funciona:** O `queryClient.ts` usa `fetch` nativo. Ao fazer monkey-patch de `window.fetch` no `main.tsx`, qualquer chamada para `/api/*` é interceptada pelo mock. Chamadas externas (ViaCEP, Nominatim, Azure) passam direto para `originalFetch`.

---

## 7. Arquivos a Criar

```
client/src/mock/
  setup.ts       — monkey-patch de window.fetch, roteamento
  db.ts          — getCollection, setCollection, getById, create, update, delete
  seed.ts        — injectMockUsers(), runSeed()
  handlers/
    auth.ts      — handlers de /api/auth/*
    proposals.ts — handlers de /api/proposals/*
    documents.ts — handlers de /api/documents/*
    timeline.ts  — handlers de /api/proposals/:id/timeline
    users.ts     — handlers de /api/users/*
    visitas.ts   — handlers de /api/visitas/*
    xcurve.ts    — handler fixo
    agronavis.ts — handler fixo
  types.ts       — interfaces TypeScript para MockUser, MockProposal, etc.
```

---

## 8. Cálculo de Simulação (proposals/simulate)

Fórmula de amortização (PRICE ou SAC) para parecer convincente:

- **PRICE:** parcela fixa = PV × [i(1+i)^n] / [(1+i)^n - 1]
- **SAC:** amortização fixa = PV/n, juros decrescem
- Aplicar carência (sem pagamento nos primeiros meses, juros capitalizam)
- Usar taxa FNO: ~12.10% a.a. → taxa mensal = (1.121)^(1/12) - 1 ≈ 0.956%
- Retornar tabela com mês, parcela, juros, amortização, saldo devedor

**Simplificação:** Não precisa ser exato ao centavo. Só parecer convincente. Implementar PRICE básico com taxa fixa.

---

## 9. Notas Importantes

- **Uploads de documento:** Manter upload REAL para Azure. Só salvar metadados (type, url, createdAt) no `sigaplatform:documents`. A URL do Azure é do backend real.
- **Rotas externas NÃO mockar:** ViaCEP e Nominatim passam direto pelo fetch interceptor.
- **IDs incrementais:** propostas usam ID numérico auto-increment (começando do que já existe).
- **UUIDs:** novos users usam `crypto.randomUUID()`, documentos usam `crypto.randomUUID()`.
- **Datas:** usar `new Date().toISOString()` para createdAt.
- **Simular latência:** `await new Promise(r => setTimeout(r, 300 + Math.random() * 500))` nos handlers para parecer um backend real.

---

## 10. Ordem de Execução Sugerida

1. Mock layer (setup + db + seed) — **bloqueia tudo**
2. Handlers de Auth (login é a porta de entrada)
3. Handlers de Proposals (CRUD + simulate)
4. Handlers de Documents + Timeline
5. Handlers de Users + Visitas
6. Handlers de xcurve/agronavis (fixos)
7. Criar páginas do frontend que referem ao mock

---

## 11. Status de Implementação

- [x] Mock layer criada (setup + db + seed)
- [x] Fetch interceptor no `main.tsx`
- [x] Handlers: auth, proposals, documents, timeline, users, visitas, xcurve, agronavis, signatures
- [ ] Páginas do frontend (Login, Dashboard, Propostas, etc.) — a implementar
- [ ] Upload real de documentos para Azure (se necessário)

**Para limpar dados e começar do zero:** abrir console do browser → `localStorage.clear()` → recarregar página.
