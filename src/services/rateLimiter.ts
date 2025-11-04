/**
 * Rate Limiting Service
 * Client-side rate limiting to prevent abuse and improve UX
 */

import { securityMonitor, SecurityEventType, SecuritySeverity } from './securityMonitor';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

class RateLimiterService {
  private limits: Map<string, RateLimitEntry> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  /**
   * Configure rate limit for a specific action
   */
  configure(action: string, config: RateLimitConfig): void {
    this.configs.set(action, config);
  }

  /**
   * Check if action is allowed
   */
  isAllowed(action: string, identifier: string = 'default'): boolean {
    const config = this.configs.get(action);
    if (!config) {
      // No limit configured, allow by default
      return true;
    }

    const key = `${action}:${identifier}`;
    const now = Date.now();
    const entry = this.limits.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockedUntil) {
      if (now < entry.blockedUntil) {
        return false;
      }
      // Block period expired, reset
      this.limits.delete(key);
      return this.isAllowed(action, identifier);
    }

    // No entry or expired window
    if (!entry || now - entry.firstRequest > config.windowMs) {
      this.limits.set(key, {
        count: 1,
        firstRequest: now,
        blocked: false,
      });
      return true;
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      entry.blocked = true;
      if (config.blockDurationMs) {
        entry.blockedUntil = now + config.blockDurationMs;
      }

      // Log security event
      securityMonitor.logRateLimitExceeded({
        action,
        limit: config.maxRequests,
      });

      return false;
    }

    return true;
  }

  /**
   * Attempt an action with rate limiting
   */
  async attempt<T>(
    action: string,
    fn: () => T | Promise<T>,
    identifier: string = 'default'
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    if (!this.isAllowed(action, identifier)) {
      const config = this.configs.get(action);
      const waitTime = config ? Math.ceil(config.windowMs / 1000) : 60;

      return {
        success: false,
        error: `Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`,
      };
    }

    try {
      const result = await Promise.resolve(fn());
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get remaining requests for an action
   */
  getRemaining(action: string, identifier: string = 'default'): number {
    const config = this.configs.get(action);
    if (!config) {
      return Infinity;
    }

    const key = `${action}:${identifier}`;
    const entry = this.limits.get(key);

    if (!entry) {
      return config.maxRequests;
    }

    const now = Date.now();
    if (now - entry.firstRequest > config.windowMs) {
      return config.maxRequests;
    }

    return Math.max(0, config.maxRequests - entry.count);
  }

  /**
   * Get time until rate limit resets
   */
  getResetTime(action: string, identifier: string = 'default'): number {
    const config = this.configs.get(action);
    if (!config) {
      return 0;
    }

    const key = `${action}:${identifier}`;
    const entry = this.limits.get(key);

    if (!entry) {
      return 0;
    }

    const resetTime = entry.firstRequest + config.windowMs;
    return Math.max(0, resetTime - Date.now());
  }

  /**
   * Reset limits for a specific action
   */
  reset(action: string, identifier?: string): void {
    if (identifier) {
      const key = `${action}:${identifier}`;
      this.limits.delete(key);
    } else {
      // Reset all entries for this action
      const prefix = `${action}:`;
      for (const key of this.limits.keys()) {
        if (key.startsWith(prefix)) {
          this.limits.delete(key);
        }
      }
    }
  }

  /**
   * Clear all rate limit data
   */
  clearAll(): void {
    this.limits.clear();
  }

  /**
   * Get statistics for monitoring
   */
  getStatistics(): {
    totalActions: number;
    blockedActions: number;
    activeActions: string[];
  } {
    const stats = {
      totalActions: this.limits.size,
      blockedActions: 0,
      activeActions: [] as string[],
    };

    for (const [key, entry] of this.limits.entries()) {
      if (entry.blocked) {
        stats.blockedActions++;
      }
      stats.activeActions.push(key);
    }

    return stats;
  }
}

// Singleton instance
export const rateLimiter = new RateLimiterService();

// Configure default rate limits
rateLimiter.configure('message', {
  maxRequests: 10,
  windowMs: 60000, // 10 messages per minute
  blockDurationMs: 30000, // Block for 30 seconds if exceeded
});

rateLimiter.configure('fileUpload', {
  maxRequests: 5,
  windowMs: 60000, // 5 uploads per minute
  blockDurationMs: 60000, // Block for 1 minute if exceeded
});

rateLimiter.configure('codeGeneration', {
  maxRequests: 20,
  windowMs: 60000, // 20 generations per minute
  blockDurationMs: 30000,
});

rateLimiter.configure('apiCall', {
  maxRequests: 30,
  windowMs: 60000, // 30 API calls per minute
  blockDurationMs: 60000,
});

// Export for testing
export { RateLimiterService };
