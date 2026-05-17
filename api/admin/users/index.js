import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("users").get();
    const users = snap.docs
      .map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          email: d.email,
          firstName: d.firstName || null,
          lastName: d.lastName || null,
          createdAt: d.createdAt,
          plan: d.plan || "free",
          cvCount: d.cvCount || 0,
        };
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
