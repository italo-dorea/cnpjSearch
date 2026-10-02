import React from "react";
import { Box, Typography } from "@mui/material";
import { tokens } from "../theme";
import type { Field } from "../utils/empresaSections";
import { EMPTY_LABEL, isEmptyValue } from "../utils/format";

// Nenhum campo some da tela: vazios aparecem como "Não informado".
export const FieldGrid: React.FC<{ fields: Field[] }> = ({ fields }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
      gap: 1.5,
    }}
  >
    {fields.map(({ label, value }) => {
      const empty = isEmptyValue(value);
      return (
        <Box
          key={label}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: "10px",
            border: `1px solid ${tokens.line}`,
            backgroundColor: tokens.surface,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.92rem",
              lineHeight: 1.45,
              wordBreak: "break-word",
              ...(empty && { color: tokens.faint, fontStyle: "italic" }),
            }}
          >
            {empty ? EMPTY_LABEL : value}
          </Typography>
        </Box>
      );
    })}
  </Box>
);
