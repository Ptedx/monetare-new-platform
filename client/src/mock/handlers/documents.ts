import * as db from "../db";
import { MockDocument, MockProposal } from "../types";

export function handleUploadDocument(_method: string, proposalId: string, _body: unknown) {
  const pid = parseInt(proposalId, 10);
  const proposal = db.getById<MockProposal>("proposals", pid);
  if (!proposal) return { status: 404, body: { message: "Proposta não encontrada" } };

  const doc: MockDocument = {
    id: `doc-${crypto.randomUUID()}`,
    proposalId: pid,
    type: "Documento",
    url: `https://mock-storage.blob.core.windows.net/${pid}/doc-${crypto.randomUUID()}.pdf`,
    createdAt: new Date().toISOString(),
  };
  db.createItem<MockDocument>("documents", doc);
  return { status: 200, body: { document: doc } };
}
