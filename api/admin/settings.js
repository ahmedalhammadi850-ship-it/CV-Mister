import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";
import { invalidateCache } from "../_lib/n8nSettings.js";

const SETTINGS_DOC = "appConfig/n8n";

export default async function handler(req, res) {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });

  const db = getDb();
  const ref = db.doc(SETTINGS_DOC);

  if (req.method === "GET") {
    try {
      const snap = await ref.get();
      const stored = snap.exists ? snap.data() : {};
      const defaults = {
        N8N_AI_WEBHOOK_URL: process.env.N8N_AI_WEBHOOK_URL || "",
        N8N_CHAT_WEBHOOK_URL: process.env.N8N_CHAT_WEBHOOK_URL || "",
        N8N_PAYMENT_WEBHOOK_URL: process.env.N8N_PAYMENT_WEBHOOK_URL || "",
      };
      return res.json({ ...defaults, ...stored });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { key, value } = req.body || {};
      const allowed = ["N8N_AI_WEBHOOK_URL", "N8N_CHAT_WEBHOOK_URL", "N8N_PAYMENT_WEBHOOK_URL"];
      if (!key || !allowed.includes(key))
        return res.status(400).json({ message: "مفتاح غير مسموح به" });

      await ref.set({ [key]: value ?? "" }, { merge: true });
      invalidateCache();
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
