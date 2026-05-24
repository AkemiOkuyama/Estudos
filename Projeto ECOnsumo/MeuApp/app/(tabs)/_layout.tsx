import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';

export default function TabLayout() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verificarRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      } catch (error) {
        console.log('Erro ao verificar role:', error);
      }
    };
    verificarRole();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#1E1E1E', borderTopColor: '#333', height: 75, paddingBottom: 8 },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Painel', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="graficos" options={{ title: 'Gráficos', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Novo Aparelho', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="pontos" options={{ title: 'Pontos', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="admin" options={{ href: isAdmin ? undefined : null, title: 'Admin', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="register" options={{ title: 'Registro', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="mapa" options={{ title: 'Mapa', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'map' : 'map-outline'} size={22} color={color} /> }} />
    </Tabs>
  );
}