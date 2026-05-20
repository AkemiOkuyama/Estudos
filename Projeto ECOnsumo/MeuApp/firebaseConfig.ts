import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db: Firestore = getFirestore(app);

export { auth, db };