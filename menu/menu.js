// menu/menu.js

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function inicializarMegaMenu() {

    /* =========================================
       CARREGA CSS DO MENU
    ========================================= */
    if (!document.getElementById('menu-css')) {
        const link = document.createElement('link');
        link.id = 'menu-css';
        link.rel = 'stylesheet';
        link.href = 'menu/menu.css';
        document.head.appendChild(link);
    }

    /* =========================================
       CONTAINER
    ========================================= */
    const container = document.getElementById('megaMenuContainer');
    if (!container) return;

    /* =========================================
       CARREGA HTML
    ========================================= */
    const response = await fetch('menu/menu.html');
    container.innerHTML = await response.text();

    const overlay = document.getElementById('megaOverlay');
    const btnFechar = document.getElementById('btnFecharMega');

    if (!overlay || !btnFechar) return;

    /* =========================================
       FUNÇÃO CENTRAL DE FECHAMENTO
    ========================================= */
    const fecharMegaMenu = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    /* =========================================
       ABRIR / FECHAR MENU
    ========================================= */
    window.abrirMegaMenu = () => {
        const menuAberto = overlay.classList.contains('active');

        if (menuAberto) {
            fecharMegaMenu();
        } else {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    /* =========================================
       BOTÃO X
    ========================================= */
    btnFechar.onclick = fecharMegaMenu;

    /* =========================================
       CLICK FORA
    ========================================= */
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            fecharMegaMenu();
        }
    };

    /* =========================================
       LINKS DE SEÇÃO
    ========================================= */
    const linksSecao = overlay.querySelectorAll('[data-secao]');

    linksSecao.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const secao = link.dataset.secao;
            if (!secao) return;

            if (typeof window.carregarSecao === 'function') {
                window.carregarSecao(secao);
            }

            fecharMegaMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    /* =========================================
       🔐 LOGIN / CADASTRO
    ========================================= */
    const btnLogin = document.getElementById('btnAbrirLogin');
    const btnCadastro = document.getElementById('btnAbrirCadastro');

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.location.href = 'acesso.html';
        });
    }

    if (btnCadastro) {
        btnCadastro.addEventListener('click', () => {
            window.location.href = 'acesso.html#signup';
        });
    }

    /* =========================================
       🔥 INTEGRAÇÃO FIREBASE AUTH
    ========================================= */
    const auth = getAuth();

    const areaLogado = overlay.querySelector('[data-auth="logged-in"]');
    const areaDeslogado = overlay.querySelector('[data-auth="logged-out"]');
    const userNameEl = document.getElementById('userName');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // USUÁRIO LOGADO
            if (areaLogado) areaLogado.style.display = 'block';
            if (areaDeslogado) areaDeslogado.style.display = 'none';

            const nome =
                user.displayName ||
                user.email?.split('@')[0] ||
                'Usuário';

            if (userNameEl) {
                userNameEl.textContent = nome;
            }

        } else {
            // USUÁRIO DESLOGADO
            if (areaLogado) areaLogado.style.display = 'none';
            if (areaDeslogado) areaDeslogado.style.display = 'block';

            if (userNameEl) {
                userNameEl.textContent = 'Usuário';
            }
        }
    });
}
