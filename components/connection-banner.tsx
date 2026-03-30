'use client';

import { useEffect, useState } from 'react';
import { WifiOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConnectionStatus } from '@/hooks/use-connection-status';

interface ConnectionBannerProps {
  className?: string;
}

export function ConnectionBanner({ className }: ConnectionBannerProps) {
  const { isOnline, status } = useConnectionStatus();
  const [dismissed, setDismissed] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setDismissed(false);
    } else if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (status === 'checking') return null;
  if (isOnline && !showReconnected) return null;
  if (dismissed && !isOnline) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-center gap-3 transition-all',
        !isOnline && 'bg-destructive text-destructive-foreground',
        showReconnected && 'bg-emerald-500 text-white',
        className
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            You&apos;re offline. Some features may be unavailable.
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <span className="text-sm font-medium">Back online!</span>
      )}
    </div>
  );
}
