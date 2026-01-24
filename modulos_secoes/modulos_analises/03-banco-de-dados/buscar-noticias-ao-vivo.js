
// modulos_secoes/modulos_analises/03-banco-de-dados/buscar-noticias-ao-vivo.js
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../01-conexao-com-servidor/configuracao-firebase.js";

/**
 * Radar: Escuta o banco de dados em tempo real.
 * @param {Function} callback - Função que será executada toda vez que os dados mudarem.
 */
export function escutarNoticiasAoVivo(callback) {
  const analisesRef = collection(db, "analises");

  onSnapshot(analisesRef, (snapshot) => {
    // Transforma os documentos do Firebase em uma lista JS pura
    const noticias = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Ordena por data (mais recente primeiro)
    noticias.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Devolve a lista organizada para quem pediu
    callback(noticias);
  });
}
