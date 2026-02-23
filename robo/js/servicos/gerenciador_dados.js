/**
 * SERVIÇO: Gerenciador de Dados Cloud
 * Gerencia a busca e persistência de Editores e Templates.
 */

import { 
    db, doc, setDoc, getDoc, getDocs, collection 
} from "../configuracao/firebase.js";
import { log } from "../interface/logs.js";

// Estado local para os editores (cache)
export let editores = [];

/**
 * Carrega todos os editores e templates salvos no Firestore
 */
export async function carregarDadosIniciais() {
    try {
        // 1. Buscar Editores
        const snapEditores = await getDocs(collection(db, "robo", "config", "editores"));
        editores = [];
        
        const selectProjeto = document.getElementById("targetProject");
        const listaAdm = document.getElementById("listaEditoresAdm");

        // Limpa e prepara UI
        if (selectProjeto) selectProjeto.innerHTML = '<option value="todos">Todos os Projetos</option>';
        if (listaAdm) listaAdm.innerHTML = '<strong>Ativos:</strong> ';

        snapEditores.forEach(d => {
            const data = d.data();
            const editorObj = { id: d.id, dominio: data.dominio, caminhoBase: data.caminhoBase };
            editores.push(editorObj);

            // Atualiza UI se os elementos existirem
            if (selectProjeto) selectProjeto.innerHTML += `<option value="${d.id}">${d.id.toUpperCase()}</option>`;
            if (listaAdm) listaAdm.innerHTML += `${d.id} | `;
        });

        // 2. Buscar Templates (HTML, CSS, JS)
        const tHtml = await getDoc(doc(db, "robo", "templates", "html", "padrao"));
        const tCss = await getDoc(doc(db, "robo", "templates", "css", "padrao"));
        const tJs = await getDoc(doc(db, "robo", "templates", "js", "padrao"));

        if(tHtml.exists()) document.getElementById("templateHtml").value = tHtml.data().conteudo;
        if(tCss.exists()) document.getElementById("inputCSS").value = tCss.data().conteudo;
        if(tJs.exists()) document.getElementById("inputRecomendacao").value = tJs.data().conteudo;

        log("✅ Sincronização Cloud concluída.", "success");
    } catch (erro) {
        log("❌ Erro ao carregar dados do Cloud: " + erro.message, "error");
    }
}

/**
 * Salva os templates atuais da tela no Firestore
 */
export async function salvarTemplatesNoCloud() {
    try {
        await setDoc(doc(db, "robo", "templates", "html", "padrao"), { conteudo: document.getElementById("templateHtml").value });
        await setDoc(doc(db, "robo", "templates", "css", "padrao"), { conteudo: document.getElementById("inputCSS").value });
        await setDoc(doc(db, "robo", "templates", "js", "padrao"), { conteudo: document.getElementById("inputRecomendacao").value });
        log("Templates Cloud atualizados!", "success");
    } catch (erro) {
        log("❌ Erro ao salvar templates: " + erro.message, "error");
    }
}

/**
 * Adiciona ou atualiza um editor no banco
 */
export async function salvarNovoEditor() {
    const id = document.getElementById("admId").value.toLowerCase().trim();
    const dom = document.getElementById("admDom").value.trim();
    const path = document.getElementById("admPath").value.trim();

    if(!id || !dom) return alert("Preencha ID e Domínio!");

    try {
        await setDoc(doc(db, "robo", "config", "editores", id), { 
            dominio: dom, 
            caminhoBase: path, 
            ativo: true 
        });
        log(`Editor ${id} salvo com sucesso!`, "success");
        carregarDadosIniciais(); // Recarrega a lista
    } catch (erro) {
        log("❌ Erro ao salvar editor: " + erro.message, "error");
    }
}
