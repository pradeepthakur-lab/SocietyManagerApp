import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

const Header = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  rightComponent,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const s = makeStyles(colors);

  return (
    <View
      style={[
        s.container,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: transparent ? 'transparent' : colors.background,
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={s.content}>
        <View style={s.left}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={s.backButton}>
              <Icon name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={s.titleContainer}>
            <Text style={s.title} numberOfLines={1}>{title}</Text>
            {subtitle && (
              <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text>
            )}
          </View>
        </View>
        <View style={s.right}>
          {rightComponent}
          {rightIcon && (
            <TouchableOpacity onPress={onRightPress} style={s.rightButton}>
              <Icon name={rightIcon} size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.md,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightButton: {
    padding: 4,
    marginLeft: spacing.sm,
  },
});

export default Header;
