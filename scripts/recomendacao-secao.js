/* ======================================================
   AniGeekNews – Enterprise Section System v4 (Drawer Edition)
   • Menu estilo "Gaveta" (Dropdown)
   • Botões com visual idêntico às abas
   • Animação suave de slide-down
====================================================== */

(function(){

const MAX = 12;
const KEY_ORDER = 'ag_sections_order';
const KEY_MODE  = 'ag_sections_mode';
const KEY_STATS = 'ag_sections_stats';

/* ===========================
   CSS INJETADO (Estilo da Gaveta)
=========================== */
const styles = `
  /* Container da gaveta */
  #ag-drawer {
    background: #1a1a1a; /* Fundo escuro para destacar */
    border-bottom: 2px solid #333;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s ease-in-out, padding 0.4s ease;
    opacity: 0;
    width: 100%;
    box-sizing: border-box;
    position: absolute; /* Flutua sobre o conteúdo ou mude para relative se quiser empurrar */
    left: 0;
    z-index: 999;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  }

  #ag-drawer.open {
    max-height: 600px; /* Altura máxima suficiente para o conteúdo */
    opacity: 1;
    padding: 20px;
  }

  /* Layout interno da gaveta */
  .ag-drawer-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .ag-controls {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
    display: flex;
    gap: 15px;
    align-items: center;
    color: #fff;
    font-size: 0.9rem;
  }

  /* Grid de botões idênticos às abas */
  .ag-tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  /* Estilo visual para diferenciar selecionados na gaveta */
  .ag-tags-grid .filter-tag {
    opacity: 0.5;
    border: 1px solid #444;
    filter: grayscale(1);
    transition: 0.2s;
  }
  
  /* Botão selecionado (está ativo no menu) */
  .ag-tags-grid .filter-tag.is-selected {
    opacity: 1;
    filter: grayscale(0);
    border-color: var(--primary-color, #e50914); /* Use a cor do seu tema */
    background-color: #333; 
    font-weight: bold;
  }
  
  /* Botões de modo (Fixo/Dinâmico) */
  .mode-btn {
    padding: 5px 15px;
    border-radius: 20px;
    border: 1px solid #444;
    background: transparent;
    color: #ccc;
    cursor: pointer;
  }
  .mode-btn.active {
    background: #fff;
    color: #000;
    border-color: #fff;
  }
`;

/* Injeta o CSS no head */
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


/* ===========================
   TODAS AS SEÇÕES
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
   UTIL
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

/* ===========================
   ORDEM & MODE
=========================== */
function getMode(){ return localStorage.getItem(KEY_MODE) || 'dynamic'; }
function setMode(m){ localStorage.setItem(KEY_MODE,m); renderDrawer(); }

function getOrder(){
  const saved = load(KEY_ORDER,null);
  if(saved) return saved;
  return SECOES.slice(0,7).map(s=>s.id);
}

/* ===========================
   STATS (modo dinâmico)
=========================== */
function getStats(){ return load(KEY_STATS,{}); }

function track(id){
  const stats = getStats();
  stats[id] = (stats[id] || 0) + 1;
  save(KEY_STATS,stats);

  if(getMode()==='dynamic'){
    autoReorder();
  }
}

function autoReorder(){
  const stats = getStats();
  const order = getOrder();
  order.sort((a,b)=>(stats[b]||0)-(stats[a]||0));
  save(KEY_ORDER,order);
}

/* ===========================
   RENDERIZAR BARRA (Menu Principal)
=========================== */
function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;

  // Garante que o container da gaveta exista logo após a barra
  let drawer = document.getElementById('ag-drawer');
  if(!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'ag-drawer';
    // Insere a gaveta logo após o container do menu
    bar.parentNode.insertBefore(drawer, bar.nextSibling);
  }

  const order = getOrder();
  bar.innerHTML = '';

  // Renderiza botões ativos
  order.forEach(id=>{
    const sec = SECOES.find(s=>s.id===id);
    if(!sec) return;

    const btn = document.createElement('button');
    btn.className='filter-tag'; // Sua classe original
    btn.textContent=sec.nome;

    btn.onclick=()=>{
      document.querySelectorAll('#filterScroller .filter-tag').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      track(id);
      
      // Fecha a gaveta se clicar num item do menu principal
      document.getElementById('ag-drawer').classList.remove('open');
      
      if(window.carregarSecao) window.carregarSecao(id);
    };

    bar.appendChild(btn);
  });

  // Botão de Engrenagem (Toggle da Gaveta)
  const cfg = document.createElement('button');
  cfg.className = 'filter-tag';
  cfg.innerHTML = '⚙'; // Ícone
  cfg.onclick = toggleDrawer;
  bar.appendChild(cfg);

  // Ativa o primeiro se nenhum estiver ativo
  const activeBtn = bar.querySelector('.filter-tag.active');
  if(!activeBtn && order.length > 0){
      const first = bar.querySelector('.filter-tag');
      if(first) first.classList.add('active');
  }
}

/* ===========================
   GAVETA (DRAWER) LOGIC
=========================== */
function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(!drawer) return;
  
  const isOpen = drawer.classList.contains('open');
  
  if(isOpen){
    drawer.classList.remove('open');
  } else {
    renderDrawer(); // Atualiza o conteúdo antes de abrir
    drawer.classList.add('open');
  }
}

function renderDrawer(){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();

  drawer.innerHTML = `
    <div class="ag-drawer-content">
      <div class="ag-controls">
        <span>Modo de Ordenação:</span>
        <button id="btn-fixo" class="mode-btn ${currentMode==='fixed'?'active':''}">Fixo</button>
        <button id="btn-dinamico" class="mode-btn ${currentMode==='dynamic'?'active':''}">Dinâmico (IA)</button>
        <span style="margin-left:auto; opacity:0.6; font-size:12px">Selecione para exibir no menu</span>
      </div>
      
      <div class="ag-tags-grid" id="drawer-grid">
        </div>
    </div>
  `;

  // Eventos dos botões de modo
  drawer.querySelector('#btn-fixo').onclick = () => setMode('fixed');
  drawer.querySelector('#btn-dinamico').onclick = () => setMode('dynamic');

  // Renderiza os botões das abas (estilo TAG)
  const grid = drawer.querySelector('#drawer-grid');

  SECOES.forEach(sec => {
    const isSelected = currentOrder.includes(sec.id);
    
    const btn = document.createElement('button');
    // Usa EXATAMENTE a mesma classe visual 'filter-tag', adicionamos 'is-selected' apenas para controle visual
    btn.className = `filter-tag ${isSelected ? 'is-selected' : ''}`;
    btn.textContent = sec.nome;
    
    // Ícone visual de +/- (opcional, pode remover se quiser só o botão limpo)
    if(isSelected) btn.innerHTML += ' <span style="font-size:10px">✓</span>';

    btn.onclick = () => {
      let newOrder = getOrder();

      if(isSelected) {
        // Remover
        newOrder = newOrder.filter(id => id !== sec.id);
      } else {
        // Adicionar (respeitando limite)
        if(newOrder.length < MAX) {
          newOrder.push(sec.id);
        } else {
          alert(`Máximo de ${MAX} abas permitido.`);
          return;
        }
      }

      save(KEY_ORDER, newOrder);
      renderDrawer(); // Re-renderiza a gaveta para atualizar status
      renderBar();    // Atualiza a barra principal em tempo real
    };

    grid.appendChild(btn);
  });
}

/* ===========================
   START
=========================== */
document.addEventListener('DOMContentLoaded', renderBar);

})();
