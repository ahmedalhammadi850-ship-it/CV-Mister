import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const cvsSnap = await db.collection("cvs").get();
    const cvs = cvsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const userIds = [...new Set(cvs.map(cv => cv.userId).filter(Boolean))];
    const userMap = {};
    for (let i = 0; i < userIds.length; i += 30) {
      const chunk = userIds.slice(i, i + 30);
      const usersSnap = await db.collection("users").where("__name__", "in", chunk).get();
      usersSnap.docs.forEach(d => { userMap[d.id] = d.data(); });
    }

    const result = cvs
      .map(cv => ({
        id: cv.id,
        name: cv.name,
        template: cv.template,
        atsScore: cv.atsScore,
        downloadCount: cv.downloadCount || 0,
        lastModified: cv.lastModified,
        userId: cv.userId,
        userEmail: userMap[cv.userId]?.email || null,
        userFirstName: userMap[cv.userId]?.firstName || null,
        userLastName: userMap[cv.userId]?.lastName || null,
      }))
      .sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
