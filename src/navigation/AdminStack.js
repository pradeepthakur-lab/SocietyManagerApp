import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from '../screens/admin/AdminDashboard';
import SocietySetup from '../screens/admin/SocietySetup';
import FlatManagement from '../screens/admin/FlatManagement';
import AddFlat from '../screens/admin/AddFlat';
import ResidentManagement from '../screens/admin/ResidentManagement';
import AddResident from '../screens/admin/AddResident';
import BillGeneration from '../screens/admin/BillGeneration';
import PaymentVerification from '../screens/admin/PaymentVerification';
import PaymentDetail from '../screens/admin/PaymentDetail';
import Expenses from '../screens/admin/Expenses';

// Shared screens
import VisitorLog from '../screens/shared/VisitorLog';
import AddVisitor from '../screens/shared/AddVisitor';
import VisitorDetail from '../screens/shared/VisitorDetail';
import VehicleManagement from '../screens/shared/VehicleManagement';
import AddVehicle from '../screens/shared/AddVehicle';
import VehicleDetail from '../screens/shared/VehicleDetail';

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="SocietySetup" component={SocietySetup} />
      <Stack.Screen name="FlatManagement" component={FlatManagement} />
      <Stack.Screen name="AddFlat" component={AddFlat} />
      <Stack.Screen name="ResidentManagement" component={ResidentManagement} />
      <Stack.Screen name="AddResident" component={AddResident} />
      <Stack.Screen name="BillGeneration" component={BillGeneration} />
      <Stack.Screen name="PaymentVerification" component={PaymentVerification} />
      <Stack.Screen name="PaymentDetail" component={PaymentDetail} />
      <Stack.Screen name="Expenses" component={Expenses} />
      {/* Visitor screens */}
      <Stack.Screen name="VisitorLog" component={VisitorLog} />
      <Stack.Screen name="AddVisitor" component={AddVisitor} />
      <Stack.Screen name="VisitorDetail" component={VisitorDetail} />
      {/* Vehicle screens */}
      <Stack.Screen name="VehicleManagement" component={VehicleManagement} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
    </Stack.Navigator>
  );
};

export default AdminStack;
