/**
 * Rate limiter for chat API requests
 * Limits requests per IP address to prevent abuse
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 15; // 15 requests per minute

// In-memory store for rate limiting
// In production, consider using Redis for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanupTimer(): void {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
      if (now - entry.firstRequest > WINDOW_MS) {
        rateLimitStore.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Extract client IP from request headers
 * Supports Vercel, Cloudflare, and standard forwarded headers
 */
export function getClientIp(request: Request): string {
  // Vercel/Cloudflare headers
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Standard forwarded header
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Fallback
  return "unknown";
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(ip: string): RateLimitResult {
  startCleanupTimer();

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // First request from this IP
    rateLimitStore.set(ip, {
      count: 1,
      firstRequest: now,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  const windowExpired = now - entry.firstRequest > WINDOW_MS;

  if (windowExpired) {
    // Reset window
    rateLimitStore.set(ip, {
      count: 1,
      firstRequest: now,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  // Within window
  const newCount = entry.count + 1;
  const resetIn = WINDOW_MS - (now - entry.firstRequest);

  if (newCount > MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }

  // Update count
  rateLimitStore.set(ip, {
    ...entry,
    count: newCount,
  });

  return {
    allowed: true,
    remaining: MAX_REQUESTS - newCount,
    resetIn,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(MAX_REQUESTS),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetIn / 1000)),
  };
}
