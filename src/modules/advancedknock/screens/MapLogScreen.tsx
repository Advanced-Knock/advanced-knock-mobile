// ============================================
// ADVANCEDKNOCK MAP + LOG SCREEN
// Guardian Jimmy | 530 Hz | Core Execution Engine
// Pattern: 60-70% of daily rep usage (97% Confidence)
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { AdvancedKnockMap } from '../components/AdvancedKnockMap';
import { KnockLogger } from '../components/KnockLogger';
import { useLocation } from '../hooks/useLocation';
import { useOfflineSync, useSyncStatus } from '../hooks/useOfflineSync';
import { KnockOutcome, HeatmapCell } from '../types';

// ============ CONSTANTS ============

// Mock data for testing - replace with real API
const MOCK_HEATMAP_DATA: HeatmapCell[] = [
  // Generate some sample heatmap cells
  ...Array.from({ length: 50 }, (_, i) => ({
    latitude: 37.7749 + (Math.random() - 0.5) * 0.02,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.02,
    score: Math.random() * 100,
    factors: {
      income: Math.random() * 100,
      homeOwnership: Math.random() * 100,
      historicalCloseRate: Math.random() * 100,
      objectionDensity: Math.random() * 100,
      seasonality: Math.random() * 100,
    },
  })),
];

// ============ COMPONENT ============

interface MapLogScreenProps {
  repId?: string;
  territoryId?: string;
}

export const MapLogScreen: React.FC<MapLogScreenProps> = ({
  repId = 'rep_001', // Default for testing
  territoryId = 'territory_001',
}) => {
  // State
  const [isKnockLoggerVisible, setIsKnockLoggerVisible] = useState(false);
  const [isRapidMode, setIsRapidMode] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [knockCount, setKnockCount] = useState(0);

  // Hooks
  const {
    location,
    address,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
    geocodeLocation,
    startWatching,
    stopWatching,
    requestPermission,
    permissionStatus,
  } = useLocation({ watchPosition: true, geocodeOnUpdate: true });

  const { isOnline, pendingCount, triggerSync } = useOfflineSync();
  const syncStatus = useSyncStatus();

  // ============ EFFECTS ============

  useEffect(() => {
    // Request location permission on mount
    requestPermission();
  }, []);

  useEffect(() => {
    // Auto-sync when coming online
    if (isOnline && pendingCount > 0) {
      triggerSync();
    }
  }, [isOnline, pendingCount]);

  // ============ HANDLERS ============

  const handleMapPress = useCallback(
    async (coordinate: { latitude: number; longitude: number }) => {
      if (isRapidMode) {
        // In rapid mode, open logger immediately on tap
        setSelectedCoordinate(coordinate);
        await geocodeLocation(coordinate.latitude, coordinate.longitude);
        setIsKnockLoggerVisible(true);
      }
    },
    [isRapidMode, geocodeLocation]
  );

  const handleMapLongPress = useCallback(
    async (coordinate: { latitude: number; longitude: number }) => {
      // Quick Pin feature - long press opens logger
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setSelectedCoordinate(coordinate);
      await geocodeLocation(coordinate.latitude, coordinate.longitude);
      setIsKnockLoggerVisible(true);
    },
    [geocodeLocation]
  );

  const handleFabPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Get current location for knock
    const currentLoc = await getCurrentLocation();
    if (currentLoc) {
      setSelectedCoordinate({
        latitude: currentLoc.latitude,
        longitude: currentLoc.longitude,
      });
    }
    
    setIsKnockLoggerVisible(true);
  }, [getCurrentLocation]);

  const handleKnockComplete = useCallback((outcome: KnockOutcome) => {
    setIsKnockLoggerVisible(false);
    setSelectedCoordinate(null);
    setKnockCount((prev) => prev + 1);

    // Show brief success feedback
    if (outcome === 'signup') {
      // Could trigger celebration animation here
    }
  }, []);

  const toggleRapidMode = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRapidMode((prev) => !prev);
  }, []);

  const handleSyncPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pendingCount > 0) {
      triggerSync();
    } else {
      Alert.alert('All Synced', 'No pending items to sync');
    }
  }, [pendingCount, triggerSync]);

  // ============ RENDER ============

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Territory</Text>
          <Text style={styles.headerSubtitle}>{knockCount} knocks today</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Sync Status */}
          <TouchableOpacity
            style={[
              styles.syncButton,
              { backgroundColor: syncStatus.statusColor + '20' },
            ]}
            onPress={handleSyncPress}
          >
            <Ionicons
              name={
                syncStatus.isSyncing
                  ? 'sync'
                  : isOnline
                  ? 'cloud-done'
                  : 'cloud-offline'
              }
              size={18}
              color={syncStatus.statusColor}
            />
            {pendingCount > 0 && (
              <Text
                style={[styles.syncText, { color: syncStatus.statusColor }]}
              >
                {pendingCount}
              </Text>
            )}
          </TouchableOpacity>

          {/* Rapid Mode Toggle */}
          <TouchableOpacity
            style={[
              styles.rapidModeButton,
              isRapidMode && styles.rapidModeButtonActive,
            ]}
            onPress={toggleRapidMode}
          >
            <Ionicons
              name="flash"
              size={18}
              color={isRapidMode ? '#FFC107' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <AdvancedKnockMap
          currentLocation={location}
          heatmapData={MOCK_HEATMAP_DATA}
          showHeatmap={false}
          onMapPress={handleMapPress}
          onMapLongPress={handleMapLongPress}
          onPinPress={(pin) => {
            // Could open pin details modal
            console.log('Pin pressed:', pin);
          }}
        />

        {/* Location Loading Indicator */}
        {locationLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        )}

        {/* Location Error */}
        {locationError && (
          <TouchableOpacity
            style={styles.errorBanner}
            onPress={requestPermission}
          >
            <Ionicons name="warning" size={18} color="#F44336" />
            <Text style={styles.errorText}>{locationError}</Text>
          </TouchableOpacity>
        )}

        {/* Rapid Mode Indicator */}
        {isRapidMode && (
          <View style={styles.rapidModeIndicator}>
            <Ionicons name="flash" size={16} color="#FFC107" />
            <Text style={styles.rapidModeIndicatorText}>
              Rapid Mode - Tap map to log
            </Text>
          </View>
        )}
      </View>

      {/* FAB - Log Knock Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Knock Logger Modal */}
      <KnockLogger
        visible={isKnockLoggerVisible}
        location={
          selectedCoordinate
            ? { ...selectedCoordinate, timestamp: Date.now() }
            : location
        }
        address={address}
        territoryId={territoryId}
        repId={repId}
        onClose={() => {
          setIsKnockLoggerVisible(false);
          setSelectedCoordinate(null);
        }}
        onComplete={handleKnockComplete}
        isRapidMode={isRapidMode}
      />
    </SafeAreaView>
  );
};

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rapidModeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rapidModeButtonActive: {
    backgroundColor: '#FFF8E1',
  },

  // Map
  mapContainer: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    fontSize: 13,
    color: '#666',
  },
  errorBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFEBEE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#F44336',
  },
  rapidModeIndicator: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rapidModeIndicatorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#F57C00',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default MapLogScreen;
