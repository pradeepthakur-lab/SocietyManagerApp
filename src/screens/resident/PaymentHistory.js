import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PaymentHistory = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { user } = useAuth();
  const { payments, loadPayments } = useBilling();

  useEffect(() => { loadPayments({ userId: user?.id }); }, []);

  const getMethodIcon = (m) => {
    const icons = { upi: 'cellphone-nfc', bank_transfer: 'bank-transfer', cheque: 'checkbook', cash: 'cash' };
    return icons[m] || 'cash';
  };

  const renderPayment = ({ item }) => (
    <Card style={s.card}>
      <View style={s.row}>
        <View style={s.timeline}>
          <View style={[s.dot, {
            backgroundColor: item.status === 'approved' ? colors.success
              : item.status === 'rejected' ? colors.danger : colors.warning,
          }]} />
          <View style={s.line} />
        </View>
        <View style={s.content}>
          <View style={s.header}>
            <View style={s.info}>
              <Text style={s.amount}>{formatCurrency(item.amount)}</Text>
              <Text style={s.method}>
                <Icon name={getMethodIcon(item.paymentMethod)} size={12} color={colors.textMuted} />
                {'  '}{item.paymentMethod.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={s.date}>{formatDate(item.submittedAt)}</Text>
            </View>
            <StatusChip status={item.status} />
          </View>
          {item.comment && (
            <View style={s.commentBox}>
              <Icon name="comment-text-outline" size={14} color={colors.textMuted} />
              <Text style={s.comment}>{item.comment}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header title="Payment History" onBack={() => navigation.goBack()} />
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPayment}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="history" title="No payments yet" message="Your payment history will appear here" />
        }
      />
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.md, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row' },
  timeline: { alignItems: 'center', marginRight: spacing.md, width: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  line: { width: 2, flex: 1, backgroundColor: colors.divider, marginTop: 4 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  info: { flex: 1 },
  amount: { ...typography.subtitle1, color: colors.textPrimary },
  method: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  commentBox: {
    flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm,
    backgroundColor: colors.surface, padding: spacing.sm, borderRadius: spacing.radiusSmall,
  },
  comment: { ...typography.caption, color: colors.textSecondary, marginLeft: 6, flex: 1 },
});

export default PaymentHistory;
