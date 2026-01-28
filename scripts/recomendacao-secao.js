/* ======================================================
   AniGeekNews – Enterprise Section System v7
   • Títulos de Sessão Clicáveis (Categorias Pai)
   • Notificações Toast Profissionais (Sem Alert)
   • Controle de Foco (Teclado não abre sozinho)
   • Design Harmônico
   • Sistema de Gêneros
   • Integração Firebase
   • Filtros Avançados
====================================================== */

(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v7_order',
    MODE:  'ag_v7_mode', // 'dynamic' ou 'fixed'
    STATS: 'ag_v7_stats',
    FILTER: 'ag_v7_filter'
  },
  FIREBASE: {
    COLLECTION: 'abas'
  }
};

/* ===========================
   INICIALIZAÇÃO FIREBASE
=========================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
  authDomain: "anigeeknews.firebaseapp.com",
  projectId: "anigeeknews",
  storageBucket: "anigeeknews.firebasestorage.app",
  messagingSenderId: "769322939926",
  appId: "1:769322939926:web:6eb91a96a3f74670882737",
  measurementId: "G-G5T8CCRGZT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db; // Disponibilizar globalmente

/* ===========================
   BANCO DE DADOS (COM GÊNEROS)
=========================== */
const CATALOGO = [
  {
    sessao: "MANCHETES",
    id: 'manchetes',
    cor: "#FF4500",
    genero: "notícias",
    itens: [
      { id: 'destaques', label: 'Destaques do Dia', genero: "notícias" },
      { id: 'ultimas', label: 'Últimas Notícias', genero: "notícias" },
      { id: 'trending', label: 'Trending / Em Alta', genero: "trending" },
      { id: 'exclusivos', label: 'Exclusivos', genero: "exclusivo" },
      { id: 'urgente', label: 'Urgente', genero: "urgente" },
      { id: 'maislidas', label: 'Mais Lidas', genero: "popular" },
      { id: 'editorpick', label: 'Editor's Pick', genero: "editorial" }
    ]
  },
  {
    sessao: "Saihate no Paladin 1 temporada",
    id: 'saihate_no_paladin',
    cor: "#8A2BE2",
    genero: "anime",
    itens: []
  },
  {
    sessao: "Solo Leveling 1 temporada",
    id: 'solo_leveling',
    cor: "#0f172a",
    genero: "anime",
    itens: []
  },
  {
    sessao: "Jujutsu Kaisen 1 temporada",
    id: 'jujutsu_kaisen',
    cor: "#7c0a02",
    genero: "anime",
    itens: []
  },
  {
    sessao: "Attack on Titan 1 temporada",
    id: 'attack_on_titan',
    cor: "#3b3b3b",
    genero: "anime",
    itens: []
  },
  {
    sessao: "Demon Slayer 1 temporada",
    id: 'demon_slayer',
    cor: "#1f2937",
    genero: "anime",
    itens: []
  },
  {
    sessao: "Chainsaw Man 1 temporada",
    id: 'chainsaw_man',
    cor: "#991b1b",
    genero: "anime",
    itens: []
  }
];

// Gêneros disponíveis
const GENEROS = [
  { id: 'anime', label: 'Anime', icon: '🎬' },
  { id: 'notícias', label: 'Notícias', icon: '📰' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'exclusivo', label: 'Exclusivo', icon: '⭐' },
  { id: 'urgente', label: 'Urgente', icon: '🚨' },
  { id: 'popular', label: 'Popular', icon: '👍' },
  { id: 'editorial', label: 'Editorial', icon: '✍️' }
];

/* ===========================
   CSS INJETADO (ATUALIZADO)
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

  /* --- HEADER: PESQUISA E MODOS (ESTÉTICA HIGH-END) --- */
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

  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 196px;
    display: flex;
    gap: 7px;
  }

  .ag-hamburger-btn {
    width: 35px;
    height: 35px;
    background: rgba(0,0,0,0.05);
    border: none;
    border-radius: 7px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  body.dark-mode .ag-hamburger-btn {
    background: rgba(255,255,255,0.08);
  }
  
  .ag-hamburger-btn:hover {
    background: rgba(0,0,0,0.1);
  }
  
  body.dark-mode .ag-hamburger-btn:hover {
    background: rgba(255,255,255,0.15);
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

  /* --- FILTROS --- */
  .ag-filters-container {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    margin: 14px 0;
    max-width: 840px;
    margin-left: auto;
    margin-right: auto;
  }

  .ag-filter-btn {
    padding: 5.6px 11.2px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 21px;
    background: rgba(0,0,0,0.03);
    font-size: 7.7px;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  body.dark-mode .ag-filter-btn {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    color: #aaa;
  }
  
  .ag-filter-btn.active {
    background: var(--primary-color, #e50914);
    color: #fff;
    border-color: var(--primary-color, #e50914);
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

  /* --- MENU DE GÊNEROS --- */
  .ag-genres-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 7px;
    padding: 14px;
    box-shadow: 0 7px 21px rgba(0,0,0,0.15);
    z-index: 1001;
    display: none;
    min-width: 200px;
  }
  
  body.dark-mode .ag-genres-menu {
    background: #1a1a1a;
    border-color: #333;
  }
  
  .ag-genre-item {
    padding: 7px 14px;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  
  .ag-genre-item:hover {
    background: rgba(0,0,0,0.05);
  }
  
  body.dark-mode .ag-genre-item:hover {
    background: rgba(255,255,255,0.05);
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

  /* --- BOTÃO CONFIGURAÇÃO --- */
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

  /* --- MENU DE AÇÕES (3 PONTINHOS) --- */
  .ag-actions-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 7px;
    padding: 7px 0;
    box-shadow: 0 7px 21px rgba(0,0,0,0.15);
    z-index: 1002;
    display: none;
    min-width: 140px;
  }
  
  body.dark-mode .ag-actions-menu {
    background: #1a1a1a;
    border-color: #333;
  }
  
  .ag-action-item {
    padding: 7px 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 8.4px;
    font-weight: 500;
  }
  
  .ag-action-item:hover {
    background: rgba(0,0,0,0.05);
  }
  
  body.dark-mode .ag-action-item:hover {
    background: rgba(255,255,255,0.05);
  }
  
  .ag-action-item.curtir {
    color: #ff4444;
  }
  
  .ag-action-item.visualizar {
    color: #4CAF50;
  }

  /* --- BADGE DE CURTIDAS --- */
  .ag-badge {
    position: absolute;
    bottom: 2.1px;
    right: 2.8px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    font-size: 6.3px;
    padding: 1.4px 3.5px;
    border-radius: 7px;
    font-weight: 600;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   SISTEMA DE TOAST
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

function getFilter(){ return load(CONFIG.KEYS.FILTER, 'todos'); }
function setFilter(f){ save(CONFIG.KEYS.FILTER, f); renderDrawer(); }

// Encontra ITEM ou CATEGORIA PAI pelo ID
function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return { id: sec.id, label: sec.sessao, genero: sec.genero };
    const item = sec.itens.find(i => i.id === id);
    if(item) return item;
  }
  return null;
}

// Atualiza estatísticas no Firebase
async function updateStats(id, type = 'visualizacao') {
  try {
    const docRef = doc(db, CONFIG.FIREBASE.COLLECTION, id);
    const updateData = {};
    updateData[type] = increment(1);
    updateData['ultima_atualizacao'] = new Date();
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
  }
}

function track(id){
  if(getMode() !== 'dynamic') return;
  const stats = load(CONFIG.KEYS.STATS, {});
  stats[id] = (stats[id] || 0) + 1;
  save(CONFIG.KEYS.STATS, stats);
  
  const order = getOrder();
  order.sort((a,b) => (stats[b]||0) - (stats[a]||0));
  save(CONFIG.KEYS.ORDER, order);
  
  // Atualizar visualizações no Firebase
  updateStats(id, 'visualizacoes');
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
    btn.dataset.id = id;
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
   GAVETA (DRAWER)
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
  const currentFilter = getFilter();

  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;
  const hamburgerIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          <button class="ag-hamburger-btn" id="btn-generos">${hamburgerIcon}</button>
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar..." value="${filterText}">
        </div>
        
        <div class="ag-mode-group">
          <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}">Fixo</button>
          <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}">Automático</button>
        </div>
      </div>

      <div class="ag-filters-container">
        <button class="ag-filter-btn ${currentFilter==='todos'?'active':''}" data-filter="todos">Todos</button>
        <button class="ag-filter-btn ${currentFilter==='anime'?'active':''}" data-filter="anime">Anime</button>
        <button class="ag-filter-btn ${currentFilter==='notícias'?'active':''}" data-filter="notícias">Notícias</button>
        <button class="ag-filter-btn ${currentFilter==='trending'?'active':''}" data-filter="trending">Trending</button>
        <button class="ag-filter-btn ${currentFilter==='exclusivo'?'active':''}" data-filter="exclusivo">Exclusivo</button>
        <button class="ag-filter-btn ${currentFilter==='urgente'?'active':''}" data-filter="urgente">Urgente</button>
        <button class="ag-filter-btn ${currentFilter==='popular'?'active':''}" data-filter="popular">Popular</button>
        <button class="ag-filter-btn ${currentFilter==='editorial'?'active':''}" data-filter="editorial">Editorial</button>
      </div>

      <div id="ag-catalog-container"></div>
      
      <div style="text-align:center; padding-top:20px; font-size:12px; color:#888;">
        ${currentOrder.length} de ${CONFIG.MAX_TABS} abas ativas
      </div>
    </div>
    
    <!-- Menu de Gêneros -->
    <div class="ag-genres-menu" id="menu-generos">
      ${GENEROS.map(g => `<div class="ag-genre-item" data-genero="${g.id}">${g.icon} ${g.label}</div>`).join('')}
    </div>
  `;

  drawer.innerHTML = html;

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    // Aplicar filtro de gênero
    if(currentFilter !== 'todos' && sec.genero !== currentFilter) return;
    
    // Filtragem
    const itensFiltrados = sec.itens.filter(i => {
      if(currentFilter !== 'todos' && i.genero !== currentFilter) return false;
      return i.label.toLowerCase().includes(term);
    });
    const sessaoMatch = sec.sessao.toLowerCase().includes(term);

    if(term !== "" && !sessaoMatch && itensFiltrados.length === 0) return;
    const itensParaMostrar = sessaoMatch ? sec.itens : itensFiltrados;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    // VERIFICA SE A CATEGORIA PAI JÁ ESTÁ SELECIONADA
    const isCatSelected = currentOrder.includes(sec.id);
    let catIcon = '';
    if(isCatSelected) {
       catIcon = currentMode === 'dynamic' ? ' <span style="font-size:10px; opacity:0.6; margin-left:5px">✕</span>' : ' <span style="font-size:10px; opacity:0.6; margin-left:5px">•••</span>';
    }

    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}${catIcon}</span>
      </button>
      <div class="ag-grid-container"></div>
    `;
    
    // Evento de clique no título da seção (Pai)
    sectionDiv.querySelector('.ag-section-header-btn').onclick = (e) => {
        if(isCatSelected && currentMode === 'fixed') {
             handleAction(sec.id, sec.sessao);
        } else {
             toggleItem(sec.id, sec.sessao, true); // true = auto-click
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
        actionIcon = currentMode === 'dynamic' ? '✕' : '⋮';
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
        toggleItem(item.id, item.label, true); // true = auto-click
      };

      grid.appendChild(card);
    });
  });

  // Eventos
  document.getElementById('ag-search-input').oninput = (e) => {
    // Não re-renderizar completamente, apenas filtrar
    const value = e.target.value;
    renderDrawer(value);
  };
  
  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
  
  // Filtros
  document.querySelectorAll('.ag-filter-btn').forEach(btn => {
    btn.onclick = () => {
      const filter = btn.dataset.filter;
      setFilter(filter);
      document.querySelectorAll('.ag-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });
  
  // Botão hambúrguer de gêneros
  const btnGeneros = document.getElementById('btn-generos');
  const menuGeneros = document.getElementById('menu-generos');
  
  btnGeneros.onclick = (e) => {
    e.stopPropagation();
    menuGeneros.style.display = menuGeneros.style.display === 'block' ? 'none' : 'block';
  };
  
  // Clicar fora fecha o menu
  document.addEventListener('click', (e) => {
    if(!btnGeneros.contains(e.target) && !menuGeneros.contains(e.target)) {
      menuGeneros.style.display = 'none';
    }
  });
  
  // Itens do menu de gêneros
  document.querySelectorAll('.ag-genre-item').forEach(item => {
    item.onclick = (e) => {
      const genero = e.target.dataset.genero || e.currentTarget.dataset.genero;
      setFilter(genero);
      menuGeneros.style.display = 'none';
      
      // Atualizar botões de filtro
      document.querySelectorAll('.ag-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === genero);
      });
    };
  });
}

/* ===========================
   AÇÕES & NOTIFICAÇÕES
=========================== */
function toggleItem(id, label, autoClick = false){
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
  
  // Se for auto-click, simular clique na aba recém-adicionada
  if(autoClick && order.includes(id)) {
    setTimeout(() => {
      const btn = document.querySelector(`#filterScroller .filter-tag[data-id="${id}"]`);
      if(btn) {
        btn.click();
        // Fechar o drawer suavemente
        setTimeout(() => {
          document.getElementById('ag-drawer').classList.remove('open');
        }, 300);
      }
    }, 100);
  }
  
  // Atualizar visualmente sem perder estado do input
  const currentSearch = document.getElementById('ag-search-input')?.value || '';
  renderDrawer(currentSearch);
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    showToast(`Removido: <b>${label}</b>`);
    renderBar();
    const currentSearch = document.getElementById('ag-search-input')?.value || '';
    renderDrawer(currentSearch);
  } else {
    // Modo Fixo: Prompt para posição
    const currentIndex = order.indexOf(id);
    const newPos = prompt(`Mover "${label}" para qual posição? (1-${order.length})`, currentIndex + 1);
    
    if(newPos !== null){
      const targetIndex = parseInt(newPos) - 1;
      if(!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < order.length) {
        order.splice(currentIndex, 1);
        order.splice(targetIndex, 0, id);
        save(CONFIG.KEYS.ORDER, order);
        renderBar();
        const currentSearch = document.getElementById('ag-search-input')?.value || '';
        renderDrawer(currentSearch);
        showToast(`<b>${label}</b> movido para posição ${newPos}`);
      }
    }
  }
}

/* ===========================
   INICIALIZAÇÃO FIREBASE
=========================== */
async function initFirebaseStats() {
  try {
    const abasCollection = collection(db, CONFIG.FIREBASE.COLLECTION);
    onSnapshot(abasCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if(change.type === 'added' || change.type === 'modified') {
          const data = change.doc.data();
          console.log(`Abas atualizadas: ${change.doc.id}`, data);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
  }
}

/* Inicialização */
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderBar();
    initFirebaseStats();
  });
} else {
  renderBar();
  initFirebaseStats();
}

})();
