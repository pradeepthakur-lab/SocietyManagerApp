import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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
import { getMonthName } from '../../utils/formatDate';

const BillsList = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { user } = useAuth();
  const { bills, loadBills } = useBilling();

  useEffect(() => { loadBills({ userId: user?.id }); }, []);

  const renderBill = ({ item }) => (
    <Card
      style={s.card}
      onPress={() => navigation.navigate('BillDetail', { bill: item })}
    >
      <View style={s.row}>
        <View style={s.monthBadge}>
          <Text style={s.monthText}>{getMonthName(item.month).substring(0, 3)}</Text>
          <Text style={s.yearText}>{item.year}</Text>
        </View>
        <View style={s.info}>
          <Text style={s.billTitle}>{getMonthName(item.month)} {item.year}</Text>
          <Text style={s.flatText}>Flat {item.flatNumber}</Text>
          <Text style={s.dueText}>Due: {item.dueDate}</Text>
        </View>
        <View style={s.right}>
          <Text style={s.amount}>{formatCurrency(item.totalAmount)}</Text>
          <StatusChip status={item.status} />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header title="My Bills" onBack={() => navigation.goBack()} />
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={renderBill}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="file-document-outline" title="No bills" message="Your bills will appear here" />
        }
      />
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.md, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  monthBadge: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.primaryGlow, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  monthText: { ...typography.subtitle2, color: colors.primary, fontSize: 13 },
  yearText: { ...typography.caption, color: colors.primary, fontSize: 10 },
  info: { flex: 1 },
  billTitle: { ...typography.subtitle2, color: colors.textPrimary },
  flatText: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  dueText: { ...typography.caption, color: colors.textMuted },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { ...typography.subtitle1, color: colors.textPrimary },
});

export default BillsList;
