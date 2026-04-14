import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminStack from './AdminStack';
import { useTheme } from '../context/ThemeContext';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

// Tab screens
import Reports from '../screens/admin/Reports';
import Notices from '../screens/admin/Notices';
import Settings from '../screens/admin/Settings';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          height: spacing.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={Reports}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notices"
        component={Notices}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bullhorn" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dots-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;
