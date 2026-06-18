/**
 * App Theme — Netflix Dark Style
 * Pure black background, vibrant red accent
 */

export const COLORS = {
  // Backgrounds
  background: '#000000',         // Pure black (Netflix style)
  surface: '#141414',            // Card background (subtle lift)
  surfaceElevated: '#1F1F1F',    // Elevated surfaces (modals, dropdowns)
  surfaceHover: '#2A2A2A',       // Hover states

  // Accent (Netflix red)
  primary: '#E50914',            // Netflix red
  primaryDark: '#B20710',        // Hover/pressed
  primaryLight: '#FF1F2D',       // Light variant for glow effects

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#737373',
  textInverse: '#000000',

  // Borders & dividers
  border: '#333333',
  divider: '#222222',

  // Status
  success: '#46D369',
  warning: '#FFB400',
  error: '#E50914',
  info: '#2E9BF6',

  // Overlay
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(255, 255, 255, 0.1)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
};

export const FONT_SIZE = {
  micro: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  title: 40,
};

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
};

export default theme;
