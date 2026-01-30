(function() {
    const initAds = () => {
        let adsRoot = document.getElementById('premium-ads-system');
        if (!adsRoot) {
            adsRoot = document.createElement('div');
            adsRoot.id = 'premium-ads-system';
            document.body.appendChild(adsRoot);
        }

        // === ESTILIZAÇÃO ESTILO ADSENSE ===
        const style = document.createElement('style');
        style.textContent = `
            .premium-banner { 
                position: fixed; left: 0; width: 100%; z-index: 2147483646; 
                background: #ffffff; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); 
                transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                font-family: 'Roboto', Arial, sans-serif;
            }
            .premium-bottom { bottom: -150px; border-top: 1px solid #e0e0e0; }
            .premium-top { top: -150px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            
            .premium-container { 
                max-width: 100%; margin: 0 auto; padding: 10px; 
                position: relative; display: flex; flex-direction: column; align-items: center; 
            }
            
            .ad-label { 
                font-size: 11px; color: #70757a; font-weight: 400; 
                letter-spacing: 0.5px; margin-bottom: 5px; text-transform: none;
            }
            
            .ad-close-x { 
                position: absolute; right: 8px; top: -12px; 
                background: #fff; color: #5f6368; border: 1px solid #dadce0; 
                border-radius: 50%; width: 24px; height: 24px; 
                cursor: pointer; z-index: 10; display: flex; 
                align-items: center; justify-content: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2); font-size: 16px;
            }
            .ad-close-x:hover { background: #f8f9fa; color: #202124; }
        `;
        document.head.appendChild(style);

        // === INSERINDO OS BLOCOS (TOPO E RODAPÉ APENAS) ===
        adsRoot.innerHTML = `
            <div id="Bloco_1_ADSTERRA_TOPO" class="premium-banner premium-top">
                <div class="premium-container">
                    <button class="ad-close-x" onclick="document.getElementById('Bloco_1_ADSTERRA_TOPO').style.top='-150px'">×</button>
                    <span class="ad-label">Anúncio</span>
                    <div id="ad-content-topo"></div>
                </div>
            </div>

            <div id="Bloco_2_ADSTERRA_RODAPE" class="premium-banner premium-bottom">
                <div class="premium-container">
                    <button class="ad-close-x" onclick="document.getElementById('Bloco_2_ADSTERRA_RODAPE').style.bottom='-150px'">×</button>
                    <span class="ad-label">Anúncio</span>
                    <div id="ad-content-rodape"></div>
                </div>
            </div>
        `;

        // === INJEÇÃO DOS SCRIPTS ADSTERRA ===

        // Injetando no Topo
        const scriptTopo = document.createElement('script');
        scriptTopo.src = "https://pl28480241.effectivegatecpm.com/03/fd/7f/03fd7fcc66be850e0b69314ae833f984.js";
        document.getElementById('ad-content-topo').appendChild(scriptTopo);

        // Injetando no Rodapé (Banner Invoke)
        const containerRodape = document.getElementById('ad-content-rodape');
        const scriptRodape = document.createElement('script');
        scriptRodape.async = true;
        scriptRodape.setAttribute('data-cfasync', 'false');
        scriptRodape.src = "https://pl28480282.effectivegatecpm.com/400bc04139af7d37cf07e325be6678fb/invoke.js";
        
        const divRodape = document.createElement('div');
        divRodape.id = "container-400bc04139af7d37cf07e325be6678fb";
        
        containerRodape.appendChild(scriptRodape);
        containerRodape.appendChild(divRodape);

        // === LÓGICA DE APARIÇÃO ===
        setTimeout(() => {
            document.getElementById('Bloco_1_ADSTERRA_TOPO').style.top = '0px';
        }, 1500);

        setTimeout(() => {
            document.getElementById('Bloco_2_ADSTERRA_RODAPE').style.bottom = '0px';
        }, 3000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAds);
    } else {
        initAds();
    }
})();
