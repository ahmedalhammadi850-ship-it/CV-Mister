import { getN8nSettings } from "./_lib/n8nSettings.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const settings = await getN8nSettings();
  const webhookUrl = settings.N8N_PAYMENT_WEBHOOK_URL;
  if (!webhookUrl) return res.json({ success: false });
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
}
