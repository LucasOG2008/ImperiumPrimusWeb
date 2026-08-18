import { differentiators as diff } from "../content/site";
import SectionHeading from "../components/SectionHeading";

export default function Differentiators() {
  return (
    <section id="diferenca" className="section diff">
      <div className="container">
        <div className="diff__grid">
          <div className="diff__lead">
            <SectionHeading eyebrow={diff.eyebrow} num={diff.num} />
            <h2 className="diff__title" data-reveal>
              {diff.title}
            </h2>
            <p className="diff__body" data-reveal style={{ transitionDelay: "80ms" }}>
              {diff.body}
            </p>
          </div>

          <ul className="diff__points">
            {diff.points.map((p, i) => (
              <li className="diff-point" key={p.k} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="diff-point__k">
                  <span className="diamond diff-point__dot" aria-hidden="true" />
                  {p.k}
                </span>
                <span className="diff-point__v">{p.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
