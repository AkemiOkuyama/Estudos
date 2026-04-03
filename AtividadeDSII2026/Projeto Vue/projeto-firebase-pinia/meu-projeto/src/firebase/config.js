import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA2xTXoseuQOSd3apsYML1wc2cU7Zj9pGg",
  authDomain: "projeto-vue-3488d.firebaseapp.com",
  projectId: "projeto-vue-3488d",
  storageBucket: "projeto-vue-3488d.firebasestorage.app",
  messagingSenderId: "658854012753",
  appId: "1:658854012753:web:6ac30cf42bf1b4c8261570",
  measurementId: "G-769NVSNV2H"
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
auth.languageCode = 'pt-BR'

const db = getFirestore(app)

export { auth, db }