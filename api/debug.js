export default function handler(req, res) {
  res.json({
    has_firebase_admin_email: !!process.env.FIREBASE_CLIENT_EMAIL,
    has_firebase_admin_key: !!process.env.FIREBASE_PRIVATE_KEY,
    has_firebase_project: !!process.env.FIREBASE_PROJECT_ID,
    has_firebase_api_key: !!process.env.VITE_FIREBASE_API_KEY,
    has_session_secret: !!process.env.SESSION_SECRET,
    node_version: process.version,
  });
}
