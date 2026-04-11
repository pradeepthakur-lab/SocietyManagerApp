import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './context/AuthContext';
import { SocietyProvider } from './context/SocietyContext';
import { BillingProvider } from './context/BillingContext';
import { NotificationProvider } from './context/NotificationContext';
import RootNavigator from './navigation/RootNavigator';
import colors from './constants/colors';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <AuthProvider>
          <SocietyProvider>
            <BillingProvider>
              <NotificationProvider>
                <RootNavigator />
              </NotificationProvider>
            </BillingProvider>
          </SocietyProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
