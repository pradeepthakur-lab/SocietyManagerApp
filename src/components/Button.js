import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | danger | ghost
  size = 'large', // large | small
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceLight;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'danger': return colors.danger;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'outline': return colors.primary;
      case 'ghost': return colors.primary;
      default: return colors.white;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return disabled ? colors.border : colors.primary;
    return 'transparent';
  };

  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: isSmall ? spacing.buttonHeightSmall : spacing.buttonHeight,
          paddingHorizontal: isSmall ? spacing.base : spacing.xl,
          borderRadius: isSmall ? spacing.radiusSmall : spacing.buttonRadius,
          ...(fullWidth ? {} : { alignSelf: 'flex-start' }),
        },
        variant === 'outline' && styles.outline,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && !iconRight && (
            <Icon
              name={icon}
              size={isSmall ? 16 : 20}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              isSmall ? typography.buttonSmall : typography.button,
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconRight && (
            <Icon
              name={icon}
              size={isSmall ? 16 : 20}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  outline: {
    borderWidth: 1.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
