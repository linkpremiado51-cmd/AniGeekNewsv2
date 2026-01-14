/* scripts/busca.js */

const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');

/**
 * Realça o termo pesquisado nos resultados
 */
const destacarTexto = (texto, termo) => {
    if (!termo) return texto;
    const regex = new RegExp(`(${termo})`, 'gi');
    return texto.replace(regex, '<mark style="background:rgba(255,255,0,0.2);color:inherit;padding:0 2px;border-radius:2px;">$1</mark>');
};

/**
 * Renderiza os resultados de todas as coleções na superfície
 */
function renderizarSuperficie(lista, termo) {
    if (lista.length === 0) {
        surface.innerHTML = `
            <div style="padding:20px; text-align:center; color:#888;">
                <i class="fa-solid fa-face-frown" style="display:block; font-size:20px; margin-bottom:10px;"></i>
                <span style="font-size:11px; font-weight:800; text-transform:uppercase;">Nenhum resultado encontrado</span>
            </div>`;
    } else {
        surface.innerHTML = lista.map(item => {
            const thumb = item.relacionados?.[0]?.thumb || item.thumb || 'https://anigeeknews.com/default-og.jpg';
            const tituloDestaque = destacarTexto(item.titulo, termo);
            
            return `
            <div class="result-item-list" onclick="focarNoticia('${item.id}')" 
                 style="border-left: 4px solid ${item.cor || 'var(--primary)'}; display:flex; gap:12px; padding:10px; cursor:pointer; align-items:center; transition:0.2s; border-bottom: 1px solid var(--border);">
                <div style="position:relative; flex-shrink:0;">
                    <img src="${thumb}" style="width:55px; height:55px; object-fit:cover; border-radius:4px;">
                    <span style="position:absolute; bottom:-5px; right:-5px; font-size:8px; background:${item.cor || 'var(--primary)'}; color:#fff; padding:2px 5px; font-weight:900; border-radius:2px; text-transform:uppercase;">
                        ${item.origem || 'GEEK'}
                    </span>
                </div>
                <div class="result-info">
                    <div class="result-cat" style="color: ${item.cor || 'var(--primary)'}; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">${item.categoria}</div>
                    <h4 class="result-title" style="font-size:13px; font-weight:700; color:var(--text-main); line-height:1.2; margin:3px 0 0 0;">${tituloDestaque}</h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}

/**
 * Lógica de busca em tempo real
 */
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo.length < 2) { 
            surface.style.display = 'none'; 
            return; 
        }

        const baseDados = window.noticiasFirebase || [];
        
        const filtradas = baseDados.filter(n => 
            (n.titulo && n.titulo.toLowerCase().includes(termo)) || 
            (n.categoria && n.categoria.toLowerCase().includes(termo)) ||
            (n.resumo && n.resumo.toLowerCase().includes(termo))
        );

        renderizarSuperficie(filtradas, termo);
    });
}

/**
 * Ação ao clicar no resultado:
 * Agora chama a função de limpeza de DOM e renderização única do navegacao.js
 */
window.focarNoticia = (id) => {
    // 1. Fecha a lista de resultados e limpa o campo de busca
    surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";
    
    // 2. Localiza o item no grande array global unificado
    const item = window.noticiasFirebase.find(n => n.id === id);
    
    if (item) {
        // 3. ATUALIZAÇÃO: Chama a função central de navegação que limpa a tela e coloca o botão Voltar
        if (typeof window.abrirNoticiaUnica === 'function') {
            window.abrirNoticiaUnica(item);
        } else {
            // Backup de segurança: se a função não existir, usa o parâmetro da URL
            window.location.href = `?id=${item.id}`;
        }
    }
};

/**
 * Fecha a busca ao clicar fora
 */
document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) {
        surface.style.display = 'none';
    }
});
