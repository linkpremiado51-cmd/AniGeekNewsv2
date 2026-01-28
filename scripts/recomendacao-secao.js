/* ======================================================
   AniGeekNews – Enterprise Section System v8
   • Títulos de Sessão Clicáveis (Categorias Pai)
   • Notificações Toast Profissionais (Sem Alert)
   • Controle de Foco (Teclado não abre sozinho)
   • Gêneros e Filtros Inteligentes
   • Integração Firebase Completa
   • Sistema de Curtidas e Visualizações
   • Abas Inteligentes (Top Semanal/Mensal)
====================================================== */

(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v8_order',
    MODE:  'ag_v8_mode', // 'dynamic' ou 'fixed'
    STATS: 'ag_v8_stats',
    GENRES: 'ag_v8_genres',
    USER_ID: 'ag_v8_user_id'
  },
  FIREBASE: {
    COLLECTION: 'abas',
    STATS_COLLECTION: 'estatisticas'
  }
};

/* ===========================
   INICIALIZAÇÃO FIREBASE
=========================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, increment, getDoc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
window.noticiasFirebase = [];
let linkProcessado = false;

/* ===========================
   BANCO DE DADOS COM GÊNEROS
=========================== */
const CATALOGO = [
  {
    sessao: "MANCHETES",
    id: 'manchetes',
    cor: "#FF4500", 
    genero: ["Notícias", "Atualidades"],
    itens: [
      { id: 'destaques', label: 'Destaques do Dia', genero: ["Notícias"] },
      { id: 'ultimas', label: 'Últimas Notícias', genero: ["Notícias"] },
      { id: 'trending', label: 'Trending / Em Alta', genero: ["Trending"] },
      { id: 'exclusivos', label: 'Exclusivos', genero: ["Exclusivo"] },
      { id: 'urgente', label: 'Urgente', genero: ["Notícias"] },
      { id: 'maislidas', label: 'Mais Lidas', genero: ["Popular"] },
      { id: 'editorpick', label: 'Editor’s Pick', genero: ["Recomendado"] }
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
    genero: ["Ação", "Fantasia", "Isekai"],
    itens: []
  },
  {
    sessao: "Jujutsu Kaisen 1 temporada",
    id: 'jujutsu_kaisen',
    cor: "#7c0a02",
    genero: ["Ação", "Sobrenatural", "Escolar"],
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
    genero: ["Ação", "Sobrenatural", "Demônios"],
    itens: []
  }
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

  /* --- HEADER: PESQUISA, GÊNEROS E MODOS --- */
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

  /* --- PESQUISA COM BOTÃO DE GÊNEROS --- */
  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 196px;
    display: flex;
    gap: 7px;
  }

  .ag-genre-filter-btn {
    width: 35px;
    height: 35px;
    background: rgba(0,0,0,0.05);
    border: none;
    border-radius: 7px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s ease;
  }
  
  .ag-genre-filter-btn:hover {
    background: rgba(0,0,0,0.1);
    transform: scale(1.05);
  }
  
  body.dark-mode .ag-genre-filter-btn {
    background: rgba(255,255,255,0.08);
  }
  
  body.dark-mode .ag-genre-filter-btn:hover {
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
    flex: 1;
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
    cursor: pointer;
  }
  
  .ag-card-action:hover {
    background: var(--primary-color, #e50914);
    color: #fff !important;
    opacity: 1;
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

  /* --- GÊNEROS MODAL --- */
  #ag-genres-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  #ag-genres-modal.open {
    display: flex;
    opacity: 1;
  }

  .ag-genres-content {
    background: #fff;
    border-radius: 14px;
    padding: 28px;
    max-width: 560px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 14px 56px rgba(0,0,0,0.3);
  }

  body.dark-mode .ag-genres-content {
    background: #1a1a1a;
  }

  .ag-genres-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 21px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e0e0e0;
  }

  body.dark-mode .ag-genres-header {
    border-color: #333;
  }

  .ag-genres-title {
    font-size: 16.8px;
    font-weight: 900;
    color: #333;
  }

  body.dark-mode .ag-genres-title {
    color: #fff;
  }

  .ag-genres-close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
  }

  .ag-genres-close:hover {
    color: #000;
  }

  body.dark-mode .ag-genres-close:hover {
    color: #fff;
  }

  .ag-genres-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10.5px;
  }

  .ag-genre-tag {
    padding: 7px 14px;
    background: #f0f0f0;
    border-radius: 21px;
    font-size: 11.2px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
  }

  body.dark-mode .ag-genre-tag {
    background: #2a2a2a;
    color: #ccc;
  }

  .ag-genre-tag:hover {
    background: var(--primary-color, #e50914);
    color: #fff;
    transform: translateY(-2px);
  }

  .ag-genre-tag.active {
    background: var(--primary-color, #e50914);
    color: #fff;
    box-shadow: 0 3.5px 10.5px rgba(229, 9, 20, 0.3);
  }

  /* --- ABAS INTELIGENTES --- */
  .ag-smart-tabs {
    display: flex;
    gap: 7px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .ag-smart-tab {
    padding: 5.6px 11.2px;
    background: rgba(0,0,0,0.05);
    border-radius: 7px;
    font-size: 8.4px;
    font-weight: 700;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
  }

  body.dark-mode .ag-smart-tab {
    background: rgba(255,255,255,0.08);
    color: #aaa;
  }

  .ag-smart-tab.active {
    background: var(--primary-color, #e50914);
    color: #fff;
  }

  /* --- BOTÃO PROFISSIONAL FIXO --- */
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

  /* --- ESTILOS PARA CURTIDAS E VISUALIZAÇÕES --- */
  .ag-stats-badge {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 7px;
    font-weight: 600;
  }

  .ag-like-btn {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
    border: none;
  }

  .ag-like-btn:hover {
    transform: scale(1.1);
  }

  .ag-like-btn.liked {
    color: #ff4444;
    background: rgba(255,255,255,0.95);
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
   UTILITÁRIOS DE STORAGE
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

function getGenres(){ return load(CONFIG.KEYS.GENRES, []); }
function setGenres(g){ save(CONFIG.KEYS.GENRES, g); }

function getUserId(){
  let uid = load(CONFIG.KEYS.USER_ID, null);
  if(!uid){
    uid = 'user_' + Math.random().toString(36).substr(2, 9);
    save(CONFIG.KEYS.USER_ID, uid);
  }
  return uid;
}

/* ===========================
   FUNÇÕES DE BUSCA E GÊNEROS
=========================== */
function getAllGenres(){
  const genres = new Set();
  CATALOGO.forEach(sec => {
    if(sec.genero) sec.genero.forEach(g => genres.add(g));
    sec.itens.forEach(item => {
      if(item.genero) item.genero.forEach(g => genres.add(g));
    });
  });
  return Array.from(genres).sort();
}

function filterByGenre(genre){
  const results = [];
  
  CATALOGO.forEach(sec => {
    const secMatch = sec.genero && sec.genero.includes(genre);
    const itemMatches = sec.itens.filter(item => 
      item.genero && item.genero.includes(genre)
    );
    
    if(secMatch || itemMatches.length > 0){
      results.push({
        ...sec,
        itens: secMatch ? sec.itens : itemMatches
      });
    }
  });
  
  return results;
}

function searchCatalog(term){
  const results = [];
  const lowerTerm = term.toLowerCase();
  
  // Busca por nome
  CATALOGO.forEach(sec => {
    const sessaoMatch = sec.sessao.toLowerCase().includes(lowerTerm);
    const itemMatches = sec.itens.filter(item => 
      item.label.toLowerCase().includes(lowerTerm)
    );
    
    if(sessaoMatch || itemMatches.length > 0){
      results.push({
        ...sec,
        itens: sessaoMatch ? sec.itens : itemMatches
      });
    }
  });
  
  // Busca por gênero
  const genreMatches = filterByGenre(lowerTerm);
  genreMatches.forEach(match => {
    if(!results.some(r => r.id === match.id)){
      results.push(match);
    }
  });
  
  return results;
}

/* ===========================
   FIREBASE - ESTATÍSTICAS
=========================== */
async function incrementView(id){
  try {
    const docRef = doc(db, CONFIG.FIREBASE.COLLECTION, id);
    await updateDoc(docRef, {
      visualizacoes: increment(1),
      ultimaVisualizacao: Timestamp.now()
    });
  } catch(e) {
    console.error('Erro ao incrementar visualização:', e);
  }
}

async function toggleLike(id){
  const userId = getUserId();
  try {
    const docRef = doc(db, CONFIG.FIREBASE.COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if(docSnap.exists()){
      const data = docSnap.data();
      const likedBy = data.likedBy || [];
      const isLiked = likedBy.includes(userId);
      
      if(isLiked){
        // Remover curtida
        await updateDoc(docRef, {
          curtidas: increment(-1),
          likedBy: likedBy.filter(uid => uid !== userId)
        });
        return { liked: false, count: (data.curtidas || 0) - 1 };
      } else {
        // Adicionar curtida
        await updateDoc(docRef, {
          curtidas: increment(1),
          likedBy: [...likedBy, userId]
        });
        return { liked: true, count: (data.curtidas || 0) + 1 };
      }
    }
  } catch(e) {
    console.error('Erro ao toggle curtida:', e);
  }
}

async function getTopTabs(){
  try {
    const tabsSnapshot = await getDocs(collection(db, CONFIG.FIREBASE.COLLECTION));
    const tabs = tabsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
    const topCurtidas = [...tabs].sort((a,b) => (b.curtidas || 0) - (a.curtidas || 0)).slice(0, 10);
    const topVisualizadas = [...tabs].sort((a,b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 10);
    const topSemana = [...tabs].filter(t => t.ultimaVisualizacao && t.ultimaVisualizacao.toDate() > weekAgo).sort((a,b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 10);
    const topMes = [...tabs].filter(t => t.ultimaVisualizacao && t.ultimaVisualizacao.toDate() > monthAgo).sort((a,b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 10);
    
    return {
      maisCurtidas: topCurtidas,
      maisVisualizadas: topVisualizadas,
      topSemana: topSemana,
      topMes: topMes
    };
  } catch(e) {
    console.error('Erro ao buscar top tabs:', e);
    return { maisCurtidas: [], maisVisualizadas: [], topSemana: [], topMes: [] };
  }
}

/* ===========================
   LÓGICA CORE
=========================== */
function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return { id: sec.id, label: sec.sessao, genero: sec.genero };
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
      
      // Incrementar visualização no Firebase
      incrementView(id);
      
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

function toggleGenresModal(){
  const modal = document.getElementById('ag-genres-modal');
  if(!modal){
    createGenresModal();
    return;
  }
  
  modal.classList.toggle('open');
}

function createGenresModal(){
  const modal = document.createElement('div');
  modal.id = 'ag-genres-modal';
  
  const content = document.createElement('div');
  content.className = 'ag-genres-content';
  
  const header = document.createElement('div');
  header.className = 'ag-genres-header';
  
  const title = document.createElement('h3');
  title.className = 'ag-genres-title';
  title.textContent = 'Filtrar por Gênero';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ag-genres-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => modal.classList.remove('open');
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  const genresList = document.createElement('div');
  genresList.className = 'ag-genres-list';
  
  const allGenres = getAllGenres();
  allGenres.forEach(genre => {
    const tag = document.createElement('span');
    tag.className = 'ag-genre-tag';
    tag.textContent = genre;
    tag.onclick = () => {
      modal.classList.remove('open');
      applyGenreFilter(genre);
    };
    genresList.appendChild(tag);
  });
  
  content.appendChild(header);
  content.appendChild(genresList);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  modal.onclick = (e) => {
    if(e.target === modal) modal.classList.remove('open');
  };
}

function applyGenreFilter(genre){
  const filteredCatalog = filterByGenre(genre);
  renderDrawer('', filteredCatalog);
  
  // Atualizar barra com resultados do gênero
  const order = getOrder();
  const genreItems = [];
  
  filteredCatalog.forEach(sec => {
    if(!order.includes(sec.id)) genreItems.push(sec.id);
    sec.itens.forEach(item => {
      if(!order.includes(item.id)) genreItems.push(item.id);
    });
  });
  
  if(genreItems.length > 0){
    const newOrder = [...order, ...genreItems.slice(0, CONFIG.MAX_TABS - order.length)];
    save(CONFIG.KEYS.ORDER, newOrder);
    renderBar();
  }
  
  showToast(`Filtrado por: <b>${genre}</b>`, 'success');
}

function renderDrawer(filterText = "", customCatalog = null){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();
  const catalogToUse = customCatalog || CATALOGO;

  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          <button class="ag-genre-filter-btn" onclick="toggleGenresModal()">☰</button>
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar..." value="${filterText}">
        </div>
        
        <div class="ag-mode-group">
          <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}">Fixo</button>
          <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}">Automático</button>
        </div>
      </div>

      <div class="ag-smart-tabs">
        <button class="ag-smart-tab" onclick="showSmartTab('maisCurtidas')">Mais Curtidas</button>
        <button class="ag-smart-tab" onclick="showSmartTab('maisVisualizadas')">Mais Visualizadas</button>
        <button class="ag-smart-tab" onclick="showSmartTab('topSemana')">Top da Semana</button>
        <button class="ag-smart-tab" onclick="showSmartTab('topMes')">Top do Mês</button>
      </div>

      <div id="ag-catalog-container"></div>
      
      <div style="text-align:center; padding-top:20px; font-size:12px; color:#888;">
        ${currentOrder.length} de ${CONFIG.MAX_TABS} abas ativas
      </div>
    </div>
  `;

  drawer.innerHTML = html;

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  const catalogToRender = term ? searchCatalog(term) : catalogToUse;

  catalogToRender.forEach(sec => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    const isCatSelected = currentOrder.includes(sec.id);
    let catIcon = '';
    if(isCatSelected) {
       catIcon = currentMode === 'dynamic' ? ' <span style="font-size:10px; opacity:0.6; margin-left:5px">✕</span>' : ' <span style="font-size:10px; opacity:0.6; margin-left:5px">•••</span>';
    }

    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}${catIcon}</span>
        ${sec.genero ? `<span style="font-size:7px; opacity:0.6; margin-left:7px">(${sec.genero.join(', ')})</span>` : ''}
      </button>
      <div class="ag-grid-container"></div>
    `;
    
    sectionDiv.querySelector('.ag-section-header-btn').onclick = (e) => {
        if(isCatSelected && currentMode === 'fixed') {
             handleAction(sec.id, sec.sessao);
        } else {
             toggleItem(sec.id, sec.sessao);
        }
    };

    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

    sec.itens.forEach(item => {
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
        ${item.genero ? `<div style="font-size:6px; opacity:0.6; margin-top:3px">${item.genero.join(', ')}</div>` : ''}
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

  // Correção do bug do teclado - não recriar input, apenas atualizar valor
  const searchInput = document.getElementById('ag-search-input');
  if(searchInput){
    searchInput.oninput = (e) => {
      const newValue = e.target.value;
      renderDrawer(newValue, customCatalog);
    };
  }
  
  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
}

/* ===========================
   ABAS INTELIGENTES
=========================== */
async function showSmartTab(tabType){
  const topTabs = await getTopTabs();
  const tabsToShow = topTabs[tabType] || [];
  
  const smartCatalog = tabsToShow.map(tab => {
    const original = findItem(tab.id);
    return {
      sessao: original ? original.label : tab.id,
      id: tab.id,
      cor: original ? (original.cor || "#666") : "#666",
      genero: original ? original.genero : [],
      itens: [],
      stats: {
        curtidas: tab.curtidas || 0,
        visualizacoes: tab.visualizacoes || 0
      }
    };
  });
  
  renderDrawer('', smartCatalog);
  showToast(`Mostrando: <b>${tabType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</b>`, 'success');
}

/* ===========================
   AÇÕES & NOTIFICAÇÕES
=========================== */
function toggleItem(id, label){
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
  renderDrawer(document.getElementById('ag-search-input')?.value || '');
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    showToast(`Removido: <b>${label}</b>`);
    renderBar();
    renderDrawer(document.getElementById('ag-search-input')?.value || '');
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
        renderDrawer(document.getElementById('ag-search-input')?.value || '');
        showToast(`<b>${label}</b> movido para posição ${newPos}`);
      }
    }
  }
}

/* Inicialização */
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
else renderBar();

// Expor funções globais
window.toggleGenresModal = toggleGenresModal;
window.showSmartTab = showSmartTab;

})();
