import type { Express, Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

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
      const completion = await openai.chat.completions.create({
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
}
