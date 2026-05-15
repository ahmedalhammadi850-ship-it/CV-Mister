import { getUserFromReq } from "../../_lib/token.js";
import { query } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const { id } = req.query;
    const result = await query(
      "UPDATE cvs SET download_count = download_count + 1 WHERE id=$1 AND user_id=$2 RETURNING download_count",
      [id, payload.userId]
    );
    return res.json({ downloadCount: result.rows[0]?.download_count ?? 0 });
  } catch (err) {
    return res.status(500).json({ message: "Failed to track download" });
  }
}
