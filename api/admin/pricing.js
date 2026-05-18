import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

const PRICING_DOC = "appConfig/pricing";

const ALLOWED_KEYS = [
  "pro_price", "pro_name", "pro_name_en", "pro_desc", "pro_desc_en",
  "business_price", "business_name", "business_name_en", "business_desc", "business_desc_en",
  "free_name", "free_name_en", "free_desc", "free_desc_en",
  "payment_account", "payment_bank", "payment_beneficiary",
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
