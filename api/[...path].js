import express from "express";

// ── Static imports — esbuild bundles these inline, no runtime file lookup ──
import pingHandler           from "./ping.js";
import navbarHandler         from "./navbar.js";
import pricingHandler        from "./pricing.js";
import debugHandler          from "./debug.js";
import fontProxyHandler      from "./font-proxy.js";
import fontFileHandler       from "./font-file.js";
import businessContactHandler from "./business-contact.js";
import chatHandler           from "./chat.js";
import paymentWebhookHandler from "./payment-webhook.js";

import cvsIndexHandler from "./cvs/index.js";
import cvsIdHandler    from "./cvs/[id].js";

import authLogoutHandler           from "./auth/logout.js";
import authFirebaseSyncHandler     from "./auth/firebase-sync.js";
import authFirebaseRegisterHandler from "./auth/firebase-register.js";
import authUserHandler             from "./auth/user.js";

import templatesConfigHandler from "./templates/config.js";

import paymentRequestsIndexHandler from "./payment-requests/index.js";
import paymentRequestsMyHandler    from "./payment-requests/my.js";

import aiRewriteHandler from "./ai/rewrite.js";

import adminSettingsHandler from "./admin/settings.js";
import adminPricingHandler  from "./admin/pricing.js";
import adminNavbarHandler   from "./admin/navbar.js";
import adminLoginHandler    from "./admin/login.js";
import adminMeHandler       from "./admin/me.js";
import adminLogoutHandler   from "./admin/logout.js";
import adminPasswordHandler from "./admin/password.js";
import adminStatsHandler    from "./admin/stats.js";
import adminCvsHandler      from "./admin/cvs.js";

import adminUsersIndexHandler        from "./admin/users/index.js";
import adminUsersIdHandler           from "./admin/users/[id].js";
import adminPayReqIndexHandler       from "./admin/payment-requests/index.js";
import adminPayReqIdHandler          from "./admin/payment-requests/[id].js";
import adminBizContactsIndexHandler  from "./admin/business-contacts/index.js";
import adminBizContactsIdHandler     from "./admin/business-contacts/[id].js";
import adminTemplatesIdHandler       from "./admin/templates/[id].js";

// ── Download handler inlined to avoid [id]-named directory import ──
import { getUserFromReq } from "./_lib/token.js";
import { getDb }          from "./_lib/firebase.js";
async function cvsDownloadHandler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const id = req.params?.id || req.query?.id;
    const db = getDb();
    const cvRef = db.collection("cvs").doc(id);
    const snap = await cvRef.get();
    if (!snap.exists || snap.data().userId !== payload.userId) {
      return res.status(404).json({ message: "CV not found" });
    }
    const newCount = (snap.data().downloadCount || 0) + 1;
    await cvRef.update({ downloadCount: newCount });
    return res.json({ downloadCount: newCount });
  } catch {
    return res.status(500).json({ message: "Failed to track download" });
  }
}

// ── Express app ──
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

/**
 * Wrap a plain handler fn into an Express middleware.
 * Merges Express route params into req.query so handlers that use
 * req.query.id (Vercel's native routing convention) work correctly.
 */
function wrap(handler, paramMap) {
  return async (req, res) => {
    try {
      const params = paramMap ? paramMap(req.params) : {};
      const fakeReq = {
        method:  req.method,
        body:    req.body,
        query:   { ...req.query, ...params },
        headers: req.headers,
        params,
      };
      const fakeRes = {
        _code: 200,
        status(c) { this._code = c; return this; },
        json(d)   { res.status(this._code).json(d); },
        end(d)    { d !== undefined ? res.status(this._code).end(d) : res.status(this._code).end(); },
        setHeader(k, v) { res.setHeader(k, v); return this; },
        send(d)   { res.status(this._code).send(d); },
      };
      await handler(fakeReq, fakeRes);
    } catch (err) {
      console.error("[api catch-all]", req.method, req.url, err.message);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };
}

const id = p => ({ id: p.id });

// ── Auth ──
app.post("/api/auth/firebase-sync",     wrap(authFirebaseSyncHandler));
app.post("/api/auth/firebase-register", wrap(authFirebaseRegisterHandler));
app.post("/api/auth/logout",            wrap(authLogoutHandler));
app.get( "/api/auth/user",              wrap(authUserHandler));

// ── CVs ──
app.get(   "/api/cvs",              wrap(cvsIndexHandler));
app.post(  "/api/cvs",              wrap(cvsIndexHandler));
app.get(   "/api/cvs/:id",          wrap(cvsIdHandler,       id));
app.patch( "/api/cvs/:id",          wrap(cvsIdHandler,       id));
app.delete("/api/cvs/:id",          wrap(cvsIdHandler,       id));
app.post(  "/api/cvs/:id/download", wrap(cvsDownloadHandler, id));

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

// ── Font proxies ──
app.get("/api/font-proxy", wrap(fontProxyHandler));
app.get("/api/font-file",  wrap(fontFileHandler));

// ── Admin settings ──
app.get(  "/api/admin/settings", wrap(adminSettingsHandler));
app.patch("/api/admin/settings", wrap(adminSettingsHandler));

// ── Admin pricing ──
app.get(  "/api/admin/pricing", wrap(adminPricingHandler));
app.patch("/api/admin/pricing", wrap(adminPricingHandler));

// ── Admin navbar ──
app.get(  "/api/admin/navbar", wrap(adminNavbarHandler));
app.patch("/api/admin/navbar", wrap(adminNavbarHandler));

// ── Admin auth ──
app.post( "/api/admin/login",    wrap(adminLoginHandler));
app.get(  "/api/admin/me",       wrap(adminMeHandler));
app.post( "/api/admin/logout",   wrap(adminLogoutHandler));
app.patch("/api/admin/password", wrap(adminPasswordHandler));

// ── Admin data ──
app.get(   "/api/admin/stats",                 wrap(adminStatsHandler));
app.get(   "/api/admin/cvs",                   wrap(adminCvsHandler));
app.get(   "/api/admin/users",                 wrap(adminUsersIndexHandler));
app.delete("/api/admin/users/:id",             wrap(adminUsersIdHandler,          id));
app.get(   "/api/admin/payment-requests",      wrap(adminPayReqIndexHandler));
app.patch( "/api/admin/payment-requests/:id",  wrap(adminPayReqIdHandler,         id));
app.get(   "/api/admin/business-contacts",     wrap(adminBizContactsIndexHandler));
app.patch( "/api/admin/business-contacts/:id", wrap(adminBizContactsIdHandler,    id));
app.patch( "/api/admin/templates/:id",         wrap(adminTemplatesIdHandler,      id));

export default app;
