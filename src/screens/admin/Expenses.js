import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import BottomSheet from '../../components/BottomSheet';
import EmptyState from '../../components/EmptyState';
import { useBilling } from '../../context/BillingContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const CATEGORIES = ['Electricity', 'Staff Salary', 'Cleaning', 'Repair', 'Maintenance', 'Other'];

const Expenses = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { expenses, loadExpenses, addExpense } = useBilling();
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { loadExpenses(); }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = async () => {
    if (!title.trim() || !amount) {
      showToast('Title and amount are required', 'error');
      return;
    }
    const success = await addExpense({
      title: title.trim(),
      amount: parseInt(amount, 10),
      category: category || 'Other',
      date,
    });
    if (success) {
      setShowAdd(false);
      setTitle('');
      setAmount('');
      setCategory('');
      showToast('Expense added successfully', 'success');
    }
  };

  const renderExpense = ({ item }) => (
    <Card style={s.card}>
      <View style={s.row}>
        <View style={s.iconWrap}>
          <Icon name="receipt" size={20} color={colors.accent} />
        </View>
        <View style={s.info}>
          <Text style={s.expTitle}>{item.title}</Text>
          <Text style={s.meta}>{item.category} • {formatDate(item.date)}</Text>
        </View>
        <Text style={s.amount}>{formatCurrency(item.amount)}</Text>
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header
        title="Expenses"
        subtitle={`Total: ${formatCurrency(totalExpenses)}`}
        onBack={() => navigation.goBack()}
        rightIcon="plus"
        onRightPress={() => setShowAdd(true)}
      />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpense}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="receipt" title="No expenses" message="Track your society expenses here" />}
      />
      <BottomSheet visible={showAdd} onClose={() => setShowAdd(false)} title="Add Expense">
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g., Electricity Bill" icon="text" />
        <Input label="Amount" value={amount} onChangeText={setAmount} placeholder="Amount in ₹" icon="currency-inr" keyboardType="number-pad" />
        <Input label="Category" value={category} onChangeText={setCategory} placeholder="e.g., Electricity" icon="tag" />
        <Input label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" icon="calendar" />
        <Button title="Add Expense" onPress={handleAdd} icon="plus" style={{ marginTop: spacing.md }} />
      </BottomSheet>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.md, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.warningLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  expTitle: { ...typography.subtitle2, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  amount: { ...typography.subtitle1, color: colors.accent },
});

export default Expenses;
