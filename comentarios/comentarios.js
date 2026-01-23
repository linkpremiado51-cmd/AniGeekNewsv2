/**
 * Módulo de Comentários AniGeek
 * Este arquivo injeta a interface de comentários nas divs dinâmicas
 */

const interfaceComentarios = `
    <div class="comments-trigger-bar">
        <div class="trigger-left">
            <div class="avatars-stack">
                <div class="av-s" style="background:#e63946"></div>
                <div class="av-s" style="background:#457b9d"></div>
                <div class="av-s" style="background:#1d3557"></div>
            </div>
            <span>Discussão da comunidade...</span>
        </div>
        <i class="fa-solid fa-chevron-right" style="opacity: 0.5;"></i>
    </div>

    <div class="modal-geek-overlay">
        <div class="modal-geek-content">
            <div class="modal-geek-header">
                <div class="header-main-title">
                    <i class="fa-solid fa-comments"></i>
                    <span>Comunidade <small id="contagem-comentarios">Carregando...</small></span>
                </div>
                <button class="btn-geek-close">×</button>
            </div>
            
            <div class="modal-geek-body">
                <div class="lista-comentarios-fluxo"></div>
            </div>

            <div class="modal-geek-footer">
                <div class="input-wrapper-geek">
                    <div class="mini-my-avatar" style="background: #333;">Eu</div>
                    <input type="text" placeholder="Adicione um comentário..." class="input-comentario-real">
                    <button class="btn-send-geek"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    </div>
`;

function inicializarComentarios() {
    const containers = document.querySelectorAll('.container-comentarios-dinamico');

    containers.forEach(container => {
        // Evita duplicar se o script rodar mais de uma vez
        if (container.children.length > 0) return;

        container.innerHTML = interfaceComentarios;

        const trigger = container.querySelector('.comments-trigger-bar');
        const modal = container.querySelector('.modal-geek-overlay');
        const btnFechar = container.querySelector('.btn-geek-close');

        // Abrir Modal
        trigger.onclick = () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        // Fechar Modal
        btnFechar.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        // Fechar ao clicar fora (no overlay)
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        };
    });
}

// Executa a inicialização
inicializarComentarios();

