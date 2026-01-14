(function() {
// === 1. GESTÃO DE ESTADO E MONITORAMENTO ===
let isTabActive = true;
document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

// === INSERÇÃO DO POPUNDER ADSTERRA ===
const popunder = document.createElement('script');
popunder.src = 'https://pl28480241.effectivegatecpm.com/03/fd/7f/03fd7fcc66be850e0b69314ae833f984.js';
document.head.appendChild(popunder);

// === 2. CONTAINER MESTRE (ROOT) ===  
const adsRoot = document.createElement('div');  
adsRoot.id = 'industrial-ads-system';  
document.body.appendChild(adsRoot);  

// === 3. ESTILIZAÇÃO INDUSTRIAL DARK ===  
const style = document.createElement('style');  
style.textContent = `  
    #industrial-ads-system {  
        font-family: 'Helvetica', 'Arial', sans-serif;  
        pointer-events: none;  
        -webkit-font-smoothing: antialiased;  
    }  
    #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }  

    .ind-banner {  
        position: fixed; left: 0; width: 100%;  
        z-index: 2147483646; background: #ffffff;  
        border-top: 3px solid #000; border-bottom: 3px solid #000;  
        box-shadow: 0 0 30px rgba(0,0,0,0.2);  
        transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);  
    }  
    .ind-bottom { bottom: -600px; padding-bottom: 10px; }  
    .ind-top { top: -600px; }  
    .ind-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 15px; text-align: center;}  
    .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }  
    .ind-label { font-size: 11px; font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: 2.5px; }  
    .ind-close-btn { font-size: 11px; font-weight: 900; background: #000; color: #fff; border: none; padding: 6px 18px; cursor: pointer; text-transform: uppercase; }  

    .ind-overlay {  
        position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9);  
        backdrop-filter: grayscale(100%); z-index: 2147483647;  
        display: none; align-items: center; justify-content: center;  
        opacity: 0; transition: opacity 0.4s ease;  
    }  
    .ind-modal {  
        background: #fff; width: 100%; max-width: 480px;  
        padding: 40px; border-top: 10px solid #000;  
        box-shadow: 0 40px 100px rgba(0,0,0,0.8);  
        transform: translateY(20px); transition: transform 0.4s ease;  
    }  
    .ind-btn-skip {  
        background: #f0f0f0; border: 1px solid #ddd; padding: 12px 30px;  
        font-size: 12px; font-weight: 800; color: #888; cursor: not-allowed;  
        text-transform: uppercase;  
    }  
    .ind-btn-skip.ready { background: #000; color: #fff; border-color: #000; cursor: pointer; }  
    .ind-progress-bg { width: 100%; height: 4px; background: #eee; margin-bottom: 20px; }  
    .ind-progress-fill { width: 0%; height: 100%; background: #000; transition: width 0.1s linear; }  
    .ind-footer { display: flex; justify-content: space-between; align-items: center; }  
    .ind-cta { background: #000; color: #fff; text-decoration: none; padding: 14px 35px; font-size: 13px; font-weight: 800; text-transform: uppercase; border: 2px solid #000; }  
`;  
document.head.appendChild(style);  

// === 4. ESTRUTURA DOS BLOCOS COM ADSTERRA NATIVO ===  
adsRoot.innerHTML = `  
    <div id="ind-block-1" class="ind-banner ind-bottom">  
        <div class="ind-container">  
            <div class="ind-header">  
                <span class="ind-label">Oferta Patrocinada</span>  
                <button id="ind-close-1" class="ind-close-btn">Fechar</button>  
            </div>  
            <div id="container-400bc04139af7d37cf07e325be6678fb"></div>  
        </div>  
    </div>  

    <div id="ind-block-2-overlay" class="ind-overlay">  
        <div class="ind-modal">  
            <div class="ind-header">  
                <span class="ind-label">Publicidade</span>  
                <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde</button>  
            </div>  
            <div style="min-height:250px" id="interstitial-ad-container">
                 </div>  
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
            <div id="top-ad-container"></div>  
        </div>  
    </div>  
`;  

// Carrega o Script do Banner Adsterra
const adScript = document.createElement('script');
adScript.async = true;
adScript.dataset.cfasync = "false";
adScript.src = "https://pl28480282.effectivegatecpm.com/400bc04139af7d37cf07e325be6678fb/invoke.js";
document.body.appendChild(adScript);

// === 5. LÓGICA DE EXECUÇÃO (ENGINE) ===  
const b1 = document.getElementById('ind-block-1');  
const b2Overlay = document.getElementById('ind-block-2-overlay');  
const b2Modal = b2Overlay.querySelector('.ind-modal');  
const b3 = document.getElementById('ind-block-3');  

const openB1 = () => { b1.style.bottom = '0px'; };  
const openB3 = () => { b3.style.top = '0px'; };  

// Lógica Bloco 1 - Reaparece em 5 segundos  
document.getElementById('ind-close-1').onclick = () => {  
    b1.style.bottom = '-600px';  
    setTimeout(openB1, 5000);  
};  

// Lógica Bloco 3 - Reaparece em 5 segundos  
document.getElementById('ind-close-3').onclick = () => {  
    b3.style.top = '-600px';  
    setTimeout(openB3, 5000);  
};  

// Motor do Interstitial (Bloco 2)  
function startInterstitial() {  
    // Espera 5 segundos para aparecer
    setTimeout(() => {  
        b2Overlay.style.display = 'flex';  
        setTimeout(() => {  
            b2Overlay.style.opacity = '1';  
            b2Modal.style.transform = 'translateY(0)';  
        }, 50);  

        let timeLeft = 5; // Mudado para 5 segundos
        const totalDuration = 5;  
        const btn = document.getElementById('ind-close-2');  
        const prog = document.getElementById('ind-prog-2');  
        const txt = document.getElementById('ind-timer-txt');  

        const countdown = setInterval(() => {  
            if (isTabActive) {  
                if (timeLeft > 0) {  
                    timeLeft--;  
                    txt.innerText = `ACESSO EM ${timeLeft}S`;  
                    prog.style.width = `${((totalDuration - timeLeft) / totalDuration) * 100}%`;  
                } else {  
                    clearInterval(countdown);  
                    txt.innerText = "PRONTO PARA ACESSAR";  
                    btn.innerText = "PULAR ANÚNCIO";  
                    btn.disabled = false;  
                    btn.classList.add('ready');  
                }  
            } else {  
                txt.innerText = "CRONÔMETRO PAUSADO";  
            }  
        }, 1000);  

        btn.onclick = () => {  
            b2Overlay.style.opacity = '0';  
            b2Modal.style.transform = 'translateY(20px)';  
            setTimeout(() => {  
                b2Overlay.style.display = 'none';  
                // Reinicia após 5 segundos
                setTimeout(startInterstitial, 5000);  
            }, 500);  
              
            timeLeft = 5;  
            btn.disabled = true;  
            btn.classList.remove('ready');  
            btn.innerText = "Aguarde";  
            prog.style.width = "0%";  
        };  
    }, 5000); // Delay inicial de 5 segundos
}  

// Inicialização de todos os blocos com 5 segundos (5000ms)
setTimeout(openB1, 5000); 
setTimeout(openB3, 5000); 
startInterstitial();

})();
