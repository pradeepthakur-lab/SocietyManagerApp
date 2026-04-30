import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

const SocietySwitch = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { user } = useAuth();
  const { societies, selectedSocietyCode, loadSocieties, selectSociety } = useSociety();
  const { showToast } = useToast();

  const canManageSocieties = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    loadSocieties();
  }, []);

  return (
    <View style={s.container}
    >
      <Header title="Select Society" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Card style={s.section}>
          {societies.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={[
                s.societyOption,
                selectedSocietyCode === item.code && s.societyOptionActive,
              ]}
              onPress={async () => {
                await selectSociety(item.code);
                showToast(`${item.name} selected`, 'success');
                navigation.goBack();
              }}
              activeOpacity={0.75}
            >
              <View>
                <Text style={s.societyOptionName}>{item.name}</Text>
                <Text style={s.societyOptionCode}>{item.code}</Text>
              </View>
              {selectedSocietyCode === item.code && (
                <Icon name="check-circle" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {canManageSocieties && (
          <Button
            title="Create New Society"
            icon="plus-circle"
            onPress={() => navigation.navigate('CreateSociety')}
            style={{ marginTop: spacing.lg }}
          />
        )}

        <Button
          title="View Society Users"
          icon="account-group"
          variant="outline"
          onPress={() => navigation.navigate('SocietyUsers')}
          style={{ marginTop: spacing.md }}
        />

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.screenHorizontal,
    },
    section: {
      marginBottom: spacing.base,
    },
    societyOption: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: spacing.radiusMedium,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    societyOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryGlow,
    },
    societyOptionName: {
      ...typography.subtitle2,
      color: colors.textPrimary,
    },
    societyOptionCode: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
  });

export default SocietySwitch;
