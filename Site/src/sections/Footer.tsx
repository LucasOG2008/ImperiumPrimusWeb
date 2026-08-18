import { brand, footer, contact, nav } from "../content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container--wide">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <span className="site-footer__word">{brand.name}</span>
            <p className="site-footer__blurb">{footer.blurb}</p>
          </div>

          <nav className="site-footer__nav" aria-label="Rodapé">
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a className="link" href={`#${n.id}`}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__contact">
            <a className="link" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <a className="link" href={contact.instagram.href} target="_blank" rel="noreferrer">
              {contact.instagram.label}
            </a>
          </div>
        </div>

        <div className="site-footer__base">
          <span>
            © {footer.year} {brand.name}
          </span>
          <span className="site-footer__made">
            <span className="diamond" aria-hidden="true" /> {brand.positioning}
          </span>
        </div>
      </div>
    </footer>
  );
}
