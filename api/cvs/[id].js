import { getUserFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const uid = payload.userId;
  const { id } = req.query;
  const db = getDb();

  if (req.method === "GET") {
    try {
      const snap = await db.collection("cvs").doc(id).get();
      if (!snap.exists || snap.data().userId !== uid) return res.status(404).json({ message: "CV not found" });
      return res.json({ id: snap.id, ...snap.data() });
    } catch {
      return res.status(500).json({ message: "Failed to fetch CV" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { name } = req.body || {};
      if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
      const snap = await db.collection("cvs").doc(id).get();
      if (!snap.exists || snap.data().userId !== uid) return res.status(404).json({ message: "CV not found" });
      const now = new Date().toISOString();
      await db.collection("cvs").doc(id).update({ name: name.trim(), lastModified: now });
      return res.json({ id, ...snap.data(), name: name.trim(), lastModified: now });
    } catch {
      return res.status(500).json({ message: "Failed to rename CV" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const snap = await db.collection("cvs").doc(id).get();
      if (snap.exists && snap.data().userId === uid) {
        await db.collection("cvs").doc(id).delete();
      }
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Failed to delete CV" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
