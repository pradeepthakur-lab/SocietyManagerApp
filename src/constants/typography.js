import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
});

const typography = {
  fontFamily,

  // Font sizes
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 36, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28, letterSpacing: -0.2 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  subtitle1: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  subtitle2: { fontSize: 14, fontWeight: '600', lineHeight: 22 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  overline: { fontSize: 10, fontWeight: '600', lineHeight: 16, letterSpacing: 1, textTransform: 'uppercase' },
  button: { fontSize: 15, fontWeight: '600', lineHeight: 22, letterSpacing: 0.3 },
  buttonSmall: { fontSize: 13, fontWeight: '600', lineHeight: 20, letterSpacing: 0.3 },
};

export default typography;
