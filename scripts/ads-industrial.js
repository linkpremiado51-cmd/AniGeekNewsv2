(function() {
// === 1. GESTÃO DE ESTADO ===
let isTabActive = true;
document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

// === 2. CONTAINER MESTRE ===  
const adsRoot = document.createElement('div');  
adsRoot.id = 'industrial-ads-system';  
document.body.appendChild(adsRoot);  

// === 3. ESTILIZAÇÃO ATUALIZADA ===  
const style = document.createElement('style');  
style.textContent = `  
    #industrial-ads-system { font-family: 'Helvetica', 'Arial', sans-serif; pointer-events: none; -webkit-font-smoothing: antialiased; }  
    #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }  
    
    .ind-banner { position: fixed; left: 50%; transform: translateX(-50%); z-index: 2147483646; background: #fff; border: 2px solid #000; box-shadow: 0 0 20px rgba(0,0,0,0.2); transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1); }  
    
    /* Bloco 1 - Inferior (300x250) */
    .ind-bottom { bottom: -600px; width: 320px; height: 310px; padding: 5px; } 

    /* Bloco 3 - Superior (300x100) */
    .ind-top { top: -600px; width: 320px; height: 145px; padding: 5px; } 
    
    .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 2px; }  
    .ind-label { font-size: 10px; font-weight: 900; color: #000; text-transform: uppercase; }  
    .ind-close-btn { font-size: 10px; font-weight: 900; background: #000; color: #fff; border: none; padding: 2px 8px; cursor: pointer; }  

    /* Slots de Banner */
    .slot-300x250 { width: 300px; height: 250px; margin: 0 auto; overflow: hidden; }
    .slot-300x100 { width: 300px; height: 100px; margin: 0 auto; overflow: hidden; }

    /* Bloco 2 - Interstitial Video */
    .ind-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); z-index: 2147483647; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.5s ease; }  
    .ind-modal { background: #fff; width: 95%; max-width: 500px; padding: 20px; border-top: 8px solid #000; position: relative; }  
    .video-container { width: 100%; background: #000; aspect-ratio: 16/9; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; }
    
    .ind-btn-skip { background: #f0f0f0; border: 1px solid #ddd; padding: 10px 20px; font-size: 11px; font-weight: 800; color: #888; cursor: not-allowed; text-transform: uppercase; }  
    .ind-btn-skip.ready { background: #000; color: #fff; border-color: #000; cursor: pointer; }  
    .ind-progress-bg { width: 100%; height: 4px; background: #eee; margin: 10px 0; }  
    .ind-progress-fill { width: 0%; height: 100%; background: #000; transition: width 0.1s linear; }  
`;  
document.head.appendChild(style);  

// === 4. ESTRUTURA HTML ===  
adsRoot.innerHTML = `  
    <div id="ind-block-1" class="ind-banner ind-bottom">  
        <div class="ind-header"><span class="ind-label">Promoção</span><button id="ind-close-1" class="ind-close-btn">X</button></div>  
        <div id="ad-slot-1" class="slot-300x250"></div>  
    </div>  

    <div id="ind-block-3" class="ind-banner ind-top">  
        <div class="ind-header"><span class="ind-label">Destaque</span><button id="ind-close-3" class="ind-close-btn">X</button></div>  
        <div id="ad-slot-3" class="slot-300x100"></div>  
    </div>  

    <div id="ind-block-2-overlay" class="ind-overlay">  
        <div class="ind-modal">  
            <div class="ind-header">  
                <span class="ind-label">Publicidade em Vídeo</span>  
                <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde</button>  
            </div>  
            <div class="video-container">
                <iframe id="video-player" src="" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" style="background:#000;"></iframe>
            </div>
            <div class="ind-progress-bg"><div id="ind-prog-2" class="ind-progress-fill"></div></div>  
            <div id="ind-timer-txt" style="font-size:10px; font-weight:900; text-align:center;">INICIALIZANDO...</div>  
        </div>  
    </div>  
`;  

// === 5. FUNÇÕES DE CARREGAMENTO DE ANÚNCIOS ===

function loadAdBlock1() {
    const container = document.getElementById('ad-slot-1');
    container.innerHTML = '';
    const s = document.createElement('script');
    s.src = "//piercing-flower.com/bRX/V.sLd/Gvl/0hYJWDcH/JeVmY9cuSZfUvlvkFPjTrY/3NNgDEg_0DMfjTYitANajEcd0-OsDqQRysN/wo";
    s.async = true;
    container.appendChild(s);
}

function loadAdBlock3() {
    const container = document.getElementById('ad-slot-3');
    container.innerHTML = '';
    const s = document.createElement('script');
    s.src = "//piercing-flower.com/b-XoVXswd.GFlQ0lYAWPcp/cebms9hucZMUQl/kfPRTDYp3/NlDAgv0FMVzSQ_t/N_jece0YOxDDQsz/NnQn";
    s.async = true;
    container.appendChild(s);
}

function startVideoInterstitial() {
    const overlay = document.getElementById('ind-block-2-overlay');
    const player = document.getElementById('video-player');
    const btn = document.getElementById('ind-close-2');
    const prog = document.getElementById('ind-prog-2');
    const txt = document.getElementById('ind-timer-txt');

    // Link do vídeo fornecido
    player.src = "https://different-protection.com/dWmlFtzgd.GTNGvzZDGrUm/ve/m/9PucZgUnlvkSPXTbY-3mNwD_g/0/M/zqI/tnNRjvco0IOIDJQ/z-MRwr";

    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 50);

    let timeLeft = 15;
    const total = 15;

    const timer = setInterval(() => {
        if (isTabActive) {
            if (timeLeft > 0) {
                timeLeft--;
                txt.innerText = `PULAR EM ${timeLeft}S`;
                prog.style.width = `${((total - timeLeft) / total) * 100}%`;
            } else {
                clearInterval(timer);
                txt.innerText = "VÍDEO CONCLUÍDO";
                btn.innerText = "FECHAR ANÚNCIO";
                btn.disabled = false;
                btn.classList.add('ready');
            }
        }
    }, 1000);

    btn.onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            player.src = ""; // Para o vídeo
        }, 500);
    };
}

// === 6. CONTROLE DE TIMING ===

// Bloco 1: Abre em 2 segundos
setTimeout(() => {
    document.getElementById('ind-block-1').style.bottom = '10px';
    loadAdBlock1();
}, 2000);

// Bloco 3: Abre em 4 segundos
setTimeout(() => {
    document.getElementById('ind-block-3').style.top = '10px';
    loadAdBlock3();
}, 4000);

// Bloco 2 (VÍDEO): Abre em exatos 15 segundos após carregar a página
setTimeout(() => {
    startVideoInterstitial();
}, 15000); 

// Botões de fechar banners comuns
document.getElementById('ind-close-1').onclick = () => document.getElementById('ind-block-1').style.bottom = '-600px';
document.getElementById('ind-close-3').onclick = () => document.getElementById('ind-block-3').style.top = '-600px';

})();
