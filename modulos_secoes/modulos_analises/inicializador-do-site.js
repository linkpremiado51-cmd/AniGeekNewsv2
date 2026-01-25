/**
 * modulos_analises/inicializador-do-site.js
 * O Chefe Autônomo: Agora roda de forma independente.
 * Editado para: Funcionar corretamente quando o HTML está em uma subpasta (secoes/)
 */
console.log("🔥 inicializador-do-site.js foi carregado com sucesso!");

// 1. Importações de Configuração e Banco
// Mudamos de ./ para ../ porque o script precisa "voltar" uma pasta para achar os módulos
import { db } from "../01-conexao-com-servidor/configuracao-firebase.js";
import { iniciarEscutaNoticias } from "../03-banco-de-dados/buscar-noticias-ao-vivo.js";
import { configurarCurtidas } from "../03-banco-de-dados/salvar-curtidas.js";

// 2. Importações de Interface (Renderização)
import { configurarBotaoCarregarMais } from "../05-colocar-na-tela/carregar-mais-conteudo.js";
import { verificarNoticiaNaUrl } from "../05-colocar-na-tela/mostrar-no-modal.js";

// 3. Importações de Interação (Eventos de Clique)
// Nota: Ao importar arquivos sem 'export', o JS executa o conteúdo deles imediatamente
import "../06-cliques-do-usuario/gerenciar-compartilhamento.js";
import { configurarConfirmacaoVideo } from "../06-cliques-do-usuario/gerenciar-videos.js";
import "../06-cliques-do-usuario/fechar-janelas.js";

// ESTADO GLOBAL DO MÓDULO (Private State)
let todasAsNoticias = [];
let noticiasExibidas = 5;

// Helpers para os módulos filhos acessarem os dados sem bagunçar o global
const getNoticias = () => todasAsNoticias;
const setNoticias = (novasNoticias) => { todasAsNoticias = novasNoticias; };
const getExibidas = () => noticiasExibidas;
const setExibidas = (valor) => { noticiasExibidas = valor; };

/**
 * Função de Inicialização Total
 */
export function inicializarApp() {
    console.log("🚀 Motor de Análises iniciado em modo Independente e caminhos corrigidos.");
    
    // A. Conexão em Tempo Real (Radar)
    // Passamos o DB e as funções de estado para o buscador
    iniciarEscutaNoticias(db, (noticias) => {
        setNoticias(noticias);
        
        // Atualiza a barra de "Última Atualização" se ela existir no novo index
        const labelNovo = document.getElementById('novo-artigo-titulo');
        if(labelNovo && noticias.length > 0) {
            labelNovo.innerText = noticias[0].titulo;
        }

        // Verifica se o usuário veio de um link direto (?id=...)
        verificarNoticiaNaUrl(noticias);
    }, getExibidas);

    // B. Ativação de Botões e UX
    configurarBotaoCarregarMais(getNoticias, getExibidas, setExibidas);
    configurarConfirmacaoVideo();
    
    // C. Ativação de Backend (Curtidas)
    configurarCurtidas(db);
}

/**
 * DISPARO AUTOMÁTICO
 * O script executa imediatamente assim que o DOM estiver pronto.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}

// Expõe para o console caso precise debugar manualmente
window.recarregarAppGeek = inicializarApp;
