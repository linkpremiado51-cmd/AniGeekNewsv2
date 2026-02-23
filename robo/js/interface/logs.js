/**
 * INTERFACE: Sistema de Logs
 * Controla a saída de mensagens para o console visual da aplicação.
 */

export function log(msg, tipo = '') {
    const el = document.getElementById('consoleLog');
    if (!el) return;

    // Definição de cores baseada no tema original
    const cores = {
        success: '#22c55e',  // Verde
        error: '#ef4444',    // Vermelho
        terminal: '#10b981', // Ciano/Terminal
        padrao: '#888'       // Cinza
    };

    const cor = cores[tipo] || cores.padrao;
    
    // Adiciona a nova mensagem com a cor correspondente
    el.innerHTML += `<div style="color:${cor}">${msg}</div>`;
    
    // Mantém o scroll sempre no final
    el.scrollTop = el.scrollHeight;
}

/**
 * Copia o conteúdo atual do terminal para a área de transferência
 */
export async function copiarTerminal() {
    const el = document.getElementById("consoleLog");
    if (!el) return;
    
    const textoLimpo = el.innerText;
    try {
        await navigator.clipboard.writeText(textoLimpo);
        log("✅ Terminal copiado para área de transferência.", "success");
    } catch (err) {
        console.error(err);
        log("❌ Falha ao copiar conteúdo.", "error");
    }
}
