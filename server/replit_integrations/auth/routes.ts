import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

async function verifyFirebaseToken(idToken: string): Promise<any> {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!response.ok) throw new Error("Invalid Firebase token");
  const data = await response.json();
  if (!data.users || data.users.length === 0) throw new Error("User not found");
  return data.users[0];
}

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/firebase-register", async (req: Request, res: Response) => {
    try {
      const { idToken, firstName, lastName } = req.body;
      if (!idToken || !firstName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const firebaseUser = await verifyFirebaseToken(idToken);
      const { localId: firebaseUid, email } = firebaseUser;

      if (!email) return res.status(400).json({ message: "No email from Firebase" });

      const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (!existing) {
        await db.insert(users).values({
          email: email.toLowerCase(),
          firstName,
          lastName: lastName || null,
          firebaseUid,
        });
      }

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Firebase register error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/firebase-sync", async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ message: "Missing token" });

      const firebaseUser = await verifyFirebaseToken(idToken);
      const { localId: firebaseUid, email, emailVerified } = firebaseUser;

      if (!emailVerified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      let [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

      if (!user) {
        [user] = await db
          .insert(users)
          .values({ email: email.toLowerCase(), firebaseUid })
          .returning();
      } else if (!user.firebaseUid) {
        await db.update(users).set({ firebaseUid, updatedAt: new Date() }).where(eq(users.id, user.id));
      }

      (req.session as any).userId = user.id;

      let plan = user.plan || "free";
      if (plan === "business" && user.planExpiresAt) {
        const now = new Date();
        const expires = new Date(user.planExpiresAt);
        if (now > expires) {
          plan = "free";
          await db.update(users).set({ plan: "free", updatedAt: new Date() }).where(eq(users.id, user.id));
        }
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        plan,
        cvCount: user.cvCount || 0,
        planExpiresAt: user.planExpiresAt || null,
      });
    } catch (error) {
      console.error("Firebase sync error:", error);
      res.status(500).json({ message: "Failed to sync user" });
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

      const serializeUser = async (user: any) => {
        let plan = user.plan || "free";
        if (plan === "business" && user.planExpiresAt) {
          const now = new Date();
          const expires = new Date(user.planExpiresAt);
          if (now > expires) {
            plan = "free";
            await db.update(users).set({ plan: "free", updatedAt: new Date() }).where(eq(users.id, user.id));
          }
        }
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          plan,
          cvCount: user.cvCount || 0,
          planExpiresAt: user.planExpiresAt || null,
        };
      };

      if (sessionUserId) {
        const [user] = await db.select().from(users).where(eq(users.id, sessionUserId));
        if (user) return res.json(await serializeUser(user));
      }

      if ((req as any).user?.claims?.sub) {
        const userId = (req as any).user.claims.sub;
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (user) return res.json(await serializeUser(user));
      }

      return res.status(401).json({ message: "غير مصادق" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });
}
