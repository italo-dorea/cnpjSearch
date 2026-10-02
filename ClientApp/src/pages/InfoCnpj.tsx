import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { PictureAsPdf, Replay } from "@mui/icons-material";
import { Empresa } from "../interfaces/Empresa";
import { FieldGrid } from "../components/FieldGrid";
import { tokens } from "../theme";
import {
  addressFields,
  generalFields,
  mainActivityFields,
  simplesFields,
  socioFields,
  statusFields,
} from "../utils/empresaSections";
import { formatCnpj, formatCurrency, formatDate, formatPhone } from "../utils/format";
import { SOURCE_LINE } from "../utils/sourceLine";

interface InfoCnpjProps {
  empresa: Empresa;
  onNewSearch: () => void;
}

const situacaoColor = (situacao?: string | null) => {
  const s = (situacao ?? "").toUpperCase();
  if (s === "ATIVA") return "#16A34A";
  if (s === "SUSPENSA" || s === "INAPTA") return "#D97706";
  if (s === "BAIXADA" || s === "NULA") return "#DC2626";
  return tokens.muted;
};

const EmptyNote: React.FC<{ children: string }> = ({ children }) => (
  <Typography sx={{ color: tokens.faint, fontStyle: "italic", fontSize: "0.875rem" }}>
    {children}
  </Typography>
);

const cellSx = { fontSize: "0.8125rem", py: 0.9 };

const Fact: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      sx={{
        fontSize: "0.7rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: tokens.muted,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: "0.92rem",
        color: value ? tokens.ink : tokens.faint,
        fontStyle: value ? "normal" : "italic",
        wordBreak: "break-word",
      }}
    >
      {value || "Não informado"}
    </Typography>
  </Box>
);

export const InfoCnpj: React.FC<InfoCnpjProps> = ({ empresa, onNewSearch }) => {
  const [tab, setTab] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const secundarias = empresa.cnaes_secundarios ?? [];
  const regimes = empresa.regime_tributario ?? [];
  const socios = empresa.qsa ?? [];

  const handleGeneratePdf = async () => {
    setGenerating(true);
    setPdfError(null);
    try {
      // Carregado sob demanda: o gerador de PDF não pesa na abertura do app.
      const { saveCnpjReport } = await import("../utils/report");
      saveCnpjReport(empresa);
    } catch {
      setPdfError("Não foi possível gerar o relatório em PDF. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  const tabs: { label: string; content: React.ReactNode }[] = [
    { label: "Dados Gerais", content: <FieldGrid fields={generalFields(empresa)} /> },
    { label: "Situação Cadastral", content: <FieldGrid fields={statusFields(empresa)} /> },
    { label: "Endereço e Contato", content: <FieldGrid fields={addressFields(empresa)} /> },
    {
      label: `Atividades (${1 + secundarias.length})`,
      content: (
        <>
          <Typography sx={sectionTitleSx}>Atividade principal</Typography>
          <FieldGrid fields={mainActivityFields(empresa)} />
          <Typography sx={{ ...sectionTitleSx, mt: 3 }}>
            Atividades secundárias ({secundarias.length})
          </Typography>
          {secundarias.length ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>Código CNAE</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {secundarias.map((cnae) => (
                  <TableRow key={cnae.codigo}>
                    <TableCell sx={cellSx}>{cnae.codigo}</TableCell>
                    <TableCell sx={cellSx}>{cnae.descricao || "Não informado"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyNote>Nenhuma atividade secundária informada.</EmptyNote>
          )}
        </>
      ),
    },
    { label: "Simples e MEI", content: <FieldGrid fields={simplesFields(empresa)} /> },
    {
      label: `Regime Tributário (${regimes.length})`,
      content: regimes.length ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Ano", "Forma de tributação", "Qtd. de escriturações", "CNPJ da SCP"].map((h) => (
                <TableCell key={h} sx={{ ...cellSx, fontWeight: 600 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {regimes.map((r, i) => (
              <TableRow key={`${r.ano}-${i}`}>
                <TableCell sx={cellSx}>{r.ano}</TableCell>
                <TableCell sx={cellSx}>{r.forma_de_tributacao || "Não informado"}</TableCell>
                <TableCell sx={cellSx}>{r.quantidade_de_escrituracoes ?? "Não informado"}</TableCell>
                <TableCell sx={cellSx}>
                  {r.cnpj_da_scp ? formatCnpj(r.cnpj_da_scp) : "Não informado"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyNote>Nenhum regime tributário informado.</EmptyNote>
      ),
    },
    {
      label: `Sócios (${socios.length})`,
      content: socios.length ? (
        socios.map((s, i) => (
          <Paper
            key={i}
            variant="outlined"
            sx={{ p: 2, mb: 1.5, borderRadius: "14px", borderColor: tokens.line }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", mb: 1.25 }}>
              {i + 1}. {s.nome_socio || "Nome não informado"}
            </Typography>
            <FieldGrid fields={socioFields(s)} />
          </Paper>
        ))
      ) : (
        <EmptyNote>Nenhum sócio ou administrador informado.</EmptyNote>
      ),
    },
    {
      label: "JSON completo",
      // Garante que nenhum campo retornado pela API fique de fora, mesmo os que a UI não mapeia.
      content: (
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            borderRadius: "12px",
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.line}`,
            color: tokens.ink,
            fontFamily: "inherit",
            fontSize: 14,
            overflow: "auto",
            maxHeight: 520,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(empresa, null, 2)}
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ paddingBlock: 4 }}>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 2, flexWrap: "wrap" }}
      >
        <Button variant="contained" color="secondary" startIcon={<Replay />} onClick={onNewSearch}>
          Nova pesquisa
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdf />}
          onClick={handleGeneratePdf}
          disabled={generating}
        >
          {generating ? "Gerando relatório…" : "Gerar relatório PDF"}
        </Button>
      </Box>
      {pdfError && (
        <Typography role="alert" sx={{ color: "error.main", textAlign: "right", mb: 1.5 }}>
          {pdfError}
        </Typography>
      )}

      {/* Cabeçalho: o registro da empresa, em tinta preta com o CNPJ como carimbo */}
      <Box
        component="header"
        sx={{
          backgroundColor: "#fff",
          color: tokens.ink,
          borderRadius: "16px",
          border: `1px solid ${tokens.line}`,
          borderTop: `4px solid ${tokens.blue}`,
          p: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.9,
                px: 1.4,
                py: 0.4,
                borderRadius: "999px",
                backgroundColor: tokens.surface,
                border: `1px solid ${tokens.line}`,
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: situacaoColor(empresa.descricao_situacao_cadastral),
                }}
              />
              {empresa.descricao_situacao_cadastral || "SITUAÇÃO NÃO INFORMADA"}
            </Box>
            {empresa.descricao_identificador_matriz_filial && (
              <Typography
                sx={{ fontSize: "0.8rem", letterSpacing: "0.06em", color: tokens.muted }}
              >
                {empresa.descricao_identificador_matriz_filial}
                {empresa.porte ? ` · Porte ${empresa.porte}` : ""}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              letterSpacing: "0.04em",
              color: "#fff",
              backgroundColor: tokens.blue,
              borderRadius: "8px",
              px: 1.5,
              py: 0.5,
            }}
          >
            {formatCnpj(empresa.cnpj)}
          </Box>
        </Box>

        <Typography
          component="h1"
          sx={{ fontSize: { xs: "1.35rem", md: "1.7rem" }, fontWeight: 600, lineHeight: 1.2 }}
        >
          {empresa.razao_social || "Razão social não informada"}
        </Typography>
        <Typography sx={{ color: tokens.muted, fontSize: "1rem", mt: 0.5 }}>
          {empresa.nome_fantasia?.trim() || "Sem nome fantasia"}
        </Typography>

        <Box
          sx={{
            mt: 2.5,
            pt: 2.25,
            borderTop: `1px solid ${tokens.line}`,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" },
            gap: 2.25,
          }}
        >
          <Fact label="Capital social" value={formatCurrency(empresa.capital_social)} />
          <Fact label="Início da atividade" value={formatDate(empresa.data_inicio_atividade)} />
          <Fact label="Natureza jurídica" value={empresa.natureza_juridica} />
          <Fact
            label="Cidade / UF"
            value={empresa.municipio ? `${empresa.municipio} - ${empresa.uf ?? ""}` : null}
          />
          <Fact
            label="Atividade principal"
            value={
              empresa.cnae_fiscal
                ? `${empresa.cnae_fiscal} · ${empresa.cnae_fiscal_descricao ?? ""}`
                : null
            }
          />
          <Fact
            label="Contato"
            value={
              [formatPhone(empresa.ddd_telefone_1), empresa.email]
                .filter((v) => v && v !== "Não informado")
                .join(" · ") || null
            }
          />
        </Box>
      </Box>

      <Typography sx={{ mt: 1.25, px: 0.5, fontSize: "0.72rem", color: "text.secondary" }}>
        {SOURCE_LINE}
      </Typography>

      {/* Abas por categoria */}
      <Paper
        elevation={0}
        sx={{ mt: 3, borderRadius: "16px", border: `1px solid ${tokens.line}`, overflow: "hidden" }}
      >
        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Categorias das informações da empresa"
          sx={{ borderBottom: `1px solid ${tokens.line}`, px: 1 }}
        >
          {tabs.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
        <Box role="tabpanel" sx={{ p: { xs: 2, md: 3 } }}>
          {tabs[tab].content}
        </Box>
      </Paper>
    </Container>
  );
};

const sectionTitleSx = { fontWeight: 600, fontSize: "0.9rem", mb: 1.25 };
