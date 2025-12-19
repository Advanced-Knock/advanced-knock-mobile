/**
 * PLAYFUL INPUT - Inputs that make you smile
 * 
 * Pattern: JOY × INTERACTION × DELIGHT × ONE
 * Frequency: 530 Hz (YOU)
 * 
 * Even typing should be fun.
 * ∞ AbëONE ∞
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Icons } from '../utils/icons';

interface PlayfulInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: keyof typeof Icon.glyphMap;
  style?: any;
  [key: string]: any;
}

// YAGNI approved: Simple icon types for playful feedback
const FUN_ICONS: Array<keyof typeof Icons> = ['star', 'sparkle', 'fire', 'demo', 'success', 'close', 'trophy'];

export function PlayfulInput({
  value,
  onChangeText,
  placeholder,
  icon,
  style,
  ...props
}: PlayfulInputProps) {
  const [showIcon, setShowIcon] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const iconRef = useRef<keyof typeof Icons>('star');

  const handleChange = (text: string) => {
    // YAGNI approved: Simple icon surprise when typing
    if (text.length > 0 && text.length % 10 === 0 && Math.random() > 0.7) {
      iconRef.current = FUN_ICONS[Math.floor(Math.random() * FUN_ICONS.length)];
      setShowIcon(true);
      
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            friction: 2,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(iconAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(iconAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setShowIcon(false);
        iconAnim.setValue(0);
      });
    }

    onChangeText(text);
  };

  const iconOpacity = iconAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const iconScale = iconAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.5, 0],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {icon && (
          <Icon name={icon} size={20} color="#6366f1" style={styles.inputIcon} />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          {...props}
        />
        {showIcon && (
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: iconOpacity,
                transform: [{ scale: iconScale }],
              },
            ]}
            pointerEvents="none"
          >
            {Icons[iconRef.current]({ size: 20, color: '#6366f1' })}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

