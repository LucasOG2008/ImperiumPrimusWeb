import { manifesto } from "../content/site";
import SectionHeading from "../components/SectionHeading";

export default function Manifesto() {
  return (
    <section id="manifesto" className="section manifesto">
      <div className="container">
        <div className="manifesto__grid">
          <div className="manifesto__aside">
            <SectionHeading eyebrow={manifesto.eyebrow} num={manifesto.num} />
          </div>
          <div className="manifesto__body">
            <h2 className="manifesto__title" data-reveal>
              {manifesto.title}
            </h2>
            <div className="manifesto__text">
              {manifesto.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  {p}
                </p>
              ))}
              <p className="manifesto__sign" data-reveal>
                {manifesto.signature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
