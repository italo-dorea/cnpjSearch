import React from "react";
import { Box, Button, Snackbar, Typography, useMediaQuery } from "@mui/material";
import { HINT_DISPLAY_MS } from "../utils/supportHint";
import { tokens } from "../tokens";
import { CoffeeSteam } from "./CoffeeSteam";

interface SupportHintProps {
  open: boolean;
  /** Fecha sem parar de vez (tempo esgotado). */
  onClose: () => void;
  onSupport: () => void;
  /** "Agora não": fecha e não mostra mais. */
  onDismiss: () => void;
}

/** Dica flutuante no canto: não cobre campos, não bloqueia a tela e some sozinha. */
export const SupportHint: React.FC<SupportHintProps> = ({ open, onClose, onSupport, onDismiss }) => {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <Snackbar
      open={open}
      autoHideDuration={HINT_DISPLAY_MS}
      onClose={(_, reason) => {
        if (reason !== "clickaway") onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      // acima do rodapé fixo
      sx={{
        bottom: {
          xs: `calc(var(--footer-h, ${tokens.footerHeight}px) + 16px)`,
          sm: `calc(var(--footer-h, ${tokens.footerHeight}px) + 16px)`,
        },
      }}
      TransitionProps={{ timeout: reduceMotion ? 0 : 220 }}
    >
      <Box
        role="status"
        aria-live="polite"
        sx={{
          maxWidth: 340,
          p: 1.75,
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
          backgroundColor: "#fff",
          border: `1px solid ${tokens.line}`,
          borderLeft: `4px solid ${tokens.blue}`,
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(11, 15, 26, 0.14)",
        }}
      >
        <CoffeeSteam size={40} />
        <Box>
          <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.35 }}>
            Curtiu o CNPJSearch? Ajude com o cafezinho.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button size="small" variant="contained" color="primary" onClick={onSupport}>
              Ajudar
            </Button>
            <Button size="small" color="secondary" onClick={onDismiss}>
              Agora não
            </Button>
          </Box>
        </Box>
      </Box>
    </Snackbar>
  );
};
