import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import { useBilling } from '../../context/BillingContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';

const { width } = Dimensions.get('window');

const Reports = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { reportData, loadReportData, loading } = useBilling();

  useEffect(() => {
    loadReportData();
  }, []);

  const data = reportData || {};

  const summaryCards = [
    { icon: 'cash-check', label: 'Total Collected', value: formatCurrency(data.totalCollection || 0), color: colors.success },
    { icon: 'cash-clock', label: 'Pending Amount', value: formatCurrency(data.pendingAmount || 0), color: colors.warning },
    { icon: 'cash-minus', label: 'Total Expenses', value: formatCurrency(data.totalExpenses || 0), color: colors.danger },
    { icon: 'home-group', label: 'Occupied Flats', value: `${data.occupiedFlats || 0} / ${data.totalFlats || 0}`, color: colors.info },
  ];

  return (
    <View style={s.container}>
      <Header title="Reports" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <Text style={s.sectionTitle}>Overview</Text>
        <View style={s.grid}>
          {summaryCards.map((card, idx) => (
            <Card key={idx} style={s.summaryCard}>
              <View style={[s.cardIcon, { backgroundColor: card.color + '20' }]}>
                <Icon name={card.icon} size={22} color={card.color} />
              </View>
              <Text style={s.cardValue}>{card.value}</Text>
              <Text style={s.cardLabel}>{card.label}</Text>
            </Card>
          ))}
        </View>

        {/* Monthly Bar Chart (simplified without chart lib dependency issues) */}
        <Text style={s.sectionTitle}>Monthly Collection</Text>
        <Card style={s.chartCard}>
          {(data.monthlyData || []).map((m, i) => {
            const maxVal = Math.max(
              ...((data.monthlyData || []).map((d) => Math.max(d.collection, d.expenses))),
              1
            );
            const collectionHeight = (m.collection / maxVal) * 100;
            const expenseHeight = (m.expenses / maxVal) * 100;
            return (
              <View key={i} style={s.barGroup}>
                <View style={s.barContainer}>
                  <View style={[s.bar, s.barCollection, { height: collectionHeight }]} />
                  <View style={[s.bar, s.barExpense, { height: expenseHeight }]} />
                </View>
                <Text style={s.barLabel}>{m.month}</Text>
              </View>
            );
          })}
          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: colors.success }]} />
              <Text style={s.legendText}>Collection</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: colors.danger }]} />
              <Text style={s.legendText}>Expenses</Text>
            </View>
          </View>
        </Card>

        {/* Defaulters */}
        <Text style={s.sectionTitle}>Defaulters</Text>
        {(data.defaulters || []).length === 0 ? (
          <Card><Text style={s.emptyText}>No defaulters 🎉</Text></Card>
        ) : (
          (data.defaulters || []).map((d, idx) => (
            <Card key={idx} style={s.defaulterCard}>
              <View style={s.defaulterRow}>
                <View style={s.defaulterAvatar}>
                  <Icon name="account-alert" size={18} color={colors.danger} />
                </View>
                <View style={s.defaulterInfo}>
                  <Text style={s.defaulterName}>{d.residentName}</Text>
                  <Text style={s.defaulterMeta}>{d.flatNumber} • Due: {d.dueDate}</Text>
                </View>
                <Text style={s.defaulterAmt}>{formatCurrency(d.amount)}</Text>
              </View>
            </Card>
          ))
        )}

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  summaryCard: { width: '47%', padding: spacing.base, alignItems: 'flex-start' },
  cardIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  cardValue: { ...typography.h4, color: colors.textPrimary, marginBottom: 2 },
  cardLabel: { ...typography.caption, color: colors.textMuted },
  chartCard: {
    padding: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barGroup: { alignItems: 'center', width: 50 },
  barContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 110 },
  bar: { width: 16, borderRadius: 4, minHeight: 4 },
  barCollection: { backgroundColor: colors.success },
  barExpense: { backgroundColor: colors.danger },
  barLabel: { ...typography.caption, color: colors.textMuted, marginTop: 6 },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: spacing.base,
    gap: spacing.xl,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { ...typography.caption, color: colors.textMuted },
  emptyText: { ...typography.body2, color: colors.textMuted, textAlign: 'center', padding: spacing.lg },
  defaulterCard: { marginBottom: spacing.sm },
  defaulterRow: { flexDirection: 'row', alignItems: 'center' },
  defaulterAvatar: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.dangerLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  defaulterInfo: { flex: 1 },
  defaulterName: { ...typography.subtitle2, color: colors.textPrimary },
  defaulterMeta: { ...typography.caption, color: colors.textMuted },
  defaulterAmt: { ...typography.subtitle1, color: colors.danger },
});

export default Reports;
