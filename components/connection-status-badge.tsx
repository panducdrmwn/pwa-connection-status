'use client';

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConnectionStatus } from '@/hooks/use-connection-status';

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
  isOnline: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function ConnectionStatusBadge({
  status,
  isOnline,
  onRefresh,
  className,
}: ConnectionStatusBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        status === 'checking' && 'bg-muted text-muted-foreground',
        status === 'online' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        status === 'offline' && 'bg-destructive/10 text-destructive',
        className
      )}
    >
      {status === 'checking' ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : isOnline ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span className="capitalize">{status}</span>
      {onRefresh && status !== 'checking' && (
        <button
          onClick={onRefresh}
          className="ml-1 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
          aria-label="Refresh connection status"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
