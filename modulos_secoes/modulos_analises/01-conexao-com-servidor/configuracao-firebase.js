
// modulos_secoes/modulos_analises/01-conexao-com-servidor/configuracao-firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Configurações de acesso ao Firebase extraídas do analises.html.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
  authDomain: "anigeeknews.firebaseapp.com",
  projectId: "anigeeknews",
  storageBucket: "anigeeknews.firebasestorage.app",
  messagingSenderId: "769322939926",
  appId: "1:769322939926:web:6eb91a96a3f74670882737",
  measurementId: "G-G5T8CCRGZT"
};

// Inicializa o aplicativo Firebase.
const app = initializeApp(firebaseConfig);

// Exporta o banco de dados Firestore para uso nos demais módulos.
export const db = getFirestore(app);
