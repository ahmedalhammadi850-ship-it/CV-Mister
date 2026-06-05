import { getUserFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const { id } = req.query;
    const db = getDb();
    const cvRef = db.collection("cvs").doc(id);
    const snap = await cvRef.get();
    if (!snap.exists || snap.data().userId !== payload.userId) {
      return res.status(404).json({ message: "CV not found" });
    }
    const newCount = (snap.data().downloadCount || 0) + 1;
    await cvRef.update({ downloadCount: newCount });
    return res.json({ downloadCount: newCount });
  } catch (err) {
    return res.status(500).json({ message: "Failed to track download" });
  }
}
