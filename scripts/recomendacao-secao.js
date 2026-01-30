/* ======================================================
   AniGeekNews – Enterprise Section System v8.0 (Refined)
   • Barra de Pesquisa e Botões acima das Abas (Fixo)
   • Capa Personalizada no Menu
   • Efeitos Visuais Aprimorados (Fade Only)
   • Correção de Layout na Pesquisa
   • Sem Auto-Focus ou Auto-Click
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
   CSS INJETADO
=========================== */
const styles = `
  /* --- LAYOUT GLOBAL --- */
  #ag-main-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-bottom: 10px;
    position: relative;
  }

  /* --- CABEÇALHO ESTÁTICO (Barra e Botões acima das abas) --- */
  #ag-static-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    cursor: pointer; /* Indica que é clicável para abrir o menu */
  }

  .ag-fake-search {
    flex: 1;
    background: rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 7px;
    padding: 8px 12px;
    font-size: 10px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: none; /* O clique passa para o container pai */
  }

  body.dark-mode .ag-fake-search {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    color: #aaa;
  }

  .ag-fake-buttons {
    display: flex;
    gap: 4px;
    background: rgba(0,0,0,0.05);
    padding: 3px;
    border-radius: 7px;
    pointer-events: none;
  }
  
  body.dark-mode .ag-fake-buttons { background: rgba(255,255,255,0.08); }

  .ag-fake-btn {
    padding: 5px 10px;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    color: #888;
    border-radius: 5px;
  }
  
  .ag-fake-btn.active {
    background: #fff;
    color: #000;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  body.dark-mode .ag-fake-btn.active { background: #333; color: #fff; }

  /* --- GAVETA (DRAWER) --- */
  #ag-drawer {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    max-height: 0;
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
    width: 100%;
    position: absolute;
    top: 50px; /* Ajuste para aparecer logo abaixo do header estático */
    left: 0;
    z-index: 1000;
    box-shadow: 0 10.5px 21px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
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

   /* IMAGEM DO PERSONAGEM (IMOVEL, APENAS FADE) */
  .ag-char-fixed {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 90%;
    width: auto;
    max-width: 45vw;
    object-fit: contain;
    object-position: bottom right;
    pointer-events: none;
    z-index: 0; /* Atrás do conteúdo */
    opacity: 0;
    transition: opacity 0.5s ease-in-out; /* Apenas opacidade, sem movimento */
  }

  #ag-drawer.open .ag-char-fixed {
    opacity: 1;
  }

  /* CAPA DO MENU DA ENGRENAGEM */
  .ag-drawer-cover {
    width: 100%;
    height: 120px; /* Altura da capa */
    background-image: url('https://i.postimg.cc/HWM72wfT/the-pensive-journey-by-chcofficial-dhme17e-pre.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    margin-bottom: 20px;
    border-radius: 0 0 10px 10px;
    flex-shrink: 0;
  }
  
  /* Gradiente para a capa não cortar seco */
  .ag-drawer-cover::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: linear-gradient(to bottom, transparent, #ffffff);
  }
  body.dark-mode .ag-drawer-cover::after {
    background: linear-gradient(to bottom, transparent, #141414);
  }

  /* HEADER DENTRO DA GAVETA (Funcional) */
  .ag-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 0 14px 14px 14px;
    position: relative;
    z-index: 10;
    /* Movemos para cima da capa visualmente se desejar, mas aqui vamos deixar abaixo da capa conforme "onde estavam antes" */
    margin-top: -30px; /* Sobe um pouco para sobrepor o final da capa */
  }

  .ag-drawer-scroll {
    position: relative;
    z-index: 5;
    overflow-y: auto;
    padding: 0 14px 21px 14px;
    scrollbar-width: thin;
    /* IMPORTANTE: Altura mínima para evitar que o container suba com poucos resultados */
    min-height: 50vh; 
  }

  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 196px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1); /* Destaque sobre a capa */
    border-radius: 7px;
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
    background: #fff; /* Fundo sólido para não misturar com a capa */
    font-size: 9.8px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
  }

  body.dark-mode .ag-search-input {
    background: #252525;
    border-color: rgba(255,255,255,0.1);
    color: #fff;
  }

  .ag-search-input:focus {
    border-color: var(--primary-color, #e50914);
  }

  /* BOTÕES DE MODO DENTRO DO DRAWER */
  .ag-mode-group {
    background: #fff;
    padding: 2.8px;
    border-radius: 7px;
    display: flex;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  body.dark-mode .ag-mode-group { background: #252525; }

  .ag-mode-btn {
    padding: 5.6px 11.2px;
    border: none;
    background: transparent;
    border-radius: 4.9px;
    font-size: 7.7px; font-weight: 800;
    color: #888;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .ag-mode-btn.active {
    background: #eee;
    color: #000;
  }
  body.dark-mode .ag-mode-btn.active {
    background: #444;
    color: #fff;
  }

  /* --- SESSÕES E CARDS --- */
  .ag-section-block {
    margin-bottom: 24.5px;
    position: relative;
    z-index: 2; /* Acima da imagem do personagem */
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

  .ag-section-header-btn:hover { opacity: 0.7; }

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

  /* --- TOAST --- */
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

  /* --- ABAS (FILTERS) --- */
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

  .filter-tag {
    white-space: nowrap;
    /* Estilos base das abas (presumindo que o site já tenha, se não, adicione aqui) */
  }

  .filter-tag.cfg-btn {
    /* Escondido pois agora temos o header estático, mas mantido no DOM se necessário lógica */
    display: none !important; 
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
function setMode(m){ save(CONFIG.KEYS.MODE, m); renderDrawer(); renderStaticHeader(); }

function getOrder(){
  const saved = load(CONFIG.KEYS.ORDER, null);
  if(saved) return saved;
  return ['manchetes', 'destaques', 'ultimas'];
}

function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return sec;
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
   RENDERIZAÇÃO DA INTERFACE
=========================== */

function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;

  // Criar Wrapper Principal se não existir para organizar StaticHeader acima das abas
  let mainWrapper = document.getElementById('ag-main-wrapper');
  if(!mainWrapper) {
    mainWrapper = document.createElement('div');
    mainWrapper.id = 'ag-main-wrapper';
    bar.parentNode.insertBefore(mainWrapper, bar);
    mainWrapper.appendChild(bar); // Move as abas para dentro
  }

  // Criar Header Estático (Barra e Botões acima das abas)
  let staticHeader = document.getElementById('ag-static-header');
  if(!staticHeader) {
    staticHeader = document.createElement('div');
    staticHeader.id = 'ag-static-header';
    mainWrapper.insertBefore(staticHeader, bar); // Insere antes das abas
    
    // Clique no header estático abre o menu
    staticHeader.onclick = toggleDrawer;
  }

  renderStaticHeader();

  // Criar Drawer (Menu Oculto)
  let drawer = document.getElementById('ag-drawer');
  if(!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'ag-drawer';
    // O drawer fica dentro do wrapper, logo após o scroller
    mainWrapper.appendChild(drawer);
  }

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
      track(id);
      document.getElementById('ag-drawer').classList.remove('open');

      const url = new URL(window.location);
      url.searchParams.set('secao', id);
      window.history.replaceState({}, '', url);

      if(window.carregarSecao) window.carregarSecao(id);
      else console.log("Carregando:", id);
    };
    bar.appendChild(btn);
  });
}

function renderStaticHeader() {
    const staticHeader = document.getElementById('ag-static-header');
    const currentMode = getMode();
    const searchIcon = `<svg style="width:10px;height:10px;fill:#888" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

    staticHeader.innerHTML = `
        <div class="ag-fake-search">
            ${searchIcon}
            <span>Pesquisar categorias...</span>
        </div>
        <div class="ag-fake-buttons">
            <div class="ag-fake-btn ${currentMode==='fixed'?'active':''}">Fixo</div>
            <div class="ag-fake-btn ${currentMode==='dynamic'?'active':''}">Auto</div>
        </div>
    `;
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
    // Renderiza sem focar no input (previne teclado)
    renderDrawer();
    drawer.classList.add('open');
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();
  
  // Imagem do personagem (Imóvel, fade apenas)
  const charImg = `<img src="https://i.postimg.cc/W49RX3dK/anime-boy-render-04-by-luxio56lavi-d5xed2a.png" class="ag-char-fixed" alt="Anime Character">`;
  
  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

  let html = `
    ${charImg}
    <div class="ag-drawer-cover"></div>
    <div class="ag-drawer-header">
      <div class="ag-search-wrapper">
        ${searchIcon}
        <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar..." value="${filterText}" autocomplete="off">
      </div>

      <div class="ag-mode-group">
        <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}">Fixo</button>
        <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}">Auto</button>
      </div>
    </div>

    <div class="ag-drawer-scroll">
      <div id="ag-catalog-container"></div>
      
      <div style="text-align:center; padding-top:20px; font-size:12px; color:#888;">
        ${currentOrder.length} de ${CONFIG.MAX_TABS} abas ativas
      </div>
    </div>
  `;

  drawer.innerHTML = html;

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
    // Removemos a imagem do lado da categoria (X ou ...) conforme pedido
    
    sectionDiv.innerHTML = `
      <button class="ag-section-header-btn ${isCatSelected ? 'is-active' : ''}" data-cat-id="${sec.id}">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        <span class="ag-section-text">${sec.sessao}</span>
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

  const searchInput = document.getElementById('ag-search-input');
  
  // Garantia: NÃO foca automaticamente para o teclado não abrir
  // searchInput.focus(); REMOVIDO
  
  searchInput.oninput = (e) => {
    filterDrawer(e.target.value);
  };

  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
}

function filterDrawer(term) {
  const termLower = term.toLowerCase();
  document.querySelectorAll('.ag-section-block').forEach(block => {
    const catId = block.querySelector('.ag-section-header-btn').dataset.catId;
    const cat = CATALOGO.find(c => c.id === catId);
    if (!cat) return;

    const sessaoMatch = cat.sessao.toLowerCase().includes(termLower);
    const itensFiltrados = cat.itens.filter(i => i.label.toLowerCase().includes(termLower));
    const grid = block.querySelector('.ag-grid-container');

    if (termLower !== "" && !sessaoMatch && itensFiltrados.length === 0) {
      block.style.display = 'none';
      return;
    }
    block.style.display = '';

    grid.querySelectorAll('.ag-card').forEach(card => {
      const label = card.textContent.trim();
      if (label.toLowerCase().includes(termLower) || sessaoMatch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
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
  
  // Atualiza o Drawer visualmente para mostrar a seleção
  const currentInput = document.getElementById('ag-search-input');
  const term = currentInput ? currentInput.value : '';
  renderDrawer(term); 
  
  // REMOVIDO: Clique automático no botão real
  // O usuário pediu "Retirada da funcionalidade em que o usuário adicina a categoria e ela já é clicada"
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    showToast(`Removido: <b>${label}</b>`);
    renderBar();
    const currentInput = document.getElementById('ag-search-input');
    renderDrawer(currentInput ? currentInput.value : '');
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
        const currentInput = document.getElementById('ag-search-input');
        renderDrawer(currentInput ? currentInput.value : '');
        showToast(`<b>${label}</b> movido para posição ${newPos}`);
      }
    }
  }
}

function ensureTabExists(id){
  const exists = CATALOGO.some(sec => sec.id === id || sec.itens.some(i => i.id === id));
  if (!exists) return false;

  let order = getOrder();
  if (!order.includes(id)) {
    if (order.length >= CONFIG.MAX_TABS) {
      order.pop();
    }
    order.unshift(id);
    save(CONFIG.KEYS.ORDER, order);
  }
  return true;
}

window.addEventListener('DOMContentLoaded', () => {
  renderBar();

  const params = new URLSearchParams(window.location.search);
  const newsId = params.get('id');
  const secaoForcada = params.get('secao');
  
  if (newsId) {
    const abaAlvo = 'saihate_no_paladin';
    if(ensureTabExists(abaAlvo)) {
        renderBar(); 
        setTimeout(() => {
            const btn = document.querySelector(`#filterScroller .filter-tag[data-id="${abaAlvo}"]`);
            if(btn) {
                document.querySelectorAll('#filterScroller .filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (window.carregarSecao) window.carregarSecao(abaAlvo);
                else btn.click();
            }
        }, 200);
    }
    return;
  }

  if (secaoForcada) {
    if(ensureTabExists(secaoForcada)) {
        renderBar();
        setTimeout(() => {
            const btn = document.querySelector(`#filterScroller .filter-tag[data-id="${secaoForcada}"]`);
            if (btn) {
                document.querySelectorAll('#filterScroller .filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                btn.click();
            } else if (window.carregarSecao) {
                window.carregarSecao(secaoForcada);
            }
        }, 150);
    }
  }
});

})();
