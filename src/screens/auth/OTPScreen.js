import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const OTP_LENGTH = 4;

const OTPScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { mobile, role, societyCode } = route.params;
  const { verifyOTP, loginPending, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOTPChange = (value, index) => {
    clearError();
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) return;
    await verifyOTP(mobile, otpString, role, societyCode);
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior="padding"
        style={s.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={s.content}>
          {/* Icon */}
          <View style={s.iconContainer}>
            <Icon name="shield-lock-outline" size={40} color={colors.primary} />
          </View>

          <Text style={s.title}>Verify OTP</Text>
          <Text style={s.subtitle}>
            Enter the 4-digit code sent to{'\n'}
            <Text style={s.phoneText}>+91 {mobile}</Text>
          </Text>

          {/* OTP Inputs */}
          <View style={s.otpContainer}>
            {Array(OTP_LENGTH)
              .fill(0)
              .map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    s.otpInput,
                    otp[index] && s.otpInputFilled,
                    error && s.otpInputError,
                  ]}
                  value={otp[index]}
                  onChangeText={(value) =>
                    handleOTPChange(value.replace(/\D/g, ''), index)
                  }
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  selectionColor={colors.primary}
                />
              ))}
          </View>

          {error && (
            <View style={s.errorContainer}>
              <Icon name="alert-circle" size={14} color={colors.danger} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* Resend */}
          <View style={s.resendContainer}>
            {timer > 0 ? (
              <Text style={s.timerText}>
                Resend OTP in <Text style={s.timerCount}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={s.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loginPending}
            disabled={!isComplete}
            icon="check-circle-outline"
            style={s.verifyButton}
          />

          {/* <Text style={s.hint}>
            For demo, enter any 4-digit code (e.g. 1234)
          </Text> */}
        </View>
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
  backButton: {
    padding: spacing.base,
    marginLeft: spacing.sm,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  phoneText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  otpInput: {
    width: 56,
    height: 60,
    borderRadius: spacing.radiusMedium,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  otpInputError: {
    borderColor: colors.danger,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginLeft: 6,
  },
  resendContainer: {
    marginBottom: spacing.xxl,
  },
  timerText: {
    ...typography.body2,
    color: colors.textMuted,
  },
  timerCount: {
    color: colors.primary,
    fontWeight: '600',
  },
  resendText: {
    ...typography.subtitle2,
    color: colors.primary,
  },
  verifyButton: {
    width: '100%',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xl,
    fontStyle: 'italic',
  },
});

export default OTPScreen;
