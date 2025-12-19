/**
 * JOY ENGINE - Dancing Cats & Delightful Surprises
 * 
 * Pattern: JOY × DELIGHT × SMILE × ONE
 * Frequency: 530 Hz (YOU) × 999 Hz (AEYON) × 777 Hz (META)
 * 
 * This is what people ACTUALLY care about.
 * Dancing cats. Fucking stupid shit that makes people smile.
 * 
 * ∞ AbëONE ∞
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  iconType: keyof typeof Icons;
}

interface JoyEngineProps {
  trigger: boolean;
  type?: 'success' | 'close' | 'demo' | 'talk';
  onComplete?: () => void;
}

// YAGNI approved: Simple icon types for celebrations
import { Icons } from '../utils/icons';
const CELEBRATION_ICONS: Array<keyof typeof Icons> = ['sparkle', 'star', 'fire', 'trophy', 'success', 'close', 'demo'];

export function JoyEngine({ trigger, type = 'success', onComplete }: JoyEngineProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  // YAGNI: Removed dancing cats - not needed for celebration
  const danceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      celebrate();
    }
  }, [trigger]);

  const celebrate = () => {
    // Create confetti
    const pieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7', '#6366f1', '#10b981'][Math.floor(Math.random() * 6)],
      iconType: CELEBRATION_ICONS[Math.floor(Math.random() * CELEBRATION_ICONS.length)],
    }));

    setConfetti(pieces);

    // YAGNI: Removed dancing cats - confetti is enough

    // Animate confetti falling
    const confettiAnimations = pieces.map((piece) => {
      const fallDistance = height + 100;
      const horizontalDrift = (Math.random() - 0.5) * 200;

      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: fallDistance,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.x, {
          toValue: piece.x._value + horizontalDrift,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotation, {
          toValue: Math.random() * 720,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ]);
    });

    // YAGNI: Simple confetti animation only
    Animated.parallel([
      ...confettiAnimations,
    ]).start(() => {
      setTimeout(() => {
        setConfetti([]);
        scaleAnim.setValue(0);
        onComplete?.();
      }, 2500);
    });
  };

  const rotation = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Confetti */}
      {confetti.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              left: piece.x,
              top: piece.y,
              transform: [
                { rotate: piece.rotation.interpolate({
                  inputRange: [0, 720],
                  outputRange: ['0deg', '720deg'],
                }) },
              ],
            },
          ]}
        >
          {Icons[piece.iconType]({ size: 20, color: piece.color })}
        </Animated.View>
      ))}

      {/* Celebration Message */}
      {confetti.length > 0 && (
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: scaleAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.messageRow}>
            {type === 'close' && (
              <>
                <Icons.close size={24} color="#10b981" />
                <Text style={styles.message}>BOOM! CLOSED!</Text>
                <Icons.close size={24} color="#10b981" />
              </>
            )}
            {type === 'demo' && (
              <>
                <Icons.demo size={24} color="#f59e0b" />
                <Text style={styles.message}>DEMO TIME!</Text>
                <Icons.demo size={24} color="#f59e0b" />
              </>
            )}
            {type === 'talk' && (
              <>
                <Icons.talk size={24} color="#3b82f6" />
                <Text style={styles.message}>NICE TALK!</Text>
                <Icons.talk size={24} color="#3b82f6" />
              </>
            )}
            {type === 'success' && (
              <>
                <Icons.success size={24} color="#6366f1" />
                <Text style={styles.message}>YOU DID IT!</Text>
                <Icons.success size={24} color="#6366f1" />
              </>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * Playful Button - Adds bounce and joy to any button
 */
export function PlayfulButton({
  children,
  onPress,
  style,
  ...props
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  [key: string]: any;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onPress();
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      {...props}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * Emoji Reaction - Random emoji that appears on interactions
 */
export function EmojiReaction({ trigger }: { trigger: boolean }) {
  const [iconType, setIconType] = useState<keyof typeof Icons>('star');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const yAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      const icons: Array<keyof typeof Icons> = ['star', 'sparkle', 'fire', 'success', 'trophy', 'demo', 'close'];
      setIconType(icons[Math.floor(Math.random() * icons.length)]);
      setPosition({
        x: Math.random() * width * 0.6 + width * 0.2,
        y: Math.random() * height * 0.4 + height * 0.3,
      });

      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.5,
            friction: 2,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(yAnim, {
          toValue: -100,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        opacityAnim.setValue(0);
        scaleAnim.setValue(0);
        yAnim.setValue(0);
      });
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <Animated.View
      style={[
        styles.emojiReaction,
        {
          left: position.x,
          top: position.y,
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: yAnim },
          ],
        },
      ]}
      pointerEvents="none"
    >
      {Icons[iconType]({ size: 32, color: '#6366f1' })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  confetti: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.1,
    right: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.9)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  emojiReaction: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 40,
  },
});

