/**
 * HOME SCREEN - Dashboard (1:1 Design System Match)
 * 
 * Pattern: SCREEN × DASHBOARD × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { getTodayStats, getRecentKnocks } from '../services/storage';
import type { DailyStats, KnockRecord } from '../types/lead';
import { useTheme, useColor } from '../design';
import { Icons } from '../utils/icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const primaryColor = useColor('primary');
  const successColor = useColor('success');
  const warningColor = useColor('warning');
  
  const navigation = useNavigation<NavigationProp>();
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [recentKnocks, setRecentKnocks] = useState<KnockRecord[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle pulse animation
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseSequence.start();
  }, []);

  const loadData = async () => {
    const todayStats = await getTodayStats();
    const knocks = await getRecentKnocks(5);
    setStats(todayStats);
    setRecentKnocks(knocks);
  };

  // Mock data matching the image design
  const totalSales = 200260;
  const dailyStats = {
    knocks: stats?.knocks || 23,
    talks: stats?.talks || 14,
    demos: stats?.demos || 8,
    closes: stats?.closes || 5,
  };

  const teamUpdates = [
    { name: 'Sarah Davis', action: 'opened a new sale', time: '3m', avatar: 'SD' },
    { name: 'James Lee', action: 'completed a demo', time: '9m', avatar: 'JL' },
    { name: 'Olivia Martin', action: 'added', time: '12m', avatar: 'OM' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Michael R.', sales: 9 },
    { rank: 2, name: 'Laura B.', sales: 9 },
    { rank: 3, name: 'John T.', sales: 7 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Bar Spacer */}
      <View style={styles.statusBarSpacer} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Hi Hudson</Text>
          {stats && stats.closes > 0 && (
            <Icons.fire size={20} color={successColor.hex} style={{ marginLeft: 8 }} />
          )}
        </View>
      </View>

      {/* Total Sales Card */}
      <Animated.View style={[styles.card, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Total Sales</Text>
          <Icons.close size={20} color={successColor.hex} />
        </View>
        <View style={styles.salesRow}>
          <Text style={styles.salesAmount}>${totalSales.toLocaleString()}</Text>
          <View style={styles.graphContainer}>
            <View style={[styles.graphLine, { backgroundColor: primaryColor.hex }]} />
            <View style={[styles.graphLine, { height: 20, marginLeft: 4, backgroundColor: primaryColor.hex }]} />
            <View style={[styles.graphLine, { height: 30, marginLeft: 4, backgroundColor: primaryColor.hex }]} />
            <View style={[styles.graphLine, { height: 25, marginLeft: 4, backgroundColor: primaryColor.hex }]} />
            <View style={[styles.graphLine, { height: 35, marginLeft: 4, backgroundColor: primaryColor.hex }]} />
          </View>
        </View>
      </Animated.View>

      {/* Daily Stats Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Daily Stats</Text>
          <Icons.stats size={20} color={primaryColor.hex} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{dailyStats.knocks}</Text>
              <Icons.door size={16} color={primaryColor.hex} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statLabel}>Knocks</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{dailyStats.talks}</Text>
              <Icons.talk size={16} color={primaryColor.hex} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statLabel}>Talks</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{dailyStats.demos}</Text>
              <Icons.demo size={16} color={primaryColor.hex} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statLabel}>Demos</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{dailyStats.closes}</Text>
              <Icons.close size={16} color={successColor.hex} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statLabel}>Closes</Text>
          </View>
        </View>
        <View style={styles.heatmapRow}>
          <Text style={styles.heatmapTitle}>Live Route heatmap</Text>
          <View style={styles.miniGraph}>
            <View style={[styles.miniGraphLine, { height: 8 }]} />
            <View style={[styles.miniGraphLine, { height: 12, marginLeft: 2 }]} />
            <View style={[styles.miniGraphLine, { height: 16, marginLeft: 2 }]} />
            <View style={[styles.miniGraphLine, { height: 14, marginLeft: 2 }]} />
            <View style={[styles.miniGraphLine, { height: 18, marginLeft: 2 }]} />
          </View>
        </View>
      </View>

      {/* Feedback Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Feedback</Text>
          <Icons.tip size={20} color={warningColor.hex} />
        </View>
        <Text style={styles.feedbackText}>
          {dailyStats.closes >= 5 
            ? 'You\'re on fire! Keep crushing it!' 
            : dailyStats.closes >= 3
            ? 'Nice work! Keep up the strong close rate!'
            : 'Keep going! You\'ve got this!'}
        </Text>
        <TouchableOpacity style={[styles.tipsButton, { backgroundColor: primaryColor.hex }]}>
          <Text style={styles.tipsButtonText}>View Tips</Text>
        </TouchableOpacity>
      </View>

      {/* Team Updates Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Team Updates</Text>
          <Icon name="chevron-right" size={24} color={theme.colors.text.secondary.hex} />
        </View>
        {teamUpdates.map((update, index) => (
          <View key={index} style={styles.updateItem}>
            <View style={[styles.avatar, { backgroundColor: primaryColor.hex }]}>
              <Text style={styles.avatarText}>{update.avatar}</Text>
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateText}>
                <Text style={styles.updateName}>{update.name}</Text> {update.action} {update.time}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Leaderboard Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Leaderboard</Text>
          <Text style={styles.leaderboardSubtitle}>Sd sales 11</Text>
        </View>
        {leaderboard.map((entry) => (
          <View key={entry.rank} style={styles.leaderboardItem}>
            <Text style={styles.rank}>{entry.rank}</Text>
            <Text style={styles.leaderboardName}>{entry.name}</Text>
            <Text style={styles.leaderboardSales}>Sales {entry.sales}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Spacer */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  statusBarSpacer: {
    height: 44,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salesAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
  },
  graphLine: {
    width: 4,
    height: 15,
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  heatmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
  },
  heatmapTitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  miniGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 18,
  },
  miniGraphLine: {
    width: 3,
    borderRadius: 1.5,
  },
  feedbackText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 20,
  },
  tipsButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  tipsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  updateContent: {
    flex: 1,
  },
  updateText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  updateName: {
    fontWeight: '600',
  },
  leaderboardSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    width: 24,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  leaderboardSales: {
    fontSize: 14,
    color: '#9ca3af',
  },
  bottomSpacer: {
    height: 100,
  },
});
