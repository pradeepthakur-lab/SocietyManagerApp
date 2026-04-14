import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName } from '../../utils/formatDate';

const ResidentDashboard = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { bills, loadBills, payments, loadPayments, loading } = useBilling();
  const { unreadCount, loadNotifications } = useNotifications();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    await Promise.all([
      loadBills({ userId: user?.id }),
      loadPayments({ userId: user?.id }),
      loadNotifications(user?.id),
    ]);
  };

  const unpaidBills = bills.filter((b) => b.status === 'unpaid');
  const pendingBills = bills.filter((b) => b.status === 'pending_verification');
  const latestUnpaid = unpaidBills[0];

  const totalDue = unpaidBills.reduce((sum, b) => sum + b.totalAmount + b.lateFee, 0);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting()} 👋</Text>
          <Text style={s.userName}>{user?.name || 'Resident'}</Text>
        </View>
        <TouchableOpacity
          style={s.notificationBtn}
          onPress={() => navigation.navigate('NoticesScreen')}
        >
          <Icon name="bell-outline" size={24} color={colors.textPrimary} />
          <Badge count={unreadCount} size="small" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />
        }
      >
        {/* Outstanding Amount Card */}
        <Card variant="elevated" style={s.dueCard}>
          <View style={s.dueHeader}>
            <View>
              <Text style={s.dueLabel}>Total Outstanding</Text>
              <Text style={s.dueAmount}>{formatCurrency(totalDue)}</Text>
            </View>
            <View style={s.dueIconContainer}>
              <Icon name="cash-clock" size={28} color={colors.warning} />
            </View>
          </View>
          {unpaidBills.length > 0 && (
            <Button
              title="Pay Now"
              onPress={() => navigation.navigate('BillsList')}
              size="small"
              icon="arrow-right"
              iconRight
              style={s.payNowBtn}
            />
          )}
        </Card>

        {/* Quick Status */}
        <View style={s.statusRow}>
          <Card style={s.statusCard}>
            <Text style={s.statusNumber}>{unpaidBills.length}</Text>
            <Text style={s.statusLabel}>Unpaid</Text>
          </Card>
          <Card style={s.statusCard}>
            <Text style={[s.statusNumber, { color: colors.warning }]}>{pendingBills.length}</Text>
            <Text style={s.statusLabel}>Pending</Text>
          </Card>
          <Card style={s.statusCard}>
            <Text style={[s.statusNumber, { color: colors.success }]}>
              {bills.filter((b) => b.status === 'paid').length}
            </Text>
            <Text style={s.statusLabel}>Paid</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.actionsRow}>
          {[
            { icon: 'file-document', label: 'My Bills', nav: 'BillsList', color: colors.primary },
            { icon: 'history', label: 'Payments', nav: 'PaymentHistory', color: colors.success },
            { icon: 'alert-circle', label: 'Complaint', nav: 'Complaints', color: colors.danger },
            { icon: 'bullhorn', label: 'Notices', nav: 'NoticesScreen', color: colors.accent },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={s.actionItem}
              onPress={() => navigation.navigate(action.nav)}
              activeOpacity={0.7}
            >
              <View style={[s.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={s.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.actionsRow}>
          {[
            { icon: 'car', label: 'My Vehicles', nav: 'VehicleManagement', color: colors.info },
            { icon: 'bank', label: 'Banking', nav: 'MyBankingDetails', color: colors.warning },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={s.actionItem}
              onPress={() => navigation.navigate(action.nav)}
              activeOpacity={0.7}
            >
              <View style={[s.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={s.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Bills */}
        {bills.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Recent Bills</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BillsList')}>
                <Text style={s.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {bills.slice(0, 3).map((bill) => (
              <Card
                key={bill.id}
                style={s.billCard}
                onPress={() => navigation.navigate('BillDetail', { bill })}
              >
                <View style={s.billRow}>
                  <View>
                    <Text style={s.billMonth}>
                      {getMonthName(bill.month)} {bill.year}
                    </Text>
                    <Text style={s.billFlat}>{bill.flatNumber}</Text>
                  </View>
                  <View style={s.billRight}>
                    <Text style={s.billAmount}>{formatCurrency(bill.totalAmount)}</Text>
                    <StatusChip status={bill.status} />
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal, paddingVertical: spacing.base,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  greeting: { ...typography.body2, color: colors.textMuted },
  userName: { ...typography.h3, color: colors.textPrimary, marginTop: 2 },
  notificationBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.lg },
  dueCard: { padding: spacing.lg, marginBottom: spacing.lg },
  dueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dueLabel: { ...typography.caption, color: colors.textMuted },
  dueAmount: { ...typography.h1, color: colors.textPrimary, marginTop: 4 },
  dueIconContainer: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: colors.warningLight,
    alignItems: 'center', justifyContent: 'center',
  },
  payNowBtn: { marginTop: spacing.md, alignSelf: 'flex-start' },
  statusRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statusCard: { flex: 1, padding: spacing.md, alignItems: 'center' },
  statusNumber: { ...typography.h3, color: colors.danger },
  statusLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: spacing.md },
  seeAll: { ...typography.subtitle2, color: colors.primary, marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  actionItem: { alignItems: 'center', width: '22%' },
  actionIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  actionLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  billCard: { marginBottom: spacing.sm },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billMonth: { ...typography.subtitle2, color: colors.textPrimary },
  billFlat: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  billRight: { alignItems: 'flex-end', gap: 6 },
  billAmount: { ...typography.subtitle1, color: colors.textPrimary },
});

export default ResidentDashboard;
