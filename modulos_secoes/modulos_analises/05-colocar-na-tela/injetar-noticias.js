
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

    // 2. Filtra apenas a quantidade permitida pela paginação
    const listaParaExibir = todasAsNoticias.slice(0, noticiasExibidas);

    listaParaExibir.forEach(news => {
        const artigoExistente = document.getElementById(`artigo-${news.id}`);
        const shareUrl = `${baseUrl}?id=${encodeURIComponent(news.id)}`;

        if (artigoExistente) {
            // Se o card já existe, apenas atualizamos os números (Performance)
            const spanLike = artigoExistente.querySelector('.num-like');
            if (spanLike) spanLike.innerText = news.curtidas || 0;
            
            const spanView = artigoExistente.querySelector('.num-view');
            if (spanView) spanView.innerText = news.visualizacoes || 0;
        } else {
            // Se o card é novo, gera o HTML usando o molde e injeta
            const html = criarTemplateCard(news, shareUrl);
            container.insertAdjacentHTML('beforeend', html);
        }
    });

    // 3. Gerencia a visibilidade do botão "Carregar Mais"
    if (btnPaginacao) {
        btnPaginacao.style.display = noticiasExibidas < todasAsNoticias.length ? 'block' : 'none';
    }

    // 4. Aciona o carregamento dos comentários (Dinamismo extra)
    try {
        const containersComentarios = document.querySelectorAll('.container-comentarios-dinamico');
        if (containersComentarios.length > 0) {
            await import('../../comentarios/comentarios.js');
        }
    } catch (err) {
        console.error("Erro ao carregar script de comentários:", err);
    }
}
