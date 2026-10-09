const STORAGE_KEY = 'ong_voluntarios';

/**
 * Busca a lista de voluntários armazenada no localStorage.
 * @returns {Array} Array de objetos contendo os voluntários.
 */
export function buscarVoluntariosSalvos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/**
 * Salva um novo voluntário no localStorage e retorna a lista atualizada.
 * @param {Object} voluntario - Objeto com os dados do voluntário.
 * @returns {Array} Lista atualizada de voluntários.
 */
export function salvarVoluntario(voluntario) {
  const listaAtual = buscarVoluntariosSalvos();
  listaAtual.push(voluntario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtual));
  return listaAtual;
}