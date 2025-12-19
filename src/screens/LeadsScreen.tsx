/**
 * LEADS SCREEN - Manage Leads
 * 
 * Pattern: SCREEN × LIST × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { getAllLeads } from '../services/storage';
import type { Lead } from '../types/lead';
import { useJoy } from '../contexts/JoyContext';
import { PlayfulCard } from '../components/PlayfulCard';
import { Icons } from '../utils/icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function LeadsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const { celebrate, triggerEmoji } = useJoy();

  useEffect(() => {
    loadLeads();
    // Celebrate when leads are loaded
    if (leads.length > 0) {
      triggerEmoji();
    }
  }, [leads.length]);

  const loadLeads = async () => {
    const allLeads = await getAllLeads();
    setLeads(allLeads);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#a855f7';
      case 'contacted': return '#10b981';
      case 'demo': return '#f59e0b';
      case 'closed': return '#ef4444';
      case 'lost': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderLead = ({ item, index }: { item: Lead; index: number }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePress = () => {
      triggerEmoji();
      if (item.status === 'closed') {
        celebrate('close');
      }
      
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          friction: 2,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      navigation.navigate('LeadDetail', { leadId: item.id });
    };

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.leadItem}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.leadItemInner,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.leadContent}>
              <View style={styles.leadNameRow}>
                <Text style={styles.leadName}>{item.name}</Text>
                {item.status === 'closed' && <Icons.close size={16} color="#10b981" style={{ marginLeft: 6 }} />}
                {item.status === 'demo' && <Icons.demo size={16} color="#f59e0b" style={{ marginLeft: 6 }} />}
              </View>
              <Text style={styles.leadAddress}>{item.address}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Leads</Text>
          {leads.length > 0 && <Icons.star size={20} color="#6366f1" style={{ marginLeft: 8 }} />}
        </View>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>{leads.length} total</Text>
          {leads.filter(l => l.status === 'closed').length > 0 && <Icons.close size={16} color="#10b981" style={{ marginLeft: 6 }} />}
        </View>
      </View>

      <FlatList
        data={leads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icons.door size={48} color="#6b7280" />
            <Icon name="people" size={64} color="#6b7280" style={{ marginTop: 16 }} />
            <Text style={styles.emptyText}>No leads yet</Text>
            <Text style={styles.emptySubtext}>Start knocking to create leads</Text>
          </View>
        }
      />
    </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  leadNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  list: {
    padding: 16,
  },
  leadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  leadContent: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  leadAddress: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  leadItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});

