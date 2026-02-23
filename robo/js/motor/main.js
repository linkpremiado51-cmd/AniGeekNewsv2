/**
 * CORE: Main Entry Point
 * Centraliza a orquestração do AniGeek Robot v15.5
 */

// Importações de Serviços e Motor
import { carregarConfiguracoes, salvarTemplatesNoCloud, adicionarEditor, sincronizarFirebase } from "./servicos/gerenciador_dados.js";
import { criarArquivosLote } from "./motor/gerador_arquivos.js";
import { renderExplorer } from "./motor/explorer.js";
import { baixarZip } from "./servicos/exportador.js";
import { log, copiarTerminal } from "./interface/logs.js";
import { moduloRegistroManual } from "./servicos/versionamento.js"; // Se criado separadamente
import { executarTerminal } from "./motor/terminal_comandos.js"; // Módulo de comandos de diff

// 1. Inicialização ao carregar a página
window.onload = async () => {
    try {
        await carregarConfiguracoes();
        log("🤖 Sistema v15.5 pronto para operação.", "terminal");
    } catch (err) {
        log("❌ Falha na inicialização: " + err.message, "error");
    }
};

// 2. Vinculação de Funções Globais (Interface -> Módulos)
// Isso permite que o 'onclick' do seu HTML continue funcionando

window.criarArquivos = () => {
    const vFS = criarArquivosLote();
    if (vFS) renderExplorer();
};

window.baixarZip = baixarZip;
window.sincronizarFirebase = sincronizarFirebase;
window.salvarTemplatesNoCloud = salvarTemplatesNoCloud;
window.adicionarEditor = adicionarEditor;
window.moduloRegistroManual = moduloRegistroManual;
window.copiarTerminal = copiarTerminal;
window.executarTerminal = executarTerminal;

// Funções de UI Simples (Modais)
window.fecharModais = function() { 
    document.querySelectorAll('#viewerModal, #overlay').forEach(e => e.style.display = 'none'); 
};

window.copiarCodigo = async function() {
    const code = document.getElementById('modalTextarea').value;
    await navigator.clipboard.writeText(code);
    log("📋 Código copiado do visualizador!", "success");
};

// Listener para o Enter no terminal
document.getElementById('termCmd')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executarTerminal();
});
