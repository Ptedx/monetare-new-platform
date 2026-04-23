/**
 * activityLog.js — registra ações por perfil no localStorage
 *
 * Uso:
 *   logActivity('gerente', 'Enviou proposta para comitê', proposalId, 'Proposta #42');
 *   const logs = getActivityLog();          // todos
 *   const roleLogs = getActivityLog('analista'); // só do analista
 */

const STORAGE_KEY = 'siga:activityLog';
const MAX_ENTRIES = 500;

export function logActivity(userRole, action, proposalId, detail) {
  const entry = {
    id: Date.now(),
    role: userRole,
    action,
    proposalId: proposalId || null,
    detail: detail || '',
    timestamp: new Date().toISOString(),
  };

  const logs = getLogs();
  logs.unshift(entry); // newest first
  if (logs.length > MAX_ENTRIES) logs.length = MAX_ENTRIES;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getActivityLog(role) {
  const all = getLogs();
  if (role) return all.filter(l => l.role === role);
  return all;
}

function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearActivityLog() {
  localStorage.removeItem(STORAGE_KEY);
}

// Mapeamento de labels amigáveis por role
export const roleLabels = {
  gerente:     'Gerente de Contas',
  analista:    'Analista',
  juridico:    'Jurídico',
  posvenda:    'Pós-Venda',
  cliente:     'Cliente',
  projetista:  'Projetista',
  admin:       'Administrador',
  gerencial:   'Gerencial',
};

export const roleColor = {
  gerente:     'bg-blue-100 text-blue-700',
  analista:    'bg-amber-100 text-amber-700',
  juridico:    'bg-purple-100 text-purple-700',
  posvenda:    'bg-emerald-100 text-emerald-700',
  cliente:     'bg-sky-100 text-sky-700',
  projetista:  'bg-indigo-100 text-indigo-700',
  admin:       'bg-red-100 text-red-700',
  gerencial:   'bg-gray-100 text-gray-700',
};
