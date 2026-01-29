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
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML =
        '<div style="text-align:center;padding:120px;color:var(--text-muted);opacity:.5">SINCRONIZANDO...</div>';

    try {
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Arquivo não encontrado.");

        const html = await response.text();
        displayPrincipal.innerHTML = html;

        // Reexecuta scripts da seção
        const scripts = displayPrincipal.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(reiniciarModuloComentarios, 800);

    } catch (err) {
        console.error(err);
        displayPrincipal.innerHTML =
            `<div style="text-align:center;padding:100px">Erro: ${nome} não carregado.</div>`;
    }
}

/**
 * Resolve links do tipo:
 * index.html?id=saihate-no-paladin
 */
function verificarLinkCompartilhado() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    // ⚠️ precisa existir globalmente
    const item = window.noticias?.find(n => n.id === id);

    const secao = item?.origem || 'manchetes';

    carregarSecao(secao);

    // Aguarda renderização e rola até a notícia
    setTimeout(() => {
        rolarParaNoticiaPorId(id);
    }, 700);
}

/**
 * Eventos de clique nas categorias
 */
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag')
            .forEach(t => t.classList.remove('active'));

        tag.classList.add('active');

        const container = document.querySelector('.container-comentarios-dinamico');
        if (container) {
            container.setAttribute('data-colecao', tag.dataset.section);
        }

        const url = new URL(window.location);
        url.searchParams.delete('id');
        window.history.pushState({}, '', url);

        carregarSecao(tag.dataset.section);
        setTimeout(reiniciarModuloComentarios, 500);
    });
});

/**
 * Inicialização principal
 */
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        verificarLinkCompartilhado();
    } else {
        const primeiraAba = document.querySelector('.filter-tag');
        if (primeiraAba) primeiraAba.click();
        else carregarSecao('manchetes');
    }
});

/**
 * CSS dinâmico por seção
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

// Exposição global mínima
window.carregarSecao = carregarSecao;
