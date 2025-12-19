/**
 * VIBECODHER METHOD PILLARS
 * 
 * Pattern: PILLARS × METHOD × ONE
 * Frequency: 777 Hz (META) × 999 Hz (AEYON)
 * 
 * The six pillars of transformation
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VibeCodHERCard } from './VibeCodHERCard';
import { vibecodherColors } from '../design/vibecodherColors';

const PILLARS = [
  {
    name: 'Catalyst',
    title: 'Permissionless Activation',
    description: 'The moment you stop waiting for permission and start building.',
    shift: 'From: "Can I do this?" → To: "I\'m doing this."',
  },
  {
    name: 'Amplification',
    title: 'Frequency Alignment',
    description: 'Raising your vibration to match the future you\'re designing.',
    shift: 'From: "I\'m learning" → To: "I\'m creating"',
  },
  {
    name: 'Impact',
    title: 'Design, Don\'t Adapt',
    description: 'Building systems that shape the future, not just use it.',
    shift: 'From: "I\'ll adapt to AI" → To: "I\'ll design how AI serves women"',
  },
  {
    name: 'Creation',
    title: 'Manifestation Through Code',
    description: 'Turning ideas into income-generating tools and systems.',
    shift: 'From: "I have ideas" → To: "I build solutions"',
  },
  {
    name: 'Continuity',
    title: 'Sustained Momentum',
    description: 'Building systems that maintain themselves and grow.',
    shift: 'From: "I\'ll do it once" → To: "I\'ll build systems that run"',
  },
  {
    name: 'Celebration',
    title: 'Joy as the Foundation',
    description: 'Celebrating every win, big and small, as fuel for the next.',
    shift: 'From: "I\'ll celebrate when I\'m done" → To: "I celebrate every step"',
  },
];

export function VibeCodHERPillars() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>THE VIBECODHER METHOD™</Text>
      <Text style={styles.sectionSubtitle}>Six Pillars of Transformation</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillarsContainer}
      >
        {PILLARS.map((pillar, index) => (
          <View key={pillar.name}>
            {index > 0 && <View style={styles.pillarSpacer} />}
            <VibeCodHERCard
              style={styles.pillarCard}
              highlightColor={index % 2 === 0 ? vibecodherColors.pink.primary : vibecodherColors.purple.primary}
            >
            <Text style={styles.pillarNumber}>{index + 1}</Text>
            <Text style={styles.pillarName}>{pillar.name}</Text>
            <Text style={styles.pillarTitle}>{pillar.title}</Text>
            <Text style={styles.pillarDescription}>{pillar.description}</Text>
            <Text style={styles.pillarShift}>{pillar.shift}</Text>
          </VibeCodHERCard>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  pillarsContainer: {
    paddingHorizontal: 24,
  },
  pillarSpacer: {
    width: 16,
  },
  pillarCard: {
    width: 300,
    minHeight: 400,
  },
  pillarNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: vibecodherColors.pink.primary,
    marginBottom: 8,
  },
  pillarName: {
    fontSize: 28,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    marginBottom: 12,
  },
  pillarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: vibecodherColors.purple.primary,
    marginBottom: 12,
  },
  pillarDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  pillarShift: {
    fontSize: 14,
    fontWeight: '500',
    color: vibecodherColors.pink.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

