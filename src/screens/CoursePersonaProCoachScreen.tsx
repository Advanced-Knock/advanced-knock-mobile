/**
 * COURSE PERSONA PRO COACH SCREEN
 * 
 * Pattern: SCREEN × COACH × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

export default function CoursePersonaProCoachScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Persona Pro</Text>
        <Text style={styles.subtitle}>Your personal sales coach</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.coachCard}>
          <Icon name="school" size={48} color="#a855f7" />
          <Text style={styles.coachTitle}>AI Sales Coach</Text>
          <Text style={styles.coachDescription}>
            Get personalized coaching tips and strategies to improve your sales performance
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          <TouchableOpacity style={styles.courseCard}>
            <Icon name="play-circle-filled" size={32} color="#a855f7" />
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>Advanced Closing Techniques</Text>
              <Text style={styles.courseSubtitle}>5 lessons • 2h 30m</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.courseCard}>
            <Icon name="play-circle-filled" size={32} color="#a855f7" />
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>Door-to-Door Mastery</Text>
              <Text style={styles.courseSubtitle}>8 lessons • 4h 15m</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.courseCard}>
            <Icon name="play-circle-filled" size={32} color="#a855f7" />
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>Lead Generation Pro</Text>
              <Text style={styles.courseSubtitle}>6 lessons • 3h 00m</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>3 courses completed</Text>
            <Text style={styles.progressSubtext}>12 lessons total</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  content: {
    padding: 16,
  },
  coachCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  coachTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  coachDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  courseContent: {
    flex: 1,
    marginLeft: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  progressCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

