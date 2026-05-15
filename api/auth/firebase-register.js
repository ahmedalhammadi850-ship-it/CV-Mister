import { Pool } from "pg";

let pool;
function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set on Vercel");
  }
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("VITE_FIREBASE_API_KEY not set");
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!response.ok) throw new Error("Invalid Firebase token");
  const data = await response.json();
  if (!data.users || data.users.length === 0) throw new Error("User not found");
  return data.users[0];
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { idToken, firstName, lastName } = req.body;
    if (!idToken || !firstName) return res.status(400).json({ message: "Missing required fields" });

    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: firebaseUid, email } = firebaseUser;

    if (!email) return res.status(400).json({ message: "No email from Firebase" });

    const client = await getPool().connect();
    try {
      const result = await client.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
      if (!result.rows[0]) {
        await client.query(
          "INSERT INTO users (email, first_name, last_name, firebase_uid) VALUES ($1, $2, $3, $4)",
          [email.toLowerCase(), firstName, lastName || null, firebaseUid]
        );
      }
      res.status(201).json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Firebase register error:", error.message);
    res.status(500).json({ message: error.message || "Failed to register user" });
  }
}
