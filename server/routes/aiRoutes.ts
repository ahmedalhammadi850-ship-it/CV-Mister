import type { Express, Request, Response } from "express";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

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

    // Try n8n webhook first if configured
    const n8nResult = await rewriteViaN8n(text, action, language);
    if (n8nResult) {
      return res.json({ result: n8nResult });
    }

    // Fall back to OpenAI
    const prompts: Record<typeof action, string> = {
      improve: language === "ar"
        ? `أنت خبير في كتابة السير الذاتية. حسِّن النص التالي ليبدو أكثر احترافية وإقناعاً، مع الحفاظ على المعنى الأصلي. أعطني النص المحسَّن فقط بدون أي شرح:\n\n${text}`
        : `You are a CV writing expert. Improve the following text to sound more professional and compelling, keeping the original meaning. Return only the improved text without any explanation:\n\n${text}`,
      suggest: language === "ar"
        ? `أنت خبير في كتابة السير الذاتية. اكتب نصاً مناسباً ومحترفاً لهذا القسم بناءً على السياق. أعطني النص فقط بدون أي شرح:\n\n${text || "ملخص مهني عام"}`
        : `You are a CV writing expert. Write a professional and compelling text for this section based on context. Return only the text without any explanation:\n\n${text || "general professional summary"}`,
      grammar: language === "ar"
        ? `أنت خبير في اللغة العربية. صحِّح الأخطاء الإملائية والنحوية في النص التالي فقط دون تغيير المعنى أو الأسلوب. أعطني النص المصحح فقط:\n\n${text}`
        : `You are a language expert. Fix only the spelling and grammar errors in the following text without changing the meaning or style. Return only the corrected text:\n\n${text}`,
      shorten: language === "ar"
        ? `اختصر النص التالي إلى نصف طوله تقريباً مع الحفاظ على أهم النقاط. أعطني النص المختصر فقط:\n\n${text}`
        : `Shorten the following text to approximately half its length while keeping the most important points. Return only the shortened text:\n\n${text}`,
    };

    try {
      const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompts[action] }],
        max_tokens: 500,
        temperature: 0.7,
      });
      const result = completion.choices[0]?.message?.content?.trim() ?? "";
      res.json({ result });
    } catch (err: any) {
      console.error("AI rewrite error:", err?.message);
      res.status(500).json({ message: "AI_ERROR" });
    }
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
