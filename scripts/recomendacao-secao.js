<style>
    :root {
        --enterprise-blue: #007AFF;
        --dark-bg: #0f172a;
        --card-bg: #1e293b;
        --text-primary: #f8fafc;
        --text-secondary: #94a3b8;
        --glass: rgba(255, 255, 255, 0.05);
    }

    /* Scroller de Filtros */
    #filterScroller {
        display: flex;
        gap: 10px;
        padding: 15px;
        overflow-x: auto;
        background: var(--dark-bg);
        align-items: center;
        scrollbar-width: none;
    }

    .filter-tag {
        white-space: nowrap;
        padding: 8px 20px;
        border-radius: 12px;
        background: var(--glass);
        color: var(--text-secondary);
        border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }

    .filter-tag:hover {
        background: rgba(255,255,255,0.1);
        transform: translateY(-2px);
    }

    .filter-tag.active {
        background: var(--enterprise-blue);
        color: white;
        border-color: var(--enterprise-blue);
        box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
    }

    /* Botão Personalizar Especial */
    .config-tag {
        background: #2dd4bf !important;
        color: #0f172a !important;
        font-weight: 700 !important;
        margin-left: auto;
    }

    /* Modal Enterprise */
    .modal-overlay {
        position: fixed; inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    }

    .modal-content {
        background: var(--card-bg);
        width: 90%; max-width: 550px;
        max-height: 85vh;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.1);
        display: flex; flex-direction: column;
        color: white;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }

    .modal-header { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    
    .modal-input {
        width: 100%; padding: 12px;
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px; color: white; margin-top: 15px;
    }

    .section-grid { 
        padding: 20px; overflow-y: auto; 
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    }

    .section-item {
        padding: 15px; border-radius: 14px;
        background: var(--glass);
        border: 1px solid transparent;
        cursor: pointer; transition: 0.2s;
        display: flex; justify-content: space-between; align-items: center;
    }

    .section-item.selected {
        border-color: var(--enterprise-blue);
        background: rgba(0, 122, 255, 0.1);
    }

    .modal-footer { padding: 20px; display: flex; gap: 10px; justify-content: flex-end; }
    
    .btn-p { background: var(--enterprise-blue); color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .btn-s { background: transparent; color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 10px; cursor: pointer; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

<script>
class AniGeekEngine {
    constructor() {
        this.MAX = 12;
        this.KEY = 'anigeek_v2_order';
        this.allSections = [
            { id: 'manchetes', nome: 'Manchetes' }, { id: 'analises', nome: 'Análises' },
            { id: 'entrevistas', nome: 'Entrevistas' }, { id: 'lancamentos', nome: 'Lançamentos' },
            { id: 'podcast', nome: 'Podcast' }, { id: 'futebol', nome: 'Futebol' },
            { id: 'tecnologia', nome: 'Tecnologia' }, { id: 'reviews', nome: 'Reviews' },
            { id: 'trailers', nome: 'Trailers' }, { id: 'streaming', nome: 'Streaming' },
            { id: 'cosplay', nome: 'Cosplay' }, { id: 'eventos', nome: 'Eventos' },
            { id: 'esports', nome: 'eSports' }, { id: 'cinema', nome: 'Cinema' },
            { id: 'tv', nome: 'TV & Séries' }, { id: 'comunidade', nome: 'Comunidade' }
        ];
        this.order = this.load();
        this.init();
    }

    load() {
        const saved = localStorage.getItem(this.KEY);
        return saved ? JSON.parse(saved) : this.allSections.slice(0, 6).map(s => s.id);
    }

    save() {
        localStorage.setItem(this.KEY, JSON.stringify(this.order));
        this.renderBar();
    }

    renderBar() {
        const bar = document.getElementById('filterScroller');
        if (!bar) return;
        bar.innerHTML = '';

        this.order.forEach(id => {
            const sec = this.allSections.find(s => s.id === id);
            if (!sec) return;
            const btn = document.createElement('button');
            btn.className = 'filter-tag';
            btn.textContent = sec.nome;
            btn.onclick = (e) => this.activate(id, e.target);
            bar.appendChild(btn);
        });

        const cfg = document.createElement('button');
        cfg.className = 'filter-tag config-tag';
        cfg.innerHTML = '⚙ Configurar';
        cfg.onclick = () => this.openModal();
        bar.appendChild(cfg);

        // Ativa o primeiro por padrão
        const first = bar.querySelector('.filter-tag');
        if (first) first.click();
    }

    activate(id, el) {
        document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        console.log(`Carregando seção: ${id}`);
        window.carregarSecao?.(id);
    }

    openModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'modal-engine';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 style="margin:0">Personalizar Feed</h2>
                    <p style="color:var(--text-secondary); font-size:14px; margin:5px 0 0">Selecione suas seções favoritas (Máx ${this.MAX})</p>
                    <input type="text" id="m-search" class="modal-input" placeholder="Buscar categoria...">
                </div>
                <div class="section-grid" id="m-grid"></div>
                <div class="modal-footer">
                    <button class="btn-s" onclick="document.getElementById('modal-engine').remove()">Cancelar</button>
                    <button class="btn-p" id="m-save">Salvar Preferências</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('m-save').onclick = () => {
            this.save();
            modal.remove();
        };

        document.getElementById('m-search').oninput = (e) => this.renderGrid(e.target.value);
        this.renderGrid();
    }

    renderGrid(query = '') {
        const grid = document.getElementById('m-grid');
        grid.innerHTML = '';
        const search = query.toLowerCase();

        this.allSections.filter(s => s.nome.toLowerCase().includes(search)).forEach(sec => {
            const isSel = this.order.includes(sec.id);
            const item = document.createElement('div');
            item.className = `section-item ${isSel ? 'selected' : ''}`;
            item.innerHTML = `
                <span>${sec.nome}</span>
                <span style="font-size:12px">${isSel ? '●' : '○'}</span>
            `;
            item.onclick = () => {
                if (isSel) {
                    this.order = this.order.filter(i => i !== sec.id);
                } else if (this.order.length < this.MAX) {
                    this.order.push(sec.id);
                }
                this.renderGrid(query);
            };
            grid.appendChild(item);
        });
    }

    init() {
        window.addEventListener('load', () => this.renderBar());
    }
}

// Inicializa o Sistema
const AniGeek = new AniGeekEngine();
</script>
