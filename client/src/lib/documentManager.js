/**
 * documentManager.js — gerencia documentos e assinaturas no localStorage
 */

// ---------- Documents ----------

export function getDocuments(proposalId) {
  const key = `doc:${proposalId}`;
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveDocuments(proposalId, docs) {
  const key = `doc:${proposalId}`;
  localStorage.setItem(key, JSON.stringify(docs));
}

export function addDocument(proposalId, file, description) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const doc = {
        id: "doc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
        name: file.name,
        type: file.type,
        description: description || "",
        size: file.size,
        dataUrl: reader.result,        // base64 real do arquivo
        createdAt: new Date().toISOString(),
        signatureStatus: "PENDEN.",
      };
      const docs = getDocuments(proposalId);
      docs.push(doc);
      saveDocuments(proposalId, docs);
      resolve(doc);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function deleteDocument(proposalId, docId) {
  const docs = getDocuments(proposalId);
  const filtered = docs.filter((d) => d.id !== docId);
  saveDocuments(proposalId, filtered);
}

// ---------- Signatures ----------

export function getSignatures(docId) {
  const key = `sig:${docId}`;
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveSignatures(docId, sigs) {
  const key = `sig:${docId}`;
  localStorage.setItem(key, JSON.stringify(sigs));
}

export const DEFAULT_SIGNATURE_TEMPLATES = [
  { id: "sig-01", role: "analista", name: "Daniel Alves", status: "pendente", signedAt: null },
  { id: "sig-02", role: "juridico", name: "Jurídico", status: "pendente", signedAt: null },
  { id: "sig-03", role: "gerente", name: "Roberto Gerente", status: "pendente", signedAt: null },
];

export function ensureSignatures(docId) {
  const existing = getSignatures(docId);
  if (existing.length > 0) return existing;
  saveSignatures(docId, DEFAULT_SIGNATURE_TEMPLATES);
  return DEFAULT_SIGNATURE_TEMPLATES;
}

export function signSignature(docId, signatureId, signerName) {
  const sigs = getSignatures(docId);
  const idx = sigs.findIndex((s) => s.id === signatureId);
  if (idx === -1) return sigs;
  sigs[idx].status = "signed";
  sigs[idx].signedAt = new Date().toISOString();
  sigs[idx].name = signerName || sigs[idx].name;
  saveSignatures(docId, sigs);
  return sigs;
}
