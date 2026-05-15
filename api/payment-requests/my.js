import { getUserFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const result = await query(
      "SELECT * FROM payment_requests WHERE user_id=$1 ORDER BY created_at DESC",
      [payload.userId]
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
