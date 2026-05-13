import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users, sessions } from "@shared/models/auth";
import { cvs } from "@shared/models/cv";
import { paymentRequests } from "@shared/models/cv";
import { businessContacts } from "@shared/models/business";
import { eq, desc, count, sql } from "drizzle-orm";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

declare module "express-session" {
  interface SessionData {
    adminId?: number;
    adminUsername?: string;
  }
}

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any).adminId) return next();
  return res.status(401).json({ message: "غير مصادق" });
};

export function registerAdminRoutes(app: Express) {
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });

      const result = await pool.query(
        "SELECT * FROM admin_config WHERE username = $1 LIMIT 1",
        [username]
      );
      const admin = result.rows[0];
      if (!admin) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });

      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });

      (req.session as any).adminId = admin.id;
      (req.session as any).adminUsername = admin.username;
      res.json({ username: admin.username });
    } catch (err) {
      console.error("Admin login error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    (req.session as any).adminId = undefined;
    (req.session as any).adminUsername = undefined;
    res.json({ message: "تم تسجيل الخروج" });
  });

  app.get("/api/admin/me", isAdminAuthenticated, (req: Request, res: Response) => {
    res.json({ username: (req.session as any).adminUsername });
  });

  app.get("/api/admin/stats", isAdminAuthenticated, async (_req: Request, res: Response) => {
    try {
      const [usersCount] = await db.select({ count: count() }).from(users);
      const [cvsCount]   = await db.select({ count: count() }).from(cvs);
      const [pendingCount] = await db
        .select({ count: count() })
        .from(paymentRequests)
        .where(eq(paymentRequests.status, "pending"));
      const [approvedCount] = await db
        .select({ count: count() })
        .from(paymentRequests)
        .where(eq(paymentRequests.status, "approved"));
      const [bizCount] = await db.select({ count: count() }).from(businessContacts);

      res.json({
        users:            Number(usersCount.count),
        cvs:              Number(cvsCount.count),
        pendingPayments:  Number(pendingCount.count),
        approvedPayments: Number(approvedCount.count),
        businessContacts: Number(bizCount.count),
      });
    } catch (err) {
      console.error("Admin stats error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.get("/api/admin/users", isAdminAuthenticated, async (_req: Request, res: Response) => {
    try {
      const allUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt));
      res.json(allUsers.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        createdAt: u.createdAt,
        hasPassword: !!u.passwordHash,
        plan: u.plan || 'free',
        cvCount: u.cvCount || 0,
      })));
    } catch (err) {
      console.error("Admin users error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.get("/api/admin/cvs", isAdminAuthenticated, async (_req: Request, res: Response) => {
    try {
      const allCvs = await db
        .select({
          id: cvs.id,
          name: cvs.name,
          template: cvs.template,
          atsScore: cvs.atsScore,
          lastModified: cvs.lastModified,
          userId: cvs.userId,
          userEmail: users.email,
          userFirstName: users.firstName,
          userLastName: users.lastName,
        })
        .from(cvs)
        .leftJoin(users, eq(cvs.userId, users.id))
        .orderBy(desc(cvs.lastModified));
      res.json(allCvs);
    } catch (err) {
      console.error("Admin CVs error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.get("/api/admin/payment-requests", isAdminAuthenticated, async (_req: Request, res: Response) => {
    try {
      const requests = await db
        .select({
          id: paymentRequests.id,
          plan: paymentRequests.plan,
          amount: paymentRequests.amount,
          status: paymentRequests.status,
          createdAt: paymentRequests.createdAt,
          reviewedAt: paymentRequests.reviewedAt,
          notes: paymentRequests.notes,
          receiptImage: paymentRequests.receiptImage,
          userId: paymentRequests.userId,
          userEmail: users.email,
          userFirstName: users.firstName,
          userLastName: users.lastName,
        })
        .from(paymentRequests)
        .leftJoin(users, eq(paymentRequests.userId, users.id))
        .orderBy(desc(paymentRequests.createdAt));
      res.json(requests);
    } catch (err) {
      console.error("Admin payments error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.patch("/api/admin/payment-requests/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const { status, notes } = req.body;
      if (!["approved", "rejected", "pending"].includes(status))
        return res.status(400).json({ message: "حالة غير صحيحة" });

      const result = await pool.query(
        `UPDATE payment_requests SET status=$1, notes=$2, reviewed_at=NOW() WHERE id=$3 RETURNING *`,
        [status, notes || null, req.params.id]
      );
      if (!result.rows.length)
        return res.status(404).json({ message: "الطلب غير موجود" });

      const paymentRow = result.rows[0];

      // If approved → upgrade user to pro + reset cv_count
      if (status === "approved" && paymentRow.user_id) {
        await pool.query(
          `UPDATE users SET plan='pro', cv_count=0, updated_at=NOW() WHERE id=$1`,
          [paymentRow.user_id]
        );
        // Delete existing CVs so they start fresh with 2 slots
        await pool.query(`DELETE FROM cvs WHERE user_id=$1`, [paymentRow.user_id]);
      }

      // If rejected → keep user on free plan
      if (status === "rejected" && paymentRow.user_id) {
        await pool.query(
          `UPDATE users SET plan='free', updated_at=NOW() WHERE id=$1`,
          [paymentRow.user_id]
        );
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Admin update payment error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.get("/api/admin/business-contacts", isAdminAuthenticated, async (_req: Request, res: Response) => {
    try {
      const contacts = await db
        .select()
        .from(businessContacts)
        .orderBy(desc(businessContacts.createdAt));
      res.json(contacts);
    } catch (err) {
      console.error("Admin business contacts error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.patch("/api/admin/business-contacts/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!["approved", "rejected", "pending"].includes(status))
        return res.status(400).json({ message: "حالة غير صحيحة" });

      const result = await pool.query(
        `UPDATE business_contacts SET status=$1 WHERE id=$2 RETURNING *`,
        [status, req.params.id]
      );
      if (!result.rows.length)
        return res.status(404).json({ message: "الطلب غير موجود" });

      const row = result.rows[0];

      if (status === "approved" && row.user_id) {
        await pool.query(
          `UPDATE users SET plan='business', updated_at=NOW() WHERE id=$1`,
          [row.user_id]
        );
      }
      if (status === "rejected" && row.user_id) {
        await pool.query(
          `UPDATE users SET plan='free', updated_at=NOW() WHERE id=$1`,
          [row.user_id]
        );
      }

      res.json(row);
    } catch (err) {
      console.error("Admin update business contact error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.patch("/api/admin/password", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword)
        return res.status(400).json({ message: "جميع الحقول مطلوبة" });
      if (newPassword.length < 6)
        return res.status(400).json({ message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });

      const adminId = (req.session as any).adminId;
      const result = await pool.query("SELECT * FROM admin_config WHERE id=$1", [adminId]);
      const admin = result.rows[0];
      if (!admin) return res.status(404).json({ message: "المستخدم غير موجود" });

      const valid = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!valid) return res.status(401).json({ message: "كلمة المرور الحالية غير صحيحة" });

      const newHash = await bcrypt.hash(newPassword, 12);
      await pool.query(
        "UPDATE admin_config SET password_hash=$1, updated_at=NOW() WHERE id=$2",
        [newHash, adminId]
      );
      res.json({ message: "تم تغيير كلمة المرور بنجاح" });
    } catch (err) {
      console.error("Admin change password error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.delete("/api/admin/users/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await pool.query("DELETE FROM cvs WHERE user_id=$1", [req.params.id]);
      await pool.query("DELETE FROM payment_requests WHERE user_id=$1", [req.params.id]);
      await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      console.error("Admin delete user error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });
}
