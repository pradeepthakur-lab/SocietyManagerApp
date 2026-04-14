import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const FlatManagement = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { flats, loadFlats, loading } = useSociety();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadFlats();
  }, []);

  const filteredFlats = flats.filter((f) => {
    if (filter === 'occupied') return f.status === 'occupied';
    if (filter === 'vacant') return f.status === 'vacant';
    return true;
  });

  const filters = [
    { key: 'all', label: `All (${flats.length})` },
    { key: 'occupied', label: `Occupied (${flats.filter(f => f.status === 'occupied').length})` },
    { key: 'vacant', label: `Vacant (${flats.filter(f => f.status === 'vacant').length})` },
  ];

  const renderFlat = ({ item }) => (
    <Card style={s.flatCard} onPress={() => {}}>
      <View style={s.flatRow}>
        <View style={[s.flatIcon, {
          backgroundColor: item.status === 'occupied' ? colors.successLight : colors.warningLight,
        }]}>
          <Icon
            name={item.status === 'occupied' ? 'home-account' : 'home-outline'}
            size={20}
            color={item.status === 'occupied' ? colors.success : colors.warning}
          />
        </View>
        <View style={s.flatInfo}>
          <Text style={s.flatNumber}>{item.flatNumber}</Text>
          <Text style={s.flatMeta}>
            {item.building} • Floor {item.floor} • {item.areaSqft} sq.ft
          </Text>
        </View>
        <View style={[s.statusDot, {
          backgroundColor: item.status === 'occupied' ? colors.success : colors.warning,
        }]} />
      </View>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header
        title="Flat Management"
        onBack={() => navigation.goBack()}
        rightIcon="plus"
        onRightPress={() => navigation.navigate('AddFlat')}
      />

      {/* Filters */}
      <View style={s.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterChip, filter === f.key && s.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredFlats}
        keyExtractor={(item) => item.id}
        renderItem={renderFlat}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="home-outline"
            title="No flats found"
            message="Add flats to get started"
          >
            <Button
              title="Add Flat"
              onPress={() => navigation.navigate('AddFlat')}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  filterChipActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.huge,
  },
  flatCard: {
    marginBottom: spacing.sm,
  },
  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  flatInfo: {
    flex: 1,
  },
  flatNumber: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  flatMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default FlatManagement;
