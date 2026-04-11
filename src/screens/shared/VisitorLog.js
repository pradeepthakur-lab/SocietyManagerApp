import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import visitorService from '../../services/visitorService';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatDate, formatTime } from '../../utils/formatDate';

const VisitorLog = ({ navigation }) => {
  const [visitors, setVisitors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ today: 0, active: 0 });

  useEffect(() => {
    loadVisitors();
    loadStats();
  }, []);

  const loadVisitors = async () => {
    setLoading(true);
    const filters = filter !== 'all' ? { status: filter } : {};
    const result = await visitorService.getVisitors(filters);
    if (result.success) {
      setVisitors(result.data);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await visitorService.getTodayCount();
    if (result.success) {
      setStats(result.data);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, [filter]);

  const handleCheckout = async (visitorId) => {
    await visitorService.checkoutVisitor(visitorId);
    loadVisitors();
    loadStats();
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'checked_in', label: `Active (${stats.active})` },
    { key: 'checked_out', label: 'Checked Out' },
  ];

  const getPurposeIcon = (purpose) => {
    const icons = {
      Guest: 'account-heart',
      Delivery: 'package-variant-closed',
      Maintenance: 'wrench',
      'Domestic Help': 'broom',
      'Cab / Taxi': 'car',
      Other: 'account',
    };
    return icons[purpose] || 'account';
  };

  const renderVisitor = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('VisitorDetail', { visitor: item })}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.purposeIcon, {
          backgroundColor: item.status === 'checked_in' ? colors.successLight : colors.surfaceLight,
        }]}>
          <Icon
            name={getPurposeIcon(item.purpose)}
            size={20}
            color={item.status === 'checked_in' ? colors.success : colors.textMuted}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.visitorName}>{item.visitorName}</Text>
          <Text style={styles.meta}>
            {item.purpose} • Flat {item.visitingFlat}
          </Text>
          <Text style={styles.time}>
            In: {formatTime(item.checkedInAt)}
            {item.checkedOutAt ? ` • Out: ${formatTime(item.checkedOutAt)}` : ''}
          </Text>
        </View>
        <View style={styles.right}>
          <StatusChip
            status={item.status === 'checked_in' ? 'open' : 'resolved'}
            label={item.status === 'checked_in' ? 'Active' : 'Left'}
          />
          {item.status === 'checked_in' && (
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => handleCheckout(item.id)}
            >
              <Icon name="logout" size={16} color={colors.danger} />
              <Text style={styles.checkoutText}>Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {item.vehicleNumber ? (
        <View style={styles.vehicleTag}>
          <Icon name="car" size={12} color={colors.textMuted} />
          <Text style={styles.vehicleText}>{item.vehicleNumber}</Text>
        </View>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Visitor Log"
        subtitle={`${stats.active} active now`}
        onBack={() => navigation.goBack()}
        rightIcon="account-plus"
        onRightPress={() => navigation.navigate('AddVisitor')}
      />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Icon name="account-arrow-right" size={18} color={colors.success} />
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Inside</Text>
        </View>
        <View style={styles.statChip}>
          <Icon name="account-clock" size={18} color={colors.info} />
          <Text style={styles.statValue}>{stats.today}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
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

      <FlatList
        data={visitors}
        keyExtractor={(item) => item.id}
        renderItem={renderVisitor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title="No visitors"
            message="Visitor entries will appear here"
          >
            <Button
              title="Add Visitor"
              onPress={() => navigation.navigate('AddVisitor')}
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
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.radiusMedium,
    gap: spacing.sm,
  },
  statValue: { ...typography.h4, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textMuted },
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
  list: { paddingHorizontal: spacing.screenHorizontal, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  purposeIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  visitorName: { ...typography.subtitle1, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  time: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end', gap: spacing.sm },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.radiusXSmall,
    gap: 4,
  },
  checkoutText: { ...typography.caption, color: colors.danger, fontWeight: '600' },
  vehicleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 6,
  },
  vehicleText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
});

export default VisitorLog;
