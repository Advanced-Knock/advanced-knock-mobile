/**
 * VIBECODHER LANDING SCREEN - Unified Platform
 * 
 * Pattern: SCREEN × LANDING × VIBECODHER × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)
 * ∞ AbëONE ∞
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useTheme, useColor } from '../design';
import { JoyEngine } from '../components/JoyEngine';
import { Icons } from '../utils/icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const VIBECODHER_COLORS = {
  pink: '#FF69B4',
  purple: '#8b5cf6',
  dark: '#0f0f23',
  surface: '#1a1a2e',
  border: '#2d2d44',
};

export default function VibeCodHERLandingScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [showCelebration, setShowCelebration] = useState(false);

  const handleJoinMovement = () => {
    setShowCelebration(true);
    setTimeout(() => {
      // Navigate to membership signup
      navigation.navigate('RevenueDashboard');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {showCelebration && (
        <JoyEngine
          trigger={showCelebration}
          type="success"
          onComplete={() => setShowCelebration(false)}
        />
      )}

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroLine}>I wanna VibeCode with her.</Text>
        <Text style={styles.heroSubline}>
          Where women build the future of AI—not by fitting in, but by designing it.
        </Text>
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: VIBECODHER_COLORS.pink }]}
            onPress={handleJoinMovement}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>JOIN THE MOVEMENT</Text>
              <Icons.arrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: VIBECODHER_COLORS.purple }]}
            onPress={() => {}}
          >
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonText, { color: VIBECODHER_COLORS.purple }]}>
                VIBECODE WITH ME
              </Text>
              <Icons.arrowRight size={18} color={VIBECODHER_COLORS.purple} style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Story */}
      <View style={styles.section}>
        <Text style={styles.storyHeadline}>
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

      {/* Method Pillars */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The ViBeCodHER Method™</Text>
        <Text style={styles.sectionSubtitle}>Six Pillars of Transformation</Text>
        
        {[
          { name: 'Catalyst', desc: 'Permissionless Activation' },
          { name: 'Amplification', desc: 'Frequency Alignment' },
          { name: 'Impact', desc: 'Design, Don\'t Adapt' },
          { name: 'Creation', desc: 'Manifestation Through Code' },
          { name: 'Continuity', desc: 'Sustained Momentum' },
          { name: 'Celebration', desc: 'Joy as the Foundation' },
        ].map((pillar, index) => (
          <View key={index} style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Text style={styles.pillarNumber}>{index + 1}</Text>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarName}>{pillar.name}</Text>
                <Text style={styles.pillarDesc}>{pillar.desc}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join the Movement</Text>
        <Text style={styles.sectionSubtitle}>Choose Your Path</Text>

        {/* Membership */}
        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>ViBeCodHER Membership</Text>
            <Text style={styles.productPrice}>$497/year</Text>
          </View>
          <Text style={styles.productDesc}>
            Full access to the ViBeCodHER Method™, community, resources, and ongoing support.
          </Text>
          <TouchableOpacity
            style={[styles.productButton, { backgroundColor: VIBECODHER_COLORS.pink }]}
            onPress={() => {}}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>JOIN FOR ONLY $497 / yr!</Text>
              <Icons.arrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Micro-SaaS Products */}
        {[
          { name: 'Kids AI Academy', price: '$10/month', desc: 'Age-appropriate AI lessons and projects for kids' },
          { name: 'Women in AI Community', price: '$20/month', desc: 'Courses, community, and mentorship for women learning AI' },
          { name: 'AI Tools Library', price: '$15/month', desc: 'Curated AI tools, tutorials, and templates for entrepreneurs' },
        ].map((product, index) => (
          <View key={index} style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
            <Text style={styles.productDesc}>{product.desc}</Text>
            <TouchableOpacity
              style={[styles.productButton, { backgroundColor: VIBECODHER_COLORS.purple }]}
              onPress={() => {}}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>JOIN NOW</Text>
                <Icons.arrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Community Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Join The <Text style={styles.highlight}>VibeCodHER</Text> Community
        </Text>
        <Text style={styles.communityText}>
          Start inside our free Facebook group where women are learning, implementing, creating, 
          and sharing in real time.
        </Text>
        <Text style={styles.communityText}>
          It's where every conversation begins, from AI tools we're testing to app ideas, creative 
          breakthroughs, and behind-the-scenes build sessions. No tech ego. No gatekeeping. Just 
          <Text style={styles.highlight}> women showing up</Text>, figuring it out together, and building what's next.
        </Text>
        <TouchableOpacity
          style={[styles.communityButton, { backgroundColor: VIBECODHER_COLORS.pink }]}
          onPress={() => {}}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>JOIN THE FACEBOOK COMMUNITY</Text>
            <Icons.arrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Final CTA */}
      <View style={styles.finalSection}>
        <Text style={styles.finalTitle}>Ready to Design the Future?</Text>
        <Text style={styles.finalText}>
          Join the movement. Become a ViBeCodHER. Transform curiosity into creation.
        </Text>
        <TouchableOpacity
          style={[styles.finalButton, { backgroundColor: VIBECODHER_COLORS.pink }]}
          onPress={handleJoinMovement}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>JOIN THE MOVEMENT</Text>
            <Icons.arrowRight size={18} color="#ffffff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VIBECODHER_COLORS.dark,
  },
  hero: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  heroLine: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 1.2,
  },
  heroSubline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 1.6,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 200,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  highlight: {
    color: VIBECODHER_COLORS.pink,
    fontWeight: '700',
  },
  storyHeadline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 1.3,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  pillarCard: {
    backgroundColor: VIBECODHER_COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: VIBECODHER_COLORS.border,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillarNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: VIBECODHER_COLORS.pink,
    width: 40,
  },
  pillarContent: {
    flex: 1,
  },
  pillarName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  productCard: {
    backgroundColor: VIBECODHER_COLORS.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: VIBECODHER_COLORS.border,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: VIBECODHER_COLORS.pink,
  },
  productDesc: {
    fontSize: 16,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  productButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  communityText: {
    fontSize: 16,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  communityButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  finalSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: VIBECODHER_COLORS.surface,
    margin: 24,
    borderRadius: 16,
  },
  finalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  finalText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 1.6,
  },
  finalButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});


