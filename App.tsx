import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/services/firebaseConfig';

// Vistas existentes
import { CategoryScreen } from './src/views/CategoryScreen';
import { MovementScreen } from './src/views/MovementScreen';
import { theme } from './src/theme/theme';

// Nuevas vistas de autenticación
import { LoginScreen } from './src/views/LoginScreen';
import { RegisterScreen } from './src/views/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Puedes retornar un ActivityIndicator aquí

  return (
    <NavigationContainer>
      {user ? (
        // Usuario logueado: Muestra la app principal
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
      ) : (
        // Usuario no logueado: Muestra login y registro
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}