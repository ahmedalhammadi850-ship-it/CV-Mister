import { getUserFromReq, getIdTokenFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const idToken = getIdTokenFromReq(req);
    const db = getDb(idToken);
    const snap = await db
      .collection("paymentRequests")
      .where("userId", "==", payload.userId)
      .get();
    const requests = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
