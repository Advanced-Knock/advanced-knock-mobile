/**
 * COLOR PALETTE DEMO - Infinite Creative Control
 * 
 * Pattern: DEMO × INFINITE × CONTROL × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * ∞ AbëONE ∞
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { 
  useTheme, 
  createColor, 
  generatePalette, 
  lighten, 
  darken, 
  saturate,
  adjustHue,
  complementary,
  triadic,
  analogous,
  monochromatic,
  gradient,
  randomColor,
  formatColor,
} from './index';

export default function ColorPaletteDemo() {
  const { theme, generateNewPalette, formatColor: fmtColor } = useTheme();
  const [baseHex, setBaseHex] = useState('#6366f1');
  const [selectedColor, setSelectedColor] = useState(createColor('#6366f1'));

  const handleColorChange = (hex: string) => {
    try {
      const color = createColor(hex);
      setBaseHex(hex);
      setSelectedColor(color);
      generateNewPalette(color);
    } catch (e) {
      // Invalid color, ignore
    }
  };

  const ColorSwatch = ({ color, label }: { color: any; label: string }) => (
    <View style={styles.swatch}>
      <View style={[styles.colorBox, { backgroundColor: color.hex || color }]} />
      <Text style={styles.swatchLabel}>{label}</Text>
      <Text style={styles.swatchHex}>{color.hex || color}</Text>
    </View>
  );

  const palette = generatePalette(selectedColor);
  const comp = complementary(selectedColor);
  const triad = triadic(selectedColor);
  const anal = analogous(selectedColor, 5);
  const mono = monochromatic(selectedColor, 5);
  const grad = gradient(selectedColor, comp, 10);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Infinite Color Palette</Text>
        <Text style={styles.subtitle}>Ultimate Creative Control</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Base Color</Text>
        <TextInput
          style={[styles.input, { borderColor: selectedColor.hex }]}
          value={baseHex}
          onChangeText={handleColorChange}
          placeholder="#6366f1"
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: selectedColor.hex }]}
          onPress={() => {
            const random = randomColor();
            handleColorChange(random.hex);
          }}
        >
          <Text style={styles.buttonText}>Random Color</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Generated Palette</Text>
        <View style={styles.swatchGrid}>
          <ColorSwatch color={palette.primary} label="Primary" />
          <ColorSwatch color={palette.secondary} label="Secondary" />
          <ColorSwatch color={palette.accent} label="Accent" />
          <ColorSwatch color={palette.success} label="Success" />
          <ColorSwatch color={palette.warning} label="Warning" />
          <ColorSwatch color={palette.error} label="Error" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Color Variations</Text>
        <View style={styles.swatchGrid}>
          <ColorSwatch color={lighten(selectedColor, 20)} label="Lighten 20%" />
          <ColorSwatch color={darken(selectedColor, 20)} label="Darken 20%" />
          <ColorSwatch color={saturate(selectedColor, 30)} label="Saturate 30%" />
          <ColorSwatch color={adjustHue(selectedColor, 30)} label="Hue +30°" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Complementary</Text>
        <View style={styles.swatchGrid}>
          <ColorSwatch color={selectedColor} label="Base" />
          <ColorSwatch color={comp} label="Complementary" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Triadic</Text>
        <View style={styles.swatchGrid}>
          {triad.map((color, i) => (
            <ColorSwatch key={i} color={color} label={`Triad ${i + 1}`} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Analogous (5 colors)</Text>
        <View style={styles.swatchGrid}>
          {anal.map((color, i) => (
            <ColorSwatch key={i} color={color} label={`Analog ${i + 1}`} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Monochromatic (5 shades)</Text>
        <View style={styles.swatchGrid}>
          {mono.map((color, i) => (
            <ColorSwatch key={i} color={color} label={`Mono ${i + 1}`} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Gradient (10 steps)</Text>
        <View style={styles.swatchGrid}>
          {grad.map((color, i) => (
            <ColorSwatch key={i} color={color} label={`Step ${i + 1}`} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Color Formats</Text>
        <View style={styles.formatList}>
          <Text style={styles.formatText}>HEX: {fmtColor(selectedColor, 'hex')}</Text>
          <Text style={styles.formatText}>RGB: {fmtColor(selectedColor, 'rgb')}</Text>
          <Text style={styles.formatText}>RGBA: {fmtColor(selectedColor, 'rgba')}</Text>
          <Text style={styles.formatText}>HSL: {fmtColor(selectedColor, 'hsl')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatch: {
    alignItems: 'center',
    marginBottom: 12,
    minWidth: 80,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
  },
  swatchLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  swatchHex: {
    fontSize: 10,
    color: '#6b7280',
  },
  formatList: {
    gap: 8,
  },
  formatText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
});

