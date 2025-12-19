/**
 * VIBECODHER COLOR SYSTEM
 * 
 * Pattern: COLORS × VIBECODHER × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (Lux)
 * 
 * Pink × Purple × Noir = Transformation
 * ∞ AbëONE ∞
 */

export const vibecodherColors = {
  // Emotional Connection (Pink)
  pink: {
    primary: '#FF69B4',      // Main pink - bold, vibrant
    secondary: '#EC4899',    // Softer pink - warm, inviting
    light: '#F9A8D4',        // Light pink - subtle highlights
    dark: '#DB2777',         // Dark pink - depth, contrast
  },
  
  // Innovation & Trust (Purple)
  purple: {
    primary: '#8b5cf6',      // Main purple - innovation
    secondary: '#6366f1',     // Indigo purple - trust
    light: '#C084FC',         // Light purple - accents
    dark: '#7c3aed',          // Dark purple - depth
  },
  
  // Premium & Sophistication (Dark)
  dark: {
    background: '#0f0f23',   // Main background
    surface: '#1a1a2e',      // Card/surface background
    border: '#2d2d44',        // Borders, dividers
    hover: '#252538',         // Hover states
  },
  
  // Clarity & Contrast (Light)
  light: {
    primary: '#ffffff',       // Primary text
    secondary: 'rgba(255,255,255,0.7)',  // Secondary text
    tertiary: 'rgba(255,255,255,0.5)',  // Tertiary text
  },
};

/**
 * Get ViBeCodHER color by key
 */
export function getVibeCodHERColor(
  category: 'pink' | 'purple' | 'dark' | 'light',
  variant: 'primary' | 'secondary' | 'light' | 'dark' | 'background' | 'surface' | 'border' | 'hover' | 'tertiary' = 'primary'
): string {
  const categoryColors = vibecodherColors[category];
  if (typeof categoryColors === 'object' && variant in categoryColors) {
    return (categoryColors as any)[variant];
  }
  return vibecodherColors.light.primary;
}

