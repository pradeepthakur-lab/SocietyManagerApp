import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import vehicleService from '../../services/vehicleService';
import { RESIDENT_ROLES } from '../../constants/roles';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';

const typeIcons = {
  two_wheeler: 'motorbike',
  four_wheeler: 'car',
  other: 'truck',
};

const typeLabels = {
  two_wheeler: '2-Wheeler',
  four_wheeler: '4-Wheeler',
  other: 'Other',
};

const VehicleManagement = ({ navigation }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const isResident = RESIDENT_ROLES.includes(user?.role);

  useEffect(() => {
    loadVehicles();
    loadStats();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    const filters = isResident ? { residentId: user?.id } : {};
    if (filter !== 'all') {
      filters.type = filter;
    }
    const result = await vehicleService.getVehicles(filters);
    if (result.success) {
      setVehicles(result.data);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await vehicleService.getVehicleStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [filter]);

  const filterTabs = [
    { key: 'all', label: `All (${stats.total || 0})` },
    { key: 'four_wheeler', label: `4W (${stats.fourWheelers || 0})` },
    { key: 'two_wheeler', label: `2W (${stats.twoWheelers || 0})` },
  ];

  const renderVehicle = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, {
          backgroundColor: item.type === 'four_wheeler' ? colors.primaryGlow : colors.successLight,
        }]}>
          <Icon
            name={typeIcons[item.type] || 'car'}
            size={22}
            color={item.type === 'four_wheeler' ? colors.primary : colors.success}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
          <Text style={styles.make}>{item.make} • {item.color}</Text>
          {!isResident && (
            <Text style={styles.flat}>
              {item.flatNumber} — {item.residentName}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <View style={styles.parkingChip}>
            <Icon name="parking" size={12} color={colors.accent} />
            <Text style={styles.parkingText}>{item.parkingSlot}</Text>
          </View>
          <Text style={styles.charge}>
            {formatCurrency(item.monthlyCharge)}/mo
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title={isResident ? 'My Vehicles' : 'Vehicle Management'}
        subtitle={isResident ? undefined : `${stats.total || 0} vehicles registered`}
        onBack={() => navigation.goBack()}
        rightIcon="plus"
        onRightPress={() => navigation.navigate('AddVehicle')}
      />

      {/* Stats Row (Admin/Manager only) */}
      {!isResident && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="car" size={20} color={colors.primary} />
            <Text style={styles.statValue}>{stats.fourWheelers || 0}</Text>
            <Text style={styles.statLabel}>4-Wheeler</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="motorbike" size={20} color={colors.success} />
            <Text style={styles.statValue}>{stats.twoWheelers || 0}</Text>
            <Text style={styles.statLabel}>2-Wheeler</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="currency-inr" size={20} color={colors.accent} />
            <Text style={styles.statValue}>{formatCurrency(stats.totalMonthlyCharges || 0)}</Text>
            <Text style={styles.statLabel}>Monthly</Text>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      {!isResident && (
        <View style={styles.filterRow}>
          {filterTabs.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderVehicle}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="car-outline"
            title="No vehicles"
            message={isResident ? 'Register your vehicles here' : 'No vehicles registered yet'}
          >
            <Button
              title="Add Vehicle"
              onPress={() => navigation.navigate('AddVehicle')}
              size="small"
              icon="plus"
              fullWidth={false}
            />
          </EmptyState>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMedium,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { ...typography.subtitle1, color: colors.textPrimary, fontSize: 14 },
  statLabel: { ...typography.caption, color: colors.textMuted, fontSize: 10 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primaryGlow, borderColor: colors.primary },
  filterText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  filterTextActive: { color: colors.primary },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.sm, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  vehicleNumber: { ...typography.subtitle1, color: colors.textPrimary, letterSpacing: 0.5 },
  make: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  flat: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end', gap: 6 },
  parkingChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.warningLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4,
  },
  parkingText: { ...typography.caption, color: colors.accent, fontWeight: '700', fontSize: 11 },
  charge: { ...typography.caption, color: colors.textMuted },
});

export default VehicleManagement;
