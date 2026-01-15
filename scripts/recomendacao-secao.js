/* ======================================================
   AniGeekNews – Enterprise Section System v5
   • Integração Nativa com Tema (Dark/Light)
   • Interface Executiva e Barra de Pesquisa
   • Sistema de Gaveta Inteligente
====================================================== */

(function(){

const MAX = 12;
const KEY_ORDER = 'ag_sections_order';
const KEY_MODE  = 'ag_sections_mode';
const KEY_STATS = 'ag_sections_stats';

/* ===========================
   CSS INJETADO (Estilo Executivo)
=========================== */
const styles = `
  #ag-drawer {
    background: #fff;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    max-height: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 999;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  }

  /* Suporte ao Dark Mode do seu tema.js */
  body.dark-mode #ag-drawer {
    background: #121212;
    border-bottom: 1px solid #333;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  }

  #ag-drawer.open {
    max-height: 800px;
    opacity: 1;
    padding: 25px 15px;
  }

  .ag-drawer-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Header da Gaveta: Pesquisa e Modos */
  .ag-drawer-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    border-bottom: 1px solid rgba(128,128,128,0.2);
    padding-bottom: 15px;
  }

  /* Barra de Pesquisa Estilizada */
  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 250px;
  }

  .ag-search-input {
    width: 100%;
    padding: 10px 15px 10px 35px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #f8f9fa;
    font-size: 14px;
    outline: none;
    transition: 0.3s;
  }
  
  body.dark-mode .ag-search-input {
    background: #1e1e1e;
    border-color: #333;
    color: #fff;
  }

  .ag-search-input:focus {
    border-color: var(--primary-color, #e50914);
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
  }

  .ag-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
  }

  /* Botões de Modo (Executivo) */
  .ag-mode-toggle {
    display: flex;
    background: #eee;
    padding: 4px;
    border-radius: 10px;
  }

  body.dark-mode .ag-mode-toggle { background: #222; }

  .mode-btn {
    padding: 6px 16px;
    border-radius: 7px;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    background: transparent;
    color: #666;
  }

  .mode-btn.active {
    background: #fff;
    color: #000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  body.dark-mode .mode-btn.active {
    background: #444;
    color: #fff;
  }

  /* Grid de Abas */
  .ag-tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .ag-tags-grid .filter-tag {
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }

  /* Estado desativado na gaveta */
  .ag-tags-grid .filter-tag:not(.is-selected) {
    opacity: 0.4;
    filter: grayscale(1);
    background: rgba(128,128,128,0.1);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   DATABASE DE SEÇÕES
=========================== */
const SECOES = [
  { id:'manchetes', nome:'Manchetes' },
  { id:'analises', nome:'Análises' },
  { id:'entrevistas', nome:'Entrevistas' },
  { id:'lancamentos', nome:'Lançamentos' },
  { id:'podcast', nome:'Podcast' },
  { id:'futebol', nome:'Futebol' },
  { id:'tecnologia', nome:'Tecnologia' },
  { id:'reviews', nome:'Reviews' },
  { id:'trailers', nome:'Trailers' },
  { id:'streaming', nome:'Streaming' },
  { id:'cosplay', nome:'Cosplay' },
  { id:'eventos', nome:'Eventos' },
  { id:'esports', nome:'eSports' },
  { id:'cinema', nome:'Cinema' },
  { id:'tv', nome:'TV & Séries' },
  { id:'comunidade', nome:'Comunidade' },
  { id:'ranking', nome:'Ranking' }
];

/* ===========================
   LÓGICA CORE
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

function getMode(){ return localStorage.getItem(KEY_MODE) || 'dynamic'; }
function setMode(m){ localStorage.setItem(KEY_MODE,m); renderDrawer(); }

function getOrder(){
  const saved = load(KEY_ORDER,null);
  return saved ? saved : SECOES.slice(0,7).map(s=>s.id);
}

function track(id){
  const stats = getStats();
  stats[id] = (stats[id] || 0) + 1;
  save(KEY_STATS,stats);
  if(getMode()==='dynamic') autoReorder();
}

function getStats(){ return load(KEY_STATS,{}); }

function autoReorder(){
  const stats = getStats();
  const order = getOrder();
  order.sort((a,b)=>(stats[b]||0)-(stats[a]||0));
  save(KEY_ORDER,order);
}

/* ===========================
   RENDERIZAÇÃO DA BARRA PRINCIPAL
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

  order.forEach(id=>{
    const sec = SECOES.find(s=>s.id===id);
    if(!sec) return;

    const btn = document.createElement('button');
    btn.className='filter-tag';
    btn.textContent=sec.nome;

    btn.onclick=()=>{
      document.querySelectorAll('#filterScroller .filter-tag').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      track(id);
      document.getElementById('ag-drawer').classList.remove('open');
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
   LÓGICA DA GAVETA
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

  drawer.innerHTML = `
    <div class="ag-drawer-content">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          <span class="ag-search-icon">🔍</span>
          <input type="text" class="ag-search-input" id="ag-search" placeholder="Pesquisar categoria..." value="${filterText}">
        </div>
        
        <div class="ag-mode-toggle">
          <button id="btn-fixo" class="mode-btn ${currentMode==='fixed'?'active':''}">FIXO</button>
          <button id="btn-dinamico" class="mode-btn ${currentMode==='dynamic'?'active':''}">DINÂMICO</button>
        </div>
      </div>
      
      <div class="ag-tags-grid" id="drawer-grid"></div>
      
      <div style="text-align:center; font-size:11px; opacity:0.5; margin-top:10px;">
        ${currentOrder.length} de ${MAX} abas selecionadas
      </div>
    </div>
  `;

  // Evento de Busca
  const searchInput = drawer.querySelector('#ag-search');
  searchInput.focus();
  searchInput.oninput = (e) => renderDrawerContent(e.target.value.toLowerCase());

  // Eventos de Modo
  drawer.querySelector('#btn-fixo').onclick = () => setMode('fixed');
  drawer.querySelector('#btn-dinamico').onclick = () => setMode('dynamic');

  renderDrawerContent(filterText.toLowerCase());
}

function renderDrawerContent(term){
  const grid = document.getElementById('drawer-grid');
  const currentOrder = getOrder();
  grid.innerHTML = "";

  const filtradas = SECOES.filter(s => s.nome.toLowerCase().includes(term));

  filtradas.forEach(sec => {
    const isSelected = currentOrder.includes(sec.id);
    const btn = document.createElement('button');
    btn.className = `filter-tag ${isSelected ? 'is-selected active' : ''}`;
    btn.innerHTML = isSelected ? `${sec.nome} <b>✕</b>` : sec.nome;

    btn.onclick = () => {
      let newOrder = getOrder();
      if(isSelected) {
        newOrder = newOrder.filter(id => id !== sec.id);
      } else {
        if(newOrder.length < MAX) newOrder.push(sec.id);
        else return alert("Limite de abas atingido");
      }
      save(KEY_ORDER, newOrder);
      renderBar();
      renderDrawer(document.getElementById('ag-search').value);
    };
    grid.appendChild(btn);
  });
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', renderBar);

})();
