/**
 * INFINITE ANIMATION SYSTEM
 * 
 * Pattern: ANIMATIONS × INFINITE × CONTROL × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (Lux)
 * 
 * ZERO RISK: Type-safe, validated, performant
 * INFINITE REWARD: Beautiful, smooth, easy
 * ∞ AbëONE ∞
 */

import { Animated } from 'react-native';
import type { AnimationConfig, AnimationPreset, AnimationType } from './types';

/**
 * Easing functions
 */
export const Easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  cubicBezier: (x1: number, y1: number, x2: number, y2: number) => 
    `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`,
  spring: (tension: number = 50, friction: number = 7) => 
    `cubic-bezier(${0.68 - tension / 100}, ${0.01}, ${0.32 + friction / 100}, 1)`,
};

/**
 * Default animation config
 */
const defaultConfig: AnimationConfig = {
  duration: 300,
  easing: Easing.easeOut,
  iterations: 1,
  direction: 'normal',
  fillMode: 'forwards',
};

/**
 * Create animation preset
 */
export function createAnimation(
  name: string,
  keyframes: Record<string, Record<string, string | number>>,
  config: Partial<AnimationConfig> = {}
): AnimationPreset {
  return {
    name,
    config: { ...defaultConfig, ...config },
    keyframes,
  };
}

/**
 * Animation presets
 */
export const Animations: Record<string, AnimationPreset> = {
  fadeIn: createAnimation('fadeIn', {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  }, { duration: 400 }),

  fadeOut: createAnimation('fadeOut', {
    '0%': { opacity: 1 },
    '100%': { opacity: 0 },
  }, { duration: 300 }),

  slideUp: createAnimation('slideUp', {
    '0%': { transform: [{ translateY: 30 }], opacity: 0 },
    '100%': { transform: [{ translateY: 0 }], opacity: 1 },
  }, { duration: 400, easing: Easing.easeOut }),

  slideDown: createAnimation('slideDown', {
    '0%': { transform: [{ translateY: -30 }], opacity: 0 },
    '100%': { transform: [{ translateY: 0 }], opacity: 1 },
  }, { duration: 400 }),

  slideLeft: createAnimation('slideLeft', {
    '0%': { transform: [{ translateX: 30 }], opacity: 0 },
    '100%': { transform: [{ translateX: 0 }], opacity: 1 },
  }, { duration: 400 }),

  slideRight: createAnimation('slideRight', {
    '0%': { transform: [{ translateX: -30 }], opacity: 0 },
    '100%': { transform: [{ translateX: 0 }], opacity: 1 },
  }, { duration: 400 }),

  scaleIn: createAnimation('scaleIn', {
    '0%': { transform: [{ scale: 0.8 }], opacity: 0 },
    '100%': { transform: [{ scale: 1 }], opacity: 1 },
  }, { duration: 300, easing: Easing.spring(50, 7) }),

  scaleOut: createAnimation('scaleOut', {
    '0%': { transform: [{ scale: 1 }], opacity: 1 },
    '100%': { transform: [{ scale: 0.8 }], opacity: 0 },
  }, { duration: 300 }),

  rotate: createAnimation('rotate', {
    '0%': { transform: [{ rotate: '0deg' }] },
    '100%': { transform: [{ rotate: '360deg' }] },
  }, { duration: 1000, iterations: 'infinite' }),

  bounce: createAnimation('bounce', {
    '0%, 100%': { transform: [{ translateY: 0 }] },
    '50%': { transform: [{ translateY: -10 }] },
  }, { duration: 1000, iterations: 'infinite' }),

  pulse: createAnimation('pulse', {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  }, { duration: 1500, iterations: 'infinite' }),

  shake: createAnimation('shake', {
    '0%, 100%': { transform: [{ translateX: 0 }] },
    '25%': { transform: [{ translateX: -10 }] },
    '75%': { transform: [{ translateX: 10 }] },
  }, { duration: 500 }),

  glow: createAnimation('glow', {
    '0%, 100%': { shadowOpacity: 0.3, shadowRadius: 8 },
    '50%': { shadowOpacity: 0.6, shadowRadius: 16 },
  }, { duration: 2000, iterations: 'infinite' }),

  float: createAnimation('float', {
    '0%, 100%': { transform: [{ translateY: 0 }] },
    '50%': { transform: [{ translateY: -20 }] },
  }, { duration: 3000, iterations: 'infinite', easing: Easing.easeInOut }),

  spin: createAnimation('spin', {
    '0%': { transform: [{ rotate: '0deg' }] },
    '100%': { transform: [{ rotate: '360deg' }] },
  }, { duration: 1000, iterations: 'infinite', easing: Easing.linear }),
};

/**
 * Create custom animation
 */
export function createCustomAnimation(
  keyframes: Record<string, Record<string, string | number>>,
  config: Partial<AnimationConfig> = {}
): AnimationPreset {
  return createAnimation('custom', keyframes, config);
}

/**
 * Combine animations
 */
export function combineAnimations(...animations: AnimationPreset[]): AnimationPreset {
  const combinedKeyframes: Record<string, Record<string, string | number>> = {};
  
  animations.forEach(anim => {
    Object.entries(anim.keyframes).forEach(([key, value]) => {
      if (!combinedKeyframes[key]) {
        combinedKeyframes[key] = {};
      }
      Object.assign(combinedKeyframes[key], value);
    });
  });

  return createAnimation(
    'combined',
    combinedKeyframes,
    animations[0]?.config || defaultConfig
  );
}

/**
 * React Native Animated helper
 */
export class AnimationHelper {
  private animValue: Animated.Value;
  private animValueXY?: Animated.ValueXY;

  constructor(initialValue: number = 0, isXY: boolean = false) {
    this.animValue = new Animated.Value(initialValue);
    if (isXY) {
      this.animValueXY = new Animated.ValueXY({ x: initialValue, y: initialValue });
    }
  }

  /**
   * Animate to value
   */
  animateTo(
    toValue: number,
    config: Partial<AnimationConfig> = {}
  ): Animated.CompositeAnimation {
    const animConfig = {
      ...defaultConfig,
      ...config,
      toValue,
      useNativeDriver: true,
    };

    return Animated.timing(this.animValue, animConfig as any);
  }

  /**
   * Animate with spring
   */
  springTo(
    toValue: number,
    tension: number = 50,
    friction: number = 7
  ): Animated.CompositeAnimation {
    return Animated.spring(this.animValue, {
      toValue,
      tension,
      friction,
      useNativeDriver: true,
    });
  }

  /**
   * Animate with decay
   */
  decayTo(velocity: number, deceleration: number = 0.997): Animated.CompositeAnimation {
    return Animated.decay(this.animValue, {
      velocity,
      deceleration,
      useNativeDriver: true,
    });
  }

  /**
   * Get animated value
   */
  getValue(): Animated.Value {
    return this.animValue;
  }

  /**
   * Get animated value XY
   */
  getValueXY(): Animated.ValueXY | undefined {
    return this.animValueXY;
  }

  /**
   * Reset animation
   */
  reset(toValue: number = 0): void {
    this.animValue.setValue(toValue);
    if (this.animValueXY) {
      this.animValueXY.setValue({ x: toValue, y: toValue });
    }
  }

  /**
   * Stop animation
   */
  stop(): void {
    this.animValue.stopAnimation();
    if (this.animValueXY) {
      this.animValueXY.stopAnimation();
    }
  }
}

/**
 * Create sequence of animations
 */
export function createSequence(
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation {
  return Animated.sequence(animations);
}

/**
 * Create parallel animations
 */
export function createParallel(
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation {
  return Animated.parallel(animations);
}

/**
 * Create staggered animations
 */
export function createStagger(
  animations: Animated.CompositeAnimation[],
  delay: number = 100
): Animated.CompositeAnimation {
  return Animated.stagger(delay, animations);
}

/**
 * Create loop animation
 */
export function createLoop(
  animation: Animated.CompositeAnimation,
  iterations: number = -1
): Animated.CompositeAnimation {
  return Animated.loop(animation, { iterations });
}

