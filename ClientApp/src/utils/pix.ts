/** Leitura e validação do "Pix copia e cola" (BR Code estático, EMV QRCPS). */

export interface PixInfo {
  payload: string;
  /** Chave Pix (aleatória) do recebedor. */
  key: string | null;
  name: string | null;
  city: string | null;
  /** true quando o código já traz um valor (tag 54); sem ele, a pessoa escolhe quanto pagar. */
  hasFixedAmount: boolean;
}

/** Lê uma sequência TLV (tag de 2 dígitos, tamanho de 2 dígitos, valor). Retorna null se malformada. */
const parseTlv = (s: string): Record<string, string> | null => {
  const out: Record<string, string> = {};
  let i = 0;
  while (i < s.length) {
    const tag = s.slice(i, i + 2);
    const len = parseInt(s.slice(i + 2, i + 4), 10);
    if (!/^\d{2}$/.test(tag) || Number.isNaN(len)) return null;
    const value = s.slice(i + 4, i + 4 + len);
    if (value.length !== len) return null;
    out[tag] = value;
    i += 4 + len;
  }
  return out;
};

/** CRC-16/CCITT-FALSE, como definido pelo Banco Central para o BR Code. */
export const crc16 = (s: string): string => {
  let crc = 0xffff;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
};

/** Retorna os dados do código, ou null se ele estiver vazio, corrompido ou não for um Pix. */
export const parsePix = (code: string): PixInfo | null => {
  const payload = code.trim();
  if (!payload.startsWith("000201")) return null;

  const body = payload.slice(0, -4);
  if (!body.endsWith("6304") || crc16(body) !== payload.slice(-4).toUpperCase()) return null;

  const tlv = parseTlv(payload);
  const account = tlv?.["26"] ? parseTlv(tlv["26"]) : null;
  if (!tlv || !account || account["00"]?.toLowerCase() !== "br.gov.bcb.pix") return null;

  return {
    payload,
    key: account["01"] ?? null,
    name: tlv["59"] ?? null,
    city: tlv["60"] ?? null,
    hasFixedAmount: "54" in tlv,
  };
};
