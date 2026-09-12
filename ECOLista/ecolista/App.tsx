// App.tsx - Gerenciamento de Autenticação e Onboarding
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './src/config/firebaseConfig';

import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ShoppingListScreen } from './src/screens/ShoppingListScreen';
import { FinancialControlScreen } from './src/screens/FinancialControlScreen';
import { RecipesScreen } from './src/screens/RecipesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (usuarioLogado) => {
      setUser(usuarioLogado);
      
      if (usuarioLogado) {
        // Verifica se o usuário já viu o tutorial
        const visto = await AsyncStorage.getItem(`@onboarding_${usuarioLogado.uid}`);
        if (!visto) {
          setShowOnboarding(true);
        }
      }

      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  const handleFinishOnboarding = async () => {
    if (user) {
      await AsyncStorage.setItem(`@onboarding_${user.uid}`, 'true');
    }
    setShowOnboarding(false);
  };

  if (initializing) return null;

  if (!user) {
    return <LoginScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleFinishOnboarding} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { 
            backgroundColor: '#fff', 
            borderTopWidth: 1, 
            borderTopColor: '#e0e0e0', 
            height: 60, 
            paddingBottom: 8, 
            paddingTop: 6 
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          }
        }}
      >
        <Tab.Screen 
          name="Início" 
          component={HomeStack} 
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🏠</Text> }} 
        />
        <Tab.Screen 
          name="Finanças" 
          component={FinancialControlScreen} 
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>📊</Text> }} 
        />
        <Tab.Screen 
          name="Receitas" 
          component={RecipesScreen} 
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🍳</Text> }} 
        />
        <Tab.Screen 
          name="Perfil" 
          component={ProfileScreen} 
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>👤</Text> }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}