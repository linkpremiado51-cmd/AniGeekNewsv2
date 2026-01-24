/**
 * modulos_secoes/modulos_analises/inicializador-do-site.js
 * O Chefe: Orquestra a inicialização de todos os módulos.
 */

// 1. Importações de Configuração e Banco
import { db } from "./01-conexao-com-servidor/configuracao-firebase.js";
import { iniciarEscutaNoticias } from "./03-banco-de-dados/buscar-noticias-ao-vivo.js";
import { configurarCurtidas } from "./03-banco-de-dados/salvar-curtidas.js";

// 2. Importações de Interface
import { configurarBotaoCarregarMais } from "./05-colocar-na-tela/carregar-mais-conteudo.js";
import { verificarNoticiaNaUrl } from "./05-colocar-na-tela/mostrar-no-modal.js";

// 3. Importações de Interação
import "./06-cliques-do-usuario/gerenciar-compartilhamento.js";
import { configurarConfirmacaoVideo } from "./06-cliques-do-usuario/gerenciar-videos.js";
import "./06-cliques-do-usuario/fechar-janelas.js";

// ESTADO GLOBAL DO MÓDULO
let todasAsNoticias = [];
let noticiasExibidas = 5;

const getNoticias = () => todasAsNoticias;
const setNoticias = (novasNoticias) => { todasAsNoticias = novasNoticias; };
const getExibidas = () => noticiasExibidas;
const setExibidas = (valor) => { noticiasExibidas = valor; };

/**
 * Função principal de inicialização
 * Exportada para ser chamada manualmente pelo navegacao.js
 */
export function inicializarApp() {
    console.log("Módulo de Análises: Inicializando componentes...");
    
    // A. Inicia a escuta em tempo real do Firestore
    iniciarEscutaNoticias(db, (noticias) => {
        setNoticias(noticias);
        
        if(noticias.length > 0) {
            const labelNovo = document.getElementById('novo-artigo-titulo');
            if(labelNovo) labelNovo.innerText = noticias[0].titulo;
        }

        verificarNoticiaNaUrl(noticias);
    }, getExibidas);

    // B. Configura os eventos de botões
    configurarBotaoCarregarMais(getNoticias, getExibidas, setExibidas);
    configurarConfirmacaoVideo();
    
    // C. Inicializa sistema de curtidas
    configurarCurtidas(db);
}

/**
 * AUTO-EXECUÇÃO INTELIGENTE:
 * Só executa sozinho se o container principal já existir no DOM.
 * Caso contrário, ele aguarda o chamado do navegacao.js
 */
if (document.getElementById('container-principal')) {
    inicializarApp();
}
