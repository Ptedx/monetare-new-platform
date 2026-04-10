import * as db from "../db";

export interface MockVisita {
  id: number;
  proposalId?: number;
  date: string;
  status: string;
  notes?: string;
  userId: string;
}

function nextVisitaId(): number {
  const items = db.getCollection<MockVisita>("visits");
  if (items.length === 0) return 1;
  return Math.max(...items.map((v) => v.id)) + 1;
}

export function handleVisitasDashboard() {
  const visits = db.getCollection<MockVisita>("visits");
  const total = visits.length;
  const scheduled = visits.filter((v) => v.status === "scheduled").length;
  const completed = visits.filter((v) => v.status === "completed").length;
  const pending = visits.filter((v) => v.status === "pending").length;
  return { status: 200, body: { total, scheduled, completed, pending } };
}

export function handleGetVisitas() {
  const visits = db.getCollection<MockVisita>("visits");
  return { status: 200, body: visits };
}

export function handleCreateVisita(body: unknown) {
  const data = body as Partial<MockVisita>;
  const visita: MockVisita = {
    id: nextVisitaId(),
    proposalId: data.proposalId,
    date: data.date ?? new Date().toISOString(),
    status: data.status ?? "scheduled",
    notes: data.notes,
    userId: data.userId ?? "",
  };
  db.createItem<MockVisita>("visits", visita);
  return { status: 201, body: { success: true, visita } };
}

export function handleUpdateVisita(id: string, body: unknown) {
  const existing = db.getById<MockVisita>("visits", parseInt(id, 10));
  if (!existing) return { status: 404, body: { message: "Visita não encontrada" } };
  db.updateItem<MockVisita>("visits", parseInt(id, 10), body as Partial<MockVisita>);
  return { status: 200, body: { success: true } };
}
