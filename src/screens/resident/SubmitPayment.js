import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { PAYMENT_METHODS } from '../../constants/roles';
import authService from '../../services/authService';

const methodOptions = [
  { key: PAYMENT_METHODS.UPI, label: 'UPI', icon: 'cellphone-nfc' },
  { key: PAYMENT_METHODS.BANK_TRANSFER, label: 'Bank Transfer', icon: 'bank-transfer' },
  { key: PAYMENT_METHODS.CHEQUE, label: 'Cheque', icon: 'checkbook' },
  { key: PAYMENT_METHODS.CASH, label: 'Cash', icon: 'cash' },
];

const SubmitPayment = ({ route, navigation }) => {
  const { bill } = route.params;
  const { user } = useAuth();
  const { submitPayment } = useBilling();

  const [method, setMethod] = useState(PAYMENT_METHODS.UPI);
  const [transactionId, setTransactionId] = useState('');
  const [appName, setAppName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  // Auto-fill from saved banking details
  useEffect(() => {
    loadBankingDetails();
  }, []);

  const loadBankingDetails = async () => {
    const result = await authService.getBankingDetails(user?.id);
    if (result.success && result.data) {
      const d = result.data;
      setBankName(d.bankName || '');
      setAccountNumber(d.accountNumber ? '****' + d.accountNumber.slice(-4) : '');
      if (d.upiId) setAppName(d.upiId);
      setHasBankDetails(true);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (method === PAYMENT_METHODS.UPI && !transactionId.trim()) {
      Alert.alert('Error', 'UPI Transaction ID is required');
      return;
    }
    if (method === PAYMENT_METHODS.BANK_TRANSFER && !referenceNumber.trim()) {
      Alert.alert('Error', 'Reference number is required');
      return;
    }
    if (method === PAYMENT_METHODS.CHEQUE && !chequeNumber.trim()) {
      Alert.alert('Error', 'Cheque number is required');
      return;
    }

    setLoading(true);
    const paymentData = {
      billId: bill.id,
      userId: user.id,
      userName: user.name,
      flatNumber: bill.flatNumber,
      amount: bill.totalAmount + bill.lateFee,
      paymentMethod: method,
      notes,
      // Method-specific fields
      ...(method === PAYMENT_METHODS.UPI && { transactionId, appName }),
      ...(method === PAYMENT_METHODS.BANK_TRANSFER && { referenceNumber, bankName }),
      ...(method === PAYMENT_METHODS.CHEQUE && { chequeNumber, bankName, chequeDate }),
      ...(method === PAYMENT_METHODS.CASH && { receivedBy }),
    };

    const success = await submitPayment(paymentData);
    setLoading(false);

    if (success) {
      Alert.alert(
        'Payment Submitted! ✅',
        'Your payment details have been submitted for verification. You will be notified once the admin approves it.',
        [{ text: 'OK', onPress: () => navigation.popToTop() }],
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Submit Payment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Summary */}
        <Card variant="elevated" style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amount}>{formatCurrency(bill.totalAmount + bill.lateFee)}</Text>
          <Text style={styles.billRef}>Bill: {bill.flatNumber} • {bill.id}</Text>
        </Card>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.methodGrid}>
          {methodOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.methodCard, method === opt.key && styles.methodCardActive]}
              onPress={() => setMethod(opt.key)}
              activeOpacity={0.7}
            >
              <Icon
                name={opt.icon}
                size={24}
                color={method === opt.key ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.methodLabel, method === opt.key && styles.methodLabelActive]}>
                {opt.label}
              </Text>
              {method === opt.key && (
                <Icon name="check-circle" size={16} color={colors.primary} style={styles.methodCheck} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Fields */}
        <Text style={styles.sectionTitle}>Payment Details</Text>

        {hasBankDetails && (
          <Card style={styles.prefillBanner}>
            <View style={styles.prefillRow}>
              <Icon name="check-decagram" size={16} color={colors.success} />
              <Text style={styles.prefillText}>
                Bank details auto-filled from your saved info ({bankName})
              </Text>
            </View>
          </Card>
        )}

        {method === PAYMENT_METHODS.UPI && (
          <>
            <Input label="UPI Transaction ID" value={transactionId} onChangeText={setTransactionId} placeholder="e.g., UPI123456789" icon="identifier" />
            <Input label="App Name (optional)" value={appName} onChangeText={setAppName} placeholder="e.g., Google Pay, PhonePe" icon="cellphone" />
          </>
        )}

        {method === PAYMENT_METHODS.BANK_TRANSFER && (
          <>
            <Input label="Reference Number" value={referenceNumber} onChangeText={setReferenceNumber} placeholder="NEFT/RTGS reference" icon="barcode" />
            <Input label="Bank Name" value={bankName} onChangeText={setBankName} placeholder="e.g., HDFC Bank" icon="bank" />
          </>
        )}

        {method === PAYMENT_METHODS.CHEQUE && (
          <>
            <Input label="Cheque Number" value={chequeNumber} onChangeText={setChequeNumber} placeholder="Cheque number" icon="checkbook" />
            <Input label="Bank Name" value={bankName} onChangeText={setBankName} placeholder="e.g., ICICI Bank" icon="bank" />
            <Input label="Cheque Date" value={chequeDate} onChangeText={setChequeDate} placeholder="YYYY-MM-DD" icon="calendar" />
          </>
        )}

        {method === PAYMENT_METHODS.CASH && (
          <Input label="Received By" value={receivedBy} onChangeText={setReceivedBy} placeholder="Name of person who received" icon="account" />
        )}

        <Input label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Any additional notes" icon="note-text" multiline numberOfLines={2} />

        <Button
          title="Submit Payment"
          onPress={handleSubmit}
          loading={loading}
          icon="send-check"
          style={{ marginTop: spacing.lg }}
        />

        <Text style={styles.disclaimer}>
          After submission, the admin will verify your payment against their bank records. You will be notified of the result.
        </Text>

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.base },
  amountCard: { padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  amountLabel: { ...typography.caption, color: colors.textMuted },
  amount: { ...typography.h1, color: colors.primary, marginTop: 4 },
  billRef: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  sectionTitle: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: spacing.md },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  methodCard: {
    width: '47%', padding: spacing.base, borderRadius: spacing.cardRadius,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center',
  },
  methodCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryGlow },
  methodLabel: { ...typography.subtitle2, color: colors.textMuted, marginTop: spacing.sm },
  methodLabelActive: { color: colors.primary },
  methodCheck: { position: 'absolute', top: 8, right: 8 },
  disclaimer: {
    ...typography.caption, color: colors.textMuted, textAlign: 'center',
    marginTop: spacing.xl, lineHeight: 18,
  },
  prefillBanner: {
    backgroundColor: colors.successLight, padding: spacing.md, marginBottom: spacing.md,
  },
  prefillRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prefillText: { ...typography.caption, color: colors.success, flex: 1 },
});

export default SubmitPayment;
