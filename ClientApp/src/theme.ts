import { createTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

export { tokens };

export const theme = createTheme({
  palette: {
    primary: { main: tokens.blue, dark: tokens.blueDark, contrastText: "#fff" },
    secondary: { main: tokens.ink, dark: tokens.blue, contrastText: "#fff" },
    text: { primary: tokens.ink, secondary: tokens.muted },
    error: { main: "#C62828" },
    background: { default: tokens.page, paper: "#fff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: tokens.fontSans,
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 20, paddingBlock: 9 },
        // Botão preto vira azul ao passar o mouse: as duas cores do tema na mesma interação.
        containedSecondary: { "&:hover": { backgroundColor: tokens.blue } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, fontSize: "0.875rem", minHeight: 46 },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { height: 3, borderRadius: "3px 3px 0 0" } },
    },
  },
});
