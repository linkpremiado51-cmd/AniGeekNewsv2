/* ======================================================
   AniGeekNews – Enterprise Section System v8
   • Títulos de Sessão Clicáveis (Categorias Pai)
   • Notificações Toast Profissionais (Sem Alert)
   • Controle de Foco (Teclado não abre sozinho)
   • Design Harmônico
   • Integração com Firebase
   • Filtro por Gênero
====================================================== */

(function(){

// Importação do Firebase
const firebaseScript = document.createElement('script');
firebaseScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
firebaseScript.onload = () => {
  const firestoreScript = document.createElement('script');
  firestoreScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  firestoreScript.onload = initFirebase;
  document.head.appendChild(firestoreScript);
};
document.head.appendChild(firebaseScript);

const firebaseConfig = {
  apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
  authDomain: "anigeeknews.firebaseapp.com",
  projectId: "anigeeknews",
  storageBucket: "anigeeknews.firebasestorage.app",
  messagingSenderId: "769322939926",
  appId: "1:769322939926:web:6eb91a96a3f74670882737",
  measurementId: "G-G5T8CCRGZT"
};

let app, db;
window.noticiasFirebase = [];
let linkProcessado = false;

function initFirebase() {
  app = firebase.initializeApp(firebaseConfig);
  db = firebase.firestore(app);
  setupFirebaseListeners();
}

function setupFirebaseListeners() {
  const abasRef = collection(db, 'abas');
  onSnapshot(abasRef, (snapshot) => {
    window.noticiasFirebase = snapshot.docs.map(doc => doc.data());
    updateStatsFromFirebase();
  });
}

function updateStatsFromFirebase() {
  // Atualiza as estatísticas locais com base nos dados do Firebase
  const stats = load(CONFIG.KEYS.STATS, {});
  window.noticiasFirebase.forEach(aba => {
    if (aba.id) {
      stats[aba.id] = (stats[aba.id] || 0) + (aba.curtidas || 0) + (aba.visualizacoes || 0);
    }
  });
  save(CONFIG.KEYS.STATS, stats);
}

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v8_order',
    MODE:  'ag_v8_mode',
    STATS: 'ag_v8_stats',
    GENRES: 'ag_v8_genres'
  },
  GENRES: [
    { id: 'acao', label: 'Ação' },
    { id: 'aventura', label: 'Aventura' },
    { id: 'comedia', label: 'Comédia' },
    { id: 'drama', label: 'Drama' },
    { id: 'fantasia', label: 'Fantasia' },
    { id: 'ficcao_cientifica', label: 'Ficção Científica' },
    { id: 'romance', label: 'Romance' },
    { id: 'suspense', label: 'Suspense' },
    { id: 'terror', label: 'Terror' },
  ]
};

/* ===========================
   BANCO DE DADOS (COM IDs NAS SESSÕES)
=========================== */
const CATALOGO = [
  {
    sessao: "MANCHETES",
    id: 'manchetes',
    cor: "#FF4500",
    generos: ['noticias'],
    itens: [
      { id: 'destaques', label: 'Destaques do Dia', generos: ['noticias'] },
      { id: 'ultimas', label: 'Últimas Notícias', generos: ['noticias'] },
      { id: 'trending', label: 'Trending / Em Alta', generos: ['noticias'] },
      { id: 'exclusivos', label: 'Exclusivos', generos: ['noticias'] },
      { id: 'urgente', label: 'Urgente', generos: ['noticias'] },
      { id: 'maislidas', label: 'Mais Lidas', generos: ['noticias'] },
      { id: 'editorpick', label: 'Editor’s Pick', generos: ['noticias'] }
    ]
  },
  {
    sessao: "Saihate no Paladin 1 temporada",
    id: 'saihate_no_paladin',
    cor: "#8A2BE2",
    generos: ['fantasia', 'aventura'],
    itens: []
  },
  {
    sessao: "Solo Leveling 1 temporada",
    id: 'solo_leveling',
    cor: "#0f172a",
    generos: ['acao', 'aventura', 'fantasia'],
    itens: []
  },
  {
    sessao: "Jujutsu Kaisen 1 temporada",
    id: 'jujutsu_kaisen',
    cor: "#7c0a02",
    generos: ['acao', 'suspense', 'terror'],
    itens: []
  },
  {
    sessao: "Attack on Titan 1 temporada",
    id: 'attack_on_titan',
    cor: "#3b3b3b",
    generos: ['acao', 'drama', 'ficcao_cientifica'],
    itens: []
  },
  {
    sessao: "Demon Slayer 1 temporada",
    id: 'demon_slayer',
    cor: "#1f2937",
    generos: ['acao', 'aventura', 'fantasia'],
    itens: []
  },
  {
    sessao: "Chainsaw Man 1 temporada",
    id: 'chainsaw_man',
    cor: "#991b1b",
    generos: ['acao', 'comedia', 'terror'],
    itens: []
  },
  {
    sessao: "Mais Curtidos",
    id: 'mais_curtidos',
    cor: "#FFD700",
    generos: ['top'],
    itens: []
  },
  {
    sessao: "Mais Visualizados",
    id: 'mais_visualizados',
    cor: "#00BFFF",
    generos: ['top'],
    itens: []
  },
  {
    sessao: "Top Semanal",
    id: 'top_semanal',
    cor: "#32CD32",
    generos: ['top'],
    itens: []
  },
  {
    sessao: "Top Mensal",
    id: 'top_mensal',
    cor: "#FF6347",
    generos: ['top'],
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

  /* --- HEADER: PESQUISA, MODOS E GÊNEROS --- */
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

  .ag-genre-filter-btn {
    background: transparent;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 7px;
    position: relative;
  }

  .ag-genre-filter-btn::before,
  .ag-genre-filter-btn::after,
  .ag-genre-filter-btn span {
    content: '';
    position: absolute;
    width: 18px;
    height: 2px;
    background: #555;
    border-radius: 1px;
    transition: all 0.3s;
  }

  .ag-genre-filter-btn::before { top: 8px; }
  .ag-genre-filter-btn::after { top: 16px; }
  .ag-genre-filter-btn span { top: 24px; }

  body.dark-mode .ag-genre-filter-btn::before,
  body.dark-mode .ag-genre-filter-btn::after,
  body.dark-mode .ag-genre-filter-btn span {
    background: #ccc;
  }

  .ag-genre-panel {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    max-width: 300px;
    background: #fff;
    border-radius: 7px;
    box-shadow: 0 7px 21px rgba(0,0,0,0.15);
    padding: 14px;
    z-index: 1001;
    display: none;
    flex-direction: column;
    gap: 7px;
  }

  body.dark-mode .ag-genre-panel {
    background: #252525;
    box-shadow: 0 7px 21px rgba(0,0,0,0.4);
  }

  .ag-genre-panel.open {
    display: flex;
  }

  .ag-genre-item {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5.6px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 9.8px;
  }

  .ag-genre-item:hover {
    background: rgba(0,0,0,0.05);
  }

  body.dark-mode .ag-genre-item:hover {
    background: rgba(255,255,255,0.05);
  }

  .ag-genre-checkbox {
    width: 14px;
    height: 14px;
    border: 1px solid #999;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
  }

  body.dark-mode .ag-genre-checkbox {
    border-color: #666;
  }

  .ag-genre-checkbox.checked {
    background: #e50914;
    border-color: #e50914;
    color: #fff;
  }

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

  .ag-card-options {
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    padding: 7px;
    display: none;
    z-index: 100;
    font-size: 8px;
    min-width: 100px;
  }

  body.dark-mode .ag-card-options {
    background: #252525;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
  }

  .ag-card-options.open {
    display: block;
  }

  .ag-card-option {
    padding: 3.5px 7px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .ag-card-option:hover {
    background: rgba(0,0,0,0.05);
    border-radius: 3px;
  }

  body.dark-mode .ag-card-option:hover {
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

function getSelectedGenres() {
  return load(CONFIG.KEYS.GENRES, []);
}

function setSelectedGenres(genres) {
  save(CONFIG.KEYS.GENRES, genres);
}

function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return { id: sec.id, label: sec.sessao, generos: sec.generos };
    const item = sec.itens.find(i => i.id === id);
    if(item) return item;
  }
  return null;
}

function track(id, action = 'view'){
  if(getMode() !== 'dynamic') return;

  const stats = load(CONFIG.KEYS.STATS, {});
  if(action === 'like') {
    stats[`${id}_likes`] = (stats[`${id}_likes`] || 0) + 1;
  } else {
    stats[`${id}_views`] = (stats[`${id}_views`] || 0) + 1;
  }

  // Atualiza no Firebase
  if(db) {
    const abasRef = collection(db, 'abas');
    const docRef = doc(abasRef, id);
    getDoc(docRef).then(docSnap => {
      if(docSnap.exists()) {
        updateDoc(docRef, {
          [action === 'like' ? 'curtidas' : 'visualizacoes']: increment(1)
        });
      } else {
        setDoc(docRef, {
          id,
          [action === 'like' ? 'curtidas' : 'visualizacoes']: 1
        });
      }
    });
  }

  save(CONFIG.KEYS.STATS, stats);
  updateTopTabs();
}

function updateTopTabs() {
  const stats = load(CONFIG.KEYS.STATS, {});
  const order = getOrder();

  // Mais Curtidos
  const maisCurtidos = Object.entries(stats)
    .filter(([key]) => key.endsWith('_likes'))
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.replace('_likes', ''))
    .slice(0, 5);

  // Mais Visualizados
  const maisVisualizados = Object.entries(stats)
    .filter(([key]) => key.endsWith('_views'))
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.replace('_views', ''))
    .slice(0, 5);

  // Atualiza CATALOGO
  const manchetes = CATALOGO.find(c => c.id === 'mais_curtidos');
  if(manchetes) {
    manchetes.itens = maisCurtidos.map(id => ({ id, label: findItem(id)?.label || id }));
  }

  const visualizados = CATALOGO.find(c => c.id === 'mais_visualizados');
  if(visualizados) {
    visualizados.itens = maisVisualizados.map(id => ({ id, label: findItem(id)?.label || id }));
  }

  // Atualiza Top Semanal e Mensal (simplificado)
  const topSemanal = [...maisCurtidos, ...maisVisualizados].slice(0, 5);
  const topMensal = [...maisCurtidos, ...maisVisualizados].slice(0, 10);

  const semanal = CATALOGO.find(c => c.id === 'top_semanal');
  if(semanal) {
    semanal.itens = topSemanal.map(id => ({ id, label: findItem(id)?.label || id }));
  }

  const mensal = CATALOGO.find(c => c.id === 'top_mensal');
  if(mensal) {
    mensal.itens = topMensal.map(id => ({ id, label: findItem(id)?.label || id }));
  }
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
      track(id, 'view');
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

function toggleGenrePanel() {
  const panel = document.querySelector('.ag-genre-panel');
  if(panel) {
    panel.classList.toggle('open');
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();
  const selectedGenres = getSelectedGenres();

  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

  let genrePanelHTML = `
    <div class="ag-genre-panel">
      ${CONFIG.GENRES.map(genre => `
        <div class="ag-genre-item" data-genre-id="${genre.id}">
          <div class="ag-genre-checkbox ${selectedGenres.includes(genre.id) ? 'checked' : ''}"></div>
          <span>${genre.label}</span>
        </div>
      `).join('')}
    </div>
  `;

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar..." value="${filterText}">
        </div>

        <button class="ag-genre-filter-btn" id="ag-genre-filter-btn">☰</button>

        <div class="ag-mode-group">
          <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}">Fixo</button>
          <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}">Automático</button>
        </div>
        ${genrePanelHTML}
      </div>

      <div id="ag-catalog-container"></div>

      <div style="text-align:center; padding-top:20px; font-size:12px; color:#888;">
        ${currentOrder.length} de ${CONFIG.MAX_TABS} abas ativas
      </div>
    </div>
  `;

  drawer.innerHTML = html;

  // Adiciona evento para o botão de gênero
  document.getElementById('ag-genre-filter-btn').onclick = toggleGenrePanel;

  // Adiciona eventos para os checkboxes de gênero
  document.querySelectorAll('.ag-genre-item').forEach(item => {
    item.onclick = () => {
      const genreId = item.dataset.genreId;
      const checkbox = item.querySelector('.ag-genre-checkbox');
      let genres = getSelectedGenres();

      if(genres.includes(genreId)) {
        genres = genres.filter(g => g !== genreId);
        checkbox.classList.remove('checked');
      } else {
        genres.push(genreId);
        checkbox.classList.add('checked');
      }

      setSelectedGenres(genres);
      filterDrawer(document.getElementById('ag-search-input').value);
    };
  });

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    // Filtragem por gênero
    const hasGenreMatch = selectedGenres.length === 0 ||
      selectedGenres.some(genre => sec.generos && sec.generos.includes(genre)) ||
      (sec.itens && sec.itens.some(item =>
        selectedGenres.some(genre => item.generos && item.generos.includes(genre))
      ));

    if(!hasGenreMatch) return;

    // Filtragem por texto
    const itensFiltrados = sec.itens.filter(i =>
      i.label.toLowerCase().includes(term) ||
      (i.generos && i.generos.some(g => g.toLowerCase().includes(term)))
    );
    const sessaoMatch = sec.sessao.toLowerCase().includes(term) ||
      (sec.generos && sec.generos.some(g => g.toLowerCase().includes(term)));

    if(term !== "" && !sessaoMatch && itensFiltrados.length === 0) return;
    const itensParaMostrar = sessaoMatch ? sec.itens : itensFiltrados;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    const isCatSelected = currentOrder.includes(sec.id);
    let catIcon = '';
    if(isCatSelected) {
       catIcon = currentMode === 'dynamic' ?
         ' <span style="font-size:10px; opacity:0.6; margin-left:5px">✕</span>' :
         ' <span style="font-size:10px; opacity:0.6; margin-left:5px">•••</span>';
    }

    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}${catIcon}</span>
      </button>
      <div class="ag-grid-container"></div>
    `;

    sectionDiv.querySelector('.ag-section-header-btn').onclick = (e) => {
      if(isCatSelected && currentMode === 'fixed') {
        handleAction(sec.id, sec.sessao);
      } else {
        toggleItem(sec.id, sec.sessao, true);
      }
    };

    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

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
        <div class="ag-card-options">
          <div class="ag-card-option" data-action="like">👍 Curtir</div>
          <div class="ag-card-option" data-action="view">👁 Visualizar</div>
        </div>
      `;

      card.onclick = (e) => {
        if(e.target.dataset.action || e.target.parentNode.dataset.action) {
          e.stopPropagation();
          const action = e.target.dataset.action || e.target.parentNode.dataset.action;
          const optionElement = e.target.closest('.ag-card-option');
          if(optionElement) {
            const actionType = optionElement.dataset.action;
            const cardId = card.querySelector('[data-id]')?.dataset.id || item.id;
            track(cardId, actionType);
            if(actionType === 'like') {
              showToast(`Você curtiu: <b>${item.label}</b>`, 'success');
            }
            document.querySelector('.ag-card-options.open')?.classList.remove('open');
            return;
          }
          handleAction(item.id, item.label);
          return;
        }

        if(isSelected) {
          if(window.carregarSecao) window.carregarSecao(item.id);
          else console.log("Carregando:", item.id);
        } else {
          toggleItem(item.id, item.label, true);
        }
      };

      // Evento para abrir opções
      const actionElement = card.querySelector('[data-action="true"]');
      if(actionElement) {
        actionElement.onclick = (e) => {
          e.stopPropagation();
          const options = card.querySelector('.ag-card-options');
          if(options) {
            options.classList.toggle('open');
          }
        };
      }

      grid.appendChild(card);
    });
  });

  // Filtro de pesquisa
  const searchInput = document.getElementById('ag-search-input');
  searchInput.oninput = (e) => filterDrawer(e.target.value);

  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
}

function filterDrawer(term) {
  const termLower = term.toLowerCase();
  const selectedGenres = getSelectedGenres();
  const currentOrder = getOrder();
  const currentMode = getMode();

  document.querySelectorAll('.ag-section-block').forEach(block => {
    const catId = block.querySelector('.ag-section-header-btn').dataset.catId;
    const cat = CATALOGO.find(c => c.id === catId);
    if(!cat) return;

    // Filtro por gênero
    const hasGenreMatch = selectedGenres.length === 0 ||
      selectedGenres.some(genre => cat.generos && cat.generos.includes(genre)) ||
      (cat.itens && cat.itens.some(item =>
        selectedGenres.some(genre => item.generos && item.generos.includes(genre))
      ));

    if(!hasGenreMatch) {
      block.style.display = 'none';
      return;
    }

    // Filtro por texto
    const sessaoMatch = cat.sessao.toLowerCase().includes(termLower) ||
      (cat.generos && cat.generos.some(g => g.toLowerCase().includes(termLower)));

    const grid = block.querySelector('.ag-grid-container');
    if(grid) {
      grid.querySelectorAll('.ag-card').forEach(card => {
        const label = card.textContent.trim();
        const itemId = card.querySelector('[data-id]')?.dataset.id;
        const item = cat.itens.find(i => i.id === itemId);

        const itemMatch = label.toLowerCase().includes(termLower) ||
          (item?.generos && item.generos.some(g => g.toLowerCase().includes(termLower)));

        if(sessaoMatch || itemMatch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    block.style.display = sessaoMatch || grid.querySelector('.ag-card:not([style*="display: none"])') ? '' : 'none';
  });
}

/* ===========================
   AÇÕES & NOTIFICAÇÕES
=========================== */
function toggleItem(id, label, autoClick = false){
  let order = getOrder();

  if(order.includes(id)){
    order = order.filter(x => x !== id);
    showToast(`Removido: <b>${label}</b>`, 'normal');
  } else {
    if(order.length >= CONFIG.MAX_TABS) {
      showToast(`Limite de ${CONFIG.MAX_TABS} abas atingido!`, 'error');
      return;
    }
    order.push(id);
    showToast(`Adicionado: <b>${label}</b>`, 'success');
  }

  save(CONFIG.KEYS.ORDER, order);
  renderBar();

  // Atualiza drawer sem perder o valor do input
  const searchInput = document.getElementById('ag-search-input');
  const currentValue = searchInput ? searchInput.value : '';
  renderDrawer(currentValue);
  if(searchInput) searchInput.value = currentValue;

  // Clica automaticamente na aba selecionada
  if(autoClick && order.includes(id)) {
    setTimeout(() => {
      const btn = document.querySelector(`#filterScroller .filter-tag:nth-child(${order.indexOf(id) + 1})`);
      if(btn) {
        btn.click();
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 300);
  }
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    showToast(`Removido: <b>${label}</b>`);
  } else {
    const currentIndex = order.indexOf(id);
    const newPos = prompt(`Mover "${label}" para qual posição? (1-${order.length})`, currentIndex + 1);

    if(newPos !== null){
      const targetIndex = parseInt(newPos) - 1;
      if(!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < order.length) {
        order.splice(currentIndex, 1);
        order.splice(targetIndex, 0, id);
        save(CONFIG.KEYS.ORDER, order);
        showToast(`<b>${label}</b> movido para posição ${newPos}`);
      }
    }
  }

  renderBar();
  const searchInput = document.getElementById('ag-search-input');
  const currentValue = searchInput ? searchInput.value : '';
  renderDrawer(currentValue);
  if(searchInput) searchInput.value = currentValue;
}

/* Inicialização */
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
else renderBar();

})();
