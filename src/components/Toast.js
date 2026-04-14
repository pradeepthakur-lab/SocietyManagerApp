import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

const ICONS = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert',
  info: 'information',
};

const Toast = () => {
  const { toast, hideToast } = useToast();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 120, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [toast]);

  if (!toast) return null;

  const getColor = () => {
    switch (toast.type) {
      case 'success': return colors.success;
      case 'error': return colors.danger;
      case 'warning': return colors.warning;
      case 'info': return colors.info;
      default: return colors.success;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success': return colors.successLight;
      case 'error': return colors.dangerLight;
      case 'warning': return colors.warningLight;
      case 'info': return colors.infoLight;
      default: return colors.successLight;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + spacing.tabBarHeight + spacing.md,
          transform: [{ translateY }],
          opacity,
          backgroundColor: getBg(),
          borderLeftColor: getColor(),
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity style={styles.row} onPress={hideToast} activeOpacity={0.8}>
        <Icon name={ICONS[toast.type] || ICONS.success} size={22} color={getColor()} />
        <Text style={[styles.message, { color: colors.textPrimary }]} numberOfLines={2}>
          {toast.message}
        </Text>
        <Icon name="close" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.screenHorizontal,
    right: spacing.screenHorizontal,
    zIndex: 9999,
    borderRadius: spacing.radiusMedium,
    borderLeftWidth: 4,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  message: {
    ...typography.body2,
    flex: 1,
    marginHorizontal: spacing.md,
  },
});

export default Toast;
