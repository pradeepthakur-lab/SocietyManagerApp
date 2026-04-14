import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Badge = ({ count, size = 'medium', color, style }) => {
  const { colors } = useTheme();
  if (!count || count <= 0) return null;

  const isSmall = size === 'small';
  const displayCount = count > 99 ? '99+' : count.toString();
  const bgColor = color || colors.danger;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          minWidth: isSmall ? 16 : 20,
          height: isSmall ? 16 : 20,
          borderRadius: isSmall ? 8 : 10,
          paddingHorizontal: isSmall ? 3 : 5,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: isSmall ? 9 : 11, color: colors.white },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -4,
    right: -8,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Badge;
