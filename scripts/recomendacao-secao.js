(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v7_order',
    MODE:  'ag_v7_mode',
    STATS: 'ag_v7_stats'
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
      { id: 'editorpick', label: 'Editor’s Pick', genero: ["Notícias"] }
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

// Estado global para o gênero selecionado
let selectedGenre = null;

// Função para fechar o menu da engrenagem suavemente
function closeDrawerSmoothly() {
  const drawer = document.getElementById('ag-drawer');
  if (drawer && drawer.classList.contains('open')) {
    drawer.classList.remove('open');
  }
}

// Função para abrir o menu da engrenagem suavemente
function openDrawerSmoothly() {
  const drawer = document.getElementById('ag-drawer');
  if (drawer && !drawer.classList.contains('open')) {
    renderDrawer();
    drawer.classList.add('open');
  }
}

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
  if(saved) return saved.filter(id => findItem(id) !== null); // Filtra IDs inválidos
  return ['manchetes', 'destaques', 'ultimas'];
}

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

  // Filtra IDs inválidos antes de ordenar
  const order = getOrder().filter(id => findItem(id) !== null);
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
   GAVETA (DRAWER) E FILTRO DE GÊNEROS
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
  const hamburgerIcon = `<button class="ag-hamburger-btn" id="ag-hamburger-btn">☰</button>`;

  let searchPlaceholder = selectedGenre ? `Pesquisando em ${selectedGenre}` : "Pesquisando em todos os gêneros";

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="${searchPlaceholder}" value="${filterText}">
        </div>
        ${hamburgerIcon}
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

  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    const itensFiltrados = sec.itens.filter(i =>
      i.label.toLowerCase().includes(term) ||
      (i.genero && i.genero.some(g => g.toLowerCase().includes(term))) ||
      (selectedGenre ? (i.genero && i.genero.includes(selectedGenre)) : true) // Correção do filtro de gênero
    );
    const sessaoMatch = sec.sessao.toLowerCase().includes(term) ||
                        (sec.genero && sec.genero.some(g => g.toLowerCase().includes(term))) ||
                        (selectedGenre ? (sec.genero && sec.genero.includes(selectedGenre)) : true);

    if(term !== "" && !sessaoMatch && itensFiltrados.length === 0) return;

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

    // Padroniza a ação para sempre chamar toggleItem
    sectionDiv.querySelector('.ag-section-header-btn').onclick = (e) => {
      toggleItem(sec.id, sec.sessao);
    };

    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

    (sessaoMatch ? sec.itens : itensFiltrados).forEach(item => {
      const isSelected = currentOrder.includes(item.id);
      const card = document.createElement('div');
      card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
      let actionIcon = isSelected ? (currentMode === 'dynamic' ? '✕' : '•••') : '';

      card.innerHTML = `${item.label}${isSelected ? `<div class="ag-card-action" data-id="${item.id}" data-action="true">${actionIcon}</div>` : ''}`;
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

  document.getElementById('ag-search-input').oninput = (e) => filterDrawer(e.target.value);
  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
  document.getElementById('ag-hamburger-btn').onclick = () => {
    openSettingsMenu(); // Troca para abrir um menu de configurações
  };
}

function filterDrawer(term) {
  renderDrawer(term); // Re-renderiza em vez de só esconder/mostrar
}

/* ===========================
   MODAL DE GÊNEROS
=========================== */
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
    btn.className = 'ag-genre-item';
    btn.textContent = genre;
    btn.onclick = () => {
      selectedGenre = genre;
      document.getElementById('ag-search-input').placeholder = `Pesquisando em ${selectedGenre}`;
      renderDrawer(''); // Re-renderiza em vez de usar filterDrawer
      modal.style.display = 'none';
      openDrawerSmoothly();
    };
    genresList.appendChild(btn);
  });

  // Opção para limpar o filtro de gênero
  const clearBtn = document.createElement('button');
  clearBtn.className = 'ag-genre-item';
  clearBtn.textContent = "Limpar filtro de gênero";
  clearBtn.onclick = () => {
    selectedGenre = null;
    document.getElementById('ag-search-input').placeholder = "Pesquisando em todos os gêneros";
    renderDrawer(''); // Re-renderiza em vez de usar filterDrawer
    modal.style.display = 'none';
  };
  genresList.appendChild(clearBtn);

  // Botão de fechar
  document.getElementById('ag-genre-close-btn').onclick = () => {
    modal.style.display = 'none';
  };

  modal.style.display = 'flex';
}

/* ===========================
   AÇÕES & NOTIFICAÇÕES
=========================== */
function toggleItem(id, label){
  let order = getOrder();
  if(order.includes(id)){
    const mode = getMode();
    if(mode === 'dynamic') {
      const confirmRemove = confirm(`Remover "${label}"?`); // Confirmação para remoção
      if(!confirmRemove) return;
    }
    order = order.filter(x => x !== id);
    showToast(`Removido: <b>${label}</b>`);
  } else {
    if(order.length >= CONFIG.MAX_TABS) {
      showToast(`Limite de ${CONFIG.MAX_TABS} abas atingido!`, 'error');
      return;
    }
    order.push(id);
    showToast(`Adicionado: <b>${label}</b>`, 'success');
    // Busca o botão corretamente
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
    const confirmRemove = confirm(`Remover "${label}"?`); // Confirmação para remoção
    if(!confirmRemove) return;
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
  const currentInput = document.getElementById('ag-search-input');
  const currentValue = currentInput ? currentInput.value : '';
  renderDrawer(currentValue);
  if (currentInput) currentInput.value = currentValue;
}

// Função para abrir um menu de configurações (substituindo o hamburger)
function openSettingsMenu() {
  alert("Abrir menu de configurações (implementação pendente)");
}

/* Inicialização */
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
else renderBar();

// Adiciona os estilos (mesmos do código original)
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
  /* ... (restante dos estilos) ... */
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

})();
