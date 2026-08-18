/* =============================================================================
   GERADOR DA FITA CONTÍNUA
   Uma única polilinha rígida em coordenadas de PÍXEL (documento inteiro).
   Regras que garantem o look "engenharia / isométrico" da logo:
     - só segmentos verticais + diagonais de UMA MESMA inclinação (paralelas);
     - dobras em canto vivo (sem curva orgânica);
     - conectores em degrau: vertical → diagonal iso → vertical.
   ============================================================================= */

export type Anchor = { xf: number; yf: number }; // frações de largura/altura

// Âncoras do percurso (topo → base). xf: 0 = esquerda, 1 = direita.
// Pensadas para acompanhar a narrativa das seções e cruzar a página em zigue-zague.
export const ANCHORS: Anchor[] = [
  { xf: 0.5, yf: 0.0 }, // nasce no centro (herança do hero)
  { xf: 0.5, yf: 0.05 },
  { xf: 0.18, yf: 0.13 }, // vira à esquerda (manifesto)
  { xf: 0.18, yf: 0.24 },
  { xf: 0.82, yf: 0.33 }, // cruza p/ direita (princípios)
  { xf: 0.82, yf: 0.45 },
  { xf: 0.2, yf: 0.53 }, // volta à esquerda (serviços)
  { xf: 0.2, yf: 0.63 },
  { xf: 0.8, yf: 0.71 }, // direita (processo)
  { xf: 0.8, yf: 0.82 },
  { xf: 0.5, yf: 0.89 }, // recentraliza (projetos)
  { xf: 0.5, yf: 0.97 }, // culmina no contato
];

const ISO_SLOPE = Math.tan((30 * Math.PI) / 180); // 30° => dy = slope*|dx|

/**
 * Constrói o `d` da fita para um documento de dimensões (w × h).
 * Margens laterais são respeitadas para a fita não colar nas bordas.
 */
export function buildRibbonPath(w: number, h: number): string {
  const margin = Math.max(24, Math.min(w * 0.08, 120));
  const usableW = w - margin * 2;

  const pts = ANCHORS.map((a) => ({
    x: margin + a.xf * usableW,
    y: a.yf * h,
  }));

  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;
  let cur = pts[0];

  for (let i = 1; i < pts.length; i++) {
    const next = pts[i];
    const dx = next.x - cur.x;
    const dy = next.y - cur.y;

    if (Math.abs(dx) < 0.5) {
      // puramente vertical
      d += ` L ${round(next.x)} ${round(next.y)}`;
    } else {
      // conector em degrau, diagonal com inclinação iso fixa
      const diagDy = ISO_SLOPE * Math.abs(dx);
      const room = Math.max(dy - diagDy, 0);
      const y1 = cur.y + room / 2; // fim do 1º trecho vertical
      const y2 = y1 + diagDy; // fim da diagonal
      d += ` L ${round(cur.x)} ${round(y1)}`;
      d += ` L ${round(next.x)} ${round(y2)}`;
      d += ` L ${round(next.x)} ${round(next.y)}`;
    }
    cur = next;
  }

  return d;
}

/** Variante mobile: percurso mais estreito e vertical (menos travessias). */
export function buildRibbonPathMobile(w: number, h: number): string {
  const left = Math.max(18, w * 0.12);
  const right = w - left;
  const mid = w * 0.5;
  const xs = [mid, mid, left, left, right, right, left, left, right, right, mid, mid];
  const pts = ANCHORS.map((a, i) => ({ x: clampX(xs[i], left, right), y: a.yf * h }));

  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;
  let cur = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const next = pts[i];
    if (Math.abs(next.x - cur.x) < 0.5) {
      d += ` L ${round(next.x)} ${round(next.y)}`;
    } else {
      const diagDy = ISO_SLOPE * Math.abs(next.x - cur.x);
      const y1 = cur.y + Math.max((next.y - cur.y - diagDy) / 2, 0);
      const y2 = y1 + diagDy;
      d += ` L ${round(cur.x)} ${round(y1)} L ${round(next.x)} ${round(y2)} L ${round(next.x)} ${round(next.y)}`;
    }
    cur = next;
  }
  return d;
}

function clampX(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}
function round(n: number) {
  return Math.round(n * 10) / 10;
}
