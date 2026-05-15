export default function handler(req, res) {
  res.json({
    has_database_url: !!process.env.DATABASE_URL,
    has_firebase_key: !!process.env.VITE_FIREBASE_API_KEY,
    node_version: process.version,
    database_url_prefix: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 20) + "..."
      : null,
  });
}
