// Service Worker for connection monitoring
const CACHE_NAME = 'connection-monitor-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(clients.claim());
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_CONNECTION') {
    // Attempt to fetch a small resource to verify actual connectivity
    checkConnection().then((isOnline) => {
      event.source.postMessage({
        type: 'CONNECTION_STATUS',
        isOnline: isOnline,
        timestamp: Date.now()
      });
    });
  }
});

// Function to check actual connection by attempting a fetch
async function checkConnection() {
  try {
    // Try to fetch a small resource with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/api/ping', {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Periodic connection check
let checkInterval = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_MONITORING') {
    if (checkInterval) clearInterval(checkInterval);
    
    checkInterval = setInterval(async () => {
      const isOnline = await checkConnection();
      const allClients = await clients.matchAll();
      
      allClients.forEach((client) => {
        client.postMessage({
          type: 'CONNECTION_STATUS',
          isOnline: isOnline,
          timestamp: Date.now()
        });
      });
    }, event.data.interval || 30000);
  }
  
  if (event.data && event.data.type === 'STOP_MONITORING') {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }
});
