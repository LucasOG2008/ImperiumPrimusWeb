import { useEffect, useState } from "react";
import { nav, brand } from "../content/site";
import "./Header.css";

export default function Header() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Condensa após sair do hero.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Marca a seção ativa (indicador de "onde estou").
  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Trava o scroll quando o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${condensed ? "is-condensed" : ""}`}>
      <div className="site-header__inner container--wide">
        <a href="#top" className="brandmark" aria-label={`${brand.name} — início`} onClick={close}>
          <img
            className="brandmark__glyph"
            src="/ip-mark.png"
            alt=""
            width={34}
            height={34}
            aria-hidden="true"
          />
          <span className="brandmark__word">{brand.name}</span>
        </a>

        <nav className="site-nav" aria-label="Navegação principal">
          <ul>
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={`site-nav__link ${active === n.id ? "is-active" : ""}`}
                >
                  <span className="site-nav__dot" aria-hidden="true" />
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contato" className="site-header__cta">
          Iniciar projeto
        </a>

        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Navegação (mobile)">
          <ul>
            {nav.map((n, i) => (
              <li key={n.id} style={{ transitionDelay: `${open ? 60 + i * 40 : 0}ms` }}>
                <a href={`#${n.id}`} onClick={close}>
                  <span className="mobile-menu__num">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contato" className="mobile-menu__cta" onClick={close}>
          Iniciar projeto
        </a>
      </div>
    </header>
  );
}

