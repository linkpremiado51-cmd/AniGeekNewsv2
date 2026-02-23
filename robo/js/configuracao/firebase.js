/**
 * MÓDULO DE CONFIGURAÇÃO DO FIREBASE
 * Responsável pela inicialização e exportação dos serviços Cloud.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    collection, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuração extraída do código original v15.5
const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737"
};

// Inicializa o app e o banco
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportações para os outros módulos (Motor, Serviços, Utilitários)
export { 
    db, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    collection, 
    query, 
    where 
};
