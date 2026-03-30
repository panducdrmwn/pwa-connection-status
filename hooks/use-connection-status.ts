'use client';

import { useState, useEffect, useCallback } from 'react';

export type ConnectionStatus = 'online' | 'offline' | 'checking';

export interface ConnectionInfo {
  status: ConnectionStatus;
  isOnline: boolean;
  lastChecked: Date | null;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export function useConnectionStatus(checkInterval: number = 30000) {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    status: 'checking',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChecked: null,
  });
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Get network information if available
  const getNetworkInfo = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      if (connection) {
        return {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        };
      }
    }
    return {};
  }, []);

  // Manual connection check
  const checkConnection = useCallback(async (): Promise<boolean> => {
    setConnectionInfo((prev) => ({ ...prev, status: 'checking' }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const isOnline = response.ok;
      
      setConnectionInfo({
        status: isOnline ? 'online' : 'offline',
        isOnline,
        lastChecked: new Date(),
        ...getNetworkInfo(),
      });
      
      return isOnline;
    } catch {
      setConnectionInfo({
        status: 'offline',
        isOnline: false,
        lastChecked: new Date(),
        ...getNetworkInfo(),
      });
      return false;
    }
  }, [getNetworkInfo]);

  // Register service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setSwRegistration(registration);
        console.log('Service Worker registered successfully');
        
        // Start monitoring after registration
        if (registration.active) {
          registration.active.postMessage({
            type: 'START_MONITORING',
            interval: checkInterval,
          });
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();

    // Listen for messages from Service Worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONNECTION_STATUS') {
        setConnectionInfo({
          status: event.data.isOnline ? 'online' : 'offline',
          isOnline: event.data.isOnline,
          lastChecked: new Date(event.data.timestamp),
          ...getNetworkInfo(),
        });
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      if (swRegistration?.active) {
        swRegistration.active.postMessage({ type: 'STOP_MONITORING' });
      }
    };
  }, [checkInterval, getNetworkInfo, swRegistration]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setConnectionInfo((prev) => ({
        ...prev,
        status: 'online',
        isOnline: true,
        lastChecked: new Date(),
        ...getNetworkInfo(),
      }));
    };

    const handleOffline = () => {
      setConnectionInfo((prev) => ({
        ...prev,
        status: 'offline',
        isOnline: false,
        lastChecked: new Date(),
        ...getNetworkInfo(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection, getNetworkInfo]);

  return {
    ...connectionInfo,
    checkConnection,
    swRegistration,
  };
}

// Type definition for Network Information API
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}
