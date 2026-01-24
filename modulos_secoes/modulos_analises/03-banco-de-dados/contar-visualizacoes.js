
// modulos_secoes/modulos_analises/03-banco-de-dados/contar-visualizacoes.js
import { doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../01-conexao-com-servidor/configuracao-firebase.js";

/**
 * Registra uma visualização no banco de dados.
 * Extraído da lógica original do analises.html.
 * @param {string} idNoticia - ID único da notícia no Firestore.
 */
export async function incrementarVisualizacao(idNoticia) {
  if (!idNoticia) return;

  try {
    const noticiaRef = doc(db, "analises", idNoticia);
    await updateDoc(noticiaRef, { 
      visualizacoes: increment(1) 
    });
  } catch (err) {
    console.error("Erro ao incrementar visualização:", err);
  }
}
