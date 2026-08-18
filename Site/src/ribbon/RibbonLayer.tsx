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
 * com UM path mestre. A "estrutura" (band) fica sempre visível; a linha de luz
 * azul (rim-light da logo) é desenhada conforme o scroll — vira o fio condutor e
 * o indicador de progresso da experiência inteira.
 */
export default function RibbonLayer({ contentRef }: Props) {
  const reduced = useReducedMotion();
  const [dims, setDims] = useState({ w: 0, h: 0, mobile: false });
  const svgRef = useRef<SVGSVGElement>(null);
  const bandRef = useRef<SVGPathElement>(null);
  const lightRef = useRef<SVGPathElement>(null);

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

  // Desenho da luz conduzido pelo scroll (scrub). Respeita reduced-motion.
  useEffect(() => {
    const light = lightRef.current;
    if (!light || !d) return;

    const len = light.getTotalLength();
    light.style.strokeDasharray = `${len}`;

    if (reduced) {
      // versão elegante-reduzida: luz já desenhada, estática.
      light.style.strokeDashoffset = "0";
      return;
    }

    light.style.strokeDashoffset = `${len}`;
    const tween = gsap.to(light, {
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
        <linearGradient id="ribbonLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--edge-soft)" />
          <stop offset="1" stopColor="var(--edge)" />
        </linearGradient>
        <filter id="ribbonGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Estrutura da fita (band) — presença discreta, canto vivo */}
      <path
        ref={bandRef}
        className="ribbon__band"
        d={d}
        fill="none"
      />
      {/* Núcleo da fita (levemente mais claro) */}
      <path className="ribbon__core" d={d} fill="none" />
      {/* Linha de luz azul — desenhada pelo scroll */}
      <path
        ref={lightRef}
        className="ribbon__light"
        d={d}
        fill="none"
        filter="url(#ribbonGlow)"
      />
    </svg>
  );
}
