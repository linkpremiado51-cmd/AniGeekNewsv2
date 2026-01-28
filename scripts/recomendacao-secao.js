(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v7_order',
    MODE:  'ag_v7_mode',
    STATS: 'ag_v7_stats',
    GENRE: 'ag_v7_genre'
  }
};

const CATALOGO = [
  {
    sessao: "MANCHETES",
    id: 'manchetes',
    cor: "#FF4500",
    genero: ["Notícias", "Destaques"],
    itens: [
      { id: 'destaques', label: 'Destaques do Dia', genero: ["Notícias"] },
      { id: 'ultimas', label: 'Últimas Notícias', genero: ["Notícias"] },
      { id: 'trending', label: 'Trending / Em Alta', genero: ["Notícias"] },
      { id: 'exclusivos', label: 'Exclusivos', genero: ["Notícias"] },
      { id: 'urgente', label: 'Urgente', genero: ["Notícias"] },
      { id: 'maislidas', label: 'Mais Lidas', genero: ["Notícias"] },
      { id: 'editorpick', label: 'Editor's Pick', genero: ["Notícias"] }
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
    genero: ["Ação", "Fantasia", "Sobrenatural"],
    itens: []
  },
  {
    sessao: "Jujutsu Kaisen 1 temporada",
    id: 'jujutsu_kaisen',
    cor: "#7c0a02",
    genero: ["Ação", "Sobrenatural", "Shounen"],
    itens: []
  },
  {
    sessao: "Attack on Titan 1 temporada",
    id: 'attack_on_titan',
    cor: "#3b3b3b",
    genero: ["Ação", "Drama", "Sobrenatural"],
    itens: []
  },
  {
    sessao: "Demon Slayer 1 temporada",
    id: 'demon_slayer',
    cor: "#1f2937",
    genero: ["Ação", "Sobrenatural", "Shounen"],
    itens: []
  },
  {
    sessao: "Chainsaw Man 1 temporada",
    id: 'chainsaw_man',
    cor: "#991b1b",
    genero: ["Ação", "Comédia", "Sobrenatural"],
    itens: []
  }
];

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

  /* --- HEADER: PESQUISA, MODOS E BOTÃO HAMBÚRGUER --- */
  .ag-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    max-width: 840px;
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

  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 196px;
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
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    background: transparent;
    font-size: 9.8px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
  }

  body.dark-mode .ag-search-input {
    border-color: rgba(255,255,255,0.1);
    color: #fff;
  }

  .ag-search-input:focus {
    border-color: var(--primary-color, #e50914);
    box-shadow: 0 2.8px 10.5px rgba(0,0,0,0.08);
  }

  /* --- BOTÃO DE CONFIGURAÇÕES --- */
  .ag-settings-btn {
    background: transparent;
    border: none;
    padding: 5.6px;
    cursor: pointer;
    font-size: 12.6px;
    margin-left: 7px;
    color: #666;
    transition: color 0.2s;
  }

  .ag-settings-btn:hover {
    color: var(--primary-color, #e50914);
  }

  /* --- BOTÕES DE MODO --- */
  .ag-mode-group {
    background: rgba(0,0,0,0.05);
    padding: 2.8px;
    display: flex;
    position: relative;
  }
  body.dark-mode .ag-mode-group { background: rgba(255,255,255,0.08); }

  .ag-mode-btn {
    padding: 5.6px 11.2px;
    border: none;
    background: transparent;
    font-size: 7.7px;
    font-weight: 800;
    color: #888;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    position: relative;
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

  .ag-mode-tooltip {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 8px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  .ag-mode-btn:hover .ag-mode-tooltip {
    opacity: 1;
  }

  /* --- SESSÕES (CABEÇALHOS CLICÁVEIS) --- */
  .ag-section-block {
    margin-bottom: 24.5px;
    max-width: 840px;
    margin-left: auto;
    margin-right: auto;
  }

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
    position: relative;
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

  .ag-section-header-btn.is-active .ag-section-text {
    color: var(--primary-color, #e50914);
    text-decoration: underline;
    text-decoration-thickness: 1.4px;
    text-underline-offset: 2.8px;
  }

  .ag-section-marker {
    width: 7px;
    height: 7px;
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
    border: none;
    border-bottom: 1px solid #e0e0e0;
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
    border-color: #333;
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
    font-weight: 700;
  }
  body.dark-mode .ag-card.is-selected { background: #1a1a1a; }

  .ag-card-action {
    position: absolute;
    top: 2.1px;
    right: 2.8px;
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: inherit;
    opacity: 0.6;
    transition: 0.2s;
    cursor: pointer;
    border-radius: 50%;
  }

  .ag-card-action:hover {
    color: var(--primary-color, #e50914);
    opacity: 1;
    background: rgba(229, 9, 20, 0.1);
  }

  /* --- TOAST NOTIFICATION --- */
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
    border: none;
    border-left: 2.8px solid var(--primary-color, #e50914);
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
  .ag-toast.info { border-left: 2.8px solid #1E88E5; }

  @keyframes agSlideUp {
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes agFadeOut {
    to { opacity: 0; transform: translateY(-7px); }
  }

  /* --- FILTRO DE GÊNEROS (MODAL) --- */
  #ag-genres-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
  }

  .ag-genres-content {
    background: #fff;
    padding: 21px;
    border-radius: 0;
    max-width: 350px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  body.dark-mode .ag-genres-content {
    background: #252525;
    color: #fff;
  }

  .ag-genre-close {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #888;
  }

  body.dark-mode .ag-genre-close {
    color: #ccc;
  }

  .ag-genre-item {
    padding: 10.5px;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 9.8px;
    font-weight: 500;
    transition: 0.2s;
  }

  body.dark-mode .ag-genre-item {
    border-color: #333;
  }

  .ag-genre-item:hover {
    background: #f0f0f0;
  }
  body.dark-mode .ag-genre-item:hover { background: #333; }

  .ag-genre-item.active {
    background: var(--primary-color, #e50914);
    color: #fff;
    font-weight: 700;
  }

  /* --- BOTÃO PROFISSIONAL E FIXO --- */
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

  body.dark-mode .filter-tag.cfg-btn {
    background: rgba(20, 20, 20, 0.9);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: -10.5px 0 17.5px rgba(0, 0, 0, 0.5);
  }

  .filter-tag.cfg-btn:active {
    transform: scale(0.9);
    opacity: 0.8;
  }

  /* --- BADGE DE GÊNERO SELECIONADO --- */
  .ag-genre-badge {
    display: inline-block;
    background: rgba(229, 9, 20, 0.1);
    color: var(--primary-color, #e50914);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 8px;
    margin-left: 5px;
    font-weight: 600;
  }

  /* --- DIALOG DE MOVIMENTAÇÃO --- */
  .ag-move-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 3000;
    max-width: 400px;
    width: 90%;
  }

  body.dark-mode .ag-move-dialog {
    background: #252525;
    color: #fff;
  }

  .ag-move-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  body.dark-mode .ag-move-dialog-header {
    border-color: #333;
  }

  .ag-move-dialog-title {
    font-size: 14px;
    font-weight: 700;
    color: #333;
  }

  body.dark-mode .ag-move-dialog-title {
    color: #fff;
  }

  .ag-move-dialog-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #888;
  }

  .ag-move-dialog-body {
    margin-bottom: 15px;
  }

  .ag-move-position-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .ag-move-position-label {
    display: block;
    margin-bottom: 5px;
    font-size: 11px;
    color: #666;
  }

  .ag-move-buttons {
    display: flex;
    gap: 10px;
  }

  .ag-move-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ag-move-btn.cancel {
    background: #f0f0f0;
    color: #333;
  }

  .ag-move-btn.confirm {
    background: var(--primary-color, #e50914);
    color: #fff;
  }

  .ag-move-btn:hover {
    opacity: 0.9;
  }

  /* --- TUTORIAL TOOLTIP --- */
  .ag-tutorial-tooltip {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
    padding: 15px;
    border-radius: 8px;
    max-width: 400px;
    z-index: 4000;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    animation: agTooltipFadeIn 0.3s;
  }

  @keyframes agTooltipFadeIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  .ag-tutorial-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  .ag-tutorial-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .ag-tutorial-text {
    font-size: 11px;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .ag-tutorial-btn {
    background: var(--primary-color, #e50914);
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ag-tutorial-btn:hover {
    opacity: 0.9;
  }

  /* --- INDICADOR DE MODO --- */
  .ag-mode-indicator {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 9px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .ag-mode-group:hover .ag-mode-indicator {
    opacity: 1;
  }

  /* --- CONTADOR DE ITENS --- */
  .ag-item-counter {
    text-align: center;
    padding: 15px 0;
    font-size: 11px;
    color: #666;
  }

  body.dark-mode .ag-item-counter {
    color: #999;
  }

  .ag-item-counter strong {
    color: var(--primary-color, #e50914);
    font-weight: 700;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Estado global
let selectedGenre = load(CONFIG.KEYS.GENRE, null);
let tutorialShown = load('ag_tutorial_shown', false);

// Funções de armazenamento
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

// Funções de modo
function getMode(){ return load(CONFIG.KEYS.MODE, 'dynamic'); }
function setMode(m){ 
  save(CONFIG.KEYS.MODE, m); 
  showModeIndicator(m);
  renderDrawer(); 
}

function showModeIndicator(mode) {
  const indicator = document.querySelector('.ag-mode-indicator');
  if (!indicator) return;
  
  const text = mode === 'dynamic' 
    ? 'Ordem automática baseada no uso' 
    : 'Ordem fixa definida por você';
  
  indicator.textContent = text;
}

// Funções de ordem
function getOrder(){
  const saved = load(CONFIG.KEYS.ORDER, null);
  if(saved) return saved.filter(id => findItem(id) !== null);
  return ['manchetes', 'destaques', 'ultimas'];
}

function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return { id: sec.id, label: sec.sessao, genero: sec.genero, isSection: true };
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

  const order = getOrder().filter(id => findItem(id) !== null);
  order.sort((a,b) => (stats[b]||0) - (stats[a]||0));
  save(CONFIG.KEYS.ORDER, order);
}

// Renderização da barra
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

      if(window.carregarSecao) window.carregarSecao(id);
      else console.log("Carregando:", id);
    };
    bar.appendChild(btn);
  });

  const cfg = document.createElement('button');
  cfg.className = 'filter-tag cfg-btn';
  cfg.innerHTML = '⚙';
  cfg.onclick = toggleDrawer;
  cfg.title = 'Configurações';
  bar.appendChild(cfg);
}

// Drawer
function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(!drawer) return;

  if(drawer.classList.contains('open')){
    drawer.classList.remove('open');
  } else {
    renderDrawer();
    drawer.classList.add('open');
    if (!tutorialShown) {
      showTutorial();
      save('ag_tutorial_shown', true);
    }
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();

  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;
  const settingsIcon = `<button class="ag-settings-btn" id="ag-settings-btn" title="Configurações">⚙</button>`;

  let searchPlaceholder = selectedGenre ? `Filtrando por: ${selectedGenre}` : "Buscar por título ou gênero...";

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="${searchPlaceholder}" value="${filterText}">
        </div>
        ${settingsIcon}
        <div class="ag-mode-group">
          <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}" title="Ordem Fixa">
            Fixo
            <span class="ag-mode-tooltip">Ordem manual - você controla a posição</span>
          </button>
          <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}" title="Ordem Automática">
            Automático
            <span class="ag-mode-tooltip">Ordem automática - baseada no uso</span>
          </button>
          <div class="ag-mode-indicator"></div>
        </div>
      </div>
      <div id="ag-catalog-container"></div>
      <div class="ag-item-counter">
        <strong>${currentOrder.length}</strong> de <strong>${CONFIG.MAX_TABS}</strong> itens selecionados
        ${selectedGenre ? `<span class="ag-genre-badge">${selectedGenre}</span>` : ''}
      </div>
    </div>
  `;

  drawer.innerHTML = html;

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    const itensFiltrados = sec.itens.filter(i =>
      i.label.toLowerCase().includes(term) ||
      (i.genero && i.genero.some(g => g.toLowerCase().includes(term))) ||
      (selectedGenre ? (i.genero && i.genero.includes(selectedGenre)) : true)
    );
    const sessaoMatch = sec.sessao.toLowerCase().includes(term) ||
                        (sec.genero && sec.genero.some(g => g.toLowerCase().includes(term))) ||
                        (selectedGenre ? (sec.genero && sec.genero.includes(selectedGenre)) : true);

    if(term !== "" && !sessaoMatch && itensFiltrados.length === 0) return;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    const isCatSelected = currentOrder.includes(sec.id);
    let catIcon = isCatSelected ? (currentMode === 'dynamic' ? '✕' : '⋮') : '';

    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}</span>
        ${isCatSelected ? `<span class="ag-card-action" data-id="${sec.id}" data-action="true" title="${currentMode === 'dynamic' ? 'Remover' : 'Mover'}">${catIcon}</span>` : ''}
      </button>
      <div class="ag-grid-container"></div>
    `;

    sectionDiv.querySelector('.ag-section-header-btn').onclick = (e) => {
      if(e.target.closest('.ag-card-action')) return;
      toggleItem(sec.id, sec.sessao);
    };

    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

    (sessaoMatch ? sec.itens : itensFiltrados).forEach(item => {
      const isSelected = currentOrder.includes(item.id);
      const card = document.createElement('div');
      card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
      
      let actionIcon = isSelected ? (currentMode === 'dynamic' ? '✕' : '⋮') : '';
      let actionTitle = isSelected ? (currentMode === 'dynamic' ? 'Remover' : 'Mover') : '';

      card.innerHTML = `${item.label}${isSelected ? `<span class="ag-card-action" data-id="${item.id}" data-action="true" title="${actionTitle}">${actionIcon}</span>` : ''}`;
      
      card.onclick = (e) => {
        if(e.target.closest('.ag-card-action')) {
          e.stopPropagation();
          handleAction(item.id, item.label);
          return;
        }
        toggleItem(item.id, item.label);
      };
      
      grid.appendChild(card);
    });
  });

  document.getElementById('ag-search-input').oninput = (e) => renderDrawer(e.target.value);
  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
  document.getElementById('ag-settings-btn').onclick = () => openSettingsMenu();
}

// Modal de gêneros
function openGenresModal() {
  const modal = document.getElementById('ag-genres-modal');
  if(!modal) {
    const m = document.createElement('div');
    m.id = 'ag-genres-modal';
    m.innerHTML = `
      <div class="ag-genres-content">
        <button class="ag-genre-close" id="ag-genre-close-btn">×</button>
        <h3 style="margin-top:0;">Filtrar por Gênero</h3>
        <div id="ag-genres-list"></div>
      </div>
    `;
    document.body.appendChild(m);
  }

  const genresList = document.getElementById('ag-genres-list');
  const allGenres = [...new Set(CATALOGO.flatMap(cat => cat.genero || []).concat(CATALOGO.flatMap(cat => cat.itens.flatMap(item => item.genero || []))))];

  genresList.innerHTML = '';
  allGenres.forEach(genre => {
    const btn = document.createElement('button');
    btn.className = `ag-genre-item ${selectedGenre === genre ? 'active' : ''}`;
    btn.textContent = genre;
    btn.onclick = () => {
      selectedGenre = genre === selectedGenre ? null : genre;
      save(CONFIG.KEYS.GENRE, selectedGenre);
      document.getElementById('ag-search-input').placeholder = selectedGenre ? `Filtrando por: ${selectedGenre}` : "Buscar por título ou gênero...";
      renderDrawer('');
      modal.style.display = 'none';
    };
    genresList.appendChild(btn);
  });

  document.getElementById('ag-genre-close-btn').onclick = () => {
    modal.style.display = 'none';
  };

  modal.style.display = 'flex';
}

// Ações
function toggleItem(id, label){
  let order = getOrder();
  if(order.includes(id)){
    const mode = getMode();
    if(mode === 'dynamic') {
      const confirmRemove = confirm(`Remover "${label}" dos itens selecionados?`);
      if(!confirmRemove) {
        showToast('Operação cancelada', 'info');
        return;
      }
    }
    order = order.filter(x => x !== id);
    showToast(`Removido: <b>${label}</b>`);
  } else {
    if(order.length >= CONFIG.MAX_TABS) {
      showToast(`Limite de ${CONFIG.MAX_TABS} itens atingido!`, 'error');
      return;
    }
    order.push(id);
    showToast(`Adicionado: <b>${label}</b>`, 'success');
    setTimeout(() => {
      const btn = [...document.querySelectorAll('#filterScroller .filter-tag')].find(b => b.textContent.trim() === label);
      if (btn) {
        document.querySelectorAll('#filterScroller .filter-tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.carregarSecao) window.carregarSecao(id);
      }
    }, 100);
  }
  save(CONFIG.KEYS.ORDER, order);
  renderBar();
  const currentInput = document.getElementById('ag-search-input');
  const currentValue = currentInput ? currentInput.value : '';
  renderDrawer(currentValue);
  if (currentInput) currentInput.value = currentValue;
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();
  
  if(mode === 'dynamic') {
    const confirmRemove = confirm(`Remover "${label}" dos itens selecionados?`);
    if(!confirmRemove) {
      showToast('Operação cancelada', 'info');
      return;
    }
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    showToast(`Removido: <b>${label}</b>`);
  } else {
    openMoveDialog(id, label, order);
  }
  
  renderBar();
  const currentInput = document.getElementById('ag-search-input');
  const currentValue = currentInput ? currentInput.value : '';
  renderDrawer(currentValue);
  if (currentInput) currentInput.value = currentValue;
}

function openMoveDialog(id, label, order) {
  const dialog = document.createElement('div');
  dialog.className = 'ag-move-dialog';
  dialog.innerHTML = `
    <div class="ag-move-dialog-header">
      <span class="ag-move-dialog-title">Mover "${label}"</span>
      <button class="ag-move-dialog-close" id="ag-move-close">×</button>
    </div>
    <div class="ag-move-dialog-body">
      <label class="ag-move-position-label">Posição atual: ${order.indexOf(id) + 1} de ${order.length}</label>
      <input type="number" class="ag-move-position-input" id="ag-move-position" min="1" max="${order.length}" value="${order.indexOf(id) + 1}">
      <p style="font-size: 10px; color: #666; margin-top: 5px;">Digite a nova posição (1-${order.length})</p>
    </div>
    <div class="ag-move-buttons">
      <button class="ag-move-btn cancel" id="ag-move-cancel">Cancelar</button>
      <button class="ag-move-btn confirm" id="ag-move-confirm">Mover</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  document.getElementById('ag-move-close').onclick = () => dialog.remove();
  document.getElementById('ag-move-cancel').onclick = () => dialog.remove();
  document.getElementById('ag-move-confirm').onclick = () => {
    const newPos = parseInt(document.getElementById('ag-move-position').value) - 1;
    const currentIndex = order.indexOf(id);
    
    if(!isNaN(newPos) && newPos >= 0 && newPos < order.length && newPos !== currentIndex) {
      order.splice(currentIndex, 1);
      order.splice(newPos, 0, id);
      save(CONFIG.KEYS.ORDER, order);
      showToast(`<b>${label}</b> movido para posição ${newPos + 1}`, 'success');
      dialog.remove();
      renderBar();
      renderDrawer(document.getElementById('ag-search-input').value);
    } else {
      showToast('Posição inválida ou sem alteração', 'error');
    }
  };
}

// Menu de configurações
function openSettingsMenu() {
  const modal = document.createElement('div');
  modal.id = 'ag-settings-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  modal.innerHTML = `
    <div class="ag-genres-content">
      <button class="ag-genre-close" id="ag-settings-close">×</button>
      <h3 style="margin-top:0;">Configurações</h3>
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <button class="ag-genre-item" id="ag-genre-filter-btn">
          ${selectedGenre ? `Filtrando por: ${selectedGenre} ✅` : 'Filtrar por Gênero'}
        </button>
        <button class="ag-genre-item" onclick="location.reload()">
          Recarregar Página
        </button>
        <button class="ag-genre-item" onclick="localStorage.clear(); location.reload()">
          Limpar Todos os Dados
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('ag-settings-close').onclick = () => modal.remove();
  document.getElementById('ag-genre-filter-btn').onclick = () => {
    modal.remove();
    openGenresModal();
  };
}

// Toast
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

// Tutorial
function showTutorial() {
  const tutorial = document.createElement('div');
  tutorial.className = 'ag-tutorial-tooltip';
  tutorial.innerHTML = `
    <button class="ag-tutorial-close" id="ag-tutorial-close">×</button>
    <div class="ag-tutorial-title">Bem-vindo ao Sistema de Abas!</div>
    <div class="ag-tutorial-text">
      <p><strong>Modo Fixo:</strong> Você controla manualmente a ordem dos itens.</p>
      <p><strong>Modo Automático:</strong> A ordem é ajustada automaticamente com base no seu uso.</p>
      <p>Clique nos itens para adicioná-los ou removê-los da barra superior.</p>
      <p>Use o botão ⚙ para acessar configurações e filtros.</p>
    </div>
    <button class="ag-tutorial-btn" id="ag-tutorial-ok">Entendi!</button>
  `;
  
  document.body.appendChild(tutorial);
  
  document.getElementById('ag-tutorial-close').onclick = () => tutorial.remove();
  document.getElementById('ag-tutorial-ok').onclick = () => tutorial.remove();
}

// Inicialização
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
else renderBar();
})();
