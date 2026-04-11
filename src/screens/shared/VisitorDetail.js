import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import visitorService from '../../services/visitorService';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatDateTime, formatDate, formatTime } from '../../utils/formatDate';

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={18} color={colors.textMuted} style={styles.detailIcon} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || '—'}</Text>
  </View>
);

const VisitorDetail = ({ route, navigation }) => {
  const { visitor } = route.params;
  const isActive = visitor.status === 'checked_in';

  const handleCheckout = async () => {
    Alert.alert('Check Out', `Mark ${visitor.visitorName} as checked out?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Check Out',
        onPress: async () => {
          await visitorService.checkoutVisitor(visitor.id);
          Alert.alert('Done', 'Visitor checked out successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Visitor Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={[styles.avatar, {
              backgroundColor: isActive ? colors.successLight : colors.surfaceLight,
            }]}>
              <Icon
                name="account"
                size={32}
                color={isActive ? colors.success : colors.textMuted}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.visitorName}>{visitor.visitorName}</Text>
              <Text style={styles.purpose}>{visitor.purpose}</Text>
            </View>
            <StatusChip
              status={isActive ? 'open' : 'resolved'}
              label={isActive ? 'Inside' : 'Left'}
            />
          </View>
        </Card>

        {/* Visit Details */}
        <Text style={styles.sectionTitle}>Visit Information</Text>
        <Card>
          <DetailRow icon="door" label="Flat" value={visitor.visitingFlat} />
          <DetailRow icon="account-check" label="Visiting" value={visitor.visitingResident} />
          <DetailRow icon="cellphone" label="Phone" value={visitor.phone} />
          <DetailRow icon="tag" label="Purpose" value={visitor.purpose} />
          {visitor.vehicleNumber && (
            <DetailRow icon="car" label="Vehicle" value={visitor.vehicleNumber} />
          )}
          {visitor.notes && (
            <DetailRow icon="note-text" label="Notes" value={visitor.notes} />
          )}
        </Card>

        {/* Timing */}
        <Text style={styles.sectionTitle}>Timing</Text>
        <Card>
          <DetailRow icon="login" label="Check In" value={formatDateTime(visitor.checkedInAt)} />
          <DetailRow
            icon="logout"
            label="Check Out"
            value={visitor.checkedOutAt ? formatDateTime(visitor.checkedOutAt) : 'Still inside'}
          />
          {visitor.checkedOutAt && (
            <DetailRow
              icon="clock-outline"
              label="Duration"
              value={(() => {
                const diff = new Date(visitor.checkedOutAt) - new Date(visitor.checkedInAt);
                const mins = Math.floor(diff / 60000);
                if (mins < 60) return `${mins} min`;
                const hrs = Math.floor(mins / 60);
                return `${hrs}h ${mins % 60}m`;
              })()}
            />
          )}
        </Card>

        {isActive && (
          <Button
            title="Check Out Visitor"
            onPress={handleCheckout}
            variant="danger"
            icon="logout"
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
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  headerInfo: { flex: 1 },
  visitorName: { ...typography.h4, color: colors.textPrimary },
  purpose: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  sectionTitle: {
    ...typography.subtitle1, color: colors.textPrimary,
    marginTop: spacing.xl, marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  detailIcon: { marginRight: spacing.sm },
  detailLabel: { ...typography.caption, color: colors.textMuted, width: 90 },
  detailValue: { ...typography.body2, color: colors.textPrimary, flex: 1 },
});

export default VisitorDetail;
