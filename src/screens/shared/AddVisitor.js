import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import visitorService from '../../services/visitorService';
import { VISITOR_PURPOSES } from '../../constants/roles';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const AddVisitor = ({ navigation }) => {
  const { user } = useAuth();
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('Guest');
  const [visitingFlat, setVisitingFlat] = useState('');
  const [visitingResident, setVisitingResident] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!visitorName.trim()) {
      Alert.alert('Error', 'Visitor name is required');
      return;
    }
    if (!visitingFlat.trim()) {
      Alert.alert('Error', 'Visiting flat number is required');
      return;
    }

    setLoading(true);
    const result = await visitorService.addVisitor({
      visitorName: visitorName.trim(),
      phone: phone.trim(),
      purpose,
      visitingFlat: visitingFlat.trim().toUpperCase(),
      visitingResident: visitingResident.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      checkedInBy: user?.id,
      notes: notes.trim(),
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Visitor Checked In ✅', `${visitorName} has been checked in for flat ${visitingFlat}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Visitor" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Visitor Name"
          value={visitorName}
          onChangeText={setVisitorName}
          placeholder="Full name"
          icon="account"
        />
        <Input
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="Mobile number"
          icon="cellphone"
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* Purpose Selection */}
        <Text style={styles.label}>Purpose of Visit</Text>
        <View style={styles.purposeGrid}>
          {VISITOR_PURPOSES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.purposeChip, purpose === p && styles.purposeChipActive]}
              onPress={() => setPurpose(p)}
            >
              <Text style={[styles.purposeText, purpose === p && styles.purposeTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Visiting Flat"
          value={visitingFlat}
          onChangeText={setVisitingFlat}
          placeholder="e.g., A-101"
          icon="door"
          autoCapitalize="characters"
        />
        <Input
          label="Resident Name (optional)"
          value={visitingResident}
          onChangeText={setVisitingResident}
          placeholder="Name of person being visited"
          icon="account-check"
        />
        <Input
          label="Vehicle Number (optional)"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="e.g., MH 12 AB 1234"
          icon="car"
          autoCapitalize="characters"
        />
        <Input
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional notes"
          icon="note-text"
          multiline
          numberOfLines={2}
        />

        <Button
          title="Check In Visitor"
          onPress={handleAdd}
          loading={loading}
          icon="account-arrow-right"
          style={{ marginTop: spacing.lg }}
        />

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.lg },
  label: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  purposeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  purposeChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  purposeChipActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  purposeText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  purposeTextActive: { color: colors.primary },
});

export default AddVisitor;
