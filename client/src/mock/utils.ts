import * as db from "./db";
import { runSeed } from "./seed";

export function clearMockData(): void {
  db.setCollection("proposals", []);
  db.setCollection("documents", []);
  db.setCollection("timeline", []);
  db.setCollection("visits", []);
  db.setCollection("signatures", []);
}

export function resetMockData(): void {
  db.setCollection("users", []);
  db.clearSession();
  localStorage.removeItem("sigaplatform:initialized");
  clearMockData();
  runSeed();
}

export function getMockStats() {
  return {
    users: db.getCollection("users").length,
    proposals: db.getCollection("proposals").length,
    documents: db.getCollection("documents").length,
    timeline: db.getCollection("timeline").length,
    visits: db.getCollection("visits").length,
  };
}
