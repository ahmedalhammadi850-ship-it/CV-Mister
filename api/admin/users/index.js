import { getAdminFromReq } from "../../_lib/token.js";
import { query } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const result = await query("SELECT * FROM users ORDER BY created_at DESC");
    return res.json(result.rows.map(u => ({
      id: u.id, email: u.email,
      firstName: u.first_name, lastName: u.last_name,
      createdAt: u.created_at, hasPassword: !!u.password_hash,
      plan: u.plan || "free", cvCount: u.cv_count || 0,
    })));
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
