import { verifyFirebaseToken, getDb } from "../_lib/firebase.js";
import { setUserCookie } from "../_lib/token.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });

    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: uid, email, emailVerified } = firebaseUser;
    if (!emailVerified) return res.status(403).json({ message: "Email not verified" });

    const db = getDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    let userData;
    if (!userSnap.exists) {
      userData = {
        email: email.toLowerCase(),
        firstName: null,
        lastName: null,
        profileImageUrl: null,
        plan: "free",
        cvCount: 0,
        planExpiresAt: null,
        firebaseUid: uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userRef.set(userData);
    } else {
      userData = userSnap.data();
      if (
        (userData.plan === "business" || userData.plan === "pro") &&
        userData.planExpiresAt &&
        new Date() > new Date(userData.planExpiresAt)
      ) {
        await userRef.update({ plan: "free", planExpiresAt: null, updatedAt: new Date().toISOString() });
        userData.plan = "free";
      }
    }

    setUserCookie(res, uid);
    return res.json({
      id: uid,
      email: userData.email,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      plan: userData.plan || "free",
      cvCount: userData.cvCount || 0,
      planExpiresAt: userData.planExpiresAt || null,
      createdAt: userData.createdAt || null,
    });
  } catch (error) {
    console.error("[firebase-sync]", error.message);
    return res.status(500).json({ message: error.message });
  }
}
