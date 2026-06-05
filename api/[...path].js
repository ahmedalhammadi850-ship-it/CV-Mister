import express from "express";

// ── Static imports — bundled by esbuild at build time ──
import pingHandler            from "./ping.js";
import navbarHandler          from "./navbar.js";
import pricingHandler         from "./pricing.js";
import fontProxyHandler       from "./font-proxy.js";
import fontFileHandler        from "./font-file.js";
import debugHandler           from "./debug.js";
import chatHandler            from "./chat.js";
import paymentWebhookHandler  from "./payment-webhook.js";
import businessContactHandler from "./business-contact.js";

import firebaseSyncHandler     from "./auth/firebase-sync.js";
import firebaseRegisterHandler from "./auth/firebase-register.js";
import authLogoutHandler       from "./auth/logout.js";
import authUserHandler         from "./auth/user.js";

import cvsIndexHandler    from "./cvs/index.js";
import cvsIdHandler       from "./cvs/[id].js";
import cvsDownloadHandler from "./cvs/[id]/download.js";

import paymentRequestsIndexHandler from "./payment-requests/index.js";
import paymentRequestsMyHandler    from "./payment-requests/my.js";

import templatesConfigHandler from "./templates/config.js";
import aiRewriteHandler       from "./ai/rewrite.js";

import adminLoginHandler    from "./admin/login.js";
import adminMeHandler       from "./admin/me.js";
import adminLogoutHandler   from "./admin/logout.js";
import adminPasswordHandler from "./admin/password.js";
import adminSettingsHandler from "./admin/settings.js";
import adminPricingHandler  from "./admin/pricing.js";
import adminNavbarHandler   from "./admin/navbar.js";
import adminStatsHandler    from "./admin/stats.js";
import adminCvsHandler      from "./admin/cvs.js";

import adminUsersIndexHandler from "./admin/users/index.js";
import adminUsersIdHandler    from "./admin/users/[id].js";

import adminPaymentRequestsIndexHandler from "./admin/payment-requests/index.js";
import adminPaymentRequestsIdHandler    from "./admin/payment-requests/[id].js";

import adminBusinessContactsIndexHandler from "./admin/business-contacts/index.js";
import adminBusinessContactsIdHandler    from "./admin/business-contacts/[id].js";

import adminTemplatesIdHandler from "./admin/templates/[id].js";

// ── App ──
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

function wrap(handler, paramMap) {
  return async (req, res) => {
    try {
      const params = paramMap ? paramMap(req.params) : {};
      const fakeReq = {
        method:  req.method,
        body:    req.body,
        query:   req.query,
        headers: req.headers,
        params,
      };
      const fakeRes = {
        _code: 200,
        status(c) { this._code = c; res.status(c); return this; },
        json(d)   { res.status(this._code).json(d); },
        end(d)    { d !== undefined ? res.status(this._code).end(d) : res.status(this._code).end(); },
        send(d)   { res.status(this._code).send(d); },
        setHeader(k, v) { res.setHeader(k, v); return this; },
      };
      await handler(fakeReq, fakeRes);
    } catch (err) {
      console.error("[api error]", req.method, req.url, err.message, err.stack);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };
}

// ── Auth ──
app.post("/api/auth/firebase-sync",     wrap(firebaseSyncHandler));
app.post("/api/auth/firebase-register", wrap(firebaseRegisterHandler));
app.post("/api/auth/logout",            wrap(authLogoutHandler));
app.get( "/api/auth/user",              wrap(authUserHandler));

// ── CVs ──
app.get(   "/api/cvs",               wrap(cvsIndexHandler));
app.post(  "/api/cvs",               wrap(cvsIndexHandler));
app.get(   "/api/cvs/:id",           wrap(cvsIdHandler,       p => ({ id: p.id })));
app.patch( "/api/cvs/:id",           wrap(cvsIdHandler,       p => ({ id: p.id })));
app.delete("/api/cvs/:id",           wrap(cvsIdHandler,       p => ({ id: p.id })));
app.post(  "/api/cvs/:id/download",  wrap(cvsDownloadHandler, p => ({ id: p.id })));

// ── Payment requests ──
app.post("/api/payment-requests",    wrap(paymentRequestsIndexHandler));
app.get( "/api/payment-requests/my", wrap(paymentRequestsMyHandler));

// ── Business contact ──
app.post("/api/business-contact", wrap(businessContactHandler));

// ── Templates ──
app.get("/api/templates/config", wrap(templatesConfigHandler));

// ── AI ──
app.post("/api/ai/rewrite", wrap(aiRewriteHandler));

// ── Chat ──
app.post("/api/chat", wrap(chatHandler));

// ── Payment webhook ──
app.post("/api/payment-webhook", wrap(paymentWebhookHandler));

// ── Ping / Debug ──
app.get("/api/ping",  wrap(pingHandler));
app.get("/api/debug", wrap(debugHandler));

// ── Pricing ──
app.get("/api/pricing", wrap(pricingHandler));

// ── Navbar ──
app.get("/api/navbar", wrap(navbarHandler));

// ── Admin Settings ──
app.get(  "/api/admin/settings", wrap(adminSettingsHandler));
app.patch("/api/admin/settings", wrap(adminSettingsHandler));

// ── Admin Pricing ──
app.get(  "/api/admin/pricing", wrap(adminPricingHandler));
app.patch("/api/admin/pricing", wrap(adminPricingHandler));

// ── Admin Navbar ──
app.get(  "/api/admin/navbar", wrap(adminNavbarHandler));
app.patch("/api/admin/navbar", wrap(adminNavbarHandler));

// ── Admin Auth ──
app.post( "/api/admin/login",    wrap(adminLoginHandler));
app.get(  "/api/admin/me",       wrap(adminMeHandler));
app.post( "/api/admin/logout",   wrap(adminLogoutHandler));
app.patch("/api/admin/password", wrap(adminPasswordHandler));

// ── Admin Data ──
app.get(   "/api/admin/stats",                 wrap(adminStatsHandler));
app.get(   "/api/admin/cvs",                   wrap(adminCvsHandler));
app.get(   "/api/admin/users",                 wrap(adminUsersIndexHandler));
app.delete("/api/admin/users/:id",             wrap(adminUsersIdHandler,                  p => ({ id: p.id })));
app.get(   "/api/admin/payment-requests",      wrap(adminPaymentRequestsIndexHandler));
app.patch( "/api/admin/payment-requests/:id",  wrap(adminPaymentRequestsIdHandler,        p => ({ id: p.id })));
app.get(   "/api/admin/business-contacts",     wrap(adminBusinessContactsIndexHandler));
app.patch( "/api/admin/business-contacts/:id", wrap(adminBusinessContactsIdHandler,       p => ({ id: p.id })));
app.patch( "/api/admin/templates/:id",         wrap(adminTemplatesIdHandler,              p => ({ id: p.id })));

// ── Font proxies ──
app.get("/api/font-proxy", wrap(fontProxyHandler));
app.get("/api/font-file",  wrap(fontFileHandler));

export default app;
