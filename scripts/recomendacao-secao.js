/* ======================================================
   AniGeekNews – Enterprise Section System v7
   • Títulos de Sessão Clicáveis (Categorias Pai)
   • Notificações Toast Profissionais (Sem Alert)
   • Controle de Foco (Teclado não abre sozinho)
   • Design Harmônico
   • Busca por Gênero Aprimorada
   • Botão Hambúrguer de Filtros
====================================================== */

(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v7_order',
    MODE:  'ag_v7_mode', // 'dynamic' ou 'fixed'
    STATS: 'ag_v7_stats'
  }
};

/* ===========================
   BANCO DE DADOS (COM IDs NAS SESSÕES E GÊNEROS)
=========================== */
const CATALOGO = [
  {
    sessao: "MANCHETES",
    id: 'manchetes', // ID DA CATEGORIA PAI
    cor: "#FF4500", 
    itens: [
      { id: 'destaques', label: 'Destaques do Dia' },
      { id: 'ultimas', label: 'Últimas Notícias' },
      { id: 'trending', label: 'Trending / Em Alta' },
      { id: 'exclusivos', label: 'Exclusivos' },
      { id: 'urgente', label: 'Urgente' },
      { id: 'maislidas', label: 'Mais Lidas' },
      { id: 'editorpick', label: 'Editor's Pick' }
    ]
  },
  {
    sessao: "Saihate no Paladin 1 temporada",
    id: 'saihate_no_paladin',
    cor: "#8A2BE2",
    genero: ["Fantasia", "Isekai", "Aventura"],
    itens: []
  },
  {
    sessao: "Solo Leveling 1 temporada",
    id: 'solo_leveling',
    cor: "#0f172a",
    genero: ["Ação", "Fantasia", "Aventura"],
    itens: []
  },
  {
    sessao: "Jujutsu Kaisen 1 temporada",
    id: 'jujutsu_kaisen',
    cor: "#7c0a02",
    genero: ["Ação", "Sobrenatural", "Escola"],
    itens: []
  },
  {
    sessao: "Attack on Titan 1 temporada",
    id: 'attack_on_titan',
    cor: "#3b3b3b",
    genero: ["Ação", "Drama", "Pós-apocalíptico"],
    itens: []
  },
  {
    sessao: "Demon Slayer 1 temporada",
    id: 'demon_slayer',
    cor: "#1f2937",
    genero: ["Ação", "Histórico", "Sobrenatural"],
    itens: []
  },
  {
    sessao: "Chainsaw Man 1 temporada",
    id: 'chainsaw_man',
    cor: "#991b1b",
    genero: ["Ação", "Sobrenatural", "Dark"],
    itens: []
  }
];

/* ===========================
   CSS INJETADO
=========================== */
const styles = `
  /* --- LAYOUT DA GAVETA --- */
  #ag-drawer {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    max-height: 0;
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 1000;
    box-shadow: 0 10.5px 21px rgba(0,0,0,0.08);
  }
  
  body.dark-mode #ag-drawer {
    background: #141414;
    border-color: #333;
    box-shadow: 0 10.5px 21px rgba(0,0,0,0.5);
  }

  #ag-drawer.open {
    max-height: 85vh;
    opacity: 1;
  }

  .ag-drawer-scroll {
    max-height: 85vh;
    overflow-y: auto;
    padding: 21px 14px;
    scrollbar-width: thin;
  }

  /* --- HEADER: PESQUISA, HAMBÚRGUER E MODOS --- */
  .ag-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    max-width: 840px;
    
    /* Fixação no topo com efeito vidro */
    position: sticky;
    top: -21px;
    z-index: 100;
    margin: -21px auto 21px auto; 
    padding: 17.5px 0;
    
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8.4px);
    -webkit-backdrop-filter: blur(8.4px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: background 0.3s ease;
  }

  body.dark-mode .ag-drawer-header {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(255, 255, 255, 0.08);
  }

  /* Efeito de degradê inferior para suavizar a rolagem dos itens */
  .ag-drawer-header::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 0;
    width: 100%;
    height: 14px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), transparent);
    pointer-events: none;
  }
  
  body.dark-mode .ag-drawer-header::after {
    background: linear-gradient(to bottom, rgba(20, 20, 20, 0.9), transparent);
  }

  /* --- BOTÃO HAMBÚRGUER DE GÊNEROS --- */
  .ag-genre-btn {
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .ag-genre-btn:hover {
    opacity: 0.7;
  }

  .ag-genre-icon {
    width: 18px;
    height: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ag-genre-bar {
    width: 100%;
    height: 2px;
    background: #333;
    border-radius: 1px;
    transition: all 0.2s;
  }

  body.dark-mode .ag-genre-bar { background: #fff; }

  /* --- PESQUISA --- */
  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 196px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ag-search-icon-svg {
    position: absolute;
    left: 9.8px;
    top: 50%;
    transform: translateY(-50%);
    width: 12.6px;
    height: 12.6px;
    fill: #999;
    pointer-events: none;
  }

  .ag-search-input {
    width: 100%;
    padding: 7.7px 10.5px 7.7px 31.5px;
    border-radius: 7px;
    border: 1px solid rgba(0,0,0,0.1);
    background: rgba(0,0,0,0.04);
    font-size: 9.8px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
  }

  body.dark-mode .ag-search-input {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    color: #fff;
  }
  
  .ag-search-input:focus {
    background: #fff;
    border-color: var(--primary-color, #e50914);
    box-shadow: 0 2.8px 10.5px rgba(0,0,0,0.08);
  }
  body.dark-mode .ag-search-input:focus { background: #252525; }

  /* --- BOTÕES DE MODO --- */
  .ag-mode-group {
    background: rgba(0,0,0,0.05);
    padding: 2.8px;
    border-radius: 7px;
    display: flex;
  }
  body.dark-mode .ag-mode-group { background: rgba(255,255,255,0.08); }

  .ag-mode-btn {
    padding: 5.6px 11.2px;
    border: none;
    background: transparent;
    border-radius: 4.9px;
    font-size: 7.7px;
    font-weight: 800;
    color: #888;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .ag-mode-btn.active {
    background: #fff;
    color: #000;
    box-shadow: 0 1.4px 5.6px rgba(0,0,0,0.12);
  }
  body.dark-mode .ag-mode-btn.active {
    background: #333;
    color: #fff;
  }

  /* --- MENU DE GÊNEROS --- */
  #ag-genre-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s;
  }

  #ag-genre-menu.open {
    display: flex;
    opacity: 1;
  }

  .ag-genre-container {
    background: #fff;
    border-radius: 14px;
    max-width: 90%;
    max-height: 80%;
    overflow-y: auto;
    padding: 28px;
    box-shadow: 0 14px 42px rgba(0,0,0,0.3);
  }

  body.dark-mode .ag-genre-container {
    background: #1a1a1a;
  }

  .ag-genre-title {
    font-size: 14px;
    font-weight: 900;
    margin-bottom: 14px;
    color: #333;
    text-align: center;
  }

  body.dark-mode .ag-genre-title { color: #fff; }

  .ag-genre-list {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    justify-content: center;
  }

  .ag-genre-tag {
    padding: 7px 14px;
    background: #f0f0f0;
    border-radius: 21px;
    font-size: 10.5px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  body.dark-mode .ag-genre-tag {
    background: #2a2a2a;
    color: #ccc;
  }

  .ag-genre-tag:hover {
    background: var(--primary-color, #e50914);
    color: #fff;
    transform: scale(1.05);
  }

  .ag-genre-tag.active {
    background: var(--primary-color, #e50914);
    color: #fff;
    border-color: var(--primary-color, #e50914);
  }

  .ag-genre-close {
    position: absolute;
    top: 14px;
    right: 14px;
    background: transparent;
    border: none;
    font-size: 21px;
    color: #fff;
    cursor: pointer;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* --- SESSÕES (CABEÇALHOS CLICÁVEIS) --- */
  .ag-section-block {
    margin-bottom: 24.5px;
    max-width: 840px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Estilo do título que agora é um botão */
  .ag-section-header-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 8.4px;
    background: transparent;
    border: none;
    padding: 3.5px 0;
    cursor: pointer;
    width: fit-content;
    transition: 0.2s;
  }

  .ag-section-header-btn:hover {
    opacity: 0.7;
  }

  .ag-section-text {
    font-size: 9.8px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #333;
  }
  body.dark-mode .ag-section-text { color: #fff; }

  /* Indicador visual de que o título está selecionado */
  .ag-section-header-btn.is-active .ag-section-text {
    color: var(--primary-color, #e50914);
    text-decoration: underline;
    text-decoration-thickness: 1.4px;
    text-underline-offset: 2.8px;
  }

  .ag-section-marker {
    width: 7px;
    height: 7px;
    border-radius: 2.1px;
    box-shadow: 0 0 3.5px rgba(0,0,0,0.2);
  }

  /* --- GRID --- */
  .ag-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); 
    gap: 7px;
  }

  .ag-card {
    position: relative;
    background: #f9f9f9;
    border: 1px solid transparent;
    border-radius: 4.2px;
    padding: 8.4px 7px;
    font-size: 9.1px;
    font-weight: 500;
    color: #444;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 100%; 
    display: flex;
    align-items: center;
    justify-content: center;
  }

  body.dark-mode .ag-card {
    background: #1e1e1e;
    color: #ccc;
  }

  .ag-card:hover {
    background: #ececec;
    transform: translateY(-1.4px);
  }
  body.dark-mode .ag-card:hover { background: #2a2a2a; }

  .ag-card.is-selected {
    background: #fff;
    border-color: var(--primary-color, #e50914);
    color: var(--primary-color, #e50914);
    box-shadow: inset 0 0 0 0.7px var(--primary-color, #e50914);
    font-weight: 700;
  }
  body.dark-mode .ag-card.is-selected { background: #1a1a1a; }

  .ag-card-action {
    position: absolute;
    top: 2.1px;
    right: 2.8px;
    width: 11.2px;
    height: 11.2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7px;
    border-radius: 50%;
    color: inherit;
    opacity: 0.6;
    transition: 0.2s;
  }
  
  .ag-card-action:hover {
    background: var(--primary-color, #e50914);
    color: #fff !important;
    opacity: 1;
  }

  /* --- TOAST NOTIFICATION (Substituto do Alert) --- */
  #ag-toast-container {
    position: fixed;
    bottom: 21px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ag-toast {
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
    padding: 8.4px 16.8px;
    border-radius: 35px;
    font-size: 9.1px;
    font-weight: 600;
    box-shadow: 0 3.5px 10.5px rgba(0,0,0,0.3);
    backdrop-filter: blur(3.5px);
    opacity: 0;
    transform: translateY(14px);
    animation: agSlideUp 0.3s forwards;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  
  .ag-toast.error { border-left: 2.8px solid #ff4444; }
  .ag-toast.success { border-left: 2.8px solid #00C851; }

  @keyframes agSlideUp {
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes agFadeOut {
    to { opacity: 0; transform: translateY(-7px); }
  }
  
  /* --- AJUSTE PARA BOTÃO PROFISSIONAL E FIXO --- */
  #filterScroller {
    display: flex;
    align-items: center;
    position: relative;
    gap: 5.6px;
    padding-right: 0 !important;
    overflow-x: auto;
    scrollbar-width: none;
  }
  #filterScroller::-webkit-scrollbar { display: none; }

  .filter-tag.cfg-btn {
    position: sticky;
    right: 0 !important;
    z-index: 99;
    
    background: rgba(255, 255, 255, 0.9); 
    backdrop-filter: blur(5.6px);
    -webkit-backdrop-filter: blur(5.6px);
    
    min-width: 33.6px;
    height: 23.8px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    
    border: none;
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: -7px 0 14px rgba(0, 0, 0, 0.05);
    
    cursor: pointer;
    font-size: 12.6px;
    transition: all 0.3s ease;
  }

  .filter-tag.cfg-btn::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 0;
    width: 14px;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.9));
    pointer-events: none;
  }

  body.dark-mode .filter-tag.cfg-btn {
    background: rgba(20, 20, 20, 0.9);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: -10.5px 0 17.5px rgba(0, 0, 0, 0.5);
  }

  body.dark-mode .filter-tag.cfg-btn::before {
    background: linear-gradient(to right, transparent, rgba(20, 20, 20, 0.9));
  }

  .filter-tag.cfg-btn:active {
    transform: scale(0.9);
    opacity: 0.8;
  }

`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   SISTEMA DE TOAST (NOTIFICAÇÃO)
=========================== */
function showToast(message, type = 'normal') {
  let container = document.getElementById('ag-toast-container');
  if(!container) {
    container = document.createElement('div');
    container.id = 'ag-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `ag-toast ${type}`;
  toast.innerHTML = message;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'agFadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===========================
   LÓGICA CORE
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

function getMode(){ return load(CONFIG.KEYS.MODE, 'dynamic'); }
function setMode(m){ save(CONFIG.KEYS.MODE, m); renderDrawer(); }

function getOrder(){
  const saved = load(CONFIG.KEYS.ORDER, null);
  if(saved) return saved;
  return ['manchetes', 'destaques', 'ultimas'];
}

// Encontra ITEM ou CATEGORIA PAI pelo ID
function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return { id: sec.id, label: sec.sessao };
    const item = sec.itens.find(i => i.id === id);
    if(item) return item;
  }
  return null;
}

function track(id){
  if(getMode() !== 'dynamic') return;
  const stats = load(CONFIG.KEYS.STATS, {});
  stats[id] = (stats[id] || 0) + 1;
  save(CONFIG.KEYS.STATS, stats);
  
  const order = getOrder();
  order.sort((a,b) => (stats[b]||0) - (stats[a]||0));
  save(CONFIG.KEYS.ORDER, order);
}

/* ===========================
   DEBOUNCE PARA BUSCA
=========================== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ===========================
   RENDERIZAÇÃO BARRA HORIZONTAL
=========================== */
function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;

  let drawer = document.getElementById('ag-drawer');
  if(!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'ag-drawer';
    bar.parentNode.insertBefore(drawer, bar.nextSibling);
  }

  const order = getOrder();
  bar.innerHTML = '';

  order.forEach(id => {
    const item = findItem(id);
    if(!item) return;

    const btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.textContent = item.label;
    btn.onclick = () => {
      document.querySelectorAll('#filterScroller .filter-tag').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      track(id);
      document.getElementById('ag-drawer').classList.remove('open');
      
      if(window.carregarSecao) window.carregarSecao(id);
      else console.log("Carregando:", id);
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
   GAVETA (DRAWER) - CORRIGIDO
=========================== */
function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(!drawer) return;
  
  if(drawer.classList.contains('open')){
    drawer.classList.remove('open');
  } else {
    renderDrawer();
    drawer.classList.add('open');
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();

  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          <button class="ag-genre-btn" id="ag-genre-btn">
            <div class="ag-genre-icon">
              <div class="ag-genre-bar"></div>
              <div class="ag-genre-bar"></div>
              <div class="ag-genre-bar"></div>
            </div>
          </button>
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar..." value="${filterText}">
        </div>
        
        <div class="ag-mode-group">
          <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}">Fixo</button>
          <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}">Automático</button>
        </div>
      </div>

      <div id="ag-catalog-container"></div>
      
      <div style="text-align:center; padding-top:20px; font-size:12px; color:#888;">
        ${currentOrder.length} de ${CONFIG.MAX_TABS} abas ativas
      </div>
    </div>
  `;

  drawer.innerHTML = html;

  // Configurar debounce para busca
  const input = document.getElementById('ag-search-input');
  const debouncedSearch = debounce((e) => {
    renderDrawer(e.target.value);
  }, 300);
  
  input.addEventListener('input', debouncedSearch);

  // Configurar botão de gêneros
  document.getElementById('ag-genre-btn').onclick = toggleGenreMenu;

  // Configurar botões de modo
  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');

  // Renderizar catálogo
  renderCatalog(filterText);
}

function renderCatalog(filterText = ""){
  const container = document.getElementById('ag-catalog-container');
  if(!container) return;

  const currentOrder = getOrder();
  const currentMode = getMode();
  const term = filterText.toLowerCase();

  container.innerHTML = '';

  CATALOGO.forEach(sec => {
    // Filtragem por gênero
    let generoMatch = false;
    if(sec.genero) {
      generoMatch = sec.genero.some(g => g.toLowerCase().includes(term));
    }
    
    // Filtragem por nome da sessão
    const sessaoMatch = sec.sessao.toLowerCase().includes(term);
    
    // Filtragem por itens
    const itensFiltrados = sec.itens.filter(i => i.label.toLowerCase().includes(term));
    
    // Se não houver correspondência e não estiver filtrando, pular
    if(term !== "" && !sessaoMatch && !generoMatch && itensFiltrados.length === 0) return;
    
    // Determinar quais itens mostrar
    const itensParaMostrar = sessaoMatch || generoMatch ? sec.itens : itensFiltrados;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    // VERIFICA SE A CATEGORIA PAI JÁ ESTÁ SELECIONADA
    const isCatSelected = currentOrder.includes(sec.id);
    let catIcon = '';
    if(isCatSelected) {
       catIcon = currentMode === 'dynamic' ? ' <span style="font-size:10px; opacity:0.6; margin-left:5px">✕</span>' : ' <span style="font-size:10px; opacity:0.6; margin-left:5px">•••</span>';
    }

    // TÍTULO DA SESSÃO AGORA É UM BOTÃO
    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}${catIcon}</span>
      </button>
      <div class="ag-grid-container"></div>
    `;
    
    // Evento de clique no título da seção (Pai)
    sectionDiv.querySelector('.ag-section-header-btn').onclick = (e) => {
        // Se já tem seleção, verifica se é pra mover ou deletar
        if(isCatSelected && currentMode === 'fixed') {
             handleAction(sec.id, sec.sessao);
        } else {
             toggleItem(sec.id, sec.sessao);
        }
    };

    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

    // RENDERIZA OS ITENS FILHOS
    itensParaMostrar.forEach(item => {
      const isSelected = currentOrder.includes(item.id);
      
      const card = document.createElement('div');
      card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
      
      let actionIcon = '';
      if(isSelected) {
        actionIcon = currentMode === 'dynamic' ? '✕' : '•••';
      }

      card.innerHTML = `
        ${item.label}
        ${isSelected ? `<div class="ag-card-action" data-id="${item.id}" data-action="true">${actionIcon}</div>` : ''}
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

/* ===========================
   MENU DE GÊNEROS
=========================== */
function toggleGenreMenu(){
  let menu = document.getElementById('ag-genre-menu');
  
  if(!menu) {
    menu = document.createElement('div');
    menu.id = 'ag-genre-menu';
    document.body.appendChild(menu);
    
    menu.innerHTML = `
      <div class="ag-genre-container">
        <button class="ag-genre-close" id="ag-genre-close">×</button>
        <h3 class="ag-genre-title">Filtrar por Gênero</h3>
        <div class="ag-genre-list" id="ag-genre-list"></div>
      </div>
    `;
    
    document.getElementById('ag-genre-close').onclick = () => {
      menu.classList.remove('open');
    };
  }
  
  menu.classList.toggle('open');
  if(menu.classList.contains('open')) {
    renderGenreList();
  }
}

function renderGenreList(){
  const list = document.getElementById('ag-genre-list');
  if(!list) return;

  // Coletar todos os gêneros únicos
  const generos = new Set();
  CATALOGO.forEach(sec => {
    if(sec.genero) {
      sec.genero.forEach(g => generos.add(g));
    }
  });

  list.innerHTML = '';

  generos.forEach(genero => {
    const tag = document.createElement('div');
    tag.className = 'ag-genre-tag';
    tag.textContent = genero;
    tag.onclick = () => applyGenreFilter(genero);
    list.appendChild(tag);
  });
}

function applyGenreFilter(genero){
  const menu = document.getElementById('ag-genre-menu');
  menu.classList.remove('open');
  
  const drawer = document.getElementById('ag-drawer');
  drawer.classList.add('open');
  
  const input = document.getElementById('ag-search-input');
  if(input) {
    input.value = genero;
    renderCatalog(genero);
  }
}

/* ===========================
   AÇÕES & NOTIFICAÇÕES
=========================== */
function toggleItem(id, label){
  let order = getOrder();
  
  if(order.includes(id)){
    // Remove
    order = order.filter(x => x !== id);
    showToast(`Removido: <b>${label}</b>`, 'normal');
  } else {
    // Adiciona com verificação de limite
    if(order.length >= CONFIG.MAX_TABS) {
      showToast(`Limite de ${CONFIG.MAX_TABS} abas atingido!`, 'error');
      return;
    }
    order.push(id);
    showToast(`Adicionado: <b>${label}</b>`, 'success');
  }
  
  save(CONFIG.KEYS.ORDER, order);
  renderBar();
  renderCatalog(document.getElementById('ag-search-input').value);
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    showToast(`Removido: <b>${label}</b>`);
    renderBar();
    renderCatalog(document.getElementById('ag-search-input').value);
  } else {
    const currentIndex = order.indexOf(id);
    const newPos = prompt(`Mover "${label}" para qual posição? (1-${order.length})`, currentIndex + 1);
    
    if(newPos !== null){
      const targetIndex = parseInt(newPos) - 1;
      if(!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < order.length) {
        order.splice(currentIndex, 1);
        order.splice(targetIndex, 0, id);
        save(CONFIG.KEYS.ORDER, order);
        renderBar();
        renderCatalog(document.getElementById('ag-search-input').value);
        showToast(`<b>${label}</b> movido para posição ${newPos}`);
      }
    }
  }
}

/* Inicialização */
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
else renderBar();

})();
