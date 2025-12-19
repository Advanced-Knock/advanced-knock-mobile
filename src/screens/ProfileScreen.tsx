/**
 * PROFILE SCREEN - User Profile
 * 
 * Pattern: SCREEN × PROFILE × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useJoy } from '../contexts/JoyContext';
import { PlayfulButton } from '../components/JoyEngine';
import { Icons } from '../utils/icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { triggerEmoji } = useJoy();
  const avatarScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Gentle pulse on avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAvatarPress = () => {
    triggerEmoji();
    Animated.sequence([
      Animated.spring(avatarScale, {
        toValue: 1.2,
        friction: 2,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleAvatarPress}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              styles.avatar,
              {
                transform: [
                  { scale: Animated.multiply(avatarScale, pulseAnim) },
                ],
              },
            ]}
          >
            <Text style={styles.avatarText}>H</Text>
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.name}>Hudson</Text>
        <Text style={styles.email}>hudson@advancedknock.com</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
            }}
          >
            <Icons.edit size={24} color="#a855f7" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
            }}
          >
            <Icons.settings size={24} color="#a855f7" />
            <Text style={styles.menuText}>Settings</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
            }}
          >
            <Icons.notifications size={24} color="#a855f7" />
            <Text style={styles.menuText}>Notifications</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
              navigation.navigate('RevenueDashboard');
            }}
          >
            <Icons.revenue size={24} color="#10b981" />
            <Text style={styles.menuText}>Revenue Dashboard</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
              navigation.navigate('VibeCodHERLanding');
            }}
          >
            <Icon name="favorite" size={24} color="#FF69B4" />
            <Text style={styles.menuText}>VibeCodHER Movement</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
            }}
          >
            <Icons.help size={24} color="#a855f7" />
            <Text style={styles.menuText}>Help Center</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
          <PlayfulButton
            style={styles.menuItem}
            onPress={() => {
              triggerEmoji();
            }}
          >
            <Icons.email size={24} color="#a855f7" />
            <Text style={styles.menuText}>Contact Support</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" />
          </PlayfulButton>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
            <Icon name="logout" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#9ca3af',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
});

