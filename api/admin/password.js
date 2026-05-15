import bcrypt from "bcryptjs";
import { getAdminFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ message: "جميع الحقول مطلوبة" });
  if (newPassword.length < 6) return res.status(400).json({ message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
  try {
    const result = await query("SELECT * FROM admin_config WHERE id=$1", [admin.adminId]);
    const adminRow = result.rows[0];
    if (!adminRow) return res.status(404).json({ message: "المستخدم غير موجود" });
    const valid = await bcrypt.compare(currentPassword, adminRow.password_hash);
    if (!valid) return res.status(401).json({ message: "كلمة المرور الحالية غير صحيحة" });
    const newHash = await bcrypt.hash(newPassword, 12);
    await query("UPDATE admin_config SET password_hash=$1, updated_at=NOW() WHERE id=$2", [newHash, admin.adminId]);
    return res.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
