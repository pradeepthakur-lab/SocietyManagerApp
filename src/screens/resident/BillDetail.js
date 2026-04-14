import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName, formatDate } from '../../utils/formatDate';

const BillDetail = ({ route, navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { bill } = route.params;
  const canPay = bill.status === 'unpaid';

  return (
    <View style={s.container}>
      <Header title="Bill Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Bill Header */}
        <Card variant="elevated" style={s.headerCard}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.period}>{getMonthName(bill.month)} {bill.year}</Text>
              <Text style={s.flat}>Flat {bill.flatNumber}</Text>
            </View>
            <StatusChip status={bill.status} />
          </View>
          <View style={s.divider} />
          <View style={s.amountRow}>
            <Text style={s.amountLabel}>Total Amount</Text>
            <Text style={s.amount}>{formatCurrency(bill.totalAmount + bill.lateFee)}</Text>
          </View>
        </Card>

        {/* Charges Breakdown */}
        <Text style={s.sectionTitle}>Charges Breakdown</Text>
        <Card>
          {bill.charges.map((charge, idx) => (
            <View key={idx} style={s.chargeRow}>
              <Text style={s.chargeName}>{charge.name}</Text>
              <Text style={s.chargeAmount}>{formatCurrency(charge.amount)}</Text>
            </View>
          ))}
          {bill.lateFee > 0 && (
            <View style={s.chargeRow}>
              <Text style={[s.chargeName, { color: colors.danger }]}>Late Fee</Text>
              <Text style={[s.chargeAmount, { color: colors.danger }]}>{formatCurrency(bill.lateFee)}</Text>
            </View>
          )}
          {bill.previousDue > 0 && (
            <View style={s.chargeRow}>
              <Text style={s.chargeName}>Previous Due</Text>
              <Text style={s.chargeAmount}>{formatCurrency(bill.previousDue)}</Text>
            </View>
          )}
          <View style={s.totalDivider} />
          <View style={s.chargeRow}>
            <Text style={s.totalLabel}>Grand Total</Text>
            <Text style={s.totalAmount}>{formatCurrency(bill.totalAmount + bill.lateFee + bill.previousDue)}</Text>
          </View>
        </Card>

        {/* Bill Info */}
        <Text style={s.sectionTitle}>Bill Information</Text>
        <Card>
          <View style={s.infoRow}>
            <Icon name="identifier" size={16} color={colors.textMuted} />
            <Text style={s.infoLabel}>Bill ID</Text>
            <Text style={s.infoValue}>{bill.id}</Text>
          </View>
          <View style={s.infoRow}>
            <Icon name="calendar" size={16} color={colors.textMuted} />
            <Text style={s.infoLabel}>Due Date</Text>
            <Text style={s.infoValue}>{formatDate(bill.dueDate)}</Text>
          </View>
          <View style={s.infoRow}>
            <Icon name="clock" size={16} color={colors.textMuted} />
            <Text style={s.infoLabel}>Generated</Text>
            <Text style={s.infoValue}>{formatDate(bill.createdAt)}</Text>
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

const makeStyles = (colors) => StyleSheet.create({
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
