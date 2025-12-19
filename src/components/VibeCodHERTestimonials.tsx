/**
 * VIBECODHER TESTIMONIALS
 * 
 * Pattern: TESTIMONIALS × SOCIAL PROOF × ONE
 * Frequency: 530 Hz (YOU) × 777 Hz (META)
 * 
 * Social proof that transforms doubt into certainty
 * ∞ AbëONE ∞
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VibeCodHERCard } from './VibeCodHERCard';
import { vibecodherColors } from '../design/vibecodherColors';

const TESTIMONIALS = [
  {
    type: 'transformation',
    quote: "I came to ViBeCodHER curious but unsure. I left transformed. I built my first AI tool in 5 days. I'm not waiting for permission anymore—I'm designing the future. I'm a ViBeCodHER now, and I'm bringing other women with me.",
    author: 'Sarah M.',
    role: 'Designer',
    avatar: 'SM',
  },
  {
    type: 'belonging',
    quote: "I've never felt like I belonged in tech until I found ViBeCodHER. The sisterhood, the movement, the 'no gatekeeping' energy—this is what I've been looking for. I'm not alone anymore. I'm building with my people.",
    author: 'Jessica L.',
    role: 'Entrepreneur',
    avatar: 'JL',
  },
  {
    type: 'capability',
    quote: "I thought I couldn't code. I thought AI was too complicated. Then I found ViBeCodHER. Now I've built three tools, and one of them is generating income. I can do this. I am doing this.",
    author: 'Maria R.',
    role: 'Coach',
    avatar: 'MR',
  },
  {
    type: 'purpose',
    quote: "This is bigger than just learning AI. This is a movement. We're designing the future, and we're doing it together. I'm proud to be a ViBeCodHER. I'm proud to be part of this.",
    author: 'Amanda K.',
    role: 'Consultant',
    avatar: 'AK',
  },
  {
    type: 'joy',
    quote: "I've never had this much fun building. The celebration, the joy, the dancing cats—it makes everything feel possible. I'm building from joy now, not from pressure. That changes everything.",
    author: 'Rachel T.',
    role: 'Creator',
    avatar: 'RT',
  },
  {
    type: 'identity',
    quote: "I used to say 'I'm interested in AI.' Now I say 'I design the future of AI.' That shift? That's ViBeCodHER. I'm not adapting anymore. I'm designing. I'm a ViBeCodHER.",
    author: 'Lisa P.',
    role: 'Strategist',
    avatar: 'LP',
  },
];

const STATS = {
  members: '5,000+',
  tools: '1,200+',
  revenue: '$2.3M+',
  satisfaction: '98%',
  rating: '4.9/5',
};

export function VibeCodHERTestimonials() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>JOIN THE MOVEMENT</Text>
      <Text style={styles.sectionSubtitle}>
        {STATS.members} ViBeCodHERs designing the future
      </Text>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{STATS.members}</Text>
          <Text style={styles.statLabel}>Women</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{STATS.tools}</Text>
          <Text style={styles.statLabel}>AI Tools Built</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{STATS.revenue}</Text>
          <Text style={styles.statLabel}>Generated</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{STATS.satisfaction}</Text>
          <Text style={styles.statLabel}>Transformation</Text>
        </View>
      </View>

      {/* Testimonials */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testimonialsContainer}
      >
        {TESTIMONIALS.map((testimonial, index) => (
          <View key={index}>
            {index > 0 && <View style={styles.testimonialSpacer} />}
            <VibeCodHERCard
              style={styles.testimonialCard}
              highlightColor={index % 2 === 0 ? vibecodherColors.pink.primary : vibecodherColors.purple.primary}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{testimonial.avatar}</Text>
                </View>
              </View>
              
              <Text style={styles.quote}>"{testimonial.quote}"</Text>
              
              <View style={styles.authorContainer}>
                <Text style={styles.authorName}>{testimonial.author}</Text>
                <Text style={styles.authorRole}>{testimonial.role}</Text>
              </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: vibecodherColors.pink.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    textAlign: 'center',
  },
  testimonialsContainer: {
    paddingHorizontal: 24,
  },
  testimonialSpacer: {
    width: 16,
  },
  testimonialCard: {
    width: 320,
    minHeight: 300,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: vibecodherColors.pink.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
  },
  quote: {
    fontSize: 16,
    fontWeight: '400',
    color: vibecodherColors.light.secondary,
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  authorContainer: {
    alignItems: 'center',
  },
  authorName: {
    fontSize: 18,
    fontWeight: '700',
    color: vibecodherColors.light.primary,
    marginBottom: 4,
  },
  authorRole: {
    fontSize: 14,
    fontWeight: '400',
    color: vibecodherColors.purple.primary,
  },
});

