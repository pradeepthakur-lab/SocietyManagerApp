import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const MyBankingDetails = ({ navigation }) => {
  const { user } = useAuth();
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    loadBankingDetails();
  }, []);

  const loadBankingDetails = async () => {
    const result = await authService.getBankingDetails(user?.id);
    if (result.success && result.data) {
      const d = result.data;
      setAccountHolder(d.accountHolder || '');
      setBankName(d.bankName || '');
      setAccountNumber(d.accountNumber || '');
      setIfsc(d.ifsc || '');
      setUpiId(d.upiId || '');
      setHasSaved(true);
    }
  };

  const handleSave = async () => {
    if (!accountHolder.trim() && !upiId.trim()) {
      Alert.alert('Error', 'Please fill at least account holder name or UPI ID');
      return;
    }

    setLoading(true);
    const result = await authService.updateBankingDetails(user?.id, {
      accountHolder: accountHolder.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      upiId: upiId.trim(),
    });
    setLoading(false);

    if (result.success) {
      setHasSaved(true);
      Alert.alert('Saved ✅', 'Your banking details have been saved. They will be used when submitting payments.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Banking Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <Card style={styles.infoBanner}>
          <View style={styles.bannerRow}>
            <Icon name="information-outline" size={20} color={colors.info} />
            <Text style={styles.bannerText}>
              Save your banking details here. They will be auto-filled when you submit a payment.
            </Text>
          </View>
        </Card>

        {hasSaved && (
          <Card variant="elevated" style={styles.savedCard}>
            <View style={styles.savedHeader}>
              <Icon name="check-decagram" size={20} color={colors.success} />
              <Text style={styles.savedText}>Banking details saved</Text>
            </View>
          </Card>
        )}

        {/* Bank Account Details */}
        <Text style={styles.sectionTitle}>Bank Account</Text>
        <Input
          label="Account Holder Name"
          value={accountHolder}
          onChangeText={setAccountHolder}
          placeholder="Name as per bank records"
          icon="account"
        />
        <Input
          label="Bank Name"
          value={bankName}
          onChangeText={setBankName}
          placeholder="e.g., HDFC Bank"
          icon="bank"
        />
        <Input
          label="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="Your account number"
          icon="numeric"
          keyboardType="number-pad"
        />
        <Input
          label="IFSC Code"
          value={ifsc}
          onChangeText={setIfsc}
          placeholder="e.g., HDFC0001234"
          icon="barcode"
          autoCapitalize="characters"
        />

        {/* UPI Details */}
        <Text style={styles.sectionTitle}>UPI Details</Text>
        <Input
          label="UPI ID"
          value={upiId}
          onChangeText={setUpiId}
          placeholder="e.g., yourname@bank"
          icon="cellphone-nfc"
        />

        <Button
          title={hasSaved ? 'Update Details' : 'Save Details'}
          onPress={handleSave}
          loading={loading}
          icon="content-save"
          style={{ marginTop: spacing.xl }}
        />

        <Text style={styles.disclaimer}>
          Your banking details are stored securely and will only be used to auto-fill payment forms. Admin/Manager can see your payment method details when verifying payments.
        </Text>

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.base },
  infoBanner: {
    backgroundColor: colors.infoLight,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  bannerText: { ...typography.body2, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  savedCard: {
    backgroundColor: colors.successLight,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  savedHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  savedText: { ...typography.subtitle2, color: colors.success },
  sectionTitle: {
    ...typography.subtitle1, color: colors.textPrimary,
    marginTop: spacing.lg, marginBottom: spacing.md,
  },
  disclaimer: {
    ...typography.caption, color: colors.textMuted, textAlign: 'center',
    marginTop: spacing.xl, lineHeight: 18,
  },
});

export default MyBankingDetails;
