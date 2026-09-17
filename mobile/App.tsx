import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CategoryScreen } from './src/views/CategoryScreen';
import { MovementScreen } from './src/views/MovementScreen';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: theme.fontSizes.lg,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
        }}
      >
        <Tab.Screen
          name="Categorias"
          component={CategoryScreen}
          options={{
            title: 'Mis Categorías',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetags" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Movimientos"
          component={MovementScreen}
          options={{
            title: 'Movimientos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="swap-horizontal" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}