import { parsePix } from "./utils/pix";

/**
 * Apoio ao desenvolvedor (doação voluntária via Pix).
 * É doação pura, sem nada em troca; o pagamento acontece no app do banco de quem paga.
 */

/** Pix "copia e cola" estático e sem valor (a pessoa escolhe quanto pagar), com chave aleatória. */
export const SUPPORT_PIX_CODE =
  "00020126580014br.gov.bcb.pix0136845ee8d6-aeae-416b-beb8-6988ec65274e5204000053039865802BR5911italo Dorea6009Sao Paulo62230519daqr4584454015880616304D266";

/** Instituição que recebe, usada no texto do link opcional. */
export const SUPPORT_PROVIDER = "Mercado Pago";

/**
 * Link de pagamento opcional (cartão e outros meios), mostrado como alternativa ao QR Code.
 * Enquanto for o valor provisório, esse link não aparece.
 */
export const SUPPORT_URL = "https://link.mercadopago.com.br/SEU_LINK";

/** Se o Pix/link tiver valor fixo, informe aqui (ex.: "R$ 10"); com valor livre, deixe null. */
export const SUPPORT_FIXED_AMOUNT: string | null = null;

/** Código Pix validado (formato e CRC). null se estiver vazio ou com erro de digitação. */
export const SUPPORT_PIX = parsePix(SUPPORT_PIX_CODE);

export const isSupportLinkConfigured = (url: string = SUPPORT_URL): boolean =>
  /^https:\/\/[^/]+\/.+/.test(url) && !url.includes("SEU_LINK");

/** O botão "Apoie o desenvolvedor" só aparece com ao menos um meio de pagamento válido. */
export const isSupportConfigured = (): boolean => SUPPORT_PIX !== null || isSupportLinkConfigured();

/**
 * Instalador do app para Windows (versão desktop do CNPJSearch).
 *
 * O arquivo (134 MB) passa do limite de 100 MB do GitHub, então fica no Google Drive, com
 * compartilhamento "qualquer pessoa com o link". Ao atualizar o instalador, troque o arquivo
 * no Drive (mantendo o mesmo link) e atualize `version`, `size` e `sha256` abaixo.
 */
export const DOWNLOAD = {
  /** Endereço de download direto do Drive (mostra o aviso de verificação e o botão "Baixar mesmo assim"). */
  url: "https://drive.google.com/uc?export=download&id=10thiYbvibTIHJbEPRxwfYTv-tb0_xuMe",
  fileName: "CNPJSearch-Setup-1.0.0.exe",
  version: "1.0.0",
  size: "134 MB",
  /** SHA-256 do arquivo, para quem quiser conferir a integridade depois de baixar. */
  sha256: "58c607e3a3bd423b4c94a61b98a06b1cf4d4dadbc46baac8e786b1b7a72cdf37",
};

export const isDownloadConfigured = (): boolean => /^https:\/\//.test(DOWNLOAD.url);
