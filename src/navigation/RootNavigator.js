import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { ADMIN_ROLES, MANAGER_ROLES, SECURITY_ROLES } from '../constants/roles';
import AuthStack from './AuthStack';
import AdminTabs from './AdminTabs';
import ResidentTabs from './ResidentTabs';
import SecurityTabs from './SecurityTabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={makeStyles(colors).loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isAdmin = user && (ADMIN_ROLES.includes(user.role) || user.role === 'manager');
  const isSecurity = user && SECURITY_ROLES.includes(user.role);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : isSecurity ? (
        <SecurityTabs />
      ) : isAdmin ? (
        <AdminTabs />
      ) : (
        <ResidentTabs />
      )}
    </NavigationContainer>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
