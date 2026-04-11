import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSociety } from '../../context/SocietyContext';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

const AddResident = ({ navigation }) => {
  const { addResident, flats } = useSociety();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [flatId, setFlatId] = useState('');
  const [role, setRole] = useState('resident');
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(false);

  const vacantFlats = flats.filter((f) => f.status === 'vacant');

  const handleAdd = async () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Error', 'Name and mobile are required');
      return;
    }
    setLoading(true);
    const success = await addResident({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      flatId: flatId || null,
      role,
      vehicleDetails: vehicle.trim(),
    });
    setLoading(false);
    if (success) {
      Alert.alert('Success', 'Resident added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Resident" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Resident name" icon="account" />
        <Input label="Mobile" value={mobile} onChangeText={setMobile} placeholder="10-digit number" icon="cellphone" keyboardType="phone-pad" maxLength={10} />
        <Input label="Email (optional)" value={email} onChangeText={setEmail} placeholder="email@example.com" icon="email" keyboardType="email-address" />
        <Input label="Flat Number" value={flatId} onChangeText={setFlatId} placeholder={vacantFlats.length > 0 ? `Vacant: ${vacantFlats.map(f => f.flatNumber).join(', ')}` : 'No vacant flats'} icon="door" />
        <Input label="Vehicle Details (optional)" value={vehicle} onChangeText={setVehicle} placeholder="e.g., MH 12 AB 1234" icon="car" />
        <Button title="Add Resident" onPress={handleAdd} loading={loading} icon="account-plus" style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.lg },
});

export default AddResident;
