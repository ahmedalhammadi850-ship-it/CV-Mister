import { getN8nSettings } from "./_lib/n8nSettings.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const settings = await getN8nSettings();
  const CHAT_WEBHOOK = settings.N8N_CHAT_WEBHOOK_URL;

  if (!CHAT_WEBHOOK) return res.status(503).json({ reply: "" });

  try {
    const { message, language, sessionId } = req.body || {};

    const payload = {
      chatInput: message,
      message,
      input: message,
      language: language || "ar",
      sessionId: sessionId || "default-session",
    };

    const response = await fetch(CHAT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      parsed?.reply ||
      parsed?.text ||
      parsed?.response ||
      parsed?.answer ||
      parsed?.chatOutput ||
      parsed?.message ||
      (Array.isArray(parsed) &&
        (parsed[0]?.output || parsed[0]?.reply || parsed[0]?.text || parsed[0]?.message)) ||
      (typeof parsed === "string" ? parsed : null) ||
      "";

    res.json({ reply });
  } catch (err) {
    console.error("Chat proxy error:", err);
    res.status(500).json({ reply: "" });
  }
}
