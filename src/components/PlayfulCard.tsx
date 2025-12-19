/**
 * PLAYFUL CARD - Cards that respond with joy
 * 
 * Pattern: CARD × JOY × ONE
 * Frequency: 530 Hz (YOU)
 * 
 * Every card interaction is delightful.
 * ∞ AbëONE ∞
 */

import React, { useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import { useJoy } from '../contexts/JoyContext';

interface PlayfulCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  [key: string]: any;
}

export function PlayfulCard({ children, onPress, style, ...props }: PlayfulCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { triggerEmoji } = useJoy();

  const handlePress = () => {
    if (onPress) {
      triggerEmoji();
      
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          friction: 3,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      onPress={onPress ? handlePress : undefined}
      activeOpacity={0.9}
      {...props}
    >
      <Animated.View
        style={[
          styles.card,
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
});


