// ============================================
// ADVANCEDKNOCK KNOCK LOGGER COMPONENT
// Guardian Jimmy | 530 Hz | Core Interaction
// Pattern: Touch targets 60x60px (98% Confidence)
// Pattern: 5-second undo window (Research-backed)
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  KnockOutcome,
  GeocodedAddress,
  Location,
  OBJECTION_TAGS,
  CALLBACK_TAGS,
  ObjectionTag,
  CallbackTag,
} from '../types';
import { useKnockStore, useLastAction } from '../stores/knockStore';

// ============ TYPES ============

interface KnockLoggerProps {
  visible: boolean;
  location: Location | null;
  address: GeocodedAddress | null;
  territoryId: string;
  repId: string;
  onClose: () => void;
  onComplete: (outcome: KnockOutcome) => void;
  isRapidMode?: boolean;
}

type FlowStep = 'outcome' | 'signup' | 'callback' | 'no' | 'success';

// ============ COMPONENT ============

export const KnockLogger: React.FC<KnockLoggerProps> = ({
  visible,
  location,
  address,
  territoryId,
  repId,
  onClose,
  onComplete,
  isRapidMode = false,
}) => {
  // State
  const [step, setStep] = useState<FlowStep>('outcome');
  const [selectedOutcome, setSelectedOutcome] = useState<KnockOutcome | null>(null);
  
  // Signup form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Callback form state
  const [callbackTime, setCallbackTime] = useState(new Date());
  const [callbackNotes, setCallbackNotes] = useState('');
  const [selectedCallbackTag, setSelectedCallbackTag] = useState<CallbackTag | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // No form state
  const [selectedObjection, setSelectedObjection] = useState<ObjectionTag | null>(null);
  
  // Animation
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Store
  const { addKnock, addCustomer, addCallback, undoLastAction } = useKnockStore();
  const lastAction = useLastAction();

  // ============ EFFECTS ============

  useEffect(() => {
    if (visible) {
      resetForm();
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // ============ HANDLERS ============

  const resetForm = () => {
    setStep('outcome');
    setSelectedOutcome(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCallbackTime(new Date());
    setCallbackNotes('');
    setSelectedCallbackTag(null);
    setSelectedObjection(null);
  };

  const handleOutcomeSelect = useCallback(
    async (outcome: KnockOutcome) => {
      // Haptic feedback (98% confidence - research backed)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      setSelectedOutcome(outcome);

      if (isRapidMode) {
        // Rapid mode: Log immediately
        await logKnock(outcome);
        onComplete(outcome);
        return;
      }

      // Normal flow: Go to specific form
      switch (outcome) {
        case 'signup':
          setStep('signup');
          break;
        case 'callback':
          setStep('callback');
          break;
        case 'no':
          setStep('no');
          break;
      }
    },
    [isRapidMode, onComplete]
  );

  const logKnock = async (outcome: KnockOutcome, extras?: any) => {
    if (!location || !address) {
      Alert.alert('Error', 'Location data not available');
      return null;
    }

    const knockId = addKnock({
      address: address.formattedAddress,
      latitude: location.latitude,
      longitude: location.longitude,
      outcome,
      timestamp: Date.now(),
      repId,
      territoryId,
      ...extras,
    });

    // Success haptic
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    return knockId;
  };

  const handleSignupSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      Alert.alert('Required', 'Please enter customer name and phone');
      return;
    }

    // Create customer
    const customerId = addCustomer({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim() || undefined,
      address: address?.formattedAddress || '',
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      repId,
      welcomeCallCompleted: false,
    });

    // Log knock with customer reference
    await logKnock('signup', { customerId });

    setStep('success');
    setTimeout(() => {
      onComplete('signup');
    }, 1500);
  };

  const handleCallbackSubmit = async () => {
    const knockId = await logKnock('callback', {
      callbackTime: callbackTime.getTime(),
      callbackNotes: callbackNotes.trim() || selectedCallbackTag || undefined,
    });

    if (knockId) {
      addCallback({
        knockId,
        address: address?.formattedAddress || '',
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        scheduledTime: callbackTime.getTime(),
        notes: callbackNotes.trim() || selectedCallbackTag || '',
        status: 'pending',
        repId,
      });
    }

    setStep('success');
    setTimeout(() => {
      onComplete('callback');
    }, 1500);
  };

  const handleNoSubmit = async () => {
    await logKnock('no', {
      objectionTag: selectedObjection || undefined,
    });

    setStep('success');
    setTimeout(() => {
      onComplete('no');
    }, 1000);
  };

  const handleUndo = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    undoLastAction();
    onClose();
  };

  // ============ RENDER FUNCTIONS ============

  const renderOutcomeButtons = () => (
    <View style={styles.outcomeContainer}>
      <Text style={styles.addressText}>
        {address?.formattedAddress || 'Unknown Address'}
      </Text>

      <View style={styles.outcomeButtons}>
        {/* SIGN UP - 60x60px touch target per research */}
        <TouchableOpacity
          style={[styles.outcomeButton, styles.signupButton]}
          onPress={() => handleOutcomeSelect('signup')}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={32} color="white" />
          <Text style={styles.outcomeButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* CALLBACK */}
        <TouchableOpacity
          style={[styles.outcomeButton, styles.callbackButton]}
          onPress={() => handleOutcomeSelect('callback')}
          activeOpacity={0.8}
        >
          <Ionicons name="time" size={32} color="white" />
          <Text style={styles.outcomeButtonText}>Callback</Text>
        </TouchableOpacity>

        {/* NO */}
        <TouchableOpacity
          style={[styles.outcomeButton, styles.noButton]}
          onPress={() => handleOutcomeSelect('no')}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={32} color="white" />
          <Text style={styles.outcomeButtonText}>No</Text>
        </TouchableOpacity>
      </View>

      {isRapidMode && (
        <Text style={styles.rapidModeText}>
          Rapid Mode - Tap to log instantly
        </Text>
      )}
    </View>
  );

  const renderSignupForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>New Customer</Text>
        <Text style={styles.formAddress}>{address?.formattedAddress}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Name *</Text>
          <TextInput
            style={styles.input}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Customer name"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone *</Text>
          <TextInput
            style={styles.input}
            value={customerPhone}
            onChangeText={setCustomerPhone}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email (optional)</Text>
          <TextInput
            style={styles.input}
            value={customerEmail}
            onChangeText={setCustomerEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSignupSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Continue to Welcome Call</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderCallbackForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Schedule Callback</Text>
      <Text style={styles.formAddress}>{address?.formattedAddress}</Text>

      {/* Quick Tags */}
      <Text style={styles.sectionLabel}>Quick Reason</Text>
      <View style={styles.tagGrid}>
        {CALLBACK_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              selectedCallbackTag === tag && styles.tagSelected,
            ]}
            onPress={() => setSelectedCallbackTag(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedCallbackTag === tag && styles.tagTextSelected,
              ]}
            >
              {formatTag(tag)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time Picker */}
      <Text style={styles.sectionLabel}>Callback Time</Text>
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar" size={20} color="#666" />
        <Text style={styles.timePickerText}>
          {callbackTime.toLocaleDateString()} at{' '}
          {callbackTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={callbackTime}
          mode="datetime"
          display="spinner"
          onChange={(event, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) setCallbackTime(date);
          }}
          minimumDate={new Date()}
        />
      )}

      {/* Notes */}
      <Text style={styles.sectionLabel}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={callbackNotes}
        onChangeText={setCallbackNotes}
        placeholder="Additional notes..."
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.submitButton, styles.callbackSubmitButton]}
        onPress={handleCallbackSubmit}
        activeOpacity={0.8}
      >
        <Ionicons name="time" size={20} color="white" />
        <Text style={styles.submitButtonText}>Schedule Callback</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNoForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Log Refusal</Text>
      <Text style={styles.formAddress}>{address?.formattedAddress}</Text>

      <Text style={styles.sectionLabel}>Objection (optional)</Text>
      <View style={styles.tagGrid}>
        {OBJECTION_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              styles.objectionTag,
              selectedObjection === tag && styles.objectionTagSelected,
            ]}
            onPress={() => setSelectedObjection(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedObjection === tag && styles.tagTextSelected,
              ]}
            >
              {formatTag(tag)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, styles.noSubmitButton]}
        onPress={handleNoSubmit}
        activeOpacity={0.8}
      >
        <Ionicons name="close-circle" size={20} color="white" />
        <Text style={styles.submitButtonText}>Log No</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <Ionicons
        name="checkmark-circle"
        size={80}
        color={
          selectedOutcome === 'signup'
            ? '#4CAF50'
            : selectedOutcome === 'callback'
            ? '#FFC107'
            : '#F44336'
        }
      />
      <Text style={styles.successText}>
        {selectedOutcome === 'signup'
          ? 'Customer Added!'
          : selectedOutcome === 'callback'
          ? 'Callback Scheduled!'
          : 'Logged'}
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (step) {
      case 'outcome':
        return renderOutcomeButtons();
      case 'signup':
        return renderSignupForm();
      case 'callback':
        return renderCallbackForm();
      case 'no':
        return renderNoForm();
      case 'success':
        return renderSuccess();
    }
  };

  // ============ MAIN RENDER ============

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            {step !== 'outcome' && step !== 'success' && (
              <TouchableOpacity
                onPress={() => setStep('outcome')}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            )}
            <View style={styles.handle} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {renderContent()}

          {/* Undo Toast */}
          {lastAction && Date.now() - lastAction.timestamp < 5000 && (
            <TouchableOpacity style={styles.undoToast} onPress={handleUndo}>
              <Text style={styles.undoText}>Tap to undo</Text>
              <Ionicons name="refresh" size={16} color="white" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

// ============ HELPERS ============

const formatTag = (tag: string): string => {
  return tag
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ============ STYLES ============

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  // Outcome Buttons
  outcomeContainer: {
    padding: 24,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  outcomeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  outcomeButton: {
    width: 90, // 60x60px minimum + padding
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
  },
  callbackButton: {
    backgroundColor: '#FFC107',
  },
  noButton: {
    backgroundColor: '#F44336',
  },
  outcomeButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  rapidModeText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 16,
  },

  // Forms
  formContainer: {
    padding: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  formAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 8,
  },

  // Tags
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagSelected: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  objectionTag: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  objectionTagSelected: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  tagText: {
    fontSize: 13,
    color: '#666',
  },
  tagTextSelected: {
    color: 'white',
    fontWeight: '600',
  },

  // Time Picker
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  timePickerText: {
    fontSize: 16,
    color: '#333',
  },

  // Submit Buttons
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  callbackSubmitButton: {
    backgroundColor: '#FFC107',
  },
  noSubmitButton: {
    backgroundColor: '#F44336',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Success
  successContainer: {
    padding: 40,
    alignItems: 'center',
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },

  // Undo Toast
  undoToast: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  undoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default KnockLogger;
