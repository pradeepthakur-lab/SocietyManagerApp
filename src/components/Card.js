import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import spacing from '../constants/spacing';

const Card = ({
  children,
  style,
  onPress,
  variant = 'default', // default | elevated | outlined
  padding = spacing.cardPadding,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'outlined':
        return styles.outlined;
      default:
        return styles.default;
    }
  };

  const content = (
    <View style={[styles.card, getCardStyle(), { padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  elevated: {
    backgroundColor: colors.cardElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default Card;
