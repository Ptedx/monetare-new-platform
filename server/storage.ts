import { eq, and, desc, or, gte, ilike, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, type User, type InsertUser,
  userDocuments, type UserDocument, type InsertUserDocument,
  pfDetails, type PfDetails, type InsertPfDetails,
  pjDetails, type PjDetails, type InsertPjDetails,
  proposals, type Proposal, type InsertProposal,
  proposalDocuments, type ProposalDocument, type InsertProposalDocument,
  creditAnalysis, type CreditAnalysis, type InsertCreditAnalysis,
  auditTrail, type AuditTrail, type InsertAuditTrail,
  guarantees, type Guarantee, type InsertGuarantee,
  conversations, type Conversation, type InsertConversation,
  conversationParticipants, type ConversationParticipant, type InsertConversationParticipant,
  messages, type Message, type InsertMessage,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByDocument(document: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;

  getPfDetails(userId: number): Promise<PfDetails | undefined>;
  createPfDetails(data: InsertPfDetails): Promise<PfDetails>;
  updatePfDetails(userId: number, data: Partial<InsertPfDetails>): Promise<PfDetails | undefined>;

  getPjDetails(userId: number): Promise<PjDetails | undefined>;
  createPjDetails(data: InsertPjDetails): Promise<PjDetails>;
  updatePjDetails(userId: number, data: Partial<InsertPjDetails>): Promise<PjDetails | undefined>;

  getUserDocuments(userId: number): Promise<UserDocument[]>;
  createUserDocument(data: InsertUserDocument): Promise<UserDocument>;
  updateUserDocument(id: number, data: Partial<InsertUserDocument>): Promise<UserDocument | undefined>;

  getProposal(id: number): Promise<Proposal | undefined>;
  getProposals(filters?: { userId?: number; assignedAnalystId?: number; assignedManagerId?: number; stage?: string; status?: string }): Promise<Proposal[]>;
  createProposal(data: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, data: Partial<InsertProposal>): Promise<Proposal | undefined>;

  getProposalDocuments(proposalId: number): Promise<ProposalDocument[]>;
  createProposalDocument(data: InsertProposalDocument): Promise<ProposalDocument>;
  updateProposalDocument(id: number, data: Partial<InsertProposalDocument>): Promise<ProposalDocument | undefined>;

  getCreditAnalysis(proposalId: number): Promise<CreditAnalysis[]>;
  createCreditAnalysis(data: InsertCreditAnalysis): Promise<CreditAnalysis>;
  updateCreditAnalysis(id: number, data: Partial<InsertCreditAnalysis>): Promise<CreditAnalysis | undefined>;

  getGuarantees(proposalId: number): Promise<Guarantee[]>;
  createGuarantee(data: InsertGuarantee): Promise<Guarantee>;
  updateGuarantee(id: number, data: Partial<InsertGuarantee>): Promise<Guarantee | undefined>;

  createAuditEntry(data: InsertAuditTrail): Promise<AuditTrail>;
  getAuditTrail(filters?: { userId?: number; entityType?: string; entityId?: string; since?: Date }): Promise<AuditTrail[]>;

  getConversationsForUser(userId: number): Promise<any[]>;
  getOrCreateConversation(userIds: number[]): Promise<Conversation>;
  getMessages(conversationId: number, limit?: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  markMessagesRead(conversationId: number, userId: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByDocument(document: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.document, document));
    return user;
  }

  async createUser(data: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getPfDetails(userId: number): Promise<PfDetails | undefined> {
    const [details] = await db.select().from(pfDetails).where(eq(pfDetails.userId, userId));
    return details;
  }

  async createPfDetails(data: InsertPfDetails): Promise<PfDetails> {
    const [details] = await db.insert(pfDetails).values(data).returning();
    return details;
  }

  async updatePfDetails(userId: number, data: Partial<InsertPfDetails>): Promise<PfDetails | undefined> {
    const [details] = await db.update(pfDetails).set(data).where(eq(pfDetails.userId, userId)).returning();
    return details;
  }

  async getPjDetails(userId: number): Promise<PjDetails | undefined> {
    const [details] = await db.select().from(pjDetails).where(eq(pjDetails.userId, userId));
    return details;
  }

  async createPjDetails(data: InsertPjDetails): Promise<PjDetails> {
    const [details] = await db.insert(pjDetails).values(data).returning();
    return details;
  }

  async updatePjDetails(userId: number, data: Partial<InsertPjDetails>): Promise<PjDetails | undefined> {
    const [details] = await db.update(pjDetails).set(data).where(eq(pjDetails.userId, userId)).returning();
    return details;
  }

  async getUserDocuments(userId: number): Promise<UserDocument[]> {
    return db.select().from(userDocuments).where(eq(userDocuments.userId, userId));
  }

  async createUserDocument(data: InsertUserDocument): Promise<UserDocument> {
    const [doc] = await db.insert(userDocuments).values(data).returning();
    return doc;
  }

  async updateUserDocument(id: number, data: Partial<InsertUserDocument>): Promise<UserDocument | undefined> {
    const [doc] = await db.update(userDocuments).set(data).where(eq(userDocuments.id, id)).returning();
    return doc;
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }

  async getProposals(filters?: { userId?: number; assignedAnalystId?: number; assignedManagerId?: number; stage?: string; status?: string }): Promise<Proposal[]> {
    const conditions = [];
    if (filters?.userId) conditions.push(eq(proposals.userId, filters.userId));
    if (filters?.assignedAnalystId) conditions.push(eq(proposals.assignedAnalystId, filters.assignedAnalystId));
    if (filters?.assignedManagerId) conditions.push(eq(proposals.assignedManagerId, filters.assignedManagerId));
    if (filters?.stage) conditions.push(eq(proposals.stage, filters.stage));
    if (filters?.status) conditions.push(eq(proposals.status, filters.status));

    if (conditions.length === 0) {
      return db.select().from(proposals).orderBy(desc(proposals.createdAt));
    }
    return db.select().from(proposals).where(and(...conditions)).orderBy(desc(proposals.createdAt));
  }

  async createProposal(data: InsertProposal): Promise<Proposal> {
    const [proposal] = await db.insert(proposals).values(data).returning();
    return proposal;
  }

  async updateProposal(id: number, data: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const [proposal] = await db.update(proposals).set({ ...data, updatedAt: new Date() }).where(eq(proposals.id, id)).returning();
    return proposal;
  }

  async getProposalDocuments(proposalId: number): Promise<ProposalDocument[]> {
    return db.select().from(proposalDocuments).where(eq(proposalDocuments.proposalId, proposalId));
  }

  async createProposalDocument(data: InsertProposalDocument): Promise<ProposalDocument> {
    const [doc] = await db.insert(proposalDocuments).values(data).returning();
    return doc;
  }

  async updateProposalDocument(id: number, data: Partial<InsertProposalDocument>): Promise<ProposalDocument | undefined> {
    const [doc] = await db.update(proposalDocuments).set(data).where(eq(proposalDocuments.id, id)).returning();
    return doc;
  }

  async getCreditAnalysis(proposalId: number): Promise<CreditAnalysis[]> {
    return db.select().from(creditAnalysis).where(eq(creditAnalysis.proposalId, proposalId)).orderBy(desc(creditAnalysis.createdAt));
  }

  async createCreditAnalysis(data: InsertCreditAnalysis): Promise<CreditAnalysis> {
    const [analysis] = await db.insert(creditAnalysis).values(data).returning();
    return analysis;
  }

  async updateCreditAnalysis(id: number, data: Partial<InsertCreditAnalysis>): Promise<CreditAnalysis | undefined> {
    const [analysis] = await db.update(creditAnalysis).set(data).where(eq(creditAnalysis.id, id)).returning();
    return analysis;
  }

  async getGuarantees(proposalId: number): Promise<Guarantee[]> {
    return db.select().from(guarantees).where(eq(guarantees.proposalId, proposalId));
  }

  async createGuarantee(data: InsertGuarantee): Promise<Guarantee> {
    const [guarantee] = await db.insert(guarantees).values(data).returning();
    return guarantee;
  }

  async updateGuarantee(id: number, data: Partial<InsertGuarantee>): Promise<Guarantee | undefined> {
    const [guarantee] = await db.update(guarantees).set(data).where(eq(guarantees.id, id)).returning();
    return guarantee;
  }

  async createAuditEntry(data: InsertAuditTrail): Promise<AuditTrail> {
    const [entry] = await db.insert(auditTrail).values(data).returning();
    return entry;
  }

  async getAuditTrail(filters?: { userId?: number; entityType?: string; entityId?: string; since?: Date }): Promise<AuditTrail[]> {
    const conditions = [];
    if (filters?.userId) conditions.push(eq(auditTrail.userId, filters.userId));
    if (filters?.entityType) conditions.push(eq(auditTrail.entityType, filters.entityType));
    if (filters?.entityId) conditions.push(eq(auditTrail.entityId, filters.entityId));
    if (filters?.since) conditions.push(gte(auditTrail.createdAt, filters.since));

    if (conditions.length === 0) {
      return db.select().from(auditTrail).orderBy(desc(auditTrail.createdAt));
    }
    return db.select().from(auditTrail).where(and(...conditions)).orderBy(desc(auditTrail.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.fullName);
  }

  async getConversationsForUser(userId: number): Promise<any[]> {
    const userConvs = await db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    const convIds = userConvs.map(c => c.conversationId).filter(Boolean) as number[];
    if (convIds.length === 0) return [];

    const result = [];
    for (const convId of convIds) {
      const [conv] = await db.select().from(conversations).where(eq(conversations.id, convId));
      if (!conv) continue;

      const participants = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          role: users.role,
          status: users.status,
        })
        .from(conversationParticipants)
        .innerJoin(users, eq(conversationParticipants.userId, users.id))
        .where(eq(conversationParticipants.conversationId, convId));

      const [lastMsg] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, convId))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const unreadCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(messages)
        .where(and(
          eq(messages.conversationId, convId),
          eq(messages.read, false),
          sql`${messages.senderId} != ${userId}`
        ));

      result.push({
        ...conv,
        participants,
        lastMessage: lastMsg || null,
        unreadCount: unreadCount[0]?.count || 0,
      });
    }

    result.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.createdAt;
      const bTime = b.lastMessage?.createdAt || b.createdAt;
      return new Date(bTime as string | number).getTime() - new Date(aTime as string | number).getTime();
    });

    return result;
  }

  async getOrCreateConversation(userIds: number[]): Promise<Conversation> {
    const sorted = [...userIds].sort((a, b) => a - b);

    const firstUserConvs = await db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, sorted[0]));

    for (const { conversationId } of firstUserConvs) {
      if (!conversationId) continue;
      const parts = await db
        .select({ userId: conversationParticipants.userId })
        .from(conversationParticipants)
        .where(eq(conversationParticipants.conversationId, conversationId));

      const partIds = parts.map(p => p.userId).filter(Boolean).sort((a, b) => (a as number) - (b as number));
      if (partIds.length === sorted.length && partIds.every((id, i) => id === sorted[i])) {
        const [conv] = await db.select().from(conversations).where(eq(conversations.id, conversationId));
        if (conv) return conv;
      }
    }

    const [conv] = await db.insert(conversations).values({}).returning();
    for (const uid of sorted) {
      await db.insert(conversationParticipants).values({ conversationId: conv.id, userId: uid });
    }
    return conv;
  }

  async getMessages(conversationId: number, limit = 100): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)
      .limit(limit);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(data).returning();
    await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, data.conversationId!));
    return msg;
  }

  async markMessagesRead(conversationId: number, userId: number): Promise<void> {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(
        eq(messages.conversationId, conversationId),
        sql`${messages.senderId} != ${userId}`,
        eq(messages.read, false)
      ));
  }
}

export const storage = new DatabaseStorage();
