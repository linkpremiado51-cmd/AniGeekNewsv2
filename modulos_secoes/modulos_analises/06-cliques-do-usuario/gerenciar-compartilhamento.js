
/**
 * modulos_secoes/modulos_analises/06-cliques-do-usuario/gerenciar-compartilhamento.js
 * Social: Funções para compartilhar conteúdo e copiar links.
 */

/**
 * Tenta usar o compartilhamento nativo do dispositivo; caso contrário, copia o link.
 * @param {string} titulo - O título da notícia.
 * @param {string} url - O link direto (deep link) da notícia.
 */
export function compartilharNoticia(titulo, url) {
  if (navigator.share) {
    navigator.share({
      title: titulo,
      url: url
    }).catch(err => console.error("Erro ao compartilhar:", err));
  } else {
    copiarLinkParaAreaDeTransferencia(url);
  }
}

/**
 * Copia uma URL para a área de transferência e exibe um feedback visual (toast).
 * @param {string} url - A URL a ser copiada.
 */
export async function copiarLinkParaAreaDeTransferencia(url) {
  try {
    await navigator.clipboard.writeText(url);
    
    // Feedback visual (Toast)
    const toast = document.getElementById('toast-copiado');
    if (toast) {
      toast.classList.add('mostrar');
      setTimeout(() => {
        toast.classList.remove('mostrar');
      }, 2500);
    }
  } catch (err) {
    console.error("Erro ao copiar link:", err);
  }
}

// Vincula as funções ao escopo global para manter compatibilidade com os eventos 'onclick' do HTML gerado nos moldes
window.shareNews = compartilharNoticia;
window.copiarLink = copiarLinkParaAreaDeTransferencia;
