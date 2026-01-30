/* ======================================================
   AniGeekNews – Enterprise Section System v10.0 (FINAL PERFECTED)
   • Menu abre ABAIXO das categorias (Barra de pesquisa sempre livre)
   • Capa ocupa 100% da largura horizontal
   • Auto-Clique Real mantido
   • Personagem Estático (Fade Only)
   • Zero cortes de código
====================================================== */

(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v10_order',
    MODE:  'ag_v10_mode', // 'dynamic' ou 'fixed'
    STATS: 'ag_v10_stats'
  }
};

/* ===========================
   BANCO DE DADOS
=========================== */
const CATALOGO = [
  {
    sessao: "PAGINA INICIAL",
    id: 'manchetes',
    cor: "#FF4500",
    itens: []
  },
  {
    sessao: "Saihate no Paladin 1 temporada",
    id: 'saihate_no_paladin',
    cor: "#8A2BE2",
    itens: []
  },
  {
    sessao: "Solo Leveling 1 temporada",
    id: 'solo_leveling',
    cor: "#0f172a",
    itens: []
  },
  {
    sessao: "Jujutsu Kaisen 1 temporada",
    id: 'jujutsu_kaisen',
    cor: "#7c0a02",
    itens: []
  },
  {
    sessao: "Attack on Titan 1 temporada",
    id: 'attack_on_titan',
    cor: "#3b3b3b",
    itens: []
  },
  {
    sessao: "Demon Slayer 1 temporada",
    id: 'demon_slayer',
    cor: "#1f2937",
    itens: []
  },
  {
    sessao: "Chainsaw Man 1 temporada",
    id: 'chainsaw_man',
    cor: "#991b1b",
    itens: []
  }
];

/* ===========================
   CSS INJETADO (COMPLETO)
=========================== */
const styles = `
  /* --- CONTAINER GLOBAL --- */
  .ag-interface-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative; /* Importante para o drawer se posicionar em relação a isso */
    margin-bottom: 15px;
    z-index: 50;
  }

  /* --- HEADER EXTERNO (PESQUISA E BOTÕES ACIMA DAS ABAS) --- */
  .ag-external-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 5px;
    width: 100%;
    position: relative;
    z-index: 1100; /* SUPERIOR AO DRAWER PARA FICAR CLICÁVEL */
    background: transparent;
  }

  .ag-search-wrapper {
    position: relative;
    flex: 1;
  }

  .ag-search-icon-svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    fill: #999;
    pointer-events: none;
  }

  .ag-search-input {
    width: 100%;
    padding: 9px 12px 9px 34px;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.1);
    background: rgba(255,255,255,0.95);
    font-size: 11px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  }

  body.dark-mode .ag-search-input {
    background: rgba(40,40,40,0.95);
    border-color: rgba(255,255,255,0.1);
    color: #fff;
  }

  .ag-search-input:focus {
    border-color: var(--primary-color, #e50914);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: #fff;
  }
  body.dark-mode .ag-search-input:focus { background: #222; }

  /* --- BOTÕES DE MODO (FIXO/AUTO) --- */
  .ag-mode-group {
    background: rgba(0,0,0,0.06);
    padding: 3px;
    border-radius: 8px;
    display: flex;
    flex-shrink: 0;
  }
  body.dark-mode .ag-mode-group { background: rgba(255,255,255,0.1); }

  .ag-mode-btn {
    padding: 7px 14px;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 800;
    color: #888;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .ag-mode-btn.active {
    background: #fff;
    color: #000;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  body.dark-mode .ag-mode-btn.active {
    background: #444;
    color: #fff;
  }

  /* --- BARRA DE ABAS (ORIGINAL) --- */
  #filterScroller {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 5px;
    position: relative;
    z-index: 1050; /* Também acima do drawer */
  }
  #filterScroller::-webkit-scrollbar { display: none; }

  .filter-tag.cfg-btn {
    position: sticky;
    right: 0;
    z-index: 99;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-left: 1px solid rgba(0,0,0,0.05);
    box-shadow: -10px 0 20px rgba(0,0,0,0.05);
    min-width: 40px;
    justify-content: center;
  }
  body.dark-mode .filter-tag.cfg-btn {
    background: rgba(30, 30, 30, 0.9);
    border-color: rgba(255,255,255,0.1);
  }

  /* --- GAVETA (DRAWER) --- */
  #ag-drawer {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease;
    opacity: 0;
    width: 100%;
    
    /* POSICIONAMENTO CRÍTICO: ABAIXO DE TUDO */
    position: absolute; 
    top: 100%; /* Começa exatamente onde o wrapper termina (abaixo das abas) */
    left: 0;
    z-index: 1000; /* Menor que o header */
    
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    border-radius: 0 0 12px 12px;
  }

  body.dark-mode #ag-drawer {
    background: #141414;
    border-color: #333;
    box-shadow: 0 15px 40px rgba(0,0,0,0.7);
  }

  #ag-drawer.open {
    max-height: 85vh;
    opacity: 1;
  }

  /* Scroll interno */
  .ag-drawer-scroll {
    position: relative;
    z-index: 5;
    max-height: 85vh;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  /* Container interno */
  .ag-drawer-content {
    padding: 0; /* REMOVIDO PADDING GERAL PARA A CAPA TOCAR AS BORDAS */
    min-height: 450px;
    display: flex;
    flex-direction: column;
  }

  /* --- IMAGEM DE CAPA NO MENU (FULL WIDTH) --- */
  .ag-drawer-cover {
    width: 100%;
    height: 130px;
    object-fit: cover;
    display: block;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  /* Padding apenas para o conteúdo de texto/cards */
  .ag-catalog-padder {
    padding: 20px 15px;
  }

  /* --- IMAGEM DE PERSONAGEM (FIXA/SEM DESLIZE) --- */
  .ag-char-fixed {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 90%;
    width: auto;
    max-width: 50vw;
    object-fit: contain;
    object-position: bottom right;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  #ag-drawer.open .ag-char-fixed {
    opacity: 1;
  }

  /* --- SESSÕES E GRID --- */
  .ag-section-block {
    margin-bottom: 25px;
    position: relative;
    z-index: 10; 
  }

  .ag-section-header-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .ag-section-header-btn:hover { opacity: 0.8; }

  .ag-section-text {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #444;
  }
  body.dark-mode .ag-section-text { color: #eee; }

  .ag-section-header-btn.is-active .ag-section-text {
    color: var(--primary-color, #e50914);
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }

  .ag-section-marker {
    width: 6px;
    height: 14px;
    border-radius: 2px;
  }

  .ag-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
    gap: 8px;
  }

  .ag-card {
    position: relative;
    background: #f7f7f7;
    border: 1px solid transparent;
    border-radius: 6px;
    padding: 12px 8px;
    font-size: 9.5px;
    font-weight: 600;
    color: #555;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
  }
  body.dark-mode .ag-card {
    background: #252525;
    color: #ccc;
  }

  .ag-card:hover { 
    transform: translateY(-2px); 
    background: #eee;
  }
  body.dark-mode .ag-card:hover { background: #333; }

  .ag-card.is-selected {
    background: #fff;
    border-color: var(--primary-color, #e50914);
    color: var(--primary-color, #e50914);
    font-weight: 800;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  body.dark-mode .ag-card.is-selected { background: #1a1a1a; }

  .ag-card-action {
    position: absolute;
    top: 4px;
    right: 5px;
    font-size: 8px;
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
  }
  .ag-card-action:hover { opacity: 1; color: red; }

  /* --- TOAST --- */
  #ag-toast-container {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ag-toast {
    background: rgba(20, 20, 20, 0.95);
    color: #fff;
    padding: 10px 24px;
    border-radius: 30px;
    font-size: 10px;
    font-weight: 600;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    backdrop-filter: blur(5px);
    opacity: 0;
    transform: translateY(20px);
    animation: agSlideUp 0.3s forwards;
  }
  .ag-toast.success { border-left: 3px solid #00C851; }
  .ag-toast.error { border-left: 3px solid #ff4444; }

  @keyframes agSlideUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes agFadeOut { to { opacity: 0; transform: translateY(-10px); } }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   UTILITÁRIOS
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

function showToast(msg, type='normal'){
  let c = document.getElementById('ag-toast-container');
  if(!c){ c = document.createElement('div'); c.id='ag-toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div'); t.className = `ag-toast ${type}`; t.innerHTML = msg;
  c.appendChild(t);
  setTimeout(()=>{ t.style.animation='agFadeOut 0.3s forwards'; setTimeout(()=>t.remove(),300); }, 3000);
}

function getMode(){ return load(CONFIG.KEYS.MODE, 'dynamic'); }
function setMode(m){ 
    save(CONFIG.KEYS.MODE, m); 
    updateModeButtons(); 
    const currentSearch = document.querySelector('.ag-search-input') ? document.querySelector('.ag-search-input').value : "";
    renderDrawer(currentSearch); 
}
function getOrder(){ return load(CONFIG.KEYS.ORDER, ['manchetes', 'destaques', 'ultimas']); }

function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return sec;
    const item = sec.itens.find(i => i.id === id);
    if(item) return item;
  }
  return null;
}

/* ===========================
   CONSTRUÇÃO DA INTERFACE
=========================== */
function initInterface() {
    const scrollContainer = document.getElementById('filterScroller');
    if (!scrollContainer) return;

    // 1. Cria Wrapper Global se não existir
    let wrapper = document.querySelector('.ag-interface-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'ag-interface-wrapper';
        scrollContainer.parentNode.insertBefore(wrapper, scrollContainer);
        wrapper.appendChild(scrollContainer);
    }

    // 2. Injeta Header Externo (Barra + Botões) ACIMA do scroller
    if (!document.querySelector('.ag-external-header')) {
        const header = document.createElement('div');
        header.className = 'ag-external-header';
        
        const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

        header.innerHTML = `
            <div class="ag-search-wrapper">
                ${searchIcon}
                <input type="text" class="ag-search-input" placeholder="Pesquisar...">
            </div>
            <div class="ag-mode-group">
                <button id="btn-fixo" class="ag-mode-btn">Fixo</button>
                <button id="btn-dinamico" class="ag-mode-btn">Auto</button>
            </div>
        `;

        wrapper.insertBefore(header, scrollContainer);

        // Eventos do Header
        const searchInput = header.querySelector('.ag-search-input');
        
        // Clique: Abre o Drawer
        searchInput.addEventListener('click', () => {
             const drawer = document.getElementById('ag-drawer');
             if(!drawer.classList.contains('open')) {
                 renderDrawer(searchInput.value);
                 drawer.classList.add('open');
             }
        });

        // Digitação: Abre e Filtra (sem mover o layout)
        searchInput.addEventListener('input', (e) => {
            const drawer = document.getElementById('ag-drawer');
            if(!drawer.classList.contains('open')) drawer.classList.add('open');
            filterDrawer(e.target.value);
        });

        // Botões de Modo
        document.getElementById('btn-fixo').onclick = () => setMode('fixed');
        document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
    }

    // 3. Cria o Drawer (Gaveta) DEPOIS do scroller
    if (!document.getElementById('ag-drawer')) {
        const drawer = document.createElement('div');
        drawer.id = 'ag-drawer';
        wrapper.appendChild(drawer);
    }

    updateModeButtons();
}

function updateModeButtons() {
    const mode = getMode();
    const btnFixo = document.getElementById('btn-fixo');
    const btnAuto = document.getElementById('btn-dinamico');
    if(btnFixo && btnAuto) {
        btnFixo.className = `ag-mode-btn ${mode==='fixed'?'active':''}`;
        btnAuto.className = `ag-mode-btn ${mode==='dynamic'?'active':''}`;
    }
}

/* ===========================
   RENDERIZAÇÃO DA BARRA DE ABAS
=========================== */
function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;
  const order = getOrder();
  
  bar.innerHTML = '';

  order.forEach(id => {
    const item = findItem(id);
    if(!item) return;

    const btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.textContent = item.label || item.sessao;
    btn.dataset.id = id;
    
    btn.onclick = () => {
      document.querySelectorAll('#filterScroller .filter-tag').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('ag-drawer').classList.remove('open');
      
      const url = new URL(window.location);
      url.searchParams.set('secao', id);
      window.history.replaceState({}, '', url);

      if(window.carregarSecao) window.carregarSecao(id);
    };
    bar.appendChild(btn);
  });

  const cfg = document.createElement('button');
  cfg.className = 'filter-tag cfg-btn';
  cfg.innerHTML = '⚙';
  cfg.onclick = toggleDrawer;
  bar.appendChild(cfg);
}

/* ===========================
   CONTROLE DO DRAWER
=========================== */
function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(drawer.classList.contains('open')){
    drawer.classList.remove('open');
  } else {
    // Renderiza mas NÃO foca no input para evitar abrir teclado
    const currentSearch = document.querySelector('.ag-search-input') ? document.querySelector('.ag-search-input').value : "";
    renderDrawer(currentSearch);
    drawer.classList.add('open');
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();

  const coverUrl = "https://i.postimg.cc/HWM72wfT/the-pensive-journey-by-chcofficial-dhme17e-pre.jpg";
  const charUrl = "https://i.postimg.cc/W49RX3dK/anime-boy-render-04-by-luxio56lavi-d5xed2a.png";

  drawer.innerHTML = `
    <img src="${charUrl}" class="ag-char-fixed" alt="Character">
    
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-content">
        <img src="${coverUrl}" class="ag-drawer-cover" alt="Cover">

        <div class="ag-catalog-padder">
            <div id="ag-catalog-container"></div>
            
            <div style="text-align:center; padding-top:20px; font-size:10px; color:#999; position:relative; z-index:10;">
                 ${currentOrder.length} de ${CONFIG.MAX_TABS} abas
            </div>
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    const itensFiltrados = sec.itens.filter(i => i.label.toLowerCase().includes(term));
    const sessaoMatch = sec.sessao.toLowerCase().includes(term);

    if(term !== "" && !sessaoMatch && itensFiltrados.length === 0) return;
    const itensParaMostrar = sessaoMatch ? sec.itens : itensFiltrados;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    const isCatSelected = currentOrder.includes(sec.id);
    let catIcon = isCatSelected ? (currentMode === 'dynamic' ? ' ✕' : ' •••') : '';

    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}${catIcon}</span>
      </button>
      <div class="ag-grid-container"></div>
    `;

    sectionDiv.querySelector('.ag-section-header-btn').onclick = () => {
        if(isCatSelected && currentMode === 'fixed') handleAction(sec.id, sec.sessao);
        else toggleItem(sec.id, sec.sessao);
    };

    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

    itensParaMostrar.forEach(item => {
      const isSelected = currentOrder.includes(item.id);
      const card = document.createElement('div');
      card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
      
      let actionIcon = isSelected ? (currentMode === 'dynamic' ? '✕' : '•••') : '';

      card.innerHTML = `
        ${item.label}
        ${isSelected ? `<div class="ag-card-action" data-action="true">${actionIcon}</div>` : ''}
      `;

      card.onclick = (e) => {
        if(e.target.dataset.action || e.target.parentNode.dataset.action) {
          e.stopPropagation();
          handleAction(item.id, item.label);
          return;
        }
        toggleItem(item.id, item.label);
      };
      grid.appendChild(card);
    });
  });
}

// Filtro que não recria DOM (evita fechar teclado ou perder foco)
function filterDrawer(term) {
  const termLower = term.toLowerCase();
  
  document.querySelectorAll('.ag-section-block').forEach(block => {
    const catId = block.querySelector('.ag-section-header-btn').dataset.catId;
    const cat = CATALOGO.find(c => c.id === catId);
    
    const sessaoMatch = cat.sessao.toLowerCase().includes(termLower);
    const hasItems = cat.itens.some(i => i.label.toLowerCase().includes(termLower));
    
    if (termLower !== "" && !sessaoMatch && !hasItems) {
      block.style.display = 'none';
      return;
    }
    block.style.display = '';

    const grid = block.querySelector('.ag-grid-container');
    Array.from(grid.children).forEach(card => {
       const text = card.textContent.trim().toLowerCase();
       if(sessaoMatch || text.includes(termLower)) card.style.display = '';
       else card.style.display = 'none';
    });
  });
}

/* ===========================
   AÇÕES: ADICIONAR / REMOVER / AUTO-CLIQUE
=========================== */
function toggleItem(id, label){
  let order = getOrder();

  if(order.includes(id)){
    // REMOVER
    order = order.filter(x => x !== id);
    showToast(`Removido: <b>${label}</b>`);
    save(CONFIG.KEYS.ORDER, order);
    renderBar();
    const currentSearch = document.querySelector('.ag-search-input') ? document.querySelector('.ag-search-input').value : "";
    renderDrawer(currentSearch);
  } else {
    // ADICIONAR
    if(order.length >= CONFIG.MAX_TABS) {
      showToast(`Limite de abas atingido!`, 'error');
      return;
    }
    order.push(id);
    save(CONFIG.KEYS.ORDER, order);
    
    renderBar();
    const currentSearch = document.querySelector('.ag-search-input') ? document.querySelector('.ag-search-input').value : "";
    renderDrawer(currentSearch);
    showToast(`Adicionado: <b>${label}</b>`, 'success');

    // ==========================================================
    // AUTO-CLIQUE REAL APÓS ADICIONAR
    // ==========================================================
    setTimeout(() => {
        const btn = document.querySelector(`#filterScroller .filter-tag[data-id="${id}"]`);
        if(btn) {
            console.log("Simulando clique na nova aba:", id);
            btn.click(); 
        }
    }, 150);
  }
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    toggleItem(id, label);
  } else {
    const currentIdx = order.indexOf(id);
    const newPos = prompt(`Mover "${label}" para qual posição? (1-${order.length})`, currentIdx + 1);
    if(newPos && !isNaN(newPos)) {
        const target = parseInt(newPos) - 1;
        if(target >= 0 && target < order.length){
            order.splice(currentIdx, 1);
            order.splice(target, 0, id);
            save(CONFIG.KEYS.ORDER, order);
            renderBar();
            const currentSearch = document.querySelector('.ag-search-input') ? document.querySelector('.ag-search-input').value : "";
            renderDrawer(currentSearch);
        }
    }
  }
}

/* ===========================
   INICIALIZAÇÃO & DEEP LINKING
=========================== */
window.addEventListener('DOMContentLoaded', () => {
  initInterface();
  renderBar();

  const params = new URLSearchParams(window.location.search);
  const idNews = params.get('id');
  const idSec = params.get('secao');
  
  let targetId = null;
  if(idNews) targetId = 'saihate_no_paladin';
  else if(idSec) targetId = idSec;

  if (targetId) {
     const item = findItem(targetId);
     if(item) {
         let order = getOrder();
         if (!order.includes(targetId)) {
             if(order.length >= CONFIG.MAX_TABS) order.pop();
             order.push(targetId);
             save(CONFIG.KEYS.ORDER, order);
             renderBar();
         }
         
         setTimeout(() => {
             const btn = document.querySelector(`.filter-tag[data-id="${targetId}"]`);
             if(btn) btn.click();
         }, 300);
     }
  }
});

})();
