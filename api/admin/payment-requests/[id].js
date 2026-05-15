import { getAdminFromReq } from "../../_lib/token.js";
import { query } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { id } = req.query;
  const { status, notes } = req.body || {};
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "حالة غير صحيحة" });
  }
  try {
    const result = await query(
      "UPDATE payment_requests SET status=$1, notes=$2, reviewed_at=NOW() WHERE id=$3 RETURNING *",
      [status, notes || null, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "الطلب غير موجود" });
    const row = result.rows[0];

    if (status === "approved" && row.user_id) {
      await query("UPDATE users SET plan='pro', cv_count=0, updated_at=NOW() WHERE id=$1", [row.user_id]);
      await query("DELETE FROM cvs WHERE user_id=$1", [row.user_id]);
    }
    if (status === "rejected" && row.user_id) {
      await query("UPDATE users SET plan='free', updated_at=NOW() WHERE id=$1", [row.user_id]);
    }
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
