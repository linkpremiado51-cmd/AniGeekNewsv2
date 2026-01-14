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
 * Carrega dinamicamente o conteúdo HTML de uma seção específica com cache em LocalStorage
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    // Chave única para o cache desta seção
    const CACHE_KEY = `cache_secao_${nome}`;
    const cachedHTML = localStorage.getItem(CACHE_KEY);

    // Se tiver no cache, carrega imediatamente para o usuário não esperar
    if (cachedHTML) {
        displayPrincipal.innerHTML = cachedHTML;
        gerenciarCSSDaSecao(nome);
        executarScriptsDaSecao(displayPrincipal);
        console.log(`⚡ [Cache] Seção '${nome}' carregada do LocalStorage.`);
    } else {
        displayPrincipal.innerHTML = '<div style="text-align: center; padding: 99px; color: var(--text-muted);">Carregando conteúdo...</div>';
    }
    
    try {
        // Busca na rede (para atualizar o cache ou carregar pela primeira vez)
        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Erro 404: Arquivo não encontrado.");
        
        const novoHtml = await response.text();

        // Se o que veio da rede é diferente do que está no cache, atualizamos a tela e o cache
        if (novoHtml !== cachedHTML) {
            localStorage.setItem(CACHE_KEY, novoHtml);
            displayPrincipal.innerHTML = novoHtml;
            gerenciarCSSDaSecao(nome);
            executarScriptsDaSecao(displayPrincipal);
            console.log(`📡 [Rede] Seção '${nome}' atualizada e guardada no cache.`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        // Se der erro de rede e não tivermos cache, mostra erro
        if (!cachedHTML) {
            displayPrincipal.innerHTML = `
                <div style="text-align: center; padding: 100px; color: var(--accent-news);">
                    Erro ao carregar seção: ${nome} <br> 
                    <small>${err.message}</small>
                </div>`;
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
        // Remove após execução para não sujar o body em futuras trocas
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
