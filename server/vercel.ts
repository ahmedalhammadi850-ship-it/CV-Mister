import express from "express";
import helmet from "helmet";
import cors from "cors";

// ── Static imports for all handlers ──
import authFirebaseSync     from "../api/auth/firebase-sync.js";
import authFirebaseRegister from "../api/auth/firebase-register.js";
import authLogout           from "../api/auth/logout.js";
import authUser             from "../api/auth/user.js";

import cvsIndex             from "../api/cvs/index.js";
import cvsById              from "../api/cvs/[id].js";
import cvsDownload          from "../api/cvs/[id]/download.js";

import paymentRequestsIndex from "../api/payment-requests/index.js";
import paymentRequestsMy    from "../api/payment-requests/my.js";

import businessContact      from "../api/business-contact.js";
import templatesConfig      from "../api/templates/config.js";
import aiRewrite            from "../api/ai/rewrite.js";
import chat                 from "../api/chat.js";
import paymentWebhook       from "../api/payment-webhook.js";
import ping                 from "../api/ping.js";
import debug                from "../api/debug.js";

import adminLogin           from "../api/admin/login.js";
import adminMe              from "../api/admin/me.js";
import adminLogout          from "../api/admin/logout.js";
import adminPassword        from "../api/admin/password.js";
import adminStats           from "../api/admin/stats.js";
import adminCvs             from "../api/admin/cvs.js";
import adminUsersIndex      from "../api/admin/users/index.js";
import adminUsersById       from "../api/admin/users/[id].js";
import adminPayReqIndex     from "../api/admin/payment-requests/index.js";
import adminPayReqById      from "../api/admin/payment-requests/[id].js";
import adminBizIndex        from "../api/admin/business-contacts/index.js";
import adminBizById         from "../api/admin/business-contacts/[id].js";
import adminTemplatesById   from "../api/admin/templates/[id].js";
import adminSettings        from "../api/admin/settings.js";
import adminPricing         from "../api/admin/pricing.js";
import adminNavbar          from "../api/admin/navbar.js";
import navbar               from "../api/navbar.js";
import pricing              from "../api/pricing.js";

function makeReq(req: any, params: Record<string, string> = {}) {
  return { ...req, query: { ...req.query, ...params }, body: req.body, headers: req.headers, method: req.method, params };
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

function wrap(handler: any, paramMap?: (params: any) => Record<string, string>) {
  return async (req: any, res: any) => {
    try {
      const params = paramMap ? paramMap(req.params) : {};
      await handler(makeReq(req, params), makeRes(res));
    } catch (err: any) {
      console.error("[handler error]", err.message);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };
}

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
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// ── Auth ──
app.post("/api/auth/firebase-sync",     wrap(authFirebaseSync));
app.post("/api/auth/firebase-register", wrap(authFirebaseRegister));
app.post("/api/auth/logout",            wrap(authLogout));
app.get( "/api/auth/user",              wrap(authUser));

// ── CVs ──
app.get(   "/api/cvs",              wrap(cvsIndex));
app.post(  "/api/cvs",              wrap(cvsIndex));
app.get(   "/api/cvs/:id",          wrap(cvsById,      p => ({ id: p.id })));
app.patch( "/api/cvs/:id",          wrap(cvsById,      p => ({ id: p.id })));
app.delete("/api/cvs/:id",          wrap(cvsById,      p => ({ id: p.id })));
app.post(  "/api/cvs/:id/download", wrap(cvsDownload,  p => ({ id: p.id })));

// ── Payment requests ──
app.post("/api/payment-requests",     wrap(paymentRequestsIndex));
app.get( "/api/payment-requests/my",  wrap(paymentRequestsMy));

// ── Business contact ──
app.post("/api/business-contact", wrap(businessContact));

// ── Pricing (public) ──
app.get("/api/pricing", wrap(pricing));

// ── Navbar (public) ──
app.get("/api/navbar", wrap(navbar));

// ── Templates ──
app.get("/api/templates/config", wrap(templatesConfig));

// ── AI ──
app.post("/api/ai/rewrite", wrap(aiRewrite));

// ── Chat ──
app.post("/api/chat", wrap(chat));

// ── Payment webhook ──
app.post("/api/payment-webhook", wrap(paymentWebhook));

// ── Ping ──
app.get("/api/ping", wrap(ping));

// ── Debug ──
app.get("/api/debug", wrap(debug));

// ── Admin ──
app.post(  "/api/admin/login",                  wrap(adminLogin));
app.get(   "/api/admin/me",                     wrap(adminMe));
app.post(  "/api/admin/logout",                 wrap(adminLogout));
app.patch( "/api/admin/password",               wrap(adminPassword));
app.get(   "/api/admin/stats",                  wrap(adminStats));
app.get(   "/api/admin/cvs",                    wrap(adminCvs));
app.get(   "/api/admin/users",                  wrap(adminUsersIndex));
app.delete("/api/admin/users/:id",              wrap(adminUsersById,     p => ({ id: p.id })));
app.get(   "/api/admin/payment-requests",       wrap(adminPayReqIndex));
app.patch( "/api/admin/payment-requests/:id",   wrap(adminPayReqById,    p => ({ id: p.id })));
app.get(   "/api/admin/business-contacts",      wrap(adminBizIndex));
app.patch( "/api/admin/business-contacts/:id",  wrap(adminBizById,       p => ({ id: p.id })));
app.patch( "/api/admin/templates/:id",          wrap(adminTemplatesById, p => ({ id: p.id })));
app.get(   "/api/admin/settings",               wrap(adminSettings));
app.patch( "/api/admin/settings",               wrap(adminSettings));
app.get(   "/api/admin/pricing",                wrap(adminPricing));
app.patch( "/api/admin/pricing",                wrap(adminPricing));
app.get(   "/api/admin/navbar",                 wrap(adminNavbar));
app.patch( "/api/admin/navbar",                 wrap(adminNavbar));

// ── Font proxies ──
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

export default app;
