import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { useTheme } from '../../context/ThemeContext';
import { useSociety } from '../../context/SocietyContext';
import societyService from '../../services/societyService';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const SocietyUsers = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { selectedSocietyCode, loadFlats } = useSociety();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadFlats();
      const result = await societyService.getUsers();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setUsers([]);
      }
      setLoading(false);
    };

    load();
  }, [selectedSocietyCode]);

  const renderUser = ({ item }) => {
    const flatMeta = item.flatNumber ? `${item.wing || 'Wing'} • ${item.flatNumber}` : (item.wing || '');
    return (
      <Card style={s.card}>
        <View style={s.row}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{(item.name || 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={s.info}>
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.meta}>{flatMeta || '—'} • {item.mobile}</Text>
            <View style={s.roleChip}>
              <Text style={s.roleText}>{String(item.role || '').toUpperCase()}</Text>
            </View>
          </View>
          <Icon name="account" size={20} color={colors.textMuted} />
        </View>
      </Card>
    );
  };

  return (
    <View style={s.container}>
      <Header
        title="Society Users"
        subtitle={selectedSocietyCode ? `Society: ${selectedSocietyCode}` : undefined}
        onBack={() => navigation.goBack()}
        rightIcon="account-plus"
        onRightPress={() => navigation.navigate('AddResident')}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={async () => {
          setLoading(true);
          const result = await societyService.getUsers();
          if (result.success) setUsers(result.data || []);
          setLoading(false);
        }}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title="No users found"
            message="No users exist for the selected society."
          />
        }
      />
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: {
      paddingHorizontal: spacing.screenHorizontal,
      paddingTop: spacing.md,
      paddingBottom: spacing.huge,
    },
    card: { marginBottom: spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.primaryGlow,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    avatarText: {
      ...typography.h4,
      color: colors.primary,
    },
    info: { flex: 1 },
    name: {
      ...typography.subtitle1,
      color: colors.textPrimary,
    },
    meta: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
    roleChip: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    roleText: {
      ...typography.overline,
      color: colors.textSecondary,
      fontSize: 10,
    },
  });

export default SocietyUsers;
