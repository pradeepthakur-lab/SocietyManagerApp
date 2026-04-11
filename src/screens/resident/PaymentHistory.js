import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PaymentHistory = ({ navigation }) => {
  const { user } = useAuth();
  const { payments, loadPayments } = useBilling();

  useEffect(() => { loadPayments({ userId: user?.id }); }, []);

  const getMethodIcon = (m) => {
    const icons = { upi: 'cellphone-nfc', bank_transfer: 'bank-transfer', cheque: 'checkbook', cash: 'cash' };
    return icons[m] || 'cash';
  };

  const renderPayment = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.timeline}>
          <View style={[styles.dot, {
            backgroundColor: item.status === 'approved' ? colors.success
              : item.status === 'rejected' ? colors.danger : colors.warning,
          }]} />
          <View style={styles.line} />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.info}>
              <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
              <Text style={styles.method}>
                <Icon name={getMethodIcon(item.paymentMethod)} size={12} color={colors.textMuted} />
                {'  '}{item.paymentMethod.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.date}>{formatDate(item.submittedAt)}</Text>
            </View>
            <StatusChip status={item.status} />
          </View>
          {item.comment && (
            <View style={styles.commentBox}>
              <Icon name="comment-text-outline" size={14} color={colors.textMuted} />
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Payment History" onBack={() => navigation.goBack()} />
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPayment}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="history" title="No payments yet" message="Your payment history will appear here" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
