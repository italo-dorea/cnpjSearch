import { Empresa, Socio } from "../interfaces/Empresa";
import {
  formatBool,
  formatCep,
  formatCnpj,
  formatCurrency,
  formatDate,
  formatPhone,
} from "./format";

/** Fonte única dos campos exibidos na tela (abas) e no relatório em PDF. */
export interface Field {
  label: string;
  /** null, undefined e "" são tratados como "Não informado" por quem renderiza. */
  value: string | number | null | undefined;
  /** Campo longo: ocupa a linha inteira no PDF. */
  wide?: boolean;
}

export const generalFields = (e: Empresa): Field[] => [
  { label: "CNPJ", value: formatCnpj(e.cnpj) },
  { label: "Razão Social", value: e.razao_social },
  { label: "Nome Fantasia", value: e.nome_fantasia },
  { label: "Código Matriz/Filial", value: e.identificador_matriz_filial },
  { label: "Matriz/Filial", value: e.descricao_identificador_matriz_filial },
  { label: "Código da Natureza Jurídica", value: e.codigo_natureza_juridica },
  { label: "Natureza Jurídica", value: e.natureza_juridica },
  { label: "Código do Porte", value: e.codigo_porte },
  { label: "Porte", value: e.porte },
  { label: "Capital Social", value: formatCurrency(e.capital_social) },
  { label: "Ente Federativo Responsável", value: e.ente_federativo_responsavel },
  { label: "Qualificação do Responsável", value: e.qualificacao_do_responsavel },
];

export const statusFields = (e: Empresa): Field[] => [
  { label: "Código da Situação", value: e.situacao_cadastral },
  { label: "Situação Cadastral", value: e.descricao_situacao_cadastral },
  { label: "Data da Situação", value: formatDate(e.data_situacao_cadastral) },
  { label: "Código do Motivo", value: e.motivo_situacao_cadastral },
  { label: "Motivo da Situação", value: e.descricao_motivo_situacao_cadastral },
  { label: "Situação Especial", value: e.situacao_especial },
  { label: "Data da Situação Especial", value: formatDate(e.data_situacao_especial) },
  { label: "Início da Atividade", value: formatDate(e.data_inicio_atividade) },
];

export const addressFields = (e: Empresa): Field[] => [
  { label: "Tipo de Logradouro", value: e.descricao_tipo_de_logradouro },
  { label: "Número", value: e.numero },
  { label: "Logradouro", value: e.logradouro, wide: true },
  { label: "Complemento", value: e.complemento, wide: true },
  { label: "Bairro", value: e.bairro },
  { label: "CEP", value: formatCep(e.cep) },
  { label: "Município", value: e.municipio },
  { label: "UF", value: e.uf },
  { label: "Código do Município (RFB)", value: e.codigo_municipio },
  { label: "Código do Município (IBGE)", value: e.codigo_municipio_ibge },
  { label: "País", value: e.pais },
  { label: "Código do País", value: e.codigo_pais },
  { label: "Cidade no Exterior", value: e.nome_cidade_no_exterior },
  { label: "Telefone 1", value: formatPhone(e.ddd_telefone_1) },
  { label: "Telefone 2", value: formatPhone(e.ddd_telefone_2) },
  { label: "Fax", value: formatPhone(e.ddd_fax) },
  { label: "E-mail", value: e.email },
];

export const mainActivityFields = (e: Empresa): Field[] => [
  { label: "Código CNAE", value: e.cnae_fiscal },
  { label: "Descrição", value: e.cnae_fiscal_descricao, wide: true },
];

export const simplesFields = (e: Empresa): Field[] => [
  { label: "Optante pelo Simples", value: formatBool(e.opcao_pelo_simples) },
  { label: "Data de Opção pelo Simples", value: formatDate(e.data_opcao_pelo_simples) },
  { label: "Data de Exclusão do Simples", value: formatDate(e.data_exclusao_do_simples) },
  { label: "Optante pelo MEI", value: formatBool(e.opcao_pelo_mei) },
  { label: "Data de Opção pelo MEI", value: formatDate(e.data_opcao_pelo_mei) },
  { label: "Data de Exclusão do MEI", value: formatDate(e.data_exclusao_do_mei) },
];

export const socioFields = (s: Socio): Field[] => [
  { label: "Nome", value: s.nome_socio },
  { label: "CPF/CNPJ", value: s.cnpj_cpf_do_socio },
  { label: "Identificador do Sócio", value: s.identificador_de_socio },
  { label: "Código da Qualificação", value: s.codigo_qualificacao_socio },
  { label: "Qualificação", value: s.qualificacao_socio },
  { label: "Data de Entrada", value: formatDate(s.data_entrada_sociedade) },
  { label: "Código da Faixa Etária", value: s.codigo_faixa_etaria },
  { label: "Faixa Etária", value: s.faixa_etaria },
  { label: "Código do País", value: s.codigo_pais },
  { label: "País", value: s.pais },
  { label: "Nome do Representante Legal", value: s.nome_representante_legal },
  { label: "CPF do Representante Legal", value: s.cpf_representante_legal },
  {
    label: "Código da Qualif. do Representante",
    value: s.codigo_qualificacao_representante_legal,
  },
  { label: "Qualificação do Representante", value: s.qualificacao_representante_legal },
];
