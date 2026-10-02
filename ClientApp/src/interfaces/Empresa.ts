// Formato retornado por https://brasilapi.com.br/api/cnpj/v1/{cnpj}
// Todos os campos da resposta estão listados; a API devolve null/"" quando não há valor.

export interface Socio {
  nome_socio: string | null;
  cnpj_cpf_do_socio: string | null;
  codigo_qualificacao_socio: number | null;
  qualificacao_socio: string | null;
  data_entrada_sociedade: string | null;
  identificador_de_socio: number | null;
  codigo_faixa_etaria: number | null;
  faixa_etaria: string | null;
  codigo_pais: number | null;
  pais: string | null;
  cpf_representante_legal: string | null;
  nome_representante_legal: string | null;
  codigo_qualificacao_representante_legal: number | null;
  qualificacao_representante_legal: string | null;
}

export interface Cnae {
  codigo: number;
  descricao: string | null;
}

export interface RegimeTributario {
  ano: number;
  cnpj_da_scp: string | null;
  forma_de_tributacao: string | null;
  quantidade_de_escrituracoes: number | null;
}

export interface Empresa {
  cnpj: string;
  razao_social: string | null;
  nome_fantasia: string | null;
  identificador_matriz_filial: number | null;
  descricao_identificador_matriz_filial: string | null;

  situacao_cadastral: number | null;
  descricao_situacao_cadastral: string | null;
  data_situacao_cadastral: string | null;
  motivo_situacao_cadastral: number | null;
  descricao_motivo_situacao_cadastral: string | null;
  situacao_especial: string | null;
  data_situacao_especial: string | null;
  data_inicio_atividade: string | null;

  codigo_natureza_juridica: number | null;
  natureza_juridica: string | null;
  codigo_porte: number | null;
  porte: string | null;
  capital_social: number | null;
  ente_federativo_responsavel: string | null;
  qualificacao_do_responsavel: number | null;

  descricao_tipo_de_logradouro: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  codigo_municipio: number | null;
  codigo_municipio_ibge: number | null;
  municipio: string | null;
  uf: string | null;
  codigo_pais: number | null;
  pais: string | null;
  nome_cidade_no_exterior: string | null;

  ddd_telefone_1: string | null;
  ddd_telefone_2: string | null;
  ddd_fax: string | null;
  email: string | null;

  cnae_fiscal: number | null;
  cnae_fiscal_descricao: string | null;
  cnaes_secundarios: Cnae[];

  opcao_pelo_simples: boolean | null;
  data_opcao_pelo_simples: string | null;
  data_exclusao_do_simples: string | null;
  opcao_pelo_mei: boolean | null;
  data_opcao_pelo_mei: string | null;
  data_exclusao_do_mei: string | null;
  regime_tributario: RegimeTributario[];

  qsa: Socio[];
}
