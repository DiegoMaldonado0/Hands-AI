// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHjmkgFmOSFkLKnokYnGAJsAEPL9D_HPU",
  authDomain: "fir-eec17.firebaseapp.com",
  projectId: "fir-eec17",
  storageBucket: "fir-eec17.appspot.com",
  messagingSenderId: "769947960603",
  appId: "1:769947960603:web:f23731ad2e3a8871fcffbe",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Asegúrate de que Firebase esté inicializado antes de usarlo
console.log("Firebase inicializado correctamente");
