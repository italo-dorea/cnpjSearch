/** Normalização e validação dos dígitos verificadores do CNPJ. */

export const onlyDigits = (value: string): string => (value ?? "").replace(/\D/g, "");

const checkDigit = (base: string, weights: number[]): number => {
  const total = base.split("").reduce((sum, d, i) => sum + Number(d) * weights[i], 0);
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
};

export const isValidCnpj = (value: string): boolean => {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const first = checkDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(cnpj.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj.slice(12) === `${first}${second}`;
};
