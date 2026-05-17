import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

const NAVBAR_DOC = "appConfig/navbar";

const ALLOWED_KEYS = [
  'home_ar', 'home_en',
  'templates_ar', 'templates_en',
  'pricing_ar', 'pricing_en',
  'about_ar', 'about_en',
];

export default async function handler(req, res) {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: 'غير مصادق' });

  const db = getDb();
  const ref = db.doc(NAVBAR_DOC);

  if (req.method === 'GET') {
    try {
      const snap = await ref.get();
      const stored = snap.exists ? snap.data() : {};
      return res.json(stored);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const updates = req.body || {};
      const filtered = {};
      for (const key of ALLOWED_KEYS) {
        if (key in updates) filtered[key] = String(updates[key]);
      }
      if (!Object.keys(filtered).length)
        return res.status(400).json({ message: 'لا توجد بيانات صالحة' });
      await ref.set(filtered, { merge: true });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(405).end();
}
