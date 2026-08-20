import { useEffect, useRef } from "react";
import Header from "./components/Header";
import Intro from "./components/Intro";
import RibbonLayer from "./ribbon/RibbonLayer";
import Hero from "./sections/Hero";
import Manifesto from "./sections/Manifesto";
import Principles from "./sections/Principles";
import Services from "./sections/Services";
import Process from "./sections/Process";
import Differentiators from "./sections/Differentiators";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);

  // Revelação por scroll — um único IntersectionObserver para todo [data-reveal].
  // Leve, sem custo por-componente, e coerente com o motion system.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#manifesto">
        Pular para o conteúdo
      </a>
      <Intro />
      <Header />

      <div className="app" ref={contentRef}>
        <RibbonLayer contentRef={contentRef} />
        <main className="app__main">
          <Hero />
          <Manifesto />
          <Principles />
          <Services />
          <Process />
          <Differentiators />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
