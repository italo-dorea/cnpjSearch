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
          App para Windows 10 e 11 · {DOWNLOAD.size}
        </Typography>

        <Button variant="contained" color="primary" startIcon={<FileDownloadOutlined />} {...linkProps}>
          Baixar para Windows
        </Button>

        <Box
          component="details"
          sx={{ mt: 1.25, fontSize: "0.88rem", color: tokens.muted, "& summary": { cursor: "pointer" } }}
        >
          <summary>Como instalar</summary>
          <Box component="ol" sx={{ m: 0, mt: 0.75, pl: 2.5, display: "grid", gap: 0.75 }}>
            <li>
              Clique em <strong>Baixar para Windows</strong>. Se o Google Drive pedir uma confirmação
              por causa do tamanho do arquivo, clique em <strong>Baixar mesmo assim</strong>.
            </li>
            <li>
              Abra o arquivo baixado. Se o Windows perguntar se você confia nele, é só porque o app
              ainda é novo: clique em <strong>Mais informações</strong> e depois em{" "}
              <strong>Executar assim mesmo</strong>.
            </li>
            <li>
              Siga as telas do instalador. No fim, o CNPJSearch fica na sua área de trabalho e no
              menu Iniciar.
            </li>
          </Box>

          {/* Informação técnica, para quem quiser conferir o arquivo; não atrapalha quem só quer instalar */}
          <Box component="details" sx={{ mt: 1, fontSize: "0.8rem", "& summary": { cursor: "pointer" } }}>
            <summary>Quer conferir o arquivo? (avançado)</summary>
            <Box sx={{ mt: 0.5 }}>
              Versão {DOWNLOAD.version}. Código de verificação (SHA-256):
              <Box component="code" sx={{ display: "block", mt: 0.25, wordBreak: "break-all", fontSize: "0.76rem" }}>
                {DOWNLOAD.sha256}
              </Box>
            </Box>
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
