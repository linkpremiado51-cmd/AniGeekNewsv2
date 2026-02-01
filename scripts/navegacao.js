/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/**
 * Garante que o módulo de comentários seja reiniciado
 * sempre que um novo conteúdo HTML é injetado.
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
    const tentativasMax = 30;
    let tentativas = 0;

    const tentar = () => {
        const el = document.getElementById(`artigo-${id}`) || document.querySelector(`[data-id="${id}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('destacado');
            setTimeout(() => el.classList.remove('destacado'), 2500);
        } else if (tentativas < tentativasMax) {
            tentativas++;
            const btnMais = document.getElementById('btn-carregar-mais');
            if (btnMais && btnMais.offsetParent !== null) {
                btnMais.click();
            }
            setTimeout(tentar, 200);
        }
    };

    tentar();
}

/**
 * Carrega uma seção normalmente (lista de notícias)
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    // Ajuste de acessibilidade: Mantém o texto de carregamento neutro para o tema
    displayPrincipal.innerHTML =
        '<div style="text-align:center;padding:120px;color:var(--text-muted);opacity:.5">SINCRONIZANDO...</div>';

    try {
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Arquivo não encontrado.");

        const html = await response.text();
        displayPrincipal.innerHTML = html;

        // Reexecuta scripts da seção (importante para o Firebase iniciar)
        const scripts = displayPrincipal.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
        });

        // LÓGICA DE PERSISTÊNCIA: 
        const savedState = localStorage.getItem('anigeek_persistence_v2');
        let shouldScrollTop = true;

        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.scrollY > 150) {
                shouldScrollTop = false;
            }
        }

        if (shouldScrollTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        setTimeout(reiniciarModuloComentarios, 800);

    } catch (err) {
        console.error(err);
        displayPrincipal.innerHTML =
            `<div style="text-align:center;padding:100px">Erro: ${nome} não carregado.</div>`;
    }
}

/**
 * Resolve links compartilhados via query param
 */
function verificarLinkCompartilhado() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const item = window.noticias?.find(n => n.id === id);
    const secao = item?.origem || 'anime_i_geek';

    carregarSecao(secao);

    setTimeout(() => {
        rolarParaNoticiaPorId(id);
    }, 1000);
}

/**
 * Eventos de clique nas categorias (Abas)
 */
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        const saved = localStorage.getItem('anigeek_persistence_v2');
        if (saved) {
            const state = JSON.parse(saved);
            state.scrollY = 0; 
            localStorage.setItem('anigeek_persistence_v2', JSON.stringify(state));
        }

        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const container = document.querySelector('.container-comentarios-dinamico');
        if (container) {
            container.setAttribute('data-colecao', this.dataset.section);
        }

        const url = new URL(window.location);
        url.searchParams.delete('id');
        window.history.pushState({}, '', url);

        carregarSecao(this.dataset.section);
    });
});

/**
 * Inicialização principal ao carregar o DOM
 */
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        verificarLinkCompartilhado();
    } else {
        const savedStateStr = localStorage.getItem('anigeek_persistence_v2');
        let secaoParaCarregar = 'anime_i_geek';

        if (savedStateStr) {
            const state = JSON.parse(savedStateStr);
            secaoParaCarregar = state.activeTabId || 'anime_i_geek';
            
            document.querySelectorAll('.filter-tag').forEach(t => {
                if(t.dataset.section === secaoParaCarregar) t.classList.add('active');
                else t.classList.remove('active');
            });
        }

        carregarSecao(secaoParaCarregar);
    }
});

/**
 * Gerencia a troca de CSS por seção
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
