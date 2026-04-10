export interface MockProfile {
  id: number;
  description: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: MockProfile;
  pfType?: string;
  pfDetails?: {
    cpf?: string;
    phone?: string;
    birthDate?: string;
  };
  pjDetails?: {
    cnpj?: string;
    companyName?: string;
  };
  permissionId?: number;
}

export interface MockProposal {
  id: number;
  title: string;
  type: string;
  requestedValue: number;
  financedValue: number;
  term: number;
  gracePeriod: number;
  purpose: string;
  sector: string;
  creditType: string;
  status: string;
  department: string;
  userId: string;
  analystId: string;
  createdAt: string;
  companyName: string;
  documents?: MockDocument[];
}

export interface MockDocument {
  id: string;
  proposalId: number;
  type: string;
  description?: string;
  url: string;
  createdAt: string;
}

export interface MockTimelineEvent {
  id: number;
  proposalId: number;
  eventType: string;
  content: Record<string, unknown>;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
}

export interface MockVisita {
  id: number;
  proposalId?: number;
  date: string;
  status: string;
  notes?: string;
  userId: string;
}

export interface MockSignature {
  id: number;
  documentId: string;
  userId: string | null;
  userName: string;
  userRole: string;
  status: string;
  signedAt: string | null;
  order: number;
}

export interface MockAuthSession {
  token: string;
  userId: string;
}
