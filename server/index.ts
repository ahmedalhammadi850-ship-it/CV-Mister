import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_ORIGINS = [
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "",
  ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",").map((d) => `https://${d.trim()}`) : []),
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:3001",
].filter(Boolean);

function makeReq(req: any, params: Record<string, string> = {}) {
  return { ...req, query: req.query, body: req.body, headers: req.headers, method: req.method, params };
}

function makeRes(res: any) {
  const r: any = {
    statusCode: 200,
    _headers: {} as Record<string, string>,
    status(code: number) { r.statusCode = code; res.status(code); return r; },
    json(data: any) { res.status(r.statusCode).json(data); },
    end() { res.status(r.statusCode).end(); },
    setHeader(k: string, v: string) { r._headers[k] = v; res.setHeader(k, v); return r; },
    send(data: any) { res.status(r.statusCode).send(data); },
  };
  return r;
}

async function loadHandler(relPath: string) {
  const mod = await import(`../api/${relPath}`);
  return mod.default as (req: any, res: any) => Promise<void>;
}

async function main() {
  const app = express();

  app.use(helmet({
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
  }));

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false }));

  function route(method: string, expressPath: string, handlerPath: string, paramMap?: (params: any) => Record<string, string>) {
    (app as any)[method](expressPath, async (req: any, res: any) => {
      try {
        const handler = await loadHandler(handlerPath);
        const params = paramMap ? paramMap(req.params) : {};
        await handler(makeReq(req, params), makeRes(res));
      } catch (err: any) {
        console.error(`[${handlerPath}]`, err.message);
        res.status(500).json({ message: err.message || "Internal server error" });
      }
    });
  }

  // ── Auth ──
  route("post", "/api/auth/firebase-sync",     "auth/firebase-sync");
  route("post", "/api/auth/firebase-register", "auth/firebase-register");
  route("post", "/api/auth/logout",            "auth/logout");
  route("get",  "/api/auth/user",              "auth/user");

  // ── CVs ──
  route("get",  "/api/cvs",             "cvs/index");
  route("post", "/api/cvs",             "cvs/index");
  route("get",  "/api/cvs/:id",         "cvs/[id]", p => ({ id: p.id }));
  route("patch","/api/cvs/:id",         "cvs/[id]", p => ({ id: p.id }));
  route("delete","/api/cvs/:id",        "cvs/[id]", p => ({ id: p.id }));
  route("post", "/api/cvs/:id/download","cvs/[id]/download", p => ({ id: p.id }));

  // ── Payment requests ──
  route("post", "/api/payment-requests",     "payment-requests/index");
  route("get",  "/api/payment-requests/my",  "payment-requests/my");

  // ── Business contact ──
  route("post", "/api/business-contact", "business-contact");

  // ── Templates ──
  route("get", "/api/templates/config", "templates/config");

  // ── AI ──
  route("post", "/api/ai/rewrite", "ai/rewrite");

  // ── Chat ──
  route("post", "/api/chat", "chat");

  // ── Payment webhook ──
  route("post", "/api/payment-webhook", "payment-webhook");

  // ── Ping ──
  route("get", "/api/ping", "ping");

  // ── Debug ──
  route("get", "/api/debug", "debug");

  // ── Admin Settings (n8n) ──
  route("get",   "/api/admin/settings", "admin/settings");
  route("patch", "/api/admin/settings", "admin/settings");

  // ── Pricing (public) ──
  route("get", "/api/pricing", "pricing");

  // ── Admin Pricing ──
  route("get",   "/api/admin/pricing", "admin/pricing");
  route("patch", "/api/admin/pricing", "admin/pricing");

  // ── Admin ──
  route("post",  "/api/admin/login",    "admin/login");
  route("get",   "/api/admin/me",       "admin/me");
  route("post",  "/api/admin/logout",   "admin/logout");
  route("patch", "/api/admin/password", "admin/password");
  route("get",   "/api/admin/stats",    "admin/stats");
  route("get",   "/api/admin/cvs",      "admin/cvs");
  route("get",   "/api/admin/users",                    "admin/users/index");
  route("delete","/api/admin/users/:id",                "admin/users/[id]", p => ({ id: p.id }));
  route("get",   "/api/admin/payment-requests",         "admin/payment-requests/index");
  route("patch", "/api/admin/payment-requests/:id",     "admin/payment-requests/[id]", p => ({ id: p.id }));
  route("get",   "/api/admin/business-contacts",        "admin/business-contacts/index");
  route("patch", "/api/admin/business-contacts/:id",    "admin/business-contacts/[id]", p => ({ id: p.id }));
  route("patch", "/api/admin/templates/:id",            "admin/templates/[id]", p => ({ id: p.id }));

  // ── Font proxies (inline — no firebase needed) ──
  app.get("/api/font-proxy", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url || !url.startsWith("https://fonts.googleapis.com/")) return res.status(400).send("Invalid");
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 Chrome/120" } });
      const css = await response.text();
      const rewritten = css.replace(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g, "url(/api/font-file?url=$1)");
      res.setHeader("Content-Type", "text/css");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(rewritten);
    } catch { res.status(500).send(""); }
  });

  app.get("/api/font-file", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url || !url.startsWith("https://fonts.gstatic.com/")) return res.status(400).send("Invalid");
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", response.headers.get("content-type") || "font/woff2");
      res.setHeader("Cache-Control", "public, max-age=604800");
      res.send(Buffer.from(buffer));
    } catch { res.status(500).send(""); }
  });

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  }

  const PORT = parseInt(process.env.PORT || "3001");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Backend: Firebase Firestore`);
  });
}

main().catch(console.error);
