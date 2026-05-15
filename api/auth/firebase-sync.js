import { verifyFirebaseToken } from "../_lib/firebase.js";
import { query } from "../_lib/db.js";
import { setUserCookie } from "../_lib/token.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });

    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: firebaseUid, email, emailVerified } = firebaseUser;
    if (!emailVerified) return res.status(403).json({ message: "Email not verified" });

    let result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    let user = result.rows[0];

    if (!user) {
      result = await query(
        "INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING *",
        [email.toLowerCase(), firebaseUid]
      );
      user = result.rows[0];
    } else if (!user.firebase_uid) {
      await query("UPDATE users SET firebase_uid=$1, updated_at=NOW() WHERE id=$2", [firebaseUid, user.id]);
      result = await query("SELECT * FROM users WHERE id=$1", [user.id]);
      user = result.rows[0];
    }

    let plan = user.plan || "free";
    if (plan === "business" && user.plan_expires_at && new Date() > new Date(user.plan_expires_at)) {
      plan = "free";
      await query("UPDATE users SET plan='free', updated_at=NOW() WHERE id=$1", [user.id]);
    }

    setUserCookie(res, user.id);
    return res.json({
      id: user.id, email: user.email,
      firstName: user.first_name, lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      plan, cvCount: user.cv_count || 0, planExpiresAt: user.plan_expires_at || null,
    });
  } catch (error) {
    console.error("[firebase-sync]", error.message);
    return res.status(500).json({ message: error.message });
  }
}
