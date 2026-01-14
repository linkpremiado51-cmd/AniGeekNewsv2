/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/**
 * Gerencia o carregamento de CSS específico para cada seção
 */
function gerenciarCSSDaSecao(nome) {
    const linkAntigo = document.getElementById('css-secao-dinamica');
    if (linkAntigo) {
        linkAntigo.remove();
    }

    const novoLink = document.createElement('link');
    novoLink.id = 'css-secao-dinamica';
    novoLink.rel = 'stylesheet';
    novoLink.href = `./estilos/secoes/${nome}.css`;

    document.head.appendChild(novoLink);
}

/**
 * SISTEMA DE CARREGAMENTO PREGUIÇOSO (LAZY LOADING)
 * Só ativa elementos quando entram na tela
 */
function ativarObservadorDeScroll() {
    const opcoes = {
        root: null, // usa o viewport
        rootMargin: '200px', // carrega 200px antes de aparecer para evitar "pulo" visual
        threshold: 0.1
    };

    const observador = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elemento = entry.target;
                
                // Se for um iframe (vídeo), coloca o SRC real que estava guardado no DATA-SRC
                if (elemento.tagName === 'IFRAME' && elemento.dataset.src) {
                    elemento.src = elemento.dataset.src;
                    elemento.removeAttribute('data-src');
                }
                
                // Se for imagem, faz o mesmo
                if (elemento.tagName === 'IMG' && elemento.dataset.src) {
                    elemento.src = elemento.dataset.src;
                    elemento.removeAttribute('data-src');
                }

                // Para de observar este elemento já que ele já foi carregado
                observer.unobserve(elemento);
            }
        });
    }, opcoes);

    // Seleciona todos os elementos marcados para carregamento preguiçoso
    const alvos = document.querySelectorAll('iframe[data-src], img[data-src]');
    alvos.forEach(alvo => observador.observe(alvo));
}

/**
 * Carrega dinamicamente o conteúdo HTML de uma seção específica com cache
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    const CACHE_KEY = `cache_secao_${nome}`;
    const cachedHTML = localStorage.getItem(CACHE_KEY);

    if (cachedHTML) {
        displayPrincipal.innerHTML = cachedHTML;
        gerenciarCSSDaSecao(nome);
        executarScriptsDaSecao(displayPrincipal);
        ativarObservadorDeScroll(); // Ativa o observador para o conteúdo do cache
        console.log(`⚡ [Cache] Seção '${nome}' carregada.`);
    } else {
        displayPrincipal.innerHTML = '<div style="text-align: center; padding: 99px; color: var(--text-muted);">Carregando conteúdo...</div>';
    }
    
    try {
        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Erro 404: Arquivo não encontrado.");
        
        const novoHtml = await response.text();

        if (novoHtml !== cachedHTML) {
            localStorage.setItem(CACHE_KEY, novoHtml);
            displayPrincipal.innerHTML = novoHtml;
            gerenciarCSSDaSecao(nome);
            executarScriptsDaSecao(displayPrincipal);
            ativarObservadorDeScroll(); // Ativa o observador para o conteúdo novo
            console.log(`📡 [Rede] Seção '${nome}' atualizada.`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        if (!cachedHTML) {
            displayPrincipal.innerHTML = `<div style="text-align: center; padding: 100px; color: var(--accent-news);">Erro: ${err.message}</div>`;
        }
    }
}

/**
 * Auxiliar para rodar os scripts dos arquivos carregados
 */
function executarScriptsDaSecao(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        newScript.type = oldScript.type || "text/javascript";
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.text = oldScript.text;
        }
        document.body.appendChild(newScript);
        setTimeout(() => newScript.remove(), 500);
    });
}

/**
 * LÓGICA DO MODAL GLOBAL
 */
window.abrirModalNoticia = function(item) {
    const modal = document.getElementById('modal-noticia-global');
    if (!modal) return;

    document.getElementById('m-titulo').innerText = item.titulo || "";
    document.getElementById('m-categoria').innerText = item.categoria || "GEEK";
    document.getElementById('m-categoria').style.color = item.cor || "var(--primary)";
    document.getElementById('m-resumo').innerText = item.resumo || "";
    
    const iframe = document.getElementById('m-video');
    // No modal carregamos direto pois o usuário explicitamente clicou para ver
    iframe.src = item.videoPrincipal ? item.videoPrincipal.trim() : "";
    document.getElementById('m-link').href = item.linkArtigo || "#";

    const fichaContainer = document.getElementById('m-ficha');
    if (item.ficha && Array.isArray(item.ficha)) {
        fichaContainer.innerHTML = item.ficha.map(f => `
            <div class="info-item">
                <span style="display:block; font-size:10px; text-transform:uppercase; font-weight:700; color:#888;">${f.label}</span>
                <span style="font-size:13px; font-weight:600;">${f.valor}</span>
            </div>
        `).join('');
        fichaContainer.style.display = 'grid';
    } else {
        fichaContainer.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.fecharModalGlobal = function() {
    const modal = document.getElementById('modal-noticia-global');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('m-video').src = ""; 
        document.body.style.overflow = 'auto';

        const url = new URL(window.location);
        if (url.searchParams.has('id')) {
            url.searchParams.delete('id');
            window.history.pushState({}, '', url);
        }
    }
};

// Eventos de clique nos filtros
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        carregarSecao(tag.dataset.section);
    });
});

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
};

window.addEventListener('DOMContentLoaded', () => {
    carregarSecao('manchetes');
});

window.carregarSecao = carregarSecao;
// Exporta o observador para ser usado por outros scripts se necessário
window.ativarObservadorDeScroll = ativarObservadorDeScroll;

