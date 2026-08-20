import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { buildRibbonPath, type Seg } from "./ribbonPath";
import { useReducedMotion } from "../lib/useReducedMotion";
import "./RibbonLayer.css";

type Props = {
  /** Elemento que define a altura real do conteúdo (para dimensionar a fita). */
  contentRef: RefObject<HTMLElement | null>;
};

// Regiões que a fita acompanha (topo → base): [seletor da seção, seletor da
// coluna de conteúdo onde a faixa da fita está reservada]. A coluna dá o x
// (dentro do padding reservado); a seção dá a extensão vertical.
const TARGETS: [string, string][] = [
  ["#top", ".hero__content"],
  ["#manifesto", ".container"],
  ["#principios", ".container"],
  ["#servicos", ".container"],
  ["#processo", ".container"],
  ["#diferenca", ".container"],
  ["#projetos", ".container"],
  ["#contato", ".container"],
  [".site-footer", ".container--wide"],
];

/**
 * Camada única e persistente da fita: um SVG absoluto cobrindo todo o documento,
 * com UM path mestre. O traçado é MEDIDO no DOM a cada layout: para cada seção,
 * a fita corre por uma faixa reservada à esquerda (nunca sobre o texto), e as
 * dobras isométricas acontecem nos vãos entre seções. Um trilho discreto (band)
 * fica sempre visível; por cima, uma FITA BRANCA sólida vai sendo "desenrolada"
 * conforme o scroll — revelada por uma máscara que avança de cima para baixo.
 * Vira o fio condutor e o indicador de progresso da experiência inteira.
 */
export default function RibbonLayer({ contentRef }: Props) {
  const reduced = useReducedMotion();
  const [dims, setDims] = useState({ w: 0, h: 0, d: "", mobile: false });
  const svgRef = useRef<SVGSVGElement>(null);
  const bandRef = useRef<SVGPathElement>(null);
  const revealRef = useRef<SVGPathElement>(null);

  // Mede a geometria real das seções e monta o path da fita. Recomputa em
  // resize, mudança de altura (ResizeObserver) e quando as fontes carregam.
  useLayoutEffect(() => {
    const app = contentRef.current;
    if (!app) return;

    const measure = () => {
      const w = window.innerWidth;
      const h = app.offsetHeight;
      const appTop = app.getBoundingClientRect().top + window.scrollY;
      const mobile = w < 768;

      // Fator: distância da fita à borda externa da faixa reservada. Padrão
      // fica perto da borda (folga grande até o texto). No HERO (i===0) a fita
      // corre mais perto do texto — no corredor ENTRE a coluna da logo e o
      // bloco (eyebrow + título + subtítulo), como pedido.
      const factorFor = (i: number) =>
        i === 0 && !mobile ? 0.82 : mobile ? 0.5 : 0.4;

      const segs: Seg[] = [];
      TARGETS.forEach(([secSel, colSel], i) => {
        const el = document.querySelector<HTMLElement>(secSel);
        if (!el) return;
        // A coluna de conteúdo carrega o padding que reserva a faixa da fita.
        const col = el.querySelector<HTMLElement>(colSel) ?? el;
        const cr = col.getBoundingClientRect();
        const cs = getComputedStyle(col);
        const padL = parseFloat(cs.paddingLeft) || 0;
        const padR = parseFloat(cs.paddingRight) || 0;
        const FACTOR = factorFor(i);

        // Lado da faixa = onde há mais padding reservado. x da fita cai DENTRO
        // dessa faixa, sempre do lado de fora do texto.
        let x =
          padL >= padR
            ? cr.left + window.scrollX + padL * FACTOR // faixa à esquerda
            : cr.right + window.scrollX - padR * FACTOR; // faixa à direita

        // HERO: correr no corredor ENTRE o bloco de texto (à esquerda) e a
        // LOGO 3D (à direita). Mede a borda direita real da tinta do texto
        // (linhas do título, subtítulo, eyebrow, botões) e coloca a fita logo
        // depois dela — mas só se sobrar vão antes da logo 3D (~56% da largura);
        // senão mantém a faixa lateral (telas estreitas / sem logo ao lado).
        if (i === 0 && !mobile) {
          const inkEls = el.querySelectorAll<HTMLElement>(
            ".hero__eyebrow, .hero__lead, .hero__line-inner, .hero__actions .btn"
          );
          let inkRight = cr.left + padL; // começo do conteúdo, no mínimo
          inkEls.forEach((n) => {
            inkRight = Math.max(inkRight, n.getBoundingClientRect().right);
          });
          const gapX = inkRight + 54;
          const logoGuard = cr.left + (cr.right - cr.left) * 0.56; // borda da logo 3D
          if (gapX + 12 < logoGuard) x = gapX + window.scrollX;
        }

        // top/bottom = limites do CONTEÚDO (o container não tem padding vertical),
        // então as travessias caem no vão vazio entre uma seção e a próxima.
        segs.push({
          x,
          top: cr.top + window.scrollY - appTop,
          bottom: cr.bottom + window.scrollY - appTop,
        });
      });

      // Nascimento no TOPO em "colchete" de canto reto: a fita começa no topo
      // (à direita do wordmark), corre HORIZONTAL pelo vão vazio da navbar e vira
      // 90° descendo no corredor do hero. Só quando o corredor do hero está à
      // direita do começo (caso normal do desktop); senão nasce abaixo da barra.
      let lead: { x: number; y: number }[] | undefined;
      if (!mobile && segs.length) {
        const brand = document.querySelector<HTMLElement>(".brandmark");
        const headerInner = document.querySelector<HTMLElement>(".site-header__inner");
        const heroX = segs[0].x;
        if (brand) {
          const startX = brand.getBoundingClientRect().right + window.scrollX + 18;
          if (heroX > startX + 40) {
            const hbDoc = headerInner
              ? headerInner.getBoundingClientRect().bottom + window.scrollY - appTop
              : 84;
            // trecho horizontal logo abaixo dos links do menu, acima do conteúdo
            const cornerY = Math.min(segs[0].top - 18, hbDoc - 14);
            lead = [
              { x: startX, y: 0 },
              { x: startX, y: cornerY },
              { x: heroX, y: cornerY },
            ];
          }
        }
      }

      const d = segs.length ? buildRibbonPath(segs, h, lead) : "";

      setDims((prev) =>
        prev.w === w && Math.abs(prev.h - h) < 2 && prev.d === d
          ? prev
          : { w, h, d, mobile }
      );
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(app);
    window.addEventListener("resize", measure);
    // fontes podem alterar a altura depois de carregar
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [contentRef]);

  const d = dims.d;

  // Desenrolar da fita conduzido pelo scroll (scrub). A máscara avança de cima
  // para baixo, revelando a fita branca. Respeita reduced-motion.
  useEffect(() => {
    const reveal = revealRef.current;
    if (!reveal || !d) return;

    const len = reveal.getTotalLength();
    reveal.style.strokeDasharray = `${len}`;

    if (reduced) {
      // versão elegante-reduzida: fita já desenrolada, estática.
      reveal.style.strokeDashoffset = "0";
      return;
    }

    reveal.style.strokeDashoffset = `${len}`;
    const tween = gsap.to(reveal, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [d, reduced]);

  // Recalcula posições do ScrollTrigger quando a altura muda.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [dims.h]);

  return (
    <svg
      ref={svgRef}
      className="ribbon"
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Máscara de desenrolar: o traço branco avança no scroll e revela a fita */}
        <mask id="ribbonReveal" maskUnits="userSpaceOnUse">
          <path ref={revealRef} className="ribbon__reveal" d={d} fill="none" />
        </mask>
      </defs>

      {/* Trilho da fita (band) — presença discreta, sempre visível */}
      <path ref={bandRef} className="ribbon__band" d={d} fill="none" />

      {/* Fita branca sólida — revelada pela máscara conforme o scroll */}
      <g mask="url(#ribbonReveal)">
        <path className="ribbon__tape" d={d} fill="none" />
      </g>
    </svg>
  );
}
