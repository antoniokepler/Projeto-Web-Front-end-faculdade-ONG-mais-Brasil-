/**
 * Valida o número de CPF utilizando o cálculo dos dígitos verificadores.
 * @param {string} cpf - Número do CPF com ou sem formatação.
 * @returns {boolean} True se for válido, false caso contrário.
 */
export function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  
  return resto === parseInt(parseInt(cpf.substring(10, 11)));
}

/**
 * Aplica máscara de formatação em CPF (000.000.000-00)
 */
export function maskCPF(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

/**
 * Aplica máscara de formatação em Telefone ((00) 0 0000-0000)
 */
export function maskPhone(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  return v;
}

/**
 * Aplica máscara de formatação em CEP (00000-000)
 */
export function maskCEP(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  return v;
}