import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';

export default function TabLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsLoading(false);
          return;
        }
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    verificarRole();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1E1E1E', borderTopColor: '#333', height: 75, paddingBottom: 8 },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Painel', tabBarIcon: ({ color }) => <Ionicons name="leaf" size={22} color={color} /> }} />
      <Tabs.Screen name="graficos" options={{ title: 'Gráficos', tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={22} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Novo', tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={22} color={color} /> }} />
      <Tabs.Screen name="pontos" options={{ title: 'Pontos', tabBarIcon: ({ color }) => <Ionicons name="trophy" size={22} color={color} /> }} />
      <Tabs.Screen name="mapa" options={{ title: 'Mapa', tabBarIcon: ({ color }) => <Ionicons name="map" size={22} color={color} /> }} />

      <Tabs.Screen 
        name="admin" 
        options={{ 
          title: 'Admin', 
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
          href: !isLoading && isAdmin ? '/admin' : null 
        }} 
      />
    </Tabs>
  );
}