import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./replitAuth";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!email || !password || !firstName) {
        return res.status(400).json({ message: "الاسم والبريد الإلكتروني وكلمة المرور مطلوبة" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      }

      const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (existing) {
        return res.status(400).json({ message: "هذا البريد الإلكتروني مسجل بالفعل" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const [user] = await db
        .insert(users)
        .values({
          email: email.toLowerCase(),
          firstName,
          lastName: lastName || null,
          passwordHash,
        })
        .returning();

      (req.session as any).userId = user.id;

      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحساب" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" });
      }

      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      (req.session as any).userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ message: "تم تسجيل الخروج" });
    });
  });

  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      const sessionUserId = (req.session as any).userId;

      if (sessionUserId) {
        const [user] = await db.select().from(users).where(eq(users.id, sessionUserId));
        if (user) {
          return res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
            plan: user.plan || "free",
            cvCount: user.cvCount || 0,
          });
        }
      }

      if ((req as any).user?.claims?.sub) {
        const userId = (req as any).user.claims.sub;
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (user) {
          return res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
            plan: user.plan || "free",
            cvCount: user.cvCount || 0,
          });
        }
      }

      return res.status(401).json({ message: "غير مصادق" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });
}
