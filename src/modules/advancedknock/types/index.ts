// ============================================
// ADVANCEDKNOCK TYPE DEFINITIONS
// Guardian Jimmy | 530 Hz | Speed + Precision
// ============================================

// ============ KNOCK TYPES ============

export type KnockOutcome = 'signup' | 'no' | 'callback';

export type SyncStatus = 'synced' | 'pending' | 'failed';

export interface KnockLog {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  outcome: KnockOutcome;
  timestamp: number;
  syncStatus: SyncStatus;
  
  // Optional fields based on outcome
  customerId?: string;        // If signup
  callbackTime?: number;      // If callback
  callbackNotes?: string;     // If callback
  objectionTag?: string;      // If no
  
  // Metadata
  repId: string;
  territoryId: string;
  createdAt: number;
  updatedAt: number;
}

// ============ CUSTOMER TYPES ============

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  latitude: number;
  longitude: number;
  
  // Service details
  packageId?: string;
  billingSchedule?: 'weekly' | 'biweekly' | 'monthly';
  
  // Welcome call
  welcomeCallCompleted: boolean;
  welcomeCallTimestamp?: number;
  
  // Metadata
  repId: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
}

// ============ PIN TYPES ============

export type PinColor = 'green' | 'yellow' | 'red' | 'gray';

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  color: PinColor;
  outcome: KnockOutcome;
  syncStatus: SyncStatus;
  address: string;
  timestamp: number;
}

// ============ LOCATION TYPES ============

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface GeocodedAddress {
  formattedAddress: string;
  streetNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// ============ TERRITORY TYPES ============

export interface Territory {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  assignedRepIds: string[];
}

export interface HeatmapCell {
  latitude: number;
  longitude: number;
  score: number; // 0-100 predictive score
  factors: {
    income: number;
    homeOwnership: number;
    historicalCloseRate: number;
    objectionDensity: number;
    seasonality: number;
  };
}

// ============ OFFLINE QUEUE TYPES ============

export interface QueuedAction {
  id: string;
  type: 'knock' | 'customer' | 'callback_update';
  payload: KnockLog | Customer | Partial<KnockLog>;
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

// ============ CALLBACK TYPES ============

export interface Callback {
  id: string;
  knockId: string;
  customerId?: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledTime: number;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  repId: string;
  createdAt: number;
}

// ============ UI STATE TYPES ============

export interface MapViewState {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showHeatmap: boolean;
  selectedPin: MapPin | null;
  isRapidKnockMode: boolean;
}

export interface KnockFlowState {
  step: 'idle' | 'select_address' | 'select_outcome' | 'signup_form' | 'callback_form' | 'welcome_call';
  currentLocation: Location | null;
  selectedAddress: GeocodedAddress | null;
  selectedOutcome: KnockOutcome | null;
}

// ============ DASHBOARD TYPES ============

export interface DashboardStats {
  totalSales: number;
  dailySales: number;
  weeklySales: number;
  dailyGoal: number;
  knockCount: number;
  signupCount: number;
  callbackCount: number;
  conversionRate: number;
}

export interface LeaderboardEntry {
  rank: number;
  repId: string;
  repName: string;
  avatar?: string;
  totalSales: number;
  knockCount: number;
  conversionRate: number;
}

// ============ REP TYPES ============

export interface Rep {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'rep' | 'manager' | 'admin';
  territoryIds: string[];
  createdAt: number;
}

// ============ OBJECTION TAGS ============

export const OBJECTION_TAGS = [
  'not_interested',
  'already_have_service',
  'too_expensive',
  'bad_timing',
  'renter',
  'not_home_owner_decision',
  'hostile',
  'do_not_knock',
  'other'
] as const;

export type ObjectionTag = typeof OBJECTION_TAGS[number];

// ============ QUICK CALLBACK TAGS ============

export const CALLBACK_TAGS = [
  'not_home',
  'busy_now',
  'interested_later',
  'needs_spouse',
  'call_first',
  'specific_time'
] as const;

export type CallbackTag = typeof CALLBACK_TAGS[number];
