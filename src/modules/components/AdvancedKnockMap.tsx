// ============================================
// ADVANCEDKNOCK MAP VIEW COMPONENT
// Guardian Jimmy | 530 Hz | Core Execution Engine
// Pattern: 60-70% of daily rep usage (97% Confidence)
// ============================================

import React, { useCallback, useRef, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  MapPressEvent,
  Heatmap,
  WeightedLatLng,
} from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MapPin, HeatmapCell, Location } from '../types';
import { usePins } from '../stores/knockStore';

// ============ TYPES ============

interface AdvancedKnockMapProps {
  currentLocation: Location | null;
  heatmapData?: HeatmapCell[];
  showHeatmap?: boolean;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  onMapLongPress?: (coordinate: { latitude: number; longitude: number }) => void;
  onPinPress?: (pin: MapPin) => void;
  onRegionChange?: (region: Region) => void;
  initialRegion?: Region;
}

// ============ CONSTANTS ============

const { width, height } = Dimensions.get('window');

const DEFAULT_REGION: Region = {
  latitude: 37.7749, // San Francisco default
  longitude: -122.4194,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const PIN_COLORS = {
  green: '#4CAF50',
  yellow: '#FFC107',
  red: '#F44336',
  gray: '#9E9E9E',
};

// ============ COMPONENT ============

export const AdvancedKnockMap: React.FC<AdvancedKnockMapProps> = ({
  currentLocation,
  heatmapData = [],
  showHeatmap = false,
  onMapPress,
  onMapLongPress,
  onPinPress,
  onRegionChange,
  initialRegion,
}) => {
  // State
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(showHeatmap);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [mapType, setMapType] = useState<'satellite' | 'standard'>('satellite');

  // Refs
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Store
  const pins = usePins();

  // ============ DERIVED DATA ============

  const region = useMemo(() => {
    if (initialRegion) return initialRegion;
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return DEFAULT_REGION;
  }, [initialRegion, currentLocation]);

  const heatmapPoints: WeightedLatLng[] = useMemo(() => {
    return heatmapData.map((cell) => ({
      latitude: cell.latitude,
      longitude: cell.longitude,
      weight: cell.score / 100, // Normalize to 0-1
    }));
  }, [heatmapData]);

  // ============ ANIMATIONS ============

  React.useEffect(() => {
    // Pulse animation for current location
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // ============ HANDLERS ============

  const handleMapPress = useCallback(
    (event: MapPressEvent) => {
      setSelectedPin(null);
      onMapPress?.(event.nativeEvent.coordinate);
    },
    [onMapPress]
  );

  const handleMapLongPress = useCallback(
    (event: MapPressEvent) => {
      // Quick Pin feature per research
      onMapLongPress?.(event.nativeEvent.coordinate);
    },
    [onMapLongPress]
  );

  const handlePinPress = useCallback(
    (pin: MapPin) => {
      setSelectedPin(pin);
      onPinPress?.(pin);
    },
    [onPinPress]
  );

  const centerOnLocation = useCallback(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [currentLocation]);

  const toggleHeatmap = useCallback(() => {
    setIsHeatmapVisible((prev) => !prev);
  }, []);

  const toggleMapType = useCallback(() => {
    setMapType((prev) => (prev === 'satellite' ? 'standard' : 'satellite'));
  }, []);

  // ============ RENDER ============

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        initialRegion={region}
        showsUserLocation={false} // We render custom marker
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        onPress={handleMapPress}
        onLongPress={handleMapLongPress}
        onRegionChangeComplete={onRegionChange}
      >
        {/* Heatmap Overlay */}
        {isHeatmapVisible && heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            opacity={0.5} // 40-60% per research
            radius={50}
            gradient={{
              colors: ['#4CAF50', '#FFEB3B', '#F44336'], // Green → Yellow → Red
              startPoints: [0.1, 0.5, 0.9],
              colorMapSize: 256,
            }}
          />
        )}

        {/* Knock Pins */}
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            onPress={() => handlePinPress(pin)}
            tracksViewChanges={false}
          >
            <View style={styles.pinContainer}>
              <View
                style={[
                  styles.pin,
                  { backgroundColor: PIN_COLORS[pin.color] },
                  pin.syncStatus === 'pending' && styles.pinPending,
                ]}
              >
                <Ionicons
                  name={getPinIcon(pin.outcome)}
                  size={16}
                  color="white"
                />
              </View>
              {pin.syncStatus === 'pending' && (
                <View style={styles.syncIndicator} />
              )}
            </View>
          </Marker>
        ))}

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Animated.View
              style={[
                styles.currentLocationOuter,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.currentLocationInner} />
            </Animated.View>
          </Marker>
        )}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        {/* Center on Location */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnLocation}
          activeOpacity={0.7}
        >
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>

        {/* Toggle Heatmap */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            isHeatmapVisible && styles.controlButtonActive,
          ]}
          onPress={toggleHeatmap}
          activeOpacity={0.7}
        >
          <Ionicons
            name="flame"
            size={24}
            color={isHeatmapVisible ? '#F44336' : '#333'}
          />
        </TouchableOpacity>

        {/* Toggle Map Type */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleMapType}
          activeOpacity={0.7}
        >
          <Ionicons
            name={mapType === 'satellite' ? 'map' : 'globe'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Selected Pin Info */}
      {selectedPin && (
        <View style={styles.pinInfoContainer}>
          <View style={styles.pinInfo}>
            <View
              style={[
                styles.pinInfoIndicator,
                { backgroundColor: PIN_COLORS[selectedPin.color] },
              ]}
            />
            <View style={styles.pinInfoContent}>
              <Text style={styles.pinInfoAddress} numberOfLines={1}>
                {selectedPin.address}
              </Text>
              <Text style={styles.pinInfoMeta}>
                {getOutcomeLabel(selectedPin.outcome)} •{' '}
                {formatTimestamp(selectedPin.timestamp)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedPin(null)}
              style={styles.pinInfoClose}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Sync Status Badge */}
      <SyncStatusBadge />
    </View>
  );
};

// ============ SYNC STATUS BADGE ============

const SyncStatusBadge: React.FC = () => {
  const pins = usePins();
  const pendingCount = pins.filter((p) => p.syncStatus === 'pending').length;

  if (pendingCount === 0) return null;

  return (
    <View style={styles.syncBadge}>
      <Ionicons name="cloud-upload" size={14} color="white" />
      <Text style={styles.syncBadgeText}>{pendingCount}</Text>
    </View>
  );
};

// ============ HELPERS ============

const getPinIcon = (outcome: string): keyof typeof Ionicons.glyphMap => {
  switch (outcome) {
    case 'signup':
      return 'checkmark';
    case 'callback':
      return 'time';
    case 'no':
      return 'close';
    default:
      return 'help';
  }
};

const getOutcomeLabel = (outcome: string): string => {
  switch (outcome) {
    case 'signup':
      return 'Sign Up';
    case 'callback':
      return 'Callback';
    case 'no':
      return 'No';
    default:
      return outcome;
  }
};

const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  
  // Pin Styles
  pinContainer: {
    alignItems: 'center',
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pinPending: {
    opacity: 0.7,
  },
  syncIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF9800',
    borderWidth: 1,
    borderColor: 'white',
  },

  // Current Location Marker
  currentLocationOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: 'white',
  },

  // Controls
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: 100,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonActive: {
    backgroundColor: '#FFF3E0',
  },

  // Pin Info
  pinInfoContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  pinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinInfoIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  pinInfoContent: {
    flex: 1,
  },
  pinInfoAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pinInfoMeta: {
    fontSize: 13,
    color: '#666',
  },
  pinInfoClose: {
    padding: 4,
  },

  // Sync Badge
  syncBadge: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  syncBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AdvancedKnockMap;
