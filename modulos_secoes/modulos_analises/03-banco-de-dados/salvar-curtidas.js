
// modulos_secoes/modulos_analises/03-banco-de-dados/salvar-curtidas.js
import { doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../01-conexao-com-servidor/configuracao-firebase.js";

/**
 * Coração: Gerencia os likes das notícias.
 * @param {string} idNoticia - O ID único do documento no Firestore.
 */
export async function curtirNoticia(idNoticia) {
  try {
    // 1. Atualização Visual Imediata (Otimista)
    const spanCurtidas = document.querySelector(`#artigo-${idNoticia} .num-like`);
    if (spanCurtidas) {
      let atual = parseInt(spanCurtidas.innerText) || 0;
      spanCurtidas.innerText = atual + 1;
    }

    // 2. Atualização no Banco de Dados
    const noticiaRef = doc(db, "analises", idNoticia);
    await updateDoc(noticiaRef, { 
      curtidas: increment(1) 
    });

  } catch (err) {
    console.error("Erro ao salvar curtida:", err);
  }
}

// Vincula ao window para manter compatibilidade com os cliques no HTML
window.curtirNoticia = curtirNoticia;
