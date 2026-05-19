import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

const PRICING_DOC = "appConfig/pricing";

const ALLOWED_KEYS = [
  "free_features", "pro_features", "business_features",
];

export default async function handler(req, res) {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });

  const db = getDb();
  const ref = db.doc(PRICING_DOC);

  if (req.method === "GET") {
    try {
      const snap = await ref.get();
      const stored = snap.exists ? snap.data() : {};
      return res.json(stored);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const updates = req.body || {};
      const filtered = {};
      for (const key of ALLOWED_KEYS) {
        if (key in updates) {
          filtered[key] = updates[key];
        }
      }
      if (!Object.keys(filtered).length)
        return res.status(400).json({ message: "لا توجد بيانات صالحة" });

      await ref.set(filtered, { merge: true });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(405).end();
}
