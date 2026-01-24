
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

/**
 * Getters e Setters para que outros módulos possam 
 * ler/alterar o estado de forma controlada.
 */
const getNoticias = () => todasAsNoticias;
const setNoticias = (novasNoticias) => { todasAsNoticias = novasNoticias; };
const getExibidas = () => noticiasExibidas;
const setExibidas = (valor) => { noticiasExibidas = valor; };

/**
 * Função principal de inicialização
 */
function inicializarApp() {
    // A. Inicia a escuta em tempo real do Firestore
    iniciarEscutaNoticias(db, (noticias) => {
        setNoticias(noticias);
        
        // Atualiza o título da última atualização no topo
        if(noticias.length > 0) {
            const labelNovo = document.getElementById('novo-artigo-titulo');
            if(labelNovo) labelNovo.innerText = noticias[0].titulo;
        }

        // B. Verifica se há um ID na URL para abrir o modal automaticamente
        verificarNoticiaNaUrl(noticias);
    }, getExibidas);

    // C. Configura os eventos de botões fixos na tela
    configurarBotaoCarregarMais(getNoticias, getExibidas, setExibidas);
    configurarConfirmacaoVideo();
    
    // D. Inicializa sistema de curtidas (delegado)
    configurarCurtidas(db);
}

// Executa o play!
document.addEventListener('DOMContentLoaded', inicializarApp);
