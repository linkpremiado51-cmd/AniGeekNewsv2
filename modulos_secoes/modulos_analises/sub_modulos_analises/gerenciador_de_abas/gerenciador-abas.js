/* ======================================================
   AniGeekNews – Gerenciador de Abas Enterprise v7 (Visual Pro)
   Caminho: modulos_secoes/modulos_analises/sub_modulos_analises/gerenciador_de_abas/gerenciador-abas.js
====================================================== */

export function inicializarSistemaAbas() {
    console.log("🛠️ [ABAS-GEEK] Iniciando construtor visual pro...");

    const CONFIG = {
        MAX_TABS: 12,
        KEYS: { 
            ORDER: 'ag_v7_order',
            MODE: 'ag_v7_mode' 
        },
        PATH_CATEGORIAS: './sub_modulos_analises/categoria_analises/' 
    };

    // Seu catálogo original com cores adicionadas para o novo visual
    const CATALOGO = [
        { sessao: "MANCHETES", id: 'manchetes', cor: "#FF4500", itens: [
            { id: 'manchetes', label: 'Manchetes' }, 
            { id: 'destaques', label: 'Destaques' }, 
            { id: 'ultimas', label: 'Últimas' }, 
            { id: 'trending', label: 'Trending' }
        ]},
        { sessao: "ANIGEEKNEWS", id: 'anigeeknews', cor: "#8A2BE2", itens: [
            { id: 'opiniao', label: 'Opinião' }, 
            { id: 'critica', label: 'Crítica Técnica' }, 
            { id: 'teorias', label: 'Teorias' }
        ]},
        { sessao: "LANÇAMENTOS", id: 'lancamentos', cor: "#32CD32", itens: [
            { id: 'lanc_jogos', label: 'Jogos' }, 
            { id: 'lanc_animes', label: 'Animes' }, 
            { id: 'lanc_mangas', label: 'Mangás' }
        ]}
    ];

    /* ===========================
       ESTILOS PREMIUM (GLASSMORPHISM)
    =========================== */
    const styles = `
        #ag-drawer { background: #ffffff; border-bottom: 1px solid #e0e0e0; overflow: hidden; max-height: 0; transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1); opacity: 0; width: 100%; position: absolute; left: 0; z-index: 1000; box-shadow: 0 10.5px 21px rgba(0,0,0,0.08); }
        body.dark-mode #ag-drawer { background: #141414; border-color: #333; box-shadow: 0 10.5px 21px rgba(0,0,0,0.5); }
        #ag-drawer.open { max-height: 85vh; opacity: 1; }
        .ag-drawer-scroll { max-height: 85vh; overflow-y: auto; padding: 21px 14px; scrollbar-width: thin; }

        /* Header Sticky com Efeito Vidro */
        .ag-drawer-header { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; position: sticky; top: -21px; z-index: 100; margin: -21px auto 21px auto; padding: 17.5px 0; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8.4px); -webkit-backdrop-filter: blur(8.4px); border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
        body.dark-mode .ag-drawer-header { background: rgba(20, 20, 20, 0.85); border-color: rgba(255, 255, 255, 0.08); }

        .ag-search-wrapper { position: relative; flex: 1; min-width: 196px; }
        .ag-search-input { width: 100%; padding: 7.7px 10.5px 7.7px 31.5px; border-radius: 7px; border: 1px solid rgba(0,0,0,0.1); background: rgba(0,0,0,0.04); font-size: 9.8px; font-weight: 500; outline: none; transition: all 0.3s ease; }
        body.dark-mode .ag-search-input { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
        .ag-search-icon-svg { position: absolute; left: 9.8px; top: 50%; transform: translateY(-50%); width: 12.6px; height: 12.6px; fill: #999; }

        /* Sessões e Cards */
        .ag-section-block { margin-bottom: 24.5px; max-width: 840px; margin-left: auto; margin-right: auto; }
        .ag-section-header-btn { display: flex; align-items: center; gap: 7px; margin-bottom: 8.4px; background: transparent; border: none; cursor: pointer; }
        .ag-section-text { font-size: 9.8px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.7px; color: #333; }
        body.dark-mode .ag-section-text { color: #fff; }
        .ag-section-marker { width: 7px; height: 7px; border-radius: 2.1px; }

        .ag-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); gap: 7px; }
        .ag-card { background: #f9f9f9; border: 1px solid transparent; border-radius: 4.2px; padding: 8.4px 7px; font-size: 9.1px; font-weight: 500; color: #444; text-align: center; cursor: pointer; transition: all 0.2s ease; }
        body.dark-mode .ag-card { background: #1e1e1e; color: #ccc; }
        .ag-card.is-selected { background: #fff; border-color: var(--primary-color, #e50914); color: var(--primary-color, #e50914); font-weight: 700; box-shadow: inset 0 0 0 0.7px var(--primary-color, #e50914); }
        
        /* Toasts */
        #ag-toast-container { position: fixed; bottom: 21px; left: 50%; transform: translateX(-50%); z-index: 9999; pointer-events: none; display: flex; flex-direction: column; gap: 7px; }
        .ag-toast { background: rgba(30, 30, 30, 0.95); color: #fff; padding: 8.4px 16.8px; border-radius: 35px; font-size: 9.1px; font-weight: 600; box-shadow: 0 3.5px 10.5px rgba(0,0,0,0.3); opacity: 0; transform: translateY(14px); animation: agSlideUp 0.3s forwards; }
        @keyframes agSlideUp { to { opacity: 1; transform: translateY(0); } }

        /* Botão Config Scroller */
        .filter-tag.cfg-btn { position: sticky; right: 0; z-index: 99; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(5.6px); min-width: 33.6px; height: 23.8px; border: none; border-left: 1px solid rgba(0, 0, 0, 0.05); cursor: pointer; }
        body.dark-mode .filter-tag.cfg-btn { background: rgba(20, 20, 20, 0.9); border-left: 1px solid rgba(255, 255, 255, 0.1); }
    `;

    if (!document.getElementById('ag-v7-styles-pro')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ag-v7-styles-pro';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    /* ===========================
       MOTOR DE CARREGAMENTO (MANTIDO)
    =========================== */
    window.carregarSecao = async (id) => {
        console.log(`🌀 [MOTOR] Carregando: ${id}`);
        const container = document.getElementById('container-principal');
        if (!container) return;

        container.innerHTML = `<div style="text-align:center; padding:100px; opacity:0.5;"><i class="fa-solid fa-gear fa-spin"></i></div>`;

        try {
            const response = await fetch(`${CONFIG.PATH_CATEGORIAS}${id}.html`);
            if (!response.ok) throw new Error("Arquivo não encontrado");
            const html = await response.text();
            container.innerHTML = html;

            const scripts = container.querySelectorAll("script");
            scripts.forEach((oldScript) => {
                const newScript = document.createElement("script");
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        } catch (error) {
            container.innerHTML = `<div style="text-align:center; padding:100px; color:red;">Erro ao carregar aba.</div>`;
        }
    };

    /* ===========================
       SISTEMA DE TOAST
    =========================== */
    function showToast(message) {
        let container = document.getElementById('ag-toast-container') || Object.assign(document.createElement('div'), { id: 'ag-toast-container' });
        if (!container.parentNode) document.body.appendChild(container);
        const toast = document.createElement('div');
        toast.className = 'ag-toast';
        toast.innerHTML = message;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    /* ===========================
       LÓGICA DE PERSISTÊNCIA
    =========================== */
    const load = (k, d) => { const data = localStorage.getItem(k); return data ? JSON.parse(data) : d; };
    const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const getOrder = () => load(CONFIG.KEYS.ORDER, ['manchetes', 'opiniao', 'critica']);

    function findItem(id) {
        for (let sec of CATALOGO) {
            if (sec.id === id) return { id: sec.id, label: sec.sessao };
            const item = sec.itens.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    }

    /* ===========================
       RENDERIZADORES (VISUAL NOVO)
    =========================== */
    window.renderBar = () => {
        const bar = document.getElementById('filterScroller');
        if (!bar) return;
        
        let drawer = document.getElementById('ag-drawer') || Object.assign(document.createElement('div'), { id: 'ag-drawer' });
        if (!drawer.parentNode) bar.parentNode.insertBefore(drawer, bar.nextSibling);

        const order = getOrder();
        bar.innerHTML = '';

        order.forEach((id, index) => {
            const item = findItem(id);
            if (!item) return;

            const btn = document.createElement('button');
            btn.className = 'filter-tag';
            btn.textContent = item.label;
            
            if (index === 0) {
                btn.classList.add('active');
                const principal = document.getElementById('container-principal');
                if (principal && (principal.innerText.includes("Iniciando") || principal.innerHTML === "")) {
                    window.carregarSecao(id);
                }
            }

            btn.onclick = () => {
                document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                drawer.classList.remove('open');
                window.carregarSecao(id);
            };
            bar.appendChild(btn);
        });

        const cfg = document.createElement('button');
        cfg.className = 'filter-tag cfg-btn';
        cfg.innerHTML = '<i class="fa-solid fa-plus"></i>';
        cfg.onclick = () => {
            if (drawer.classList.contains('open')) {
                drawer.classList.remove('open');
            } else {
                renderDrawer();
                drawer.classList.add('open');
            }
        };
        bar.appendChild(cfg);
    };

    function renderDrawer(filterText = "") {
        const drawer = document.getElementById('ag-drawer');
        const order = getOrder();
        const term = filterText.toLowerCase();

        drawer.innerHTML = `
            <div class="ag-drawer-scroll">
                <div class="ag-drawer-header">
                    <div class="ag-search-wrapper">
                        <svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>
                        <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar categorias..." value="${filterText}">
                    </div>
                </div>
                <div id="ag-catalog-content"></div>
            </div>`;

        const content = document.getElementById('ag-catalog-content');
        
        CATALOGO.forEach(sec => {
            const itensFiltrados = sec.itens.filter(i => i.label.toLowerCase().includes(term));
            if (term && !sec.sessao.toLowerCase().includes(term) && itensFiltrados.length === 0) return;

            const block = document.createElement('div');
            block.className = 'ag-section-block';
            
            const isParentSelected = order.includes(sec.id);
            block.innerHTML = `
                <button class="ag-section-header-btn ${isParentSelected ? 'is-active' : ''}">
                    <div class="ag-section-marker" style="background:${sec.cor}"></div>
                    <span class="ag-section-text">${sec.sessao}</span>
                </button>
                <div class="ag-grid-container"></div>`;
            
            block.querySelector('.ag-section-header-btn').onclick = () => toggleTab(sec.id, sec.sessao);

            const grid = block.querySelector('.ag-grid-container');
            sec.itens.forEach(item => {
                if (term && !item.label.toLowerCase().includes(term)) return;
                
                const card = document.createElement('div');
                const isSelected = order.includes(item.id);
                card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
                card.textContent = item.label;
                card.onclick = () => toggleTab(item.id, item.label);
                grid.appendChild(card);
            });
            content.appendChild(block);
        });

        const input = document.getElementById('ag-search-input');
        input.oninput = (e) => renderDrawer(e.target.value);
        input.focus();
    }

    function toggleTab(id, label) {
        let currentOrder = getOrder();
        if (currentOrder.includes(id)) {
            currentOrder = currentOrder.filter(x => x !== id);
            showToast(`Removido: ${label}`);
        } else if (currentOrder.length < CONFIG.MAX_TABS) {
            currentOrder.push(id);
            showToast(`Adicionado: ${label}`);
        } else {
            showToast(`Limite de ${CONFIG.MAX_TABS} abas atingido!`);
        }
        save(CONFIG.KEYS.ORDER, currentOrder);
        window.renderBar();
        renderDrawer(document.getElementById('ag-search-input').value);
    }

    window.renderBar();
    console.log("✅ [ABAS-GEEK] Sistema V7 Pro inicializado.");
}
