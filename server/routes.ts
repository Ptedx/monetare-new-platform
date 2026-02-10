import type { Express } from "express";
import { storage } from "./storage";
import { requireAuth } from "./auth";
import bcrypt from "bcryptjs";
import passport from "passport";
import { insertUserSchema, insertProposalSchema, insertProposalDocumentSchema, insertCreditAnalysisSchema, insertGuaranteeSchema } from "@shared/schema";
import { registerXCurveRoutes } from "./xcurve";

export async function registerRoutes(app: Express) {
  registerXCurveRoutes(app);

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { email, password, personType, document, fullName, tradeName, phone, role, pfDetails: pfData, pjDetails: pjData } = req.body;

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const existingDoc = await storage.getUserByDocument(document);
      if (existingDoc) {
        return res.status(400).json({ message: "Documento já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        password: hashedPassword,
        personType,
        document,
        fullName,
        tradeName: tradeName || null,
        phone: phone || null,
        role: role || "cliente",
        status: "active",
      });

      if (personType === "PF" && pfData) {
        await storage.createPfDetails({
          userId: user.id,
          cpf: pfData.cpf || document,
          rg: pfData.rg || null,
          birthDate: pfData.birthDate || null,
          maritalStatus: pfData.maritalStatus || null,
          motherName: pfData.motherName || null,
          address: pfData.address || null,
          city: pfData.city || null,
          state: pfData.state || null,
          zipCode: pfData.zipCode || null,
          neighborhood: pfData.neighborhood || null,
          monthlyIncome: pfData.monthlyIncome || null,
          occupation: pfData.occupation || null,
        });
      }

      if (personType === "PJ" && pjData) {
        await storage.createPjDetails({
          userId: user.id,
          cnpj: pjData.cnpj || document,
          companyName: pjData.companyName || null,
          tradeName: pjData.tradeName || null,
          industry: pjData.industry || null,
          companySize: pjData.companySize || null,
          annualRevenue: pjData.annualRevenue || null,
          foundedDate: pjData.foundedDate || null,
          address: pjData.address || null,
          city: pjData.city || null,
          state: pjData.state || null,
          zipCode: pjData.zipCode || null,
          neighborhood: pjData.neighborhood || null,
          machineryCount: pjData.machineryCount || null,
          employeeCount: pjData.employeeCount || null,
        });
      }

      await storage.createAuditEntry({
        userId: user.id,
        action: "user_registered",
        entityType: "user",
        entityId: String(user.id),
        details: `User ${email} registered as ${personType}`,
        ipAddress: req.ip || null,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password: _, ...safeUser } = user;
        res.status(201).json(safeUser);
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao registrar" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Email ou senha incorretos" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        const { password: _, ...safeUser } = user;
        res.json({ user: safeUser });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao sair" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Não autorizado" });
    }
    res.json(req.user);
  });

  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { password: _, ...safeUser } = user;
      let details = null;
      if (user.personType === "PF") {
        details = await storage.getPfDetails(userId);
      } else if (user.personType === "PJ") {
        details = await storage.getPjDetails(userId);
      }

      const documents = await storage.getUserDocuments(userId);
      res.json({ ...safeUser, details, documents });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = req.user as Express.User;

      if (currentUser.id !== userId && currentUser.role !== "gerente") {
        return res.status(403).json({ message: "Sem permissão" });
      }

      const { pfDetails: pfData, pjDetails: pjData, password: newPassword, ...userData } = req.body;

      if (newPassword) {
        userData.password = await bcrypt.hash(newPassword, 10);
      }

      const user = await storage.updateUser(userId, userData);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      if (pfData) {
        const existing = await storage.getPfDetails(userId);
        if (existing) {
          await storage.updatePfDetails(userId, pfData);
        } else {
          await storage.createPfDetails({ userId, cpf: pfData.cpf || user.document, ...pfData });
        }
      }

      if (pjData) {
        const existing = await storage.getPjDetails(userId);
        if (existing) {
          await storage.updatePjDetails(userId, pjData);
        } else {
          await storage.createPjDetails({ userId, cnpj: pjData.cnpj || user.document, ...pjData });
        }
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/proposals", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as Express.User;
      let filters: any = {};

      if (currentUser.role === "cliente" || currentUser.role === "projetista") {
        filters.userId = currentUser.id;
      } else if (currentUser.role === "analista") {
        filters.assignedAnalystId = currentUser.id;
      }

      if (req.query.stage) filters.stage = req.query.stage as string;
      if (req.query.status) filters.status = req.query.status as string;

      const proposalsList = await storage.getProposals(filters);
      res.json(proposalsList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/proposals/:id", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposal(proposalId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposta não encontrada" });
      }

      const documents = await storage.getProposalDocuments(proposalId);
      const analysis = await storage.getCreditAnalysis(proposalId);
      const proposalGuarantees = await storage.getGuarantees(proposalId);

      res.json({ ...proposal, documents, creditAnalysis: analysis, guarantees: proposalGuarantees });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/proposals", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as Express.User;
      const proposalData = {
        ...req.body,
        userId: currentUser.id,
      };

      const proposal = await storage.createProposal(proposalData);

      await storage.createAuditEntry({
        userId: currentUser.id,
        action: "proposal_created",
        entityType: "proposal",
        entityId: String(proposal.id),
        details: `Proposal "${proposal.name}" created`,
        ipAddress: req.ip || null,
      });

      res.status(201).json(proposal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/proposals/:id", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.updateProposal(proposalId, req.body);
      if (!proposal) {
        return res.status(404).json({ message: "Proposta não encontrada" });
      }

      const currentUser = req.user as Express.User;
      await storage.createAuditEntry({
        userId: currentUser.id,
        action: "proposal_updated",
        entityType: "proposal",
        entityId: String(proposalId),
        details: JSON.stringify(req.body),
        ipAddress: req.ip || null,
      });

      res.json(proposal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/proposals/:id/documents", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const docs = await storage.getProposalDocuments(proposalId);
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/proposals/:id/documents", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const doc = await storage.createProposalDocument({
        ...req.body,
        proposalId,
      });
      res.status(201).json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/proposals/:id/documents/:docId", requireAuth, async (req, res) => {
    try {
      const docId = parseInt(req.params.docId);
      const doc = await storage.updateProposalDocument(docId, req.body);
      if (!doc) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }
      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/proposals/:id/credit-analysis", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const analysis = await storage.getCreditAnalysis(proposalId);
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/proposals/:id/credit-analysis", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const analysis = await storage.createCreditAnalysis({
        ...req.body,
        proposalId,
      });

      const currentUser = req.user as Express.User;
      await storage.createAuditEntry({
        userId: currentUser.id,
        action: "credit_analysis_created",
        entityType: "credit_analysis",
        entityId: String(analysis.id),
        details: `Credit analysis for proposal ${proposalId}`,
        ipAddress: req.ip || null,
      });

      res.status(201).json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/proposals/:id/guarantees", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposalGuarantees = await storage.getGuarantees(proposalId);
      res.json(proposalGuarantees);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/proposals/:id/guarantees", requireAuth, async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const guarantee = await storage.createGuarantee({
        ...req.body,
        proposalId,
      });
      res.status(201).json(guarantee);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/proposals/:id/guarantees/:gId", requireAuth, async (req, res) => {
    try {
      const gId = parseInt(req.params.gId);
      const guarantee = await storage.updateGuarantee(gId, req.body);
      if (!guarantee) {
        return res.status(404).json({ message: "Garantia não encontrada" });
      }
      res.json(guarantee);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const allProposals = await storage.getProposals();
      const stages: Record<string, number> = {};
      let totalProjectValue = 0;
      let totalFinancedValue = 0;

      for (const p of allProposals) {
        stages[p.stage] = (stages[p.stage] || 0) + 1;
        if (p.projectValue) totalProjectValue += parseFloat(p.projectValue) || 0;
        if (p.financedValue) totalFinancedValue += parseFloat(p.financedValue) || 0;
      }

      res.json({
        totalProposals: allProposals.length,
        byStage: stages,
        totalProjectValue,
        totalFinancedValue,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/dashboard/pipeline", requireAuth, async (req, res) => {
    try {
      const allProposals = await storage.getProposals();
      const pipeline: Record<string, any[]> = {};

      for (const p of allProposals) {
        if (!pipeline[p.stage]) pipeline[p.stage] = [];
        pipeline[p.stage].push(p);
      }

      res.json(pipeline);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/audit-trail", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as Express.User;
      const filters: any = { userId: currentUser.id };

      if (req.query.days) {
        const days = parseInt(req.query.days as string);
        if (!isNaN(days)) {
          const since = new Date();
          since.setDate(since.getDate() - days);
          filters.since = since;
        }
      }

      const entries = await storage.getAuditTrail(filters);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/chat/users", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as Express.User;
      const allUsers = await storage.getAllUsers();
      const filtered = allUsers
        .filter(u => u.id !== currentUser.id)
        .map(({ password, ...u }) => u);
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/chat/conversations", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as Express.User;
      const convs = await storage.getConversationsForUser(currentUser.id);
      res.json(convs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/conversations", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as Express.User;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "userId é obrigatório" });
      }
      const conv = await storage.getOrCreateConversation([currentUser.id, userId]);
      res.json(conv);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const currentUser = req.user as Express.User;
      await storage.markMessagesRead(conversationId, currentUser.id);
      const msgs = await storage.getMessages(conversationId);
      res.json(msgs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const currentUser = req.user as Express.User;
      const { content } = req.body;
      if (!content?.trim()) {
        return res.status(400).json({ message: "Mensagem vazia" });
      }
      const msg = await storage.createMessage({
        conversationId,
        senderId: currentUser.id,
        content: content.trim(),
        read: false,
      });

      await storage.createAuditEntry({
        userId: currentUser.id,
        action: "message_sent",
        entityType: "conversation",
        entityId: String(conversationId),
        details: `Message sent in conversation ${conversationId}`,
        ipAddress: req.ip || null,
      });

      res.status(201).json(msg);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
