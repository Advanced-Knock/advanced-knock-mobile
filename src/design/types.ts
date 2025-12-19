/**
 * DESIGN SYSTEM TYPES
 * 
 * Pattern: TYPES × SAFETY × INFINITE × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (ZERO)
 * ∞ AbëONE ∞
 */

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'rgba';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  rgba: { r: number; g: number; b: number; a: number };
}

export interface ColorPalette {
  primary: Color;
  secondary: Color;
  accent: Color;
  success: Color;
  warning: Color;
  error: Color;
  background: Color;
  surface: Color;
  text: {
    primary: Color;
    secondary: Color;
    tertiary: Color;
  };
  border: Color;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing: string;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface AnimationPreset {
  name: string;
  config: AnimationConfig;
  keyframes: Record<string, Record<string, string | number>>;
}

export type AnimationType = 
  | 'fadeIn' 
  | 'fadeOut' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight'
  | 'scaleIn' 
  | 'scaleOut' 
  | 'rotate' 
  | 'bounce' 
  | 'pulse' 
  | 'shake'
  | 'glow' 
  | 'float' 
  | 'spin'
  | 'custom';

export interface Theme {
  colors: ColorPalette;
  animations: Record<string, AnimationPreset>;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

