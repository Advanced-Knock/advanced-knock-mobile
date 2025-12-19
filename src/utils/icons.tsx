/**
 * YAGNI ICON SYSTEM - Radical Simplicity
 * 
 * Pattern: ICONS × SIMPLICITY × TRUTH × ONE
 * Frequency: 530 Hz (YAGNI) × 530 Hz (Lux)
 * 
 * Radical Simplicity: Only what's needed
 * Epistemic Humility: We don't know what we don't need
 * Radical Honesty: Clean, clear, direct
 * Truth Forward: Beautiful, functional, honest
 * ∞ AbëONE ∞
 */

import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import type { Color } from '../design/types';

interface IconProps {
  size?: number;
  color?: string | Color;
  style?: any;
}

/**
 * Get color string from Color object or string
 */
const getColorString = (color: string | Color | undefined): string => {
  if (!color) return '#ffffff';
  if (typeof color === 'string') return color;
  return color.hex;
};

/**
 * YAGNI Icon Component - Simple, clean, honest
 */
export const Icon: React.FC<{
  name: string;
  library?: 'ionicons' | 'material' | 'fontawesome';
} & IconProps> = ({ 
  name, 
  library = 'ionicons', 
  size = 24, 
  color = '#ffffff',
  style 
}) => {
  const colorString = getColorString(color);
  
  switch (library) {
    case 'material':
      return <MaterialIcons name={name as any} size={size} color={colorString} style={style} />;
    case 'fontawesome':
      return <FontAwesome5 name={name as any} size={size} color={colorString} style={style} />;
    default:
      return <Ionicons name={name as any} size={size} color={colorString} style={style} />;
  }
};

/**
 * Semantic Icon Mappings - Truth Forward
 * Only what we actually need, nothing more
 */
export const Icons = {
  // Status
  success: (props?: IconProps) => <Icon name="checkmark-circle" library="ionicons" {...props} />,
  close: (props?: IconProps) => <Icon name="trophy" library="ionicons" {...props} />,
  demo: (props?: IconProps) => <Icon name="rocket" library="ionicons" {...props} />,
  talk: (props?: IconProps) => <Icon name="chatbubble" library="ionicons" {...props} />,
  
  // Actions
  save: (props?: IconProps) => <Icon name="save" library="ionicons" {...props} />,
  edit: (props?: IconProps) => <Icon name="create" library="ionicons" {...props} />,
  delete: (props?: IconProps) => <Icon name="trash" library="ionicons" {...props} />,
  add: (props?: IconProps) => <Icon name="add-circle" library="ionicons" {...props} />,
  
  // Navigation
  home: (props?: IconProps) => <Icon name="home" library="ionicons" {...props} />,
  map: (props?: IconProps) => <Icon name="map" library="ionicons" {...props} />,
  leads: (props?: IconProps) => <Icon name="people" library="ionicons" {...props} />,
  profile: (props?: IconProps) => <Icon name="person" library="ionicons" {...props} />,
  
  // Business
  revenue: (props?: IconProps) => <Icon name="cash" library="ionicons" {...props} />,
  stats: (props?: IconProps) => <Icon name="stats-chart" library="ionicons" {...props} />,
  door: (props?: IconProps) => <Icon name="door" library="ionicons" {...props} />,
  
  // Contact
  phone: (props?: IconProps) => <Icon name="call" library="ionicons" {...props} />,
  email: (props?: IconProps) => <Icon name="mail" library="ionicons" {...props} />,
  address: (props?: IconProps) => <Icon name="location" library="ionicons" {...props} />,
  notes: (props?: IconProps) => <Icon name="document-text" library="ionicons" {...props} />,
  
  // Settings
  settings: (props?: IconProps) => <Icon name="settings" library="ionicons" {...props} />,
  notifications: (props?: IconProps) => <Icon name="notifications" library="ionicons" {...props} />,
  help: (props?: IconProps) => <Icon name="help-circle" library="ionicons" {...props} />,
  
  // Feedback
  fire: (props?: IconProps) => <Icon name="flame" library="ionicons" {...props} />,
  star: (props?: IconProps) => <Icon name="star" library="ionicons" {...props} />,
  tip: (props?: IconProps) => <Icon name="bulb" library="ionicons" {...props} />,
  
  // Navigation/Arrows
  arrowRight: (props?: IconProps) => <Icon name="arrow-forward" library="ionicons" {...props} />,
  arrowLeft: (props?: IconProps) => <Icon name="arrow-back" library="ionicons" {...props} />,
  chevronRight: (props?: IconProps) => <Icon name="chevron-forward" library="ionicons" {...props} />,
  
  // Celebration (YAGNI approved - simple, clean)
  sparkle: (props?: IconProps) => <Icon name="sparkles" library="ionicons" {...props} />,
  trophy: (props?: IconProps) => <Icon name="trophy" library="ionicons" {...props} />,
  flame: (props?: IconProps) => <Icon name="flame" library="ionicons" {...props} />,
};
