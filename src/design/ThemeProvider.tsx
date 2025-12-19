/**
 * THEME PROVIDER - Infinite Creative Control
 * 
 * Pattern: THEME × PROVIDER × INFINITE × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (Lux)
 * 
 * ZERO RISK: Type-safe, validated, tested
 * INFINITE REWARD: Beautiful, performant, easy
 * ∞ AbëONE ∞
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { Theme, ColorPalette, Color } from './types';
import { generatePalette, createColor, type ColorFormat } from './colors';
import { Animations, type AnimationPreset } from './animations';

interface ThemeContextValue {
  theme: Theme;
  updateColor: (key: keyof ColorPalette, color: Color) => void;
  updatePalette: (palette: Partial<ColorPalette>) => void;
  generateNewPalette: (baseColor: Color) => void;
  getColor: (path: string) => Color;
  formatColor: (color: Color, format: ColorFormat) => string;
  getAnimation: (name: string) => AnimationPreset | undefined;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialBaseColor?: Color;
}

const defaultBaseColor = createColor('#6366f1');

export function ThemeProvider({ children, initialBaseColor = defaultBaseColor }: ThemeProviderProps) {
  const [baseColor, setBaseColor] = useState<Color>(initialBaseColor);
  const [customPalette, setCustomPalette] = useState<Partial<ColorPalette>>({});

  const palette = useMemo(() => {
    const generated = generatePalette(baseColor);
    return { ...generated, ...customPalette };
  }, [baseColor, customPalette]);

  const theme: Theme = useMemo(() => ({
    colors: palette,
    animations: Animations,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      full: 9999,
    },
    shadows: {
      sm: '0 2px 4px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.15)',
      lg: '0 8px 16px rgba(0,0,0,0.2)',
      xl: '0 16px 32px rgba(0,0,0,0.25)',
    },
  }), [palette]);

  const updateColor = (key: keyof ColorPalette, color: Color) => {
    if (key === 'text') {
      // Text is an object, can't update directly
      throw new Error('Use updatePalette to update text colors');
    } else {
      setCustomPalette(prev => ({ ...prev, [key]: color }));
    }
  };

  const updatePalette = (newPalette: Partial<ColorPalette>) => {
    setCustomPalette(prev => ({ ...prev, ...newPalette }));
  };

  const generateNewPalette = (newBaseColor: Color) => {
    setBaseColor(newBaseColor);
    setCustomPalette({});
  };

  const getColor = (path: string): Color => {
    const keys = path.split('.');
    let value: any = palette;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        throw new Error(`Color path not found: ${path}`);
      }
    }
    return value;
  };

  const formatColor = (color: Color, format: ColorFormat = 'hex'): string => {
    switch (format) {
      case 'hex':
        return color.hex;
      case 'rgb':
        return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
      case 'rgba':
        return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgba.a})`;
      case 'hsl':
        return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
      default:
        return color.hex;
    }
  };

  const getAnimation = (name: string): AnimationPreset | undefined => {
    return Animations[name];
  };

  const value: ThemeContextValue = {
    theme,
    updateColor,
    updatePalette,
    generateNewPalette,
    getColor,
    formatColor,
    getAnimation,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Use theme hook
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Use color hook
 */
export function useColor(path: string): Color {
  const { getColor } = useTheme();
  return getColor(path);
}

/**
 * Use animation hook
 */
export function useAnimation(name: string): AnimationPreset | undefined {
  const { getAnimation } = useTheme();
  return getAnimation(name);
}

