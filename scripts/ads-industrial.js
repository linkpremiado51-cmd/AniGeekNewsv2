(function() {
    // === 1. GESTÃO DE ESTADO E MONITORAMENTO ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    // === 2. CONTAINER MESTRE (ROOT) ===
    const adsRoot = document.createElement('div');
    adsRoot.id = 'industrial-ads-system';
    document.body.appendChild(adsRoot);

    // === 3. ESTILOS ===
    const style = document.createElement('style');
    style.textContent = `/* todo seu CSS aqui */`; // mantém o CSS que você já colocou
    document.head.appendChild(style);

    // === 4. HTML dos blocos ===
    adsRoot.innerHTML = `
        <div id="ind-block-1" class="ind-banner ind-bottom">
            <div class="ind-container">
                <div class="ind-header">
                    <span class="ind-label">Oferta Patrocinada</span>
                    <button id="ind-close-1" class="ind-close-btn">Fechar</button>
                </div>
                <div class="ind-slot-300x250 ind-shimmer pulse-ad"></div>
            </div>
        </div>

        <div id="ind-block-2-overlay" class="ind-overlay">
            <div class="ind-modal">
                <div class="ind-header">
                    <span class="ind-label">Publicidade</span>
                    <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde</button>
                </div>
                <div class="ind-slot-hero ind-shimmer"></div>
                <div class="ind-progress-bg"><div id="ind-prog-2" class="ind-progress-fill"></div></div>
                <div class="ind-footer">
                    <span id="ind-timer-txt" style="font-size:11px; font-weight:900; color:#000;">AGUARDE...</span>
                    <a href="#" target="_blank" class="ind-cta">Visitar Site</a>
                </div>
            </div>
        </div>

        <div id="ind-block-3" class="ind-banner ind-top">
            <div class="ind-container">
                <div class="ind-header">
                    <span class="ind-label">Destaque Informativo</span>
                    <button id="ind-close-3" class="ind-close-btn">Fechar</button>
                </div>
                <div class="ind-slot-top ind-shimmer"></div>
            </div>
        </div>
    `;

    // === 5. FUNÇÕES ===
    const b1 = document.getElementById('ind-block-1');
    const b2Overlay = document.getElementById('ind-block-2-overlay');
    const b2Modal = b2Overlay.querySelector('.ind-modal');
    const b3 = document.getElementById('ind-block-3');

    const openB1 = () => b1.style.bottom = '0px';
    const openB3 = () => b3.style.top = '0px';

    document.getElementById('ind-close-1').onclick = () => {
        b1.style.bottom = '-600px';
        setTimeout(openB1, 8000); // tempo menor pra teste
    };

    document.getElementById('ind-close-3').onclick = () => {
        b3.style.top = '-600px';
        setTimeout(openB3, 8000); // tempo menor pra teste
    };

    function startInterstitial() {
        setTimeout(() => {
            b2Overlay.style.display = 'flex';
            setTimeout(() => {
                b2Overlay.style.opacity = '1';
                b2Modal.style.transform = 'translateY(0)';
            }, 50);

            let timeLeft = 7; // tempo menor pra teste
            const totalDuration = 7;
            const btn = document.getElementById('ind-close-2');
            const prog = document.getElementById('ind-prog-2');
            const txt = document.getElementById('ind-timer-txt');

            const countdown = setInterval(() => {
                if (isTabActive) {
                    if (timeLeft > 0) {
                        timeLeft--;
                        txt.innerText = `ACESSO EM ${timeLeft}S`;
                        prog.style.width = `${((totalDuration - timeLeft)/totalDuration)*100}%`;
                    } else {
                        clearInterval(countdown);
                        txt.innerText = "PRONTO PARA ACESSAR";
                        btn.innerText = "PULAR ANÚNCIO";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                }
            }, 1000);

            btn.onclick = () => {
                b2Overlay.style.opacity = '0';
                b2Modal.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    b2Overlay.style.display = 'none';
                    setTimeout(startInterstitial, 18000); // reinicia
                }, 500);

                // reset imediato
                timeLeft = 7;
                btn.disabled = true;
                btn.classList.remove('ready');
                btn.innerText = "Aguarde";
                prog.style.width = "0%";
            };
        }, 7000); // delay inicial menor pra teste
    }

    // Inicializa
    setTimeout(openB1, 2000);
    setTimeout(openB3, 4000);
    startInterstitial();

})();
