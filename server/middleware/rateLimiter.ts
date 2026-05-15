interface RateLimitEntry {
  timestamps: number[];
  blockedUntil: number | null;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const BLOCK_DURATION_MS = 60 * 1000;

function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (forwarded as string).split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

function cleanOldTimestamps(entry: RateLimitEntry, now: number) {
  entry.timestamps = entry.timestamps.filter(t => now - t < WINDOW_MS);
}

export function pageRateLimiter(req: any, res: any, next: any) {
  const ip = getClientIp(req);
  const now = Date.now();

  if (!store.has(ip)) {
    store.set(ip, { timestamps: [], blockedUntil: null });
  }

  const entry = store.get(ip)!;

  if (entry.blockedUntil && now < entry.blockedUntil) {
    const remainingMs = entry.blockedUntil - now;
    return res.status(429).json({
      blocked: true,
      remainingMs,
      message: 'Too many page loads. Please wait.',
    });
  }

  if (entry.blockedUntil && now >= entry.blockedUntil) {
    entry.blockedUntil = null;
    entry.timestamps = [];
  }

  cleanOldTimestamps(entry, now);
  entry.timestamps.push(now);

  if (entry.timestamps.length > MAX_REQUESTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return res.status(429).json({
      blocked: true,
      remainingMs: BLOCK_DURATION_MS,
      message: 'Too many page loads. Please wait.',
    });
  }

  res.json({
    blocked: false,
    count: entry.timestamps.length,
    remaining: MAX_REQUESTS - entry.timestamps.length,
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (
      (!entry.blockedUntil || now >= entry.blockedUntil) &&
      entry.timestamps.every(t => now - t >= WINDOW_MS)
    ) {
      store.delete(ip);
    }
  }
}, 5 * 60 * 1000);
