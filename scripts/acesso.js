import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

const msg = document.getElementById('mensagem');

/* LOGIN */
document.getElementById('login-btn')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = 'index.html';
    } catch (e) {
        msg.textContent = 'Erro ao entrar';
    }
});

/* CADASTRO */
document.getElementById('signup-btn')?.addEventListener('click', async () => {
    const nome = document.getElementById('signup-nome').value;
    const email = document.getElementById('signup-email').value;
    const senha = document.getElementById('signup-senha').value;

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        await updateProfile(cred.user, { displayName: nome });
        window.location.href = 'index.html';
    } catch (e) {
        msg.textContent = 'Erro ao cadastrar';
    }
});

/* TROCA DE TELA */
window.showTab = (tab) => {
    document.getElementById('login-section').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signup-section').classList.toggle('hidden', tab !== 'signup');
    msg.textContent = '';
};
