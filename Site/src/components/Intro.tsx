import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";
import { brand } from "../content/site";
import ipMark from "../assets/ip-mark-trace.svg";
import "./Intro.css";

/* =============================================================================
   INTRO — abertura cinematográfica.

   Estado inicial: só fundo preto + a logo centralizada (com um pulso sutil que
   sugere que ela é clicável). Ao clicar (ou após AUTO_MS), a MESMA logo encolhe
   e desliza do centro até a posição exata da logo na navbar, enquanto o fundo
   preto revela o site. Não há corte entre a logo da intro e a do header: a logo
   da navbar só aparece no instante em que a logo da intro pousa exatamente sobre
   ela (pixel-aligned), e então a da intro é removida — parece uma logo só.

   Enquanto a intro roda, a classe `intro-active` no <html> segura as animações
   de entrada do hero e esconde a logo do header; ao abrir, as primeiras seções
   revelam-se em leve sequência. Sob reduced-motion, tudo vira um fade curto.
   ============================================================================= */

const AUTO_MS = 10000; // entrada automática caso o usuário não clique (10s)
const AUTO_MS_REDUCED = 650; // reduced-motion: abertura quase instantânea

export default function Intro() {
  const reducedPref = useReducedMotion();
  // `?introfull` força a abertura completa (demo/teste) mesmo sob reduced-motion.
  const forceFull =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("introfull");
  const reduced = reducedPref && !forceFull;
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const finished = useRef(false);
  const [gone, setGone] = useState(false);

  // Trava o scroll e sinaliza o estado "intro ativa" para o resto do app.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("intro-active");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      html.classList.remove("intro-active");
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Entrada automática (cancelada se o usuário clicar antes). Sob reduced-motion
  // a espera é bem curta — a abertura não deve prender o usuário.
  useEffect(() => {
    const timer = window.setTimeout(() => start(), reduced ? AUTO_MS_REDUCED : AUTO_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  function reveal() {
    // Revela o site: mostra a logo do header (instantâneo, escondida sob a logo
    // da intro que acabou de pousar) e libera as animações de entrada do hero.
    document.documentElement.classList.remove("intro-active");
    // Sinaliza que a abertura terminou — o hero 3D (pesado) só monta agora,
    // deixando a animação da intro com o rAF todo para si (mais fluida).
    window.dispatchEvent(new Event("intro:done"));
  }

  function done() {
    if (finished.current) return;
    finished.current = true;
    reveal();
    document.body.style.overflow = "";
    // Remove a logo da intro no frame seguinte — a do header já está no lugar.
    requestAnimationFrame(() => setGone(true));
  }

  function start() {
    if (started.current) return;
    started.current = true;

    const overlay = overlayRef.current;
    const bg = bgRef.current;
    const logo = logoRef.current;
    if (!overlay || !bg || !logo) {
      done();
      return;
    }

    logo.classList.add("is-leaving"); // congela o pulso

    // Reduced-motion: sem viagem — fade curto e revela.
    if (reduced) {
      gsap.to(overlay, { autoAlpha: 0, duration: 0.28, ease: "power1.out", onComplete: done });
      return;
    }

    const target = document.querySelector<HTMLElement>(".brandmark__glyph");
    if (!target) {
      gsap.to(overlay, { autoAlpha: 0, duration: 0.5, ease: "power2.out", onComplete: done });
      return;
    }

    const tr = target.getBoundingClientRect();
    const base = logo.getBoundingClientRect();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = tr.left + tr.width / 2 - cx;
    const dy = tr.top + tr.height / 2 - cy;
    const scale = tr.width / base.width;

    gsap.set(logo, { xPercent: -50, yPercent: -50 });

    const tl = gsap.timeline({ onComplete: done });
    // O fundo preto revela o site progressivamente.
    tl.to(bg, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" }, 0.05);
    // A logo viaja do centro até a navbar, encolhendo — só transform (GPU).
    tl.to(
      logo,
      { x: dx, y: dy, scale, duration: 1.05, ease: "power3.inOut" },
      0
    );
  }

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="intro"
      role="button"
      tabIndex={0}
      aria-label={`Entrar no site da ${brand.name}`}
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
    >
      <div ref={bgRef} className="intro__bg" aria-hidden="true" />
      <div ref={logoRef} className="intro__logo">
        <img className="intro__glyph" src={ipMark} alt="" width={190} height={190} />
      </div>
    </div>
  );
}
