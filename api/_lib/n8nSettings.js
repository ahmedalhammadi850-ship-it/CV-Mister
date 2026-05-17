import { getDb } from "./firebase.js";

let cache = null;
let cacheTime = 0;
const TTL = 30000;

export async function getN8nSettings() {
  const now = Date.now();
  if (cache && now - cacheTime < TTL) return cache;
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/n8n").get();
    const stored = snap.exists ? snap.data() : {};
    cache = {
      N8N_AI_WEBHOOK_URL: stored.N8N_AI_WEBHOOK_URL || process.env.N8N_AI_WEBHOOK_URL || "",
      N8N_CHAT_WEBHOOK_URL: stored.N8N_CHAT_WEBHOOK_URL || process.env.N8N_CHAT_WEBHOOK_URL || "",
      N8N_PAYMENT_WEBHOOK_URL: stored.N8N_PAYMENT_WEBHOOK_URL || process.env.N8N_PAYMENT_WEBHOOK_URL || "",
    };
    cacheTime = now;
    return cache;
  } catch {
    return {
      N8N_AI_WEBHOOK_URL: process.env.N8N_AI_WEBHOOK_URL || "",
      N8N_CHAT_WEBHOOK_URL: process.env.N8N_CHAT_WEBHOOK_URL || "",
      N8N_PAYMENT_WEBHOOK_URL: process.env.N8N_PAYMENT_WEBHOOK_URL || "",
    };
  }
}

export function invalidateCache() {
  cache = null;
  cacheTime = 0;
}
