/* ======================================================
   AniGeekNews – Sistema de Navegação & Memória v13.0
   • Memória de Estado Total (LocalStorage)
   • Persistência de Seção e Scroll
   • Integração com Deep Linking e Links Compartilhados
   • Sincronização com o Módulo de Comentários
====================================================== */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

// Chaves para o LocalStorage
const STORAGE_KEYS = {
    ULTIMA_SECAO: 'ag_last_section',
    ULTIMO_SCROLL: 'ag_last_scroll'
};

/**
 * Salva o estado atual da navegação
 */
function salvarEstado(secao) {
    localStorage.setItem(STORAGE_KEYS.ULTIMA_SECAO, secao);
}

/**
 * Garante que o módulo de comentários seja reiniciado
 */
function reiniciarModuloComentarios() {
    if (typeof window.inicializarComentarios === 'function') {
        window.inicializarComentarios();
    }
}

/**
 * Scroll inteligente até a notícia baseada no data-id
 */
function rolarParaNoticiaPorId(id) {
    const tentativasMax = 25;
    let tentativas = 0;

    const tentar = () => {
        const el = document.querySelector(`[data-id="${id}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.classList.add('highlight-noticia');
            setTimeout(() => el.classList.remove('highlight-noticia'), 2500);
        } else if (tentativas < tentativasMax) {
            tentativas++;
            setTimeout(tentar, 150);
        }
    };
    tentar();
}

/**
 * Carrega uma seção normalmente (lista de notícias)
 * @param {string} nome - ID da seção
 * @param {boolean} restaurarScroll - Se deve voltar para a posição anterior
 */
async function carregarSecao(nome, restaurarScroll = false) {
    if (!displayPrincipal) return;

    // Feedback visual de carregamento
    displayPrincipal.innerHTML =
        '<div style="text-align:center;padding:120px;color:var(--text-muted);opacity:.5;font-weight:900;letter-spacing:2px;">SINCRONIZANDO...</div>';

    try {
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Arquivo não encontrado.");

        const html = await response.text();
        displayPrincipal.innerHTML = html;

        // Reexecuta scripts da seção carregada
        const scripts = displayPrincipal.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
        });

        // Salva esta seção como a última visitada
        salvarEstado(nome);

        // Lógica de Scroll: Ou restaura a memória ou vai para o topo
        if (restaurarScroll) {
            const pos = localStorage.getItem(STORAGE_KEYS.ULTIMO_SCROLL);
            if (pos) window.scrollTo({ top: parseInt(pos), behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setTimeout(reiniciarModuloComentarios, 800);

    } catch (err) {
        console.error("Erro ao carregar seção:", err);
        displayPrincipal.innerHTML =
            `<div style="text-align:center;padding:100px;font-weight:bold;color:red;">Erro: A seção "${nome}" não pôde ser carregada.</div>`;
    }
}

/**
 * Resolve links compartilhados (Ex: ?id=noticia-123)
 */
function verificarLinkCompartilhado() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return false;

    // Busca a notícia no banco de dados global (se existir)
    const item = window.noticias?.find(n => n.id === id);
    const secao = item?.origem || 'manchetes';

    // Ativa a aba visualmente
    marcarAbaComoAtiva(secao);
    
    carregarSecao(secao);

    setTimeout(() => {
        rolarParaNoticiaPorId(id);
    }, 700);
    
    return true;
}

/**
 * Apenas marca a aba visualmente sem disparar o clique
 */
function marcarAbaComoAtiva(secaoId) {
    document.querySelectorAll('.filter-tag').forEach(t => {
        if (t.dataset.section === secaoId || t.dataset.id === secaoId) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
}

/**
 * Inicialização Principal com Memória de Estado
 */
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. Prioridade Máxima: Link Compartilhado (?id=...)
    if (params.has('id')) {
        verificarLinkCompartilhado();
    } 
    // 2. Segunda Prioridade: Memória do LocalStorage (O que o usuário estava vendo antes)
    else {
        const ultimaSecao = localStorage.getItem(STORAGE_KEYS.ULTIMA_SECAO);
        
        if (ultimaSecao) {
            marcarAbaComoAtiva(ultimaSecao);
            carregarSecao(ultimaSecao, true); // True para tentar restaurar scroll
        } 
        // 3. Fallback: Página Inicial
        else {
            const primeiraAba = document.querySelector('.filter-tag');
            if (primeiraAba) {
                primeiraAba.click();
            } else {
                carregarSecao('manchetes');
            }
        }
    }
});

/**
 * Monitora o scroll do usuário para salvar a posição em tempo real
 * (Debounce simples para não sobrecarregar o processamento)
 */
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.ULTIMO_SCROLL, window.scrollY);
    }, 200);
});

/**
 * Listener de cliques para as abas (filter-tags)
 */
document.addEventListener('click', (e) => {
    const tag = e.target.closest('.filter-tag');
    if (!tag || tag.classList.contains('cfg-btn')) return;

    const secaoId = tag.dataset.section || tag.dataset.id;
    if (!secaoId) return;

    // UI Update
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    // Comentários: Ajusta a coleção
    const containerComentarios = document.querySelector('.container-comentarios-dinamico');
    if (containerComentarios) {
        containerComentarios.setAttribute('data-colecao', secaoId);
    }

    // Limpa parâmetros de ID da URL ao trocar de aba
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);

    carregarSecao(secaoId);
    setTimeout(reiniciarModuloComentarios, 500);
});

/**
 * Gerenciamento de CSS Dinâmico
 */
function gerenciarCSSDaSecao(nome) {
    const linkAntigo = document.getElementById('css-secao-dinamica');
    if (linkAntigo) linkAntigo.remove();

    const novoLink = document.createElement('link');
    novoLink.id = 'css-secao-dinamica';
    novoLink.rel = 'stylesheet';
    novoLink.href = `./estilos/secoes/${nome}.css`;
    document.head.appendChild(novoLink);
}

// Exposição global
window.carregarSecao = carregarSecao;
