import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNShare from 'react-native-share';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useBilling } from '../../context/BillingContext';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import billingService from '../../services/billingService';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName, getMonthNameShort } from '../../utils/formatDate';
import RNFS from 'react-native-fs';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: getMonthName(i),
  short: getMonthNameShort(i),
}));

const BillInvoice = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { bills, loadBills, loading } = useBilling();
  const { flats, loadFlats } = useSociety();
  const { showToast } = useToast();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedFlat, setSelectedFlat] = useState('all');
  const [showFlatPicker, setShowFlatPicker] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(null);

  useEffect(() => {
    loadFlats();
    loadBills({ month: selectedMonth, year: selectedYear });
  }, []);

  useEffect(() => {
    loadBills({ month: selectedMonth, year: selectedYear });
  }, [selectedMonth, selectedYear]);

  const occupiedFlats = flats.filter((f) => f.status === 'occupied');

  const filteredBills = bills.filter((b) => {
    const matchMonth = b.month === selectedMonth;
    const matchYear = b.year === selectedYear;
    const matchFlat = selectedFlat === 'all' || b.flatId === selectedFlat;
    return matchMonth && matchYear && matchFlat;
  });

  const selectedFlatLabel = selectedFlat === 'all'
    ? 'All Flats'
    : occupiedFlats.find(f => f.id === selectedFlat)?.flatNumber || 'Select Flat';

  const handleGeneratePDF = async (bill) => {
    try {
      setGeneratingPdf(bill.id);

      const result = await billingService.getBillPDF(bill.id);

      if (!result.success) {
        showToast('Failed to generate PDF', 'error');
        return;
      }

      const { base64, fileName } = result.data;

      if (!base64) {
        throw new Error('Base64 is empty');
      }

      const safeFileName = fileName || `bill_${Date.now()}.pdf`;

      // Write to appropriate directory
      const dir = Platform.OS === 'android'
        ? `${RNFS.ExternalStorageDirectoryPath}/Download`
        : RNFS.DocumentDirectoryPath;
      await RNFS.mkdir(dir);
      const filePath = `${dir}/${safeFileName}`;
      console.log('base64: ', base64);

      await RNFS.writeFile(filePath, base64, 'base64');

      const exists = await RNFS.exists(filePath);
      if (!exists) {
        throw new Error('File not created');
      }

      // Share the PDF
      await RNShare.open({
        url: `file://${filePath}`,
        type: 'application/pdf',
        failOnCancel: false,
      });

    } catch (err) {
      if (err?.message !== 'User did not share') {
        showToast(err?.message || 'Something went wrong', 'error');
      }
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleGenerateAll = async () => {
    if (filteredBills.length === 0) {
      showToast('No bills to generate', 'error');
      return;
    }
    showToast(`Generating ${filteredBills.length} PDFs...`, 'info');

    for (const bill of filteredBills) {
      await handleGeneratePDF(bill);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending_verification': return colors.warning;
      default: return colors.danger;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending_verification': return 'Pending';
      default: return 'Unpaid';
    }
  };

  return (
    <View style={s.container}>
      <Header title="Bill Invoice" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Month Selector */}
        <Text style={s.sectionTitle}>Select Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.monthScroll}>
          {MONTHS.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[s.monthChip, selectedMonth === m.value && s.monthChipActive]}
              onPress={() => setSelectedMonth(m.value)}
            >
              <Text style={[s.monthText, selectedMonth === m.value && s.monthTextActive]}>
                {m.short}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Year Row */}
        <View style={s.yearRow}>
          <TouchableOpacity style={s.yearBtn} onPress={() => setSelectedYear(y => y - 1)}>
            <Icon name="chevron-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.yearText}>{selectedYear}</Text>
          <TouchableOpacity style={s.yearBtn} onPress={() => setSelectedYear(y => y + 1)}>
            <Icon name="chevron-right" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Flat Picker */}
        <Text style={s.sectionTitle}>Select Flat</Text>
        <TouchableOpacity
          style={s.flatPicker}
          onPress={() => setShowFlatPicker(!showFlatPicker)}
          activeOpacity={0.7}
        >
          <Icon name="home-outline" size={20} color={colors.primary} />
          <Text style={s.flatPickerText}>{selectedFlatLabel}</Text>
          <Icon name={showFlatPicker ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {showFlatPicker && (
          <Card style={s.flatDropdown}>
            <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled>
              <TouchableOpacity
                style={[s.flatOption, selectedFlat === 'all' && s.flatOptionActive]}
                onPress={() => { setSelectedFlat('all'); setShowFlatPicker(false); }}
              >
                <Text style={[s.flatOptionText, selectedFlat === 'all' && s.flatOptionTextActive]}>
                  All Flats
                </Text>
              </TouchableOpacity>
              {occupiedFlats.map((flat) => (
                <TouchableOpacity
                  key={flat.id}
                  style={[s.flatOption, selectedFlat === flat.id && s.flatOptionActive]}
                  onPress={() => { setSelectedFlat(flat.id); setShowFlatPicker(false); }}
                >
                  <Text style={[s.flatOptionText, selectedFlat === flat.id && s.flatOptionTextActive]}>
                    {flat.flatNumber} — {flat.residentName || 'Vacant'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card>
        )}

        {/* Bill List */}
        <View style={s.listHeader}>
          <Text style={s.sectionTitle}>
            Bills ({filteredBills.length})
          </Text>
          {filteredBills.length > 1 && (
            <Button
              title="Share All"
              variant="outline"
              icon="share-variant"
              onPress={handleGenerateAll}
              style={s.shareAllBtn}
              size="small"
            />
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : filteredBills.length === 0 ? (
          <Card style={s.emptyCard}>
            <Icon name="file-document-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyText}>No bills found for this period</Text>
            <Text style={s.emptySubText}>Generate bills from the Bill Generation screen</Text>
          </Card>
        ) : (
          filteredBills.map((bill) => (
            <Card key={bill.id} style={s.billCard}>
              <View style={s.billHeader}>
                <View style={s.billFlatInfo}>
                  <View style={s.billAvatar}>
                    <Text style={s.billAvatarText}>{bill.flatNumber?.charAt(0) || 'F'}</Text>
                  </View>
                  <View>
                    <Text style={s.billFlat}>{bill.flatNumber}</Text>
                    <Text style={s.billResident}>{bill.residentName || '-'}</Text>
                  </View>
                </View>
                <View style={s.billAmountSection}>
                  <Text style={s.billAmount}>{formatCurrency(bill.totalAmount)}</Text>
                  <View style={[s.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
                    <View style={[s.statusDot, { backgroundColor: getStatusColor(bill.status) }]} />
                    <Text style={[s.statusText, { color: getStatusColor(bill.status) }]}>
                      {getStatusLabel(bill.status)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Charges Preview */}
              <View style={s.chargesPreview}>
                {bill.charges?.slice(0, 3).map((c, i) => (
                  <View key={i} style={s.chargePreviewRow}>
                    <Text style={s.chargePreviewName}>{c.name}</Text>
                    <Text style={s.chargePreviewAmount}>{formatCurrency(c.amount)}</Text>
                  </View>
                ))}
                {bill.charges?.length > 3 && (
                  <Text style={s.moreCharges}>+{bill.charges.length - 3} more items</Text>
                )}
                {bill.previousDue > 0 && (
                  <View style={s.chargePreviewRow}>
                    <Text style={[s.chargePreviewName, { color: colors.danger }]}>Arrears</Text>
                    <Text style={[s.chargePreviewAmount, { color: colors.danger }]}>{formatCurrency(bill.previousDue)}</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={s.billActions}>
                <Button
                  title={generatingPdf === bill.id ? 'Generating...' : 'Generate & Share PDF'}
                  icon="file-pdf-box"
                  onPress={() => handleGeneratePDF(bill)}
                  loading={generatingPdf === bill.id}
                  style={s.pdfBtn}
                  size="small"
                />
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
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.base },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  monthScroll: { marginBottom: spacing.sm },
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
  monthText: { ...typography.subtitle2, color: colors.textMuted },
  monthTextActive: { color: colors.primary },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  yearBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  yearText: { ...typography.h4, color: colors.textPrimary, marginHorizontal: spacing.xl },
  flatPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMedium,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flatPickerText: {
    ...typography.body1,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  flatDropdown: {
    marginTop: spacing.xs,
    padding: 0,
    overflow: 'hidden',
  },
  flatOption: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  flatOptionActive: { backgroundColor: colors.primaryGlow },
  flatOptionText: { ...typography.body2, color: colors.textPrimary },
  flatOptionTextActive: { color: colors.primary, fontWeight: '600' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareAllBtn: { marginTop: spacing.lg },
  emptyCard: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: { ...typography.subtitle1, color: colors.textMuted, marginTop: spacing.md },
  emptySubText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  billCard: { marginBottom: spacing.md, padding: spacing.base },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  billFlatInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  billAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  billAvatarText: { ...typography.subtitle1, color: colors.primary },
  billFlat: { ...typography.subtitle1, color: colors.textPrimary },
  billResident: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  billAmountSection: { alignItems: 'flex-end' },
  billAmount: { ...typography.h4, color: colors.textPrimary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { ...typography.caption, fontWeight: '600', fontSize: 10 },
  chargesPreview: {
    backgroundColor: colors.surfaceLight,
    borderRadius: spacing.radiusSmall,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  chargePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chargePreviewName: { ...typography.caption, color: colors.textMuted },
  chargePreviewAmount: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  moreCharges: { ...typography.caption, color: colors.primary, marginTop: 2 },
  billActions: { flexDirection: 'row' },
  pdfBtn: { flex: 1 },
});

export default BillInvoice;
