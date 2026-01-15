/**
 * @fileoverview AniGeek News - Enterprise Section Management System
 * Versão: 2.0.0
 * Descrição: Gerenciamento dinâmico de seções com persistência e UI otimizada.
 */

class SectionManager {
    constructor(config = {}) {
        this.STORAGE_KEY = 'anigeek_secoes_order';
        this.MAX_SECTIONS = 12;
        this.DEFAULT_LIMIT = 7;
        
        this.sections = config.sections || [];
        this.activeOrderId = this._loadOrder();
        
        this.init();
    }

    /* ===========================
       LÓGICA DE DADOS (CORE)
    =========================== */

    _loadOrder() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : null;
            return Array.isArray(parsed) ? parsed : this.sections.slice(0, this.DEFAULT_LIMIT).map(s => s.id);
        } catch (error) {
            console.error("Critical Error loading sections:", error);
            return this.sections.slice(0, this.DEFAULT_LIMIT).map(s => s.id);
        }
    }

    _saveOrder(newOrder) {
        this.activeOrderId = newOrder;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newOrder));
    }

    toggleSection(id) {
        let currentOrder = [...this.activeOrderId];
        const index = currentOrder.indexOf(id);

        if (index > -1) {
            currentOrder.splice(index, 1);
        } else if (currentOrder.length < this.MAX_SECTIONS) {
            currentOrder.push(id);
        } else {
            this._notifyUser("Limite máximo de seções atingido.");
            return false;
        }

        this._saveOrder(currentOrder);
        return true;
    }

    /* ===========================
       COMPONENTES DE INTERFACE
    =========================== */

    renderBar() {
        const container = document.getElementById('filterScroller');
        if (!container) return;

        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        this.activeOrderId.forEach(id => {
            const section = this.sections.find(s => s.id === id);
            if (!section) return;

            const btn = this._createTag(section.nome, () => this._handleSectionClick(id, btn));
            fragment.appendChild(btn);
        });

        // Botão de Configuração (Aparência Executiva)
        const settingsBtn = this._createTag('⚙ Personalizar', () => this.openModal(), 'config-tag');
        fragment.appendChild(settingsBtn);

        container.appendChild(fragment);
        this._autoSelectFirst(container);
    }

    _createTag(label, onClick, extraClass = '') {
        const btn = document.createElement('button');
        btn.className = `filter-tag ${extraClass}`;
        btn.textContent = label;
        btn.addEventListener('click', onClick);
        return btn;
    }

    _handleSectionClick(id, element) {
        document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
        element.classList.add('active');
        window.carregarSecao?.(id);
    }

    _autoSelectFirst(container) {
        const first = container.querySelector('.filter-tag:not(.config-tag)');
        if (first && this.activeOrderId[0]) {
            first.classList.add('active');
            window.carregarSecao?.(this.activeOrderId[0]);
        }
    }

    /* ===========================
       SISTEMA DE MODAL (UI/UX)
    =========================== */

    openModal() {
        if (document.getElementById('sec-modal')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'sec-modal';
        modalOverlay.className = 'modal-overlay';
        
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <header class="modal-header">
                    <h3>Gerenciar Seções</h3>
                    <p>Selecione até ${this.MAX_SECTIONS} categorias para sua home.</p>
                </header>
                <div class="modal-body">
                    <input type="text" id="sec-search" placeholder="Pesquisar categoria..." class="modal-input">
                    <div id="sec-list" class="section-grid"></div>
                </div>
                <footer class="modal-footer">
                    <button id="sec-close" class="btn-secondary">Cancelar</button>
                    <button id="sec-save" class="btn-primary">Aplicar Alterações</button>
                </footer>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        
        // Bindings
        document.getElementById('sec-close').onclick = () => modalOverlay.remove();
        document.getElementById('sec-save').onclick = () => { modalOverlay.remove(); this.renderBar(); };
        document.getElementById('sec-search').oninput = (e) => this._renderModalList(e.target.value);

        this._renderModalList();
    }

    _renderModalList(filter = '') {
        const listContainer = document.getElementById('sec-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        const searchLower = filter.toLowerCase();

        this.sections
            .filter(s => s.nome.toLowerCase().includes(searchLower))
            .forEach(sec => {
                const isActive = this.activeOrderId.includes(sec.id);
                const item = document.createElement('div');
                item.className = `section-item ${isActive ? 'selected' : ''}`;
                
                item.innerHTML = `
                    <span>${sec.nome}</span>
                    <button class="action-btn">${isActive ? 'Remover' : 'Adicionar'}</button>
                `;

                item.onclick = () => {
                    if (this.toggleSection(sec.id)) this._renderModalList(filter);
                };

                listContainer.appendChild(item);
            });
    }

    _notifyUser(msg) {
        alert(msg); // Em um sistema real, use um Toast/Snackbar
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.renderBar());
    }
}

// Inicialização
const sectionsData = [
    { id: 'manchetes', nome: 'Manchetes' },
    { id: 'analises', nome: 'Análises' },
    { id: 'entrevistas', nome: 'Entrevistas' },
    { id: 'lancamentos', nome: 'Lançamentos' },
    { id: 'podcast', nome: 'Podcast' },
    { id: 'futebol', nome: 'Futebol' },
    { id: 'tecnologia', nome: 'Tecnologia' },
    { id: 'reviews', nome: 'Reviews' },
    { id: 'trailers', nome: 'Trailers' },
    { id: 'streaming', nome: 'Streaming' },
    { id: 'cosplay', nome: 'Cosplay' },
    { id: 'eventos', nome: 'Eventos' },
    { id: 'esports', nome: 'eSports' },
    { id: 'cinema', nome: 'Cinema' },
    { id: 'tv', nome: 'TV & Séries' },
    { id: 'comunidade', nome: 'Comunidade' },
    { id: 'ranking', nome: 'Ranking' }
];

const NewsApp = new SectionManager({ sections: sectionsData });
