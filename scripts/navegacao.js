/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/* =========================================================
   UTILITÁRIOS GLOBAIS
========================================================= */

function reiniciarModuloComentarios() {
    if (typeof window.inicializarComentarios === 'function') {
        window.inicializarComentarios();
    }
}

function ativarEventosDasAbas() {
    const abas = document.querySelectorAll('.filter-tag');
    if (!abas.length) return;

    abas.forEach(tag => {
        tag.onclick = () => {
            abas.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const container = document.querySelector('.container-comentarios-dinamico');
            if (container) {
                container.setAttribute('data-colecao', tag.dataset.section);
            }

            carregarSecao(tag.dataset.section);
            setTimeout(reiniciarModuloComentarios, 500);
        };
    });
}

/* =========================================================
   NOTÍCIA ÚNICA
========================================================= */

async function abrirNoticiaUnica(item) {
    if (!displayPrincipal) return;

    try {
        gerenciarCSSDaSecao(item.origem || 'manchetes');

        displayPrincipal.innerHTML = `
            <div class="foco-noticia-wrapper" style="animation: fadeIn 0.4s ease; max-width: var(--container-w); margin: 0 auto; padding: 20px;">
                <div class="barra-ferramentas-foco" style="display:flex; padding-bottom:20px; border-bottom:1px dashed var(--border); margin-bottom:30px;">
                    <button onclick="window.voltarParaLista()" class="btn-voltar-estilizado">
                        <i class="fa-solid fa-chevron-left"></i>
                        <span>Voltar</span>
                    </button>
                </div>
                <div id="container-principal">
                    <p style="text-align:center; padding:50px;">Carregando conteúdo...</p>
                </div>
            </div>
        `;

        const response = await fetch(`./secoes/${item.origem || 'manchetes'}.html`);
        if (!response.ok) throw new Error("Falha ao carregar seção.");

        const htmlBase = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlBase, 'text/html');

        doc.querySelectorAll("script").forEach(oldScript => {
            const script = document.createElement("script");

            if (!oldScript.src) {
                let code = oldScript.textContent;
                if (code.includes('function renderizarNoticias')) {
                    code += '\nwindow.renderizarNoticias = renderizarNoticias;';
                }
                script.textContent = code;
                script.type = 'module';
            } else {
                script.src = oldScript.src;
            }

            document.head.appendChild(script);
        });

        let tentativas = 0;
        const aguardarRender = () => {
            if (typeof window.renderizarNoticias === 'function') {
                document.getElementById('container-principal').innerHTML = '';
                window.renderizarNoticias([item]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(reiniciarModuloComentarios, 500);
            } else if (tentativas++ < 20) {
                setTimeout(aguardarRender, 150);
            }
        };
        aguardarRender();

    } catch (err) {
        console.error(err);
        displayPrincipal.innerHTML = `<div style="padding:100px;text-align:center;">Erro ao abrir notícia.</div>`;
    }
}

/* =========================================================
   CARREGAMENTO DE SEÇÕES
========================================================= */

async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML = `<div style="text-align:center;padding:120px;">SINCRONIZANDO...</div>`;

    try {
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Seção não encontrada.");

        displayPrincipal.innerHTML = await response.text();

        displayPrincipal.querySelectorAll("script").forEach(oldScript => {
            const script = document.createElement("script");
            script.type = oldScript.type || "text/javascript";
            if (oldScript.src) script.src = oldScript.src;
            else script.textContent = oldScript.textContent;
            document.body.appendChild(script);
        });

        ativarEventosDasAbas();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(reiniciarModuloComentarios, 800);

    } catch {
        displayPrincipal.innerHTML = `<div style="padding:100px;text-align:center;">Erro ao carregar seção.</div>`;
    }
}

/* =========================================================
   INICIALIZAÇÃO GLOBAL
========================================================= */

window.addEventListener('DOMContentLoaded', () => {
    ativarEventosDasAbas();

    const params = new URLSearchParams(window.location.search);
    if (params.has('id') && typeof verificarLinkCompartilhado === 'function') {
        verificarLinkCompartilhado();
    } else {
        const primeiraAba = document.querySelector('.filter-tag');
        if (primeiraAba) primeiraAba.click();
        else carregarSecao('manchetes');
    }
});

/* =========================================================
   SUPORTE
========================================================= */

function gerenciarCSSDaSecao(nome) {
    const antigo = document.getElementById('css-secao-dinamica');
    if (antigo) antigo.remove();

    const link = document.createElement('link');
    link.id = 'css-secao-dinamica';
    link.rel = 'stylesheet';
    link.href = `./estilos/secoes/${nome}.css`;
    document.head.appendChild(link);
}

window.voltarParaLista = () => {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);

    const ativa = document.querySelector('.filter-tag.active');
    carregarSecao(ativa ? ativa.dataset.section : 'manchetes');
};

window.carregarSecao = carregarSecao;
window.abrirNoticiaUnica = abrirNoticiaUnica;
