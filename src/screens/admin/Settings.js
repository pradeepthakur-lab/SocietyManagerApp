import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useSociety } from '../../context/SocietyContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const Settings = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { society } = useSociety();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const settingsGroups = [
    {
      title: 'Society',
      items: [
        { icon: 'city-variant', label: 'Society Setup', onPress: () => navigation.navigate('SocietySetup') },
        { icon: 'home-group', label: 'Flat Management', onPress: () => navigation.navigate('FlatManagement') },
        { icon: 'account-group', label: 'Resident Management', onPress: () => navigation.navigate('ResidentManagement') },
      ],
    },
    {
      title: 'Billing',
      items: [
        { icon: 'cash-register', label: 'Expenses', onPress: () => navigation.navigate('Expenses') },
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

  return (
    <View style={styles.container}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Admin'}</Text>
          <Text style={styles.profileRole}>{user?.role?.toUpperCase() || 'ADMIN'}</Text>
          <Text style={styles.profileSociety}>{society?.name || 'Society'}</Text>
        </Card>

        {settingsGroups.map((group, gi) => (
          <View key={gi}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <Card>
              {group.items.map((item, ii) => (
                <View key={ii}>
                  <Button
                    title={item.label}
                    icon={item.icon}
                    variant="ghost"
                    onPress={item.onPress}
                    style={styles.settingsBtn}
                    textStyle={styles.settingsBtnText}
                  />
                  {ii < group.items.length - 1 && <View style={styles.divider} />}
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
        <Text style={styles.version}>Society Manager v1.0.0</Text>
        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  settingsBtn: { justifyContent: 'flex-start', borderRadius: 0 },
  settingsBtnText: { color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.base },
  version: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

export default Settings;
