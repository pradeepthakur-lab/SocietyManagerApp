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
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { validatePhone } from '../../utils/validators';

const LoginScreen = ({ navigation }) => {
  const { login, loginPending, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  const [mobile, setMobile] = useState('');
  const [selectedRole, setSelectedRole] = useState('resident');
  const [phoneError, setPhoneError] = useState(null);

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
    const result = await login(mobile, selectedRole);
    if (result) {
      navigation.navigate('OTP', { mobile, role: selectedRole });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Branding */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Icon name="city-variant" size={48} color={colors.primary} />
            </View>
            <Text style={styles.appName}>Society Manager</Text>
            <Text style={styles.tagline}>Manage your society effortlessly</Text>
          </View>

          {/* Role Selection — 2×2 Grid */}
          <Text style={styles.sectionTitle}>I am a</Text>
          <View style={styles.roleGrid}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.key}
                style={[
                  styles.roleCard,
                  selectedRole === role.key && styles.roleCardActive,
                ]}
                onPress={() => setSelectedRole(role.key)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.roleIconContainer,
                  selectedRole === role.key && styles.roleIconActive,
                ]}>
                  <Icon
                    name={role.icon}
                    size={24}
                    color={selectedRole === role.key ? colors.white : colors.textMuted}
                  />
                </View>
                <Text style={[
                  styles.roleLabel,
                  selectedRole === role.key && styles.roleLabelActive,
                ]}>
                  {role.label}
                </Text>
                <Text style={styles.roleDesc}>{role.desc}</Text>
                {selectedRole === role.key && (
                  <View style={styles.checkMark}>
                    <Icon name="check-circle" size={18} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Phone Input */}
          <View style={styles.formSection}>
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

            {error && (
              <View style={styles.errorBanner}>
                <Icon name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loginPending}
              icon="message-text-outline"
              style={styles.sendButton}
            />
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            By continuing, you agree to our Terms of Service
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
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
