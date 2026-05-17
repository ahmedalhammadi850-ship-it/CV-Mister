import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("paymentRequests").get();
    const requests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const userIds = [...new Set(requests.map(r => r.userId).filter(Boolean))];
    const userMap = {};
    for (let i = 0; i < userIds.length; i += 30) {
      const chunk = userIds.slice(i, i + 30);
      const usersSnap = await db.collection("users").where("__name__", "in", chunk).get();
      usersSnap.docs.forEach(d => { userMap[d.id] = d.data(); });
    }

    const result = requests
      .map(r => ({
        ...r,
        userEmail: userMap[r.userId]?.email || null,
        userFirstName: userMap[r.userId]?.firstName || null,
        userLastName: userMap[r.userId]?.lastName || null,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
