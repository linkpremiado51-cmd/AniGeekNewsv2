/* scripts/busca.js */

// Seleção dos elementos baseada no seu index.html
const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');

/**
 * Renderiza os resultados na superfície flutuante abaixo da barra de busca
 */
function renderizarSuperficie(lista) {
    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:15px; font-size:12px; color:#888;">Nenhum resultado encontrado.</div>';
    } else {
        surface.innerHTML = lista.map(news => `
            <div class="result-item-list" onclick="focarNoticia('${news.id}')">
                <img src="${news.relacionados?.[0]?.thumb || 'https://anigeeknews.com/default-og.jpg'}" class="result-img">
                <div class="result-info">
                    <div class="result-cat" style="color: ${news.cor || 'var(--primary)'}">${news.categoria}</div>
                    <h4 class="result-title">${news.titulo}</h4>
                </div>
            </div>
        `).join('');
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
            surface.style.display = 'none'; 
            return; 
        }

        // Filtra a lista que o config-firebase.js está mantendo atualizada
        const filtradas = (window.noticiasFirebase || []).filter(n => 
            (n.titulo && n.titulo.toLowerCase().includes(termo)) || 
            (n.categoria && n.categoria.toLowerCase().includes(termo))
        );

        renderizarSuperficie(filtradas);
    });
}

/**
 * Função chamada ao clicar em um resultado da busca
 */
window.focarNoticia = (id) => {
    surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";
    
    const noticia = window.noticiasFirebase.find(n => n.id === id);
    
    // Chama a função de renderização que está dentro do manchetes.html
    if (noticia && window.renderizarNoticias) {
        window.renderizarNoticias([noticia]);
        
        // Rola a página para o topo para ver a notícia selecionada
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
