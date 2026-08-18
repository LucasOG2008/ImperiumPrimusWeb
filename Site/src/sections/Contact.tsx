import { useState } from "react";
import { contact } from "../content/site";
import SectionHeading from "../components/SectionHeading";

/** Contato: CTA final onde a fita culmina. Form abre o cliente de e-mail
 *  (sem backend) — honesto para uma empresa começando; troca fácil por API. */
export default function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const mailto = () => {
    const subject = encodeURIComponent(`Contato pelo site — ${name || "novo projeto"}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name}`);
    return `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contato" className="section contact">
      <div className="container">
        <div className="contact__grid">
          <div className="contact__intro">
            <SectionHeading eyebrow={contact.eyebrow} num={contact.num} />
            <h2 className="contact__title" data-reveal>
              {contact.title}
            </h2>
            <p className="contact__lead" data-reveal style={{ transitionDelay: "80ms" }}>
              {contact.lead}
            </p>

            <ul className="contact__channels" data-reveal style={{ transitionDelay: "140ms" }}>
              <li>
                <span className="contact__ch-label">E-mail</span>
                <a className="link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="contact__ch-label">Instagram</span>
                <a className="link" href={contact.instagram.href} target="_blank" rel="noreferrer">
                  {contact.instagram.label}
                </a>
              </li>
              <li>
                <span className="contact__ch-label">WhatsApp</span>
                <span className="contact__soon">em breve</span>
              </li>
            </ul>
          </div>

          <form
            className="contact__form"
            data-reveal
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto();
            }}
          >
            <div className="field">
              <label htmlFor="c-name">Seu nome</label>
              <input
                id="c-name"
                type="text"
                autoComplete="name"
                placeholder="Como te chamamos?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="c-msg">O que você quer resolver?</label>
              <textarea
                id="c-msg"
                rows={4}
                placeholder="Conte, sem formalidade, o problema ou a ideia."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn contact__submit">
              Enviar mensagem
              <span className="diamond" style={{ width: 7, height: 7 }} aria-hidden="true" />
            </button>
            <p className="contact__note">Abre seu app de e-mail. Respondemos rápido — e de verdade.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
