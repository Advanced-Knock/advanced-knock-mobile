/**
 * REVENUE DASHBOARD SCREEN - Micro-SaaS Platform
 * 
 * Pattern: SCREEN × DASHBOARD × REVENUE × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme, useColor } from '../design';
import { calculateRevenueMetrics, initializeProducts } from '../services/subscription';
import type { RevenueMetrics } from '../types/subscription';

const { width } = Dimensions.get('window');

export default function RevenueDashboardScreen() {
  const { theme } = useTheme();
  const primaryColor = useColor('primary');
  const successColor = useColor('success');
  const warningColor = useColor('warning');
  
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    await initializeProducts();
    const revenueMetrics = await calculateRevenueMetrics();
    setMetrics(revenueMetrics);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor.hex} />
          <Text style={styles.loadingText}>Loading revenue data...</Text>
        </View>
      </View>
    );
  }

  if (!metrics) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load revenue data</Text>
      </View>
    );
  }

  // YAGNI: Safe defaults - hardened against undefined
  const progressBarWidth = Math.min(metrics?.progressToTarget || 0, 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Revenue Dashboard</Text>
        <Text style={styles.subtitle}>Micro-SaaS Platform</Text>
      </View>

      {/* Total MRR Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Monthly Recurring Revenue</Text>
          <Icon name="trending-up" size={24} color={successColor.hex} />
        </View>
        <View style={styles.mrrRow}>
          <Text style={styles.mrrAmount}>${(metrics.monthlyRecurringRevenue || 0).toLocaleString()}</Text>
          <Text style={styles.mrrTarget}>/ ${(metrics.targetRevenue || 0).toLocaleString()}</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progressBarWidth}%`, backgroundColor: successColor.hex }]} />
        </View>
        <Text style={styles.progressText}>
          {(metrics.progressToTarget || 0).toFixed(1)}% to target
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.totalSubscribers || 0}</Text>
            <Text style={styles.metricLabel}>Total Subscribers</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>${(metrics.averageRevenuePerUser || 0).toFixed(2)}</Text>
            <Text style={styles.metricLabel}>ARPU</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{(metrics.churnRate || 0).toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Churn Rate</Text>
          </View>
        </View>
      </View>

      {/* Product Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Product Breakdown</Text>
        {metrics.productsBreakdown.map((product) => {
          // YAGNI: Safe defaults for all values
          const revenue = product.revenue || 0;
          const revenueGoal = product.revenueGoal || 0;
          const productProgress = revenueGoal > 0 ? revenue / revenueGoal : 0;
          const productProgressWidth = Math.min(productProgress * 100, 100);
          
          return (
            <View key={product.productId} style={styles.productItem}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.productName}</Text>
                <Text style={styles.productRevenue}>${revenue.toLocaleString()}</Text>
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productSubscribers}>{product.subscribers || 0} subscribers</Text>
                <Text style={styles.productGoal}>Goal: ${revenueGoal.toLocaleString()}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={[
                  styles.progressBar, 
                  { 
                    width: `${productProgressWidth}%`, 
                    backgroundColor: productProgress >= 1 ? successColor.hex : warningColor.hex 
                  }
                ]} />
              </View>
              <Text style={styles.progressText}>
                {(productProgress * 100).toFixed(1)}% of goal
              </Text>
            </View>
          );
        })}
      </View>

      {/* Revenue Forecast */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Revenue Forecast</Text>
        <View style={styles.forecastRow}>
          <View style={styles.forecastItem}>
            <Text style={styles.forecastLabel}>Current MRR</Text>
            <Text style={styles.forecastValue}>${(metrics.monthlyRecurringRevenue || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.forecastItem}>
            <Text style={styles.forecastLabel}>Target MRR</Text>
            <Text style={styles.forecastValue}>${(metrics.targetRevenue || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.forecastItem}>
            <Text style={styles.forecastLabel}>Gap</Text>
            <Text style={[
              styles.forecastValue,
              { color: (metrics.monthlyRecurringRevenue || 0) >= (metrics.targetRevenue || 0) ? successColor.hex : warningColor.hex }
            ]}>
              ${((metrics.targetRevenue || 0) - (metrics.monthlyRecurringRevenue || 0)).toLocaleString()}
            </Text>
          </View>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
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
  mrrRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  mrrAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mrrTarget: {
    fontSize: 20,
    color: '#9ca3af',
    marginLeft: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#2d2d44',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  productItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  productRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productSubscribers: {
    fontSize: 14,
    color: '#9ca3af',
  },
  productGoal: {
    fontSize: 14,
    color: '#9ca3af',
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  forecastItem: {
    alignItems: 'center',
  },
  forecastLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  forecastValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomSpacer: {
    height: 100,
  },
});

