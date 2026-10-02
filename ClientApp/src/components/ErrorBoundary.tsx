import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";
import { tokens } from "../tokens";

interface State {
  error: Error | null;
}

/** Evita a tela em branco: se algo quebrar ao renderizar, mostra o erro e oferece recarregar. */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Erro de renderização:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <Box
        role="alert"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backgroundColor: tokens.page,
        }}
      >
        <Box
          sx={{
            maxWidth: 460,
            width: "100%",
            textAlign: "center",
            backgroundColor: "#fff",
            border: `1px solid ${tokens.line}`,
            borderTop: `4px solid ${tokens.blue}`,
            borderRadius: "16px",
            p: { xs: 3, sm: 4 },
          }}
        >
          <ErrorOutline sx={{ fontSize: 48, color: tokens.blue }} />
          <Typography component="h1" sx={{ fontSize: "1.5rem", fontWeight: 600, mt: 1 }}>
            Não foi possível exibir esta tela
          </Typography>
          <Typography sx={{ color: tokens.muted, mt: 1, mb: 3 }}>
            Ocorreu um erro inesperado. Recarregue a página para voltar à consulta.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </Button>
          <Box
            component="details"
            sx={{ mt: 3, textAlign: "left", color: tokens.muted, fontSize: "0.8rem" }}
          >
            <summary style={{ cursor: "pointer" }}>Detalhes do erro</summary>
            <Box component="pre" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mt: 1 }}>
              {error.message}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}
