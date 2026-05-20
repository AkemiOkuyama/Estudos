import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole('client'); 
          }
        } catch (error) {
          console.log('Erro de conexão ignorado, assumindo cliente:', error);
          setUserRole('client'); 
        }
      } else {
        setUserRole(null);
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    const inTabsGroup = segments[0] === '(tabs)';
    const inAdminPage = segments[0] === 'admin';

    if (!user) {
      if (!inAuthGroup) router.replace('/login');
    } else {
      if (userRole === 'admin') {
        if (!inAdminPage) router.replace('/admin');
      } else if (userRole === 'client') {
        if (!inTabsGroup) router.replace('/(tabs)');
      }
    }
  }, [user, userRole, segments, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return <Slot />;
}