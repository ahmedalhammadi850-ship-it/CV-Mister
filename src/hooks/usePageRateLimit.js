import { useState, useEffect, useCallback } from 'react';

export function usePageRateLimit() {
  const [blocked, setBlocked] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);

  const checkRateLimit = useCallback(async () => {
    try {
      const res = await fetch('/api/ping');
      const data = await res.json();
      if (res.status === 429 || data.blocked) {
        setBlocked(true);
        setRemainingMs(data.remainingMs || 60000);
      } else {
        setBlocked(false);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  useEffect(() => {
    if (!blocked || remainingMs <= 0) return;
    const interval = setInterval(() => {
      setRemainingMs(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          setBlocked(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [blocked, remainingMs]);

  return { blocked, remainingMs };
}
