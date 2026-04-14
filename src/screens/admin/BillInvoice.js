import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
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

  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    let words = 'Rs. ' + convert(rupees);
    if (paise > 0) words += ' and ' + convert(paise) + ' Paise';
    words += ' Only';
    return words;
  };

  const generateInvoiceHTML = (invoice) => {
    const { society, flat, resident, charges, currentTotal, previousDue, lateFee, totalAmount, billNumber, periodStart, periodEnd, dueDate, monthName, year, payments } = invoice;

    const chargeRows = charges.map((c, i) => `
      <tr>
        <td style="padding:4px 8px;border:1px solid #000;">${i + 1}</td>
        <td style="padding:4px 8px;border:1px solid #000;">${c.name}</td>
        <td style="padding:4px 8px;border:1px solid #000;text-align:right;">${c.amount.toFixed(2)}</td>
      </tr>
    `).join('');

    const approvedPayment = payments?.find(p => p.status === 'approved');

    const dueDateFormatted = dueDate ? new Date(dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const billDateFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; padding: 20px; }
        .container { border: 2px solid #000; padding: 0; }
        .header { text-align: center; padding: 15px 10px 10px; border-bottom: 2px solid #000; }
        .header h1 { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
        .header p { font-size: 10px; color: #333; }
        .bill-period { text-align: center; padding: 8px; font-weight: bold; font-size: 12px; border-bottom: 1px solid #000; background: #f5f5f5; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 10px; }
        .info-row .left { text-align: left; }
        .info-row .right { text-align: right; }
        .info-section { padding: 8px 10px; border-bottom: 1px solid #000; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 6px 8px; border: 1px solid #000; background: #f0f0f0; text-align: left; font-size: 11px; }
        th:last-child { text-align: right; }
        td { font-size: 11px; }
        .total-section { padding: 0 10px; }
        .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .total-row.grand { font-weight: bold; font-size: 14px; border-top: 2px solid #000; padding-top: 6px; margin-top: 4px; }
        .amount-words { padding: 8px 10px; border-top: 1px solid #000; font-weight: bold; font-size: 11px; background: #f9f9f9; }
        .notes { padding: 10px; border-top: 1px solid #000; font-size: 10px; }
        .notes p { margin-bottom: 3px; }
        .notes .title { font-weight: bold; }
        .footer-sign { text-align: right; padding: 20px 10px 10px; font-weight: bold; font-size: 11px; }
        .receipt-section { border-top: 3px dashed #000; margin-top: 20px; padding: 15px 10px; }
        .receipt-section h2 { text-align: center; font-size: 14px; margin-bottom: 4px; }
        .receipt-section h3 { text-align: center; font-size: 12px; margin-bottom: 10px; letter-spacing: 3px; }
        .receipt-info { margin-bottom: 10px; font-size: 11px; }
        .receipt-total { font-size: 16px; font-weight: bold; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>${society.name.toUpperCase()}</h1>
          <p>${society.address || ''}</p>
        </div>

        <!-- Bill Period -->
        <div class="bill-period">
          BILL FOR THE PERIOD OF ${periodStart} To ${periodEnd}
        </div>

        <!-- Resident & Bill Info -->
        <div class="info-section">
          <table style="border:none;">
            <tr>
              <td style="border:none;padding:2px 0;"><b>(${flat.flatNumber}) ${resident.name}</b></td>
              <td style="border:none;padding:2px 0;text-align:right;"><b>BILL NO. : ${billNumber}</b></td>
            </tr>
            <tr>
              <td style="border:none;padding:2px 0;">FLAT NO.: ${flat.flatNumber} &nbsp;&nbsp; AREA: ${flat.areaSqft || '-'} SQ.FEET</td>
              <td style="border:none;padding:2px 0;text-align:right;">BILL DATE: ${billDateFormatted}</td>
            </tr>
            <tr>
              <td style="border:none;padding:2px 0;">MOB.: ${resident.mobile || ''}</td>
              <td style="border:none;padding:2px 0;text-align:right;">DUE DATE: ${dueDateFormatted}</td>
            </tr>
          </table>
        </div>

        <!-- Charges Table -->
        <div style="padding:0 10px 0;">
          <table>
            <thead>
              <tr>
                <th style="width:40px;">Sr.</th>
                <th>PARTICULARS</th>
                <th style="width:100px;text-align:right;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${chargeRows}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="total-section" style="padding:8px 10px;">
          <div class="total-row">
            <span><b>TOTAL</b></span>
            <span><b>${currentTotal.toFixed(2)}</b></span>
          </div>
          ${previousDue > 0 ? `
          <div class="total-row">
            <span>PRINCIPAL ARREARS</span>
            <span>${previousDue.toFixed(2)}</span>
          </div>` : ''}
          ${lateFee > 0 ? `
          <div class="total-row">
            <span>INTEREST ARREARS (${society.arrearsInterestRate}%)</span>
            <span>${lateFee.toFixed(2)}</span>
          </div>` : ''}
          <div class="total-row grand">
            <span>GRAND TOTAL</span>
            <span>₹ ${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <!-- Amount in Words -->
        <div class="amount-words">
          Amount in Words : ${numberToWords(totalAmount)}
        </div>

        <!-- Notes -->
        <div class="notes">
          <p class="title">NOTE: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; E.& O.E.</p>
          <p>1. Payment should be made in favour of ${society.name} & A/c PAYEE ONLY.</p>
          <p>2. Payment must be made on or before due date of every month.</p>
          ${society.arrearsInterestRate > 0 ? `<p>3. Interest @${society.arrearsInterestRate}% p.a. will be charged on delayed payments.</p>` : ''}
          <p>${society.arrearsInterestRate > 0 ? '4' : '3'}. Members are requested to write their name, wing, flat no., date on the reverse of the chq.</p>
          <p>${society.arrearsInterestRate > 0 ? '5' : '4'}. Receipt will be issued with the next month bill.</p>
        </div>

        <!-- Society Signature -->
        <div class="footer-sign">
          FOR ${society.name.toUpperCase()}
        </div>

        ${approvedPayment ? `
        <!-- Receipt Section -->
        <div class="receipt-section">
          <h2>${society.name.toUpperCase()}</h2>
          <h3>R E C E I P T</h3>
          <div class="receipt-info">
            <p>RECEIVED WITH THANKS FROM (${flat.flatNumber}) ${resident.name}</p>
            <p style="margin-top:5px;">SUM OF ${numberToWords(approvedPayment.amount).toUpperCase()}, AGAINST BILL No. ${billNumber}</p>
          </div>
          <div class="receipt-total">₹ ${approvedPayment.amount.toFixed(2)}</div>
          <table style="margin-top:10px;">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mode</th>
                <th style="text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:4px 8px;border:1px solid #000;">${approvedPayment.submittedAt ? new Date(approvedPayment.submittedAt).toLocaleDateString('en-IN') : '-'}</td>
                <td style="padding:4px 8px;border:1px solid #000;">${(approvedPayment.method || 'Online').toUpperCase()}</td>
                <td style="padding:4px 8px;border:1px solid #000;text-align:right;">${approvedPayment.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p style="text-align:center;margin-top:15px;font-size:10px;">This is a Computer Generated Invoice no signature required.</p>
        </div>
        ` : ''}
      </div>
    </body>
    </html>`;
  };

  const handleGeneratePDF = async (bill) => {
    try {
      setGeneratingPdf(bill.id);

      // Fetch full invoice data
      const result = await billingService.getBillInvoice(bill.id);
      if (!result.success) {
        showToast('Failed to load bill details', 'error');
        return;
      }

      const html = generateInvoiceHTML(result.data);

      const options = {
        html,
        fileName: `Bill_${bill.flatNumber}_${getMonthNameShort(bill.month)}_${bill.year}`,
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
        base64: false,
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      showToast('PDF generated successfully!', 'success');

      // Share the PDF
      await Share.open({
        title: `Bill - ${bill.flatNumber} - ${getMonthName(bill.month)} ${bill.year}`,
        url: Platform.OS === 'android' ? `file://${pdf.filePath}` : pdf.filePath,
        type: 'application/pdf',
        subject: `Society Bill - ${bill.flatNumber} - ${getMonthName(bill.month)} ${bill.year}`,
        message: `Hi ${bill.residentName || ''},\n\nPlease find attached your society bill for ${getMonthName(bill.month)} ${bill.year}.\n\nTotal Amount: ${formatCurrency(bill.totalAmount)}\n\nRegards,\nSociety Management`,
      });
    } catch (err) {
      if (err?.message !== 'User did not share') {
        showToast('Error generating PDF', 'error');
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
