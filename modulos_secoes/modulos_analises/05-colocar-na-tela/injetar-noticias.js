/**
 * modulos_secoes/modulos_analises/05-colocar-na-tela/injetar-noticias.js
 * Montador: Orquestra a exibição dos cards no container principal.
 */

import { criarTemplateCard } from "../04-desenhos-visuais/molde-do-card-noticia.js";
import { limparEspacos } from "../02-ajustes-de-texto/formatar-links-e-espacos.js";

/**
 * Renderiza o banner de destaque (Hero) no topo da página.
 */
export function renderizarHero(primeiraNoticia) {
    const heroArea = document.getElementById('hero-area');
    if (!heroArea || !primeiraNoticia) return;

    if (primeiraNoticia.capaUrl) {
        heroArea.innerHTML = `
            <div class="hero-topo-container">
                <img src="${limparEspacos(primeiraNoticia.capaUrl)}" class="hero-topo-img" alt="Capa">
                ${primeiraNoticia.capaDesc ? `<div class="hero-topo-desc">${primeiraNoticia.capaDesc}</div>` : ''}
            </div>
        `;
        heroArea.style.display = 'block';
    } else {
        heroArea.style.display = 'none';
    }
}

/**
 * Gerencia a injeção de notícias e atualização de contadores em tempo real.
 */
export async function renderizarNoticias(todasAsNoticias, noticiasExibidas) {
    const container = document.getElementById('container-principal');
    const btnPaginacao = document.getElementById('pagination-control');
    if (!container) return;

    const baseUrl = window.location.origin + window.location.pathname;

    // 1. Atualiza o Hero com a notícia mais recente
    if (todasAsNoticias.length > 0) { 
        renderizarHero(todasAsNoticias[0]); 
    }

    // Se o argumento noticiasExibidas não for passado (ex: vindo do abrirNoticiaUnica), 
    // assumimos que queremos mostrar todas da lista enviada.
    const limite = noticiasExibidas || todasAsNoticias.length;
    const listaParaExibir = todasAsNoticias.slice(0, limite);

    listaParaExibir.forEach(news => {
        const artigoExistente = document.getElementById(`artigo-${news.id}`);
        const shareUrl = `${baseUrl}?id=${encodeURIComponent(news.id)}`;

        if (artigoExistente) {
            const spanLike = artigoExistente.querySelector('.num-like');
            if (spanLike) spanLike.innerText = news.curtidas || 0;
            
            const spanView = artigoExistente.querySelector('.num-view');
            if (spanView) spanView.innerText = news.visualizacoes || 0;
        } else {
            const html = criarTemplateCard(news, shareUrl);
            container.insertAdjacentHTML('beforeend', html);
        }
    });

    if (btnPaginacao) {
        btnPaginacao.style.display = limite < todasAsNoticias.length ? 'block' : 'none';
    }

    try {
        const containersComentarios = document.querySelectorAll('.container-comentarios-dinamico');
        if (containersComentarios.length > 0) {
            await import('../../comentarios/comentarios.js');
        }
    } catch (err) {
        console.error("Erro ao carregar script de comentários:", err);
    }
}

// PONTE DE COMPATIBILIDADE:
// Expõe a função para o objeto window para que o navegacao.js 
// possa disparar a renderização de notícias únicas ou seções.
window.renderizarNoticias = renderizarNoticias;
