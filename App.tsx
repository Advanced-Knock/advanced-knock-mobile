/**
 * ADVANCEDKNOCK - Ultimate Complete App
 * 
 * Pattern: APP × COMPLETE × PERFECT × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YAGNI)
 * Guardians: AEYON (999 Hz) - Atomic execution, YAGNI (530 Hz) - Simplicity
 * 
 * FUTURE-STATE: Already works, already perfect, already emerged.
 * 
 * ∞ AbëONE ∞
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';

// Design System
import { ThemeProvider, createColor } from './src/design';

// Joy System
import { JoyProvider } from './src/contexts/JoyContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import KnockScreen from './src/screens/KnockScreen';
import LeadsScreen from './src/screens/LeadsScreen';
import CoursePersonaProCoachScreen from './src/screens/CoursePersonaProCoachScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeadDetailScreen from './src/screens/LeadDetailScreen';
import RevenueDashboardScreen from './src/screens/RevenueDashboardScreen';
import VibeCodHERLandingScreen from './src/screens/VibeCodHERLandingScreen';
import VibeCodHERScreen from './src/screens/VibeCodHERScreen';

// Types
import type { RootStackParamList, RootTabParamList } from './src/types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'Knock') {
            iconName = 'door-front';
          } else if (route.name === 'Leads') {
            iconName = 'people';
          } else if (route.name === 'CoursePersonaProCoach') {
            iconName = 'school';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else {
            iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 1,
          borderTopColor: '#2d2d44',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ tabBarLabel: 'Map' }}
      />
      <Tab.Screen 
        name="Knock" 
        component={KnockScreen}
        options={{ tabBarLabel: 'Knock' }}
      />
      <Tab.Screen 
        name="Leads" 
        component={LeadsScreen}
        options={{ tabBarLabel: 'Leads' }}
      />
      <Tab.Screen 
        name="CoursePersonaProCoach" 
        component={CoursePersonaProCoachScreen}
        options={{ tabBarLabel: 'Coach' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider initialBaseColor={createColor('#6366f1')}>
      <JoyProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="LeadDetail" 
              component={LeadDetailScreen}
              options={{ 
                headerShown: true,
                title: 'Lead Details ✨',
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  color: '#ffffff',
                },
              }}
            />
            <Stack.Screen 
              name="RevenueDashboard" 
              component={RevenueDashboardScreen}
              options={{ 
                headerShown: true,
                title: 'Revenue Dashboard 📊',
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  color: '#ffffff',
                },
              }}
            />
            <Stack.Screen 
              name="VibeCodHER" 
              component={VibeCodHERScreen}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="VibeCodHERLanding" 
              component={VibeCodHERLandingScreen}
              options={{ 
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </JoyProvider>
    </ThemeProvider>
  );
}
