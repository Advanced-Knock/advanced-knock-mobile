/**
 * PLAYFUL TAB BAR - Tabs that bring joy
 * 
 * Pattern: TAB × JOY × ONE
 * Frequency: 530 Hz (YOU)
 * 
 * Even navigation should make you smile.
 * ∞ AbëONE ∞
 */

import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useJoy } from '../contexts/JoyContext';

interface PlayfulTabBarButtonProps {
  onPress: () => void;
  icon: string;
  label: string;
  isFocused: boolean;
  color: string;
  inactiveColor: string;
}

export function PlayfulTabBarButton({
  onPress,
  icon,
  label,
  isFocused,
  color,
  inactiveColor,
}: PlayfulTabBarButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { triggerEmoji } = useJoy();

  const handlePress = () => {
    triggerEmoji();
    
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        friction: 2,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.content,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Icon 
          name={icon} 
          size={24} 
          color={isFocused ? color : inactiveColor} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


