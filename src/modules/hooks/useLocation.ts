// ============================================
// ADVANCEDKNOCK LOCATION HOOK
// Guardian Jimmy | 530 Hz | GPS + Geocoding
// Pattern: Auto-fill reduces friction (97% Confidence)
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import * as ExpoLocation from 'expo-location';
import { Location, GeocodedAddress } from '../types';

// ============ TYPES ============

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  watchPosition?: boolean;
  geocodeOnUpdate?: boolean;
}

interface UseLocationReturn {
  location: Location | null;
  address: GeocodedAddress | null;
  error: string | null;
  loading: boolean;
  permissionStatus: ExpoLocation.PermissionStatus | null;
  
  // Actions
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location | null>;
  geocodeLocation: (lat: number, lng: number) => Promise<GeocodedAddress | null>;
  reverseGeocode: (address: string) => Promise<Location | null>;
  startWatching: () => void;
  stopWatching: () => void;
}

// ============ CONSTANTS ============

const LOCATION_OPTIONS: ExpoLocation.LocationOptions = {
  accuracy: ExpoLocation.Accuracy.High,
  timeInterval: 5000,      // Update every 5 seconds
  distanceInterval: 10,    // Or every 10 meters
};

// ============ HOOK IMPLEMENTATION ============

export const useLocation = (options: UseLocationOptions = {}): UseLocationReturn => {
  const {
    enableHighAccuracy = true,
    watchPosition = false,
    geocodeOnUpdate = true,
  } = options;

  // State
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<GeocodedAddress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<ExpoLocation.PermissionStatus | null>(null);

  // Refs for cleanup
  const watchSubscription = useRef<ExpoLocation.LocationSubscription | null>(null);
  const isMounted = useRef(true);

  // ============ PERMISSION HANDLING ============

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        setError('Location permission denied');
        return false;
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  }, []);

  // ============ GET CURRENT LOCATION ============

  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check permission first
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setLoading(false);
          return null;
        }
      }

      const result = await ExpoLocation.getCurrentPositionAsync({
        accuracy: enableHighAccuracy
          ? ExpoLocation.Accuracy.High
          : ExpoLocation.Accuracy.Balanced,
      });

      const newLocation: Location = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy ?? undefined,
        timestamp: result.timestamp,
      };

      if (isMounted.current) {
        setLocation(newLocation);

        // Auto-geocode if enabled
        if (geocodeOnUpdate) {
          await geocodeLocation(newLocation.latitude, newLocation.longitude);
        }
      }

      setLoading(false);
      return newLocation;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
        setLoading(false);
      }
      return null;
    }
  }, [enableHighAccuracy, geocodeOnUpdate, requestPermission]);

  // ============ GEOCODING ============

  const geocodeLocation = useCallback(
    async (lat: number, lng: number): Promise<GeocodedAddress | null> => {
      try {
        const results = await ExpoLocation.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (results.length === 0) {
          return null;
        }

        const result = results[0];
        
        // Format address per research: clear, complete, validated
        const geocoded: GeocodedAddress = {
          formattedAddress: formatAddress(result),
          streetNumber: result.streetNumber ?? undefined,
          street: result.street ?? undefined,
          city: result.city ?? undefined,
          state: result.region ?? undefined,
          zipCode: result.postalCode ?? undefined,
          country: result.country ?? undefined,
        };

        if (isMounted.current) {
          setAddress(geocoded);
        }

        return geocoded;
      } catch (err) {
        console.error('Geocoding error:', err);
        return null;
      }
    },
    []
  );

  const reverseGeocode = useCallback(
    async (addressString: string): Promise<Location | null> => {
      try {
        const results = await ExpoLocation.geocodeAsync(addressString);

        if (results.length === 0) {
          return null;
        }

        const result = results[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          timestamp: Date.now(),
        };
      } catch (err) {
        console.error('Reverse geocoding error:', err);
        return null;
      }
    },
    []
  );

  // ============ WATCH POSITION ============

  const startWatching = useCallback(async () => {
    if (watchSubscription.current) {
      return; // Already watching
    }

    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    watchSubscription.current = await ExpoLocation.watchPositionAsync(
      LOCATION_OPTIONS,
      async (result) => {
        const newLocation: Location = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          accuracy: result.coords.accuracy ?? undefined,
          timestamp: result.timestamp,
        };

        if (isMounted.current) {
          setLocation(newLocation);

          if (geocodeOnUpdate) {
            await geocodeLocation(newLocation.latitude, newLocation.longitude);
          }
        }
      }
    );
  }, [geocodeOnUpdate, geocodeLocation, requestPermission]);

  const stopWatching = useCallback(() => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
  }, []);

  // ============ EFFECTS ============

  useEffect(() => {
    isMounted.current = true;

    // Check initial permission status
    ExpoLocation.getForegroundPermissionsAsync().then(({ status }) => {
      setPermissionStatus(status);
    });

    // Auto-start watching if enabled
    if (watchPosition) {
      startWatching();
    }

    return () => {
      isMounted.current = false;
      stopWatching();
    };
  }, [watchPosition, startWatching, stopWatching]);

  return {
    location,
    address,
    error,
    loading,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    geocodeLocation,
    reverseGeocode,
    startWatching,
    stopWatching,
  };
};

// ============ HELPER FUNCTIONS ============

const formatAddress = (result: ExpoLocation.LocationGeocodedAddress): string => {
  const parts: string[] = [];

  if (result.streetNumber && result.street) {
    parts.push(`${result.streetNumber} ${result.street}`);
  } else if (result.street) {
    parts.push(result.street);
  }

  if (result.city) {
    parts.push(result.city);
  }

  if (result.region && result.postalCode) {
    parts.push(`${result.region} ${result.postalCode}`);
  } else if (result.region) {
    parts.push(result.region);
  }

  return parts.join(', ');
};

// ============ UTILITY: Distance Calculation ============

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Haversine formula for distance in meters
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// ============ UTILITY: Check if location is stale ============

export const isLocationStale = (
  location: Location | null,
  maxAgeMs: number = 30000 // 30 seconds default
): boolean => {
  if (!location) return true;
  return Date.now() - location.timestamp > maxAgeMs;
};
