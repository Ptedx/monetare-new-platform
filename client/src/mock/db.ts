const LS_PREFIX = "sigaplatform:";

function key(collection: string): string {
  return `${LS_PREFIX}${collection}`;
}

export function getCollection<T>(collection: string): T[] {
  const raw = localStorage.getItem(key(collection));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function setCollection(collection: string, data: unknown): void {
  localStorage.setItem(key(collection), JSON.stringify(data));
}

export function getById<T extends { id: unknown }>(
  collection: string,
  id: T["id"],
): T | undefined {
  const items = getCollection<T>(collection);
  return items.find((item) => item.id === id);
}

export function createItem<T>(collection: string, item: T): T {
  const items = getCollection<T>(collection);
  items.push(item);
  setCollection(collection, items);
  return item;
}

export function deleteItem(collection: string, id: unknown): boolean {
  const items = getCollection<Record<string, unknown>>(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  setCollection(collection, items);
  return true;
}

export function updateItem<T>(
  collection: string,
  id: string | number,
  updates: Partial<T>,
): T | undefined {
  const items = getCollection<T>(collection);
  const index = items.findIndex(
    (item) => (item as { id: unknown }).id === id,
  );
  if (index === -1) return undefined;
  items[index] = { ...items[index], ...updates };
  setCollection(collection, items);
  return items[index] as T;
}

export function getNextId(collection: string): number {
  const items = getCollection<Record<string, unknown>>(collection);
  if (items.length === 0) return 1;
  const maxId = items.reduce((max, item) => {
    const n = typeof item.id === "number" ? item.id : 0;
    return n > max ? n : max;
  }, 0);
  return maxId + 1;
}

export function setItem(collection: string, id: string | number, value: unknown): void {
  const items = getCollection<Record<string, unknown>>(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    items.push(value as Record<string, unknown>);
  } else {
    items[index] = value as Record<string, unknown>;
  }
  setCollection(collection, items);
}

export function getSession(): { token: string; userId: string } | null {
  const raw = localStorage.getItem(`${LS_PREFIX}auth`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(token: string, userId: string): void {
  localStorage.setItem(`${LS_PREFIX}auth`, JSON.stringify({ token, userId }));
}

export function clearSession(): void {
  localStorage.removeItem(`${LS_PREFIX}auth`);
}

export function isInitialized(): boolean {
  return localStorage.getItem(`${LS_PREFIX}initialized`) === "true";
}

export function setInitialized(): void {
  localStorage.setItem(`${LS_PREFIX}initialized`, "true");
}
