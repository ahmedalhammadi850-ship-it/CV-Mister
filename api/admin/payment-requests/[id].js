import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });
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
      const approvedPlan = data.plan === "business" ? "business" : "pro";
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      /* Read user doc AND actual CV count in parallel */
      const [userSnap, cvsSnap] = await Promise.all([
        db.collection("users").doc(data.userId).get(),
        db.collection("cvs").where("userId", "==", data.userId).get(),
      ]);
      const userData      = userSnap.data() || {};
      const actualCvCount = cvsSnap.size;

      /* Use the higher of (stored cvLimit, actual CV count) as the baseline,
         then add 2 — this handles legacy accounts where cvLimit was never set */
      const storedLimit   = typeof userData.cvLimit === "number" ? userData.cvLimit : 0;
      const baseline      = Math.max(storedLimit, actualCvCount);
      const newCvLimit    = approvedPlan === "business" ? null : baseline + 2;

      const updateData = {
        plan: approvedPlan,
        planExpiresAt: expiresAt.toISOString(),
        updatedAt: now,
        cvLimit: newCvLimit,   /* null for business = unlimited */
      };

      await db.collection("users").doc(data.userId).update(updateData);
    }
    if (status === "rejected" && data.userId) {
      await db.collection("users").doc(data.userId).update({ plan: "free", planExpiresAt: null, updatedAt: now });
    }

    return res.json({ id, ...data, status, notes: notes || null, reviewedAt: now });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
