
/**
 * modulos_secoes/modulos_analises/05-colocar-na-tela/mostrar-no-modal.js
 * Exibidor: Preenche o modal e registra a visualização no banco.
 */

import { renderizarConteudoModal } from "../04-desenhos-visuais/molde-do-modal.js";
import { incrementarVisualizacao } from "../03-banco-de-dados/contar-visualizacoes.js";

/**
 * Abre o modal, preenche os dados e atualiza o histórico do navegador.
 * @param {Object} noticia - Dados da notícia.
 */
export function abrirNoticiaEmModal(noticia) {
  if (!noticia) return;

  // 1. Usa o molde visual para preencher o HTML do modal
  renderizarConteudoModal(noticia);

  // 2. Exibe o modal na tela
  const modal = document.getElementById('modal-noticia');
  if (modal) modal.style.display = 'block';

  // 3. Atualiza a URL sem recarregar a página (permite compartilhar o link do modal)
  const url = new URL(window.location);
  url.searchParams.set('id', noticia.id);
  window.history.pushState({}, '', url);

  // 4. Registra a visualização no Firebase (com pequeno delay para garantir o carregamento)
  setTimeout(() => {
    incrementarVisualizacao(noticia.id);
  }, 100);
}

/**
 * Verifica se existe um ID de notícia na URL e abre o modal automaticamente.
 * @param {Array} todasAsNoticias - Lista de notícias carregadas.
 */
export function verificarNoticiaNaUrl(todasAsNoticias) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if (id && todasAsNoticias.length > 0) {
    const noticia = todasAsNoticias.find(n => n.id === id);
    if (noticia) {
      abrirNoticiaEmModal(noticia);
    }
  }
}
