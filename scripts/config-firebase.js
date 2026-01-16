/* scripts/config-firebase.js */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 Firebase Auth (mantido, não interfere) */
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737",
    measurementId: "G-G5T8CCRGZT"
};

const app = initializeApp(firebaseConfig);

/* 🔥 Firestore */
const db = getFirestore(app);

/* 🔥 Auth */
const auth = getAuth(app);

// --------------------------------------------------
// ESTADO GLOBAL
// --------------------------------------------------
window.noticiasFirebase = [];

let linkProcessado = false;
let ultimoIdProcessado = null;

// --------------------------------------------------
// GATILHO DE LINK (CORRIGIDO)
// --------------------------------------------------
window.verificarGatilhoDeLink = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idDesejado = urlParams.get('id');

    if (!idDesejado) {
        linkProcessado = false;
        ultimoIdProcessado = null;
        return;
    }

    // Se o ID mudou, libera novo processamento
    if (ultimoIdProcessado !== idDesejado) {
        linkProcessado = false;
        ultimoIdProcessado = idDesejado;
    }

    if (linkProcessado) return;
    if (!window.noticiasFirebase || window.noticiasFirebase.length === 0) return;

    const noticiaEncontrada = window.noticiasFirebase.find(
        n => n.id === idDesejado
    );

    if (!noticiaEncontrada) return;

    // Espera o modal existir (corrige race condition)
    let tentativas = 0;
    const aguardarModal = setInterval(() => {
        if (typeof window.abrirModalNoticia === 'function') {
            console.log("🎯 Link detectado! Abrindo modal para:", idDesejado);
            window.abrirModalNoticia(noticiaEncontrada);
            linkProcessado = true;
            clearInterval(aguardarModal);
        }

        if (++tentativas > 30) {
            clearInterval(aguardarModal);
        }
    }, 100);
};

// --------------------------------------------------
// SINCRONIZAÇÃO MULTISSEÇÃO
// --------------------------------------------------
function sincronizarComBusca(nomeColecao) {
    try {
        onSnapshot(collection(db, nomeColecao), (snapshot) => {

            // 1. Remove dados antigos da coleção
            window.noticiasFirebase = window.noticiasFirebase.filter(
                item => item.origem !== nomeColecao
            );

            // 2. Injeta novos dados
            const novosDados = snapshot.docs.map(doc => ({
                id: doc.id,
                origem: nomeColecao,
                ...doc.data()
            }));

            window.noticiasFirebase.push(...novosDados);

            // 3. Ordenação global
            window.noticiasFirebase.sort(
                (a, b) => (b.data || 0) - (a.data || 0)
            );

            console.log(`✅ [Firebase] Sincronizado: ${nomeColecao}`);

            // 4. Reavalia gatilho
            window.verificarGatilhoDeLink();

        }, (error) => {
            console.error(`❌ Erro ao sincronizar ${nomeColecao}:`, error);
        });
    } catch (err) {
        console.error(`⚠️ Falha ao inicializar coleção ${nomeColecao}:`, err);
    }
}

// --------------------------------------------------
// EXPOSIÇÕES GLOBAIS (MANTIDAS)
// --------------------------------------------------
window.db = db;
window.collection = collection;
window.onSnapshot = onSnapshot;
window.auth = auth;

// --------------------------------------------------
// COLEÇÕES ATIVAS
// --------------------------------------------------
const colecoesParaMonitorar = [
    "noticias",
    "lancamentos",
    "analises",
    "entrevistas",
    "podcast",
    "futebol",
    "smartphones",
];

colecoesParaMonitorar.forEach(nome => sincronizarComBusca(nome));

// --------------------------------------------------
// NAVEGAÇÃO DO BROWSER (VOLTA / AVANÇA)
// --------------------------------------------------
window.addEventListener('popstate', () => {
    linkProcessado = false;
    window.verificarGatilhoDeLink();
});

console.log("🔥 Motor AniGeekNews v2: Firestore + Auth inicializados (gatilho estável).");
