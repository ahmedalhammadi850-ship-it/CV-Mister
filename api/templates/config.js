import { query } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const result = await query("SELECT template_id, is_free FROM template_config ORDER BY template_id");
    const config = {};
    for (const row of result.rows) config[row.template_id] = row.is_free;
    return res.json(config);
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
