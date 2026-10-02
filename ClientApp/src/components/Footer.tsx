import { useLayoutEffect, useRef, useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { isSupportConfigured } from "../config";
import { useSupportHint } from "../hooks/useSupportHint";
import { tokens } from "../tokens";
import { SupportDialog } from "./SupportDialog";
import { SupportHint } from "./SupportHint";
import { CoffeeSteam } from "./CoffeeSteam";

export const Footer = () => {
  const [supportOpen, setSupportOpen] = useState(false);
  const configured = isSupportConfigured();
  // No celular a dica flutuante é dispensada: tela pequena é para ver os dados da empresa.
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const hint = useSupportHint(supportOpen, configured && !isMobile);
  const footerRef = useRef<HTMLElement>(null);

  // No celular o texto e o botão quebram em duas linhas: o rodapé mede a própria altura e a
  // publica em --footer-h, que reserva o espaço no fim da página e afasta a dica flutuante.
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--footer-h", `${el.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Abrir o apoio, por qualquer caminho, encerra a dica de vez.
  const openSupport = () => {
    hint.stop();
    setSupportOpen(true);
  };

  return (
    <>
      {/* Espaço no fim do conteúdo, para o rodapé fixo não cobrir nada */}
      <Box aria-hidden sx={{ height: `var(--footer-h, ${tokens.footerHeight}px)` }} />
      <Box
        component="footer"
        ref={footerRef}
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: tokens.footerHeight,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          columnGap: 2,
          px: 2,
          py: { xs: 0.5, sm: 0 },
          textAlign: "center",
          backgroundColor: tokens.page,
          borderTop: `1px solid ${tokens.line}`,
        }}
      >
        {/* No celular o rodapé encurta para caber numa linha */}
        <Typography>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            2024 &copy; Desenvolvido por&nbsp;
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            &copy;&nbsp;
          </Box>
          <Box component="span" sx={{ fontWeight: 600 }}>
            ID Soluções Tech
          </Box>
        </Typography>
        {/* Só aparece com um meio de pagamento válido configurado em src/config.ts */}
        {configured && (
          <Button
            size="small"
            startIcon={<CoffeeSteam size={26} decorative />}
            onClick={openSupport}
            sx={{ color: tokens.muted, "&:hover": { color: "primary.main", backgroundColor: "transparent" } }}
          >
            Apoie
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              &nbsp;o desenvolvedor
            </Box>
          </Button>
        )}
      </Box>
      <SupportDialog open={supportOpen} onClose={() => setSupportOpen(false)} />
      {configured && !isMobile && (
        <SupportHint
          open={hint.visible}
          onClose={hint.hide}
          onSupport={openSupport}
          onDismiss={hint.stop}
        />
      )}
    </>
  );
};
