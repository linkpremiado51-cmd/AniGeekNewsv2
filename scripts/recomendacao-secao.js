/* ======================================================
   AniGeekNews – Enterprise Section System v9.0 (Ultimate Edit)
   • Títulos de Sessão Clicáveis
   • Notificações Toast
   • Layout Estático e UX Aprimorada (Sem foco automático invasivo)
   • Sistema de Watchlist e Concluídos (Filtros Visuais)
   • Botão "Voltar" para ver todas as abas
   • Menu Hambúrguer e Menu de Contexto
   • Status de Visualização (Borda Amarela/Azul)
====================================================== */
(function(){

const CONFIG = {
  MAX_TABS: 19,
  KEYS: {
    ORDER: 'ag_v9_order',
    MODE:  'ag_v9_mode',
    STATS: 'ag_v9_stats',
    STATUS: 'ag_v9_status',
    VIEW: 'ag_v9_current_view' // Salva o filtro atual (all, watchlist, watched)
  },
  FIXED_TAB: 'anigeek_tv'
};

/* ===========================
   BANCO DE DADOS COMPLETO
=========================== */
const CATALOGO = [
  { sessao: "Jujutsu Kaisen Shimetsu Kaiyu", id: "Jujutsu_kaisen_shimetsu_kaiyu", cor: "#e63946", itens: [] },
  { sessao: "Akame Ga Kill", id: "akame_ga_kill", cor: "#f1faee", itens: [] },
  { sessao: "Notícias Geek", id: "noticias_geek", cor: "#a8dadc", itens: [] },
  { sessao: "Angelic Layer", id: "angelic_layer", cor: "#457b9d", itens: [] },
  { sessao: "Anime I Geek TV", id: "anigeek_tv", cor: "#1d3557", itens: [] },
  { sessao: "Assassination Classroom", id: "assassination_classroom", cor: "#fca311", itens: [] },
  { sessao: "Attack On Titan Final Season", id: "attack_on_titan_final_season", cor: "#ff6b6b", itens: [] },
  { sessao: "Attack On Titan Final Season Part 2", id: "attack_on_titan_final_season_part_2", cor: "#6a4c93", itens: [] },
  { sessao: "Bakuman", id: "bakuman", cor: "#ffb703", itens: [] },
  { sessao: "Black Bullet", id: "black_bullet", cor: "#219ebc", itens: [] },
  { sessao: "Black Clover", id: "black_clover", cor: "#023e8a", itens: [] },
  { sessao: "Bleach", id: "bleach", cor: "#e63946", itens: [] },
  { sessao: "Blue Lock", id: "blue_lock", cor: "#00b4d8", itens: [] },
  { sessao: "Blue Period", id: "blue_period", cor: "#7209b7", itens: [] },
  { sessao: "Boku No Hero Academia Season 5", id: "boku_no_hero_academia_season_5", cor: "#f77f00", itens: [] },
  { sessao: "Boku No Hero Academia Season 6", id: "boku_no_hero_academia_season_6", cor: "#ffbe0b", itens: [] },
  { sessao: "Boruto", id: "boruto", cor: "#8ac926", itens: [] },
  { sessao: "Cells At Work", id: "cells_at_work", cor: "#1982c4", itens: [] },
  { sessao: "Cells At Work Black", id: "cells_at_work_black", cor: "#6a4c93", itens: [] },
  { sessao: "Chainsaw Man", id: "chainsaw_man", cor: "#d62828", itens: [] },
  { sessao: "Chainsaw Man Part 2", id: "chainsaw_man_part_2", cor: "#f77f00", itens: [] },
  { sessao: "Clannad", id: "clannad", cor: "#ffb703", itens: [] },
  { sessao: "Classroom Of The Elite", id: "classroom_of_the_elite", cor: "#023e8a", itens: [] },
  { sessao: "Classroom Of The Elite Season 2", id: "classroom_of_the_elite_season_2", cor: "#00b4d8", itens: [] },
  { sessao: "Code Geass", id: "code_geass", cor: "#f94144", itens: [] },
  { sessao: "Cowboy Bebop", id: "cowboy_bebop", cor: "#7209b7", itens: [] },
  { sessao: "Death Note", id: "death_note", cor: "#ff6d00", itens: [] },
  { sessao: "Demon Slayer Kimetsu No Yaiba", id: "demon_slayer_kimetsu_no_yaiba", cor: "#f72585", itens: [] },
  { sessao: "Demon Slayer Entertainment District", id: "demon_slayer_kimetsu_no_yaiba_entertainment_district", cor: "#b5179e", itens: [] },
  { sessao: "Demon Slayer Mugen Train", id: "demon_slayer_kimetsu_no_yaiba_mugen_train", cor: "#7209b7", itens: [] },
  { sessao: "Demon Slayer Swordsmith Village", id: "demon_slayer_kimetsu_no_yaiba_swordsmith_village", cor: "#3a0ca3", itens: [] },
  { sessao: "Devilman Crybaby", id: "devilman_crybaby", cor: "#4361ee", itens: [] },
  { sessao: "Dr Stone", id: "dr_stone", cor: "#4895ef", itens: [] },
  { sessao: "Elfen Lied", id: "elfen_lied", cor: "#4cc9f0", itens: [] },
  { sessao: "Eromanga Sensei", id: "eromanga_sensei", cor: "#7209b7", itens: [] },
  { sessao: "Fire Force", id: "fire_force", cor: "#f94144", itens: [] },
  { sessao: "Food Wars Shokugeki No Soma", id: "food_wars_shokugeki_no_soma", cor: "#ffba08", itens: [] },
  { sessao: "Fullmetal Alchemist Brotherhood", id: "fullmetal_alchemist_brotherhood", cor: "#8d99ae", itens: [] },
  { sessao: "Guilty Crown", id: "guilty_crown", cor: "#ef233c", itens: [] },
  { sessao: "Haikyuu", id: "haikyuu", cor: "#06d6a0", itens: [] },
  { sessao: "Hells Paradise", id: "hells_paradise", cor: "#118ab2", itens: [] },
  { sessao: "Horimiya", id: "horimiya", cor: "#073b4c", itens: [] },
  { sessao: "Hunter X Hunter", id: "hunter_x_hunter", cor: "#ffd166", itens: [] },
  { sessao: "Jujutsu Kaisen", id: "jujutsu_kaisen", cor: "#06d6a0", itens: [] },
  { sessao: "Kaguya Sama Love Is War", id: "kaguya_sama_love_is_war", cor: "#118ab2", itens: [] },
  { sessao: "Kaguya Sama Love Is War Season 2", id: "kaguya_sama_love_is_war_season_2", cor: "#073b4c", itens: [] },
  { sessao: "Kaguya Sama Love Is War Season 3", id: "kaguya_sama_love_is_war_season_3", cor: "#ff6d00", itens: [] },
  { sessao: "Kimi No Suizou Wo Tabetai", id: "kimi_no_suizou_wo_tabetai", cor: "#7209b7", itens: [] },
  { sessao: "Kingdom", id: "kingdom", cor: "#f94144", itens: [] },
  { sessao: "Komi Cant Communicate", id: "komi_cant_communicate", cor: "#06d6a0", itens: [] },
  { sessao: "Komi Cant Communicate Season 2", id: "komi_cant_communicate_season_2", cor: "#073b4c", itens: [] },
  { sessao: "Kuroko No Basket", id: "kuroko_no_basket", cor: "#118ab2", itens: [] },
  { sessao: "Kuroshitsuji", id: "kuroshitsuji", cor: "#06d6a0", itens: [] },
  { sessao: "Made In Abyss", id: "made_in_abyss", cor: "#ffd166", itens: [] },
  { sessao: "Made In Abyss Dawn Of The Deep Soul", id: "made_in_abyss_dawn_of_the_deep_soul", cor: "#ef476f", itens: [] },
  { sessao: "Made In Abyss Retsujitsu", id: "made_in_abyss_retsujitsu", cor: "#06d6a0", itens: [] },
  { sessao: "Maiden Slayer", id: "maiden_slayer", cor: "#118ab2", itens: [] },
  { sessao: "Mob Psycho 100", id: "mob_psycho_100", cor: "#073b4c", itens: [] },
  { sessao: "My Hero Academia", id: "my_hero_academia", cor: "#ff6d00", itens: [] },
  { sessao: "My Next Life As A Villainess", id: "my_next_life_as_a_villainess", cor: "#f94144", itens: [] },
  { sessao: "Naruto", id: "naruto", cor: "#06d6a0", itens: [] },
  { sessao: "Neon Genesis Evangelion", id: "neon_genesis_evangelion", cor: "#073b4c", itens: [] },
  { sessao: "Noragami", id: "noragami", cor: "#ff6d00", itens: [] },
  { sessao: "Oddtaxi", id: "oddtaxi", cor: "#ef233c", itens: [] },
  { sessao: "One Piece", id: "one_piece", cor: "#ffd166", itens: [] },
  { sessao: "One Punch Man", id: "one_punch_man", cor: "#06d6a0", itens: [] },
  { sessao: "Oregairu", id: "oregairu", cor: "#073b4c", itens: [] },
  { sessao: "Oregairu Season 2", id: "oregairu_season_2", cor: "#ff6d00", itens: [] },
  { sessao: "Owari No Seraph", id: "owari_no_seraph", cor: "#f94144", itens: [] },
  { sessao: "Platinum End", id: "platinum_end", cor: "#06d6a0", itens: [] },
  { sessao: "Psycho Pass", id: "psycho_pass", cor: "#118ab2", itens: [] },
  { sessao: "Re Zero Kara Hajimeru Isekai Seikatsu", id: "re_zero_kara_hajimeru_isekai_seikatsu", cor: "#073b4c", itens: [] },
  { sessao: "Rent A Girlfriend", id: "rent_a_girlfriend", cor: "#ff6d00", itens: [] },
  { sessao: "Rent A Girlfriend Season 2", id: "rent_a_girlfriend_season_2", cor: "#ef233c", itens: [] },
  { sessao: "Rurouni Kenshin", id: "rurouni_kenshin", cor: "#06d6a0", itens: [] },
  { sessao: "Saihate No Paladin", id: "saihate_no_paladin", cor: "#118ab2", itens: [] },
  { sessao: "Samurai Champloo", id: "samurai_champloo", cor: "#073b4c", itens: [] },
  { sessao: "Sentenced To Be A Hero", id: "sentenced_to_be_a_hero", cor: "#ff6d00", itens: [] },
  { sessao: "Seven Deadly Sins", id: "seven_deadly_sins", cor: "#f94144", itens: [] },
  { sessao: "Shadows House", id: "shadows_house", cor: "#06d6a0", itens: [] },
  { sessao: "Shadows House Season 2", id: "shadows_house_season_2", cor: "#118ab2", itens: [] },
  { sessao: "Shaman King", id: "shaman_king", cor: "#073b4c", itens: [] },
  { sessao: "Shingeki No Kyojin", id: "shingeki_no_kyojin", cor: "#ff6d00", itens: [] },
  { sessao: "Solo Leveling", id: "solo_leveling", cor: "#ef233c", itens: [] },
  { sessao: "Spy X Family", id: "spy_x_family", cor: "#ffd166", itens: [] },
  { sessao: "Steins Gate", id: "steins_gate", cor: "#06d6a0", itens: [] },
  { sessao: "Steins Gate 0", id: "steins_gate_0", cor: "#073b4c", itens: [] },
  { sessao: "Sword Art Online", id: "sword_art_online", cor: "#ff6d00", itens: [] },
  { sessao: "The Ancient Magus Bride", id: "the_ancient_magus_bride", cor: "#f94144", itens: [] },
  { sessao: "The Case Study Of Vanitas", id: "the_case_study_of_vanitas", cor: "#06d6a0", itens: [] },
  { sessao: "The Case Study Of Vanitas Season 2", id: "the_case_study_of_vanitas_season_2", cor: "#073b4c", itens: [] },
  { sessao: "The Quintessential Quintuplets", id: "the_quintessential_quintuplets", cor: "#ff6d00", itens: [] },
  { sessao: "The Rising Of The Shield Hero", id: "the_rising_of_the_shield_hero", cor: "#ef233c", itens: [] },
  { sessao: "The World God Only Knows", id: "the_world_god_only_knows", cor: "#ffd166", itens: [] },
  { sessao: "Tokyo Revengers", id: "tokyo_revengers", cor: "#06d6a0", itens: [] },
  { sessao: "Toradora", id: "toradora", cor: "#073b4c", itens: [] },
  { sessao: "Vinland Saga", id: "vinland_saga", cor: "#ff6d00", itens: [] },
  { sessao: "Vinland Saga Season 2", id: "vinland_saga_season_2", cor: "#f94144", itens: [] },
  { sessao: "Weathering With You", id: "weathering_with_you", cor: "#06d6a0", itens: [] },
  { sessao: "Your Lie In April", id: "your_lie_in_april", cor: "#073b4c", itens: [] },
  { sessao: "Your Name", id: "your_name", cor: "#ff6d00", itens: [] },
  { sessao: "Yuyu Hakusho", id: "yuyu_hakusho", cor: "#ef233c", itens: [] }
];

/* ===========================
   CSS INJETADO (ATUALIZADO)
=========================== */
const styles = `
  #ag-drawer {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    height: 0;
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }
  body.dark-mode #ag-drawer { background: #141414; border-color: #333; }
  #ag-drawer.open { height: 85vh; opacity: 1; }

  .ag-drawer-cover {
    width: 100%;
    height: 120px;
    background-image: url('https://i.postimg.cc/HWM72wfT/the-pensive-journey-by-chcofficial-dhme17e-pre.jpg');
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }
  
  .ag-char-fixed {
    position: absolute;
    bottom: 0; right: 0;
    height: 90%;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
    z-index: 0;
  }
  #ag-drawer.open .ag-char-fixed { opacity: 1; }

  .ag-drawer-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    position: relative;
    z-index: 5;
  }

  /* HEADER E BOTÕES NOVOS */
  .ag-drawer-header {
    position: sticky;
    top: -15px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    z-index: 100;
    padding: 10px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  body.dark-mode .ag-drawer-header { background: rgba(20,20,20,0.9); }

  .ag-search-wrapper { position: relative; margin-bottom: 10px; }
  .ag-search-input {
    width: 100%;
    padding: 10px 10px 10px 35px;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.1);
    background: rgba(0,0,0,0.05);
    font-size: 14px;
    outline: none;
  }
  body.dark-mode .ag-search-input { background: #222; color: #fff; border-color: #444; }

  /* CONTAINER DE BOTÕES DE NAVEGAÇÃO (WATCHLIST/CONCLUÍDOS) */
  .ag-nav-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  .ag-nav-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.3s;
    background: rgba(0,0,0,0.05);
    color: #666;
  }
  body.dark-mode .ag-nav-btn { background: #222; color: #aaa; }
  
  .ag-nav-btn.active-later { background: #ffd700; color: #000; }
  .ag-nav-btn.active-watched { background: #00bfff; color: #fff; }
  .ag-nav-btn.active-all { background: #e50914; color: #fff; }

  /* GRID E CARDS */
  .ag-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
  }
  .ag-card {
    background: #f4f4f4;
    border: 2px solid transparent;
    border-radius: 6px;
    padding: 12px 8px;
    font-size: 11px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
  }
  body.dark-mode .ag-card { background: #1e1e1e; color: #ccc; }
  .ag-card.is-selected { border-color: #e50914; font-weight: bold; }
  .ag-card.status-later { border-color: #ffd700 !important; }
  .ag-card.status-watched { border-color: #00bfff !important; }

  /* CONTEXT MENU */
  .ag-context-menu {
    position: fixed;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    min-width: 160px;
    padding: 5px 0;
  }
  body.dark-mode .ag-context-menu { background: #222; border: 1px solid #444; }
  .ag-context-menu-item {
    padding: 10px 15px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ag-context-menu-item:hover { background: rgba(0,0,0,0.05); }
  body.dark-mode .ag-context-menu-item:hover { background: #333; }
  .ag-context-menu-item.danger { color: #ff4444; }

  /* TOAST */
  #ag-toast-container { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; pointer-events: none; }
  .ag-toast { background: #333; color: #fff; padding: 10px 20px; border-radius: 50px; font-size: 12px; margin-top: 5px; animation: slideUp 0.3s forwards; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   SISTEMA DE TOAST
=========================== */
function showToast(msg) {
  let container = document.getElementById('ag-toast-container') || document.createElement('div');
  container.id = 'ag-toast-container';
  document.body.appendChild(container);
  const toast = document.createElement('div');
  toast.className = 'ag-toast';
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

/* ===========================
   LÓGICA CORE
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

function getStatusMap(){ return load(CONFIG.KEYS.STATUS, {}); }
function setStatus(id, status) {
  const map = getStatusMap();
  if (map[id] === status) delete map[id]; // Toggle: se clicar de novo, remove
  else map[id] = status;
  save(CONFIG.KEYS.STATUS, map);
  renderDrawer(document.getElementById('ag-search-input')?.value || "", false);
}

function getOrder(){ return load(CONFIG.KEYS.ORDER, [CONFIG.FIXED_TAB]); }

/* ===========================
   RENDERIZAÇÃO DA BARRA (FILTER SCROLLER)
=========================== */
function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;
  
  const order = getOrder();
  bar.innerHTML = '';
  
  order.forEach(id => {
    const item = CATALOGO.find(c => c.id === id);
    if(!item) return;
    const btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.textContent = item.sessao;
    btn.dataset.id = id;
    btn.onclick = () => {
      document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('ag-drawer').classList.remove('open');
      if(window.carregarSecao) window.carregarSecao(id);
    };
    bar.appendChild(btn);
  });

  const cfg = document.createElement('button');
  cfg.className = 'filter-tag cfg-btn';
  cfg.innerHTML = '☰';
  cfg.onclick = toggleDrawer;
  bar.appendChild(cfg);
}

function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(drawer.classList.contains('open')) drawer.classList.remove('open');
  else { renderDrawer(); drawer.classList.add('open'); }
}

/* ===========================
   RENDERIZAÇÃO DO DRAWER (CATÁLOGO)
=========================== */
function renderDrawer(filterText = "", shouldFocus = true) {
  const drawer = document.getElementById('ag-drawer');
  const view = load(CONFIG.KEYS.VIEW, 'all');
  const statusMap = getStatusMap();
  const order = getOrder();

  drawer.innerHTML = `
    <div class="ag-drawer-cover"></div>
    <img src="https://i.postimg.cc/W49RX3dK/anime-boy-render-04-by-luxio56lavi-d5xed2a.png" class="ag-char-fixed">
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Pesquisar anime..." value="${filterText}">
        </div>
        <div class="ag-nav-filters">
          <button class="ag-nav-btn ${view==='watchlist'?'active-later':''}" id="nav-watchlist">Watchlist</button>
          <button class="ag-nav-btn ${view==='watched'?'active-watched':''}" id="nav-watched">Concluídos</button>
          <button class="ag-nav-btn ${view==='all'?'active-all':''}" id="nav-all">Ver Tudo</button>
        </div>
      </div>
      <div id="ag-catalog-grid" class="ag-grid-container"></div>
    </div>
  `;

  const grid = document.getElementById('ag-catalog-grid');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(item => {
    const status = statusMap[item.id];
    const isSelected = order.includes(item.id);
    
    // FILTROS DE VISUALIZAÇÃO
    if (view === 'watchlist' && status !== 'later') return;
    if (view === 'watched' && status !== 'watched') return;
    if (term && !item.sessao.toLowerCase().includes(term)) return;

    const card = document.createElement('div');
    let statusClass = status === 'later' ? 'status-later' : (status === 'watched' ? 'status-watched' : '');
    card.className = `ag-card ${isSelected ? 'is-selected' : ''} ${statusClass}`;
    card.innerHTML = item.sessao;
    
    card.onclick = (e) => {
      if (isSelected) openContextMenu(e, item.id, item.sessao);
      else toggleItem(item.id, item.sessao);
    };
    grid.appendChild(card);
  });

  // Eventos dos Novos Botões
  document.getElementById('nav-watchlist').onclick = () => { save(CONFIG.KEYS.VIEW, 'watchlist'); renderDrawer("", false); };
  document.getElementById('nav-watched').onclick = () => { save(CONFIG.KEYS.VIEW, 'watched'); renderDrawer("", false); };
  document.getElementById('nav-all').onclick = () => { save(CONFIG.KEYS.VIEW, 'all'); renderDrawer("", false); };

  const searchInput = document.getElementById('ag-search-input');
  searchInput.oninput = (e) => renderDrawer(e.target.value, true);
  
  // CORREÇÃO UX: Só foca se explicitamente solicitado (evita abrir teclado ao marcar assistido)
  if(shouldFocus) {
    searchInput.focus();
    searchInput.setSelectionRange(filterText.length, filterText.length);
  }
}

/* ===========================
   MENU DE CONTEXTO (AÇÕES)
=========================== */
function openContextMenu(e, id, label) {
  e.preventDefault();
  const existing = document.querySelector('.ag-context-menu');
  if(existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'ag-context-menu';
  menu.style.top = `${e.clientY}px`;
  menu.style.left = `${e.clientX}px`;

  const ops = [
    { text: '⭐ Assistir mais tarde', action: () => setStatus(id, 'later') },
    { text: '✅ Marcar como assistido', action: () => setStatus(id, 'watched') },
    { text: '❌ Retirar aba', danger: true, action: () => toggleItem(id, label) }
  ];

  ops.forEach(op => {
    const div = document.createElement('div');
    div.className = `ag-context-menu-item ${op.danger ? 'danger' : ''}`;
    div.innerHTML = op.text;
    div.onclick = () => { op.action(); menu.remove(); };
    menu.appendChild(div);
  });

  document.body.appendChild(menu);
  setTimeout(() => { document.addEventListener('click', () => menu.remove(), {once:true}); }, 10);
}

/* ===========================
   ADICIONAR/REMOVER ABAS
=========================== */
function toggleItem(id, label) {
  if (id === CONFIG.FIXED_TAB) { showToast("Aba principal não pode ser removida"); return; }
  
  let order = getOrder();
  if (order.includes(id)) {
    order = order.filter(x => x !== id);
    showToast(`Removido: ${label}`);
  } else {
    if (order.length >= CONFIG.MAX_TABS) {
      order.splice(1, 1); // Remove a mais antiga (depois da fixa)
    }
    order.push(id);
    showToast(`Adicionado: ${label}`);
  }
  
  save(CONFIG.KEYS.ORDER, order);
  renderBar();
  renderDrawer(document.getElementById('ag-search-input')?.value || "", false);
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  if(!document.getElementById('ag-drawer')) {
    const bar = document.getElementById('filterScroller');
    const drawer = document.createElement('div');
    drawer.id = 'ag-drawer';
    bar.parentNode.insertBefore(drawer, bar.nextSibling);
  }
  renderBar();
});

})();
