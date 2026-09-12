import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-PcPTL1IR49D8bKZFmL_WMSm2osAMQ_k",
  authDomain: "ecolista-87306.firebaseapp.com",
  projectId: "ecolista-87306",
  storageBucket: "ecolista-87306.firebasestorage.app",
  messagingSenderId: "614501453421",
  appId: "1:614501453421:web:9dbf07dc92b2130805f964"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);