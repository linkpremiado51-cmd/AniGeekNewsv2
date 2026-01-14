/* scripts/busca.js */

// Seleção dos elementos baseada no seu index.html
const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');
let timeoutBusca = null;

/**
 * Renderiza os resultados na superfície flutuante
 */
function renderizarSuperficie(lista) {
    if (!surface) return;

    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:15px; font-size:12px; color:#888; text-align:center;">Nenhum resultado encontrado.</div>';
    } else {
        surface.innerHTML = lista.map(news => {
            const thumb = news.thumb || (news.relacionados && news.relacionados[0] ? news.relacionados[0].thumb : 'https://anigeeknews.com/default-og.jpg');
            
            return `
            <div class="result-item-list" onclick="window.focarNoticia('${news.id}')" style="cursor:pointer; display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid rgba(0,0,0,0.05);">
                <img src="${thumb}" class="result-img" style="width:50px; height:50px; object-fit:cover; border-radius:4px; flex-shrink:0;" loading="lazy">
                <div class="result-info">
                    <div class="result-cat" style="color: ${news.cor || 'var(--primary)'}; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">${news.categoria}</div>
                    <h4 class="result-title" style="margin:2px 0 0 0; font-size:13px; font-weight:700; color:var(--text-main); line-height:1.2;">${news.titulo}</h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}

/**
 * Lógica de filtragem otimizada (Debounce)
 */
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        clearTimeout(timeoutBusca);
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo === "") { 
            if (surface) surface.style.display = 'none'; 
            return; 
        }

        // Debounce de 150ms: evita processamento excessivo enquanto o usuário digita rápido
        timeoutBusca = setTimeout(() => {
            // Usa o window.noticiasFirebase que agora é alimentado pelo cache e pelo Firebase
            const filtradas = (window.noticiasFirebase || []).filter(n => 
                (n.titulo && n.titulo.toLowerCase().includes(termo)) || 
                (n.categoria && n.categoria.toLowerCase().includes(termo)) ||
                (n.resumo && n.resumo.toLowerCase().includes(termo))
            ).slice(0, 8); // Limitamos a 8 resultados para manter a UI limpa e rápida

            renderizarSuperficie(filtradas);
            console.log(`🔍 [Busca] Filtrado entre ${(window.noticiasFirebase || []).length} itens no cache.`);
        }, 150);
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
        // Atualiza URL
        const url = new URL(window.location);
        url.searchParams.set('id', id);
        window.history.pushState({ id: id }, '', url);

        // Abre o Modal (sem recarregar a página ou a seção)
        if (typeof window.abrirModalNoticia === 'function') {
            window.abrirModalNoticia(noticia);
        }
    }
};

/**
 * Fecha a superfície se clicar fora
 */
document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) {
        surface.style.display = 'none';
    }
});

console.log("🔍 Busca Global: Otimizada com cache e debounce.");
