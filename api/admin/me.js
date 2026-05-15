import { getAdminFromReq } from "../_lib/token.js";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  return res.json({ username: admin.adminUsername });
}
