/**
 * VIBECODHER BUTTON COMPONENT
 * 
 * Pattern: BUTTON × VIBECODHER × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * 
 * Bold, action-oriented, permissionless
 * ∞ AbëONE ∞
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { vibecodherColors } from '../design/vibecodherColors';
import { Icons } from '../utils/icons';

interface VibeCodHERButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'medium' | 'small';
  showDiamond?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function VibeCodHERButton({
  children,
  onPress,
  variant = 'primary',
  size = 'large',
  showDiamond = true,
  style,
  textStyle,
}: VibeCodHERButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const backgroundColor = variant === 'primary' 
    ? vibecodherColors.pink.primary 
    : vibecodherColors.purple.primary;

  const paddingVertical = size === 'large' ? 16 : size === 'medium' ? 14 : 12;
  const paddingHorizontal = size === 'large' ? 32 : size === 'medium' ? 24 : 16;
  const fontSize = size === 'large' ? 18 : size === 'medium' ? 16 : 14;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.button,
          {
            backgroundColor,
            paddingVertical,
            paddingHorizontal,
            borderColor: backgroundColor,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              fontSize,
            },
            textStyle,
          ]}
        >
          {children}
          {showDiamond && <Icons.arrowRight size={16} color="#ffffff" style={{ marginLeft: 8 }} />}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

