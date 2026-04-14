import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import visitorService from '../../services/visitorService';
import { VISITOR_PURPOSES } from '../../constants/roles';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const AddVisitor = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { user } = useAuth();
  const { showToast } = useToast();
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
      showToast('Visitor name is required', 'error');
      return;
    }
    if (!visitingFlat.trim()) {
      showToast('Visiting flat number is required', 'error');
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
      showToast(`${visitorName} checked in for flat ${visitingFlat}`, 'success');
      navigation.goBack();
    } else {
      showToast(result.error || 'Failed to check in visitor', 'error');
    }
  };

  return (
    <View style={s.container}>
      <Header title="Add Visitor" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
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
        <Text style={s.label}>Purpose of Visit</Text>
        <View style={s.purposeGrid}>
          {VISITOR_PURPOSES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[s.purposeChip, purpose === p && s.purposeChipActive]}
              onPress={() => setPurpose(p)}
            >
              <Text style={[s.purposeText, purpose === p && s.purposeTextActive]}>
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

const makeStyles = (colors) => StyleSheet.create({
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
