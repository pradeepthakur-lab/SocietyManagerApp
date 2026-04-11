import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useBilling } from '../../context/BillingContext';
import { useSociety } from '../../context/SocietyContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName } from '../../utils/formatDate';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: getMonthName(i),
}));

const BillGeneration = ({ navigation }) => {
  const { charges, loadCharges, generateBills, loading } = useBilling();
  const { flats } = useSociety();

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
      Alert.alert('Error', 'Please configure at least one charge');
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
              Alert.alert(
                'Success',
                `${result.length} bills generated successfully!`,
                [{ text: 'OK', onPress: () => navigation.goBack() }],
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Generate Bills" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Selector */}
        <Text style={styles.sectionTitle}>Billing Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {MONTHS.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[
                styles.monthChip,
                selectedMonth === m.value && styles.monthChipActive,
              ]}
              onPress={() => setSelectedMonth(m.value)}
            >
              <Text
                style={[
                  styles.monthText,
                  selectedMonth === m.value && styles.monthTextActive,
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
        <Text style={styles.sectionTitle}>Charges Configuration</Text>
        {editableCharges.map((charge, index) => (
          <Card key={charge.id} style={styles.chargeCard}>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeName}>{charge.name}</Text>
              <View style={styles.chargeInput}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Input
                  value={charge.amount.toString()}
                  onChangeText={(v) => updateChargeAmount(index, v)}
                  keyboardType="number-pad"
                  style={styles.chargeInputField}
                />
              </View>
            </View>
          </Card>
        ))}

        {/* Summary */}
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="calculator" size={24} color={colors.primary} />
            <Text style={styles.summaryTitle}>Bill Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Period</Text>
            <Text style={styles.summaryValue}>{getMonthName(selectedMonth)} {selectedYear}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Occupied Flats</Text>
            <Text style={styles.summaryValue}>{occupiedFlats.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Per Flat</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPerFlat)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Collection</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalAll)}</Text>
          </View>
        </Card>

        <Button
          title={`Generate ${occupiedFlats.length} Bills`}
          onPress={handleGenerate}
          loading={loading}
          icon="file-document-multiple"
          style={{ marginTop: spacing.lg }}
        />

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default BillGeneration;
