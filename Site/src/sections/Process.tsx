import { process } from "../content/site";
import SectionHeading from "../components/SectionHeading";

/** Processo: seis dobras da fita. A linha guia é a própria fita atrás. */
export default function Process() {
  return (
    <section id="processo" className="section process">
      <div className="container">
        <div className="process__head">
          <SectionHeading eyebrow={process.eyebrow} num={process.num} />
          <h2 className="process__title" data-reveal>
            {process.title}
          </h2>
          <p className="process__intro" data-reveal style={{ transitionDelay: "80ms" }}>
            {process.intro}
          </p>
        </div>

        <ol className="process__steps">
          {process.steps.map((s, i) => (
            <li className="step" key={s.n} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="step__top">
                <span className="step__n">{s.n}</span>
                <span className="step__tick" aria-hidden="true" />
              </div>
              <h3 className="step__name">{s.name}</h3>
              <p className="step__desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
