import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC77DBNq4JzAkMtslq9qqcDx1u6SZHZDLA",
  authDomain: "projeto-gatopoles.firebaseapp.com",
  projectId: "projeto-gatopoles",
  storageBucket: "projeto-gatopoles.firebasestorage.app",
  messagingSenderId: "999361801374",
  appId: "1:999361801374:web:cc4d45cf5f0c05c69d5f8f",
  measurementId: "G-WMKX9TN924"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };