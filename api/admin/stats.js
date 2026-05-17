import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const [usersSnap, cvsSnap, pendingSnap, approvedSnap, bizSnap] = await Promise.all([
      db.collection("users").get(),
      db.collection("cvs").get(),
      db.collection("paymentRequests").where("status", "==", "pending").get(),
      db.collection("paymentRequests").where("status", "==", "approved").get(),
      db.collection("businessContacts").get(),
    ]);
    return res.json({
      users: usersSnap.size,
      cvs: cvsSnap.size,
      pendingPayments: pendingSnap.size,
      approvedPayments: approvedSnap.size,
      businessContacts: bizSnap.size,
    });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
