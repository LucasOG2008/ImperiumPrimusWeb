// One-off: vetoriza public/ip-mark.png (logo branca sobre preto) em SVG.
// Uso: node scripts/trace-logo.mjs [threshold]
import potrace from "potrace";
import { writeFileSync } from "node:fs";

const threshold = Number(process.argv[2] ?? 128);
const src = new URL("../public/ip-mark.png", import.meta.url);

const trace = new potrace.Potrace({
  threshold,
  blackOnWhite: false, // traça as regiões CLARAS (a logo), não o fundo preto
  turdSize: 40, // remove ruído/pontos soltos do glow
  optTolerance: 0.4,
  color: "#ffffff",
  background: "transparent",
});

trace.loadImage(src.pathname.replace(/^\//, ""), (err) => {
  if (err) {
    console.error("ERRO:", err);
    process.exit(1);
  }
  const svg = trace.getSVG();
  const out = new URL("../src/assets/ip-mark-trace.svg", import.meta.url);
  writeFileSync(out, svg);
  const paths = (svg.match(/<path/g) || []).length;
  const vb = svg.match(/viewBox="([^"]+)"/);
  const dLen = (svg.match(/ d="([^"]*)"/g) || []).reduce((a, s) => a + s.length, 0);
  console.log(JSON.stringify({ threshold, paths, viewBox: vb && vb[1], dLen }));
});
