export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const CHAT_WEBHOOK =
    process.env.N8N_CHAT_WEBHOOK_URL ||
    "https://ahmed144.app.n8n.cloud/webhook/1d6ee35d-0280-4d68-a839-eeb1b13e298e";

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
