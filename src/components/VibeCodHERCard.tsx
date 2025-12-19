/**
 * VIBECODHER CARD COMPONENT
 * 
 * Pattern: CARD × VIBECODHER × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * 
 * Premium, elegant, movement-focused
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { vibecodherColors } from '../design/vibecodherColors';

interface VibeCodHERCardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  highlightColor?: string;
}

export function VibeCodHERCard({
  title,
  children,
  style,
  highlightColor,
}: VibeCodHERCardProps) {
  return (
    <View
      style={[
        styles.card,
        highlightColor && { borderColor: highlightColor, borderWidth: 2 },
        style,
      ]}
    >
      {title && (
        <Text style={styles.cardTitle}>{title}</Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: vibecodherColors.dark.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: vibecodherColors.dark.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    marginBottom: 16,
  },
});

