import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

const DetailRow = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    {icon && <Icon name={icon} size={18} color={colors.textMuted} style={styles.detailIcon} />}
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const PaymentDetail = ({ route, navigation }) => {
  const { payment } = route.params;
  const { user } = useAuth();
  const { approvePayment, rejectPayment } = useBilling();
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const isPending = payment.status === 'pending_verification';

  const handleApprove = () => {
    Alert.alert('Approve Payment', `Approve ₹${payment.amount} from ${payment.userName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          setActionLoading('approve');
          await approvePayment(payment.id, user.id, comment || 'Verified');
          setActionLoading(null);
          Alert.alert('Done', 'Payment approved', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      Alert.alert('Required', 'Please add a comment explaining the rejection reason');
      return;
    }
    Alert.alert('Reject Payment', 'Are you sure you want to reject this payment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          setActionLoading('reject');
          await rejectPayment(payment.id, user.id, comment);
          setActionLoading(null);
          Alert.alert('Done', 'Payment rejected', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Payment Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
            </View>
            <StatusChip status={payment.status} />
          </View>
          <View style={styles.divider} />
          <Text style={styles.residentName}>{payment.userName}</Text>
          <Text style={styles.flatInfo}>Flat {payment.flatNumber}</Text>
        </Card>

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <Card style={styles.detailsCard}>
          <DetailRow label="Method" value={payment.paymentMethod.replace('_', ' ').toUpperCase()} icon="credit-card-outline" />
          {payment.transactionId && (
            <DetailRow label="Transaction ID" value={payment.transactionId} icon="identifier" />
          )}
          {payment.referenceNumber && (
            <DetailRow label="Reference No." value={payment.referenceNumber} icon="barcode" />
          )}
          {payment.chequeNumber && (
            <DetailRow label="Cheque No." value={payment.chequeNumber} icon="checkbook" />
          )}
          {payment.bankName && (
            <DetailRow label="Bank" value={payment.bankName} icon="bank" />
          )}
          {payment.appName && (
            <DetailRow label="App" value={payment.appName} icon="cellphone" />
          )}
          <DetailRow label="Submitted" value={formatDateTime(payment.submittedAt)} icon="clock-outline" />
        </Card>

        {/* Verification Info */}
        {payment.verifiedAt && (
          <>
            <Text style={styles.sectionTitle}>Verification</Text>
            <Card style={styles.detailsCard}>
              <DetailRow label="Verified At" value={formatDateTime(payment.verifiedAt)} icon="check-circle-outline" />
              {payment.comment && (
                <DetailRow label="Comment" value={payment.comment} icon="comment-text-outline" />
              )}
            </Card>
          </>
        )}

        {/* Screenshot */}
        {payment.screenshot && (
          <>
            <Text style={styles.sectionTitle}>Screenshot</Text>
            <Card>
              <Image source={{ uri: payment.screenshot }} style={styles.screenshot} resizeMode="contain" />
            </Card>
          </>
        )}

        {/* Admin Actions */}
        {isPending && (
          <>
            <Text style={styles.sectionTitle}>Admin Action</Text>
            <Input
              label="Comment"
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment (required for rejection)"
              icon="comment-text-outline"
              multiline
              numberOfLines={3}
            />
            <View style={styles.actionRow}>
              <Button
                title="Approve"
                onPress={handleApprove}
                variant="secondary"
                icon="check-circle"
                style={styles.actionBtn}
                loading={actionLoading === 'approve'}
              />
              <Button
                title="Reject"
                onPress={handleReject}
                variant="danger"
                icon="close-circle"
                style={styles.actionBtn}
                loading={actionLoading === 'reject'}
              />
            </View>
          </>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  amountSection: {},
  amountLabel: { ...typography.caption, color: colors.textMuted },
  amount: { ...typography.h1, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  residentName: { ...typography.subtitle1, color: colors.textPrimary },
  flatInfo: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  detailsCard: { padding: spacing.base },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailIcon: { marginRight: spacing.sm },
  detailLabel: { ...typography.caption, color: colors.textMuted, width: 110 },
  detailValue: { ...typography.body2, color: colors.textPrimary, flex: 1 },
  screenshot: { width: '100%', height: 300, borderRadius: spacing.radiusSmall },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionBtn: { flex: 1 },
});

export default PaymentDetail;
