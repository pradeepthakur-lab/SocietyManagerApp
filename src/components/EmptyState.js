import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

const EmptyState = ({
  icon = 'inbox-outline',
  title = 'Nothing here yet',
  message = '',
  children,
  style,
}) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={[s.container, style]}>
      <View style={s.iconContainer}>
        <Icon name={icon} size={56} color={colors.textMuted} />
      </View>
      <Text style={s.title}>{title}</Text>
      {message ? <Text style={s.message}>{message}</Text> : null}
      {children && <View style={s.action}>{children}</View>}
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h4,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body2,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.xl,
  },
});

export default EmptyState;
