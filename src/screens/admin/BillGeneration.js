import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useBilling } from '../../context/BillingContext';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName } from '../../utils/formatDate';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: getMonthName(i),
}));

const BillGeneration = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { charges, loadCharges, generateBills, loading } = useBilling();
  const { showToast } = useToast();
  const { flats, society } = useSociety();
  const arrearsRate = society?.arrearsInterestRate || 0;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [editableCharges, setEditableCharges] = useState([]);

  useEffect(() => {
    loadCharges();
  }, []);

  useEffect(() => {
    if (charges.length > 0) {
      setEditableCharges(charges.map((c) => ({ ...c })));
    }
  }, [charges]);

  const occupiedFlats = flats.filter((f) => f.status === 'occupied');
  const totalPerFlat = editableCharges.reduce((sum, c) => sum + c.amount, 0);
  const totalAll = totalPerFlat * occupiedFlats.length;

  const updateChargeAmount = (index, amount) => {
    const updated = [...editableCharges];
    updated[index].amount = parseInt(amount, 10) || 0;
    setEditableCharges(updated);
  };

  const handleGenerate = async () => {
    if (editableCharges.length === 0) {
      showToast('Please configure at least one charge', 'error');
      return;
    }

    Alert.alert(
      'Generate Bills',
      `Generate bills for ${getMonthName(selectedMonth)} ${selectedYear}?\n\n${occupiedFlats.length} flats × ${formatCurrency(totalPerFlat)} = ${formatCurrency(totalAll)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            const result = await generateBills(selectedMonth, selectedYear, editableCharges);
            if (result) {
              showToast(`${result.length} bills generated successfully!`, 'success');
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  return (
    <View style={s.container}>
      <Header title="Generate Bills" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Month Selector */}
        <Text style={s.sectionTitle}>Billing Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.monthScroll}>
          {MONTHS.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[
                s.monthChip,
                selectedMonth === m.value && s.monthChipActive,
              ]}
              onPress={() => setSelectedMonth(m.value)}
            >
              <Text
                style={[
                  s.monthText,
                  selectedMonth === m.value && s.monthTextActive,
                ]}
              >
                {m.label.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Input
          label="Year"
          value={selectedYear.toString()}
          onChangeText={(v) => setSelectedYear(parseInt(v, 10) || now.getFullYear())}
          keyboardType="number-pad"
          icon="calendar"
          maxLength={4}
        />

        {/* Charges */}
        <Text style={s.sectionTitle}>Charges Configuration</Text>
        {editableCharges.map((charge, index) => (
          <Card key={charge.id} style={s.chargeCard}>
            <View style={s.chargeRow}>
              <Text style={s.chargeName}>{charge.name}</Text>
              <View style={s.chargeInput}>
                <Text style={s.currencySymbol}>₹</Text>
                <Input
                  value={charge.amount.toString()}
                  onChangeText={(v) => updateChargeAmount(index, v)}
                  keyboardType="number-pad"
                  style={s.chargeInputField}
                />
              </View>
            </View>
          </Card>
        ))}

        {/* Summary */}
        <Card variant="elevated" style={s.summaryCard}>
          <View style={s.summaryHeader}>
            <Icon name="calculator" size={24} color={colors.primary} />
            <Text style={s.summaryTitle}>Bill Summary</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Period</Text>
            <Text style={s.summaryValue}>{getMonthName(selectedMonth)} {selectedYear}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Occupied Flats</Text>
            <Text style={s.summaryValue}>{occupiedFlats.length}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Per Flat</Text>
            <Text style={s.summaryValue}>{formatCurrency(totalPerFlat)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total Collection</Text>
            <Text style={s.totalValue}>{formatCurrency(totalAll)}</Text>
          </View>
          {arrearsRate > 0 && (
            <View style={s.arrearsNote}>
              <Icon name="information-outline" size={16} color={colors.warning} />
              <Text style={s.arrearsNoteText}>
                Unpaid bills will be auto-added as arrears + {arrearsRate}% interest
              </Text>
            </View>
          )}
        </Card>

        <Button
          title={`Generate ${occupiedFlats.length} Bills`}
          onPress={handleGenerate}
          loading={loading}
          icon="file-document-multiple"
          style={{ marginTop: spacing.lg }}
        />
        <Button
          title="View & Share Invoices"
          variant="outline"
          icon="file-pdf-box"
          onPress={() => navigation.navigate('BillInvoice')}
          style={{ marginTop: spacing.md }}
        />

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.base },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  monthScroll: { marginBottom: spacing.base },
  monthChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthChipActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  monthText: {
    ...typography.subtitle2,
    color: colors.textMuted,
  },
  monthTextActive: {
    color: colors.primary,
  },
  chargeCard: { marginBottom: spacing.sm, padding: spacing.md },
  chargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chargeName: {
    ...typography.body2,
    color: colors.textPrimary,
    flex: 1,
  },
  chargeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  currencySymbol: {
    ...typography.subtitle1,
    color: colors.textMuted,
    marginRight: 4,
  },
  chargeInputField: { marginBottom: 0, flex: 1 },
  summaryCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body2,
    color: colors.textMuted,
  },
  summaryValue: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h4,
    color: colors.primary,
  },
  arrearsNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: spacing.radiusSmall,
    marginTop: spacing.md,
  },
  arrearsNoteText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 18,
  },
});

export default BillGeneration;
