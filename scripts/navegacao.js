/**
 * scripts/navegacao.js
 * Maestro da navegação - Versão Modular Corrigida
 */

// Importamos o inicializador diretamente para garantir que os caminhos sejam resolvidos pela index.html
import { inicializarApp } from "../modulos_secoes/modulos_analises/inicializador-do-site.js";

const displayPrincipal = document.getElementById('conteudo_de_destaque');

function reiniciarModuloComentarios() {
    if (typeof window.inicializarComentarios === 'function') {
        window.inicializarComentarios();
    }
}

async function abrirNoticiaUnica(item) {
    if (!displayPrincipal) return;

    try {
        gerenciarCSSDaSecao(item.origem || 'manchetes');

        displayPrincipal.innerHTML = `
            <div class="foco-noticia-wrapper" style="animation: fadeIn 0.4s ease; max-width: var(--container-w); margin: 0 auto; padding: 20px;">
                <div class="barra-ferramentas-foco" style="display: flex; justify-content: flex-start; padding-bottom: 20px; border-bottom: 1px dashed var(--border); margin-bottom: 30px;">
                    <button onclick="window.voltarParaLista()" class="btn-voltar-estilizado" style="background: none; border: 1px solid var(--text-main); color: var(--text-main); padding: 8px 18px; font-size: 10px; font-weight: 800; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.3s; text-transform: uppercase;">
                        <i class="fa-solid fa-chevron-left" style="font-size: 14px;"></i> 
                        <span>Voltar para ${item.origem ? item.origem.toUpperCase() : 'Início'}</span>
                    </button>
                </div>
                <div id="container-principal">
                    <p style="text-align:center; padding:50px; color:var(--text-muted);">Carregando conteúdo...</p>
                </div>
            </div>
        `;

        // Se for a seção modular, garantimos que o motor está pronto
        if (item.origem === 'analises') {
            inicializarApp();
            
            let tentativas = 0;
            const tentarRenderizarModular = () => {
                if (typeof window.renderizarNoticias === 'function') {
                    window.renderizarNoticias([item]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(reiniciarModuloComentarios, 500); 
                } else if (tentativas < 20) {
                    tentativas++;
                    setTimeout(tentarRenderizarModular, 150);
                }
            };
            tentarRenderizarModular();
            return; // Encerra aqui para seções modulares
        }

        // Lógica antiga para outras seções não refatoradas
        const response = await fetch(`./secoes/${item.origem || 'manchetes'}.html`);
        const htmlBase = await response.text();
        const parser = new DOMParser();
        const docSeçao = parser.parseFromString(htmlBase, 'text/html');
        docSeçao.querySelectorAll("script").forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.textContent = oldScript.textContent;
            document.head.appendChild(newScript);
        });

    } catch (err) {
        console.error("Erro na ponte de navegação:", err);
        displayPrincipal.innerHTML = `<div style="padding:100px; text-align:center;">Erro ao carregar conteúdo.</div>`;
    }
}

async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML = '<div style="text-align: center; padding: 120px; color: var(--text-muted); opacity: 0.5;">SINCRONIZANDO...</div>';
    
    try {
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Arquivo não encontrado.");
        
        const html = await response.text();
        displayPrincipal.innerHTML = html;

        // Se for a seção de análises, dispara o módulo manualmente
        if (nome === 'analises') {
            console.log("Iniciando motor modular para Análises...");
            inicializarApp();
        } else {
            // Processamento de scripts para seções antigas
            const scripts = displayPrincipal.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                oldScript.remove(); 
                document.body.appendChild(newScript);
            });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(reiniciarModuloComentarios, 800);

    } catch (err) {
        console.error("Erro ao carregar seção:", err);
        displayPrincipal.innerHTML = `<div style="text-align:center; padding:100px;">Erro: ${nome} não carregado.</div>`;
    }
}

// Eventos de clique nas categorias
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        carregarSecao(tag.dataset.section);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
        // Lógica para link compartilhado aqui
    } else {
        const primeiraAba = document.querySelector('.filter-tag');
        if (primeiraAba) primeiraAba.click();
        else carregarSecao('manchetes');
    }
});

function gerenciarCSSDaSecao(nome) {
    const linkAntigo = document.getElementById('css-secao-dinamica');
    if (linkAntigo) linkAntigo.remove();
    const novoLink = document.createElement('link');
    novoLink.id = 'css-secao-dinamica'; novoLink.rel = 'stylesheet';
    novoLink.href = `./estilos/secoes/${nome}.css`;
    document.head.appendChild(novoLink);
}

window.voltarParaLista = function() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
    const tagAtiva = document.querySelector('.filter-tag.active');
    carregarSecao(tagAtiva ? tagAtiva.dataset.section : 'manchetes');
};

window.carregarSecao = carregarSecao;
window.abrirNoticiaUnica = abrirNoticiaUnica;
