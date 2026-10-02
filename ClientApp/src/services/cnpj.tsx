import { Empresa } from "../interfaces/Empresa";
import { isValidCnpj, onlyDigits } from "../utils/cnpjValidation";

const BASE_URL = "https://brasilapi.com.br/api/cnpj/v1";
const TIMEOUT_MS = 15000;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Cache em memória: repetir a mesma consulta não pesa na BrasilAPI (serviço gratuito e voluntário).
const cache = new Map<string, { expires: number; data: Empresa }>();

const errorFor = (status: number): string => {
  if (status === 404) return "CNPJ não encontrado na base da Receita Federal.";
  if (status === 400) return "CNPJ inválido.";
  if (status === 429) return "Muitas consultas seguidas. Aguarde um instante.";
  return "A BrasilAPI retornou um erro inesperado. Tente novamente.";
};

export const getCNPJ = async (cnpj: string): Promise<Empresa> => {
  const digits = onlyDigits(cnpj);
  if (!isValidCnpj(digits)) {
    throw new Error("CNPJ inválido. Verifique o número digitado.");
  }

  const cached = cache.get(digits);
  if (cached && cached.expires > Date.now()) return cached.data;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/${digits}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(
      error instanceof DOMException && error.name === "AbortError"
        ? "A consulta demorou demais. Tente novamente."
        : "Não foi possível acessar a BrasilAPI. Verifique sua conexão."
    );
  } finally {
    window.clearTimeout(timer);
  }

  if (!response.ok) throw new Error(errorFor(response.status));

  const data: Empresa = await response.json();
  cache.set(digits, { expires: Date.now() + CACHE_TTL_MS, data });
  return data;
};
