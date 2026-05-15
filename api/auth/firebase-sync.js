import pkg from "pg";
const { Pool } = pkg;

let pool;
function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set on Vercel — add it in Vercel → Settings → Environment Variables");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("VITE_FIREBASE_API_KEY is not set on Vercel");
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Firebase token error: ${JSON.stringify(err)}`);
  }
  const data = await response.json();
  if (!data.users || data.users.length === 0) throw new Error("Firebase user not found");
  return data.users[0];
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });

    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: firebaseUid, email, emailVerified } = firebaseUser;

    if (!emailVerified) return res.status(403).json({ message: "Email not verified" });

    const client = await getPool().connect();
    try {
      let result = await client.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
      let user = result.rows[0];

      if (!user) {
        result = await client.query(
          "INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING *",
          [email.toLowerCase(), firebaseUid]
        );
        user = result.rows[0];
      } else if (!user.firebase_uid) {
        await client.query(
          "UPDATE users SET firebase_uid = $1, updated_at = NOW() WHERE id = $2",
          [firebaseUid, user.id]
        );
        result = await client.query("SELECT * FROM users WHERE id = $1", [user.id]);
        user = result.rows[0];
      }

      let plan = user.plan || "free";
      if (plan === "business" && user.plan_expires_at && new Date() > new Date(user.plan_expires_at)) {
        plan = "free";
        await client.query("UPDATE users SET plan = 'free', updated_at = NOW() WHERE id = $1", [user.id]);
      }

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        plan,
        cvCount: user.cv_count || 0,
        planExpiresAt: user.plan_expires_at || null,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[firebase-sync] Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
