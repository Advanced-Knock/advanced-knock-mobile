/**
 * STATS SCREEN - Performance Analytics
 * 
 * Pattern: SCREEN × ANALYTICS × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { getStats } from '../services/storage';
import type { DailyStats } from '../types/lead';

export default function StatsScreen() {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    knocks: 0,
    talks: 0,
    demos: 0,
    closes: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const allStats = await getStats(7); // Last 7 days
    setStats(allStats);
    
    const totals = allStats.reduce((acc, stat) => ({
      knocks: acc.knocks + stat.knocks,
      talks: acc.talks + stat.talks,
      demos: acc.demos + stat.demos,
      closes: acc.closes + stat.closes,
    }), { knocks: 0, talks: 0, demos: 0, closes: 0 });
    
    setTotalStats(totals);
  };

  const StatCard = ({ label, value, icon, color }: {
    label: string;
    value: number;
    icon: string;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Icon name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Last 7 Days</Text>
      </View>

      <View style={styles.totalsSection}>
        <StatCard label="Total Knocks" value={totalStats.knocks} icon="door-front" color="#6366f1" />
        <StatCard label="Total Talks" value={totalStats.talks} icon="chat" color="#10b981" />
        <StatCard label="Total Demos" value={totalStats.demos} icon="presentation-chart" color="#f59e0b" />
        <StatCard label="Total Closes" value={totalStats.closes} icon="check-circle" color="#ef4444" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        {stats.map((stat) => (
          <View key={stat.date} style={styles.dayCard}>
            <Text style={styles.dayDate}>{new Date(stat.date).toLocaleDateString()}</Text>
            <View style={styles.dayStats}>
              <View style={styles.dayStat}>
                <Text style={styles.dayStatValue}>{stat.knocks}</Text>
                <Text style={styles.dayStatLabel}>Knocks</Text>
              </View>
              <View style={styles.dayStat}>
                <Text style={styles.dayStatValue}>{stat.talks}</Text>
                <Text style={styles.dayStatLabel}>Talks</Text>
              </View>
              <View style={styles.dayStat}>
                <Text style={styles.dayStatValue}>{stat.demos}</Text>
                <Text style={styles.dayStatLabel}>Demos</Text>
              </View>
              <View style={styles.dayStat}>
                <Text style={styles.dayStatValue}>{stat.closes}</Text>
                <Text style={styles.dayStatLabel}>Closes</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderTopWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayStat: {
    alignItems: 'center',
  },
  dayStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  dayStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});

