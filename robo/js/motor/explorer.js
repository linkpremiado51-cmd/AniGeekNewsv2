/**
 * MOTOR: Explorador de Arquivos
 * Renderiza a estrutura do vFS na barra lateral.
 */

import { vFS } from "./gerador_arquivos.js";

/**
 * Renderiza a lista de arquivos gerados no painel lateral
 */
export function renderExplorer() {
    const explorer = document.getElementById('fileExplorer');
    if (!explorer) return;
    
    explorer.innerHTML = '';

    // Percorre cada editor no Sistema de Arquivos Virtual
    for (const edId in vFS) {
        // Cabeçalho do Projeto
        const projectHeader = document.createElement('div');
        projectHeader.style = "color:var(--orange); font-weight:bold; margin-top:10px; border-bottom: 1px solid var(--border); padding-bottom: 5px;";
        projectHeader.innerHTML = `📂 ${edId.toUpperCase()}`;
        explorer.appendChild(projectHeader);

        // Percorre as subpastas (secoes, estilos, scripts)
        for (const sub in vFS[edId].subfolders) {
            vFS[edId].subfolders[sub].forEach((f, idx) => {
                const fileItem = document.createElement('div');
                fileItem.className = "file-item";
                fileItem.style = "font-size:11px; padding:4px 0; border-bottom:1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;";
                
                fileItem.innerHTML = `
                    <span style="color: #94a3b8;">- ${f.name}</span>
                    <button onclick="verCodigo('${edId}','${sub}',${idx})" 
                            style="padding:2px 6px; font-size:10px; background: var(--border); color: white; border-radius: 4px;">
                        👁️ Ver
                    </button>
                `;
                explorer.appendChild(fileItem);
            });
        }
    }
}

/**
 * Abre o modal para visualização do código gerado
 */
window.verCodigo = function(edId, sub, idx) {
    const modal = document.getElementById('viewerModal');
    const textarea = document.getElementById('modalTextarea');
    const fileNameDisplay = document.getElementById('fileNameModal');
    
    if (vFS[edId] && vFS[edId].subfolders[sub][idx]) {
        const file = vFS[edId].subfolders[sub][idx];
        fileNameDisplay.innerText = `${edId}/${sub}/${file.name}`;
        textarea.value = file.content;
        
        modal.style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }
};
