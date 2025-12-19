// ============================================
// ADVANCEDKNOCK KNOCK STORE
// Guardian Jimmy | 530 Hz | Offline-First Architecture
// Pattern: Local DB = Source of Truth (97% Confidence)
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {
  KnockLog,
  KnockOutcome,
  MapPin,
  PinColor,
  QueuedAction,
  SyncStatus,
  Customer,
  Callback,
  Location,
} from '../types';

// ============ HELPER FUNCTIONS ============

const outcomeToColor = (outcome: KnockOutcome, syncStatus: SyncStatus): PinColor => {
  if (syncStatus === 'pending' || syncStatus === 'failed') return 'gray';
  switch (outcome) {
    case 'signup': return 'green';
    case 'callback': return 'yellow';
    case 'no': return 'red';
  }
};

const knockToPin = (knock: KnockLog): MapPin => ({
  id: knock.id,
  latitude: knock.latitude,
  longitude: knock.longitude,
  color: outcomeToColor(knock.outcome, knock.syncStatus),
  outcome: knock.outcome,
  syncStatus: knock.syncStatus,
  address: knock.address,
  timestamp: knock.timestamp,
});

// ============ STORE INTERFACE ============

interface KnockStore {
  // State
  knocks: KnockLog[];
  customers: Customer[];
  callbacks: Callback[];
  offlineQueue: QueuedAction[];
  lastSyncTimestamp: number | null;
  
  // Derived state
  pins: MapPin[];
  pendingCount: number;
  
  // Actions - Knock Logging
  addKnock: (knock: Omit<KnockLog, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => string;
  updateKnock: (id: string, updates: Partial<KnockLog>) => void;
  deleteKnock: (id: string) => void;
  
  // Actions - Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => string;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  // Actions - Callbacks
  addCallback: (callback: Omit<Callback, 'id' | 'createdAt'>) => string;
  updateCallback: (id: string, updates: Partial<Callback>) => void;
  
  // Actions - Offline Queue
  addToQueue: (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  markSynced: (knockId: string) => void;
  markSyncFailed: (knockId: string, error: string) => void;
  retryQueueItem: (id: string) => void;
  
  // Actions - Sync
  processQueue: () => Promise<void>;
  setLastSyncTimestamp: (timestamp: number) => void;
  
  // Actions - Undo (5-second window per research)
  lastAction: { type: string; data: any; timestamp: number } | null;
  undoLastAction: () => void;
  clearUndoAction: () => void;
  
  // Selectors
  getKnocksByTerritory: (territoryId: string) => KnockLog[];
  getCallbacksForToday: () => Callback[];
  getPendingKnocks: () => KnockLog[];
  getKnockByAddress: (address: string) => KnockLog | undefined;
}

// ============ STORE IMPLEMENTATION ============

export const useKnockStore = create<KnockStore>()(
  persist(
    (set, get) => ({
      // Initial State
      knocks: [],
      customers: [],
      callbacks: [],
      offlineQueue: [],
      lastSyncTimestamp: null,
      lastAction: null,
      
      // Computed properties (updated on state change)
      get pins() {
        return get().knocks.map(knockToPin);
      },
      
      get pendingCount() {
        return get().offlineQueue.length;
      },
      
      // ============ KNOCK ACTIONS ============
      
      addKnock: (knockData) => {
        const id = uuid.v4() as string;
        const now = Date.now();
        
        const knock: KnockLog = {
          ...knockData,
          id,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'pending',
        };
        
        set((state) => ({
          knocks: [...state.knocks, knock],
          lastAction: { type: 'addKnock', data: knock, timestamp: now },
        }));
        
        // Add to offline queue
        get().addToQueue({ type: 'knock', payload: knock });
        
        // Clear undo after 5 seconds (research-backed)
        setTimeout(() => {
          const currentAction = get().lastAction;
          if (currentAction?.data?.id === id) {
            get().clearUndoAction();
          }
        }, 5000);
        
        return id;
      },
      
      updateKnock: (id, updates) => {
        set((state) => ({
          knocks: state.knocks.map((k) =>
            k.id === id ? { ...k, ...updates, updatedAt: Date.now() } : k
          ),
        }));
      },
      
      deleteKnock: (id) => {
        set((state) => ({
          knocks: state.knocks.filter((k) => k.id !== id),
          offlineQueue: state.offlineQueue.filter(
            (q) => !(q.type === 'knock' && (q.payload as KnockLog).id === id)
          ),
        }));
      },
      
      // ============ CUSTOMER ACTIONS ============
      
      addCustomer: (customerData) => {
        const id = uuid.v4() as string;
        const now = Date.now();
        
        const customer: Customer = {
          ...customerData,
          id,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'pending',
        };
        
        set((state) => ({
          customers: [...state.customers, customer],
        }));
        
        get().addToQueue({ type: 'customer', payload: customer });
        
        return id;
      },
      
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
          ),
        }));
      },
      
      // ============ CALLBACK ACTIONS ============
      
      addCallback: (callbackData) => {
        const id = uuid.v4() as string;
        
        const callback: Callback = {
          ...callbackData,
          id,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          callbacks: [...state.callbacks, callback],
        }));
        
        return id;
      },
      
      updateCallback: (id, updates) => {
        set((state) => ({
          callbacks: state.callbacks.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },
      
      // ============ OFFLINE QUEUE ACTIONS ============
      
      addToQueue: (actionData) => {
        const queuedAction: QueuedAction = {
          ...actionData,
          id: uuid.v4() as string,
          timestamp: Date.now(),
          retryCount: 0,
        };
        
        set((state) => ({
          offlineQueue: [...state.offlineQueue, queuedAction],
        }));
      },
      
      removeFromQueue: (id) => {
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((q) => q.id !== id),
        }));
      },
      
      markSynced: (knockId) => {
        set((state) => ({
          knocks: state.knocks.map((k) =>
            k.id === knockId ? { ...k, syncStatus: 'synced' as SyncStatus } : k
          ),
          customers: state.customers.map((c) =>
            c.id === knockId ? { ...c, syncStatus: 'synced' as SyncStatus } : c
          ),
        }));
      },
      
      markSyncFailed: (knockId, error) => {
        set((state) => ({
          knocks: state.knocks.map((k) =>
            k.id === knockId ? { ...k, syncStatus: 'failed' as SyncStatus } : k
          ),
          offlineQueue: state.offlineQueue.map((q) =>
            (q.payload as any).id === knockId
              ? { ...q, lastError: error, retryCount: q.retryCount + 1 }
              : q
          ),
        }));
      },
      
      retryQueueItem: (id) => {
        // Will be processed by processQueue
        set((state) => ({
          offlineQueue: state.offlineQueue.map((q) =>
            q.id === id ? { ...q, retryCount: 0, lastError: undefined } : q
          ),
        }));
      },
      
      // ============ SYNC ACTIONS ============
      
      processQueue: async () => {
        const { offlineQueue, markSynced, markSyncFailed, removeFromQueue } = get();
        
        for (const action of offlineQueue) {
          // Exponential backoff: skip if too many retries recently
          if (action.retryCount > 5) {
            console.log(`Skipping action ${action.id} - max retries exceeded`);
            continue;
          }
          
          try {
            // TODO: Replace with actual API call
            // await api.sync(action);
            
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 100));
            
            // Mark as synced
            if (action.type === 'knock' || action.type === 'customer') {
              markSynced((action.payload as any).id);
            }
            removeFromQueue(action.id);
            
          } catch (error) {
            markSyncFailed(
              (action.payload as any).id,
              error instanceof Error ? error.message : 'Unknown error'
            );
          }
        }
        
        set({ lastSyncTimestamp: Date.now() });
      },
      
      setLastSyncTimestamp: (timestamp) => {
        set({ lastSyncTimestamp: timestamp });
      },
      
      // ============ UNDO ACTIONS ============
      
      undoLastAction: () => {
        const { lastAction } = get();
        if (!lastAction) return;
        
        const timeSinceAction = Date.now() - lastAction.timestamp;
        if (timeSinceAction > 5000) return; // 5-second window
        
        if (lastAction.type === 'addKnock') {
          get().deleteKnock(lastAction.data.id);
        }
        
        set({ lastAction: null });
      },
      
      clearUndoAction: () => {
        set({ lastAction: null });
      },
      
      // ============ SELECTORS ============
      
      getKnocksByTerritory: (territoryId) => {
        return get().knocks.filter((k) => k.territoryId === territoryId);
      },
      
      getCallbacksForToday: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return get().callbacks.filter(
          (c) =>
            c.status === 'pending' &&
            c.scheduledTime >= today.getTime() &&
            c.scheduledTime < tomorrow.getTime()
        );
      },
      
      getPendingKnocks: () => {
        return get().knocks.filter((k) => k.syncStatus === 'pending');
      },
      
      getKnockByAddress: (address) => {
        return get().knocks.find(
          (k) => k.address.toLowerCase() === address.toLowerCase()
        );
      },
    }),
    {
      name: 'advancedknock-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        knocks: state.knocks,
        customers: state.customers,
        callbacks: state.callbacks,
        offlineQueue: state.offlineQueue,
        lastSyncTimestamp: state.lastSyncTimestamp,
      }),
    }
  )
);

// ============ DERIVED SELECTORS (For performance) ============

export const usePins = () => useKnockStore((state) => state.knocks.map(knockToPin));
export const usePendingCount = () => useKnockStore((state) => state.offlineQueue.length);
export const useLastAction = () => useKnockStore((state) => state.lastAction);
