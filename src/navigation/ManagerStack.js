import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SocietyUsers from '../screens/admin/SocietyUsers';
import ResidentManagement from '../screens/admin/ResidentManagement';
import AddResident from '../screens/admin/AddResident';

const Stack = createNativeStackNavigator();

const ManagerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="SocietyUsers" component={SocietyUsers} />
      <Stack.Screen name="ResidentManagement" component={ResidentManagement} />
      <Stack.Screen name="AddResident" component={AddResident} />
    </Stack.Navigator>
  );
};

export default ManagerStack;
