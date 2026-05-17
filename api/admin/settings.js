import { getAdminFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

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
      const allowed = ["N8N_AI_WEBHOOK_URL", "N8N_CHAT_WEBHOOK_URL", "N8N_PAYMENT_WEBHOOK_URL"];
      const updates = {};
      for (const key of allowed) {
        if (req.body && key in req.body) {
          updates[key] = req.body[key];
        }
      }
      if (Object.keys(updates).length === 0)
        return res.status(400).json({ message: "لا توجد قيم للتحديث" });

      await ref.set(updates, { merge: true });
      return res.json({ success: true, updated: updates });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(405).end();
}
