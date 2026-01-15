/* ======================================================
   AniGeekNews – Enterprise Section System v6
   • Harmonia Estrutural e Proporção Fixa
   • Sessões e Subcategorias Agrupadas
   • Ícones Profissionais e Comportamento Adaptativo
====================================================== */

(function(){

const MAX = 12;
const KEY_ORDER = 'ag_sections_order';
const KEY_MODE  = 'ag_sections_mode';
const KEY_STATS = 'ag_sections_stats';

/* ===========================
   DATABASE ESTRUTURADO
=========================== */
const ESTRUTURA = [
  {
    titulo: "MANCHETES",
    sub: ["Destaques do Dia", "Últimas Notícias", "Trending", "Exclusivos", "Urgente", "Mais Lidas", "Editor’s Pick"]
  },
  {
    titulo: "ANÁLISES",
    sub: ["Opinião", "Crítica Técnica", "Análise de Mercado", "Comparativos", "Teorias", "Explicações", "Indústria"]
  },
  {
    titulo: "ENTREVISTAS",
    sub: ["Desenvolvedores", "Criadores", "Atores", "Influencers", "Profissionais", "Comunidade"]
  },
  {
    titulo: "LANÇAMENTOS",
    sub: ["Jogos", "Animes", "Filmes", "Séries", "Tecnologia", "Mangás", "Datas", "Rumores"]
  },
  {
    titulo: "REVIEWS",
    sub: ["Games Review", "Anime Review", "Movie Review", "Tech Review", "Produtos Geek", "Streaming Review"]
  },
  {
    titulo: "TRAILERS",
    sub: ["Game Trailers", "Movie Trailers", "Teasers", "Oficiais", "Gameplay Reveal"]
  },
  {
    titulo: "STREAMING",
    sub: ["Netflix", "Prime Video", "Disney+", "HBO Max", "Crunchyroll", "Star+", "Apple TV+"]
  },
  {
    titulo: "PODCAST",
    sub: ["Episódios", "Temas Geek", "Games Cast", "Tech Cast", "Cultura Pop", "Bastidores"]
  },
  {
    titulo: "FUTEBOL",
    sub: ["Mercado da Bola", "Futebol Inter", "Futebol Nacional", "Estatísticas", "Tabelas"]
  },
  {
    titulo: "TECNOLOGIA",
    sub: ["Smartphones", "Hardware", "Software", "IA", "Games Tech", "Inovação"]
  },
  {
    titulo: "COSPLAY",
    sub: ["Destaques Cosplay", "Guias", "Fotos", "Entrevistas Cosplay"]
  },
  {
    titulo: "EVENTOS",
    sub: ["Feiras Geek", "Campeonatos", "Convenções", "Cobertura Ao Vivo"]
  },
  {
    titulo: "ESPORTS",
    sub: ["Times", "Jogadores", "Resultados", "Agenda eSports"]
  },
  {
    titulo: "CINEMA",
    sub: ["Bilheteria", "Premiações", "Produção", "Cinema News"]
  },
  {
    titulo: "TV & SÉRIES",
    sub: ["Renovadas", "Canceladas", "Episódios News", "TV News"]
  },
  {
    titulo: "COMUNIDADE",
    sub: ["Enquetes", "Fanarts", "Teorias", "Voz do Leitor"]
  },
  {
    titulo: "RANKING",
    sub: ["Melhores do Ano", "Top Games", "Top Animes", "Votação Público"]
  }
];

// Flatten para busca e lógica de ID
const SECOES = [];
ESTRUTURA.forEach(s => {
    s.sub.forEach(nome => {
        SECOES.push({ id: nome.toLowerCase().replace(/ /g, '_'), nome: nome, pai: s.titulo });
    });
});

/* ===========================
   CSS ATUALIZADO
=========================== */
const styles = `
  #ag-drawer {
    background: #fff;
    border-bottom: 2px solid #eee;
    overflow-y: auto;
    max-height: 0;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 1000;
  }

  body.dark-mode #ag-drawer { background: #0f0f0f; border-color: #222; }
  #ag-drawer.open { max-height: 85vh; padding: 20px 0; }

  .ag-drawer-container { max-width: 1000px; margin: 0 auto; padding: 0 15px; }

  /* Barra de Pesquisa Profissional */
  .ag-search-wrapper {
    position: relative;
    margin-bottom: 25px;
  }
  .ag-search-input {
    width: 100%;
    padding: 12px 15px 12px 45px;
    border-radius: 12px;
    border: 1px solid rgba(128,128,128,0.2);
    background: rgba(128,128,128,0.05);
    color: inherit;
    font-size: 15px;
    outline: none;
  }
  .ag-search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>') no-repeat center;
    opacity: 0.6;
  }

  /* Harmonia de Tamanho nos Botões */
  .filter-tag {
    min-width: 110px; /* Tamanho fixo para harmonia */
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
    border-radius: 6px;
    position: relative;
    border: 1px solid transparent;
  }

  /* Ícone de fechar (X) ou Mover (3 pontos) */
  .tag-action-icon {
    position: absolute;
    top: 2px;
    right: 4px;
    font-size: 9px;
    line-height: 1;
    opacity: 0.7;
  }

  /* Agrupamento por Sessões */
  .ag-session-block {
    margin-bottom: 30px;
  }
  .ag-session-title {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 800;
    color: var(--primary-color, #e50914);
    margin-bottom: 12px;
    letter-spacing: 1px;
  }
  .ag-session-title::before {
    content: "";
    width: 4px;
    height: 16px;
    background: currentColor;
    margin-right: 8px;
    border-radius: 2px;
  }

  .ag-grid-sub {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }

  /* Modo Fixo - Estilo 3 pontos */
  .mode-fixed-dots::after {
    content: "⋮";
    position: absolute;
    right: 5px;
    font-size: 14px;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   LÓGICA CORE
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }
function getMode(){ return localStorage.getItem(KEY_MODE) || 'dynamic'; }
function getOrder(){ return load(KEY_ORDER, SECOES.slice(0,7).map(s=>s.id)); }

function toggleDrawer(){
    const d = document.getElementById('ag-drawer');
    d.classList.toggle('open');
    if(d.classList.contains('open')) renderDrawer();
}

/* ===========================
   RENDERIZAÇÃO
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
    const mode = getMode();
    bar.innerHTML = '';

    order.forEach(id => {
        const sec = SECOES.find(s => s.id === id);
        if(!sec) return;
        const btn = document.createElement('button');
        btn.className = `filter-tag ${mode === 'fixed' ? 'mode-fixed-dots' : ''}`;
        btn.innerHTML = `<span>${sec.nome}</span>`;
        bar.appendChild(btn);
    });

    const cfg = document.createElement('button');
    cfg.className = 'filter-tag cfg-btn';
    cfg.innerHTML = '⚙';
    cfg.onclick = toggleDrawer;
    bar.appendChild(cfg);
}

function renderDrawer(filter = ""){
    const drawer = document.getElementById('ag-drawer');
    const order = getOrder();
    const mode = getMode();

    drawer.innerHTML = `
        <div class="ag-drawer-container">
            <div class="ag-drawer-header">
                <div class="ag-search-wrapper">
                    <div class="ag-search-icon"></div>
                    <input type="text" class="ag-search-input" id="ag-search" placeholder="Pesquisar categoria ou subcategoria..." value="${filter}">
                </div>
                <div class="ag-mode-toggle" style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
                    <button class="mode-btn ${mode==='fixed'?'active':''}" onclick="localStorage.setItem('ag_sections_mode','fixed'); location.reload()">FIXO</button>
                    <button class="mode-btn ${mode==='dynamic'?'active':''}" onclick="localStorage.setItem('ag_sections_mode','dynamic'); location.reload()">DINÂMICO</button>
                </div>
            </div>
            <div id="ag-sessions-list"></div>
        </div>
    `;

    const list = drawer.querySelector('#ag-sessions-list');
    const search = drawer.querySelector('#ag-search');
    search.focus();
    search.oninput = (e) => renderDrawer(e.target.value);

    ESTRUTURA.forEach(sessao => {
        const subsFiltradas = sessao.sub.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
        if(subsFiltradas.length === 0) return;

        const block = document.createElement('div');
        block.className = 'ag-session-block';
        block.innerHTML = `<div class="ag-session-title">${sessao.titulo}</div>`;
        
        const grid = document.createElement('div');
        grid.className = 'ag-grid-sub';

        subsFiltradas.forEach(nome => {
            const id = nome.toLowerCase().replace(/ /g, '_');
            const isSelected = order.includes(id);
            const btn = document.createElement('button');
            btn.className = `filter-tag ${isSelected ? 'active is-selected' : ''}`;
            
            // Lógica do ícone (X para remover ou 3 pontos para mover no modo fixo)
            let icon = "";
            if(isSelected) {
                icon = mode === 'fixed' ? '<span class="tag-action-icon">⋮</span>' : '<span class="tag-action-icon">✕</span>';
            }

            btn.innerHTML = `<span>${nome}</span>${icon}`;
            
            btn.onclick = () => {
                let current = getOrder();
                if(isSelected) {
                    current = current.filter(i => i !== id);
                } else {
                    if(current.length < MAX) current.push(id);
                }
                save(KEY_ORDER, current);
                renderBar();
                renderDrawer(search.value);
            };
            grid.appendChild(btn);
        });
        
        block.appendChild(grid);
        list.appendChild(block);
    });
}

document.addEventListener('DOMContentLoaded', renderBar);

})();
