import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import vehicleService from '../../services/vehicleService';
import { VEHICLE_TYPES, VEHICLE_MONTHLY_CHARGES } from '../../constants/roles';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';

const vehicleTypeOptions = [
  { key: VEHICLE_TYPES.TWO_WHEELER, label: '2-Wheeler', icon: 'motorbike', charge: VEHICLE_MONTHLY_CHARGES.two_wheeler },
  { key: VEHICLE_TYPES.FOUR_WHEELER, label: '4-Wheeler', icon: 'car', charge: VEHICLE_MONTHLY_CHARGES.four_wheeler },
  { key: VEHICLE_TYPES.OTHER, label: 'Other', icon: 'truck', charge: VEHICLE_MONTHLY_CHARGES.other },
];

const AddVehicle = ({ navigation }) => {
  const { user } = useAuth();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [type, setType] = useState(VEHICLE_TYPES.FOUR_WHEELER);
  const [make, setMake] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [flatNumber, setFlatNumber] = useState(user?.flatId ? '' : '');
  const [residentName, setResidentName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const selectedType = vehicleTypeOptions.find((t) => t.key === type);
  const monthlyCharge = selectedType?.charge || 0;

  const handleAdd = async () => {
    if (!vehicleNumber.trim()) {
      Alert.alert('Error', 'Vehicle number is required');
      return;
    }

    setLoading(true);
    const result = await vehicleService.addVehicle({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      type,
      make: make.trim(),
      color: vehicleColor.trim(),
      parkingSlot: parkingSlot.trim().toUpperCase(),
      monthlyCharge,
      flatId: user?.flatId || null,
      flatNumber: flatNumber.trim().toUpperCase() || 'N/A',
      residentId: user?.id,
      residentName: residentName.trim(),
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Vehicle Added ✅', `${vehicleNumber} registered.\nMonthly parking charge: ${formatCurrency(monthlyCharge)}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Vehicle" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vehicle Type */}
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.typeGrid}>
          {vehicleTypeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.typeCard, type === opt.key && styles.typeCardActive]}
              onPress={() => setType(opt.key)}
              activeOpacity={0.7}
            >
              <Icon
                name={opt.icon}
                size={28}
                color={type === opt.key ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.typeLabel, type === opt.key && styles.typeLabelActive]}>
                {opt.label}
              </Text>
              <Text style={[styles.typeCharge, type === opt.key && styles.typeChargeActive]}>
                {formatCurrency(opt.charge)}/mo
              </Text>
              {type === opt.key && (
                <Icon name="check-circle" size={16} color={colors.primary} style={styles.typeCheck} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="e.g., MH 12 AB 1234"
          icon="car"
          autoCapitalize="characters"
        />
        <Input
          label="Make / Model"
          value={make}
          onChangeText={setMake}
          placeholder="e.g., Hyundai Creta"
          icon="car-cog"
        />
        <Input
          label="Color"
          value={vehicleColor}
          onChangeText={setVehicleColor}
          placeholder="e.g., White"
          icon="palette"
        />
        <Input
          label="Parking Slot"
          value={parkingSlot}
          onChangeText={setParkingSlot}
          placeholder="e.g., P-A01"
          icon="parking"
          autoCapitalize="characters"
        />
        <Input
          label="Flat Number"
          value={flatNumber}
          onChangeText={setFlatNumber}
          placeholder="e.g., A-101"
          icon="door"
          autoCapitalize="characters"
        />
        <Input
          label="Owner Name"
          value={residentName}
          onChangeText={setResidentName}
          placeholder="Vehicle owner name"
          icon="account"
        />

        {/* Charge Summary */}
        <View style={styles.chargeSummary}>
          <Icon name="currency-inr" size={18} color={colors.primary} />
          <Text style={styles.chargeText}>
            Monthly parking: <Text style={styles.chargeAmount}>{formatCurrency(monthlyCharge)}</Text>
          </Text>
        </View>

        <Button
          title="Register Vehicle"
          onPress={handleAdd}
          loading={loading}
          icon="car-estate"
          style={{ marginTop: spacing.lg }}
        />

        <Text style={styles.note}>
          Parking charges will be automatically included in monthly bills.
        </Text>

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.lg },
  label: { ...typography.subtitle2, color: colors.textSecondary, marginBottom: spacing.md },
  typeGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  typeCard: {
    flex: 1, padding: spacing.base, borderRadius: spacing.cardRadius,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center',
  },
  typeCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryGlow },
  typeLabel: { ...typography.subtitle2, color: colors.textMuted, marginTop: spacing.sm, fontSize: 13 },
  typeLabelActive: { color: colors.primary },
  typeCharge: { ...typography.caption, color: colors.textMuted, marginTop: 2, fontSize: 11 },
  typeChargeActive: { color: colors.primary },
  typeCheck: { position: 'absolute', top: 8, right: 8 },
  chargeSummary: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primaryGlow, padding: spacing.md, borderRadius: spacing.radiusMedium,
    marginTop: spacing.md, gap: spacing.sm,
  },
  chargeText: { ...typography.body2, color: colors.textSecondary },
  chargeAmount: { ...typography.subtitle1, color: colors.primary },
  note: {
    ...typography.caption, color: colors.textMuted, textAlign: 'center',
    marginTop: spacing.xl, lineHeight: 18,
  },
});

export default AddVehicle;
