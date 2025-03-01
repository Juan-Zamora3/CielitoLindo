import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 Importar Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCyVVzmzp-N7WVDsdcVxgchiz0W4znxY3w",
  authDomain: "cielitolindo-8c69c.firebaseapp.com",
  projectId: "cielitolindo-8c69c",
  storageBucket: "cielitolindo-8c69c.appspot.com",
  messagingSenderId: "427410635515",
  appId: "1:427410635515:web:3020e956a99f02081cce5e",
  measurementId: "G-0SYN4VNWYM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 🔥 Inicializar Firestore

export { app, auth, db }; // 🔥 Asegurarse de exportar 'db'
