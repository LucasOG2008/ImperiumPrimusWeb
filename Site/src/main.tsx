import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fontes self-hosted (empacotadas no build — sem CDN externo).
// wght.css = apenas o eixo de peso (sem o eixo opsz, mais leve). Os subsets
// são separados por unicode-range: o browser baixa só o latino (cobre PT-BR).
import "@fontsource-variable/space-grotesk/wght.css";
import "@fontsource-variable/inter/wght.css";

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/sections.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
