import { verifyFirebaseToken } from "../_lib/firebase.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { idToken, firstName, lastName } = req.body || {};
    if (!idToken || !firstName) return res.status(400).json({ message: "Missing idToken or firstName" });

    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: firebaseUid, email } = firebaseUser;
    if (!email) return res.status(400).json({ message: "No email in Firebase token" });

    const existing = await query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
    if (!existing.rows[0]) {
      await query(
        "INSERT INTO users (email, first_name, last_name, firebase_uid) VALUES ($1,$2,$3,$4)",
        [email.toLowerCase(), firstName, lastName || null, firebaseUid]
      );
    }
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("[firebase-register]", error.message);
    return res.status(500).json({ message: error.message });
  }
}
