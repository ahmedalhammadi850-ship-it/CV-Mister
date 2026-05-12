import type { Express } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { db } from "../db";
import { cvs } from "@shared/models/cv";
import { eq, and, desc } from "drizzle-orm";

export function registerCVRoutes(app: Express) {
  app.get("/api/cvs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const { id, name, cvData, template, theme, atsScore } = req.body;
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

  app.delete("/api/cvs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await db.delete(cvs).where(and(eq(cvs.id, req.params.id), eq(cvs.userId, userId)));
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting CV:", err);
      res.status(500).json({ message: "Failed to delete CV" });
    }
  });
}
