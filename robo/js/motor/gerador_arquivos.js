/**
 * MOTOR: Gerador de Arquivos e Injeção Inteligente
 * Responsável pelo processamento em lote e montagem do vFS.
 */

import { log } from "../interface/logs.js";
import { editores } from "../servicos/gerenciador_dados.js";

// Mapeamento de coleções (Global no motor)
export const colecoesMap = {
    filme: "filmes_animes_series_games_noticias",
    serie: "animes_filmes_series_games_noticias",
    game: "games_filmes_series_animes_noticias",
    anime: "animes_filmes_series_games_noticias",
    noticia: "noticias_filmes_series_games_animes"
};

// Sistema de Arquivos Virtual (cache de geração)
export let vFS = {};

// ⚠️ INTELIGÊNCIA ARTIFICIAL: NUNCA MUDAR/APAGAR ESTA FUNÇÃO - PROIBIDO
// === FUNÇÃO RESTAURADA E BLINDADA: Encontra marcador flexível com regex + normalização Unicode ===
function encontrarMarcadorFlexivel(codigo, palavraChave) {
    const palavraEscapada = palavraChave.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const codigoNormalizado = codigo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const padrao = new RegExp(`/\\*\\s*=+\\s*${palavraEscapada}[\\s\\S]*?=+\\s*\\*/`, 'i');
    const match = codigoNormalizado.match(padrao);
    if (!match) return null;
    return {
        texto: match[0],
        indice: match.index + match[0].length
    };
}

/**
 * Prepara a linha de configuração que será injetada no JS
 */
function prepararInjecaoJs(baseName) {
    let categoriaID = 'filmes_list';
    if (baseName.includes('_animes')) categoriaID = 'animes_list';
    else if (baseName.includes('_series')) categoriaID = 'series_list';
    else if (baseName.includes('_games')) categoriaID = 'games_list';
    else if (baseName.includes('_noticias')) categoriaID = 'noticias_list';

    // ⚠️ INTELIGÊNCIA ARTIFICIAL: NUNCA MUDAR ESTA ESTRUTURA else if - PROIBIDO
    let palavraChave = "FILMES";
    if(baseName.includes('_series')) palavraChave = "SÉRIES";
    else if(baseName.includes('_animes')) palavraChave = "ANIMES";
    else if(baseName.includes('_noticias')) palavraChave = "NOTÍCIAS";
    else if(baseName.includes('_games')) palavraChave = "GAMES";

    const novaLinha = `{ sessao: "${baseName}", id: "${baseName}", cor: "#6366f1", categoria: "${categoriaID}", itens: [] },`;
    
    return { palavraChave, novaLinha };
}

/**
 * Processa HTML e CSS individuais
 */
function processarHtmlCss(ed, baseName, colNova) {
    const cssOrig = document.getElementById('inputCSS').value;
    const tempOrig = document.getElementById('templateHtml').value;

    let htmlContent = tempOrig.replace(/[a-zA-Z0-9-]+\.web\.app/g, ed.dominio);
    
    // Swap de coleções
    Object.values(colecoesMap).forEach(v => {
        htmlContent = htmlContent.split(`"${v}"`).join(`"${colNova}"`);
    });
    
    htmlContent = htmlContent.replace(/"horimiya"/g, `"${baseName}"`);

    vFS[ed.id].subfolders["secoes"].push({ name: `${baseName}.html`, content: htmlContent });
    vFS[ed.id].subfolders["estilos/secoes"].push({ name: `${baseName}.css`, content: cssOrig });
}

/**
 * FUNÇÃO PRINCIPAL: Gera os arquivos em lote
 */
export function criarArquivosLote() {
    const idsRaw = document.getElementById("fileName").value.split(',');
    vFS = {};
    
    let acumuladorJsPorEditor = {};
    
    // Inicializa estrutura para cada editor ativo
    editores.forEach(ed => {
        vFS[ed.id] = { subfolders: { "secoes": [], "estilos/secoes": [], "scripts": [] } };
        acumuladorJsPorEditor[ed.id] = [];
    });
    
    const colNova = colecoesMap[document.getElementById('tipoColecao').value];
    const target = document.getElementById("targetProject").value;
    
    // Passo 1: HTML/CSS Individuais e Acúmulo de JS
    idsRaw.forEach(idBruto => {
        let baseName = idBruto.trim().replace(/\.html$/i, '');
        if(!baseName) return;
        
        const projetosAlvo = target === "todos" ? editores.map(e => e.id) : [target];
        
        projetosAlvo.forEach(pId => {
            const ed = editores.find(e => e.id === pId);
            if(!ed) return;
            
            processarHtmlCss(ed, baseName, colNova);
            acumuladorJsPorEditor[pId].push(prepararInjecaoJs(baseName));
        });
    });
    
    // Passo 2: Injeção Final nos Arquivos JS (Um por editor)
    for(const edId in acumuladorJsPorEditor) {
        const recOrig = document.getElementById('inputRecomendacao').value;
        let jsContent = recOrig;
        
        acumuladorJsPorEditor[edId].forEach(({ palavraChave, novaLinha }) => {
            let marcador = encontrarMarcadorFlexivel(jsContent, palavraChave);
            if(marcador) {
                jsContent = jsContent.substring(0, marcador.indice) + "\n" + novaLinha + jsContent.substring(marcador.indice);
            } else {
                log(`⚠️ Marcador ${palavraChave} não achado no JS de ${edId}`, "error");
            }
        });
        
        vFS[edId].subfolders["scripts"].push({ name: `recomendacao-secao.js`, content: jsContent });
    }
    
    log("🚀 Lote processado com inteligência v15.5!", "success");
    return vFS; 
}
