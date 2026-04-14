import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SocietyProvider } from './context/SocietyContext';
import { BillingProvider } from './context/BillingContext';
import { NotificationProvider } from './context/NotificationContext';
import RootNavigator from './navigation/RootNavigator';
import Toast from './components/Toast';

const AppInner = () => {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <AuthProvider>
        <SocietyProvider>
          <BillingProvider>
            <NotificationProvider>
              <RootNavigator />
              <Toast />
            </NotificationProvider>
          </BillingProvider>
        </SocietyProvider>
      </AuthProvider>
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppInner />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
