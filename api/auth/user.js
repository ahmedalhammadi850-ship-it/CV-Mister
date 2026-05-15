import { getUserFromReq } from "../_lib/token.js";
import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const payload = getUserFromReq(req);
    if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });

    const result = await query("SELECT * FROM users WHERE id=$1", [payload.userId]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: "غير مصادق" });

    let plan = user.plan || "free";
    if (plan === "business" && user.plan_expires_at && new Date() > new Date(user.plan_expires_at)) {
      plan = "free";
      await query("UPDATE users SET plan='free', updated_at=NOW() WHERE id=$1", [user.id]);
    }

    return res.json({
      id: user.id, email: user.email,
      firstName: user.first_name, lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      plan, cvCount: user.cv_count || 0, planExpiresAt: user.plan_expires_at || null,
    });
  } catch (error) {
    console.error("[auth/user]", error.message);
    return res.status(500).json({ message: error.message });
  }
}
