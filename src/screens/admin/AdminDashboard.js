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
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatCurrency';
import { getRelativeTime } from '../../utils/formatDate';

const AdminDashboard = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  const StatCard = ({ icon, label, value, color, onPress }) => (
    <Card style={s.statCard} onPress={onPress}>
      <View style={[s.statIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Card>
  );

  const QuickAction = ({ icon, label, onPress, color = colors.primary }) => (
    <TouchableOpacity style={s.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.quickActionIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={s.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
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
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Custom Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting()} 👋</Text>
          <Text style={s.userName}>{user?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity
          style={s.notificationBtn}
          onPress={() => navigation.navigate('Notices')}
        >
          <Icon name="bell-outline" size={24} color={colors.textPrimary} />
          <Badge count={unreadCount} size="small" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
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
        <View style={s.statsGrid}>
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
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.quickActionsRow}>
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
        <View style={s.quickActionsRow}>
          <QuickAction
            icon="file-pdf-box"
            label="Bill Invoice"
            onPress={() => navigation.navigate('BillInvoice')}
            color={colors.warning}
          />
          <QuickAction
            icon="account-plus"
            label="Add Resident"
            onPress={() => navigation.navigate('AddResident')}
            color={colors.secondary}
          />
          <QuickAction
            icon="city-variant"
            label="Society"
            onPress={() => navigation.navigate('SocietySwitch')}
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
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Pending Verifications</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PaymentVerification')}>
                <Text style={s.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {pendingPayments.slice(0, 3).map((payment) => (
              <Card
                key={payment.id}
                style={s.paymentCard}
                onPress={() => navigation.navigate('PaymentDetail', { payment })}
              >
                <View style={s.paymentCardContent}>
                  <View style={s.paymentInfo}>
                    <Text style={s.paymentName}>{payment.userName}</Text>
                    <Text style={s.paymentFlat}>
                      {payment.flatNumber} • {payment.paymentMethod.toUpperCase()}
                    </Text>
                  </View>
                  <View style={s.paymentRight}>
                    <Text style={s.paymentAmount}>
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
            <Text style={[s.sectionTitle, { marginTop: spacing.xl }]}>
              Defaulters
            </Text>
            {reportData.defaulters.slice(0, 3).map((d, idx) => (
              <Card key={idx} style={s.defaulterCard}>
                <View style={s.defaulterContent}>
                  <View style={s.defaulterAvatar}>
                    <Icon name="account" size={20} color={colors.danger} />
                  </View>
                  <View style={s.defaulterInfo}>
                    <Text style={s.defaulterName}>{d.residentName}</Text>
                    <Text style={s.defaulterFlat}>
                      {d.flatNumber} • Due: {d.dueDate}
                    </Text>
                  </View>
                  <Text style={s.defaulterAmount}>
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

const makeStyles = (colors) => StyleSheet.create({
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
