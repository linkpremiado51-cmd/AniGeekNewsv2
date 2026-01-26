/**
 * modulos_analises/inicializador-do-site.js
 * O Chefe Autônomo: Versão Ultra Segura.
 */
console.log("🔥 inicializador-do-site.js foi carregado");

// 1. Importações de Configuração e Banco
import { db } from "./01-conexao-com-servidor/configuracao-firebase.js";
import { iniciarEscutaNoticias } from "./03-banco-de-dados/buscar-noticias-ao-vivo.js";
import { configurarCurtidas } from "./03-banco-de-dados/salvar-curtidas.js";

// 2. Importações de Interface (Renderização)
import { configurarBotaoCarregarMais } from "./05-colocar-na-tela/carregar-mais-conteudo.js";
import { verificarNoticiaNaUrl } from "./05-colocar-na-tela/mostrar-no-modal.js";

// 3. Importações de Interação (Eventos de Clique)
import "./06-cliques-do-usuario/gerenciar-compartilhamento.js";
import { configurarConfirmacaoVideo } from "./06-cliques-do-usuario/gerenciar-videos.js";
import "./06-cliques-do-usuario/fechar-janelas.js";

// 4. Importação do Gerenciador de Abas (Submódulo)
import { inicializarSistemaAbas } from "./sub_modulos_analises/gerenciador_de_abas/gerenciador-abas.js";

// ESTADO GLOBAL DO MÓDULO
let todasAsNoticias = [];
let noticiasExibidas = 5;

const getNoticias = () => todasAsNoticias;
const setNoticias = (novasNoticias) => { todasAsNoticias = novasNoticias; };
const getExibidas = () => noticiasExibidas;
const setExibidas = (valor) => { noticiasExibidas = valor; };

/**
 * Função de Inicialização Total
 */
export async function inicializarApp() {
    console.log("🚀 Motor de Análises iniciado.");

    // [NOVO] A. Inicializa as abas primeiro para garantir que a interface apareça
    // Usamos um try/catch para que se as abas falharem, o resto do site continue vivo.
    try {
        inicializarSistemaAbas();
        console.log("📂 Sistema de Abas carregado com sucesso.");
    } catch (e) {
        console.error("⚠️ Erro ao carregar Abas, mas seguindo com o app...", e);
    }

    // B. Conexão em Tempo Real (Radar)
    iniciarEscutaNoticias(db, (noticias) => {
        setNoticias(noticias);
        const labelNovo = document.getElementById('novo-artigo-titulo');
        if(labelNovo && noticias.length > 0) {
            labelNovo.innerText = noticias[0].titulo;
        }
        verificarNoticiaNaUrl(noticias);
    }, getExibidas);

    // C. Ativação de Backend (Curtidas)
    configurarCurtidas(db);

    // D. Aguarda componentes específicos antes de configurar botões de paginação
    const aguardarComponentes = () => {
        return new Promise((resolve) => {
            let tentativas = 0;
            const check = () => {
                tentativas++;
                if (document.getElementById('btn-carregar-mais')) {
                    resolve(true);
                } else if (tentativas > 20) { // Se após 1 segundo não achar, cancela o erro
                    console.warn("⚠️ Botão carregar-mais não encontrado no tempo esperado.");
                    resolve(false);
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        });
    };

    const componenteExiste = await aguardarComponentes();
    
    if (componenteExiste) {
        configurarBotaoCarregarMais(getNoticias, getExibidas, setExibidas);
    }
    
    configurarConfirmacaoVideo();
    
    console.log("✅ [Sistema] Todos os módulos sincronizados.");
}

/**
 * DISPARO AUTOMÁTICO
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}

window.recarregarAppGeek = inicializarApp;
