import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ResidentDashboard from '../screens/resident/ResidentDashboard';
import BillsList from '../screens/resident/BillsList';
import BillDetail from '../screens/resident/BillDetail';
import SubmitPayment from '../screens/resident/SubmitPayment';
import Complaints from '../screens/resident/Complaints';
import MyBankingDetails from '../screens/resident/MyBankingDetails';

// Shared screens
import VehicleManagement from '../screens/shared/VehicleManagement';
import AddVehicle from '../screens/shared/AddVehicle';
import VehicleDetail from '../screens/shared/VehicleDetail';

const Stack = createNativeStackNavigator();

const ResidentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
      <Stack.Screen name="BillsList" component={BillsList} />
      <Stack.Screen name="BillDetail" component={BillDetail} />
      <Stack.Screen name="SubmitPayment" component={SubmitPayment} />
      <Stack.Screen name="Complaints" component={Complaints} />
      <Stack.Screen name="MyBankingDetails" component={MyBankingDetails} />
      {/* Vehicle screens */}
      <Stack.Screen name="VehicleManagement" component={VehicleManagement} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
    </Stack.Navigator>
  );
};

export default ResidentStack;
