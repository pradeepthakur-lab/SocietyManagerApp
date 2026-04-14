import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const ResidentManagement = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { residents, loadResidents, flats } = useSociety();

  useEffect(() => {
    loadResidents();
  }, []);

  const getFlatNumber = (flatId) => {
    const flat = flats.find((f) => f.id === flatId);
    return flat ? flat.flatNumber : 'N/A';
  };

  const renderResident = ({ item }) => (
    <Card style={s.card}>
      <View style={s.row}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={s.info}>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.meta}>
            {getFlatNumber(item.flatId)} • {item.mobile}
          </Text>
          <View style={s.roleChip}>
            <Text style={s.roleText}>
              {item.role === 'tenant' ? 'Tenant' : 'Owner'}
            </Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={colors.textMuted} />
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header
        title="Residents"
        subtitle={`${residents.length} members`}
        onBack={() => navigation.goBack()}
        rightIcon="account-plus"
        onRightPress={() => navigation.navigate('AddResident')}
      />
      <FlatList
        data={residents}
        keyExtractor={(item) => item.id}
        renderItem={renderResident}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title="No residents yet"
            message="Add residents to their respective flats"
          >
            <Button
              title="Add Resident"
              onPress={() => navigation.navigate('AddResident')}
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

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  card: { marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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

export default ResidentManagement;
