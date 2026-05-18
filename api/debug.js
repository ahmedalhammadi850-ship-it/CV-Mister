import { getDb } from "./_lib/firebase.js";

export default async function handler(req, res) {
  const info = {
    has_firebase_client_email: !!process.env.FIREBASE_CLIENT_EMAIL,
    has_firebase_private_key:  !!process.env.FIREBASE_PRIVATE_KEY,
    has_firebase_project_id:   !!process.env.FIREBASE_PROJECT_ID,
    has_session_secret:        !!process.env.SESSION_SECRET,
    firebase_project_id:       process.env.FIREBASE_PROJECT_ID || "(not set)",
    private_key_starts:        (process.env.FIREBASE_PRIVATE_KEY || "").slice(0, 40).replace(/\n/g, "\\n"),
    node_version:              process.version,
    firebase_test:             "not_run",
    firebase_error:            null,
  };

  try {
    const db = getDb();
    const snap = await db.collection("users").limit(1).get();
    info.firebase_test = `ok — users collection reachable (${snap.size} doc checked)`;
  } catch (err) {
    info.firebase_test  = "FAILED";
    info.firebase_error = err.message;
  }

  res.json(info);
}
