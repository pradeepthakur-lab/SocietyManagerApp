import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const Settings = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { society } = useSociety();
  const { colors, isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    showToast(
      `Switched to ${isDark ? 'Light' : 'Dark'} mode`,
      'success',
    );
  };

  const settingsGroups = [
    {
      title: 'Society',
      items: [
        { icon: 'swap-horizontal', label: 'Switch Society', onPress: () => navigation.navigate('Dashboard', { screen: 'SocietySwitch' }) },
        { icon: 'plus-circle', label: 'Create Society', onPress: () => navigation.navigate('Dashboard', { screen: 'CreateSociety' }) },
        { icon: 'city-variant', label: 'Society Setup', onPress: () => navigation.navigate('Dashboard', { screen: 'SocietySetup' }) },
        { icon: 'home-group', label: 'Flat Management', onPress: () => navigation.navigate('Dashboard', { screen: 'FlatManagement' }) },
        { icon: 'account-group', label: 'Resident Management', onPress: () => navigation.navigate('Dashboard', { screen: 'ResidentManagement' }) },
      ],
    },
    {
      title: 'Billing',
      items: [
        { icon: 'cash-register', label: 'Expenses', onPress: () => navigation.navigate('Dashboard', { screen: 'Expenses' }) },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'account-circle', label: 'My Profile', onPress: () => {} },
        { icon: 'lock-reset', label: 'Change Password', onPress: () => {} },
      ],
    },
  ];

  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card variant="elevated" style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
          </View>
          <Text style={s.profileName}>{user?.name || 'Admin'}</Text>
          <Text style={s.profileRole}>{user?.role?.toUpperCase() || 'ADMIN'}</Text>
          <Text style={s.profileSociety}>{society?.name || 'Society'}</Text>
        </Card>

        {/* Appearance */}
        <Text style={s.groupTitle}>Appearance</Text>
        <Card>
          <TouchableOpacity style={s.themeRow} onPress={handleToggleTheme} activeOpacity={0.7}>
            <Icon name={isDark ? 'weather-night' : 'white-balance-sunny'} size={22} color={colors.primary} />
            <View style={s.themeText}>
              <Text style={s.themeLabel}>Dark Mode</Text>
              <Text style={s.themeDesc}>{isDark ? 'Dark theme is active' : 'Light theme is active'}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : colors.surfaceLight}
            />
          </TouchableOpacity>
        </Card>

        {settingsGroups.map((group, gi) => (
          <View key={gi}>
            <Text style={s.groupTitle}>{group.title}</Text>
            <Card>
              {group.items.map((item, ii) => (
                <View key={ii}>
                  <Button
                    title={item.label}
                    icon={item.icon}
                    variant="ghost"
                    onPress={item.onPress}
                    style={s.settingsBtn}
                    textStyle={s.settingsBtnText}
                  />
                  {ii < group.items.length - 1 && <View style={s.divider} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          icon="logout"
          style={{ marginTop: spacing.xxl }}
        />
        <Text style={s.version}>Society Manager v1.0.0</Text>
        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal },
  profileCard: { padding: spacing.xl, alignItems: 'center', marginTop: spacing.md },
  avatar: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: colors.primaryGlow, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { ...typography.h2, color: colors.primary },
  profileName: { ...typography.h4, color: colors.textPrimary },
  profileRole: { ...typography.overline, color: colors.primary, marginTop: 4 },
  profileSociety: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  groupTitle: { ...typography.subtitle2, color: colors.textMuted, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  themeText: { flex: 1, marginLeft: spacing.md },
  themeLabel: { ...typography.subtitle1, color: colors.textPrimary },
  themeDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  settingsBtn: { justifyContent: 'flex-start', borderRadius: 0 },
  settingsBtnText: { color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.base },
  version: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

export default Settings;
