import * as db from "../db";

export function handleGetSignatures(documentId: string) {
  const signatures = db.getCollection<Record<string, unknown>>("signatures");
  const docSigs = signatures.filter((s) => s.documentId === documentId);

  if (docSigs.length === 0) {
    return {
      status: 200,
      body: {
        documentId,
        documentStatus: "draft",
        signatures: [
          {
            id: 1,
            userId: "analista-001",
            userName: "Daniel Alves",
            userRole: "analista",
            status: "pending",
            signedAt: null,
            order: 1,
          },
          {
            id: 2,
            userId: null,
            userName: "A definir (Gerência)",
            userRole: "gerente",
            status: "pending",
            signedAt: null,
            order: 2,
          },
        ],
      },
    };
  }

  return { status: 200, body: { documentId, documentStatus: "draft", signatures: docSigs } };
}

export function handleSign(documentId: string, body: unknown) {
  const data = body as { action: string; comment?: string };
  const signatures = db.getCollection<Record<string, unknown>>("signatures");
  const docSigs = signatures.filter((s) => s.documentId === documentId);

  if (docSigs.length === 0) return { status: 404, body: { message: "Documento não encontrado" } };

  const pendingSig = docSigs.find((s) => s.status === "pending");
  if (!pendingSig) return { status: 400, body: { message: "Nenhuma assinatura pendente" } };

  if (data.action === "sign") {
    db.updateItem("signatures", String(pendingSig.id), { status: "signed", signedAt: new Date().toISOString() });
  } else if (data.action === "reject") {
    db.updateItem("signatures", String(pendingSig.id), { status: "rejected", signedAt: null });
  }

  return { status: 200, body: { success: true } };
}
