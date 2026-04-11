import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VisitorLog from '../screens/shared/VisitorLog';
import AddVisitor from '../screens/shared/AddVisitor';
import VisitorDetail from '../screens/shared/VisitorDetail';
import VehicleManagement from '../screens/shared/VehicleManagement';
import VehicleDetail from '../screens/shared/VehicleDetail';

const Stack = createNativeStackNavigator();

const SecurityStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="VisitorLog" component={VisitorLog} />
      <Stack.Screen name="AddVisitor" component={AddVisitor} />
      <Stack.Screen name="VisitorDetail" component={VisitorDetail} />
      <Stack.Screen name="VehicleManagement" component={VehicleManagement} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
    </Stack.Navigator>
  );
};

export default SecurityStack;
