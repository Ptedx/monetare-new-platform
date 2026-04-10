import * as db from "../db";
import { MockUser } from "../types";

export function handleGetUsers() {
  const users = db.getCollection<MockUser>("users");
  return {
    status: 200,
    body: users.map(({ password: _p, ...u }) => u),
  };
}

export function handleGetUser(id: string) {
  const user = db.getById<MockUser>("users", id);
  if (!user) return { status: 404, body: { message: "Usuário não encontrado" } };
  const { password: _p, ...safeUser } = user;
  return { status: 200, body: { user: safeUser } };
}

export function handleUpdateRole(id: string, body: unknown) {
  const existing = db.getById<MockUser>("users", id);
  if (!existing) return { status: 404, body: { message: "Usuário não encontrado" } };
  const data = body as { permissionId: number };
  const profiles: Record<number, { id: number; description: string }> = {
    1001: { id: 1001, description: "Gerente de Contas" },
    1002: { id: 1002, description: "Analista" },
    1004: { id: 1004, description: "Cliente" },
    1005: { id: 1005, description: "Administrador" },
  };
  const profile = profiles[data.permissionId] ?? existing.profile;
  db.updateItem<MockUser>("users", id, { profile, permissionId: data.permissionId });
  const updated = db.getById<MockUser>("users", id)!;
  return {
    status: 200,
    body: { success: true, user: { id: updated.id, name: updated.name, email: updated.email, permissionId: updated.permissionId } },
  };
}
