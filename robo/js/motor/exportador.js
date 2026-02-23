/**
 * SERVIÇOS: Exportador ZIP
 * Compacta o vFS seguindo a estrutura de pastas profissional.
 */

import { vFS } from "../motor/gerador_arquivos.js";
import { log } from "../interface/logs.js";

export async function baixarZip() {
    if (Object.keys(vFS).length === 0) {
        return alert("Erro: Gere os arquivos primeiro!");
    }

    log("📦 Iniciando compressão do pacote...", "terminal");
    const zip = new JSZip();

    for (const edId in vFS) {
        // Cria pasta principal do editor (ex: anigeek-news)
        const editorFolder = zip.folder(edId);
        
        for (const subFolderName in vFS[edId].subfolders) {
            // Cria subpastas (ex: secoes, estilos/secoes)
            const subFolder = editorFolder.folder(subFolderName);
            
            vFS[edId].subfolders[subFolderName].forEach(file => {
                subFolder.file(file.name, file.content);
            });
        }
    }

    try {
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        const dataHojes = new Date().toISOString().split('T')[0];
        
        link.href = URL.createObjectURL(content);
        link.download = `AniGeek_Pack_${dataHojes}.zip`;
        link.click();
        
        log("✅ Download do ZIP iniciado com sucesso!", "success");
    } catch (err) {
        log("❌ Erro ao gerar ZIP: " + err.message, "error");
    }
}
