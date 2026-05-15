import { getAdminFromReq } from "../../_lib/token.js";
import { query } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { id } = req.query;
  const { is_free } = req.body || {};
  if (typeof is_free !== "boolean") return res.status(400).json({ message: "قيمة is_free يجب أن تكون boolean" });
  try {
    const result = await query(
      "UPDATE template_config SET is_free=$1, updated_at=NOW() WHERE template_id=$2 RETURNING *",
      [is_free, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "القالب غير موجود" });
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
