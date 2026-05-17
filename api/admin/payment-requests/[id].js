import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

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
    const db = getDb();
    const ref = db.collection("paymentRequests").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "الطلب غير موجود" });

    const now = new Date().toISOString();
    await ref.update({ status, notes: notes || null, reviewedAt: now });
    const data = snap.data();

    if (status === "approved" && data.userId) {
      const cvsSnap = await db.collection("cvs").where("userId", "==", data.userId).get();
      await Promise.all(cvsSnap.docs.map(d => d.ref.delete()));
      await db.collection("users").doc(data.userId).update({ plan: "pro", cvCount: 0, updatedAt: now });
    }
    if (status === "rejected" && data.userId) {
      await db.collection("users").doc(data.userId).update({ plan: "free", updatedAt: now });
    }

    return res.json({ id, ...data, status, notes: notes || null, reviewedAt: now });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
