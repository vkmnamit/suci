// ─── useApi: Generic async data fetcher with loading/error/fallback ─────────
import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiOptions<T> {
  /** Function that returns the promise */
  fetcher: () => Promise<T>;
  /** Fallback data if API fails */
  fallback?: T;
  /** Auto-fetch on mount (default true) */
  autoFetch?: boolean;
  /** Polling interval in ms (0 = disabled) */
  pollInterval?: number;
  /** Dependencies that trigger refetch */
  deps?: unknown[];
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFromApi: boolean;
}

export function useApi<T>({
  fetcher,
  fallback,
  autoFetch = true,
  pollInterval = 0,
  deps = [],
}: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(fallback ?? null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [isFromApi, setIsFromApi] = useState(false);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
        setIsFromApi(true);
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        setIsFromApi(false);
        // Keep fallback data if available
        if (fallback && !data) {
          setData(fallback);
        }
        setLoading(false);
        console.warn(`[SUCI API] Falling back to mock data: ${message}`);
      }
    }
  }, [fetcher, fallback]);

  // Auto-fetch on mount and when deps change
  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) {
      fetchData();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [...deps, autoFetch]);

  // Polling
  useEffect(() => {
    if (pollInterval <= 0) return;
    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval, fetchData]);

  return { data, loading, error, refetch: fetchData, isFromApi };
}
