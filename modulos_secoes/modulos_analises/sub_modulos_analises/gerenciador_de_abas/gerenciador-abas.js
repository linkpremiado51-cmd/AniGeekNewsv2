/* ======================================================
   AniGeekNews – Gerenciador de Abas Enterprise v7
   Caminho: modulos_secoes/modulos_analises/sub_modulos_analises/gerenciador_de_abas/gerenciador-abas.js
   LOGS: Ativados para monitoramento de injeção e persistência.
====================================================== */

export function inicializarSistemaAbas() {
    console.log("🛠️ [ABAS-GEEK] Iniciando construtor do sistema de abas...");

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
     * MOTOR DE CARREGAMENTO DINÂMICO
     */
    window.carregarSecao = async (id) => {
        console.log(`🌀 [MOTOR-ABAS] Solicitando carga da seção: [${id}]`);
        const container = document.getElementById('container-principal');
        
        if (!container) {
            console.error("❌ [MOTOR-ABAS] Abortado: O elemento '#container-principal' não foi encontrado no HTML!");
            return;
        }

        console.log(`⏳ [MOTOR-ABAS] Limpando container e exibindo spinner de sincronização...`);
        container.innerHTML = `
            <div style="text-align: center; padding: 100px; opacity: 0.5; color: var(--text-main);">
                <i class="fa-solid fa-gear fa-spin"></i><br>
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 10px; display: block;">Sincronizando ${id}...</span>
            </div>`;

        try {
            const endpoint = `${CONFIG.PATH_CATEGORIAS}${id}.html`;
            console.log(`🌐 [MOTOR-ABAS] Fetching: ${endpoint}`);
            
            const response = await fetch(endpoint);
            console.log(`📡 [MOTOR-ABAS] Resposta do servidor: ${response.status} ${response.statusText}`);

            if (!response.ok) throw new Error(`Arquivo ${id}.html não encontrado no servidor.`);
            
            const html = await response.text();
            console.log(`📄 [MOTOR-ABAS] HTML recebido. Tamanho do pacote: ${html.length} caracteres.`);
            
            // Injeção do conteúdo
            container.innerHTML = html;
            console.log(`🏗️ [MOTOR-ABAS] Conteúdo injetado no DOM.`);

            // REATIVADOR DE SCRIPTS
            const scripts = container.querySelectorAll("script");
            if (scripts.length > 0) {
                console.log(`⚡ [MOTOR-ABAS] Detectados ${scripts.length} scripts na aba carregada. Reativando...`);
                scripts.forEach((oldScript, idx) => {
                    console.log(`   ∟ [SCRIPT] Reativando script #${idx + 1}...`);
                    const newScript = document.createElement("script");
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
                console.log(`✅ [MOTOR-ABAS] Todos os scripts foram reinjetados e executados.`);
            } else {
                console.warn(`⚠️ [MOTOR-ABAS] Nenhum script encontrado no arquivo ${id}.html.`);
            }

            console.log(`🎉 [MOTOR-ABAS] Sucesso: Aba [${id}] está ativa e operacional.`);
        } catch (error) {
            console.error("❌ [MOTOR-ABAS] Erro fatal no carregamento:", error.message);
            container.innerHTML = `
                <div style="text-align: center; padding: 100px; color: var(--primary);">
                    <i class="fa-solid fa-triangle-exclamation"></i><br>
                    <span style="font-size: 11px; font-weight: 800;">ERRO AO CARREGAR: ${id.toUpperCase()}</span>
                    <p style="font-size: 9px; opacity: 0.7; margin-top: 10px;">${error.message}</p>
                </div>`;
        }
    };

    // Injeção de CSS
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
        console.log("🎨 [ABAS-GEEK] Injetando estilos CSS dinâmicos no <head>...");
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ag-v7-styles';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    const load = (k, d) => {
        const val = localStorage.getItem(k);
        console.log(`💾 [STORAGE] Lendo chave [${k}]. Status: ${val ? 'Encontrado' : 'Vazio, usando padrão'}.`);
        return val ? JSON.parse(val) : d;
    };

    const save = (k, v) => {
        console.log(`💾 [STORAGE] Salvando novas preferências na chave [${k}]...`);
        localStorage.setItem(k, JSON.stringify(v));
    };

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
        console.log("📊 [ABAS-GEEK] Renderizando barra de navegação superior...");
        const bar = document.getElementById('filterScroller');
        if (!bar) {
            console.error("❌ [ABAS-GEEK] Falha ao renderizar: '#filterScroller' não existe.");
            return;
        }
        
        let drawer = document.getElementById('ag-drawer') || Object.assign(document.createElement('div'), { id: 'ag-drawer' });
        if (!drawer.parentNode) {
            console.log("📥 [ABAS-GEEK] Inserindo Drawer (menu de seleção) no DOM.");
            bar.parentNode.insertBefore(drawer, bar.nextSibling);
        }

        const order = getOrder();
        bar.innerHTML = '';

        order.forEach(id => {
            const item = findItem(id);
            if (!item) {
                console.warn(`⚠️ [ABAS-GEEK] ID de aba salvo no storage [${id}] não existe no catálogo atual.`);
                return;
            }
            const btn = document.createElement('button');
            btn.className = 'filter-tag';
            btn.textContent = item.label;
            btn.onclick = () => {
                console.log(`🖱️ [CLIQUE] Usuário selecionou a aba: ${item.label}`);
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
            console.log("⚙️ [CLIQUE] Abrindo/Fechando menu de configuração de abas.");
            drawer.classList.toggle('open');
            if (drawer.classList.contains('open')) renderDrawer();
        };
        bar.appendChild(cfg);
    };

    function renderDrawer(filterText = "") {
        console.log(`🗄️ [DRAWER] Atualizando menu de seleção. Filtro atual: "${filterText}"`);
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
                
                const isSelected = order.includes(item.id);
                const card = document.createElement('div');
                card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
                card.textContent = item.label;
                card.onclick = () => {
                    let currentOrder = getOrder();
                    if (currentOrder.includes(item.id)) {
                        console.log(`➖ [DRAWER] Removendo aba: ${item.label}`);
                        currentOrder = currentOrder.filter(x => x !== item.id);
                    } else if (currentOrder.length < CONFIG.MAX_TABS) {
                        console.log(`➕ [DRAWER] Adicionando aba: ${item.label}`);
                        currentOrder.push(item.id);
                    } else {
                        console.warn("🚫 [DRAWER] Limite máximo de abas atingido!");
                        alert(`Máximo de ${CONFIG.MAX_TABS} abas permitidas.`);
                    }
                    save(CONFIG.KEYS.ORDER, currentOrder);
                    window.renderBar();
                    renderDrawer(document.getElementById('ag-search-tabs').value);
                };
                grid.appendChild(card);
            });
            if (grid.children.length > 0) content.appendChild(block);
        });

        const searchInput = document.getElementById('ag-search-tabs');
        searchInput.oninput = (e) => renderDrawer(e.target.value);
        searchInput.focus(); // Mantém o foco durante a digitação
    }

    window.renderBar();
    console.log("✅ [ABAS-GEEK] Inicialização do sistema de abas concluída.");
}
