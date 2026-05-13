import type { Express, Request, Response } from "express";
import { isAdminAuthenticated } from "./adminRoutes";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export function registerTemplateRoutes(app: Express) {
  app.get("/api/templates/config", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT template_id, is_free FROM template_config ORDER BY template_id"
      );
      const config: Record<string, boolean> = {};
      for (const row of result.rows) {
        config[row.template_id] = row.is_free;
      }
      res.json(config);
    } catch (err) {
      console.error("Template config error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  app.patch("/api/admin/templates/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { is_free } = req.body;
      if (typeof is_free !== "boolean") {
        return res.status(400).json({ message: "قيمة is_free يجب أن تكون boolean" });
      }
      const result = await pool.query(
        "UPDATE template_config SET is_free = $1, updated_at = NOW() WHERE template_id = $2 RETURNING *",
        [is_free, id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ message: "القالب غير موجود" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Template update error:", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });
}
