import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { Check, ContentCopy, OpenInNew } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import {
  SUPPORT_FIXED_AMOUNT,
  SUPPORT_PIX,
  SUPPORT_PROVIDER,
  SUPPORT_URL,
  isSupportLinkConfigured,
} from "../config";
import { tokens } from "../tokens";
import { CoffeeSteam } from "./CoffeeSteam";

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

type Copied = "code" | "key" | null;

// Marca do app no centro do QR (lupa em quadrado azul). O nível de correção "H" tolera o recorte.
const QR_MARK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${tokens.blue}"/>` +
    `<circle cx="28" cy="28" r="13" fill="none" stroke="#fff" stroke-width="5"/>` +
    `<line x1="38" y1="38" x2="50" y2="50" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`
)}`;

const STEPS = [
  "Abra o app do seu banco",
  "Escolha Pix e leia o QR Code, ou cole o código",
  "Informe o valor que quiser e confirme",
];

/** Doação voluntária: sem contrapartida e com pagamento feito fora do site (no app do banco). */
export const SupportDialog: React.FC<SupportDialogProps> = ({ open, onClose }) => {
  const [copied, setCopied] = useState<Copied>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (what: Exclude<Copied, null>, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFailed(false);
      setCopied(what);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setCopyFailed(true);
    }
  };

  const openLink = () => {
    // Abre em outra aba, sem dar ao destino acesso à janela do site.
    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
    onClose();
  };

  const pix = SUPPORT_PIX;
  const amountText = SUPPORT_FIXED_AMOUNT
    ? `no valor de ${SUPPORT_FIXED_AMOUNT}`
    : pix?.hasFixedAmount
      ? "no valor indicado no código"
      : "no valor que quiser";
  const steps = SUPPORT_FIXED_AMOUNT || pix?.hasFixedAmount ? STEPS.slice(0, 2).concat("Confirme o pagamento") : STEPS;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="support-title"
      PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden" } }}
    >
      {/* Abertura: café com fumaça e o título, sobre fundo branco */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, pt: 2.5 }}>
        <CoffeeSteam size={60} />
        <Box>
          <Typography id="support-title" component="h2" sx={{ fontSize: "1.4rem", fontWeight: 600, lineHeight: 1.15 }}>
            Apoie o desenvolvedor
          </Typography>
          <Typography sx={{ fontSize: "0.95rem", color: tokens.muted }}>
            Ajude com o cafezinho: um Pix {amountText}.
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {pix && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "auto 1fr" },
              gap: 3,
              alignItems: "center",
              justifyItems: { xs: "center", sm: "stretch" },
            }}
          >
            {/* O QR Code e os passos só aparecem em tela grande: no celular não dá para escanear
                a própria tela, e "Copiar código Pix" resolve. */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Box
                sx={{
                  p: 1.25,
                  backgroundColor: "#fff",
                  border: `2px solid ${tokens.ink}`,
                  borderRadius: "16px",
                  lineHeight: 0,
                }}
              >
                <QRCodeSVG
                  value={pix.payload}
                  size={184}
                  level="H"
                  marginSize={0}
                  fgColor={tokens.ink}
                  bgColor="#ffffff"
                  imageSettings={{ src: QR_MARK, width: 38, height: 38, excavate: true }}
                  title="QR Code Pix para apoiar o desenvolvedor"
                />
              </Box>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography sx={{ fontWeight: 600, mb: 1, display: { xs: "none", sm: "block" } }}>
                Como apoiar
              </Typography>
              <Box
                component="ol"
                sx={{ m: 0, p: 0, listStyle: "none", display: { xs: "none", sm: "grid" }, gap: 1.1 }}
              >
                {steps.map((text, i) => (
                  <Box component="li" key={text} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
                    <Box
                      component="span"
                      sx={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        backgroundColor: tokens.blueTint,
                        color: tokens.blue,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.35 }}>{text}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: { xs: 0, sm: 2 } }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={copied === "code" ? <Check /> : <ContentCopy />}
                  onClick={() => copy("code", pix.payload)}
                >
                  {copied === "code" ? "Código copiado" : "Copiar código Pix"}
                </Button>
                {pix.key && (
                  <Button
                    color="secondary"
                    startIcon={copied === "key" ? <Check /> : <ContentCopy />}
                    onClick={() => copy("key", pix.key as string)}
                  >
                    {copied === "key" ? "Chave copiada" : "Copiar só a chave"}
                  </Button>
                )}
              </Box>
              {copyFailed && (
                <Typography role="alert" sx={{ color: "error.main", fontSize: "0.85rem", mt: 1 }}>
                  Não foi possível copiar.
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {" "}
                    Use o QR Code.
                  </Box>
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            mt: 2.5,
            p: 1.5,
            borderRadius: "10px",
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.line}`,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
            Contribuição voluntária. Não libera recursos nem altera o app.
          </Typography>
          <Typography sx={{ color: tokens.muted, fontSize: "0.85rem", mt: 0.5 }}>
            {pix
              ? "Pagamento via Pix, concluído no app do seu banco. "
              : `O pagamento é feito na página do ${SUPPORT_PROVIDER}, aberta no seu navegador. `}
            O CNPJSearch não recebe nem guarda dados de pagamento.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: "wrap", gap: 1 }}>
        {isSupportLinkConfigured() && (
          <Button color="secondary" endIcon={<OpenInNew />} onClick={openLink} sx={{ mr: "auto" }}>
            {pix ? `Prefere cartão? Abrir ${SUPPORT_PROVIDER}` : `Abrir página do ${SUPPORT_PROVIDER}`}
          </Button>
        )}
        <Button color="secondary" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
