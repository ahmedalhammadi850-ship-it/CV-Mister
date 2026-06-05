import { verifyFirebaseToken, getDb } from "../_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const { idToken, firstName, lastName } = req.body || {};
    if (!idToken || !firstName) return res.status(400).json({ message: "Missing idToken or firstName" });

    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: uid, email } = firebaseUser;
    if (!email) return res.status(400).json({ message: "No email in Firebase token" });

    const db = getDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        email: email.toLowerCase(),
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
        plan: "free",
        cvCount: 0,
        planExpiresAt: null,
        firebaseUid: uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      const data = userSnap.data();
      if (!data.firstName && firstName) {
        await userRef.update({
          firstName,
          lastName: lastName || null,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("[firebase-register]", error.message);
    return res.status(500).json({ message: error.message });
  }
}
