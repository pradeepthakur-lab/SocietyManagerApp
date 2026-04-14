import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import spacing from '../constants/spacing';

const Card = ({
  children,
  style,
  onPress,
  variant = 'default', // default | elevated | outlined
  padding = spacing.cardPadding,
}) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return s.elevated;
      case 'outlined':
        return s.outlined;
      default:
        return s.default;
    }
  };

  const content = (
    <View style={[s.card, getCardStyle(), { padding }, style]}>
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

const makeStyles = (colors) => StyleSheet.create({
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
