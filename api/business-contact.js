import { getUserFromReq } from "./_lib/token.js";
import { query } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { name, email, company, teamSize, message, receiptImage, plan, amount } = req.body || {};
    if (!receiptImage) return res.status(400).json({ message: "صورة الحوالة مطلوبة" });

    const payload = getUserFromReq(req);
    const userId = payload?.userId || null;
    const id = `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    await query(
      `INSERT INTO business_contacts (id, user_id, name, email, company, team_size, message, receipt_image, plan, amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, userId, name || "—", email || "—", company || "business", teamSize, message, receiptImage, plan || "business", amount || 15]
    );
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("[business-contact]", err.message);
    return res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
  }
}
