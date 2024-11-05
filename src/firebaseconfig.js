// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHjmkgFmOSFkLKnokYnGAJsAEPL9D_HPU",
  authDomain: "fir-eec17.firebaseapp.com",
  projectId: "fir-eec17",
  storageBucket: "fir-eec17.appspot.com",
  messagingSenderId: "769947960603",
  appId: "1:769947960603:web:f23731ad2e3a8871fcffbe",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
