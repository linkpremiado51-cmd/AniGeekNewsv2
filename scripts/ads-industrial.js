(function() {
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    const initAds = () => {
        // Busca o container ou cria se não existir
        let adsRoot = document.getElementById('premium-ads-system');
        if (!adsRoot) {
            adsRoot = document.createElement('div');
            adsRoot.id = 'premium-ads-system';
            document.body.appendChild(adsRoot);
        }

        // === ESTILIZAÇÃO DAS GAVETAS E OVERLAY ===
        const style = document.createElement('style');
        style.textContent = `
            .premium-banner { 
                position: fixed; left: 0; width: 100%; z-index: 2147483646; 
                background: #ffffff; box-shadow: 0 0 15px rgba(0,0,0,0.2); 
                transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .premium-bottom { bottom: -150px; border-top: 2px solid #333; }
            .premium-top { top: -150px; border-bottom: 2px solid #333; }
            
            .premium-container { max-width: 100%; margin: 0 auto; padding: 15px; position: relative; display: flex; flex-direction: column; align-items: center; }
            .ad-label { font-size: 10px; color: #666; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
            .ad-close-x { position: absolute; right: 10px; top: 10px; background: #333; color: #fff; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; z-index: 10; }
            
            .ad-slot-placeholder { background: #f0f0f0; border: 1px dashed #999; width: 320px; height: 50px; display: flex; align-items: center; justify-content: center; color: #666; font-weight: bold; }

            /* Interstitial (Cobre a tela toda) */
            .premium-overlay { 
                position: fixed; inset: 0; background: rgba(0,0,0,0.9); 
                z-index: 2147483647; display: none; align-items: center; justify-content: center; 
                opacity: 0; transition: opacity 0.5s ease;
            }
            .premium-modal { 
                background: #fff; width: 90%; max-width: 400px; padding: 30px; 
                border-radius: 12px; text-align: center; position: relative;
            }
            .premium-prog-bg { width: 100%; height: 8px; background: #eee; margin: 20px 0; border-radius: 4px; overflow: hidden; }
            .premium-prog-fill { width: 0%; height: 100%; background: #e74c3c; transition: width 0.1s linear; }
            .btn-premium-skip { 
                width: 100%; padding: 15px; border: none; border-radius: 5px; 
                background: #ccc; color: #fff; font-weight: bold; cursor: not-allowed; 
            }
            .btn-premium-skip.ready { background: #2ecc71; cursor: pointer; }
        `;
        document.head.appendChild(style);

        // === INSERINDO O HTML ===
        adsRoot.innerHTML = `
            <div id="p-block-top" class="premium-banner premium-top">
                <div class="premium-container">
                    <button class="ad-close-x" onclick="document.getElementById('p-block-top').style.top='-150px'">×</button>
                    <span class="ad-label">Publicidade Superior</span>
                    <div class="ad-slot-placeholder">ANÚNCIO TOPO 728x90</div>
                </div>
            </div>

            <div id="p-block-bottom" class="premium-banner premium-bottom">
                <div class="premium-container">
                    <button class="ad-close-x" onclick="document.getElementById('p-block-bottom').style.bottom='-150px'">×</button>
                    <span class="ad-label">Publicidade Inferior</span>
                    <div class="ad-slot-placeholder">ANÚNCIO RODAPÉ 320x50</div>
                </div>
            </div>

            <div id="p-overlay" class="premium-overlay">
                <div class="premium-modal">
                    <h3>Aguarde o Carregamento</h3>
                    <div class="ad-slot-placeholder" style="height: 200px; width: 100%;">ANÚNCIO INTERSTITIAL</div>
                    <div class="premium-prog-bg"><div id="p-prog-fill" class="premium-prog-fill"></div></div>
                    <button id="p-btn-skip" class="btn-premium-skip" disabled>AGUARDE...</button>
                </div>
            </div>
        `;

        // === LÓGICA DE APARIÇÃO ===

        // 1. Gaveta Superior (2 segundos)
        setTimeout(() => {
            document.getElementById('p-block-top').style.top = '0px';
        }, 2000);

        // 2. Gaveta Inferior (4 segundos)
        setTimeout(() => {
            document.getElementById('p-block-bottom').style.bottom = '0px';
        }, 4000);

        // 3. Interstitial (10 segundos para teste)
        setTimeout(() => {
            const overlay = document.getElementById('p-overlay');
            const fill = document.getElementById('p-prog-fill');
            const btn = document.getElementById('p-btn-skip');
            
            overlay.style.display = 'flex';
            setTimeout(() => overlay.style.opacity = '1', 50);

            let progress = 0;
            const interval = setInterval(() => {
                if (isTabActive) {
                    progress += 2;
                    fill.style.width = progress + '%';
                    if (progress >= 100) {
                        clearInterval(interval);
                        btn.innerText = "PULAR ANÚNCIO";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                }
            }, 100);

            btn.onclick = () => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 500);
            };
        }, 10000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAds);
    } else {
        initAds();
    }
})();
