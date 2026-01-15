(function() {
// === 1. GESTÃO DE ESTADO ===
let isTabActive = true;
document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

// === 2. CONTAINER MESTRE ===  
const adsRoot = document.createElement('div');  
adsRoot.id = 'industrial-ads-system';  
document.body.appendChild(adsRoot);  

// === 3. ESTILIZAÇÃO (Ajustada para os novos tamanhos) ===  
const style = document.createElement('style');  
style.textContent = `  
    #industrial-ads-system { font-family: 'Helvetica', 'Arial', sans-serif; pointer-events: none; -webkit-font-smoothing: antialiased; }  
    #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }  
    
    .ind-banner { position: fixed; left: 50%; transform: translateX(-50%); z-index: 2147483646; background: #ffffff; border: 2px solid #000; box-shadow: 0 0 30px rgba(0,0,0,0.3); transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1); }  
    
    .ind-bottom { bottom: -600px; width: 320px; height: 310px; padding: 5px; } 
    .ind-top { top: -600px; width: 320px; height: 145px; padding: 5px; } 
    
    .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }  
    .ind-label { font-size: 10px; font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: 1px; }  
    .ind-close-btn { font-size: 10px; font-weight: 900; background: #000; color: #fff; border: none; padding: 4px 10px; cursor: pointer; }  

    .slot-300x250 { width: 300px; height: 250px; margin: 0 auto; background: #f0f0f0; }  
    .slot-300x100 { width: 300px; height: 100px; margin: 0 auto; background: #f0f0f0; }  

    /* Bloco 2 Overlay */
    .ind-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); z-index: 2147483647; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.4s ease; }  
    .ind-modal { background: #fff; width: 95%; max-width: 500px; padding: 20px; border-top: 10px solid #000; text-align: center; }  
    
    .video-wrapper { width: 100%; aspect-ratio: 16/9; background: #000; margin-bottom: 15px; position: relative; overflow: hidden; }
    video { width: 100%; height: 100%; object-fit: contain; }

    .ind-btn-skip { background: #f0f0f0; border: 1px solid #ddd; padding: 12px 30px; font-size: 12px; font-weight: 800; color: #888; cursor: not-allowed; text-transform: uppercase; width: 100%; }  
    .ind-btn-skip.ready { background: #000; color: #fff; border-color: #000; cursor: pointer; }  

    .ind-progress-bg { width: 100%; height: 6px; background: #eee; margin: 15px 0; }  
    .ind-progress-fill { width: 0%; height: 100%; background: #000; transition: width 0.1s linear; }  
`;  
document.head.appendChild(style);  

// === 4. ESTRUTURA DOS BLOCOS ===  
adsRoot.innerHTML = `  
    <div id="ind-block-1" class="ind-banner ind-bottom">  
        <div class="ind-header"><span class="ind-label">Oferta</span><button id="ind-close-1" class="ind-close-btn">X</button></div>  
        <div id="ad-slot-1" class="slot-300x250"></div>  
    </div>  

    <div id="ind-block-3" class="ind-banner ind-top">  
        <div class="ind-header"><span class="ind-label">Destaque</span><button id="ind-close-3" class="ind-close-btn">X</button></div>  
        <div id="ad-slot-3" class="slot-300x100"></div>  
    </div>  

    <div id="ind-block-2-overlay" class="ind-overlay">  
        <div class="ind-modal">  
            <div class="ind-header"><span class="ind-label">Publicidade</span></div>  
            <div class="video-wrapper">
                <video id="ind-video-player" playsinline muted autoplay>
                    <source src="https://different-protection.com/dWmlFtzgd.GTNGvzZDGrUm/ve/m/9PucZgUnlvkSPXTbY-3mNwD_g/0/M/zqI/tnNRjvco0IOIDJQ/z-MRwr" type="video/mp4">
                    Seu navegador não suporta vídeos.
                </video>
            </div>  
            <div id="ind-timer-txt" style="font-size:11px; font-weight:900; margin-bottom:5px;">CARREGANDO...</div>
            <div class="ind-progress-bg"><div id="ind-prog-2" class="ind-progress-fill"></div></div>  
            <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde...</button>  
        </div>  
    </div>  
`;  

// === 5. FUNÇÕES DE CARREGAMENTO ===

function loadAd1() {
    const container = document.getElementById('ad-slot-1');
    container.innerHTML = '';
    const s = document.createElement('script');
    s.src = "//piercing-flower.com/bRX/V.sLd/Gvl/0hYJWDcH/JeVmY9cuSZfUvlvkFPjTrY/3NNgDEg_0DMfjTYitANajEcd0-OsDqQRysN/wo";
    s.async = true;
    container.appendChild(s);
}

function loadAd3() {
    const container = document.getElementById('ad-slot-3');
    container.innerHTML = '';
    const s = document.createElement('script');
    s.src = "//piercing-flower.com/b-XoVXswd.GFlQ0lYAWPcp/cebms9hucZMUQl/kfPRTDYp3/NlDAgv0FMVzSQ_t/N_jece0YOxDDQsz/NnQn";
    s.async = true;
    container.appendChild(s);
}

function startVideoAd() {
    const overlay = document.getElementById('ind-block-2-overlay');
    const video = document.getElementById('ind-video-player');
    const btn = document.getElementById('ind-close-2');
    const prog = document.getElementById('ind-prog-2');
    const txt = document.getElementById('ind-timer-txt');

    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 50);
    
    // Tenta dar play (muitos navegadores exigem que esteja mudo)
    video.play().catch(e => console.log("Autoplay impedido, aguardando interação."));

    let timeLeft = 15;
    const total = 15;

    const countdown = setInterval(() => {
        if (isTabActive) {
            if (timeLeft > 0) {
                timeLeft--;
                txt.innerText = `VOCÊ PODE PULAR EM ${timeLeft}S`;
                prog.style.width = `${((total - timeLeft) / total) * 100}%`;
            } else {
                clearInterval(countdown);
                txt.innerText = "VÍDEO PRONTO";
                btn.innerText = "PULAR ANÚNCIO E ACESSAR";
                btn.disabled = false;
                btn.classList.add('ready');
            }
        } else {
            txt.innerText = "CRONÔMETRO PAUSADO";
        }
    }, 1000);

    btn.onclick = () => {
        overlay.style.opacity = '0';
        video.pause();
        setTimeout(() => overlay.style.display = 'none', 500);
    };
}

// === 6. INICIALIZAÇÃO ===

// Banner Inferior (2s após carregar)
setTimeout(() => {
    document.getElementById('ind-block-1').style.bottom = '10px';
    loadAd1();
}, 2000);

// Banner Superior (4s após carregar)
setTimeout(() => {
    document.getElementById('ind-block-3').style.top = '10px';
    loadAd3();
}, 4000);

// INTERSTITIAL DE VÍDEO (15s após carregar)
setTimeout(() => {
    startVideoAd();
}, 15000);

// Fechar banners manuais
document.getElementById('ind-close-1').onclick = () => document.getElementById('ind-block-1').style.bottom = '-600px';
document.getElementById('ind-close-3').onclick = () => document.getElementById('ind-block-3').style.top = '-600px';

})();
