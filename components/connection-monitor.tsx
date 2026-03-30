'use client';

import { useConnectionStatus } from '@/hooks/use-connection-status';
import { ConnectionStatusBadge } from './connection-status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, Activity, Clock, Gauge, Timer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectionMonitorProps {
  checkInterval?: number;
  className?: string;
}

export function ConnectionMonitor({ checkInterval = 30000, className }: ConnectionMonitorProps) {
  const { status, isOnline, lastChecked, effectiveType, downlink, rtt, checkConnection } =
    useConnectionStatus(checkInterval);

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Connection Monitor
            </CardTitle>
            <CardDescription>Real-time network status</CardDescription>
          </div>
          <ConnectionStatusBadge status={status} isOnline={isOnline} onRefresh={checkConnection} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Status */}
        <div
          className={cn(
            'flex items-center gap-4 rounded-lg p-4 transition-colors',
            isOnline
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-destructive/10 border border-destructive/20'
          )}
        >
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              isOnline ? 'bg-emerald-500/20' : 'bg-destructive/20'
            )}
          >
            {isOnline ? (
              <Wifi className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <WifiOff className="h-6 w-6 text-destructive" />
            )}
          </div>
          <div>
            <p className="font-semibold text-lg">{isOnline ? 'Connected' : 'Disconnected'}</p>
            <p className="text-sm text-muted-foreground">
              {isOnline
                ? 'Your connection is stable'
                : 'Please check your network settings'}
            </p>
          </div>
        </div>

        {/* Network Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-3 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Last Check</span>
            </div>
            <p className="text-sm font-semibold">{formatTime(lastChecked)}</p>
          </div>

          <div className="rounded-lg border bg-card p-3 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">Connection Type</span>
            </div>
            <p className="text-sm font-semibold uppercase">{effectiveType || 'Unknown'}</p>
          </div>

          {downlink !== undefined && (
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gauge className="h-4 w-4" />
                <span className="text-xs font-medium">Downlink</span>
              </div>
              <p className="text-sm font-semibold">{downlink} Mbps</p>
            </div>
          )}

          {rtt !== undefined && (
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span className="text-xs font-medium">Latency (RTT)</span>
              </div>
              <p className="text-sm font-semibold">{rtt} ms</p>
            </div>
          )}
        </div>

        {/* Manual Check Button */}
        <Button
          onClick={checkConnection}
          variant="outline"
          className="w-full"
          disabled={status === 'checking'}
        >
          {status === 'checking' ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Connection
            </>
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground">
          Auto-checking every {checkInterval / 1000} seconds via Service Worker
        </p>
      </CardContent>
    </Card>
  );
}
