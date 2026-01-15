/**
 AniGeekNews – Enterprise Adaptive Section System
 • Modo Fixo vs Dinâmico
 • Prioridade por comportamento
 • Cabeçalho Netflix
 • Busca, limite, persistência
*/

(function(){

const MAX_SECOES = 12;
const ORDER_KEY = 'anigeek_secoes_order';
const MODE_KEY  = 'anigeek_section_mode';
const STATS_KEY = 'anigeek_section_stats';

/* ================= SEÇÕES ================= */

const SECOES = [
 {id:'manchetes', nome:'Manchetes'},
 {id:'analises', nome:'Análises'},
 {id:'entrevistas', nome:'Entrevistas'},
 {id:'lancamentos', nome:'Lançamentos'},
 {id:'podcast', nome:'Podcast'},
 {id:'futebol', nome:'Futebol'},
 {id:'tecnologia', nome:'Tecnologia'},
 {id:'reviews', nome:'Reviews'},
 {id:'trailers', nome:'Trailers'},
 {id:'streaming', nome:'Streaming'},
 {id:'cosplay', nome:'Cosplay'},
 {id:'eventos', nome:'Eventos'},
 {id:'esports', nome:'eSports'},
 {id:'cinema', nome:'Cinema'},
 {id:'tv', nome:'TV & Séries'},
 {id:'comunidade', nome:'Comunidade'},
 {id:'ranking', nome:'Ranking'}
];

/* ================= STORAGE ================= */

function getOrder(){
 const s = localStorage.getItem(ORDER_KEY);
 if(s){
  try{
   const arr = JSON.parse(s);
   if(Array.isArray(arr)) return arr;
  }catch(e){}
 }
 return SECOES.slice(0,7).map(s=>s.id);
}

function saveOrder(a){
 localStorage.setItem(ORDER_KEY, JSON.stringify(a));
}

function getMode(){
 return localStorage.getItem(MODE_KEY) || 'fixed';
}
function setMode(m){
 localStorage.setItem(MODE_KEY,m);
}

function getStats(){
 const s = localStorage.getItem(STATS_KEY);
 return s ? JSON.parse(s) : {};
}
function saveStats(o){
 localStorage.setItem(STATS_KEY,JSON.stringify(o));
}

/* ================= ALGORITMO ================= */

function calcDynamicOrder(){
 const stats = getStats();
 return [...SECOES]
 .map(sec=>{
   const st = stats[sec.id] || {clicks:0,time:0,last:0};
   const recency = Math.max(0, (Date.now()-st.last)/60000);
   const score = (st.clicks*2) + (st.time/60) - recency;
   return {id:sec.id,score};
 })
 .sort((a,b)=>b.score-a.score)
 .slice(0,MAX_SECOES)
 .map(i=>i.id);
}

/* ================= TRACK ================= */

let current = null;
let startTime = 0;

function trackSection(id){
 const stats = getStats();
 const now = Date.now();

 if(current){
  const delta = (now-startTime)/1000;
  stats[current] = stats[current] || {clicks:0,time:0,last:0};
  stats[current].time += delta;
 }

 stats[id] = stats[id] || {clicks:0,time:0,last:0};
 stats[id].clicks++;
 stats[id].last = now;

 saveStats(stats);

 current = id;
 startTime = now;
}

/* ================= RENDER ================= */

function renderBar(){
 const wrap = document.getElementById('filterScroller');
 if(!wrap) return;

 let order = getMode()==='dynamic' ? calcDynamicOrder() : getOrder();

 wrap.innerHTML = '';

 order.forEach((id,i)=>{
  const sec = SECOES.find(s=>s.id===id);
  if(!sec) return;

  const btn = document.createElement('button');
  btn.className = 'filter-tag';
  if(getMode()==='dynamic' && i<3) btn.classList.add('netflix-top');

  btn.textContent = sec.nome;
  btn.onclick = ()=>{
   document.querySelectorAll('.filter-tag').forEach(b=>b.classList.remove('active'));
   btn.classList.add('active');
   trackSection(sec.id);
   window.carregarSecao?.(sec.id);
  };
  wrap.appendChild(btn);
 });

 const cfg = document.createElement('button');
 cfg.className = 'filter-tag';
 cfg.innerHTML = '⚙';
 cfg.onclick = openModal;
 wrap.appendChild(cfg);

 const first = wrap.querySelector('.filter-tag');
 if(first){
  first.classList.add('active');
  trackSection(order[0]);
  window.carregarSecao?.(order[0]);
 }
}

/* ================= MODAL ================= */

function openModal(){
 if(document.getElementById('sec-modal')) return;

 const modal = document.createElement('div');
 modal.id = 'sec-modal';
 modal.style.cssText = `
 position:fixed;inset:0;
 background:rgba(0,0,0,.8);
 z-index:9999;
 display:flex;
 align-items:center;
 justify-content:center;`;

 modal.innerHTML = `
 <div style="background:#111;padding:20px;width:350px;color:white">
  <h3>Modo de Cabeçalho</h3>
  <button id="mode-fixed">🔒 Fixo</button>
  <button id="mode-dynamic">🤖 Dinâmico</button>
  <input id="sec-search" placeholder="Buscar..." style="width:100%;margin:10px 0">
  <div id="sec-list" style="max-height:300px;overflow:auto"></div>
  <button id="sec-save">Salvar</button>
  <button id="sec-close">Cancelar</button>
 </div>
 `;

 document.body.appendChild(modal);

 document.getElementById('mode-fixed').onclick=()=>setMode('fixed');
 document.getElementById('mode-dynamic').onclick=()=>setMode('dynamic');
 document.getElementById('sec-close').onclick=()=>modal.remove();
 document.getElementById('sec-save').onclick=()=>{
   modal.remove();
   renderBar();
 };
 document.getElementById('sec-search').oninput=renderModal;

 renderModal();
}

/* ================= LISTA ================= */

function renderModal(){
 const list = document.getElementById('sec-list');
 const search = document.getElementById('sec-search').value.toLowerCase();
 let order = getOrder();

 list.innerHTML='';

 SECOES.filter(s=>s.nome.toLowerCase().includes(search)).forEach(sec=>{
  const active = order.includes(sec.id);
  const row = document.createElement('div');

  const btn = document.createElement('button');
  btn.textContent = active?'Remover':'Adicionar';

  btn.onclick=()=>{
   if(active) order = order.filter(i=>i!==sec.id);
   else if(order.length<MAX_SECOES) order.push(sec.id);
   saveOrder(order);
   renderModal();
  };

  row.innerHTML=`<b>${sec.nome}</b>`;
  row.appendChild(btn);
  list.appendChild(row);
 });
}

/* ================= START ================= */

document.addEventListener('DOMContentLoaded',renderBar);

})();
