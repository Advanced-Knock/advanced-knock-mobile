/**
 * KNOCK SCREEN - Record Knocks
 * 
 * Pattern: SCREEN × FORM × ONE × STELLAR
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Design: MINIMAL CODE × MAXIMUM IMPACT
 * ∞ AbëONE ∞
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { saveKnock, saveLead } from '../services/storage';
import type { KnockRecord } from '../types/lead';
import { JoyEngine, PlayfulButton, EmojiReaction } from '../components/JoyEngine';
import { PlayfulInput } from '../components/PlayfulInput';
import { Icons } from '../utils/icons';

export default function KnockScreen() {
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<'no-answer' | 'talk' | 'demo' | 'close'>('no-answer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [celebrate, setCelebrate] = useState(false);
  const [emojiTrigger, setEmojiTrigger] = useState(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }

    const knockRecord: KnockRecord = {
      id: Date.now().toString(),
      address: address.trim(),
      result,
      notes: notes.trim(),
      timestamp: Date.now(),
    };

    if (name.trim() && (result === 'talk' || result === 'demo' || result === 'close')) {
      const lead = {
        id: Date.now().toString(),
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim() || undefined,
        status: result === 'close' ? 'closed' as const : 
                result === 'demo' ? 'demo' as const : 'contacted' as const,
        notes: notes.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveLead(lead);
      knockRecord.leadId = lead.id;
    }

    await saveKnock(knockRecord);

    // TRIGGER THE JOY!
    setCelebrate(true);
    setEmojiTrigger(prev => prev + 1);

    // Delay the alert so celebration can play
    setTimeout(() => {
      Alert.alert('Success', 'Knock recorded!', [
        { text: 'OK', onPress: () => {
          setAddress('');
          setNotes('');
          setName('');
          setPhone('');
          setResult('no-answer');
          setCelebrate(false);
        }}
      ]);
    }, 500);
  };

  const ResultButton = ({ value, label, icon, color }: {
    value: 'no-answer' | 'talk' | 'demo' | 'close';
    label: string;
    icon: keyof typeof Icon.glyphMap;
    color: string;
  }) => {
    const isActive = result === value;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      setResult(value);
      setEmojiTrigger(prev => prev + 1);
      
      // Bounce animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
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
    };

    return (
      <TouchableOpacity
        style={[styles.resultButton, isActive && { backgroundColor: color, borderColor: color }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.resultButtonInner,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.iconWrapper, isActive && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Icon name={icon} size={20} color={isActive ? '#fff' : color} />
          </View>
          <Text style={[styles.resultButtonText, isActive && styles.resultButtonTextActive]}>
            {label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradientBg} />
      <JoyEngine 
        trigger={celebrate} 
        type={result === 'close' ? 'close' : result === 'demo' ? 'demo' : result === 'talk' ? 'talk' : 'success'}
        onComplete={() => setCelebrate(false)}
      />
      <EmojiReaction trigger={emojiTrigger > 0} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <Text style={styles.title}>Record Knock</Text>
            <Text style={styles.subtitle}>Track your door-to-door success</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Address</Text>
            <PlayfulInput
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main Street"
              icon="location-on"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Result</Text>
            <View style={styles.resultGrid}>
              <ResultButton value="no-answer" label="No Answer" icon="door-front" color="#6b7280" />
              <ResultButton value="talk" label="Talk" icon="chat" color="#3b82f6" />
              <ResultButton value="demo" label="Demo" icon="show-chart" color="#f59e0b" />
              <ResultButton value="close" label="Close" icon="check-circle" color="#10b981" />
            </View>
          </View>

          {(result === 'talk' || result === 'demo' || result === 'close') && (
            <View style={styles.card}>
              <PlayfulInput
                value={name}
                onChangeText={setName}
                placeholder="Contact name"
                icon="person"
                style={{ marginBottom: 12 }}
              />
              <PlayfulInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                icon="phone"
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
            />
          </View>

          <PlayfulButton 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Knock</Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </PlayfulButton>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#1a1a3e',
    opacity: 0.6,
  },
  scroll: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '400',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 100,
    textAlignVertical: 'top',
    fontWeight: '400',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 2,
  },
  resultButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  resultButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9ca3af',
    flex: 1,
  },
  resultButtonTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    marginBottom: 40,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

