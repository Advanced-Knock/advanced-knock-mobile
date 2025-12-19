/**
 * LEAD DETAIL SCREEN - View Lead Details
 * 
 * Pattern: SCREEN × DETAIL × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { getLeadById } from '../services/storage';
import type { Lead } from '../types/lead';
import { useJoy } from '../contexts/JoyContext';
import { Icons } from '../utils/icons';

type RoutePropType = RouteProp<RootStackParamList, 'LeadDetail'>;

export default function LeadDetailScreen() {
  const route = useRoute<RoutePropType>();
  const { leadId } = route.params;
  const [lead, setLead] = useState<Lead | null>(null);
  const { celebrate, triggerEmoji } = useJoy();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLead();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 3,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    triggerEmoji();
  }, [leadId]);

  useEffect(() => {
    if (lead) {
      if (lead.status === 'closed') {
        celebrate('close');
      } else if (lead.status === 'demo') {
        celebrate('demo');
      }
    }
  }, [lead?.status]);

  const loadLead = async () => {
    const foundLead = await getLeadById(leadId);
    setLead(foundLead);
  };

  if (!lead) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#6366f1';
      case 'contacted': return '#10b981';
      case 'demo': return '#f59e0b';
      case 'closed': return '#ef4444';
      case 'lost': return '#9ca3af';
      default: return '#9ca3af';
    }
  };

  const StatusIcon = lead.status === 'closed' ? Icons.close : 
                     lead.status === 'demo' ? Icons.demo : 
                     lead.status === 'contacted' ? Icons.talk : Icons.star;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.statusBadge,
              { 
                backgroundColor: getStatusColor(lead.status),
                transform: [{ scale: badgeScale }],
              },
            ]}
          >
            <Text style={styles.statusText}>
              {lead.status} {statusEmoji}
            </Text>
          </Animated.View>
          <Text style={styles.name}>{lead.name}</Text>
          <View style={styles.addressRow}>
            <Text style={styles.address}>{lead.address}</Text>
            <Icons.address size={16} color="#9ca3af" style={{ marginLeft: 6 }} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Icons.phone size={16} color="#6366f1" />
          </View>
          {lead.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#6366f1" />
              <Text style={styles.infoText}>{lead.phone}</Text>
            </View>
          )}
          {lead.email && (
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#6366f1" />
              <Text style={styles.infoText}>{lead.email}</Text>
            </View>
          )}
        </View>

        {lead.notes && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Icons.notes size={16} color="#6366f1" />
            </View>
            <Text style={styles.notes}>{lead.notes}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline ⏰</Text>
          <View style={styles.timelineItem}>
            <Icon name="schedule" size={20} color="#9ca3af" />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Created</Text>
              <Text style={styles.timelineValue}>
                {new Date(lead.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Icon name="update" size={20} color="#9ca3af" />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Last Updated</Text>
              <Text style={styles.timelineValue}>
                {new Date(lead.updatedAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
  },
  notes: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 16,
    color: '#111827',
  },
});

