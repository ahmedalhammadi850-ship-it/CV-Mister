import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { id } = req.query;
  const { status } = req.body || {};
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "حالة غير صحيحة" });
  }
  try {
    const db = getDb();
    const ref = db.collection("businessContacts").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "الطلب غير موجود" });

    await ref.update({ status });
    const data = snap.data();
    const now = new Date().toISOString();

    if (status === "approved" && data.userId) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      await db.collection("users").doc(data.userId).update({
        plan: "business",
        planExpiresAt: expires.toISOString(),
        updatedAt: now,
      });
    }
    if (status === "rejected" && data.userId) {
      await db.collection("users").doc(data.userId).update({
        plan: "free",
        planExpiresAt: null,
        updatedAt: now,
      });
    }

    return res.json({ id, ...data, status });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
