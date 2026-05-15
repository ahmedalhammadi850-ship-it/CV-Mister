import { getAdminFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const result = await query(`
      SELECT c.id, c.name, c.template, c.ats_score, c.download_count, c.last_modified,
             c.user_id, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
      FROM cvs c LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.last_modified DESC
    `);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
