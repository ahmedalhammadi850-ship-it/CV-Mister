export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const webhookUrl = process.env.N8N_PAYMENT_WEBHOOK_URL || "https://ahmed144.app.n8n.cloud/webhook/dfa3be7f-785a-4472-95b8-b9c5fb5bdeeb";
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
