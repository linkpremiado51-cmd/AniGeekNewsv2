/* ======================================================
   AniGeekNews – Gerenciador de Abas Enterprise v7
   Caminho: modulos_secoes/modulos_analises/sub_modulos_analises/gerenciador_de_abas/gerenciador-abas.js
   LOGS: Monitoramento total de injeção, persistência e carregamento inicial.
====================================================== */

export function inicializarSistemaAbas() {
    console.log("🛠️ [ABAS-GEEK] Iniciando construtor do sistema de abas...");

    const CONFIG = {
        MAX_TABS: 12,
        KEYS: { ORDER: 'ag_v7_order' },
        // Caminho relativo para encontrar os arquivos .html das categorias
        PATH_CATEGORIAS: './sub_modulos_analises/categoria_analises/' 
    };

    console.log(`📍 [ABAS-GEEK] Configurado caminho de busca: ${CONFIG.PATH_CATEGORIAS}`);

    const CATALOGO = [
        { sessao: "MANCHETES", id: 'sessao_manchetes', itens: [
            { id: 'manchetes', label: 'Manchetes' }, 
            { id: 'destaques', label: 'Destaques' }, 
            { id: 'ultimas', label: 'Últimas' }, 
            { id: 'trending', label: 'Trending' }
        ]},
        { sessao: "ANIGEEKNEWS", id: 'sessao_analises', itens: [
            { id: 'opiniao', label: 'Opinião' }, 
            { id: 'critica', label: 'Crítica Técnica' }, 
            { id: 'teorias', label: 'Teorias' }
        ]},
        { sessao: "LANÇAMENTOS", id: 'sessao_lancamentos', itens: [
            { id: 'lanc_jogos', label: 'Jogos' }, 
            { id: 'lanc_animes', label: 'Animes' }, 
            { id: 'lanc_mangas', label: 'Mangás' }
        ]}
    ];

    /**
     * MOTOR DE CARREGAMENTO DINÂMICO
     */
    window.carregarSecao = async (id) => {
        console.log(`🌀 [MOTOR-ABAS] Solicitando carga da seção: [${id}]`);
        const container = document.getElementById('container-principal');
        
        if (!container) {
            console.error("❌ [MOTOR-ABAS] Abortado: O elemento '#container-principal' não foi encontrado no HTML!");
            return;
        }

        console.log(`⏳ [MOTOR-ABAS] Limpando container e exibindo spinner...`);
        container.innerHTML = `
            <div style="text-align: center; padding: 100px; opacity: 0.5; color: var(--text-main);">
                <i class="fa-solid fa-gear fa-spin"></i><br>
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 10px; display: block;">Sincronizando ${id}...</span>
            </div>`;

        try {
            const endpoint = `${CONFIG.PATH_CATEGORIAS}${id}.html`;
            console.log(`🌐 [MOTOR-ABAS] Tentando conexão com: ${endpoint}`);
            
            const response = await fetch(endpoint);
            console.log(`📡 [MOTOR-ABAS] Status da requisição: ${response.status}`);

            if (!response.ok) {
                console.error(`❌ [MOTOR-ABAS] Erro HTTP: ${response.status}. Verifique se o arquivo existe em: ${endpoint}`);
                throw new Error(`Arquivo ${id}.html não encontrado no servidor.`);
            }
            
            const html = await response.text();
            console.log(`📄 [MOTOR-ABAS] Sucesso! HTML recebido (${html.length} bytes).`);
            
            container.innerHTML = html;

            // REATIVADOR DE SCRIPTS (Essencial para o Firebase funcionar dentro da aba)
            const scripts = container.querySelectorAll("script");
            if (scripts.length > 0) {
                console.log(`⚡ [MOTOR-ABAS] Reativando ${scripts.length} scripts da aba...`);
                scripts.forEach((oldScript, idx) => {
                    const newScript = document.createElement("script");
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }

            console.log(`🎉 [MOTOR-ABAS] Aba [${id}] carregada e scripts executados.`);
        } catch (error) {
            console.error("❌ [MOTOR-ABAS] Falha crítica:", error.message);
            container.innerHTML = `
                <div style="text-align: center; padding: 100px; color: var(--primary);">
                    <i class="fa-solid fa-triangle-exclamation"></i><br>
                    <span style="font-size: 11px; font-weight: 800;">ERRO AO CARREGAR: ${id.toUpperCase()}</span>
                    <p style="font-size: 10px; opacity: 0.6; margin-top: 5px;">Caminho tentado: ${CONFIG.PATH_CATEGORIAS}${id}.html</p>
                </div>`;
        }
    };

    // --- SISTEMA DE ESTILOS ---
    const styles = `
        #ag-drawer { background: var(--card-bg); border-bottom: 1px solid var(--border); overflow: hidden; max-height: 0; transition: all 0.5s ease; opacity: 0; width: 100%; position: absolute; left: 0; z-index: 1000; }
        #ag-drawer.open { max-height: 85vh; opacity: 1; padding-bottom: 20px; border-bottom: 2px solid var(--primary); }
        .ag-drawer-scroll { max-height: 80vh; overflow-y: auto; padding: 15px; }
        .ag-search-tabs { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text-main); font-size: 12px; margin-bottom: 15px; outline: none; }
        .ag-search-tabs:focus { border-color: var(--primary); }
        .ag-section-block { margin-bottom: 20px; }
        .ag-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-top: 10px; }
        .ag-card { background: var(--bg); border: 1px solid var(--border); border-radius: 5px; padding: 10px; font-size: 10px; text-align: center; cursor: pointer; color: var(--text-main); font-weight: 700; text-transform: uppercase; transition: 0.2s; }
        .ag-card:hover { border-color: var(--text-muted); }
        .ag-card.is-selected { border-color: var(--primary); color: var(--primary); background: rgba(229, 9, 20, 0.05); }
        .filter-tag.active { border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 900; }
        .cfg-btn { display: flex; align-items: center; justify-content: center; min-width: 40px; }
    `;
    
    if (!document.getElementById('ag-v7-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ag-v7-styles';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // --- PERSISTÊNCIA ---
    const load = (k, d) => {
        const data = localStorage.getItem(k);
        return data ? JSON.parse(data) : d;
    };
    const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    
    // Ordem inicial padrão (Garante que Manchetes seja o primeiro se o storage estiver vazio)
    const getOrder = () => load(CONFIG.KEYS.ORDER, ['manchetes', 'opiniao', 'critica']);

    function findItem(id) {
        for (let sec of CATALOGO) {
            const item = sec.itens.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    }

    /**
     * RENDERIZADOR DA BARRA DE FILTROS
     */
    window.renderBar = () => {
        console.log("📊 [ABAS-GEEK] Renderizando barra de filtros...");
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
            
            // CARREGAMENTO AUTOMÁTICO DA PRIMEIRA ABA DA LISTA
            if (index === 0) {
                btn.classList.add('active');
                // Chamamos apenas se o container estiver vazio ou em inicialização
                const principal = document.getElementById('container-principal');
                if (principal && principal.innerText.includes("Iniciando motor")) {
                    window.carregarSecao(id);
                }
            }

            btn.onclick = () => {
                console.log(`🖱️ [CLIQUE] Ativando aba: ${item.label}`);
                document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.carregarSecao(id);
            };
            bar.appendChild(btn);
        });

        // Botão de Configuração (+)
        const cfg = document.createElement('button');
        cfg.className = 'filter-tag cfg-btn';
        cfg.innerHTML = '<i class="fa-solid fa-plus"></i>';
        cfg.onclick = () => {
            drawer.classList.toggle('open');
            if (drawer.classList.contains('open')) renderDrawer();
        };
        bar.appendChild(cfg);
    };

    /**
     * RENDERIZADOR DO MENU DE SELEÇÃO (DRAWER)
     */
    function renderDrawer(filterText = "") {
        const drawer = document.getElementById('ag-drawer');
        const order = getOrder();
        const term = filterText.toLowerCase();

        drawer.innerHTML = `
            <div class="ag-drawer-scroll">
                <input type="text" class="ag-search-tabs" id="ag-search-tabs" placeholder="Filtrar categorias..." value="${filterText}">
                <div id="ag-catalog-content"></div>
            </div>`;

        const content = document.getElementById('ag-catalog-content');
        
        CATALOGO.forEach(sec => {
            const block = document.createElement('div');
            block.className = 'ag-section-block';
            block.innerHTML = `
                <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">${sec.sessao}</div>
                <div class="ag-grid-container"></div>`;
            
            const grid = block.querySelector('.ag-grid-container');
            
            sec.itens.forEach(item => {
                if (term && !item.label.toLowerCase().includes(term)) return;
                
                const card = document.createElement('div');
                const isSelected = order.includes(item.id);
                card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
                card.textContent = item.label;
                
                card.onclick = () => {
                    let currentOrder = getOrder();
                    if (isSelected) {
                        console.log(`➖ [CONFIG] Removendo: ${item.label}`);
                        currentOrder = currentOrder.filter(x => x !== item.id);
                    } else if (currentOrder.length < CONFIG.MAX_TABS) {
                        console.log(`➕ [CONFIG] Adicionando: ${item.label}`);
                        currentOrder.push(item.id);
                    } else {
                        alert("Limite de 12 abas atingido!");
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
        input.oninput = (e) => renderDrawer(e.target.value);
        input.focus();
    }

    // Inicialização da barra
    window.renderBar();
    console.log("✅ [ABAS-GEEK] Sistema de abas v7 totalmente operacional.");
}
