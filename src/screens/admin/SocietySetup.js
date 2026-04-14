import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useSociety } from '../../context/SocietyContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const SocietySetup = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { society, buildings, loadSociety, loadBuildings, updateSociety, addBuilding } = useSociety();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [arrearsRate, setArrearsRate] = useState('');
  const [newBuildingName, setNewBuildingName] = useState('');
  const [newBuildingFloors, setNewBuildingFloors] = useState('');

  useEffect(() => {
    loadSociety();
    loadBuildings();
  }, []);

  useEffect(() => {
    if (society) {
      setName(society.name || '');
      setAddress(society.address || '');
      setBankName(society.bankDetails?.bankName || '');
      setAccountNumber(society.bankDetails?.accountNumber || '');
      setIfsc(society.bankDetails?.ifsc || '');
      setUpiId(society.upiId || '');
      setArrearsRate(society.arrearsInterestRate?.toString() || '0');
    }
  }, [society]);

  const handleSave = async () => {
    const success = await updateSociety({
      name,
      address,
      bankDetails: { bankName, accountNumber, ifsc, accountHolder: name + ' CHS' },
      upiId,
      arrearsInterestRate: parseFloat(arrearsRate) || 0,
    });
    if (success) {
      showToast('Society details updated', 'success');
    }
  };

  const handleAddBuilding = async () => {
    if (!newBuildingName.trim()) return;
    const success = await addBuilding({
      name: newBuildingName,
      floors: parseInt(newBuildingFloors, 10) || 5,
    });
    if (success) {
      setNewBuildingName('');
      setNewBuildingFloors('');
      showToast('Building added successfully', 'success');
    }
  };

  return (
    <View style={s.container}>
      <Header title="Society Setup" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Society Details */}
        <Text style={s.sectionTitle}>Society Information</Text>
        <Card style={s.section}>
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
            placeholder="Full address"
            icon="map-marker"
            multiline
            numberOfLines={2}
          />
        </Card>

        {/* Bank Details */}
        <Text style={s.sectionTitle}>Bank Details</Text>
        <Card style={s.section}>
          <Input
            label="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            placeholder="e.g., State Bank of India"
            icon="bank"
          />
          <Input
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Account number"
            icon="numeric"
            keyboardType="number-pad"
          />
          <Input
            label="IFSC Code"
            value={ifsc}
            onChangeText={setIfsc}
            placeholder="e.g., SBIN0001234"
            icon="barcode"
            autoCapitalize="characters"
          />
          <Input
            label="UPI ID"
            value={upiId}
            onChangeText={setUpiId}
            placeholder="e.g., society@sbi"
            icon="cellphone-nfc"
          />
        </Card>

        {/* Arrears & Interest */}
        <Text style={s.sectionTitle}>Arrears & Interest</Text>
        <Card style={s.section}>
          <Input
            label="Interest Rate on Arrears (%)"
            value={arrearsRate}
            onChangeText={setArrearsRate}
            placeholder="e.g., 21"
            icon="percent"
            keyboardType="decimal-pad"
            maxLength={5}
          />
          <View style={s.infoRow}>
            <Icon name="information-outline" size={16} color={colors.info} />
            <Text style={s.infoText}>
              This interest will be auto-applied on pending arrears when generating new bills. Set to 0 for no interest.
            </Text>
          </View>
        </Card>

        <Button
          title="Save Society Details"
          onPress={handleSave}
          icon="content-save"
          style={s.saveBtn}
        />

        {/* Buildings */}
        <Text style={s.sectionTitle}>Buildings / Wings</Text>
        {buildings.map((b) => (
          <Card key={b.id} style={s.buildingCard}>
            <View style={s.buildingRow}>
              <View style={s.buildingIcon}>
                <Icon name="office-building" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={s.buildingName}>{b.name}</Text>
                <Text style={s.buildingFloors}>{b.floors} Floors</Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Add Building */}
        <Card style={s.section}>
          <Text style={s.addTitle}>Add New Building</Text>
          <Input
            label="Building Name"
            value={newBuildingName}
            onChangeText={setNewBuildingName}
            placeholder="e.g., C Wing"
            icon="office-building"
          />
          <Input
            label="Number of Floors"
            value={newBuildingFloors}
            onChangeText={setNewBuildingFloors}
            placeholder="e.g., 5"
            icon="stairs"
            keyboardType="number-pad"
          />
          <Button
            title="Add Building"
            onPress={handleAddBuilding}
            variant="outline"
            icon="plus"
          />
        </Card>

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </View>
  );
};


const makeStyles = (colors) => StyleSheet.create({
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
  saveBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  buildingCard: {
    marginBottom: spacing.sm,
  },
  buildingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  buildingName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  buildingFloors: {
    ...typography.caption,
    color: colors.textMuted,
  },
  addTitle: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.infoLight,
    padding: spacing.md,
    borderRadius: spacing.radiusSmall,
    marginTop: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 18,
  },
});

export default SocietySetup;
