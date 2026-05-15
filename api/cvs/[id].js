import { getUserFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const userId = payload.userId;
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const result = await query("SELECT * FROM cvs WHERE id=$1 AND user_id=$2", [id, userId]);
      if (!result.rows[0]) return res.status(404).json({ message: "CV not found" });
      return res.json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch CV" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { name } = req.body || {};
      if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
      const result = await query(
        "UPDATE cvs SET name=$1, last_modified=NOW() WHERE id=$2 AND user_id=$3 RETURNING *",
        [name.trim(), id, userId]
      );
      if (!result.rows[0]) return res.status(404).json({ message: "CV not found" });
      return res.json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ message: "Failed to rename CV" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await query("DELETE FROM cvs WHERE id=$1 AND user_id=$2", [id, userId]);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ message: "Failed to delete CV" });
    }
  }

  return res.status(405).end();
}
