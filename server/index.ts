import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerCVRoutes } from "./routes/cvRoutes";
import { registerAIRoutes } from "./routes/aiRoutes";
import { registerPaymentRoutes } from "./routes/paymentRoutes";
import { registerAdminRoutes } from "./routes/adminRoutes";
import { registerTemplateRoutes } from "./routes/templateRoutes";
import { pageRateLimiter, apiRateLimiter } from "./middleware/rateLimiter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_ORIGINS = [
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "",
  ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",").map((d) => `https://${d.trim()}`) : []),
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:5002",
].filter(Boolean);

async function main() {
  const app = express();

  // Security: Helmet — sets secure HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: ["'self'", "https:"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // Security: CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false }));

  // Security: Rate limiting on all API routes
  app.use("/api", apiRateLimiter);

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
      const CHAT_WEBHOOK = process.env.N8N_WEBHOOK_URL || "https://ahmed144.app.n8n.cloud/webhook/1d6ee35d-0280-4d68-a839-eeb1b13e298e";
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

  app.get("/api/ping", pageRateLimiter);

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
