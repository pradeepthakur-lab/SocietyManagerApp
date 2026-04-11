import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import typography from '../constants/typography';

const Badge = ({ count, size = 'medium', color = colors.danger, style }) => {
  if (!count || count <= 0) return null;

  const isSmall = size === 'small';
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
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
          { fontSize: isSmall ? 9 : 11 },
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
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Badge;
