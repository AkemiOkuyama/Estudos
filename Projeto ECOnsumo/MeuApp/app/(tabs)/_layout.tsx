import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#1E1E1E', borderTopColor: '#333', height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel 🌱',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="graficos"
        options={{
          title: 'Gráficos 📊',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Novo Aparelho',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pontos"
        options={{
          title: 'Pontos 🪙',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}