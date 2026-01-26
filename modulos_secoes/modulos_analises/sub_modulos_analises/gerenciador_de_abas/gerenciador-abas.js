/* ======================================================
   AniGeekNews – Gerenciador de Abas Enterprise v7
   Caminho: modulos_secoes/modulos_analises/sub_modulos_analises/gerenciador_de_abas/gerenciador-abas.js
====================================================== */

export function inicializarSistemaAbas() {
    const CONFIG = {
        MAX_TABS: 12,
        KEYS: { ORDER: 'ag_v7_order' },
        PATH_CATEGORIAS: './categoria_analises/' 
    };

    const CATALOGO = [
        { sessao: "MANCHETES", id: 'manchetes', itens: [
            { id: 'destaques', label: 'Destaques' }, { id: 'ultimas', label: 'Últimas' }, { id: 'trending', label: 'Trending' }
        ]},
        { sessao: "ANIGEEKNEWS", id: 'analises', itens: [
            { id: 'opiniao', label: 'Opinião' }, { id: 'critica', label: 'Crítica Técnica' }, { id: 'teorias', label: 'Teorias' }
        ]},
        { sessao: "LANÇAMENTOS", id: 'lancamentos', itens: [
            { id: 'lanc_jogos', label: 'Jogos' }, { id: 'lanc_animes', label: 'Animes' }, { id: 'lanc_mangas', label: 'Mangás' }
        ]}
    ];

    /**
     * MOTOR DE CARREGAMENTO DINÂMICO (CORRIGIDO)
     */
    window.carregarSecao = async (id) => {
        const container = document.getElementById('container-principal');
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: 100px; opacity: 0.5; color: var(--text-main);">
                <i class="fa-solid fa-gear fa-spin"></i><br>
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 10px; display: block;">Sincronizando ${id}...</span>
            </div>`;

        try {
            const response = await fetch(`${CONFIG.PATH_CATEGORIAS}${id}.html`);
            if (!response.ok) throw new Error(`Arquivo ${id}.html não encontrado.`);
            
            // CORREÇÃO: Removido o erro "Neve"
            const html = await response.text();
            
            // Injeção do conteúdo
            container.innerHTML = html;

            // REATIVADOR DE SCRIPTS (Essencial para o Firebase funcionar)
            const scripts = container.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

            console.log(`✅ Aba [${id}] ativada com sucesso.`);
        } catch (error) {
            console.error("❌ Falha no motor de abas:", error);
            container.innerHTML = `
                <div style="text-align: center; padding: 100px; color: var(--primary);">
                    <i class="fa-solid fa-triangle-exclamation"></i><br>
                    <span style="font-size: 11px; font-weight: 800;">ERRO AO CARREGAR: ${id.toUpperCase()}</span>
                </div>`;
        }
    };

    // Injeção de CSS (Mantido conforme original)
    const styles = `
        #ag-drawer { background: var(--card-bg); border-bottom: 1px solid var(--border); overflow: hidden; max-height: 0; transition: all 0.5s ease; opacity: 0; width: 100%; position: absolute; left: 0; z-index: 1000; }
        #ag-drawer.open { max-height: 85vh; opacity: 1; padding-bottom: 20px; }
        .ag-drawer-scroll { max-height: 80vh; overflow-y: auto; padding: 15px; }
        .ag-search-tabs { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text-main); font-size: 12px; margin-bottom: 15px; }
        .ag-section-block { margin-bottom: 20px; }
        .ag-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 10px; }
        .ag-card { background: var(--bg); border: 1px solid var(--border); border-radius: 5px; padding: 8px; font-size: 10px; text-align: center; cursor: pointer; color: var(--text-main); }
        .ag-card.is-selected { border-color: var(--primary); color: var(--primary); background: rgba(229, 9, 20, 0.1); }
        .filter-tag.active { border-bottom: 2px solid var(--primary); color: var(--primary); }
    `;
    
    if (!document.getElementById('ag-v7-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ag-v7-styles';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    const load = (k, d) => JSON.parse(localStorage.getItem(k)) ?? d;
    const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const getOrder = () => load(CONFIG.KEYS.ORDER, ['destaques', 'ultimas', 'opiniao']);

    function findItem(id) {
        for (let sec of CATALOGO) {
            if (sec.id === id) return { id: sec.id, label: sec.sessao };
            const item = sec.itens.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    }

    window.renderBar = () => {
        const bar = document.getElementById('filterScroller');
        if (!bar) return;
        
        let drawer = document.getElementById('ag-drawer') || Object.assign(document.createElement('div'), { id: 'ag-drawer' });
        if (!drawer.parentNode) bar.parentNode.insertBefore(drawer, bar.nextSibling);

        const order = getOrder();
        bar.innerHTML = '';

        order.forEach(id => {
            const item = findItem(id);
            if (!item) return;
            const btn = document.createElement('button');
            btn.className = 'filter-tag';
            btn.textContent = item.label;
            btn.onclick = () => {
                document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.carregarSecao(id);
            };
            bar.appendChild(btn);
        });

        const cfg = document.createElement('button');
        cfg.className = 'filter-tag cfg-btn';
        cfg.innerHTML = '<i class="fa-solid fa-plus"></i>';
        cfg.onclick = () => {
            drawer.classList.toggle('open');
            if (drawer.classList.contains('open')) renderDrawer();
        };
        bar.appendChild(cfg);
    };

    function renderDrawer(filterText = "") {
        const drawer = document.getElementById('ag-drawer');
        const order = getOrder();
        const term = filterText.toLowerCase();

        drawer.innerHTML = `
            <div class="ag-drawer-scroll">
                <input type="text" class="ag-search-tabs" id="ag-search-tabs" placeholder="Buscar filtros..." value="${filterText}">
                <div id="ag-catalog-content"></div>
            </div>`;

        const content = document.getElementById('ag-catalog-content');
        CATALOGO.forEach(sec => {
            const block = document.createElement('div');
            block.className = 'ag-section-block';
            block.innerHTML = `
                <div style="font-size: 11px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px;">${sec.sessao}</div>
                <div class="ag-grid-container"></div>`;
            
            const grid = block.querySelector('.ag-grid-container');
            sec.itens.forEach(item => {
                if (term && !item.label.toLowerCase().includes(term)) return;
                const card = document.createElement('div');
                card.className = `ag-card ${order.includes(item.id) ? 'is-selected' : ''}`;
                card.textContent = item.label;
                card.onclick = () => {
                    let currentOrder = getOrder();
                    if (currentOrder.includes(item.id)) {
                        currentOrder = currentOrder.filter(x => x !== item.id);
                    } else if (currentOrder.length < CONFIG.MAX_TABS) {
                        currentOrder.push(item.id);
                    }
                    save(CONFIG.KEYS.ORDER, currentOrder);
                    window.renderBar();
                    renderDrawer(document.getElementById('ag-search-tabs').value);
                };
                grid.appendChild(card);
            });
            if (grid.children.length > 0) content.appendChild(block);
        });

        document.getElementById('ag-search-tabs').oninput = (e) => renderDrawer(e.target.value);
    }

    window.renderBar();
}
