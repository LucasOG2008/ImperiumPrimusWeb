import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { buildRibbonPath, buildRibbonPathMobile } from "./ribbonPath";
import { useReducedMotion } from "../lib/useReducedMotion";
import "./RibbonLayer.css";

type Props = {
  /** Elemento que define a altura real do conteúdo (para dimensionar a fita). */
  contentRef: RefObject<HTMLElement | null>;
};

/**
 * Camada única e persistente da fita: um SVG absoluto cobrindo todo o documento,
 * com UM path mestre. Um trilho discreto (band) fica sempre visível; por cima,
 * uma FITA BRANCA sólida vai sendo "desenrolada" conforme o scroll — revelada
 * por uma máscara que avança de cima para baixo. Vira o fio condutor e o
 * indicador de progresso da experiência inteira.
 */
export default function RibbonLayer({ contentRef }: Props) {
  const reduced = useReducedMotion();
  const [dims, setDims] = useState({ w: 0, h: 0, mobile: false });
  const svgRef = useRef<SVGSVGElement>(null);
  const bandRef = useRef<SVGPathElement>(null);
  const revealRef = useRef<SVGPathElement>(null);

  // Mede largura da viewport e altura do conteúdo; recomputa em resize.
  useLayoutEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = contentRef.current?.offsetHeight ?? document.body.offsetHeight;
      setDims((prev) =>
        prev.w === w && Math.abs(prev.h - h) < 2 ? prev : { w, h, mobile: w < 768 }
      );
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", measure);
    // fontes podem alterar a altura depois de carregar
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [contentRef]);

  const d = dims.w
    ? dims.mobile
      ? buildRibbonPathMobile(dims.w, dims.h)
      : buildRibbonPath(dims.w, dims.h)
    : "";

  // Desenrolar da fita conduzido pelo scroll (scrub). A máscara avança de cima
  // para baixo, revelando a fita branca quadriculada. Respeita reduced-motion.
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
  }, [d, reduced, dims.h]);

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
          <path
            ref={revealRef}
            className="ribbon__reveal"
            d={d}
            fill="none"
          />
        </mask>
      </defs>

      {/* Trilho da fita (band) — presença discreta, sempre visível */}
      <path
        ref={bandRef}
        className="ribbon__band"
        d={d}
        fill="none"
      />

      {/* Fita branca sólida — revelada pela máscara conforme o scroll */}
      <g mask="url(#ribbonReveal)">
        <path className="ribbon__tape" d={d} fill="none" />
      </g>
    </svg>
  );
}
