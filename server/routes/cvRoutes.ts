import type { Express } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { db } from "../db";
import { cvs } from "@shared/models/cv";
import { users } from "@shared/models/auth";
import { eq, and, desc, sql } from "drizzle-orm";

const FREE_LIMIT = 1;
const PRO_LIMIT = 2;

function getUserId(req: any): string {
  if ((req.session as any)?.userId) {
    return (req.session as any).userId;
  }
  return req.user?.claims?.sub;
}

export function registerCVRoutes(app: Express) {
  app.get("/api/cvs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const userCVs = await db
        .select()
        .from(cvs)
        .where(eq(cvs.userId, userId))
        .orderBy(desc(cvs.lastModified));
      res.json(userCVs);
    } catch (err) {
      console.error("Error fetching CVs:", err);
      res.status(500).json({ message: "Failed to fetch CVs" });
    }
  });

  app.get("/api/cvs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const [cv] = await db
        .select()
        .from(cvs)
        .where(and(eq(cvs.id, req.params.id), eq(cvs.userId, userId)));
      if (!cv) return res.status(404).json({ message: "CV not found" });
      res.json(cv);
    } catch (err) {
      console.error("Error fetching CV:", err);
      res.status(500).json({ message: "Failed to fetch CV" });
    }
  });

  app.post("/api/cvs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { id, name, cvData, template, theme, atsScore } = req.body;

      // Check if CV already exists (update vs new)
      const [existing] = await db.select().from(cvs).where(eq(cvs.id, id));
      const isNew = !existing;

      if (isNew) {
        // Enforce CV creation limits
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        const plan = user?.plan || "free";
        const limit = plan === "business" ? Infinity : plan === "pro" ? PRO_LIMIT : FREE_LIMIT;
        const currentCount = await db.select({ count: sql<number>`count(*)` }).from(cvs).where(eq(cvs.userId, userId));
        const count = Number(currentCount[0]?.count || 0);

        if (count >= limit) {
          return res.status(403).json({
            message: plan === "free"
              ? `وصلت للحد المجاني (${FREE_LIMIT} سيرة). قم بالترقية للحصول على المزيد.`
              : `وصلت لحد الخطة المدفوعة (${PRO_LIMIT} سيرة). قم بتجديد الاشتراك.`,
            limitReached: true,
            plan,
            limit,
            count,
          });
        }
      }

      const [cv] = await db
        .insert(cvs)
        .values({ id, userId, name, cvData, template, theme, atsScore, lastModified: new Date() })
        .onConflictDoUpdate({
          target: cvs.id,
          set: { name, cvData, template, theme, atsScore, lastModified: new Date() },
        })
        .returning();
      res.json(cv);
    } catch (err) {
      console.error("Error saving CV:", err);
      res.status(500).json({ message: "Failed to save CV" });
    }
  });

  app.patch("/api/cvs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { name } = req.body;
      if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
      const [cv] = await db
        .update(cvs)
        .set({ name: name.trim(), lastModified: new Date() })
        .where(and(eq(cvs.id, req.params.id), eq(cvs.userId, userId)))
        .returning();
      if (!cv) return res.status(404).json({ message: "CV not found" });
      res.json(cv);
    } catch (err) {
      console.error("Error renaming CV:", err);
      res.status(500).json({ message: "Failed to rename CV" });
    }
  });

  app.delete("/api/cvs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      await db.delete(cvs).where(and(eq(cvs.id, req.params.id), eq(cvs.userId, userId)));
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting CV:", err);
      res.status(500).json({ message: "Failed to delete CV" });
    }
  });

  app.post("/api/cvs/:id/download", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const [cv] = await db
        .update(cvs)
        .set({ downloadCount: sql`${cvs.downloadCount} + 1` })
        .where(and(eq(cvs.id, req.params.id), eq(cvs.userId, userId)))
        .returning({ downloadCount: cvs.downloadCount });
      res.json({ downloadCount: cv?.downloadCount ?? 0 });
    } catch (err) {
      console.error("Error tracking download:", err);
      res.status(500).json({ message: "Failed to track download" });
    }
  });
}
