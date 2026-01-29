(function() {
    // === 1. CONFIGURAÇÃO E ESTADO ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    // Função para garantir que o container exista
    const initAds = () => {
        if (document.getElementById('premium-ads-system')) return;

        const adsRoot = document.createElement('div');
        adsRoot.id = 'premium-ads-system';
        document.body.appendChild(adsRoot);

        // === 2. ESTILIZAÇÃO ===
        const style = document.createElement('style');
        style.textContent = `
            #premium-ads-system { font-family: sans-serif; }
            .premium-banner { 
                position: fixed; left: 0; width: 100%; z-index: 999999; 
                background: #ffffff; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); 
                transition: all 0.5s ease; border-top: 1px solid #ddd;
            }
            .premium-bottom { bottom: -120px; height: 100px; }
            .premium-top { top: -120px; height: 90px; border-top: none; border-bottom: 1px solid #ddd; }
            .premium-container { max-width: 1100px; margin: 0 auto; padding: 10px; position: relative; }
            .ad-label { font-size: 9px; color: #888; text-transform: uppercase; display: block; margin-bottom: 5px; }
            .ad-close-x { position: absolute; right: 10px; top: 5px; background: #eee; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; }
            .ad-slot-placeholder { background: #f9f9f9; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; margin: 0 auto; }
            .slot-300x250 { width: 300px; height: 80px; }
            .slot-leaderboard { width: 100%; height: 60px; }
            
            /* Interstitial */
            .premium-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000000; display: none; align-items: center; justify-content: center; }
            .premium-modal { background: #fff; width: 90%; max-width: 500px; padding: 20px; border-radius: 8px; text-align: center; }
            .premium-prog-bg { width: 100%; height: 5px; background: #eee; margin: 15px 0; }
            .premium-prog-fill { width: 0%; height: 100%; background: #333; }
            .btn-premium-skip { padding: 10px 20px; cursor: not-allowed; background: #ccc; border: none; }
            .btn-premium-skip.ready { background: #000; color: #fff; cursor: pointer; }
        `;
        document.head.appendChild(style);

        // === 3. ESTRUTURA HTML ===
        adsRoot.innerHTML = `
            <div id="p-block-1" class="premium-banner premium-bottom">
                <div class="premium-container">
                    <span class="ad-label">Patrocinado</span>
                    <button id="p-close-1" class="ad-close-x">×</button>
                    <div id="p-slot-1" class="ad-slot-placeholder slot-leaderboard">ANÚNCIO DISPONÍVEL</div>
                </div>
            </div>

            <div id="p-block-2-overlay" class="premium-overlay">
                <div class="premium-modal">
                    <h2 style="margin:0">Publicidade</h2>
                    <div class="ad-slot-placeholder" style="height:250px; margin: 20px 0;">ESPAÇO PUBLICITÁRIO</div>
                    <div class="premium-prog-bg"><div id="p-prog-2" class="premium-prog-fill"></div></div>
                    <button id="p-close-2" class="btn-premium-skip" disabled>Aguarde...</button>
                </div>
            </div>

            <div id="p-block-3" class="premium-banner premium-top">
                <div class="premium-container">
                    <span class="ad-label">Destaque</span>
                    <button id="p-close-3" class="ad-close-x">×</button>
                    <div class="ad-slot-placeholder slot-leaderboard">TOP BANNER ADS</div>
                </div>
            </div>
        `;

        // Lógica de abertura imediata para teste
        setTimeout(() => { document.getElementById('p-block-3').style.top = '0px'; }, 2000); // 2 segundos
        setTimeout(() => { document.getElementById('p-block-1').style.bottom = '0px'; }, 4000); // 4 segundos

        // Fechamento
        document.getElementById('p-close-1').onclick = () => document.getElementById('p-block-1').style.bottom = '-120px';
        document.getElementById('p-close-3').onclick = () => document.getElementById('p-block-3').style.top = '-120px';
    };

    // Executa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAds);
    } else {
        initAds();
    }
})();
