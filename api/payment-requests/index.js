import { getUserFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

const cooldowns = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const userId = payload.userId;

  const lastTime = cooldowns.get(userId);
  if (lastTime && Date.now() - lastTime < 30000) {
    const remaining = Math.ceil((30000 - (Date.now() - lastTime)) / 1000);
    return res.status(429).json({ message: `يرجى الانتظار ${remaining} ثانية`, remaining });
  }
  cooldowns.set(userId, Date.now());

  try {
    const { receiptImage } = req.body || {};
    if (!receiptImage) return res.status(400).json({ message: "صورة الحوالة مطلوبة" });

    const existing = await query("SELECT status FROM payment_requests WHERE user_id=$1", [userId]);
    if (existing.rows.some(r => r.status === "pending")) {
      return res.status(400).json({ message: "لديك طلب ترقية قيد المراجعة بالفعل" });
    }

    const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await query(
      "INSERT INTO payment_requests (id, user_id, receipt_image, plan, amount, status) VALUES ($1,$2,$3,'pro',3,'pending') RETURNING *",
      [id, userId, receiptImage]
    );
    return res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("[payment-requests]", err.message);
    return res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
  }
}
