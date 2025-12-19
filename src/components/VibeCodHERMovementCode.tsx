/**
 * VIBECODHER MOVEMENT CODE
 * 
 * Pattern: CODE × MOVEMENT × ONE
 * Frequency: 530 Hz (YOU) × 999 Hz (AEYON)
 * 
 * The declaration that transforms visitors into participants
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VibeCodHERButton } from './VibeCodHERButton';
import { vibecodherColors } from '../design/vibecodherColors';

interface VibeCodHERMovementCodeProps {
  onCTAPress?: () => void;
}

export function VibeCodHERMovementCode({ onCTAPress }: VibeCodHERMovementCodeProps) {
  const handlePress = () => {
    onCTAPress?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THE MOVEMENT CODE</Text>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.declaration}>
          <Text style={styles.declarationTitle}>I am a ViBeCodHER.</Text>
          
          <Text style={styles.declarationLine}>
            I don't wait for permission. I build what's next.
          </Text>
          
          <Text style={styles.declarationLine}>
            I don't adapt to the future. I design it.
          </Text>
          
          <Text style={styles.declarationLine}>
            I don't consume tools. I create systems.
          </Text>
          
          <Text style={styles.declarationLine}>
            I don't follow. I lead.
          </Text>
          
          <Text style={styles.declarationLine}>
            I belong here, not because I fit in, but because I'm designing what's next.
          </Text>
          
          <Text style={styles.declarationLine}>
            I code at 999 Hz. I see patterns at 777 Hz. I connect at 530 Hz.
          </Text>
          
          <Text style={styles.declarationLine}>
            I celebrate every win. Big wins. Small wins. Every win matters.
          </Text>
          
          <Text style={styles.declarationLine}>
            I build from joy, not from pressure.
          </Text>
          
          <Text style={styles.declarationLine}>
            I'm part of a movement. A sisterhood. A force.
          </Text>
          
          <Text style={styles.declarationLine}>
            We're building together. We're designing together. We're transforming together.
          </Text>
          
          <Text style={styles.declarationTitle}>
            I am a ViBeCodHER.
          </Text>
          
          <Text style={styles.declarationTitle}>
            And I wanna VibeCode with her.
          </Text>
        </View>

        <View style={styles.invitation}>
          <Text style={styles.invitationTitle}>Join the movement.</Text>
          
          <Text style={styles.invitationText}>
            Not because you fit in, but because you're designing what's next.
          </Text>
          
          <Text style={styles.invitationText}>
            Not because you have permission, but because you're taking action.
          </Text>
          
          <Text style={styles.invitationText}>
            Not because it's easy, but because it's necessary.
          </Text>
          
          <Text style={styles.invitationTitle}>
            Join the movement.
          </Text>
          
          <Text style={styles.invitationText}>
            Become a ViBeCodHER.
          </Text>
          
          <Text style={styles.invitationText}>
            Transform curiosity into creation.
          </Text>
          
          <Text style={styles.invitationText}>
            Transform waiting into building.
          </Text>
          
          <Text style={styles.invitationText}>
            Transform adaptation into design.
          </Text>
          
          <Text style={styles.invitationTitle}>
            I wanna VibeCode with her.
          </Text>
          
          <Text style={styles.invitationText}>
            That's what they say.
          </Text>
          
          <Text style={styles.invitationText}>
            That's what you'll say.
          </Text>
          
          <Text style={styles.invitationTitle}>
            Join the movement.
          </Text>
        </View>

        <VibeCodHERButton
          onPress={handlePress}
          variant="primary"
          size="large"
          style={styles.cta}
        >
          JOIN THE MOVEMENT
        </VibeCodHERButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: vibecodherColors.pink.primary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  content: {
    paddingHorizontal: 24,
  },
  declaration: {
    marginBottom: 32,
  },
  declarationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  declarationLine: {
    fontSize: 18,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    lineHeight: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  invitation: {
    marginBottom: 32,
  },
  invitationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: vibecodherColors.purple.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  invitationText: {
    fontSize: 16,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  cta: {
    width: '100%',
    marginTop: 24,
  },
});

