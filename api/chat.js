import { getN8nSettings } from "./_lib/n8nSettings.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const settings = await getN8nSettings();
  const CHAT_WEBHOOK = settings.N8N_CHAT_WEBHOOK_URL;

  if (!CHAT_WEBHOOK) return res.status(503).json({ reply: "" });

  try {
    const response = await fetch(CHAT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const raw = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { output: raw };
    }

    const reply =
      parsed?.output ||
      parsed?.message ||
      parsed?.text ||
      parsed?.reply ||
      (typeof parsed === "string" ? parsed : null) ||
      (Array.isArray(parsed) &&
        (parsed[0]?.output || parsed[0]?.message || parsed[0]?.text)) ||
      "";

    res.json({ reply });
  } catch (err) {
    console.error("Chat proxy error:", err);
    res.status(500).json({ reply: "" });
  }
}
