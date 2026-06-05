import { getAdminFromReq } from "../../_lib/token.js";
import { getDb } from "../../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ message: "Method not allowed" });
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { id } = req.query;
  try {
    const db = getDb();
    const [cvsSnap, paysSnap] = await Promise.all([
      db.collection("cvs").where("userId", "==", id).get(),
      db.collection("paymentRequests").where("userId", "==", id).get(),
    ]);
    await Promise.all([
      ...cvsSnap.docs.map(d => d.ref.delete()),
      ...paysSnap.docs.map(d => d.ref.delete()),
      db.collection("users").doc(id).delete(),
    ]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
