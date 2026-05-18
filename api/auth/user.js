import { getUserFromReq, getIdTokenFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const payload = getUserFromReq(req);
    if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });

    const idToken = getIdTokenFromReq(req);
    const db = getDb(idToken);
    const userSnap = await db.collection("users").doc(payload.userId).get();
    if (!userSnap.exists) return res.status(401).json({ message: "غير مصادق" });

    const user = userSnap.data();
    let plan = user.plan || "free";
    if (plan === "business" && user.planExpiresAt && new Date() > new Date(user.planExpiresAt)) {
      plan = "free";
      await db.collection("users").doc(payload.userId).update({
        plan: "free",
        updatedAt: new Date().toISOString(),
      });
    }

    return res.json({
      id: payload.userId,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      plan,
      cvCount: user.cvCount || 0,
      planExpiresAt: user.planExpiresAt || null,
    });
  } catch (error) {
    console.error("[auth/user]", error.message);
    return res.status(500).json({ message: error.message });
  }
}
