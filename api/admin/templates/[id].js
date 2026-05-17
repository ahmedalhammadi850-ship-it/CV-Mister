import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { id } = req.query;
  const { is_free } = req.body || {};
  if (typeof is_free !== "boolean") return res.status(400).json({ message: "قيمة is_free يجب أن تكون boolean" });
  try {
    const db = getDb();
    await db.collection("templateConfig").doc(id).set(
      { isFree: is_free, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return res.json({ templateId: id, isFree: is_free });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
