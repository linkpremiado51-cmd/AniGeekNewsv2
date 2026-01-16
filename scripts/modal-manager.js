/* scripts/modal-manager.js */

// O Firebase já está inicializado no config-firebase.js, usamos o window.db se necessário,
// mas para performance, usaremos o cache global window.noticiasFirebase.

let noticiasDaSessao = []; 
let indiceAtual = 0;

const estruturaHTML = `
<div id="modal-noticia-global">
    <div class="modal-content">
        <div class="video-header">
            <iframe id="m-video" src="" allow="autoplay; fullscreen"></iframe>
            <button class="close-modal-btn" onclick="window.fecharModalGlobal()">×</button>
        </div>
        <div class="modal-body">
            <div id="m-categoria"></div>
            <h2 id="m-titulo"></h2>
            <div id="m-ficha"></div>
            <p id="m-resumo"></p>
        </div>
        <div class="modal-nav-footer">
            <button class="btn-nav" onclick="window.navegarNoticia(-1)">
                <i class="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <a id="m-link" target="_blank" class="btn-ver-artigo-modal">ABRIR MATÉRIA</a>
            <button class="btn-nav" onclick="window.navegarNoticia(1)">
                Próxima <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </div>
</div>`;

// Injeção da estrutura se não existir
if (!document.getElementById('modal-noticia-global')) {
    document.body.insertAdjacentHTML('beforeend', estruturaHTML);
}

/**
 * Renderiza os dados no Modal com suporte a cores dinâmicas
 */
const renderizarDadosNoModal = (noticia) => {
    if (!noticia) return;

    const cor = noticia.cor || "#ff0000";
    const modal = document.getElementById('modal-noticia-global');
    modal.style.setProperty('--tema-cor', cor);

    // Título e Categoria
    document.getElementById('m-categoria').innerText = noticia.categoria || "GEEK";
    document.getElementById('m-titulo').innerText = noticia.titulo;
    document.getElementById('m-resumo').innerText = noticia.resumo || "";
    document.getElementById('m-link').href = noticia.linkArtigo || "#";

    // Tratamento de Vídeo
    let vUrl = noticia.videoPrincipal || "";
    if (vUrl.includes("watch?v=")) {
        vUrl = vUrl.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&modestbranding=1";
    }
    document.getElementById('m-video').src = vUrl;

    // Ficha Técnica (Grid Executivo)
    const fichaContainer = document.getElementById('m-ficha');
    if (noticia.ficha && noticia.ficha.length > 0) {
        fichaContainer.style.display = 'grid';
        fichaContainer.innerHTML = noticia.ficha.map(item => `
            <div class="info-item">
                <span class="info-label">${item.label}</span>
                <span class="info-valor">${item.valor}</span>
            </div>
        `).join('');
    } else {
        fichaContainer.style.display = 'none';
    }
    
    // Atualiza a URL para permitir compartilhamento da notícia atual na navegação
    const url = new URL(window.location);
    url.searchParams.set('id', noticia.id);
    window.history.pushState({}, '', url);
};

/**
 * Abre o modal usando o objeto da notícia já carregado (mais rápido que buscar no Firebase de novo)
 */
window.abrirModalNoticia = (noticia) => {
    if (!noticia) return;

    const modal = document.getElementById('modal-noticia-global');
    
    // 1. Define a "Playlist" baseada na mesma coleção/origem da notícia aberta
    // Isso garante que os botões Próximo/Anterior funcionem corretamente
    noticiasDaSessao = (window.noticiasFirebase || []).filter(n => n.origem === noticia.origem);
    
    // 2. Localiza o índice da notícia atual
    indiceAtual = noticiasDaSessao.findIndex(n => n.id === noticia.id);

    // 3. Renderiza e mostra
    renderizarDadosNoModal(noticia);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

/**
 * Navegação interna: Troca o conteúdo sem fechar o modal
 */
window.navegarNoticia = (direcao) => {
    const novoIndice = indiceAtual + direcao;
    
    if (novoIndice >= 0 && novoIndice < noticiasDaSessao.length) {
        indiceAtual = novoIndice;
        renderizarDadosNoModal(noticiasDaSessao[indiceAtual]);
    } else {
        console.log("Fim da lista nesta categoria.");
    }
};

window.fecharModalGlobal = () => {
    const modal = document.getElementById('modal-noticia-global');
    modal.style.display = 'none';
    document.getElementById('m-video').src = "";
    document.body.style.overflow = 'auto';

    // Limpa o ID da URL ao fechar
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
};
