/**
 * INFINITE COLOR PALETTE SYSTEM
 * 
 * Pattern: COLORS × INFINITE × CONTROL × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (Lux)
 * 
 * ZERO RISK: Type-safe, validated, tested
 * INFINITE REWARD: Beautiful, performant, easy
 * ∞ AbëONE ∞
 */

import type { Color, ColorPalette, ColorFormat } from './types';

/**
 * Parse RGBA string to RGB and alpha
 */
export function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Check if it's an RGBA string first
  const rgba = parseRgba(hex);
  if (rgba) {
    return { r: rgba.r, g: rgba.g, b: rgba.b };
  }
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

/**
 * Create Color object from hex or RGBA string
 */
export function createColor(hex: string, alpha: number = 1): Color {
  // Check if it's an RGBA string
  const rgba = parseRgba(hex);
  if (rgba) {
    const rgb = { r: rgba.r, g: rgba.g, b: rgba.b };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    return {
      hex: hexColor,
      rgb,
      hsl,
      rgba: { ...rgb, a: rgba.a },
    };
  }
  
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  return {
    hex,
    rgb,
    hsl,
    rgba: { ...rgb, a: alpha },
  };
}

/**
 * Lighten a color by percentage
 */
export function lighten(color: Color, percent: number): Color {
  const newL = Math.min(100, color.hsl.l + percent);
  const rgb = hslToRgb(color.hsl.h, color.hsl.s, newL);
  return createColor(rgbToHex(rgb.r, rgb.g, rgb.b), color.rgba.a);
}

/**
 * Darken a color by percentage
 */
export function darken(color: Color, percent: number): Color {
  const newL = Math.max(0, color.hsl.l - percent);
  const rgb = hslToRgb(color.hsl.h, color.hsl.s, newL);
  return createColor(rgbToHex(rgb.r, rgb.g, rgb.b), color.rgba.a);
}

/**
 * Saturate a color by percentage
 */
export function saturate(color: Color, percent: number): Color {
  const newS = Math.min(100, color.hsl.s + percent);
  const rgb = hslToRgb(color.hsl.h, newS, color.hsl.l);
  return createColor(rgbToHex(rgb.r, rgb.g, rgb.b), color.rgba.a);
}

/**
 * Desaturate a color by percentage
 */
export function desaturate(color: Color, percent: number): Color {
  const newS = Math.max(0, color.hsl.s - percent);
  const rgb = hslToRgb(color.hsl.h, newS, color.hsl.l);
  return createColor(rgbToHex(rgb.r, rgb.g, rgb.b), color.rgba.a);
}

/**
 * Adjust hue by degrees
 */
export function adjustHue(color: Color, degrees: number): Color {
  const newH = (color.hsl.h + degrees) % 360;
  const rgb = hslToRgb(newH, color.hsl.s, color.hsl.l);
  return createColor(rgbToHex(rgb.r, rgb.g, rgb.b), color.rgba.a);
}

/**
 * Mix two colors
 */
export function mix(color1: Color, color2: Color, weight: number = 50): Color {
  const w = weight / 100;
  const r = Math.round(color1.rgb.r * (1 - w) + color2.rgb.r * w);
  const g = Math.round(color1.rgb.g * (1 - w) + color2.rgb.g * w);
  const b = Math.round(color1.rgb.b * (1 - w) + color2.rgb.b * w);
  return createColor(rgbToHex(r, g, b));
}

/**
 * Generate complementary color
 */
export function complementary(color: Color): Color {
  return adjustHue(color, 180);
}

/**
 * Generate triadic colors
 */
export function triadic(color: Color): [Color, Color, Color] {
  return [color, adjustHue(color, 120), adjustHue(color, 240)];
}

/**
 * Generate analogous colors
 */
export function analogous(color: Color, count: number = 3): Color[] {
  const colors: Color[] = [];
  const step = 30;
  const start = -step * Math.floor(count / 2);
  
  for (let i = 0; i < count; i++) {
    colors.push(adjustHue(color, start + i * step));
  }
  
  return colors;
}

/**
 * Generate monochromatic palette
 */
export function monochromatic(color: Color, count: number = 5): Color[] {
  const colors: Color[] = [];
  const step = 100 / (count + 1);
  
  for (let i = 1; i <= count; i++) {
    const lightness = step * i;
    const rgb = hslToRgb(color.hsl.h, color.hsl.s, lightness);
    colors.push(createColor(rgbToHex(rgb.r, rgb.g, rgb.b)));
  }
  
  return colors;
}

/**
 * Generate gradient colors
 */
export function gradient(color1: Color, color2: Color, steps: number = 10): Color[] {
  const colors: Color[] = [];
  for (let i = 0; i <= steps; i++) {
    const weight = (i / steps) * 100;
    colors.push(mix(color1, color2, weight));
  }
  return colors;
}

/**
 * Generate random color
 */
export function randomColor(): Color {
  const h = Math.floor(Math.random() * 360);
  const s = 50 + Math.floor(Math.random() * 50);
  const l = 40 + Math.floor(Math.random() * 30);
  const rgb = hslToRgb(h, s, l);
  return createColor(rgbToHex(rgb.r, rgb.g, rgb.b));
}

/**
 * Generate palette from base color
 */
export function generatePalette(baseColor: Color): ColorPalette {
  const primary = baseColor;
  const secondary = adjustHue(baseColor, 30);
  const accent = adjustHue(baseColor, 60);
  
  return {
    primary,
    secondary,
    accent,
    success: createColor('#10b981'),
    warning: createColor('#f59e0b'),
    error: createColor('#ef4444'),
    background: createColor('#0a0a1a'),
    surface: createColor('#1a1a2e'),
    text: {
      primary: createColor('#ffffff'),
      secondary: createColor('#9ca3af'),
      tertiary: createColor('#6b7280'),
    },
    border: createColor('rgba(255,255,255,0.1)'),
  };
}

/**
 * Get color in specific format
 */
export function formatColor(color: Color, format: ColorFormat): string {
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
}

/**
 * Validate color hex
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(color1: Color, color2: Color): number {
  const getLuminance = (color: Color) => {
    const [r, g, b] = [color.rgb.r, color.rgb.g, color.rgb.b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color is dark
 */
export function isDark(color: Color): boolean {
  return color.hsl.l < 50;
}

/**
 * Get readable text color for background
 */
export function getReadableTextColor(backgroundColor: Color): Color {
  return isDark(backgroundColor) ? createColor('#ffffff') : createColor('#000000');
}

