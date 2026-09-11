import React, { useState, useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import { Ionicons } from '@expo/vector-icons'; 
import { onAuthStateChanged, User, signOut } from 'firebase/auth'; // signOut unificado aquí 
import { auth } from './src/services/firebaseConfig'; 
import { TouchableOpacity, Alert, View } from 'react-native'; 
 
// Vistas existentes 
import { CategoryScreen } from './src/views/CategoryScreen'; 
import { MovementScreen } from './src/views/MovementScreen'; 
import { HistoryScreen } from './src/views/HistoryScreen'; 
import { theme } from './src/theme/theme'; 
 
// Nuevas vistas de autenticación 
import { LoginScreen } from './src/views/LoginScreen'; 
import { RegisterScreen } from './src/views/RegisterScreen'; 
 
const Tab = createBottomTabNavigator(); 
const Stack = createStackNavigator(); 
 
export default function App() { 
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true); 
 
  // Función para manejar el cierre de sesión 
  const handleLogout = async () => { 
    try { 
      await signOut(auth); 
    } catch (error: any) { 
      Alert.alert('Error', 'Hubo un problema al cerrar la sesión.'); 
    } 
  }; 
 
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
        <Stack.Navigator> 
          <Stack.Screen 
            name="Principal" 
            options={{ 
              headerShown: false, 
            }} 
          > 
            {() => ( 
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
 
                  // Botón de cierre de sesión global para las pestañas 
                  headerRight: () => ( 
                    <TouchableOpacity 
                      onPress={handleLogout} 
                      style={{ 
                        marginRight: 15, 
                        padding: 5, 
                      }} 
                    > 
                      <Ionicons 
                        name="log-out-outline" 
                        size={26} 
                        color={theme.colors.textLight} 
                      /> 
                    </TouchableOpacity> 
                  ), 
                }} 
              > 
                <Tab.Screen 
                  name="Categorias" 
                  component={CategoryScreen} 
                  options={{ 
                    title: 'Mis Categorías', 
                    tabBarIcon: ({ color, size }) => ( 
                      <Ionicons 
                        name="pricetags" 
                        size={size} 
                        color={color} 
                      /> 
                    ), 
                  }} 
                /> 
 
                <Tab.Screen 
                  name="Movimientos" 
                  component={MovementScreen} 
                  options={({ navigation }) => ({ 
                    title: 'Movimientos', 
                    tabBarIcon: ({ color, size }) => ( 
                      <Ionicons 
                        name="swap-horizontal" 
                        size={size} 
                        color={color} 
                      /> 
                    ), 
                    headerRight: () => ( 
                      <View 
                        style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                        }} 
                      > 
                        <TouchableOpacity 
                          onPress={() => 
                            navigation 
                              .getParent() 
                              ?.navigate('Historial' as never) 
                          } 
                          style={{ 
                            marginRight: 10, 
                            padding: 5, 
                          }} 
                        > 
                          <Ionicons 
                            name="time-outline" 
                            size={26} 
                            color={theme.colors.textLight} 
                          /> 
                        </TouchableOpacity> 
 
                        <TouchableOpacity 
                          onPress={handleLogout} 
                          style={{ 
                            marginRight: 15, 
                            padding: 5, 
                          }} 
                        > 
                          <Ionicons 
                            name="log-out-outline" 
                            size={26} 
                            color={theme.colors.textLight} 
                          /> 
                        </TouchableOpacity> 
                      </View> 
                    ), 
                  })} 
                /> 
              </Tab.Navigator> 
            )} 
          </Stack.Screen> 
 
          <Stack.Screen 
            name="Historial" 
            component={HistoryScreen} 
            options={{ 
              title: 'Historial de movimientos', 
              headerStyle: { 
                backgroundColor: theme.colors.primary, 
              }, 
              headerTintColor: theme.colors.textLight, 
              headerTitleStyle: { 
                fontWeight: 'bold', 
                fontSize: theme.fontSizes.lg, 
              }, 
            }} 
          /> 
        </Stack.Navigator> 
      ) : ( 
        // Usuario no logueado: Muestra login y registro 
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
          /> 
 
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
          /> 
        </Stack.Navigator> 
      )} 
    </NavigationContainer> 
  ); 
}