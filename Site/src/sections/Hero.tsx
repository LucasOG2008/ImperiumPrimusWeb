import { Suspense, lazy, useEffect, useState } from "react";
import { hero } from "../content/site";
import { useReducedMotion } from "../lib/useReducedMotion";

// Hero 3D (a logo real extrudada) — chunk separado, só carrega sob demanda.
const RibbonHero = lazy(() => import("../three/RibbonHero"));

// Logo real (PNG). `mix-blend-mode: screen` (no CSS) apaga o fundo preto.
function LogoImage() {
  return (
    <img
      className="hero__logo"
      src="/ip-mark.png"
      alt=""
      width={640}
      height={640}
      decoding="async"
    />
  );
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export default function Hero() {
  const reduced = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // O hero 3D carrega em desktop sempre que houver WebGL. Quando o usuário
    // pede menos movimento, a logo aparece extrudada porém PARADA (sem a
    // animação de entrada/flutuação) — todos veem o 3D, respeitando a preferência.
    if (!(supportsWebGL() && window.innerWidth > 720)) return;

    let idle: number | undefined;
    let cancelled = false;
    const clearIdle = () => {
      if (idle === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
    const startIdle = () => {
      if (cancelled) return;
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setUse3D(true))
        : window.setTimeout(() => setUse3D(true), 200);
    };

    // Se a intro está rodando, só monta o canvas quando ela terminar — assim a
    // animação de abertura fica fluida (o canvas 3D não disputa o rAF com ela).
    if (document.documentElement.classList.contains("intro-active")) {
      window.addEventListener("intro:done", startIdle, { once: true });
      return () => {
        cancelled = true;
        window.removeEventListener("intro:done", startIdle);
        clearIdle();
      };
    }

    startIdle();
    return () => {
      cancelled = true;
      clearIdle();
    };
  }, []);

  return (
    <section id="top" className="hero" aria-label="Apresentação">
      <div className={`hero__stage ${use3D ? "hero__stage--3d" : ""}`} aria-hidden="true">
        {use3D ? (
          <Suspense fallback={<LogoImage />}>
            <RibbonHero reduced={reduced} />
          </Suspense>
        ) : (
          <LogoImage />
        )}
      </div>

      <div className="hero__content container--wide">
        <p className="eyebrow hero__eyebrow" data-hero="1">
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>{hero.eyebrow}</span>
        </p>

        <h1 className="hero__title">
          {hero.lines.map((line, i) => (
            <span className="hero__line" key={i}>
              <span className="hero__line-inner" data-hero="2" style={{ transitionDelay: `${120 + i * 90}ms` }}>
                {i === hero.lines.length - 1 ? <em>{line}</em> : line}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero__lead" data-hero="3">
          {hero.lead}
        </p>

        <div className="hero__actions" data-hero="4">
          <a className="btn" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
            <span className="diamond" style={{ width: 7, height: 7 }} aria-hidden="true" />
          </a>
          <a className="btn btn--ghost" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <div className="hero__scroll" data-hero="4" aria-hidden="true">
        <span>Role para começar</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
