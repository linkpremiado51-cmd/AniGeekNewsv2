/* scripts/modal-manager.js */

// 1. Injeta a estrutura HTML moderna
const estruturaHTML = `
<div id="modal-noticia-global">
    <div class="modal-content">
        <div class="video-header">
            <button class="close-modal" onclick="window.fecharModalGlobal()">&times;</button>
            <iframe id="m-video" src="" allow="autoplay; fullscreen"></iframe>
        </div>
        
        <div class="modal-body">
            <div id="m-categoria"></div>
            <h2 id="m-titulo"></h2>
            <p id="m-resumo"></p>
            
            <div id="m-ficha"></div>

            <a id="m-link" href="#" target="_blank" class="btn-ver-artigo-modal">
                Ler Artigo Completo
            </a>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', estruturaHTML);

// 2. Funções de Controle
export const abrirModalNoticia = (noticia) => {
    const modal = document.getElementById('modal-noticia-global');
    if (!modal) return;

    // Define a cor do tema (vermelho por padrão conforme seu teste)
    const corNoticia = noticia.cor || "#ff0000";
    modal.style.setProperty('--tema-cor', corNoticia);

    // Preenchimento de Dados
    document.getElementById('m-categoria').innerText = noticia.categoria || "Destaque";
    document.getElementById('m-titulo').innerText = noticia.titulo;
    document.getElementById('m-resumo').innerText = noticia.resumo || "";
    
    // Tratamento de URL do Vídeo (Auto-Embed)
    let videoUrl = noticia.videoPrincipal || "";
    if(videoUrl.includes("watch?v=")) {
        videoUrl = videoUrl.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&modestbranding=1";
    }
    document.getElementById('m-video').src = videoUrl;
    
    document.getElementById('m-link').href = noticia.linkArtigo || "#";

    // Ficha Técnica (Horizontal Pills)
    const fichaContainer = document.getElementById('m-ficha');
    if (noticia.ficha && noticia.ficha.length > 0) {
        fichaContainer.innerHTML = noticia.ficha.map(item => `
            <div class="info-item">
                <span class="info-label">${item.label}</span>
                <span class="info-valor">${item.valor}</span>
            </div>
        `).join('');
    } else {
        // Caso não tenha ficha, coloca info padrão
        fichaContainer.innerHTML = `
            <div class="info-item"><span class="info-label">Tipo</span><span class="info-valor">Notícia</span></div>
            <div class="info-item"><span class="info-label">Leitura</span><span class="info-valor">2 min</span></div>
        `;
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Atualiza URL para SEO/Compartilhamento
    if (noticia.id) {
        const url = new URL(window.location);
        url.searchParams.set('id', noticia.id);
        window.history.pushState({}, '', url);
    }
};

export const fecharModalGlobal = () => {
    const modal = document.getElementById('modal-noticia-global');
    if (!modal) return;
    
    modal.style.display = 'none';
    document.getElementById('m-video').src = ""; 
    document.body.style.overflow = 'auto'; 
    
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
};

// 3. Vincula ao Window para acesso via busca.js
window.abrirModalNoticia = abrirModalNoticia;
window.fecharModalGlobal = fecharModalGlobal;

// Fecha ao clicar fora (no desktop)
window.onclick = function(event) {
    const modal = document.getElementById('modal-noticia-global');
    if (event.target == modal) {
        fecharModalGlobal();
    }
};
