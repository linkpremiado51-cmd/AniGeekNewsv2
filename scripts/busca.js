/* scripts/busca.js */

// Seleção dos elementos baseada no seu index.html
const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');

/**
 * Renderiza os resultados na superfície flutuante abaixo da barra de busca
 */
function renderizarSuperficie(lista) {
    if (!surface) return;

    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:15px; font-size:12px; color:#888; text-align:center;">Nenhum resultado encontrado.</div>';
    } else {
        surface.innerHTML = lista.map(news => {
            // Tenta pegar a thumb do primeiro vídeo relacionado ou a principal, senão usa padrão
            const thumb = news.thumb || (news.relacionados && news.relacionados[0] ? news.relacionados[0].thumb : 'https://anigeeknews.com/default-og.jpg');
            
            return `
            <div class="result-item-list" onclick="window.focarNoticia('${news.id}')" style="cursor:pointer;">
                <img src="${thumb}" class="result-img" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div class="result-info">
                    <div class="result-cat" style="color: ${news.cor || 'var(--primary)'}; font-size:10px; font-weight:800; text-transform:uppercase;">${news.categoria}</div>
                    <h4 class="result-title" style="margin:0; font-size:13px; color:var(--text-main);">${news.titulo}</h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}

/**
 * Lógica de filtragem enquanto o usuário digita
 */
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo === "") { 
            if (surface) surface.style.display = 'none'; 
            return; 
        }

        // Filtra a lista centralizada pelo config-firebase.js
        const filtradas = (window.noticiasFirebase || []).filter(n => 
            (n.titulo && n.titulo.toLowerCase().includes(termo)) || 
            (n.categoria && n.categoria.toLowerCase().includes(termo)) ||
            (n.resumo && n.resumo.toLowerCase().includes(termo))
        );

        renderizarSuperficie(filtradas);
    });
}

/**
 * Função chamada ao clicar em um resultado da busca
 */
window.focarNoticia = (id) => {
    if (surface) surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";
    
    const noticia = (window.noticiasFirebase || []).find(n => n.id === id);
    
    if (noticia) {
        // 1. Se a função de renderizar já existir (estamos na seção certa), usamos ela
        if (typeof window.renderizarNoticias === 'function') {
            window.renderizarNoticias([noticia]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // 2. Se não estivermos na seção da notícia, carregamos a seção primeiro
            // O sistema padrão de onSnapshot do Firebase cuidará de mostrar os dados
            if (typeof window.carregarSecao === 'function') {
                window.carregarSecao(noticia.origem || 'manchetes');
            }
        }
    }
};

/**
 * Fecha a superfície de resultados se clicar fora da barra de busca
 */
document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) {
        surface.style.display = 'none';
    }
});

console.log("🔍 Busca Global: Modo estável ativado.");
