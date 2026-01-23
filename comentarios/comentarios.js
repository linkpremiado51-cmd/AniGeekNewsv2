/**
 * Módulo de Comentários AniGeek Pro
 * Gerencia a interface e o design dos comentários dinâmicos
 */

const estilosComentarios = `
<style>
    /* Trigger Bar Estilizada */
    .comments-trigger-bar {
        background: rgba(241, 243, 245, 0.8);
        border: 1px solid #e9ecef;
        border-radius: 16px;
        padding: 14px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin: 10px 0;
    }
    .comments-trigger-bar:hover {
        background: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        border-color: var(--tema-cor, #e63946);
    }

    /* Avatares em Stack */
    .avatars-stack { display: flex; margin-right: 12px; }
    .av-s { 
        width: 26px; height: 26px; 
        border-radius: 50%; 
        border: 2px solid #fff; 
        margin-left: -10px; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .av-s:first-child { margin-left: 0; }

    /* Modal Overlay com Blur */
    .modal-geek-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 99999; display: none;
        justify-content: center; align-items: flex-end;
    }
    .modal-geek-overlay.active { display: flex; }

    /* Conteúdo do Modal */
    .modal-geek-content {
        background: #fff; width: 100%; max-width: 650px;
        height: 85vh; border-radius: 24px 24px 0 0;
        display: flex; flex-direction: column;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp { 
        from { transform: translateY(100%); opacity: 0; } 
        to { transform: translateY(0); opacity: 1; } 
    }

    /* Header */
    .modal-geek-header {
        padding: 20px 24px; border-bottom: 1px solid #f1f3f5;
        display: flex; justify-content: space-between; align-items: center;
    }
    .header-main-title { font-weight: 800; font-size: 18px; color: #1a1a1a; display: flex; align-items: center; gap: 12px; }
    .header-main-title i { color: var(--tema-cor, #e63946); }
    .header-main-title small { font-weight: 500; color: #adb5bd; font-size: 13px; }
    .btn-geek-close { background: #f8f9fa; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 20px; color: #495057; cursor: pointer; transition: 0.2s; }
    .btn-geek-close:hover { background: #e9ecef; transform: rotate(90deg); }

    /* Corpo */
    .modal-geek-body { flex: 1; overflow-y: auto; padding: 24px; scroll-behavior: smooth; }
    
    /* Input Footer */
    .modal-geek-footer { padding: 20px 24px; border-top: 1px solid #f1f3f5; background: #fff; }
    .input-wrapper-geek {
        display: flex; align-items: center; background: #f1f3f5;
        padding: 12px 18px; border-radius: 30px; gap: 12px;
        transition: all 0.2s; border: 1.5px solid transparent;
    }
    .input-wrapper-geek:focus-within {
        background: #fff; border-color: var(--tema-cor, #e63946);
        box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.1);
    }
    .mini-my-avatar { width: 30px; height: 30px; border-radius: 50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:11px; flex-shrink:0; }
    .input-wrapper-geek input { flex: 1; background: transparent; border: none; outline: none; font-size: 15px; color: #212529; }
    .btn-send-geek { background: none; border: none; color: var(--tema-cor, #e63946); cursor: pointer; font-size: 18px; transition: 0.2s; }
    .btn-send-geek:hover { transform: scale(1.15) translateX(2px); }
</style>
`;

const interfaceComentarios = `
    ${estilosComentarios}
    <div class="comments-trigger-bar">
        <div class="trigger-left" style="display: flex; align-items: center;">
            <div class="avatars-stack">
                <div class="av-s" style="background:#ff4757"></div>
                <div class="av-s" style="background:#2f3542"></div>
                <div class="av-s" style="background:#747d8c"></div>
            </div>
            <span style="font-weight: 600; color: #495057; font-size: 14px;">Discussão da comunidade...</span>
        </div>
        <i class="fa-solid fa-chevron-right" style="color: #adb5bd;"></i>
    </div>

    <div class="modal-geek-overlay">
        <div class="modal-geek-content">
            <div class="modal-geek-header">
                <div class="header-main-title">
                    <i class="fa-solid fa-comments"></i>
                    <span>Comunidade <small id="contagem-comentarios">0 comentários</small></span>
                </div>
                <button class="btn-geek-close">×</button>
            </div>
            
            <div class="modal-geek-body">
                <div class="lista-comentarios-fluxo">
                   <div style="text-align: center; color: #adb5bd; margin-top: 40px;">
                      <i class="fa-solid fa-feather-pointed" style="font-size: 30px; margin-bottom: 10px;"></i>
                      <p>Seja o primeiro a comentar!</p>
                   </div>
                </div>
            </div>

            <div class="modal-geek-footer">
                <div class="input-wrapper-geek">
                    <div class="mini-my-avatar" style="background: #e63946;">EU</div>
                    <input type="text" placeholder="Adicione um comentário público..." class="input-comentario-real">
                    <button class="btn-send-geek"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    </div>
`;

function inicializarComentarios() {
    const containers = document.querySelectorAll('.container-comentarios-dinamico');

    containers.forEach(container => {
        if (container.children.length > 0) return;

        container.innerHTML = interfaceComentarios;

        const trigger = container.querySelector('.comments-trigger-bar');
        const modal = container.querySelector('.modal-geek-overlay');
        const btnFechar = container.querySelector('.btn-geek-close');

        trigger.onclick = () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        btnFechar.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

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
