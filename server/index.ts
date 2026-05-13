import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerCVRoutes } from "./routes/cvRoutes";
import { registerAIRoutes } from "./routes/aiRoutes";
import { registerPaymentRoutes } from "./routes/paymentRoutes";
import { registerAdminRoutes } from "./routes/adminRoutes";
import { registerTemplateRoutes } from "./routes/templateRoutes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false }));

  // Font proxy — fetches Google Fonts CSS server-side to avoid CORS in html-to-image
  app.get("/api/font-proxy", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url || !url.startsWith("https://fonts.googleapis.com/")) {
        return res.status(400).send("Invalid font URL");
      }
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
      });
      const css = await response.text();
      // Rewrite font file URLs to go through a second proxy path
      const rewritten = css.replace(
        /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g,
        "url(/api/font-file?url=$1)"
      );
      res.setHeader("Content-Type", "text/css");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(rewritten);
    } catch (err) {
      console.error("Font proxy error:", err);
      res.status(500).send("");
    }
  });

  // Font file proxy — fetches actual .woff2 font files
  app.get("/api/font-file", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url || !url.startsWith("https://fonts.gstatic.com/")) {
        return res.status(400).send("Invalid font file URL");
      }
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", response.headers.get("content-type") || "font/woff2");
      res.setHeader("Cache-Control", "public, max-age=604800");
      res.send(Buffer.from(buffer));
    } catch (err) {
      console.error("Font file proxy error:", err);
      res.status(500).send("");
    }
  });

  // Chat webhook proxy — avoids CORS when calling n8n from the browser
  app.post("/api/chat", async (req, res) => {
    try {
      const CHAT_WEBHOOK = "https://ahmed144.app.n8n.cloud/webhook/1d6ee35d-0280-4d68-a839-eeb1b13e298e";
      const response = await fetch(CHAT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const raw = await response.text();
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch { parsed = { output: raw }; }
      const reply =
        parsed?.output ||
        parsed?.message ||
        parsed?.text ||
        parsed?.reply ||
        (typeof parsed === "string" ? parsed : null) ||
        (Array.isArray(parsed) && (parsed[0]?.output || parsed[0]?.message || parsed[0]?.text)) ||
        "";
      res.json({ reply });
    } catch (err) {
      console.error("Chat proxy error:", err);
      res.status(500).json({ reply: "" });
    }
  });

  await setupAuth(app);
  registerAuthRoutes(app);
  registerCVRoutes(app);
  registerAIRoutes(app);
  registerPaymentRoutes(app);
  registerAdminRoutes(app);
  registerTemplateRoutes(app);

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = parseInt(process.env.PORT || "3001");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

main().catch(console.error);
