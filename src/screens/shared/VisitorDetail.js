import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import visitorService from '../../services/visitorService';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatDateTime, formatDate, formatTime } from '../../utils/formatDate';

const VisitorDetail = ({ route, navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  const DetailRow = ({ icon, label, value }) => (
    <View style={s.detailRow}>
      <Icon name={icon} size={18} color={colors.textMuted} style={s.detailIcon} />
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value || '—'}</Text>
    </View>
  );
  const { visitor } = route.params;
  const { showToast } = useToast();
  const isActive = visitor.status === 'checked_in';

  const handleCheckout = async () => {
    Alert.alert('Check Out', `Mark ${visitor.visitorName} as checked out?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Check Out',
        onPress: async () => {
          await visitorService.checkoutVisitor(visitor.id);
          showToast('Visitor checked out successfully', 'success');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={s.container}>
      <Header title="Visitor Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card variant="elevated" style={s.headerCard}>
          <View style={s.headerRow}>
            <View style={[s.avatar, {
              backgroundColor: isActive ? colors.successLight : colors.surfaceLight,
            }]}>
              <Icon
                name="account"
                size={32}
                color={isActive ? colors.success : colors.textMuted}
              />
            </View>
            <View style={s.headerInfo}>
              <Text style={s.visitorName}>{visitor.visitorName}</Text>
              <Text style={s.purpose}>{visitor.purpose}</Text>
            </View>
            <StatusChip
              status={isActive ? 'open' : 'resolved'}
              label={isActive ? 'Inside' : 'Left'}
            />
          </View>
        </Card>

        {/* Visit Details */}
        <Text style={s.sectionTitle}>Visit Information</Text>
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
        <Text style={s.sectionTitle}>Timing</Text>
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

const makeStyles = (colors) => StyleSheet.create({
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
