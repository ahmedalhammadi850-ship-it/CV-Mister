import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("businessContacts").get();
    const contacts = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(contacts);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
