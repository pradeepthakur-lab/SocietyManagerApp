import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSociety } from '../../context/SocietyContext';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import typography from '../../constants/typography';

const AddFlat = ({ navigation }) => {
  const { addFlat, buildings } = useSociety();
  const [flatNumber, setFlatNumber] = useState('');
  const [building, setBuilding] = useState(buildings[0]?.name || '');
  const [floor, setFloor] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!flatNumber.trim()) {
      Alert.alert('Error', 'Flat number is required');
      return;
    }
    setLoading(true);
    const success = await addFlat({
      flatNumber: flatNumber.trim(),
      building,
      floor: parseInt(floor, 10) || 1,
      areaSqft: parseInt(area, 10) || 0,
    });
    setLoading(false);
    if (success) {
      Alert.alert('Success', 'Flat added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Flat" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Flat Number"
          value={flatNumber}
          onChangeText={setFlatNumber}
          placeholder="e.g., A-301"
          icon="door"
        />
        <Input
          label="Building / Wing"
          value={building}
          onChangeText={setBuilding}
          placeholder="e.g., A Wing"
          icon="office-building"
        />
        <Input
          label="Floor"
          value={floor}
          onChangeText={setFloor}
          placeholder="e.g., 3"
          icon="stairs"
          keyboardType="number-pad"
        />
        <Input
          label="Area (sq. ft.)"
          value={area}
          onChangeText={setArea}
          placeholder="e.g., 950"
          icon="ruler-square"
          keyboardType="number-pad"
        />
        <Button
          title="Add Flat"
          onPress={handleAdd}
          loading={loading}
          icon="plus-circle"
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenHorizontal, paddingTop: spacing.lg },
});

export default AddFlat;
