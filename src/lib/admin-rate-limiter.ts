/**
 * Rate limiter for Admin AI API requests
 * Limits requests per user ID with higher limits than public chat
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const WINDOW_MS = 60 * 1000; // 1 minute window
const ADMIN_MAX_REQUESTS = 50; // 50 requests per minute (vs 15 for main site)

// In-memory store for rate limiting
// In production, consider using Redis for distributed systems
const adminRateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanupTimer(): void {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [userId, entry] of adminRateLimitStore.entries()) {
      if (now - entry.firstRequest > WINDOW_MS) {
        adminRateLimitStore.delete(userId);
      }
    }
  }, CLEANUP_INTERVAL);
}

export interface AdminRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

/**
 * Check if admin request is within rate limit
 * Uses userId instead of IP for admin rate limiting
 */
export function checkAdminRateLimit(userId: string): AdminRateLimitResult {
  startCleanupTimer();

  const now = Date.now();
  const entry = adminRateLimitStore.get(userId);

  if (!entry) {
    // First request from this user
    adminRateLimitStore.set(userId, {
      count: 1,
      firstRequest: now,
    });
    return {
      allowed: true,
      remaining: ADMIN_MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  const windowExpired = now - entry.firstRequest > WINDOW_MS;

  if (windowExpired) {
    // Reset window
    adminRateLimitStore.set(userId, {
      count: 1,
      firstRequest: now,
    });
    return {
      allowed: true,
      remaining: ADMIN_MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  // Within window
  const newCount = entry.count + 1;
  const resetIn = WINDOW_MS - (now - entry.firstRequest);

  if (newCount > ADMIN_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }

  // Update count
  adminRateLimitStore.set(userId, {
    ...entry,
    count: newCount,
  });

  return {
    allowed: true,
    remaining: ADMIN_MAX_REQUESTS - newCount,
    resetIn,
  };
}

/**
 * Get rate limit headers for response
 */
export function getAdminRateLimitHeaders(
  result: AdminRateLimitResult
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(ADMIN_MAX_REQUESTS),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetIn / 1000)),
  };
}
