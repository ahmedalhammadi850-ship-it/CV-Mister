import { getUserFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

const FREE_LIMIT = 1;
const PRO_LIMIT = 2;

export default async function handler(req, res) {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const uid = payload.userId;
  const db = getDb();

  if (req.method === "GET") {
    try {
      const snap = await db.collection("cvs").where("userId", "==", uid).get();
      const cvs = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return tb - ta;
        });
      return res.json(cvs);
    } catch (err) {
      console.error("[cvs GET]", err.message);
      return res.status(500).json({ message: "Failed to fetch CVs" });
    }
  }

  if (req.method === "POST") {
    try {
      const { id, name, cvData, template, theme, atsScore } = req.body || {};

      const cvRef = db.collection("cvs").doc(id);
      const cvSnap = await cvRef.get();
      const isNew = !cvSnap.exists;

      const userSnap = await db.collection("users").doc(uid).get();
      const userData = userSnap.data() || {};
      const plan = userData.plan || "free";

      // Check free plan monthly expiry (blocks editing existing CVs too)
      if (plan === "free") {
        const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
        if (createdAt) {
          const expiryDate = new Date(createdAt);
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          if (new Date() > expiryDate) {
            return res.status(403).json({
              message: "انتهت فترة الاستخدام المجاني. قم بالترقية للاستمرار.",
              freeExpired: true,
            });
          }
        }
      }

      if (isNew) {
        const limit = plan === "business" ? Infinity : plan === "pro" ? PRO_LIMIT : FREE_LIMIT;
        const countSnap = await db.collection("cvs").where("userId", "==", uid).get();
        const count = countSnap.size;
        if (count >= limit) {
          return res.status(403).json({
            message:
              plan === "free"
                ? `وصلت للحد المجاني (${FREE_LIMIT} سيرة). قم بالترقية للحصول على المزيد.`
                : `وصلت لحد الخطة المدفوعة (${PRO_LIMIT} سيرة). قم بتجديد الاشتراك.`,
            limitReached: true,
            plan,
            limit: isFinite(limit) ? limit : null,
            count,
          });
        }
      }

      const now = new Date().toISOString();
      await cvRef.set({
        userId: uid,
        name,
        cvData,
        template,
        theme,
        atsScore,
        lastModified: now,
        downloadCount: cvSnap.data()?.downloadCount || 0,
      });
      return res.json({ id, userId: uid, name, cvData, template, theme, atsScore, lastModified: now });
    } catch (err) {
      console.error("[cvs POST]", err.message);
      return res.status(500).json({ message: "Failed to save CV" });
    }
  }

  return res.status(405).end();
}
