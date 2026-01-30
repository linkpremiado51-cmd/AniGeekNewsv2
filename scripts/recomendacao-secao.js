/* ======================================================
   AniGeekNews – Enterprise Section System v8.0 (Final Corrected)
   • Barra de Pesquisa Externa (Acima das Abas)
   • Auto-Clique Real ao Adicionar
   • Capa Personalizada no Menu
   • Personagem com Fade In/Out (Sem deslize)
   • Correção de Altura (Sem Pulos na Pesquisa)
====================================================== */

(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v8_order',
    MODE:  'ag_v8_mode', // 'dynamic' ou 'fixed'
    STATS: 'ag_v8_stats'
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
  .ag-interface-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
  }

  /* --- BARRA DE PESQUISA E BOTÕES (EXTERNO/TOPO) --- */
  .ag-external-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    width: 100%;
    max-width: 100%;
    background: transparent;
    z-index: 101;
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
    padding: 8px 10px 8px 32px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.1);
    background: rgba(255,255,255,0.9);
    font-size: 11px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
    cursor: pointer; /* Indica que é clicável para abrir o menu */
  }

  body.dark-mode .ag-search-input {
    background: rgba(40,40,40,0.9);
    border-color: rgba(255,255,255,0.1);
    color: #fff;
  }

  .ag-search-input:focus {
    border-color: var(--primary-color, #e50914);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  /* --- BOTÕES DE MODO --- */
  .ag-mode-group {
    background: rgba(0,0,0,0.05);
    padding: 3px;
    border-radius: 6px;
    display: flex;
    flex-shrink: 0;
  }
  body.dark-mode .ag-mode-group { background: rgba(255,255,255,0.1); }

  .ag-mode-btn {
    padding: 6px 12px;
    border: none;
    background: transparent;
    border-radius: 4px;
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
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  body.dark-mode .ag-mode-btn.active {
    background: #444;
    color: #fff;
  }

  /* --- GAVETA (MENU DA ENGRENAGEM) --- */
  #ag-drawer {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease;
    opacity: 0;
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 1000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  body.dark-mode #ag-drawer {
    background: #141414;
    border-color: #333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  }

  #ag-drawer.open {
    max-height: 85vh;
    opacity: 1;
  }

  /* Conteúdo da gaveta com scroll */
  .ag-drawer-scroll {
    position: relative;
    z-index: 5;
    max-height: 85vh;
    overflow-y: auto;
    padding: 0; /* Padding removido para capa encostar nas bordas se quiser, mas ajustado abaixo */
    scrollbar-width: thin;
  }
  
  /* Container interno para dar espaçamento nas laterais */
  .ag-drawer-inner {
    padding: 20px 15px;
    /* Altura mínima para evitar que o layout pule (Jitter) na pesquisa */
    min-height: 400px; 
  }

   /* IMAGEM DO PERSONAGEM FIXA */
  .ag-char-fixed {
    position: fixed; /* Imóvel em relação à tela ou container pai transformado */
    bottom: 0;
    right: 0;
    height: 85vh; /* Ajuste conforme necessário */
    width: auto;
    max-width: 45vw;
    object-fit: contain;
    object-position: bottom right;
    pointer-events: none;
    z-index: 2; /* Acima do conteúdo, abaixo do toast */
    
    /* Efeito APENAS Fade In/Out */
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
    transform: none !important; /* Garante que não desliza */
  }

  #ag-drawer.open .ag-char-fixed {
    opacity: 1;
  }

  /* CAPA NO TOPO DO MENU */
  .ag-drawer-cover {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 25px; /* Não encostar nas categorias */
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: block;
  }

  /* --- SESSÕES E GRID --- */
  .ag-section-block {
    margin-bottom: 25px;
    position: relative;
    z-index: 3; /* Acima da imagem do personagem */
  }

  .ag-section-header-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    background: transparent;
    border: none;
    padding: 4px 0;
    cursor: pointer;
    width: fit-content;
  }

  .ag-section-text {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #333;
  }
  body.dark-mode .ag-section-text { color: #fff; }

  .ag-section-header-btn.is-active .ag-section-text {
    color: var(--primary-color, #e50914);
    text-decoration: underline;
  }

  .ag-section-marker {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  .ag-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
  }

  .ag-card {
    position: relative;
    background: #f4f4f4;
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 10px 8px;
    font-size: 9.5px;
    font-weight: 600;
    color: #444;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  body.dark-mode .ag-card {
    background: #222;
    color: #ccc;
  }

  .ag-card:hover { transform: translateY(-2px); }

  .ag-card.is-selected {
    background: #fff;
    border-color: var(--primary-color, #e50914);
    color: var(--primary-color, #e50914);
    font-weight: 800;
  }
  body.dark-mode .ag-card.is-selected { background: #333; }

  .ag-card-action {
    position: absolute;
    top: 3px;
    right: 4px;
    font-size: 8px;
    opacity: 0.7;
  }

  /* --- TOAST --- */
  #ag-toast-container {
    position: fixed;
    bottom: 20px;
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
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 10px;
    font-weight: 600;
    backdrop-filter: blur(4px);
    animation: agSlideUp 0.3s forwards;
  }
  .ag-toast.success { border-left: 3px solid #00C851; }
  .ag-toast.error { border-left: 3px solid #ff4444; }

  @keyframes agSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes agFadeOut { to { opacity: 0; transform: translateY(-10px); } }

  /* --- BARRA DE ABAS (FILTERS) --- */
  #filterScroller {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 5px;
  }
  #filterScroller::-webkit-scrollbar { display: none; }

  .filter-tag.cfg-btn {
    position: sticky;
    right: 0;
    z-index: 99;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-left: 1px solid rgba(0,0,0,0.1);
    box-shadow: -5px 0 10px rgba(0,0,0,0.05);
  }
  body.dark-mode .filter-tag.cfg-btn {
    background: rgba(30, 30, 30, 0.9);
    border-color: rgba(255,255,255,0.1);
  }
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
function setMode(m){ save(CONFIG.KEYS.MODE, m); updateModeButtons(); renderDrawer(document.querySelector('.ag-search-input').value); }
function getOrder(){ return load(CONFIG.KEYS.ORDER, ['manchetes', 'destaques']); }

function findItem(id){
  for(let sec of CATALOGO){
    if(sec.id === id) return sec;
    const item = sec.itens.find(i => i.id === id);
    if(item) return item;
  }
  return null;
}

/* ===========================
   RENDERIZAÇÃO DA INTERFACE
=========================== */
// Inicializa a estrutura DOM
function initStructure() {
    const scrollContainer = document.getElementById('filterScroller');
    if (!scrollContainer) return;

    // Criar container pai se não existir
    if (!document.querySelector('.ag-interface-container')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'ag-interface-container';
        scrollContainer.parentNode.insertBefore(wrapper, scrollContainer);
        wrapper.appendChild(scrollContainer);
    }

    const wrapper = document.querySelector('.ag-interface-container');

    // 1. Criar Header Externo (Barra e Botões ACIMA das abas)
    if (!document.querySelector('.ag-external-header')) {
        const header = document.createElement('div');
        header.className = 'ag-external-header';
        
        const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

        header.innerHTML = `
            <div class="ag-search-wrapper">
                ${searchIcon}
                <input type="text" class="ag-search-input" placeholder="Pesquisar categoria...">
            </div>
            <div class="ag-mode-group">
                <button id="btn-fixo" class="ag-mode-btn">Fixo</button>
                <button id="btn-dinamico" class="ag-mode-btn">Automático</button>
            </div>
        `;

        wrapper.insertBefore(header, scrollContainer);

        // Event Listeners do Header
        header.querySelector('.ag-search-input').addEventListener('click', () => openDrawer());
        header.querySelector('.ag-search-input').addEventListener('input', (e) => {
            if(!document.getElementById('ag-drawer').classList.contains('open')) openDrawer();
            filterDrawer(e.target.value);
        });
        
        document.getElementById('btn-fixo').onclick = () => setMode('fixed');
        document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
    }

    // 2. Criar a Gaveta (Drawer) DEPOIS do scroller
    if (!document.getElementById('ag-drawer')) {
        const drawer = document.createElement('div');
        drawer.id = 'ag-drawer';
        // A capa e o personagem são inseridos no renderDrawer
        wrapper.appendChild(drawer);
    }

    updateModeButtons();
}

function updateModeButtons() {
    const mode = getMode();
    document.getElementById('btn-fixo').className = `ag-mode-btn ${mode==='fixed'?'active':''}`;
    document.getElementById('btn-dinamico').className = `ag-mode-btn ${mode==='dynamic'?'active':''}`;
}

function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;
  const order = getOrder();
  
  // Limpa apenas os botões de categoria, mantém a estrutura se houver
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
      
      // Fecha a gaveta ao clicar na aba
      document.getElementById('ag-drawer').classList.remove('open');
      
      const url = new URL(window.location);
      url.searchParams.set('secao', id);
      window.history.replaceState({}, '', url);

      if(window.carregarSecao) window.carregarSecao(id);
    };
    bar.appendChild(btn);
  });

  // Botão Engrenagem (sempre por último)
  const cfg = document.createElement('button');
  cfg.className = 'filter-tag cfg-btn';
  cfg.innerHTML = '⚙';
  cfg.onclick = toggleDrawer;
  bar.appendChild(cfg);
}

function openDrawer() {
    const drawer = document.getElementById('ag-drawer');
    if(!drawer.classList.contains('open')) {
        renderDrawer(document.querySelector('.ag-search-input').value);
        drawer.classList.add('open');
    }
}

function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(drawer.classList.contains('open')){
    drawer.classList.remove('open');
  } else {
    // Não foca automaticamente no input para evitar abrir teclado
    openDrawer();
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();

  // URL da Imagem da Capa
  const coverUrl = "https://i.postimg.cc/HWM72wfT/the-pensive-journey-by-chcofficial-dhme17e-pre.jpg";
  // URL da Imagem do Personagem
  const charUrl = "https://i.postimg.cc/W49RX3dK/anime-boy-render-04-by-luxio56lavi-d5xed2a.png";

  drawer.innerHTML = `
    <img src="${charUrl}" class="ag-char-fixed" alt="Character">
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-inner">
        <img src="${coverUrl}" class="ag-drawer-cover" alt="Cover">

        <div id="ag-catalog-container"></div>
        
        <div style="text-align:center; padding:20px 0; font-size:10px; color:#999;">
             ${currentOrder.length} / ${CONFIG.MAX_TABS} categorias ativas
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    // Lógica de Filtro
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

    // Click no Título da Sessão
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
        if(e.target.dataset.action) {
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

// Filtra visualmente sem recriar o HTML (preserva estado)
function filterDrawer(term) {
  const termLower = term.toLowerCase();
  document.querySelectorAll('.ag-section-block').forEach(block => {
    const catId = block.querySelector('.ag-section-header-btn').dataset.catId;
    const cat = CATALOGO.find(c => c.id === catId);
    
    const sessaoMatch = cat.sessao.toLowerCase().includes(termLower);
    const hasItems = cat.itens.some(i => i.label.toLowerCase().includes(termLower));
    
    // Se não der match na sessão nem nos itens, esconde o bloco
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
   AÇÕES (ADD/REMOVE)
=========================== */
function toggleItem(id, label){
  let order = getOrder();

  if(order.includes(id)){
    // Remover
    order = order.filter(x => x !== id);
    showToast(`Removido: <b>${label}</b>`);
    save(CONFIG.KEYS.ORDER, order);
    renderBar();
    renderDrawer(document.querySelector('.ag-search-input').value);
  } else {
    // Adicionar
    if(order.length >= CONFIG.MAX_TABS) {
      showToast(`Limite de abas atingido!`, 'error');
      return;
    }
    order.push(id);
    save(CONFIG.KEYS.ORDER, order);
    renderBar();
    renderDrawer(document.querySelector('.ag-search-input').value);
    showToast(`Adicionado: <b>${label}</b>`, 'success');

    // --- AUTO-CLIQUE REAL RESTAURADO ---
    // Aguarda o botão ser renderizado na barra e clica nele
    setTimeout(() => {
        const btn = document.querySelector(`#filterScroller .filter-tag[data-id="${id}"]`);
        if(btn) {
            btn.click(); // Dispara o clique real
        }
    }, 100);
  }
}

function handleAction(id, label){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    // Modo dinâmico: clique no ícone remove
    toggleItem(id, label);
  } else {
    // Modo fixo: reordenar
    const currentIdx = order.indexOf(id);
    const newPos = prompt(`Mover "${label}" para qual posição? (1-${order.length})`, currentIdx + 1);
    if(newPos && !isNaN(newPos)) {
        const target = parseInt(newPos) - 1;
        if(target >= 0 && target < order.length){
            order.splice(currentIdx, 1);
            order.splice(target, 0, id);
            save(CONFIG.KEYS.ORDER, order);
            renderBar();
            renderDrawer(document.querySelector('.ag-search-input').value);
        }
    }
  }
}

/* ===========================
   INICIALIZAÇÃO
=========================== */
window.addEventListener('DOMContentLoaded', () => {
  initStructure();
  renderBar();

  // Deep Linking (Check URL)
  const params = new URLSearchParams(window.location.search);
  const id = params.get('secao') || params.get('id'); // Se tiver ID de noticia, tenta achar categoria compativel se necessario
  
  // Se houver parametro, garantir que está ativo e clicar
  if (id) {
     let order = getOrder();
     // Verifica se o ID existe no catalogo
     const exists = findItem(id);
     
     if (exists && !order.includes(id)) {
         if(order.length >= CONFIG.MAX_TABS) order.pop();
         order.push(id); // Adiciona ao final (ou inicio se preferir unshift)
         save(CONFIG.KEYS.ORDER, order);
         renderBar();
     }
     
     if(exists) {
         setTimeout(() => {
             const btn = document.querySelector(`.filter-tag[data-id="${id}"]`);
             if(btn) btn.click();
         }, 200);
     }
  }
});

})();
