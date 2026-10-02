export const EMPTY_LABEL = "Não informado";
const EMPTY = EMPTY_LABEL;

/** null, undefined, "" e o próprio "Não informado" contam como valor vazio. */
export const isEmptyValue = (value: string | number | null | undefined): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && (value.trim() === "" || value === EMPTY_LABEL));

/** Datas da API vêm como "YYYY-MM-DD"; evita new Date() para não deslocar o dia por fuso. */
export const formatDate = (value?: string | null): string => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : EMPTY;
};

export const formatCurrency = (value?: number | null): string =>
  typeof value === "number"
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : EMPTY;

export const formatCnpj = (value?: string | null): string => {
  const d = (value ?? "").replace(/\D/g, "");
  return d.length === 14
    ? d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    : value || EMPTY;
};

export const formatCep = (value?: string | null): string => {
  const d = (value ?? "").replace(/\D/g, "");
  return d.length === 8 ? d.replace(/^(\d{5})(\d{3})$/, "$1-$2") : value || EMPTY;
};

/** "6134939002" -> "(61) 3493-9002" */
export const formatPhone = (value?: string | null): string => {
  const d = (value ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  return value || EMPTY;
};

export const formatBool = (value?: boolean | null): string =>
  value === null || value === undefined ? EMPTY : value ? "Sim" : "Não";

export const orEmpty = (value?: string | null): string => value?.trim() || EMPTY;
