/**
 * VIBECODHER HERO SECTION
 * 
 * Pattern: HERO × VIBECODHER × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * 
 * The irresistible identity imprint
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VibeCodHERButton } from './VibeCodHERButton';
import { vibecodherColors } from '../design/vibecodherColors';

interface VibeCodHERHeroProps {
  onPrimaryCTA: () => void;
  onSecondaryCTA: () => void;
}

export function VibeCodHERHero({
  onPrimaryCTA,
  onSecondaryCTA,
}: VibeCodHERHeroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.iconicLine}>
        I wanna VibeCode with her.
      </Text>
      
      <Text style={styles.subline}>
        Where women build the future of AI—not by fitting in, but by designing it.
      </Text>

      <View style={styles.ctaContainer}>
        <VibeCodHERButton
          onPress={onPrimaryCTA}
          variant="primary"
          size="large"
          style={styles.primaryCTA}
        >
          JOIN THE MOVEMENT
        </VibeCodHERButton>

        <View style={styles.ctaSpacer} />

        <VibeCodHERButton
          onPress={onSecondaryCTA}
          variant="secondary"
          size="large"
          style={styles.secondaryCTA}
        >
          VIBECODE WITH ME
        </VibeCodHERButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  iconicLine: {
    fontSize: 42,
    fontWeight: '700',
    color: vibecodherColors.pink.primary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 50,
  },
  subline: {
    fontSize: 20,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  ctaContainer: {
    width: '100%',
  },
  ctaSpacer: {
    height: 16,
  },
  primaryCTA: {
    width: '100%',
  },
  secondaryCTA: {
    width: '100%',
  },
});

