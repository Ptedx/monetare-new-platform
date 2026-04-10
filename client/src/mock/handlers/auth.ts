import * as db from "../db";
import { MockUser } from "../types";

function mockCryptoUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function handleLogin(_method: string, _url: string, body: unknown) {
  const { email, password } = body as { email: string; password: string };
  const users = db.getCollection<MockUser>("users");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { status: 401, body: { message: "Credenciais inválidas" } };

  const { password: _, ...userWithoutPassword } = user;
  const token = `mock-jwt-${mockCryptoUuid()}`;
  db.setSession(token, user.id);
  return { status: 200, body: { token, user: userWithoutPassword } };
}

export function handleMe() {
  const session = db.getSession();
  if (!session) return { status: 401, body: { message: "Não autenticado" } };
  const user = db.getById<MockUser>("users", session.userId);
  if (!user) return { status: 401, body: { message: "Sessão inválida" } };
  const { password: _, ...userWithoutPassword } = user;
  return { status: 200, body: { user: userWithoutPassword } };
}

export function handleRegister(body: unknown) {
  const data = body as Partial<MockUser> & { email: string; password: string; name: string };
  const user: MockUser = {
    id: mockCryptoUuid(),
    name: data.name,
    email: data.email,
    password: data.password,
    profile: data.profile ?? { id: 1004, description: "Cliente" },
    pfType: data.pfType,
    pfDetails: data.pfDetails,
    pjDetails: data.pjDetails,
    permissionId: data.permissionId,
  };
  db.createItem<MockUser>("users", user);
  const { password: _, ...userWithoutPassword } = user;
  return { status: 201, body: { user: userWithoutPassword, message: "Usuário criado com sucesso" } };
}

export function handleUpdateUser(_method: string, id: string, body: unknown) {
  const existing = db.getById<MockUser>("users", id);
  if (!existing) return { status: 404, body: { message: "Usuário não encontrado" } };
  const updated = db.updateItem<MockUser>("users", id, body as Partial<MockUser>);
  return { status: 200, body: { success: true, user: updated } };
}

export function handleUpdatePf(_method: string, id: string, body: unknown) {
  const existing = db.getById<MockUser>("users", id);
  if (!existing) return { status: 404, body: { message: "Usuário não encontrado" } };
  const updates: Partial<MockUser> = {
    pfDetails: { ...existing.pfDetails, ...(body as object) },
  };
  db.updateItem<MockUser>("users", id, updates);
  return { status: 200, body: { success: true } };
}

export function handleUpdatePj(_method: string, id: string, body: unknown) {
  const existing = db.getById<MockUser>("users", id);
  if (!existing) return { status: 404, body: { message: "Usuário não encontrado" } };
  const updates: Partial<MockUser> = {
    pjDetails: { ...existing.pjDetails, ...(body as object) },
  };
  db.updateItem<MockUser>("users", id, updates);
  return { status: 200, body: { success: true } };
}

export function handleGetByDocument(document: string) {
  const users = db.getCollection<MockUser>("users");
  const cleaned = document.replace(/\D/g, "");
  const user = users.find(
    (u) =>
      u.pfDetails?.cpf?.replace(/\D/g, "") === cleaned ||
      u.pjDetails?.cnpj?.replace(/\D/g, "") === cleaned,
  );
  if (!user) return { status: 404, body: { message: "Usuário não encontrado" } };
  return { status: 200, body: { user } };
}
