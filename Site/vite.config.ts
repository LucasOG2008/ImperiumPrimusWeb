import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Mantém o WebGL (three + fiber) e o GSAP fora do bundle inicial da aplicação.
// O chunk `three` só é baixado quando o hero 3D monta (lazy).
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("three") || id.includes("@react-three")) return "three";
          if (id.includes("gsap")) return "gsap";
        },
      },
    },
  },
});
