<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comentários Multi-Coleção</title>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <script type="module">
        import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
        
        const db = getFirestore();
        
        const htmlBase = `
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
                if (container.getAttribute('data-loaded') === 'true') return;
                
                const noticiaId = container.getAttribute('data-noticia-id');
                if (!noticiaId) return;
                
                container.innerHTML = htmlBase;
                container.setAttribute('data-loaded', 'true');
                
                const modal = container.querySelector('.modal-geek-overlay');
                const listaFluxo = container.querySelector('.lista-comentarios-fluxo');
                const input = container.querySelector('.input-comentario-real');
                const btnSend = container.querySelector('.btn-send-geek');
                
                container.querySelector('.comments-trigger-bar').onclick = e => {
                    e.preventDefault();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                };
                
                container.querySelector('.btn-geek-close').onclick = () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                };
                
                const colecaoAtual = container.getAttribute('data-colecao') || 'analises';
                
                // Enviar comentário
                const enviarComentario = async () => {
                    const texto = input.value.trim();
                    if (!texto) return;
                    input.value = "";
                    try {
                        const path = `${colecaoAtual}/${noticiaId}/comentarios`;
                        await addDoc(collection(db, path), {
                            texto: texto,
                            data: serverTimestamp(),
                            usuario: "Geek User"
                        });
                    } catch (e) {
                        console.error("Erro ao enviar:", e);
                    }
                };
                
                btnSend.onclick = enviarComentario;
                input.onkeypress = e => { if (e.key === 'Enter') enviarComentario(); };
            });
        }
        
        window.inicializarComentarios = inicializarComentarios;
        
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                inicializarComentarios();
            }
        });
    </script>
</head>

<body>
    <!-- Container de comentários -->
    <div class="container-comentarios-dinamico" data-noticia-id="exemplo-123" data-colecao="analises"></div>
</body>

</html>
