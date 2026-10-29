import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7ZMmMsDj1Dtz4SNCLMp7xI8tbsmbaUWQ",
  authDomain: "econsumo.firebaseapp.com",
  projectId: "econsumo",
  storageBucket: "econsumo.firebasestorage.app",
  messagingSenderId: "448307929654",
  appId: "1:448307929654:web:d2c6491b5eb8c450b42e97",
  measurementId: "G-B1T9W9SW9E"
};

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);