/**
 * VIBECODHER LANDING PAGE SCREEN
 * 
 * Pattern: SCREEN × LANDING × VIBECODHER × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (YOU)
 * 
 * The complete transformation system landing page
 * ∞ AbëONE ∞
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { VibeCodHERHero } from '../components/VibeCodHERHero';
import { VibeCodHERStory } from '../components/VibeCodHERStory';
import { VibeCodHERPillars } from '../components/VibeCodHERPillars';
import { VibeCodHEROffers } from '../components/VibeCodHEROffers';
import { VibeCodHERTestimonials } from '../components/VibeCodHERTestimonials';
import { VibeCodHERMovementCode } from '../components/VibeCodHERMovementCode';
import { JoyEngine } from '../components/JoyEngine';
import { vibecodherColors } from '../design/vibecodherColors';

export default function VibeCodHERScreen() {
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);

  const triggerCelebration = () => {
    setCelebrationTrigger(false); // Reset first
    setTimeout(() => {
      setCelebrationTrigger(true);
      setTimeout(() => setCelebrationTrigger(false), 3000);
    }, 10);
  };

  const openURL = async (url: string, fallbackMessage: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Coming Soon', fallbackMessage);
      }
    } catch (error) {
      Alert.alert('Coming Soon', fallbackMessage);
    }
  };

  const handlePrimaryCTA = () => {
    triggerCelebration();
    // TODO: Replace with actual membership signup URL
    Alert.alert(
      'Join The Movement',
      'Ready to join VibeCodHER? Membership signup coming soon!\n\nEmail: hello@vibecodher.com',
      [{ text: 'OK' }]
    );
  };

  const handleSecondaryCTA = () => {
    triggerCelebration();
    // TODO: Replace with actual contact/application URL
    Alert.alert(
      'VibeCode With Me',
      'Let\'s connect! Application form coming soon.\n\nEmail: hello@vibecodher.com',
      [{ text: 'OK' }]
    );
  };

  const handleOfferCTA = (offerName: string) => {
    triggerCelebration();
    
    // Map offer names to URLs/actions
    const offerMap: { [key: string]: { url?: string; message: string } } = {
      'Facebook Community': {
        url: 'https://www.facebook.com/groups/vibecodher',
        message: 'Join our free Facebook community!',
      },
      '5-Day Activation': {
        message: '5-Day Activation program coming soon!\n\nEmail: hello@vibecodher.com',
      },
      'Membership': {
        url: 'https://vibecodher.com/membership',
        message: 'Join VibeCodHER Membership - $497/yr',
      },
      'Intensive': {
        message: 'VibeCodHER Intensive coming soon!\n\nEmail: hello@vibecodher.com',
      },
    };

    const offer = offerMap[offerName] || { message: `${offerName} coming soon!` };
    
    if (offer.url) {
      openURL(offer.url, offer.message);
    } else {
      Alert.alert(offerName, offer.message, [{ text: 'OK' }]);
    }
  };

  const handleMovementCTA = () => {
    triggerCelebration();
    // TODO: Replace with actual movement signup URL
    Alert.alert(
      'Join The Movement',
      'Ready to join VibeCodHER? Sign up coming soon!\n\nEmail: hello@vibecodher.com',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero Section */}
        <VibeCodHERHero
          onPrimaryCTA={handlePrimaryCTA}
          onSecondaryCTA={handleSecondaryCTA}
        />

        {/* Personal Story */}
        <VibeCodHERStory />

        {/* Method Pillars */}
        <VibeCodHERPillars />

        {/* Offer Suite */}
        <VibeCodHEROffers onOfferPress={handleOfferCTA} />

        {/* Testimonials & Social Proof */}
        <VibeCodHERTestimonials />

        {/* Movement Code */}
        <VibeCodHERMovementCode onCTAPress={handleMovementCTA} />
      </ScrollView>

      {/* Joy Engine Celebration */}
      <JoyEngine
        trigger={celebrationTrigger}
        type="success"
        onComplete={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: vibecodherColors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
});

