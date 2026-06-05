import { getN8nSettings } from "../_lib/n8nSettings.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { text, action, language } = req.body || {};
  if (!text || !action) return res.status(400).json({ message: "text and action are required" });

  const settings = await getN8nSettings();
  const webhookUrl = settings.N8N_AI_WEBHOOK_URL;
  if (!webhookUrl) return res.status(503).json({ message: "AI service not configured" });

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, action, language }),
    });
    const raw = await response.text();
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { output: raw }; }
    const result =
      parsed?.result || parsed?.output || parsed?.text || parsed?.message ||
      (Array.isArray(parsed) && (parsed[0]?.result || parsed[0]?.output)) ||
      (typeof parsed === "string" ? parsed : null);

    if (result) return res.json({ result });
    return res.status(503).json({ message: "No result from AI" });
  } catch {
    return res.status(503).json({ message: "AI service error" });
  }
}
