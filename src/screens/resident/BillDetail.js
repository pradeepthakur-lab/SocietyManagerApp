import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName, formatDate } from '../../utils/formatDate';

const BillDetail = ({ route, navigation }) => {
  const { bill } = route.params;
  const canPay = bill.status === 'unpaid';

  return (
    <View style={styles.container}>
      <Header title="Bill Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bill Header */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.period}>{getMonthName(bill.month)} {bill.year}</Text>
              <Text style={styles.flat}>Flat {bill.flatNumber}</Text>
            </View>
            <StatusChip status={bill.status} />
          </View>
          <View style={styles.divider} />
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amount}>{formatCurrency(bill.totalAmount + bill.lateFee)}</Text>
          </View>
        </Card>

        {/* Charges Breakdown */}
        <Text style={styles.sectionTitle}>Charges Breakdown</Text>
        <Card>
          {bill.charges.map((charge, idx) => (
            <View key={idx} style={styles.chargeRow}>
              <Text style={styles.chargeName}>{charge.name}</Text>
              <Text style={styles.chargeAmount}>{formatCurrency(charge.amount)}</Text>
            </View>
          ))}
          {bill.lateFee > 0 && (
            <View style={styles.chargeRow}>
              <Text style={[styles.chargeName, { color: colors.danger }]}>Late Fee</Text>
              <Text style={[styles.chargeAmount, { color: colors.danger }]}>{formatCurrency(bill.lateFee)}</Text>
            </View>
          )}
          {bill.previousDue > 0 && (
            <View style={styles.chargeRow}>
              <Text style={styles.chargeName}>Previous Due</Text>
              <Text style={styles.chargeAmount}>{formatCurrency(bill.previousDue)}</Text>
            </View>
          )}
          <View style={styles.totalDivider} />
          <View style={styles.chargeRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(bill.totalAmount + bill.lateFee + bill.previousDue)}</Text>
          </View>
        </Card>

        {/* Bill Info */}
        <Text style={styles.sectionTitle}>Bill Information</Text>
        <Card>
          <View style={styles.infoRow}>
            <Icon name="identifier" size={16} color={colors.textMuted} />
            <Text style={styles.infoLabel}>Bill ID</Text>
            <Text style={styles.infoValue}>{bill.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color={colors.textMuted} />
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{formatDate(bill.dueDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="clock" size={16} color={colors.textMuted} />
            <Text style={styles.infoLabel}>Generated</Text>
            <Text style={styles.infoValue}>{formatDate(bill.createdAt)}</Text>
          </View>
        </Card>

        {canPay && (
          <Button
            title="Pay This Bill"
            onPress={() => navigation.navigate('SubmitPayment', { bill })}
            icon="cash-fast"
            style={{ marginTop: spacing.xl }}
          />
        )}

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.base },
  headerCard: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  period: { ...typography.h3, color: colors.textPrimary },
  flat: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { ...typography.body2, color: colors.textMuted },
  amount: { ...typography.h2, color: colors.primary },
  sectionTitle: { ...typography.subtitle1, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  chargeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  chargeName: { ...typography.body2, color: colors.textSecondary },
  chargeAmount: { ...typography.subtitle2, color: colors.textPrimary },
  totalDivider: { height: 2, backgroundColor: colors.primary, marginVertical: spacing.sm, opacity: 0.3 },
  totalLabel: { ...typography.subtitle1, color: colors.textPrimary },
  totalAmount: { ...typography.h4, color: colors.primary },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  infoLabel: { ...typography.caption, color: colors.textMuted, marginLeft: spacing.sm, flex: 1 },
  infoValue: { ...typography.body2, color: colors.textPrimary },
});

export default BillDetail;
