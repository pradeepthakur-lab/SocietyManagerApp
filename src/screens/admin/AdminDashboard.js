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
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSociety } from '../../context/SocietyContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getRelativeTime } from '../../utils/formatDate';

const StatCard = ({ icon, label, value, color, onPress }) => (
  <Card style={styles.statCard} onPress={onPress}>
    <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
      <Icon name={icon} size={22} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

const QuickAction = ({ icon, label, onPress, color = colors.primary }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const AdminDashboard = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { loadReportData, reportData, loadBills, bills, loadPayments, payments, loading } = useBilling();
  const { unreadCount, loadNotifications } = useNotifications();
  const { loadFlats, flats } = useSociety();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadReportData(),
      loadBills(),
      loadPayments(),
      loadFlats(),
      loadNotifications(user?.id),
    ]);
  };

  const pendingPayments = payments.filter((p) => p.status === 'pending_verification');
  const unpaidBills = bills.filter((b) => b.status === 'unpaid');

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Custom Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()} 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notices')}
        >
          <Icon name="bell-outline" size={24} color={colors.textPrimary} />
          <Badge count={unreadCount} size="small" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="cash-check"
            label="Collected"
            value={formatCurrency(reportData?.totalCollection || 0)}
            color={colors.success}
          />
          <StatCard
            icon="cash-clock"
            label="Pending"
            value={formatCurrency(reportData?.pendingAmount || 0)}
            color={colors.warning}
          />
          <StatCard
            icon="home-group"
            label="Total Flats"
            value={flats.length.toString()}
            color={colors.info}
          />
          <StatCard
            icon="account-alert"
            label="Defaulters"
            value={(reportData?.defaulters?.length || 0).toString()}
            color={colors.danger}
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <QuickAction
            icon="file-document-edit"
            label="Generate Bills"
            onPress={() => navigation.navigate('BillGeneration')}
            color={colors.primary}
          />
          <QuickAction
            icon="check-decagram"
            label="Verify Payments"
            onPress={() => navigation.navigate('PaymentVerification')}
            color={colors.success}
          />
          <QuickAction
            icon="account-group"
            label="Visitors"
            onPress={() => navigation.navigate('VisitorLog')}
            color={colors.accent}
          />
          <QuickAction
            icon="car-multiple"
            label="Vehicles"
            onPress={() => navigation.navigate('VehicleManagement')}
            color={colors.info}
          />
        </View>
        <View style={styles.quickActionsRow}>
          <QuickAction
            icon="account-plus"
            label="Add Resident"
            onPress={() => navigation.navigate('AddResident')}
            color={colors.warning}
          />
          <QuickAction
            icon="home-plus"
            label="Add Flat"
            onPress={() => navigation.navigate('AddFlat')}
            color={colors.secondary}
          />
          <QuickAction
            icon="city-variant"
            label="Society"
            onPress={() => navigation.navigate('SocietySetup')}
            color={colors.danger}
          />
          <QuickAction
            icon="cash-register"
            label="Expenses"
            onPress={() => navigation.navigate('Expenses')}
            color={colors.textMuted}
          />
        </View>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Verifications</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PaymentVerification')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {pendingPayments.slice(0, 3).map((payment) => (
              <Card
                key={payment.id}
                style={styles.paymentCard}
                onPress={() => navigation.navigate('PaymentDetail', { payment })}
              >
                <View style={styles.paymentCardContent}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{payment.userName}</Text>
                    <Text style={styles.paymentFlat}>
                      {payment.flatNumber} • {payment.paymentMethod.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <StatusChip status={payment.status} />
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Defaulters */}
        {reportData?.defaulters?.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
              Defaulters
            </Text>
            {reportData.defaulters.slice(0, 3).map((d, idx) => (
              <Card key={idx} style={styles.defaulterCard}>
                <View style={styles.defaulterContent}>
                  <View style={styles.defaulterAvatar}>
                    <Icon name="account" size={20} color={colors.danger} />
                  </View>
                  <View style={styles.defaulterInfo}>
                    <Text style={styles.defaulterName}>{d.residentName}</Text>
                    <Text style={styles.defaulterFlat}>
                      {d.flatNumber} • Due: {d.dueDate}
                    </Text>
                  </View>
                  <Text style={styles.defaulterAmount}>
                    {formatCurrency(d.amount)}
                  </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  greeting: {
    ...typography.body2,
    color: colors.textMuted,
  },
  userName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    padding: spacing.base,
    alignItems: 'flex-start',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  seeAll: {
    ...typography.subtitle2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  paymentCard: {
    marginBottom: spacing.sm,
  },
  paymentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  paymentFlat: {
    ...typography.caption,
    color: colors.textMuted,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  paymentAmount: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  defaulterCard: {
    marginBottom: spacing.sm,
  },
  defaulterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaulterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  defaulterInfo: {
    flex: 1,
  },
  defaulterName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  defaulterFlat: {
    ...typography.caption,
    color: colors.textMuted,
  },
  defaulterAmount: {
    ...typography.subtitle1,
    color: colors.danger,
  },
});

export default AdminDashboard;
