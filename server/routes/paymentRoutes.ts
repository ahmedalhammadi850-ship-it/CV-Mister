import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { db } from "../db";
import { paymentRequests } from "@shared/models/cv";
import { businessContacts } from "@shared/models/business";
import { eq, desc } from "drizzle-orm";

function getUserId(req: any): string {
  if ((req.session as any)?.userId) return (req.session as any).userId;
  return req.user?.claims?.sub;
}

export function registerPaymentRoutes(app: Express) {
  app.post("/api/payment-requests", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const { receiptImage } = req.body;

      if (!receiptImage) {
        return res.status(400).json({ message: "صورة الحوالة مطلوبة" });
      }

      // Check for pending request
      const existing = await db
        .select()
        .from(paymentRequests)
        .where(eq(paymentRequests.userId, userId));

      const hasPending = existing.some(r => r.status === "pending");
      if (hasPending) {
        return res.status(400).json({ message: "لديك طلب ترقية قيد المراجعة بالفعل" });
      }

      const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const [request] = await db
        .insert(paymentRequests)
        .values({ id, userId, receiptImage, plan: "pro", amount: 3, status: "pending" })
        .returning();

      res.status(201).json({ success: true, id: request.id });
    } catch (err) {
      console.error("Payment request error:", err);
      res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
    }
  });

  app.get("/api/payment-requests/my", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const requests = await db
        .select()
        .from(paymentRequests)
        .where(eq(paymentRequests.userId, userId))
        .orderBy(desc(paymentRequests.createdAt));
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.post("/api/business-contact", async (req: Request, res: Response) => {
    try {
      const { name, email, company, teamSize, message } = req.body;
      if (!name || !email || !company) {
        return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة" });
      }
      const userId = (req as any).session?.userId || (req as any).user?.claims?.sub || null;
      const id = `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await db.insert(businessContacts).values({ id, userId, name, email, company, teamSize, message });
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("Business contact error:", err);
      res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
    }
  });
}
