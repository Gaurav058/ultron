/**
 * ULTRON Sovereign Cache & Circuit Breaker Provider
 * Handles in-memory caching, request deduplication, circuit breaking, and stale-on-error fallbacks.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

interface CircuitBreakerState {
  failureCount: number;
  isOpen: boolean;
  openedAt: number;
}

export class CacheProvider {
  private static cache = new Map<string, CacheEntry<any>>();
  private static inFlight = new Map<string, Promise<any>>();
  private static circuitBreakers = new Map<string, CircuitBreakerState>();

  private static readonly CIRCUIT_THRESHOLD = 3;
  private static readonly CIRCUIT_COOLDOWN_MS = 60000; // 60s cooldown

  public static async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs = 120000 // 2 minutes default TTL
  ): Promise<{ data: T; fromCache: boolean; isStale: boolean }> {
    const now = Date.now();

    // 1. Check Circuit Breaker
    const cb = this.circuitBreakers.get(key);
    if (cb && cb.isOpen) {
      if (now - cb.openedAt < this.CIRCUIT_COOLDOWN_MS) {
        // Circuit open: return stale cache if available
        const stale = this.cache.get(key);
        if (stale) {
          return { data: stale.data, fromCache: true, isStale: true };
        }
      } else {
        // Reset circuit for trial request
        cb.isOpen = false;
        cb.failureCount = 0;
      }
    }

    // 2. Check Fresh Cache
    const entry = this.cache.get(key);
    if (entry && now - entry.timestamp < entry.ttlMs) {
      return { data: entry.data, fromCache: true, isStale: false };
    }

    // 3. Request Deduplication: Reuse in-flight promise
    if (this.inFlight.has(key)) {
      try {
        const result = await this.inFlight.get(key);
        return { data: result, fromCache: false, isStale: false };
      } catch {
        // Fall through if in-flight failed
      }
    }

    // 4. Execute Fetcher with Error Handling & Circuit Breaker
    const promise = (async () => {
      try {
        const fresh = await fetcher();
        this.cache.set(key, { data: fresh, timestamp: Date.now(), ttlMs });
        // Reset failure count on success
        this.circuitBreakers.set(key, { failureCount: 0, isOpen: false, openedAt: 0 });
        return fresh;
      } catch (err) {
        // Update circuit breaker
        const currentCb = this.circuitBreakers.get(key) || { failureCount: 0, isOpen: false, openedAt: 0 };
        currentCb.failureCount += 1;
        if (currentCb.failureCount >= this.CIRCUIT_THRESHOLD) {
          currentCb.isOpen = true;
          currentCb.openedAt = Date.now();
        }
        this.circuitBreakers.set(key, currentCb);

        // Stale-on-error fallback
        if (entry) {
          return entry.data;
        }
        throw err;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);

    try {
      const data = await promise;
      return { data, fromCache: false, isStale: false };
    } catch {
      if (entry) {
        return { data: entry.data, fromCache: true, isStale: true };
      }
      throw new Error(`Failed to acquire intelligence from provider "${key}"`);
    }
  }

  public static clear(): void {
    this.cache.clear();
    this.inFlight.clear();
    this.circuitBreakers.clear();
  }
}
