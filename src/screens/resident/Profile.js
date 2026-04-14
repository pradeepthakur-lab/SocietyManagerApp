import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const Profile = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const s = makeStyles(colors);
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    showToast(`Switched to ${isDark ? 'Light' : 'Dark'} mode`, 'success');
  };

  const fields = [
    { icon: 'account', label: 'Name', value: user?.name },
    { icon: 'cellphone', label: 'Mobile', value: user?.mobile },
    { icon: 'email', label: 'Email', value: user?.email || 'Not set' },
    { icon: 'shield-account', label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
    { icon: 'door', label: 'Flat', value: user?.flatId || 'N/A' },
  ];

  return (
    <View style={s.container}>
      <Header title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content}>
        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={s.name}>{user?.name || 'Resident'}</Text>
          <Text style={s.role}>{user?.role?.toUpperCase()}</Text>
        </View>

        {/* Info */}
        <Card>
          {fields.map((field, idx) => (
            <View key={idx} style={[s.fieldRow, idx < fields.length - 1 && s.fieldBorder]}>
              <Icon name={field.icon} size={18} color={colors.textMuted} />
              <Text style={s.fieldLabel}>{field.label}</Text>
              <Text style={s.fieldValue}>{field.value}</Text>
            </View>
          ))}
        </Card>

        {/* Appearance */}
        <Text style={s.sectionTitle}>Appearance</Text>
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

        <Button title="Edit Profile" variant="outline" icon="account-edit" onPress={() => {}} style={{ marginTop: spacing.xl }} />
        <Button title="Change Password" variant="ghost" icon="lock-reset" onPress={() => {}} style={{ marginTop: spacing.sm }} />
        <Button title="Logout" variant="danger" icon="logout" onPress={handleLogout} style={{ marginTop: spacing.xxl }} />

        <Text style={s.version}>Society Manager v1.0.0</Text>
        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal },
  avatarSection: { alignItems: 'center', marginVertical: spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryGlow, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
    borderWidth: 2, borderColor: colors.primary,
  },
  avatarText: { ...typography.h1, color: colors.primary },
  name: { ...typography.h3, color: colors.textPrimary },
  role: { ...typography.overline, color: colors.primary, marginTop: 4 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md,
  },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  fieldLabel: { ...typography.caption, color: colors.textMuted, marginLeft: spacing.md, width: 70 },
  fieldValue: { ...typography.body2, color: colors.textPrimary, flex: 1 },
  sectionTitle: { ...typography.subtitle2, color: colors.textMuted, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  themeText: { flex: 1, marginLeft: spacing.md },
  themeLabel: { ...typography.subtitle1, color: colors.textPrimary },
  themeDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  version: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

export default Profile;
