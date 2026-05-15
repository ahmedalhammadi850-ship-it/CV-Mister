interface RateLimitEntry {
  timestamps: number[];
  blockedUntil: number | null;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;
const BLOCK_DURATION_MS = 60 * 1000;

const LIMITS: Record<string, number> = {
  "/api/ai": 20,
  "/api/auth": 15,
  "/api/chat": 30,
  "default": 120,
};

function getClientIp(req: any): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (forwarded as string).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || "unknown";
}

function getLimit(path: string): number {
  for (const prefix of Object.keys(LIMITS)) {
    if (prefix !== "default" && path.startsWith(prefix)) {
      return LIMITS[prefix];
    }
  }
  return LIMITS["default"];
}

function cleanOldTimestamps(entry: RateLimitEntry, now: number) {
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
}

export function apiRateLimiter(req: any, res: any, next: any) {
  const ip = getClientIp(req);
  const key = `${ip}:${req.path}`;
  const now = Date.now();
  const maxRequests = getLimit(req.path);

  if (!store.has(key)) {
    store.set(key, { timestamps: [], blockedUntil: null });
  }

  const entry = store.get(key)!;

  if (entry.blockedUntil && now < entry.blockedUntil) {
    const remainingMs = entry.blockedUntil - now;
    res.setHeader("Retry-After", Math.ceil(remainingMs / 1000));
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      remainingMs,
    });
  }

  if (entry.blockedUntil && now >= entry.blockedUntil) {
    entry.blockedUntil = null;
    entry.timestamps = [];
  }

  cleanOldTimestamps(entry, now);
  entry.timestamps.push(now);

  res.setHeader("X-RateLimit-Limit", maxRequests);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - entry.timestamps.length));

  if (entry.timestamps.length > maxRequests) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    res.setHeader("Retry-After", Math.ceil(BLOCK_DURATION_MS / 1000));
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      remainingMs: BLOCK_DURATION_MS,
    });
  }

  next();
}

export function pageRateLimiter(req: any, res: any, next: any) {
  const ip = getClientIp(req);
  const now = Date.now();
  const MAX_REQUESTS = 10;

  if (!store.has(ip)) {
    store.set(ip, { timestamps: [], blockedUntil: null });
  }

  const entry = store.get(ip)!;

  if (entry.blockedUntil && now < entry.blockedUntil) {
    const remainingMs = entry.blockedUntil - now;
    return res.status(429).json({ blocked: true, remainingMs, message: "Too many page loads. Please wait." });
  }

  if (entry.blockedUntil && now >= entry.blockedUntil) {
    entry.blockedUntil = null;
    entry.timestamps = [];
  }

  cleanOldTimestamps(entry, now);
  entry.timestamps.push(now);

  if (entry.timestamps.length > MAX_REQUESTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return res.status(429).json({ blocked: true, remainingMs: BLOCK_DURATION_MS, message: "Too many page loads. Please wait." });
  }

  res.json({ blocked: false, count: entry.timestamps.length, remaining: MAX_REQUESTS - entry.timestamps.length });
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (
      (!entry.blockedUntil || now >= entry.blockedUntil) &&
      entry.timestamps.every((t) => now - t >= WINDOW_MS)
    ) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);
