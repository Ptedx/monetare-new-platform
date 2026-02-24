import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { pool } from "./db";
import type { User } from "@shared/schema";
import type { Express, Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      personType: string;
      document: string;
      fullName: string;
      tradeName: string | null;
      phone: string | null;
      role: string;
      status: string;
      createdAt: Date | null;
    }
  }
}

export let sessionMiddleware: any;

export function setupAuth(app: Express) {
  const PgSession = connectPgSimple(session);

  sessionMiddleware = session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "siga-platform-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  });

  app.use(sessionMiddleware);

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Email ou senha incorretos" });
          }
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Email ou senha incorretos" });
          }
          if (user.status !== "active") {
            return done(null, false, { message: "Conta desativada" });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      const { password, ...safeUser } = user;
      done(null, safeUser as Express.User);
    } catch (err) {
      done(err);
    }
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autorizado" });
}
