import { getAdminFromReq } from "../../_lib/token.js";
import { query } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { id } = req.query;
  try {
    await query("DELETE FROM cvs WHERE user_id=$1", [id]);
    await query("DELETE FROM payment_requests WHERE user_id=$1", [id]);
    await query("DELETE FROM users WHERE id=$1", [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
