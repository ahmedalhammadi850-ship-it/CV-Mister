import { getUserFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

const FREE_LIMIT = 1;
const PRO_LIMIT = 2;

export default async function handler(req, res) {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const userId = payload.userId;

  if (req.method === "GET") {
    try {
      const result = await query(
        "SELECT * FROM cvs WHERE user_id=$1 ORDER BY last_modified DESC", [userId]
      );
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch CVs" });
    }
  }

  if (req.method === "POST") {
    try {
      const { id, name, cvData, template, theme, atsScore } = req.body || {};
      const existing = await query("SELECT id FROM cvs WHERE id=$1", [id]);
      const isNew = !existing.rows[0];

      if (isNew) {
        const userRes = await query("SELECT plan FROM users WHERE id=$1", [userId]);
        const plan = userRes.rows[0]?.plan || "free";
        const limit = plan === "business" ? Infinity : plan === "pro" ? PRO_LIMIT : FREE_LIMIT;
        const countRes = await query("SELECT COUNT(*) as c FROM cvs WHERE user_id=$1", [userId]);
        const count = Number(countRes.rows[0]?.c || 0);
        if (count >= limit) {
          return res.status(403).json({
            message: plan === "free"
              ? `وصلت للحد المجاني (${FREE_LIMIT} سيرة). قم بالترقية للحصول على المزيد.`
              : `وصلت لحد الخطة المدفوعة (${PRO_LIMIT} سيرة). قم بتجديد الاشتراك.`,
            limitReached: true, plan, limit, count,
          });
        }
      }

      const result = await query(
        `INSERT INTO cvs (id, user_id, name, cv_data, template, theme, ats_score, last_modified)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
         ON CONFLICT (id) DO UPDATE
         SET name=$3, cv_data=$4, template=$5, theme=$6, ats_score=$7, last_modified=NOW()
         RETURNING *`,
        [id, userId, name, cvData, template, theme, atsScore]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      console.error("[cvs POST]", err.message);
      return res.status(500).json({ message: "Failed to save CV" });
    }
  }

  return res.status(405).end();
}
