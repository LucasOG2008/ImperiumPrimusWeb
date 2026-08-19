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
// A fita faz um ZIGUE-ZAGUE espalhado, alternando entre a faixa esquerda e a
// direita a cada seção. Para não passar por cima de texto, cada seção reserva
// uma "faixa da fita" no lado correspondente (o conteúdo se afasta — ver
// `--ribbon-lane` em sections.css). As travessias ficam centradas nos vãos
// entre seções, onde o miolo está vazio.
const L = 0.14; // faixa esquerda
const R = 0.86; // faixa direita
export const ANCHORS: Anchor[] = [
  { xf: 0.5, yf: 0.0 }, // nasce no centro (herança do hero, atrás da logo)
  { xf: 0.5, yf: 0.05 },
  { xf: L, yf: 0.13 }, // → esquerda (manifesto)
  { xf: L, yf: 0.185 },
  { xf: R, yf: 0.25 }, // → direita (princípios)
  { xf: R, yf: 0.36 },
  { xf: L, yf: 0.43 }, // → esquerda (serviços)
  { xf: L, yf: 0.51 },
  { xf: R, yf: 0.575 }, // → direita (processo)
  { xf: R, yf: 0.61 },
  { xf: L, yf: 0.68 }, // → esquerda (diferença)
  { xf: L, yf: 0.705 },
  { xf: R, yf: 0.77 }, // → direita (projetos)
  { xf: R, yf: 0.79 },
  { xf: L, yf: 0.855 }, // → esquerda (contato)
  { xf: L, yf: 0.95 },
  { xf: L, yf: 0.99 }, // culmina no canto inferior esquerdo
];

const ISO_SLOPE = Math.tan((30 * Math.PI) / 180); // 30° => dy = slope*|dx|

/**
 * Constrói o `d` da fita para um documento de dimensões (w × h).
 * Margens laterais são respeitadas para a fita não colar nas bordas.
 */
export function buildRibbonPath(w: number, h: number): string {
  // Inset pequeno: a fita encosta nas bordas (dentro do padding do container,
  // à esquerda/direita de todo o texto), não no meio do conteúdo.
  const margin = Math.max(16, Math.min(w * 0.02, 28));
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

/**
 * Variante mobile: no celular o texto é uma coluna única de largura cheia,
 * então a fita se mantém na BORDA ESQUERDA (única faixa livre de texto), com
 * pequenas dobras isométricas dentro do gutter — nunca cruza o conteúdo.
 */
export function buildRibbonPathMobile(w: number, h: number): string {
  const edge = Math.max(10, w * 0.035); // encostada à esquerda, dentro do gutter
  const notch = edge + Math.max(14, w * 0.05); // dobra rasa, ainda antes do texto
  // Alterna borda/dobra para dar o caráter de fita dobrada, sem sair do gutter.
  const xs = [edge, edge, notch, notch, edge, edge, notch, notch, edge, edge, notch, edge];
  const pts = ANCHORS.map((a, i) => ({ x: xs[i], y: a.yf * h }));

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

function round(n: number) {
  return Math.round(n * 10) / 10;
}
