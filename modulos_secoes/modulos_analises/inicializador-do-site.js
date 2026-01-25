/**
 * modulos_analises/inicializador-do-site.js
 * O Chefe Autônomo: Revisado para suportar componentes assíncronos e o novo Gerenciador de Abas.
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

// 4. Importação do Gerenciador de Abas (Novo)
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
    console.log("🚀 Motor de Análises iniciado em modo Independente.");

    // AJUSTE: Aguarda um breve momento para garantir que os componentes HTML (Header/Footer) 
    // tenham sido injetados pelo script do index.html antes de configurar os botões.
    const aguardarComponentes = () => {
        return new Promise((resolve) => {
            const check = () => {
                if (document.getElementById('btn-carregar-mais')) resolve();
                else setTimeout(check, 50);
            };
            check();
        });
    };

    // A. Conexão em Tempo Real (Radar)
    iniciarEscutaNoticias(db, (noticias) => {
        setNoticias(noticias);
        
        // Atualiza o título da última notícia na barra de notificação
        const labelNovo = document.getElementById('novo-artigo-titulo');
        if(labelNovo && noticias.length > 0) {
            labelNovo.innerText = noticias[0].titulo;
        }

        verificarNoticiaNaUrl(noticias);
    }, getExibidas);

    // B. Ativação de Botões e UX (Agora com segurança de carregamento)
    await aguardarComponentes();
    configurarBotaoCarregarMais(getNoticias, getExibidas, setExibidas);
    configurarConfirmacaoVideo();
    
    // C. Ativação do Sistema de Abas (Interface Dinâmica)
    inicializarSistemaAbas();
    
    // D. Ativação de Backend (Curtidas)
    configurarCurtidas(db);
    
    console.log("✅ [Sistema] Todos os módulos e componentes de UI estão sincronizados.");
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
