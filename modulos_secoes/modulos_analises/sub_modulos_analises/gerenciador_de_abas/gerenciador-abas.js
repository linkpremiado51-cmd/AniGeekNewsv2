/* ======================================================
   AniGeekNews – Gerenciador de Abas Enterprise v7
   Caminho: modulos_secoes/modulos_analises/sub_modulos_analises/gerenciador_de_abas/gerenciador-abas.js
====================================================== */

export function inicializarSistemaAbas() {
    const CONFIG = {
        MAX_TABS: 12,
        KEYS: { ORDER: 'ag_v7_order' }
    };

    // Catálogo expandido conforme sua estrutura original do index
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

    // Injeção de CSS Dinâmico (Sincronizado com as variáveis do index.html)
    const styles = `
        #ag-drawer { 
            background: var(--card-bg); 
            border-bottom: 1px solid var(--border); 
            overflow: hidden; 
            max-height: 0; 
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1); 
            opacity: 0; 
            width: 100%; 
            position: absolute; 
            left: 0; 
            z-index: 1000; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        #ag-drawer.open { max-height: 85vh; opacity: 1; padding-bottom: 20px; }
        .ag-drawer-scroll { max-height: 80vh; overflow-y: auto; padding: 15px; }
        .ag-search-tabs { 
            width: 100%; 
            padding: 10px; 
            border-radius: 6px; 
            border: 1px solid var(--border); 
            background: var(--bg); 
            color: var(--text-main); 
            font-size: 11px; 
            margin-bottom: 15px; 
            outline: none;
        }
        .ag-section-block { margin-bottom: 20px; }
        .ag-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; margin-top: 10px; }
        .ag-card { 
            background: var(--bg); 
            border: 1px solid var(--border); 
            border-radius: 5px; 
            padding: 10px 5px; 
            font-size: 10px; 
            font-weight: 600;
            text-align: center; 
            cursor: pointer; 
            color: var(--text-main); 
            transition: 0.2s;
        }
        .ag-card.is-selected { 
            border-color: var(--primary); 
            color: var(--primary); 
            background: rgba(229, 9, 20, 0.05); 
        }
        .filter-tag.cfg-btn { margin-left: auto; }
    `;
    
    if (!document.getElementById('ag-v7-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ag-v7-styles';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    const load = (k, d) => {
        try { return JSON.parse(localStorage.getItem(k)) ?? d; } 
        catch { return d; }
    };
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
                if (window.carregarSecao) window.carregarSecao(id);
            };
            bar.appendChild(btn);
        });

        // Botão de Configuração (Engrenagem/Plus)
        const cfg = document.createElement('button');
        cfg.className = 'filter-tag cfg-btn';
        cfg.innerHTML = '<i class="fa-solid fa-gear"></i>'; 
        cfg.onclick = (e) => {
            e.stopPropagation();
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
                <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">${sec.sessao}</div>
                <div class="ag-grid-container"></div>`;
            
            const grid = block.querySelector('.ag-grid-container');
            
            // Verifica se a própria sessão ou itens combinam com a busca
            const matchSessao = sec.sessao.toLowerCase().includes(term);
            
            sec.itens.forEach(item => {
                if (term && !item.label.toLowerCase().includes(term) && !matchSessao) return;
                
                const card = document.createElement('div');
                card.className = `ag-card ${order.includes(item.id) ? 'is-selected' : ''}`;
                card.textContent = item.label;
                card.onclick = (e) => {
                    e.stopPropagation();
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

        const input = document.getElementById('ag-search-tabs');
        input.focus();
        input.oninput = (e) => renderDrawer(e.target.value);
    }

    // Inicialização
    window.renderBar();
}
