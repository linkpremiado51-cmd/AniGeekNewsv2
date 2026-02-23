/**
 * UTILITÁRIOS: Tratamento de Texto
 * Funções auxiliares para manipulação de strings e segurança.
 */

/**
 * Escapa caracteres HTML para exibição segura no Terminal/Diff
 */
export function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Normaliza strings para comparação e criação de IDs (remove acentos e espaços)
 */
export function normalizarID(str) {
    return str
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[\/\s\.]/g, '-');      // Troca espaços e pontos por hifen
}
