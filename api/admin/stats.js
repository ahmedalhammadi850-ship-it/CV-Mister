import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
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

    // Count unique users who downloaded at least one CV
    const downloadedUserIds = new Set();
    let totalDownloads = 0;
    cvsSnap.docs.forEach(doc => {
      const data = doc.data();
      if ((data.downloadCount || 0) > 0) {
        downloadedUserIds.add(data.userId);
        totalDownloads += data.downloadCount;
      }
    });

    return res.json({
      users: usersSnap.size,
      cvs: cvsSnap.size,
      pendingPayments: pendingSnap.size,
      approvedPayments: approvedSnap.size,
      businessContacts: bizSnap.size,
      usersWithDownloads: downloadedUserIds.size,
      totalDownloads,
    });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
