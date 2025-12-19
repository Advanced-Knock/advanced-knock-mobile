/**
 * MAP SCREEN - Route & Location View
 * 
 * Pattern: SCREEN × MAP × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useJoy } from '../contexts/JoyContext';
import { Icons } from '../utils/icons';

export default function MapScreen() {
  const { triggerEmoji } = useJoy();
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    triggerEmoji();
    
    // Gentle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(iconScale, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(iconRotate, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(iconScale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(iconRotate, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Map</Text>
          <Icons.map size={24} color="#a855f7" style={{ marginLeft: 8 }} />
        </View>
        <Text style={styles.subtitle}>Your route & locations</Text>
      </View>
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={{
            transform: [
              { scale: iconScale },
              { rotate: rotation },
            ],
          }}
        >
          <Icon name="map" size={64} color="#a855f7" />
        </Animated.View>
        <Text style={styles.placeholderText}>Map View Coming Soon</Text>
        <Text style={styles.placeholderSubtext}>
          View your knocking route and locations
        </Text>
        <Text style={styles.joyText}>The joy is in the journey</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 24,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  joyText: {
    fontSize: 16,
    color: '#a855f7',
    marginTop: 24,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

