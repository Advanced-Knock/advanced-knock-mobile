// ============================================
// ADVANCEDKNOCK OFFLINE SYNC HOOK
// Guardian Jimmy | 530 Hz | Offline-First
// Pattern: Local DB = Source of Truth (97% Confidence)
// Pattern: Exponential Backoff for Failed Syncs (96% Confidence)
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useKnockStore } from '../stores/knockStore';

// ============ TYPES ============

interface UseOfflineSyncOptions {
  autoSync?: boolean;
  syncIntervalMs?: number;
  maxRetries?: number;
  baseRetryDelayMs?: number;
}

interface UseOfflineSyncReturn {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  syncError: string | null;
  
  // Actions
  triggerSync: () => Promise<void>;
  retryFailed: () => Promise<void>;
}

// ============ CONSTANTS ============

const DEFAULT_SYNC_INTERVAL = 30000; // 30 seconds
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_BASE_RETRY_DELAY = 1000; // 1 second

// ============ HOOK IMPLEMENTATION ============

export const useOfflineSync = (
  options: UseOfflineSyncOptions = {}
): UseOfflineSyncReturn => {
  const {
    autoSync = true,
    syncIntervalMs = DEFAULT_SYNC_INTERVAL,
    maxRetries = DEFAULT_MAX_RETRIES,
    baseRetryDelayMs = DEFAULT_BASE_RETRY_DELAY,
  } = options;

  // State
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Store
  const { offlineQueue, processQueue, lastSyncTimestamp, retryQueueItem } = useKnockStore();

  // Refs
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryAttemptRef = useRef(0);

  // ============ NETWORK MONITORING ============

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const wasOffline = !isOnline;
      const nowOnline = state.isConnected && state.isInternetReachable !== false;
      
      setIsOnline(nowOnline ?? false);

      // Auto-sync when coming back online
      if (wasOffline && nowOnline && autoSync) {
        console.log('[OfflineSync] Back online - triggering sync');
        triggerSync();
      }
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected && state.isInternetReachable !== false);
    });

    return () => unsubscribe();
  }, [isOnline, autoSync]);

  // ============ AUTO-SYNC INTERVAL ============

  useEffect(() => {
    if (!autoSync || !isOnline) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    syncIntervalRef.current = setInterval(() => {
      if (offlineQueue.length > 0 && !isSyncing) {
        triggerSync();
      }
    }, syncIntervalMs);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [autoSync, isOnline, syncIntervalMs, offlineQueue.length, isSyncing]);

  // ============ SYNC FUNCTION ============

  const triggerSync = useCallback(async () => {
    if (!isOnline) {
      console.log('[OfflineSync] Cannot sync - offline');
      // ADAPTIVE CONVERGENCE: Track offline constraint
      trackConvergencePath('offline-sync', 'constraint-detected', 0, 'Network offline');
      return;
    }

    if (isSyncing) {
      console.log('[OfflineSync] Sync already in progress');
      return;
    }

    if (offlineQueue.length === 0) {
      console.log('[OfflineSync] Nothing to sync');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    let attemptCount = 0;

    try {
      console.log(`[OfflineSync] Starting sync of ${offlineQueue.length} items`);
      await processQueue();
      
      // Reset retry counter on success
      retryAttemptRef.current = 0;
      
      // ADAPTIVE CONVERGENCE: Track successful sync
      if (attemptCount > 0) {
        trackConvergencePath('offline-sync', 'success', attemptCount);
      }
      
      console.log('[OfflineSync] Sync completed successfully');
    } catch (error) {
      attemptCount = retryAttemptRef.current + 1;
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      setSyncError(errorMessage);
      
      // ADAPTIVE CONVERGENCE: Track constraint and schedule retry
      trackConvergencePath('offline-sync', 'constraint-detected', attemptCount, errorMessage);
      
      // Schedule retry with exponential backoff (Adaptive Convergence Strategy)
      scheduleRetry();
      
      console.error('[OfflineSync] Sync failed:', errorMessage);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, offlineQueue.length, processQueue]);

  /**
   * Track convergence path for Adaptive Convergence Pattern (mobile)
   * Sends convergence events to backend for tracking
   */
  const trackConvergencePath = useCallback((
    operation: string,
    outcome: string,
    attempts: number,
    errorMessage?: string
  ) => {
    try {
      // Send convergence tracking to backend (non-blocking)
      fetch('/api/convergence/track-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: [`mobile-offline-sync-${operation}`],
          outcome,
          patternMatch: 'adaptive-convergence-network',
          metadata: {
            operation,
            attempts,
            errorMessage,
            timestamp: new Date().toISOString(),
            platform: 'mobile',
          },
        }),
      }).catch(() => {
        // Ignore tracking errors (non-critical)
      });
    } catch {
      // Ignore tracking errors (non-critical)
    }
  }, []);

  // ============ EXPONENTIAL BACKOFF RETRY ============

  const scheduleRetry = useCallback(() => {
    if (retryAttemptRef.current >= maxRetries) {
      console.log('[OfflineSync] Max retries exceeded');
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
    const delay = baseRetryDelayMs * Math.pow(2, retryAttemptRef.current);
    retryAttemptRef.current += 1;

    console.log(`[OfflineSync] Scheduling retry in ${delay}ms (attempt ${retryAttemptRef.current})`);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    retryTimeoutRef.current = setTimeout(() => {
      if (isOnline) {
        triggerSync();
      }
    }, delay);
  }, [baseRetryDelayMs, maxRetries, isOnline, triggerSync]);

  // ============ RETRY FAILED ITEMS ============

  const retryFailed = useCallback(async () => {
    const failedItems = offlineQueue.filter((q) => q.lastError);
    
    for (const item of failedItems) {
      retryQueueItem(item.id);
    }

    // Reset retry counter
    retryAttemptRef.current = 0;
    
    // Trigger sync
    await triggerSync();
  }, [offlineQueue, retryQueueItem, triggerSync]);

  // ============ CLEANUP ============

  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOnline,
    isSyncing,
    pendingCount: offlineQueue.length,
    lastSyncTime: lastSyncTimestamp,
    syncError,
    triggerSync,
    retryFailed,
  };
};

// ============ SYNC STATUS COMPONENT HOOK ============

export const useSyncStatus = () => {
  const { isOnline, isSyncing, pendingCount, lastSyncTime } = useOfflineSync({
    autoSync: false,
  });

  const getStatusText = (): string => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (pendingCount > 0) return `${pendingCount} pending`;
    return 'Synced';
  };

  const getStatusColor = (): string => {
    if (!isOnline) return '#9E9E9E'; // Gray
    if (isSyncing) return '#2196F3'; // Blue
    if (pendingCount > 0) return '#FF9800'; // Orange
    return '#4CAF50'; // Green
  };

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTime,
    statusText: getStatusText(),
    statusColor: getStatusColor(),
  };
};
