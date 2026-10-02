import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { tokens } from "../tokens";

// Cada fio de fumaça sobe, balança de leve e some; os três saem defasados para parecer natural.
const rise = keyframes`
  0%   { opacity: 0;   transform: translate(0, 6px) scaleY(0.8); }
  25%  { opacity: 0.9; }
  60%  { opacity: 0.55; transform: translate(1.5px, -3px) scaleY(1); }
  100% { opacity: 0;   transform: translate(-1px, -11px) scaleY(1.15); }
`;

interface CoffeeSteamProps {
  size?: number;
  /** Ao lado de um texto que já descreve a ação (ex.: dentro de um botão), esconde dos leitores de tela. */
  decorative?: boolean;
}

/** Xícara de café com fumaça animada (SVG). Sem animação para quem reduz movimento no sistema. */
export const CoffeeSteam: React.FC<CoffeeSteamProps> = ({ size = 56, decorative = false }) => (
  <Box
    component="svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Xícara de café" })}
    sx={{
      flexShrink: 0,
      "& .steam": {
        fill: "none",
        stroke: tokens.slate,
        strokeWidth: 2.6,
        strokeLinecap: "round",
        transformBox: "fill-box",
        transformOrigin: "50% 100%",
        animation: `${rise} 2.6s ease-in-out infinite`,
        opacity: 0,
      },
      "& .s2": { animationDelay: "0.85s" },
      "& .s3": { animationDelay: "1.7s" },
      "@media (prefers-reduced-motion: reduce)": {
        "& .steam": { animation: "none", opacity: 0.6 },
      },
    }}
  >
    {/* fumaça */}
    <path className="steam s1" d="M23 25c-3.2-3.4 3.2-5.6 0-9.4" />
    <path className="steam s2" d="M31 25c-3.2-3.4 3.2-5.6 0-9.4" />
    <path className="steam s3" d="M39 25c-3.2-3.4 3.2-5.6 0-9.4" />
    {/* xícara */}
    <path d="M13 30h34v10a13 13 0 0 1-13 13h-8A13 13 0 0 1 13 40V30z" fill={tokens.blue} />
    <path d="M47 33h3.5a6.5 6.5 0 0 1 0 13H46" fill="none" stroke={tokens.blue} strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="30" cy="30" rx="17" ry="2.6" fill={tokens.blueDark} />
    {/* pires */}
    <path d="M8 56.5h44" stroke={tokens.ink} strokeWidth="3.4" strokeLinecap="round" />
  </Box>
);
