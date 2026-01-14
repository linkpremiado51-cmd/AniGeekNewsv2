(function() {
// === 1. GESTÃO DE ESTADO E MONITORAMENTO ===
let isTabActive = true;
document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

// === INSERÇÃO DO POPUNDER ADSTERRA ===
const popunder = document.createElement('script');
popunder.src = '';
document.head.appendChild(popunder);

// === 2. CONTAINER MESTRE (ROOT) ===  
const adsRoot = document.createElement('div');  
adsRoot.id = 'industrial-ads-system';  
document.body.appendChild(adsRoot);  

// === 3. ESTILIZAÇÃO (TOPO E RODAPÉ) ===  
const style = document.createElement('style');  
style.textContent = `  
    #industrial-ads-system { font-family: 'Helvetica', sans-serif; pointer-events: none; }  
    #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }  

    .ind-banner {  
        position: fixed; left: 0; width: 100%;  
        z-index: 2147483646; background: #ffffff;  
        border-top: 3px solid #000; border-bottom: 3px solid #000;  
        box-shadow: 0 0 30px rgba(0,0,0,0.2);  
        transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);  
    }  
    .ind-bottom { bottom: -800px; padding: 10px 0; }  
    .ind-top { top: -800px; padding: 10px 0; }  
    
    .ind-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 15px; text-align: center; }  
    .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }  
    .ind-label { font-size: 10px; font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: 2px; }  
    .ind-close-btn { font-size: 10px; font-weight: 900; background: #000; color: #fff; border: none; padding: 4px 12px; cursor: pointer; }  

    /* Slot Adsterra */
    #container-400bc04139af7d37cf07e325be6678fb { min-height: 120px; width: 100%; display: block; margin: 0 auto; }
    #top-ad-placeholder { min-height: 90px; width: 100%; background: #f9f9f9; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #ccc; border: 1px dashed #ddd; }
`;  
document.head.appendChild(style);  

// === 4. ESTRUTURA DOS BLOCOS (INFERIOR E SUPERIOR) ===  
adsRoot.innerHTML = `  
    <div id="ind-block-top" class="ind-banner ind-top">  
        <div class="ind-container">  
            <div class="ind-header">  
                <span class="ind-label">Destaque Patrocinado</span>  
                <button id="ind-close-top" class="ind-close-btn">Fechar</button>  
            </div>  
            <div id="top-ad-placeholder">Carregando anúncio...</div>  
        </div>  
    </div>  

    <div id="ind-block-bottom" class="ind-banner ind-bottom">  
        <div class="ind-container">  
            <div class="ind-header">  
                <span class="ind-label">Publicidade Nativa</span>  
                <button id="ind-close-bottom" class="ind-close-btn">Fechar</button>  
            </div>  
            <div id="container-400bc04139af7d37cf07e325be6678fb"></div>  
        </div>  
    </div>  
`;  

// Carrega o Script do Banner Adsterra
const scriptBanner = document.createElement('script');
scriptBanner.async = true;
scriptBanner.dataset.cfasync = "false";
scriptBanner.src = "//pl28480282.effectivegatecpm.com/400bc04139af7d37cf07e325be6678fb/invoke.js";
document.body.appendChild(scriptBanner);

// === 5. LÓGICA DE TEMPOS E REPETIÇÃO ===  
const blockBottom = document.getElementById('ind-block-bottom');  
const blockTop = document.getElementById('ind-block-top');  

const REPEAT_TIME = 20000; // Tempo de espera após fechar para reaparecer (20s para completar ciclo de 3x por min)

// Funções de Abrir
const openBottom = () => { if(isTabActive) blockBottom.style.bottom = '0px'; };  
const openTop = () => { if(isTabActive) blockTop.style.top = '0px'; };  

// Lógica de Fechar e Agendar Repetição
document.getElementById('ind-close-bottom').onclick = () => {  
    blockBottom.style.bottom = '-800px';  
    setTimeout(openBottom, REPEAT_TIME);  
};  

document.getElementById('ind-close-top').onclick = () => {  
    blockTop.style.top = '-800px';  
    setTimeout(openTop, REPEAT_TIME);  
};  

// === INICIALIZAÇÃO AO ATUALIZAR PÁGINA ===  

// 1. Bloco de baixo aparece em 5 segundos
setTimeout(openBottom, 5000); 

// 2. Bloco de cima aparece em 10 segundos
setTimeout(openTop, 10000);

})();
