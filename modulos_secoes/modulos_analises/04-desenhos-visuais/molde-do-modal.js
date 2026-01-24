
/**
 * modulos_secoes/modulos_analises/04-desenhos-visuais/molde-do-modal.js
 * Janela: Define como o conteúdo é renderizado dentro do modal aberto.
 */

import { limparEspacos } from "../02-ajustes-de-texto/formatar-links-e-espacos.js";
import { criarGridFichaTecnica, criarFichaEditor } from "./molde-da-ficha-tecnica.js";

/**
 * Preenche os elementos do modal com os dados da notícia selecionada.
 * @param {Object} noticia - Objeto completo da notícia vindo do Firestore.
 */
export function renderizarConteudoModal(noticia) {
  // 1. Textos e Links Básicos
  document.getElementById('modal-titulo').innerText = noticia.titulo;
  document.getElementById('modal-categoria').innerHTML = `<i class="fa-solid fa-video"></i> ${noticia.categoria}`;
  document.getElementById('modal-resumo').innerText = noticia.resumo;
  document.getElementById('modal-link').href = noticia.linkArtigo;

  // 2. Lógica de Capa (Prioriza capaNoticia para o Modal)
  const modalCapaContainer = document.getElementById('modal-capa-container');
  const modalCapaImg = document.getElementById('modal-capa-img');
  const imgCapa = noticia.capaNoticia || noticia.capaUrl;

  if (imgCapa) {
    modalCapaImg.src = limparEspacos(imgCapa);
    modalCapaContainer.style.display = 'block';
  } else {
    modalCapaContainer.style.display = 'none';
  }

  // 3. Informações Técnicas e Editor
  // Limpa o container de ficha para evitar duplicidade ao abrir diferentes notícias
  const containerFicha = document.getElementById('modal-ficha');
  containerFicha.innerHTML = "";

  // Adiciona a Ficha do Editor (se existir)
  if (noticia.fichaCategoria) {
    const htmlEditor = criarFichaEditor(noticia.fichaCategoria);
    containerFicha.insertAdjacentHTML('beforebegin', htmlEditor);
  }

  // Adiciona o Grid Técnico
  containerFicha.innerHTML = criarGridFichaTecnica(noticia.ficha);

  // 4. Mídia (Vídeo Principal)
  document.getElementById('modal-video').src = limparEspacos(noticia.videoPrincipal);
}
