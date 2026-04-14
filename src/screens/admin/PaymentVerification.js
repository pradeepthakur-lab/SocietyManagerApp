import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import EmptyState from '../../components/EmptyState';
import { useBilling } from '../../context/BillingContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PaymentVerification = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { payments, loadPayments, loading } = useBilling();

  useEffect(() => {
    loadPayments();
  }, []);

  const pendingPayments = payments.filter((p) => p.status === 'pending_verification');
  const allPayments = [...payments].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
  );

  const getMethodIcon = (method) => {
    switch (method) {
      case 'upi': return 'cellphone-nfc';
      case 'bank_transfer': return 'bank-transfer';
      case 'cheque': return 'checkbook';
      case 'cash': return 'cash';
      default: return 'cash';
    }
  };

  const renderPayment = ({ item }) => (
    <Card
      style={s.card}
      onPress={() => navigation.navigate('PaymentDetail', { payment: item })}
    >
      <View style={s.row}>
        <View style={s.iconWrap}>
          <Icon
            name={getMethodIcon(item.paymentMethod)}
            size={22}
            color={colors.primary}
          />
        </View>
        <View style={s.info}>
          <Text style={s.name}>{item.userName}</Text>
          <Text style={s.meta}>
            {item.flatNumber} • {item.paymentMethod.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={s.date}>{formatDate(item.submittedAt)}</Text>
        </View>
        <View style={s.right}>
          <Text style={s.amount}>{formatCurrency(item.amount)}</Text>
          <StatusChip status={item.status} />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header
        title="Payment Verification"
        subtitle={`${pendingPayments.length} pending`}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={allPayments}
        keyExtractor={(item) => item.id}
        renderItem={renderPayment}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="check-decagram-outline"
            title="No payments"
            message="Payments submitted by residents will appear here"
          />
        }
      />
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  name: { ...typography.subtitle2, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { ...typography.subtitle1, color: colors.textPrimary },
});

export default PaymentVerification;
