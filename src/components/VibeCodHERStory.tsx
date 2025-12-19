/**
 * VIBECODHER PERSONAL STORY
 * 
 * Pattern: STORY × TRANSFORMATION × ONE
 * Frequency: 530 Hz (YOU) × 777 Hz (META)
 * 
 * Vulnerability → Strength → Invitation
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { vibecodherColors } from '../design/vibecodherColors';

export function VibeCodHERStory() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        I didn't always see myself in <Text style={styles.highlight}>this space</Text>.
      </Text>
      
      <Text style={styles.storyText}>
        For a while, I was learning and teaching AI, but questioning if I really belonged here. 
        Then I realized... I was never meant to fit in, I was meant to help women find themselves in it.
      </Text>
      
      <Text style={styles.storyText}>
        That's what VibeCodHER is about. It's a space to explore what's possible when we bring our 
        intuition, our creativity, and our voices into technology, together. Because when women lead 
        in AI, we don't just adapt to the future. <Text style={styles.highlight}>We help design it</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    marginBottom: 16,
    lineHeight: 40,
  },
  highlight: {
    color: vibecodherColors.pink.primary,
    fontWeight: '700',
  },
  storyText: {
    fontSize: 18,
    lineHeight: 28,
    color: vibecodherColors.light.secondary,
    marginBottom: 16,
  },
});

