import { principles } from "../content/site";
import SectionHeading from "../components/SectionHeading";

/** Missão · Visão · Valores como três "estações" ao longo da fita (não cards). */
export default function Principles() {
  return (
    <section id="principios" className="section principles">
      <div className="container">
        <SectionHeading eyebrow={principles.eyebrow} num={principles.num} />

        <ol className="principles__list">
          {principles.stations.map((s, i) => (
            <li className="station" key={s.key}>
              <div className="station__marker" aria-hidden="true">
                <span className="station__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="station__diamond diamond" />
              </div>
              <div className="station__content">
                <p className="station__label" data-reveal>
                  {s.label}
                </p>
                <h3 className="station__headline" data-reveal style={{ transitionDelay: "60ms" }}>
                  {s.headline}
                </h3>
                <p className="station__body" data-reveal style={{ transitionDelay: "120ms" }}>
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
