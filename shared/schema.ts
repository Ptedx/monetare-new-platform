import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  personType: text("person_type").notNull(),
  document: text("document").unique().notNull(),
  fullName: text("full_name").notNull(),
  tradeName: text("trade_name"),
  phone: text("phone"),
  role: text("role").notNull().default("cliente"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userDocuments = pgTable("user_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  docType: text("doc_type").notNull(),
  fileName: text("file_name"),
  status: text("status").default("pending"),
});

export const insertUserDocumentSchema = createInsertSchema(userDocuments).omit({
  id: true,
});
export type InsertUserDocument = z.infer<typeof insertUserDocumentSchema>;
export type UserDocument = typeof userDocuments.$inferSelect;

export const pfDetails = pgTable("pf_details", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique(),
  cpf: text("cpf").notNull(),
  rg: text("rg"),
  birthDate: text("birth_date"),
  maritalStatus: text("marital_status"),
  motherName: text("mother_name"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  neighborhood: text("neighborhood"),
  monthlyIncome: text("monthly_income"),
  occupation: text("occupation"),
});

export const insertPfDetailsSchema = createInsertSchema(pfDetails).omit({
  id: true,
});
export type InsertPfDetails = z.infer<typeof insertPfDetailsSchema>;
export type PfDetails = typeof pfDetails.$inferSelect;

export const pjDetails = pgTable("pj_details", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique(),
  cnpj: text("cnpj").notNull(),
  companyName: text("company_name"),
  tradeName: text("trade_name"),
  industry: text("industry"),
  companySize: text("company_size"),
  annualRevenue: text("annual_revenue"),
  foundedDate: text("founded_date"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  neighborhood: text("neighborhood"),
  machineryCount: text("machinery_count"),
  employeeCount: text("employee_count"),
});

export const insertPjDetailsSchema = createInsertSchema(pjDetails).omit({
  id: true,
});
export type InsertPjDetails = z.infer<typeof insertPjDetailsSchema>;
export type PjDetails = typeof pjDetails.$inferSelect;

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  assignedAnalystId: integer("assigned_analyst_id").references(() => users.id),
  assignedManagerId: integer("assigned_manager_id").references(() => users.id),
  name: text("name").notNull(),
  segment: text("segment"),
  stage: text("stage").notNull().default("1. Cadastro"),
  status: text("status").default("Em Análise"),
  creditLine: text("credit_line"),
  creditType: text("credit_type"),
  sector: text("sector"),
  projectValue: text("project_value"),
  financedValue: text("financed_value"),
  term: text("term"),
  gracePeriod: text("grace_period"),
  score: text("score"),
  priority: text("priority").default("media"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

export const proposalDocuments = pgTable("proposal_documents", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").references(() => proposals.id),
  title: text("title").notNull(),
  category: text("category").notNull(),
  status: text("status").default("pending"),
  fileName: text("file_name"),
  errorMessage: text("error_message"),
});

export const insertProposalDocumentSchema = createInsertSchema(proposalDocuments).omit({
  id: true,
});
export type InsertProposalDocument = z.infer<typeof insertProposalDocumentSchema>;
export type ProposalDocument = typeof proposalDocuments.$inferSelect;

export const creditAnalysis = pgTable("credit_analysis", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").references(() => proposals.id),
  analysisType: text("analysis_type"),
  status: text("status").default("pending"),
  score: text("score"),
  riskLevel: text("risk_level"),
  approvedLimit: text("approved_limit"),
  interestRate: text("interest_rate"),
  conditions: text("conditions"),
  rawResponse: text("raw_response"),
  analystNotes: text("analyst_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCreditAnalysisSchema = createInsertSchema(creditAnalysis).omit({
  id: true,
  createdAt: true,
});
export type InsertCreditAnalysis = z.infer<typeof insertCreditAnalysisSchema>;
export type CreditAnalysis = typeof creditAnalysis.$inferSelect;

export const auditTrail = pgTable("audit_trail", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditTrailSchema = createInsertSchema(auditTrail).omit({
  id: true,
  createdAt: true,
});
export type InsertAuditTrail = z.infer<typeof insertAuditTrailSchema>;
export type AuditTrail = typeof auditTrail.$inferSelect;

export const guarantees = pgTable("guarantees", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").references(() => proposals.id),
  type: text("type"),
  description: text("description"),
  estimatedValue: text("estimated_value"),
  status: text("status").default("pending"),
  notes: text("notes"),
});

export const insertGuaranteeSchema = createInsertSchema(guarantees).omit({
  id: true,
});
export type InsertGuarantee = z.infer<typeof insertGuaranteeSchema>;
export type Guarantee = typeof guarantees.$inferSelect;
