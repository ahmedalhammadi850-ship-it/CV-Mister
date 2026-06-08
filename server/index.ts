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

// In Replit's proxied environment, the Vite dev server forwards API requests
// from the same origin — allow null/undefined origin (same-origin proxy calls)
function isCorsAllowed(origin: string | undefined): boolean {
  if (!origin) return true; // same-origin or server-to-server
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow any *.replit.dev / *.repl.co / *.replit.app domain (with optional port)
  if (/^https:\/\/.+\.replit\.dev(:\d+)?$/.test(origin)) return true;
  if (/^https:\/\/.+\.repl\.co(:\d+)?$/.test(origin)) return true;
  if (/^https:\/\/.+\.replit\.app(:\d+)?$/.test(origin)) return true;
  console.log("[CORS blocked origin]", origin);
  return false;
}

function makeReq(req: any, params: Record<string, string> = {}) {
  return { ...req, query: req.query, body: req.body, headers: req.headers, method: req.method, params };
}

function makeRes(res: any) {
  const r: any = {
    statusCode: 200,
    _headers: {} as Record<string, string>,
    status(code: number) { r.statusCode = code; res.status(code); return r; },
    json(data: any) { res.status(r.statusCode).json(data); },
    end(data?: any) { data !== undefined ? res.status(r.statusCode).end(data) : res.status(r.statusCode).end(); },
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
        frameSrc: ["https://*.replit.dev", "https://*.repl.co", "https://*.replit.app"],
        frameAncestors: ["'self'", "https://*.replit.dev", "https://*.repl.co", "https://*.replit.app", "https://*.replit.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  app.use(cors({
    origin: (origin, callback) => {
      if (isCorsAllowed(origin)) callback(null, true);
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
        console.error("[handler error]", String(err.message || "Internal server error").slice(0, 200));
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

  // ── Puppeteer PDF (ATS templates) ──
  route("post", "/api/pdf/ats", "pdf/ats");

  // ── Pagination verification (dev only) ──
  route("get", "/api/verify-pagination", "verify-pagination");

  // ── Admin Settings (n8n) ──
  route("get",   "/api/admin/settings", "admin/settings");
  route("patch", "/api/admin/settings", "admin/settings");

  // ── Pricing (public) ──
  route("get", "/api/pricing", "pricing");

  // ── Admin Pricing ──
  route("get",   "/api/admin/pricing", "admin/pricing");
  route("patch", "/api/admin/pricing", "admin/pricing");

  // ── Navbar (public) ──
  route("get", "/api/navbar", "navbar");

  // ── Admin Navbar ──
  route("get",   "/api/admin/navbar", "admin/navbar");
  route("patch", "/api/admin/navbar", "admin/navbar");

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
      if (!url || !url.startsWith("https://fonts.googleapis.com/")) return res.status(400).end();
      // Use a full modern Chrome UA so Google Fonts CDN returns WOFF2 (not TTF).
      // A truncated UA like "Mozilla/5.0 Chrome/120" is unrecognised and causes
      // Google Fonts to fall back to TTF, which then mismatches the font/woff2
      // Content-Type we serve — making Chromium/Puppeteer reject all fonts.
      const CHROME_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const response = await fetch(url, { headers: { "User-Agent": CHROME_UA } });
      const css = await response.text();
      const rewritten = css.replace(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g, "url(/api/font-file?url=$1)");
      res.setHeader("Content-Type", "text/css; charset=utf-8");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(rewritten);
    } catch { res.status(500).end(); }
  });

  app.get("/api/font-file", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url || !url.startsWith("https://fonts.gstatic.com/")) return res.status(400).end();
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      // Detect font format from URL extension and set the correct Content-Type.
      // Mismatched Content-Type (e.g. font/woff2 for a .ttf file) causes
      // Chromium/Puppeteer to silently reject the font, producing a PDF with
      // no custom fonts (text appears as boxes or falls back to system fonts).
      let contentType = "font/woff2";
      if (url.endsWith(".ttf"))   contentType = "font/ttf";
      else if (url.endsWith(".otf"))   contentType = "font/otf";
      else if (url.endsWith(".woff"))  contentType = "font/woff";
      else if (url.endsWith(".eot"))   contentType = "application/vnd.ms-fontobject";
      res.setHeader("Content-Type", contentType);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=604800");
      res.end(Buffer.from(buffer));
    } catch { res.status(500).end(); }
  });

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  } else {
    // In dev mode, proxy all non-API requests to Vite (port 5000).
    // This prevents MIME-type errors when Replit routes external traffic to
    // port 3001 instead of 5000 — Express returns HTML for unknown paths,
    // which the browser rejects as a JavaScript module.
    const VITE_PORT = 5000;
    app.use(async (req: any, res: any) => {
      try {
        const url = `http://localhost:${VITE_PORT}${req.url}`;
        const response = await fetch(url, {
          method: req.method,
          headers: { ...req.headers, host: `localhost:${VITE_PORT}` } as any,
          body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
          // @ts-ignore
          signal: AbortSignal.timeout(10000),
        });
        const contentType = response.headers.get("content-type") || "";
        res.status(response.status);
        response.headers.forEach((value: string, key: string) => {
          if (!["transfer-encoding", "connection"].includes(key)) res.setHeader(key, value);
        });
        const buffer = await response.arrayBuffer();
        res.end(Buffer.from(buffer));
      } catch {
        res.status(502).end();
      }
    });
  }

  const PORT = parseInt(process.env.PORT || "3001");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Backend: Firebase Firestore`);
  });
}

main().catch(console.error);
