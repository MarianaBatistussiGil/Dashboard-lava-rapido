// Login simbólico, sem backend: credenciais fixas validadas no client, sem chamada de
// rede. sessionStorage só marca a UI como "entrou" — não é proteção de verdade, é a
// exigência do enunciado de ter uma tela de login com credenciais visíveis.

const SESSION_KEY = "nogueira-auth";

export const CREDENCIAIS = {
  usuario: "claudemir",
  senha: "lavarapido",
};

export function validarCredenciais(usuario, senha) {
  return usuario === CREDENCIAIS.usuario && senha === CREDENCIAIS.senha;
}

export function autenticar() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, "1");
}

export function estaAutenticado() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function sair() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
