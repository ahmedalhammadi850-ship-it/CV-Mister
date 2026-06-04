import crypto from "crypto";

const SECRET = () => process.env.SESSION_SECRET || "cv-mister-secret";

export function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET()).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try { return JSON.parse(Buffer.from(data, "base64url").toString()); }
  catch { return null; }
}

export function parseCookies(req) {
  const cookies = {};
  (req.headers.cookie || "").split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (k) cookies[k.trim()] = v.join("=").trim();
  });
  return cookies;
}

export function getUserFromReq(req) {
  const cookies = parseCookies(req);
  return verifyToken(cookies.cv_auth);
}

export function getAdminFromReq(req) {
  const cookies = parseCookies(req);
  return verifyToken(cookies.cv_admin);
}

export function setUserCookie(res, userId) {
  const token = signToken({ userId });
  res.setHeader("Set-Cookie", `cv_auth=${token}; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=604800`);
}

export function setAdminCookie(res, adminId, adminUsername) {
  const token = signToken({ adminId, adminUsername });
  res.setHeader("Set-Cookie", `cv_admin=${token}; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=86400`);
}

export function clearUserCookie(res) {
  res.setHeader("Set-Cookie", "cv_auth=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0");
}

export function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", "cv_admin=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0");
}
