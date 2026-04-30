import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const CreateSociety = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { createSociety } = useSociety();
  const { showToast } = useToast();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleCreate = async () => {
    const normalizedCode = code.trim().toUpperCase();
    const normalizedName = name.trim();

    if (!normalizedCode || !normalizedName) {
      showToast('Society code and name are required', 'error');
      return;
    }

    const created = await createSociety({
      code: normalizedCode,
      name: normalizedName,
      address: address.trim() || null,
    });
    if (created) {
      showToast('Society created and selected', 'success');
      navigation.goBack();
    } else {
      showToast('Failed to create society', 'error');
    }
  };

  return (
    <View style={s.container}>
      <Header title="Create Society" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Society Details</Text>
        <Card style={s.section}>
          <Input
            label="Society Code"
            value={code}
            onChangeText={(text) => setCode(text.toUpperCase().replace(/\s/g, ''))}
            placeholder="e.g., GREEN"
            icon="identifier"
            autoCapitalize="characters"
          />
          <Input
            label="Society Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter society name"
            icon="city-variant"
          />
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter society address"
            icon="map-marker"
          />
        </Card>

        <Button
          title="Create & Select"
          icon="plus-circle"
          onPress={handleCreate}
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
    sectionTitle: {
      ...typography.subtitle1,
      color: colors.textPrimary,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    section: {
      marginBottom: spacing.base,
    },
  });

export default CreateSociety;
