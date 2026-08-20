/* =============================================================================
   GERADOR DA FITA CONTÍNUA — travessias esquerda↔direita guiadas pelo conteúdo.

   A fita cruza a página alternando o lado (esq → dir → esq → dir …). Para nunca
   passar por cima de conteúdo, o traçado é MEDIDO no DOM (ver RibbonLayer):
     - cada seção tem uma "faixa" reservada no seu lado (padding em sections.css);
       o segmento VERTICAL da fita corre por essa faixa, sempre ao lado do texto.
     - a TRAVESSIA de um lado para o outro acontece só no VÃO VAZIO entre duas
       seções (entre o fim do conteúdo de uma e o começo da próxima), faixa que
       é garantidamente livre em toda a largura.
     - ao CHEGAR na próxima seção, a diagonal para bem ACIMA do conteúdo e só
       então desce reto (já na faixa lateral, longe do texto). Isso dá folga
       generosa mesmo com títulos grandes e largos.

   Identidade preservada: só verticais + degraus/diagonais de canto vivo.
   ============================================================================= */

/** Segmento medido de uma seção: x da fita (na faixa do seu lado) + topo/base
 *  do CONTEÚDO (não da seção) em coordenadas do documento. */
export type Seg = { x: number; top: number; bottom: number };

type Pt = { x: number; y: number; clear?: boolean };

const ISO_SLOPE = Math.tan((30 * Math.PI) / 180); // 30° => dy = slope*|dx|
const ARRIVE = 64; // folga vertical acima do conteúdo ao chegar numa travessia

/**
 * Monta o `d` da fita a partir dos segmentos medidos (topo → base).
 *
 * @param lead âncoras de ENTRADA opcionais, prependadas antes do 1º segmento.
 *   Ex.: o "colchete" de canto reto no topo (stub vertical saindo da logo →
 *   trecho horizontal → desce no corredor do hero). A última âncora do lead deve
 *   estar no x do 1º segmento (a descida vertical até o conteúdo é automática).
 *   Se ausente, a fita nasce no topo do conteúdo do 1º segmento (abaixo da barra).
 */
export function buildRibbonPath(segs: Seg[], h: number, lead?: { x: number; y: number }[]): string {
  if (!segs.length) return "";

  const pts: Pt[] = [];
  if (lead) lead.forEach((p) => pts.push({ x: p.x, y: p.y }));

  segs.forEach((s, i) => {
    // `clear` marca as travessias ENTRE seções (i > 0): a chegada para acima do
    // conteúdo. A chegada no 1º segmento (hero) não usa folga.
    pts.push({ x: s.x, y: s.top, clear: i > 0 });
    pts.push({ x: s.x, y: s.bottom });
  });

  // Arremate reto até o fim do documento no x do último segmento.
  pts.push({ x: segs[segs.length - 1].x, y: h });

  return anchorsToPath(pts);
}

/**
 * Liga âncoras usando só verticais e degraus. Numa transição com dx != 0:
 *   - se o vão comporta um degrau iso a 30°, faz vertical → diagonal → vertical;
 *   - senão (travessia larga em vão estreito) faz uma diagonal única que, quando
 *     o destino é marcado `clear`, PARA `ARRIVE`px acima do topo do conteúdo e
 *     desce reto na faixa lateral — nunca encostando no título da seção.
 * Nunca introduz segmento horizontal (que poderia tocar conteúdo ao lado).
 */
function anchorsToPath(pts: Pt[]): string {
  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;
  let cur = pts[0];

  for (let i = 1; i < pts.length; i++) {
    const next = pts[i];
    const dx = next.x - cur.x;
    const dy = next.y - cur.y;

    if (Math.abs(dx) < 0.5) {
      d += ` L ${round(next.x)} ${round(next.y)}`;
    } else {
      const diagDy = ISO_SLOPE * Math.abs(dx);
      if (diagDy > dy) {
        // Travessia larga. Se o destino pede folga, mira acima do conteúdo e
        // desce reto; assim a diagonal fica bem acima do título.
        const clear = next.clear ? Math.min(ARRIVE, Math.max(dy - 8, 0)) : 0;
        const midY = next.y - clear;
        d += ` L ${round(next.x)} ${round(midY)}`;
        if (clear > 0.5) d += ` L ${round(next.x)} ${round(next.y)}`;
      } else {
        // Degrau isométrico com a diagonal a 30° centrada no vão.
        const room = dy - diagDy;
        const y1 = cur.y + room / 2;
        const y2 = y1 + diagDy;
        d += ` L ${round(cur.x)} ${round(y1)}`;
        d += ` L ${round(next.x)} ${round(y2)}`;
        d += ` L ${round(next.x)} ${round(next.y)}`;
      }
    }
    cur = next;
  }

  return d;
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
