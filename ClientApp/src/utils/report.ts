import { jsPDF } from "jspdf";
import autoTable, { CellDef, RowInput } from "jspdf-autotable";
import { Empresa } from "../interfaces/Empresa";
import { tokens } from "../tokens";
import {
  addressFields,
  Field,
  generalFields,
  mainActivityFields,
  simplesFields,
  statusFields,
} from "./empresaSections";
import { EMPTY_LABEL, formatCnpj, formatDate, formatPhone, isEmptyValue } from "./format";
import { SOURCE_LINE } from "./sourceLine";

// ---- Layout (A4, milímetros) ------------------------------------------------
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 16;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const HEADER_H = 23;
const CONTENT_TOP = 31; // abaixo do timbrado
const FOOTER_RESERVE = 20;

const DISCLAIMER =
  "Informações públicas da Receita Federal do Brasil, obtidas pela BrasilAPI. " +
  "O CNPJSearch não é um serviço oficial. " +
  "Os dados podem não refletir alterações recentes e não substituem o Cartão CNPJ nem certidões.";

const EMPTY = EMPTY_LABEL;
const DASH = "—";

type RGB = [number, number, number];
const rgb = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const C = {
  ink: rgb(tokens.ink),
  blue: rgb(tokens.blue),
  slate: rgb(tokens.slate),
  line: rgb(tokens.line),
  surface: rgb(tokens.surface),
  muted: rgb(tokens.muted),
  faint: rgb(tokens.faint),
  white: [255, 255, 255] as RGB,
};

const isEmpty = isEmptyValue;

// ---- Emissão ----------------------------------------------------------------
export interface Emission {
  date: string; // 02/10/2026
  time: string; // 14:52
  fileStamp: string; // 20261002_1452
}

export const getEmission = (now: Date): Emission => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return {
    date,
    time,
    fileStamp: `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`,
  };
};

export const reportFileName = (empresa: Empresa, now: Date = new Date()): string =>
  `CNPJSearch_${empresa.cnpj.replace(/\D/g, "")}_${getEmission(now).fileStamp}.pdf`;

// ---- Timbrado e rodapé (todas as páginas) -----------------------------------
function drawMark(doc: jsPDF, x: number, y: number, size: number) {
  doc.setFillColor(...C.blue);
  doc.roundedRect(x, y, size, size, 2, 2, "F");
  const cx = x + size * 0.43;
  const cy = y + size * 0.43;
  doc.setDrawColor(...C.white);
  doc.setLineCap("round");
  doc.setLineWidth(0.9);
  doc.circle(cx, cy, size * 0.2, "S");
  doc.line(cx + size * 0.15, cy + size * 0.15, x + size * 0.76, y + size * 0.76);
  doc.setLineCap("butt");
}

function drawLetterhead(doc: jsPDF, emission: Emission) {
  doc.setFillColor(...C.ink);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");
  doc.setFillColor(...C.blue);
  doc.rect(0, HEADER_H, PAGE_W, 1.2, "F");

  drawMark(doc, MARGIN_X, 6, 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  doc.text("CNPJSearch", MARGIN_X + 15, 11.6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.slate);
  doc.text("RELATÓRIO DE CONSULTA DE CNPJ", MARGIN_X + 15, 16.2);

  const right = PAGE_W - MARGIN_X;
  doc.setFontSize(6.8);
  doc.setTextColor(...C.slate);
  doc.text("EMITIDO EM", right, 8.6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text(`${emission.date} às ${emission.time}`, right, 13.6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...C.slate);
  doc.text(SOURCE_LINE, right, 18.2, { align: "right" });
}

function drawFooter(doc: jsPDF, page: number, total: number, emission: Emission) {
  const y = PAGE_H - 13;
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.6);
  doc.setTextColor(...C.muted);
  const note = doc.splitTextToSize(DISCLAIMER, CONTENT_W - 34);
  doc.text(note, MARGIN_X, y + 4);
  doc.text(`Emitido em ${emission.date} às ${emission.time}`, MARGIN_X, y + 4 + note.length * 2.9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.ink);
  doc.text(`Página ${page} de ${total}`, PAGE_W - MARGIN_X, y + 4, { align: "right" });
}

// ---- Blocos de conteúdo -----------------------------------------------------
const lastY = (doc: jsPDF): number =>
  (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? CONTENT_TOP;

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - FOOTER_RESERVE) {
    doc.addPage();
    return CONTENT_TOP;
  }
  return y;
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, y, 22);
  doc.setFillColor(...C.blue);
  doc.rect(MARGIN_X, y - 3.4, 1.4, 4.6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.ink);
  doc.text(title.toUpperCase(), MARGIN_X + 3.6, y);
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, y + 2, PAGE_W - MARGIN_X, y + 2);
  return y + 4.5;
}

const baseTable = {
  margin: { top: CONTENT_TOP, bottom: FOOTER_RESERVE, left: MARGIN_X, right: MARGIN_X },
  theme: "plain" as const,
  styles: {
    font: "helvetica",
    fontSize: 8,
    textColor: C.ink,
    cellPadding: { top: 1.6, bottom: 1.6, left: 2.2, right: 2.2 },
    lineColor: C.line,
    lineWidth: 0.2,
    overflow: "linebreak" as const,
    valign: "top" as const,
  },
};

const valueCell = (f: Field, colSpan?: number): CellDef => {
  const empty = isEmpty(f.value);
  return {
    content: empty ? EMPTY : String(f.value),
    colSpan,
    styles: empty ? { fontStyle: "italic", textColor: C.faint } : {},
  };
};

const labelCell = (label: string): CellDef => ({
  content: label,
  styles: { fontSize: 6.6, textColor: C.muted, fillColor: C.surface },
});

/** Campos como grade rótulo/valor em 2 colunas de pares; campos "wide" ocupam a linha inteira. */
function drawFieldTable(doc: jsPDF, fields: Field[], y: number): number {
  const rows: RowInput[] = [];
  let pending: Field | null = null;
  for (const f of fields) {
    if (f.wide) {
      if (pending) {
        rows.push([labelCell(pending.label), valueCell(pending, 3)]);
        pending = null;
      }
      rows.push([labelCell(f.label), valueCell(f, 3)]);
    } else if (pending) {
      rows.push([labelCell(pending.label), valueCell(pending), labelCell(f.label), valueCell(f)]);
      pending = null;
    } else {
      pending = f;
    }
  }
  if (pending) rows.push([labelCell(pending.label), valueCell(pending, 3)]);

  autoTable(doc, {
    ...baseTable,
    startY: y,
    body: rows,
    columnStyles: {
      0: { cellWidth: 29 },
      1: { cellWidth: 60 },
      2: { cellWidth: 29 },
      3: { cellWidth: 60 },
    },
  });
  return lastY(doc) + 7;
}

const headStyles = {
  fillColor: C.ink,
  textColor: C.white,
  fontSize: 7,
  fontStyle: "bold" as const,
  cellPadding: { top: 2, bottom: 2, left: 2.2, right: 2.2 },
};

function dash(v: Field["value"]): string {
  return isEmpty(v) ? DASH : String(v);
}

function drawTableNote(doc: jsPDF, y: number, note: string): number {
  y = ensureSpace(doc, y, 4);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.6);
  doc.setTextColor(...C.faint);
  doc.text(note, MARGIN_X, y);
  return y + 7;
}

// ---- Relatório --------------------------------------------------------------
const situacaoColor = (situacao?: string | null): RGB => {
  const s = (situacao ?? "").toUpperCase();
  if (s === "ATIVA") return [22, 128, 61];
  if (s === "SUSPENSA" || s === "INAPTA") return [180, 100, 0];
  if (s === "BAIXADA" || s === "NULA") return [185, 28, 28];
  return C.muted;
};

function drawTitleBlock(doc: jsPDF, e: Empresa): number {
  let y = CONTENT_TOP + 4;

  const situacao = (e.descricao_situacao_cadastral ?? "").toUpperCase() || "SITUAÇÃO NÃO INFORMADA";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  const pillW = doc.getTextWidth(situacao) + 6;
  doc.setFillColor(...situacaoColor(e.descricao_situacao_cadastral));
  doc.roundedRect(MARGIN_X, y - 3.6, pillW, 5.4, 2.7, 2.7, "F");
  doc.setTextColor(...C.white);
  doc.text(situacao, MARGIN_X + 3, y);

  if (e.descricao_identificador_matriz_filial) {
    doc.setTextColor(...C.muted);
    doc.text(e.descricao_identificador_matriz_filial.toUpperCase(), MARGIN_X + pillW + 3, y);
  }

  y += 8;
  doc.setFontSize(16);
  doc.setTextColor(...C.ink);
  const nameLines = doc.splitTextToSize(e.razao_social || "Razão social não informada", CONTENT_W);
  doc.text(nameLines, MARGIN_X, y);
  y += nameLines.length * 6.6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...C.muted);
  doc.text(e.nome_fantasia?.trim() || "Sem nome fantasia", MARGIN_X, y);

  // CNPJ como carimbo de registro, em azul.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...C.blue);
  doc.text(formatCnpj(e.cnpj), PAGE_W - MARGIN_X, y, { align: "right" });

  y += 5;
  doc.setDrawColor(...C.ink);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);

  // Resumo em uma linha: capital, início, cidade, contato.
  y += 5.5;
  const summary: [string, string][] = [
    ["CAPITAL SOCIAL", generalFields(e).find((f) => f.label === "Capital Social")?.value as string],
    ["INÍCIO DA ATIVIDADE", formatDate(e.data_inicio_atividade)],
    ["CIDADE / UF", e.municipio ? `${e.municipio} - ${e.uf ?? ""}` : EMPTY],
    ["TELEFONE", formatPhone(e.ddd_telefone_1)],
  ];
  const colW = CONTENT_W / summary.length;
  summary.forEach(([label, value], i) => {
    const x = MARGIN_X + colW * i;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(...C.muted);
    doc.text(label, x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.6);
    doc.setTextColor(...(isEmpty(value) ? C.faint : C.ink));
    doc.text(doc.splitTextToSize(isEmpty(value) ? EMPTY : value, colW - 3)[0], x, y + 4.4);
  });

  return y + 12;
}

export function generateCnpjReport(empresa: Empresa, now: Date = new Date()): jsPDF {
  const emission = getEmission(now);
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `Relatório CNPJ ${formatCnpj(empresa.cnpj)} - ${empresa.razao_social ?? ""}`,
    subject: "Relatório de consulta de CNPJ",
    author: "CNPJSearch",
    creator: "CNPJSearch",
    keywords: `CNPJ, ${empresa.cnpj}`,
  });

  let y = drawTitleBlock(doc, empresa);

  y = drawSectionTitle(doc, "Dados gerais", y);
  y = drawFieldTable(doc, generalFields(empresa), y);

  y = drawSectionTitle(doc, "Situação cadastral", y);
  y = drawFieldTable(doc, statusFields(empresa), y);

  y = drawSectionTitle(doc, "Endereço e contato", y);
  y = drawFieldTable(doc, addressFields(empresa), y);

  // Atividades
  const secundarias = empresa.cnaes_secundarios ?? [];
  y = drawSectionTitle(doc, "Atividade econômica principal", y);
  y = drawFieldTable(doc, mainActivityFields(empresa), y);

  y = drawSectionTitle(doc, `Atividades secundárias (${secundarias.length})`, y);
  if (secundarias.length) {
    autoTable(doc, {
      ...baseTable,
      startY: y,
      head: [["Código CNAE", "Descrição"]],
      headStyles,
      body: secundarias.map((c) => [dash(c.codigo), dash(c.descricao)]),
      columnStyles: { 0: { cellWidth: 28 } },
      alternateRowStyles: { fillColor: C.surface },
    });
    y = lastY(doc) + 7;
  } else {
    y = drawEmptyNote(doc, "Nenhuma atividade secundária informada.", y);
  }

  y = drawSectionTitle(doc, "Simples Nacional e MEI", y);
  y = drawFieldTable(doc, simplesFields(empresa), y);

  const regimes = empresa.regime_tributario ?? [];
  y = drawSectionTitle(doc, `Regime tributário (${regimes.length})`, y);
  if (regimes.length) {
    autoTable(doc, {
      ...baseTable,
      startY: y,
      head: [["Ano", "Forma de tributação", "Qtd. de escriturações", "CNPJ da SCP"]],
      headStyles,
      body: regimes.map((r) => [
        dash(r.ano),
        dash(r.forma_de_tributacao),
        dash(r.quantidade_de_escrituracoes),
        isEmpty(r.cnpj_da_scp) ? DASH : formatCnpj(r.cnpj_da_scp),
      ]),
      columnStyles: { 0: { cellWidth: 20 }, 2: { cellWidth: 38 } },
      alternateRowStyles: { fillColor: C.surface },
    });
    y = drawTableNote(doc, lastY(doc) + 4, `${DASH} = não informado`);
  } else {
    y = drawEmptyNote(doc, "Nenhum regime tributário informado.", y);
  }

  const socios = empresa.qsa ?? [];
  y = drawSectionTitle(doc, `Quadro de sócios e administradores (${socios.length})`, y);
  if (socios.length) {
    const lines = (...l: string[]) => l.join("\n");
    autoTable(doc, {
      ...baseTable,
      startY: y,
      styles: { ...baseTable.styles, fontSize: 7, cellPadding: 1.8 },
      head: [
        [
          "#",
          "Sócio",
          "Documento",
          "Qualificação",
          "Entrada",
          "Faixa etária",
          "Representante legal",
          "País",
        ],
      ],
      headStyles,
      body: socios.map((s, i) => [
        String(i + 1),
        dash(s.nome_socio),
        lines(dash(s.cnpj_cpf_do_socio), `Identif. ${dash(s.identificador_de_socio)}`),
        lines(dash(s.qualificacao_socio), `Cód. ${dash(s.codigo_qualificacao_socio)}`),
        formatDate(s.data_entrada_sociedade).replace(EMPTY, DASH),
        lines(dash(s.faixa_etaria), `Cód. ${dash(s.codigo_faixa_etaria)}`),
        lines(
          `Nome: ${dash(s.nome_representante_legal)}`,
          `CPF: ${dash(s.cpf_representante_legal)}`,
          `Qualif.: ${dash(s.qualificacao_representante_legal)}`,
          `Cód. ${dash(s.codigo_qualificacao_representante_legal)}`
        ),
        lines(dash(s.pais), `Cód. ${dash(s.codigo_pais)}`),
      ]),
      columnStyles: {
        0: { cellWidth: 7, textColor: C.muted },
        1: { cellWidth: 33, fontStyle: "bold" },
        2: { cellWidth: 25 },
        3: { cellWidth: 23 },
        4: { cellWidth: 16 },
        5: { cellWidth: 25 },
        6: { cellWidth: 34 },
        7: { cellWidth: 15 },
      },
      alternateRowStyles: { fillColor: C.surface },
      rowPageBreak: "avoid",
    });
    drawTableNote(doc, lastY(doc) + 4, `${DASH} = não informado`);
  } else {
    drawEmptyNote(doc, "Nenhum sócio ou administrador informado.", y);
  }

  // Timbrado e rodapé em todas as páginas, com numeração "X de Y".
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    drawLetterhead(doc, emission);
    drawFooter(doc, page, total, emission);
  }
  return doc;
}

function drawEmptyNote(doc: jsPDF, note: string, y: number): number {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...C.faint);
  doc.text(note, MARGIN_X, y + 1);
  return y + 9;
}

/** Gera o PDF e dispara o download pelo navegador. */
export function saveCnpjReport(empresa: Empresa, now: Date = new Date()): void {
  generateCnpjReport(empresa, now).save(reportFileName(empresa, now));
}
