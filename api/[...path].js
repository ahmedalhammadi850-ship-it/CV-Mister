import express from "express";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

function wrap(importFn, paramMap) {
  return async (req, res) => {
    try {
      const mod = await importFn();
      const handler = mod.default;
      const params = paramMap ? paramMap(req.params) : {};
      const fakeReq = { ...req, params, body: req.body, query: req.query, headers: req.headers, method: req.method };
      const fakeRes = {
        _code: 200,
        status(c) { this._code = c; res.status(c); return this; },
        json(d) { res.status(this._code).json(d); },
        end(d) { d !== undefined ? res.status(this._code).end(d) : res.status(this._code).end(); },
        setHeader(k, v) { res.setHeader(k, v); return this; },
        send(d) { res.status(this._code).send(d); },
      };
      await handler(fakeReq, fakeRes);
    } catch (err) {
      console.error("[api]", err.message);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };
}

// ── Auth ──
app.post("/api/auth/firebase-sync",     wrap(() => import("./auth/firebase-sync.js")));
app.post("/api/auth/firebase-register", wrap(() => import("./auth/firebase-register.js")));
app.post("/api/auth/logout",            wrap(() => import("./auth/logout.js")));
app.get( "/api/auth/user",              wrap(() => import("./auth/user.js")));

// ── CVs ──
app.get(   "/api/cvs",            wrap(() => import("./cvs/index.js")));
app.post(  "/api/cvs",            wrap(() => import("./cvs/index.js")));
app.get(   "/api/cvs/:id",        wrap(() => import("./cvs/[id].js"),          p => ({ id: p.id })));
app.patch( "/api/cvs/:id",        wrap(() => import("./cvs/[id].js"),          p => ({ id: p.id })));
app.delete("/api/cvs/:id",        wrap(() => import("./cvs/[id].js"),          p => ({ id: p.id })));
app.post(  "/api/cvs/:id/download", wrap(() => import("./cvs/[id]/download.js"), p => ({ id: p.id })));

// ── Payment requests ──
app.post("/api/payment-requests",     wrap(() => import("./payment-requests/index.js")));
app.get( "/api/payment-requests/my",  wrap(() => import("./payment-requests/my.js")));

// ── Business contact ──
app.post("/api/business-contact", wrap(() => import("./business-contact.js")));

// ── Templates ──
app.get("/api/templates/config", wrap(() => import("./templates/config.js")));

// ── AI ──
app.post("/api/ai/rewrite", wrap(() => import("./ai/rewrite.js")));

// ── Chat ──
app.post("/api/chat", wrap(() => import("./chat.js")));

// ── Payment webhook ──
app.post("/api/payment-webhook", wrap(() => import("./payment-webhook.js")));

// ── Ping / Debug ──
app.get("/api/ping",  wrap(() => import("./ping.js")));
app.get("/api/debug", wrap(() => import("./debug.js")));

// ── Pricing (public) ──
app.get("/api/pricing", wrap(() => import("./pricing.js")));

// ── Navbar (public) ──
app.get("/api/navbar", wrap(() => import("./navbar.js")));

// ── Admin Settings ──
app.get(  "/api/admin/settings", wrap(() => import("./admin/settings.js")));
app.patch("/api/admin/settings", wrap(() => import("./admin/settings.js")));

// ── Admin Pricing ──
app.get(  "/api/admin/pricing", wrap(() => import("./admin/pricing.js")));
app.patch("/api/admin/pricing", wrap(() => import("./admin/pricing.js")));

// ── Admin Navbar ──
app.get(  "/api/admin/navbar", wrap(() => import("./admin/navbar.js")));
app.patch("/api/admin/navbar", wrap(() => import("./admin/navbar.js")));

// ── Admin Auth ──
app.post( "/api/admin/login",    wrap(() => import("./admin/login.js")));
app.get(  "/api/admin/me",       wrap(() => import("./admin/me.js")));
app.post( "/api/admin/logout",   wrap(() => import("./admin/logout.js")));
app.patch("/api/admin/password", wrap(() => import("./admin/password.js")));

// ── Admin Data ──
app.get(   "/api/admin/stats",                      wrap(() => import("./admin/stats.js")));
app.get(   "/api/admin/cvs",                        wrap(() => import("./admin/cvs.js")));
app.get(   "/api/admin/users",                      wrap(() => import("./admin/users/index.js")));
app.delete("/api/admin/users/:id",                  wrap(() => import("./admin/users/[id].js"),                   p => ({ id: p.id })));
app.get(   "/api/admin/payment-requests",           wrap(() => import("./admin/payment-requests/index.js")));
app.patch( "/api/admin/payment-requests/:id",       wrap(() => import("./admin/payment-requests/[id].js"),        p => ({ id: p.id })));
app.get(   "/api/admin/business-contacts",          wrap(() => import("./admin/business-contacts/index.js")));
app.patch( "/api/admin/business-contacts/:id",      wrap(() => import("./admin/business-contacts/[id].js"),       p => ({ id: p.id })));
app.patch( "/api/admin/templates/:id",              wrap(() => import("./admin/templates/[id].js"),               p => ({ id: p.id })));

// ── Font proxies ──
app.get("/api/font-proxy", wrap(() => import("./font-proxy.js")));
app.get("/api/font-file",  wrap(() => import("./font-file.js")));

export default app;
