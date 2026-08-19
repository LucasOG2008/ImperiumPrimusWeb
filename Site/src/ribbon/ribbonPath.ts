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
// O conteúdo ocupa quase toda a largura, então a fita CORRE PELAS BORDAS
// (faixas sempre livres de texto) e só cruza o centro UMA vez, com a diagonal
// centrada no vão vazio entre Manifesto e Princípios (onde os dois lados estão
// livres). Assim a fita nunca passa por cima das colunas de texto.
export const ANCHORS: Anchor[] = [
  { xf: 0.5, yf: 0.0 }, // nasce no centro (herança do hero, atrás da logo)
  { xf: 0.5, yf: 0.055 },
  { xf: 0.0, yf: 0.15 }, // desce para a borda esquerda (manifesto: lado esq. vazio)
  { xf: 0.0, yf: 0.175 },
  { xf: 1.0, yf: 0.27 }, // única travessia — diagonal centrada no vão manifesto/princípios
  { xf: 1.0, yf: 0.42 }, // borda direita (princípios)
  { xf: 1.0, yf: 0.56 }, // borda direita (serviços)
  { xf: 1.0, yf: 0.66 }, // borda direita (processo)
  { xf: 1.0, yf: 0.75 }, // borda direita (diferença)
  { xf: 1.0, yf: 0.84 }, // borda direita (projetos)
  { xf: 1.0, yf: 0.93 }, // borda direita (contato)
  { xf: 1.0, yf: 0.99 }, // culmina no canto inferior direito
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
