const shared = {
  // Primary palette
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',

  // Secondary
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',

  // Accent
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',

  // Semantic
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Misc
  white: '#FFFFFF',
  black: '#000000',

  // Gradients
  gradientPrimary: ['#4F46E5', '#7C3AED'],
  gradientSuccess: ['#10B981', '#059669'],
  gradientDanger: ['#EF4444', '#DC2626'],
};

export const darkColors = {
  ...shared,
  primaryGlow: 'rgba(79, 70, 229, 0.15)',

  // Backgrounds
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  card: '#1E293B',
  cardElevated: '#263548',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  // Semantic backgrounds
  successLight: 'rgba(16, 185, 129, 0.15)',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  infoLight: 'rgba(59, 130, 246, 0.15)',

  // Borders
  border: '#334155',
  borderLight: '#475569',
  divider: 'rgba(148, 163, 184, 0.12)',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.6)',
  shimmer: 'rgba(255, 255, 255, 0.05)',

  // Gradients
  gradientDark: ['#1E293B', '#0F172A'],
  gradientCard: ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)'],
};

export const lightColors = {
  ...shared,
  primaryGlow: 'rgba(79, 70, 229, 0.08)',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#F1F5F9',

  // Semantic backgrounds
  successLight: 'rgba(16, 185, 129, 0.1)',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  infoLight: 'rgba(59, 130, 246, 0.1)',

  // Borders
  border: '#E2E8F0',
  borderLight: '#CBD5E1',
  divider: 'rgba(15, 23, 42, 0.08)',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.4)',
  shimmer: 'rgba(0, 0, 0, 0.04)',

  // Gradients
  gradientDark: ['#F1F5F9', '#E2E8F0'],
  gradientCard: ['rgba(255, 255, 255, 0.9)', 'rgba(241, 245, 249, 0.9)'],
};

// Default export for backward compat (dark theme)
const colors = darkColors;
export default colors;
