import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { validatePhone } from '../../utils/validators';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { login, loginPending, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  const [mobile, setMobile] = useState('');
  const [societyCode, setSocietyCode] = useState('');
  const [selectedRole, setSelectedRole] = useState('resident');
  const [phoneError, setPhoneError] = useState(null);
  const [societyCodeError, setSocietyCodeError] = useState(null);

  const roles = [
    { key: 'resident', label: 'Resident', icon: 'home-account', desc: 'View bills & pay' },
    { key: 'admin', label: 'Admin', icon: 'shield-account', desc: 'Manage society' },
    { key: 'manager', label: 'Manager', icon: 'account-tie', desc: 'Verify & manage' },
    { key: 'security', label: 'Security', icon: 'shield-check', desc: 'Gate & visitors' },
  ];

  const handleSendOTP = async () => {
    clearError();
    const validationError = validatePhone(mobile);
    if (validationError) {
      setPhoneError(validationError);
      return;
    }
    setPhoneError(null);
    const normalizedSocietyCode = societyCode.trim().toUpperCase();
    if (selectedRole !== 'admin' && !normalizedSocietyCode) {
      setSocietyCodeError('Society code is required');
      return;
    }
    setSocietyCodeError(null);
    const result = await login(mobile, selectedRole, selectedRole === 'admin' ? null : normalizedSocietyCode);
    if (result) {
      navigation.navigate('OTP', { mobile, role: selectedRole, societyCode: selectedRole === 'admin' ? null : normalizedSocietyCode });
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={s.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Server Settings Button */}
          <TouchableOpacity
            style={s.settingsButton}
            onPress={() => navigation.navigate('ServerSettings')}
            activeOpacity={0.7}
          >
            <Icon name="cog-outline" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Logo / Branding */}
          <View style={s.brandSection}>
            <View style={s.logoContainer}>
              <Icon name="city-variant" size={48} color={colors.primary} />
            </View>
            <Text style={s.appName}>Society Manager</Text>
            <Text style={s.tagline}>Manage your society effortlessly</Text>
          </View>

          {/* Role Selection — 2×2 Grid */}
          <Text style={s.sectionTitle}>I am a</Text>
          <View style={s.roleGrid}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.key}
                style={[
                  s.roleCard,
                  selectedRole === role.key && s.roleCardActive,
                ]}
                onPress={() => setSelectedRole(role.key)}
                activeOpacity={0.7}
              >
                <View style={[
                  s.roleIconContainer,
                  selectedRole === role.key && s.roleIconActive,
                ]}>
                  <Icon
                    name={role.icon}
                    size={24}
                    color={selectedRole === role.key ? colors.white : colors.textMuted}
                  />
                </View>
                <Text style={[
                  s.roleLabel,
                  selectedRole === role.key && s.roleLabelActive,
                ]}>
                  {role.label}
                </Text>
                <Text style={s.roleDesc}>{role.desc}</Text>
                {selectedRole === role.key && (
                  <View style={s.checkMark}>
                    <Icon name="check-circle" size={18} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Phone Input */}
          <View style={s.formSection}>
            <Input
              label="Mobile Number"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text.replace(/\D/g, ''));
                setPhoneError(null);
              }}
              placeholder="Enter 10-digit mobile number"
              icon="cellphone"
              keyboardType="phone-pad"
              maxLength={10}
              error={phoneError}
            />

            {selectedRole !== 'admin' && (
              <Input
                label="Society Code"
                value={societyCode}
                onChangeText={(text) => {
                  setSocietyCode(text.toUpperCase().replace(/\s/g, ''));
                  setSocietyCodeError(null);
                }}
                placeholder="Enter society code"
                icon="office-building-marker"
                autoCapitalize="characters"
                error={societyCodeError}
              />
            )}

            {error && (
              <View style={s.errorBanner}>
                <Icon name="alert-circle" size={16} color={colors.danger} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loginPending}
              icon="message-text-outline"
              style={s.sendButton}
            />
          </View>

          {/* Footer */}
          <Text style={s.footer}>
            By continuing, you agree to our Terms of Service
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  settingsButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  appName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body2,
    color: colors.textMuted,
  },
  sectionTitle: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  roleCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  roleIconActive: {
    backgroundColor: colors.primary,
  },
  roleLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  roleLabelActive: {
    color: colors.textPrimary,
  },
  roleDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  formSection: {
    marginTop: spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusSmall,
    marginBottom: spacing.base,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginLeft: 8,
  },
  sendButton: {
    marginTop: spacing.sm,
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});

export default LoginScreen;
