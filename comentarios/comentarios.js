import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Pegamos a instância do banco (O app já foi inicializado no analises.html)
const db = getFirestore();

const estilosComentarios = `
<style>
    .comments-trigger-bar { background: rgba(241, 243, 245, 0.8); border: 1px solid #e9ecef; border-radius: 16px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.3s ease; margin: 10px 0; }
    .comments-trigger-bar:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: var(--tema-cor, #e63946); }
    .avatars-stack { display: flex; margin-right: 12px; }
    .av-s { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; margin-left: -10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .modal-geek-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); z-index: 99999; display: none; justify-content: center; align-items: flex-end; }
    .modal-geek-overlay.active { display: flex; }
    .modal-geek-content { background: #fff; width: 100%; max-width: 650px; height: 85vh; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; box-shadow: 0 -10px 40px rgba(0,0,0,0.3); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .modal-geek-header { padding: 20px 24px; border-bottom: 1px solid #f1f3f5; display: flex; justify-content: space-between; align-items: center; }
    .header-main-title { font-weight: 800; font-size: 18px; color: #1a1a1a; display: flex; align-items: center; gap: 12px; }
    .btn-geek-close { background: #f8f9fa; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 20px; cursor: pointer; }
    .modal-geek-body { flex: 1; overflow-y: auto; padding: 24px; }
    .modal-geek-footer { padding: 20px 24px; border-top: 1px solid #f1f3f5; background: #fff; }
    .input-wrapper-geek { display: flex; align-items: center; background: #f1f3f5; padding: 12px 18px; border-radius: 30px; gap: 12px; border: 1.5px solid transparent; }
    .input-wrapper-geek:focus-within { background: #fff; border-color: var(--tema-cor, #e63946); }
    .input-wrapper-geek input { flex: 1; background: transparent; border: none; outline: none; font-size: 15px; }
    .btn-send-geek { background: none; border: none; color: var(--tema-cor, #e63946); cursor: pointer; font-size: 18px; }
    
    /* Card de Comentário Real */
    .comment-card { display: flex; gap: 12px; margin-bottom: 20px; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .user-avatar { width: 35px; height: 35px; border-radius: 50%; background: #ddd; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; flex-shrink: 0; }
    .comment-content { background: #f8f9fa; padding: 12px 16px; border-radius: 18px; border-top-left-radius: 2px; flex: 1; }
    .user-name { font-weight: 700; font-size: 13px; margin-bottom: 4px; display: block; }
    .user-text { font-size: 14px; color: #444; line-height: 1.4; }
</style>
`;

const htmlBase = `
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
                    <span>Comunidade <small class="txt-contagem">0 comentários</small></span>
                </div>
                <button class="btn-geek-close">×</button>
            </div>
            <div class="modal-geek-body">
                <div class="lista-comentarios-fluxo"></div>
            </div>
            <div class="modal-geek-footer">
                <div class="input-wrapper-geek">
                    <div class="mini-my-avatar" style="background: #e63946;">EU</div>
                    <input type="text" placeholder="Escreva um comentário..." class="input-comentario-real">
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

        const noticiaId = container.getAttribute('data-noticia-id');
        container.innerHTML = htmlBase;

        const modal = container.querySelector('.modal-geek-overlay');
        const listaFluxo = container.querySelector('.lista-comentarios-fluxo');
        const input = container.querySelector('.input-comentario-real');
        const btnSend = container.querySelector('.btn-send-geek');

        // 1. Abrir/Fechar Modal
        container.querySelector('.comments-trigger-bar').onclick = () => modal.classList.add('active');
        container.querySelector('.btn-geek-close').onclick = () => modal.classList.remove('active');

        // 2. Ouvir Comentários do Firebase (Sub-coleção)
        const path = `analises/${noticiaId}/comentarios`;
        const q = query(collection(db, path), orderBy("data", "asc"));

        onSnapshot(q, (snapshot) => {
            container.querySelector('.txt-contagem').innerText = `${snapshot.size} comentários`;
            listaFluxo.innerHTML = snapshot.docs.map(doc => {
                const c = doc.data();
                return `
                    <div class="comment-card">
                        <div class="user-avatar" style="background: #555">G</div>
                        <div class="comment-content">
                            <strong class="user-name">Geek Anonimo</strong>
                            <p class="user-text">${c.texto}</p>
                        </div>
                    </div>
                `;
            }).join('') || '<p style="text-align:center; color:#999; margin-top:20px;">Ninguém comentou ainda.</p>';
            
            // Scroll para o final quando chegar novo comentário
            const body = container.querySelector('.modal-geek-body');
            body.scrollTop = body.scrollHeight;
        });

        // 3. Função para Enviar
        const enviarComentario = async () => {
            const texto = input.value.trim();
            if (!texto) return;

            input.value = ""; // Limpa campo
            try {
                await addDoc(collection(db, path), {
                    texto: texto,
                    data: serverTimestamp(),
                    usuario: "Geek User" 
                });
            } catch (e) { console.error("Erro ao enviar:", e); }
        };

        btnSend.onclick = enviarComentario;
        input.onkeypress = (e) => { if(e.key === 'Enter') enviarComentario(); };
    });
}

inicializarComentarios();
