import { ConnectionMonitor } from '@/components/connection-monitor';
import { ConnectionBanner } from '@/components/connection-banner';

export default function Home() {
  return (
    <>
      <ConnectionBanner />
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Connection Status Monitor</h1>
            <p className="text-muted-foreground">
              Monitor your network connection in real-time using Service Workers
            </p>
          </div>

          <div className="flex justify-center">
            <ConnectionMonitor checkInterval={30000} />
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">How It Works</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                  1
                </span>
                <span>
                  <strong className="text-foreground">Service Worker Registration:</strong> A Service
                  Worker is registered to run in the background, independent of the main thread.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                  2
                </span>
                <span>
                  <strong className="text-foreground">Periodic Health Checks:</strong> The Service
                  Worker periodically pings the server to verify actual connectivity, not just
                  browser online status.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                  3
                </span>
                <span>
                  <strong className="text-foreground">Browser Events:</strong> The app also listens
                  to browser online/offline events for immediate status updates.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                  4
                </span>
                <span>
                  <strong className="text-foreground">Network Information API:</strong> When
                  available, displays additional info like connection type, speed, and latency.
                </span>
              </li>
            </ul>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Try disconnecting your network to see the offline status in action!
          </p>
        </div>
      </main>
    </>
  );
}
