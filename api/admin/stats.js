import { getAdminFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const [users, cvs, pending, approved, biz] = await Promise.all([
      query("SELECT COUNT(*) as c FROM users"),
      query("SELECT COUNT(*) as c FROM cvs"),
      query("SELECT COUNT(*) as c FROM payment_requests WHERE status='pending'"),
      query("SELECT COUNT(*) as c FROM payment_requests WHERE status='approved'"),
      query("SELECT COUNT(*) as c FROM business_contacts"),
    ]);
    return res.json({
      users: Number(users.rows[0].c),
      cvs: Number(cvs.rows[0].c),
      pendingPayments: Number(pending.rows[0].c),
      approvedPayments: Number(approved.rows[0].c),
      businessContacts: Number(biz.rows[0].c),
    });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
