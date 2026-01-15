export async function inicializarMegaMenu() {
    // Carrega CSS
    if (!document.getElementById('menu-css')) {
        const link = document.createElement('link');
        link.id = 'menu-css';
        link.rel = 'stylesheet';
        link.href = 'menu/menu.css';
        document.head.appendChild(link);
    }

    // Container no index.html
    const container = document.getElementById('megaMenuContainer');
    if (!container) return;

    // Carrega HTML
    const response = await fetch('menu/menu.html');
    container.innerHTML = await response.text();

    const overlay = document.getElementById('megaOverlay');
    const btnFechar = document.getElementById('btnFecharMega');

    window.abrirMegaMenu = () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const fecharMegaMenu = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    btnFechar.onclick = fecharMegaMenu;

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            fecharMegaMenu();
        }
    };

    /* =====================================================
       🔥 CONEXÃO DO MEGA MENU COM carregarSecao()
       ===================================================== */

    const linksSecao = overlay.querySelectorAll('[data-secao]');

    linksSecao.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const secao = link.dataset.secao;
            if (!secao) return;

            // Usa o motor principal do site
            if (typeof window.carregarSecao === 'function') {
                window.carregarSecao(secao);
            }

            // Fecha o Mega Menu
            fecharMegaMenu();

            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
