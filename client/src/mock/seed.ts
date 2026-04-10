import * as db from "./db";
import { MockUser } from "./types";

const MOCK_USERS: MockUser[] = [
  {
    id: "admin-001",
    name: "Carlos Admin",
    email: "admin@siga.local",
    password: "admin123",
    profile: { id: 1005, description: "Administrador" },
    pfType: "FISICA",
    pfDetails: { cpf: "123.456.789-00", phone: "(11) 99999-0001" },
  },
  {
    id: "gerente-001",
    name: "Roberto Gerente",
    email: "gerente@siga.local",
    password: "gerente123",
    profile: { id: 1001, description: "Gerente de Contas" },
    pfType: "FISICA",
    pfDetails: { cpf: "234.567.890-11", phone: "(11) 99999-0002" },
  },
  {
    id: "analista-001",
    name: "Daniel Alves",
    email: "analista@siga.local",
    password: "analista123",
    profile: { id: 1002, description: "Analista" },
    pfType: "FISICA",
    pfDetails: { cpf: "345.678.901-22", phone: "(11) 99999-0003" },
  },
  {
    id: "cliente-001",
    name: "Vinícius Costa",
    email: "cliente@siga.local",
    password: "cliente123",
    profile: { id: 1004, description: "Cliente" },
    pfType: "FISICA",
    pfDetails: { cpf: "456.789.012-33", phone: "(11) 99999-0004" },
  },
];

export function runSeed(): void {
  if (db.isInitialized()) return;
  db.setCollection("users", MOCK_USERS);
  db.setCollection("proposals", []);
  db.setCollection("documents", []);
  db.setCollection("timeline", []);
  db.setCollection("visits", []);
  db.setCollection("signatures", []);
  db.setInitialized();
}
