import type { Express, Request, Response } from "express";

async function rewriteViaN8n(text: string, action: string, language: string): Promise<string | null> {
  const webhookUrl = process.env.N8N_AI_WEBHOOK_URL;
  if (!webhookUrl) return null;
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, action, language }),
    });
    const raw = await response.text();
    let parsed: any = null;
    try { parsed = JSON.parse(raw); } catch { parsed = { output: raw }; }
    return (
      parsed?.result ||
      parsed?.output ||
      parsed?.text ||
      parsed?.message ||
      (Array.isArray(parsed) && (parsed[0]?.result || parsed[0]?.output)) ||
      (typeof parsed === "string" ? parsed : null)
    );
  } catch {
    return null;
  }
}

export function registerAIRoutes(app: Express) {
  app.post("/api/ai/rewrite", async (req: Request, res: Response) => {
    const { text, action, language } = req.body as {
      text: string;
      action: "improve" | "suggest" | "grammar" | "shorten";
      language: "ar" | "en";
    };

    if (!text || !action) {
      return res.status(400).json({ message: "text and action are required" });
    }

    const n8nResult = await rewriteViaN8n(text, action, language);
    if (n8nResult) {
      return res.json({ result: n8nResult });
    }

    return res.status(503).json({ message: "AI service not configured" });
  });

  // Payment webhook proxy — forwards receipt image to n8n
  app.post("/api/payment-webhook", async (req: Request, res: Response) => {
    const webhookUrl = process.env.N8N_PAYMENT_WEBHOOK_URL || "https://ahmed144.app.n8n.cloud/webhook/dfa3be7f-785a-4472-95b8-b9c5fb5bdeeb";
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      res.json({ success: true });
    } catch {
      res.json({ success: false });
    }
  });
}
