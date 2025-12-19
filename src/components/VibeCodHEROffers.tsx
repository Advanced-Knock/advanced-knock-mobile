/**
 * VIBECODHER OFFER SUITE
 * 
 * Pattern: OFFERS × FUNNEL × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * 
 * Complete offer suite from free to mastermind
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VibeCodHERCard } from './VibeCodHERCard';
import { VibeCodHERButton } from './VibeCodHERButton';
import { vibecodherColors } from '../design/vibecodherColors';

const OFFERS = [
  {
    name: 'Facebook Community',
    price: 'FREE',
    outcome: 'Belonging, connection, first taste',
    description: 'A sisterhood of ambitious women showing up, figuring it out together. No tech ego. No gatekeeping.',
    cta: 'JOIN THE FACEBOOK COMMUNITY',
    variant: 'secondary' as const,
  },
  {
    name: '5-Day Activation',
    price: 'FREE',
    outcome: 'First working AI tool built in 5 days',
    description: 'Stop waiting for permission. Build your first AI tool in 5 days. No coding experience required.',
    cta: 'GET THE 5-DAY ACTIVATION',
    variant: 'secondary' as const,
  },
  {
    name: 'ViBeCodHER Membership',
    price: '$497/year',
    outcome: 'Full access to the ViBeCodHER Method™',
    description: 'The complete system for women building the future of AI. Access to all six pillars, community, resources, and live sessions.',
    cta: 'JOIN FOR ONLY $497 / yr!',
    variant: 'primary' as const,
  },
  {
    name: 'ViBeCodHER Intensive',
    price: '$2,997',
    outcome: 'Complete transformation + first income-generating tool',
    description: '90 days of deep immersion. We\'ll work together to activate all six pillars and build your first income-generating tool.',
    cta: 'APPLY FOR THE INTENSIVE',
    variant: 'primary' as const,
  },
];

interface VibeCodHEROffersProps {
  onOfferPress?: (offerName: string) => void;
}

export function VibeCodHEROffers({ onOfferPress }: VibeCodHEROffersProps) {
  const handlePress = (offerName: string) => {
    onOfferPress?.(offerName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>THE OFFER SUITE</Text>
      <Text style={styles.sectionSubtitle}>From Free to Mastermind</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.offersContainer}
      >
        {OFFERS.map((offer, index) => (
          <View key={offer.name}>
            {index > 0 && <View style={styles.offerSpacer} />}
            <VibeCodHERCard
              style={styles.offerCard}
              highlightColor={offer.variant === 'primary' ? vibecodherColors.pink.primary : vibecodherColors.purple.primary}
            >
            <View style={styles.offerHeader}>
              <Text style={styles.offerName}>{offer.name}</Text>
              <Text style={styles.offerPrice}>{offer.price}</Text>
            </View>
            
            <Text style={styles.offerOutcome}>{offer.outcome}</Text>
            
            <Text style={styles.offerDescription}>{offer.description}</Text>
            
            <VibeCodHERButton
              onPress={() => handlePress(offer.name)}
              variant={offer.variant}
              size="large"
              style={styles.offerCTA}
            >
              {offer.cta}
            </VibeCodHERButton>
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
  offersContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  offerSpacer: {
    height: 16,
  },
  offerCard: {
    width: '100%',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  offerName: {
    fontSize: 24,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    flex: 1,
  },
  offerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: vibecodherColors.pink.primary,
  },
  offerOutcome: {
    fontSize: 16,
    fontWeight: '600',
    color: vibecodherColors.purple.primary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  offerDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  offerCTA: {
    width: '100%',
  },
});

