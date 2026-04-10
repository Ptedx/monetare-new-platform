/**
 * proposalFlow.js — gerencia transições de propostas no localStorage
 *
 * Fluxo real:
 *   GERENTE cria → envia para comitê
 *   ANALISTA aprova/reprova → se aprovado → JURÍDICO
 *   JURÍDICO registra garantias, assina → envia para PÓS-VENDA
 *   PÓS-VENDA cuida de seguros/cobrança
 */

export const STATUS_FLOW = {
  PENDENTE_COMITE:     "PENDENTE_COMITE",
  APROVADA:           "APROVADA",
  REPROVADA:          "REPROVADA",
  EM_ANALISE_JURIDICA: "EM_ANALISE_JURIDICA",
  EM_SEGURO:          "EM_SEGURO",
  SEGURO_COTADO:      "SEGURO_COTADO",
  FINALIZADA:         "FINALIZADA",
};

export const ROLE_ACTIONS = {
  gerente: [
    { label: "Enviar para comitê", key: "PENDENTE_COMITE" },
  ],
  analista: [
    { label: "Aprovar proposta", key: "APROVADA" },
    { label: "Reprovar proposta", key: "REPROVADA" },
  ],
  juridico: [
    { label: "Enviar para Pós-Venda", key: "EM_SEGURO" },
    { label: "Rejeitar proposta", key: "REPROVADA" },
  ],
  posvenda: [
    { label: "Cotar seguro", key: "SEGURO_COTADO" },
  ],
};

export const ALL_ACTION_KEYS = new Set(
  Object.values(ROLE_ACTIONS).flat().map((a) => a.key)
);

/**
 * Aplica uma ação em uma proposta.
 * Retorna a proposta atualizada ou null.
 */
export function advanceProposal(proposalId, actionKey, reason = "") {
  const all = getProposals();
  const idx = rawIndex(all, proposalId);
  if (idx === -1) return null;

  const prop = all[idx];

  // Gerente envia para comitê → vai para 1ª coluna do pipeline
  if (actionKey === "PENDENTE_COMITE") {
    prop.status = "PENDENTE_COMITE";
    prop.stage = "1. CECAD";
  }

  // Analista aprova → vai p/ jurídico
  else if (actionKey === "APROVADA") {
    prop.status = "EM_ANALISE_JURIDICA";
    prop.stage = "EM_ANALISE_JURIDICA";
    if (reason) prop.approvalReason = reason;
    if (!prop.user) {
      // Attach user info for Juridico display
      const users = JSON.parse(localStorage.getItem("sigaplatform:users") || '[]');
      const u = users[0]; // first user as fallback
      if (u) prop.user = { ...u.user };
      if (u) prop.user = { name: u.name, email: u.email };
    }
  }

  // Analista ou jurídico reprova
  else if (actionKey === "REPROVADA") {
    prop.status = "REPROVADA";
    prop.stage = "REPROVADA";
    if (reason) prop.rejectionReason = reason;
  }

  // Jurídico envia para pós-venda
  else if (actionKey === "EM_SEGURO") {
    prop.status = "EM_SEGURO";
    prop.stage = "EM_SEGURO";
  }

  // Pós-venda cotou seguro
  else if (actionKey === "SEGURO_COTADO") {
    prop.status = "SEGURO_COTADO";
    prop.stage = "SEGURO_COTADO";
  }

  else if (ALL_ACTION_KEYS.has(actionKey)) {
    prop.status = actionKey;
    prop.stage = actionKey;
  }

  prop.updatedAt = new Date().toISOString();
  all[idx] = prop;
  saveProposals(all);

  // Sincronizar com lista do cliente
  syncClientProposal(proposalId, prop);

  return prop;
}

// ---------- localStorage helpers ----------

function getProposals() {
  try { return JSON.parse(localStorage.getItem("proposals") || "[]"); }
  catch { return []; }
}

function saveProposals(arr) {
  localStorage.setItem("proposals", JSON.stringify(arr));
}

function rawIndex(arr, id) {
  return arr.findIndex((p) => String(p.id) === String(id));
}

const CLIENT_TAB_MAP = {
  PENDENTE_COMITE:      ["Pendente comitê", "amber", "Em aberto"],
  APROVADA:             ["Aprovada", "success", "Em aberto"],
  REPROVADA:            ["Reprovada", "error", "Em aberto"],
  EM_ANALISE_JURIDICA:  ["Em análise jurídica", "warning", "Em aberto"],
  EM_SEGURO:            ["Contratado", "success", "Contratados"],
  SEGURO_COTADO:        ["Seguro cotado", "success", "Contratados"],
  FINALIZADA:           ["Finalizado", "success", "Finalizados"],
};

function syncClientProposal(proposalId, updated) {
  const client = getClientProposals();
  const cIdx = client.findIndex((p) => String(p.id) === String(proposalId));
  if (cIdx === -1) return;

  const mapping = CLIENT_TAB_MAP[updated.status] || CLIENT_TAB_MAP[updated.stage];
  if (mapping) {
    client[cIdx].statusBadge = mapping[0];
    client[cIdx].statusType = mapping[1];
    client[cIdx].tab = mapping[2];
  }
  client[cIdx].updatedAt = updated.updatedAt;
  localStorage.setItem("clientProposals", JSON.stringify(client));
}

function getClientProposals() {
  try { return JSON.parse(localStorage.getItem("clientProposals") || "[]"); }
  catch { return []; }
}
