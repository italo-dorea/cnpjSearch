import React, { useState } from "react";
import ResponsiveAppBar from "../components/AppBar";
import {
  Container,
  Grid,
  IconButton,
  InputBase,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getCNPJ } from "../services/cnpj";
import imageLogo from "../assets/searchAvatar.jpg";
import { Footer } from "../components/Footer";
import { DownloadCard } from "../components/DownloadApp";
import { InfoCnpj } from "./InfoCnpj";
import { Empresa } from "../interfaces/Empresa";
import { tokens } from "../theme";

const DashboardPage: React.FC = () => {
  const [cnpj, setCnpj] = useState<string>("");
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
      .replace(/^(\d{2})(\d)/, "$1.$2") // Coloca o primeiro ponto
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Coloca o segundo ponto
      .replace(/\.(\d{3})(\d)/, ".$1/$2") // Coloca a barra
      .replace(/(\d{4})(\d)/, "$1-$2") // Coloca o traço
      .slice(0, 18); // Limita a 18 caracteres
  };

  const removeMask = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNPJ(event.target.value);
    setCnpj(formattedValue);
  };
  const handleSearchClick = async () => {
    setLoading(true);
    try {
      const unmaskedCNPJ = removeMask(cnpj);
      const empresaData = await getCNPJ(unmaskedCNPJ);
      setEmpresa(empresaData);
      setError(null);
    } catch (error) {
      setError(
        (error instanceof Error && error.message) ||
          "Erro ao consultar o CNPJ. Verifique o número e tente novamente."
      );
      setEmpresa(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      {!empresa && ( //quando empresa existe, retiro os inputs de pesquisa.
        <Container maxWidth="lg">
          <Grid
            container
            spacing={8}
            sx={{
              // ocupa a janela inteira entre a barra do topo e o rodapé fixo (sem rolagem)
              minHeight: `calc(100vh - ${tokens.appBarHeight}px - var(--footer-h, ${tokens.footerHeight}px))`,
              display: "flex",
              alignItems: "center", // alinha verticalmente ao centro
              justifyContent: "center", // opcional: centraliza horizontalmente
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                alignItems: "center", // alinha verticalmente ao centro
                justifyContent: "center", // opcional: centraliza horizontalmente
              }}
            >
              <Stack direction={"column"} spacing={5}>
                <Typography variant="h5" sx={styles.title}>
                  Consulte os dados de uma empresa pelo CNPJ
                </Typography>
                <Box
                  component="form"
                  sx={{
                    p: "1px 20px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "#fff",
                    borderRadius: "999px",
                    border: "1.5px solid",
                    borderColor: "secondary.main",
                    transition: "border-color .15s, box-shadow .15s",
                    "&:focus-within": {
                      borderColor: "primary.main",
                      boxShadow: "0 0 0 3px rgba(3, 109, 197, 0.18)",
                    },
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchClick();
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="00.000.000/0000-00"
                    inputProps={{
                      "aria-label": "Pesquisar CNPJ",
                      inputMode: "numeric",
                    }}
                    value={cnpj}
                    onChange={handleInputChange}
                    required
                  />
                  <IconButton
                    type="button"
                    sx={{
                      p: "10px",
                      my: "6px",
                      color: "#fff",
                      backgroundColor: "primary.main",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                    aria-label="Consultar CNPJ"
                    onClick={handleSearchClick}
                  >
                    <Search />
                  </IconButton>
                </Box>
                <DownloadCard />
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                // no celular a ilustração só ocuparia espaço: o foco é a consulta
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Box component="img" sx={styles.imageLogo} src={imageLogo}></Box>
            </Grid>
            {loading && (
              <Box sx={{ width: "50%", mt: 2 }}>
                <LinearProgress
                  sx={{
                    backgroundColor: tokens.blueTint,
                    "& .MuiLinearProgress-bar": { backgroundColor: "primary.main" },
                  }}
                />
              </Box>
            )}
            {error && (
              <Grid item xs={12}>
                <Typography role="alert" sx={{ color: "error.main", fontWeight: 500 }}>
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
      {empresa && (
        <InfoCnpj empresa={empresa} onNewSearch={() => setEmpresa(null)} />
      )}
      <Footer />
    </>
  );
};

export default DashboardPage;

const styles = {
  imageLogo: {
    width: 400,
    height: 400,
    mixBlendMode: "multiply", // o fundo branco da imagem assume o off-white da página
  },
  title: {
    fontWeight: 600,
    "@media (max-width: 600px)": {
      paddingTop: 3,
    },
  },
};
