import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DesktopWindowsOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { DOWNLOAD, isDownloadConfigured } from "../config";
import { tokens } from "../tokens";

const linkProps = {
  component: "a",
  href: DOWNLOAD.url,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Cartão da página inicial: baixar o app para Windows (versão desktop do CNPJSearch). */
export const DownloadCard: React.FC = () => {
  if (!isDownloadConfigured()) return null;

  return (
    <Box
      sx={{
        p: 2,
        // app de Windows: não faz sentido oferecer no celular
        display: { xs: "none", sm: "flex" },
        gap: 1.75,
        alignItems: "flex-start",
        backgroundColor: "#fff",
        border: `1px solid ${tokens.line}`,
        borderRadius: "14px",
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: "12px",
          backgroundColor: tokens.blueTint,
          color: tokens.blue,
        }}
      >
        <DesktopWindowsOutlined />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, lineHeight: 1.25 }}>Prefere usar no computador?</Typography>
        <Typography sx={{ color: tokens.muted, fontSize: "0.9rem", mb: 1.25 }}>
          App para Windows 10 e 11 · versão {DOWNLOAD.version} · {DOWNLOAD.size}
        </Typography>

        <Button variant="contained" color="primary" startIcon={<FileDownloadOutlined />} {...linkProps}>
          Baixar para Windows
        </Button>

        <Box
          component="details"
          sx={{ mt: 1.25, fontSize: "0.85rem", color: tokens.muted, "& summary": { cursor: "pointer" } }}
        >
          <summary>Como instalar</summary>
          <Box component="ul" sx={{ m: 0, mt: 0.75, pl: 2.25, display: "grid", gap: 0.5 }}>
            <li>
              O Google Drive mostra um aviso porque o arquivo é grande: clique em{" "}
              <strong>Baixar mesmo assim</strong>.
            </li>
            <li>
              O instalador ainda não tem assinatura digital, então o Windows pode exibir o aviso do
              SmartScreen: clique em <strong>Mais informações</strong> e depois em{" "}
              <strong>Executar assim mesmo</strong>.
            </li>
            <li>
              Para conferir o arquivo baixado (SHA-256):
              <Box component="code" sx={{ display: "block", mt: 0.25, wordBreak: "break-all", fontSize: "0.78rem" }}>
                {DOWNLOAD.sha256}
              </Box>
            </li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/** Botão compacto para a barra do topo (some no celular). */
export const DownloadBarButton: React.FC = () => {
  if (!isDownloadConfigured()) return null;

  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<FileDownloadOutlined />}
      aria-label="Baixar o app para Windows"
      {...linkProps}
      sx={{
        // app de Windows: escondido no celular
        display: { xs: "none", sm: "inline-flex" },
        color: "#fff",
        borderColor: "rgba(255,255,255,.45)",
        whiteSpace: "nowrap",
        "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,.08)" },
      }}
    >
      Baixar app
    </Button>
  );
};
