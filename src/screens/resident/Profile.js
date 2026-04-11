import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const Profile = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const fields = [
    { icon: 'account', label: 'Name', value: user?.name },
    { icon: 'cellphone', label: 'Mobile', value: user?.mobile },
    { icon: 'email', label: 'Email', value: user?.email || 'Not set' },
    { icon: 'shield-account', label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
    { icon: 'door', label: 'Flat', value: user?.flatId || 'N/A' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Resident'}</Text>
          <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
        </View>

        {/* Info */}
        <Card>
          {fields.map((field, idx) => (
            <View key={idx} style={[styles.fieldRow, idx < fields.length - 1 && styles.fieldBorder]}>
              <Icon name={field.icon} size={18} color={colors.textMuted} />
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text style={styles.fieldValue}>{field.value}</Text>
            </View>
          ))}
        </Card>

        <Button title="Edit Profile" variant="outline" icon="account-edit" onPress={() => {}} style={{ marginTop: spacing.xl }} />
        <Button title="Change Password" variant="ghost" icon="lock-reset" onPress={() => {}} style={{ marginTop: spacing.sm }} />
        <Button title="Logout" variant="danger" icon="logout" onPress={handleLogout} style={{ marginTop: spacing.xxl }} />

        <Text style={styles.version}>Society Manager v1.0.0</Text>
        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  version: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

export default Profile;
