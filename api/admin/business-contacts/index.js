import { getAdminFromReq } from "../../_lib/token.js";
import { query } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const result = await query("SELECT * FROM business_contacts ORDER BY created_at DESC");
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
