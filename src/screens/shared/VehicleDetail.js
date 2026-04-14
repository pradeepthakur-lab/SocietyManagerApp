import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import vehicleService from '../../services/vehicleService';
import { ADMIN_ROLES, MANAGER_ROLES } from '../../constants/roles';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';

const typeIcons = { two_wheeler: 'motorbike', four_wheeler: 'car', other: 'truck' };
const typeLabels = { two_wheeler: '2-Wheeler', four_wheeler: '4-Wheeler', other: 'Other' };

const VehicleDetail = ({ route, navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  const DetailRow = ({ icon, label, value }) => (
    <View style={s.detailRow}>
      <Icon name={icon} size={18} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value || '—'}</Text>
    </View>
  );
  const { vehicle } = route.params;
  const { user } = useAuth();
  const { showToast } = useToast();
  const canDelete = MANAGER_ROLES.includes(user?.role) || user?.id === vehicle.residentId;

  const handleDelete = () => {
    Alert.alert(
      'Remove Vehicle',
      `Remove ${vehicle.vehicleNumber} from the registry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await vehicleService.removeVehicle(vehicle.id);
            showToast('Vehicle removed', 'success');
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={s.container}>
      <Header title="Vehicle Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card variant="elevated" style={s.headerCard}>
          <View style={s.headerRow}>
            <View style={[s.iconWrap, {
              backgroundColor: vehicle.type === 'four_wheeler' ? colors.primaryGlow : colors.successLight,
            }]}>
              <Icon
                name={typeIcons[vehicle.type]}
                size={32}
                color={vehicle.type === 'four_wheeler' ? colors.primary : colors.success}
              />
            </View>
            <View style={s.headerInfo}>
              <Text style={s.vehicleNumber}>{vehicle.vehicleNumber}</Text>
              <Text style={s.typeText}>{typeLabels[vehicle.type]}</Text>
            </View>
          </View>
          <View style={s.chargeBanner}>
            <Icon name="currency-inr" size={16} color={colors.primary} />
            <Text style={s.chargeText}>
              Monthly Parking: {formatCurrency(vehicle.monthlyCharge)}
            </Text>
          </View>
        </Card>

        {/* Details */}
        <Text style={s.sectionTitle}>Vehicle Information</Text>
        <Card>
          <DetailRow icon="car-cog" label="Make/Model" value={vehicle.make} />
          <DetailRow icon="palette" label="Color" value={vehicle.color} />
          <DetailRow icon="card-text" label="Number" value={vehicle.vehicleNumber} />
          <DetailRow icon="parking" label="Parking Slot" value={vehicle.parkingSlot} />
        </Card>

        <Text style={s.sectionTitle}>Owner Details</Text>
        <Card>
          <DetailRow icon="account" label="Owner" value={vehicle.residentName} />
          <DetailRow icon="door" label="Flat" value={vehicle.flatNumber} />
        </Card>

        <Text style={s.sectionTitle}>Billing</Text>
        <Card>
          <DetailRow icon="cash" label="Monthly" value={formatCurrency(vehicle.monthlyCharge)} />
          <DetailRow icon="calendar" label="Annual" value={formatCurrency(vehicle.monthlyCharge * 12)} />
        </Card>

        {canDelete && (
          <Button
            title="Remove Vehicle"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
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
  iconWrap: {
    width: 60, height: 60, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  headerInfo: { flex: 1 },
  vehicleNumber: { ...typography.h3, color: colors.textPrimary, letterSpacing: 1 },
  typeText: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  chargeBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primaryGlow, padding: spacing.md, borderRadius: spacing.radiusMedium,
    marginTop: spacing.md, gap: spacing.sm,
  },
  chargeText: { ...typography.subtitle2, color: colors.primary },
  sectionTitle: {
    ...typography.subtitle1, color: colors.textPrimary,
    marginTop: spacing.xl, marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  detailLabel: { ...typography.caption, color: colors.textMuted, width: 100 },
  detailValue: { ...typography.body2, color: colors.textPrimary, flex: 1 },
});

export default VehicleDetail;
