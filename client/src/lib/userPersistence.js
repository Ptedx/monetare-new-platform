const STORAGE_KEY = 'SIGA_MOCK_USERS';
const DRAFT_REQUEST_KEY = 'SIGA_DRAFT_CREDIT_REQUEST';

const DEFAULT_USERS = [
  { email: 'gerente@gmail.com', password: '', userRole: 'gerente', name: 'Gerente de Contas', permissionId: 1001 },
  { email: 'analista@gmail.com', password: '', userRole: 'analista', name: 'Analista', permissionId: 1002 },
  { email: 'projetista@gmail.com', password: '', userRole: 'projetista', name: 'Projetista', permissionId: 1003 },
  { email: 'ambregulatorio@gmail.com', password: '', userRole: 'ambregulatorio', name: 'Ambiente Regulatório', permissionId: 1004 },
  { email: 'cliente@gmail.com', password: '', userRole: 'cliente', name: 'Cliente', permissionId: 1004 },
  { email: 'posvenda@gmail.com', password: '', userRole: 'posvenda', name: 'Pós Venda', permissionId: 1005 },
  { email: 'gerencial@gmail.com', password: '', userRole: 'gerencial', name: 'Gerencial', permissionId: 1006 },
  { email: 'juridico@gmail.com', password: '', userRole: 'juridico', name: 'Jurídico', permissionId: 1007 },
];

export const userPersistence = {
  getUsers: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(stored);
  },

  saveUser: (userData) => {
    const users = userPersistence.getUsers();
    // Check if user already exists
    const index = users.findIndex(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (index >= 0) {
      users[index] = { ...users[index], ...userData };
    } else {
      users.push({
        ...userData,
        id: userData.id || Math.random().toString(36).substr(2, 9),
        userRole: userData.userRole || 'cliente', // User's preference
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return users;
  },

  validateLogin: (email, password) => {
    const users = userPersistence.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    
    // In our mockup, if password is empty it's treated as a default user check (only email)
    // If it's a new registered user, we should ideally check password
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (user) {
      // For default users (empty password), we allow login with any password in this mockup
      if (user.password === '' || user.password === password) {
        return user;
      }
    }
    return null;
  },

  saveDraftRequest: (data) => {
    localStorage.setItem(DRAFT_REQUEST_KEY, JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString()
    }));
  },

  getDraftRequest: () => {
    const stored = localStorage.getItem(DRAFT_REQUEST_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  clearDraftRequest: () => {
    localStorage.removeItem(DRAFT_REQUEST_KEY);
  }
};
