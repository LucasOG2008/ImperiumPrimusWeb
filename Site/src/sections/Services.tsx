import { services } from "../content/site";
import SectionHeading from "../components/SectionHeading";

export default function Services() {
  return (
    <section id="servicos" className="section services">
      <div className="container">
        <div className="services__head">
          <SectionHeading eyebrow={services.eyebrow} num={services.num} />
          <h2 className="services__title" data-reveal>
            {services.title}
          </h2>
          <p className="services__intro" data-reveal style={{ transitionDelay: "80ms" }}>
            {services.intro}
          </p>
        </div>

        <div className="services__groups">
          {services.groups.map((g) => (
            <div className="svc-group" key={g.key}>
              <h3 className="svc-group__label" data-reveal>
                <span className="diamond svc-group__dot" aria-hidden="true" />
                {g.label}
              </h3>
              <ul className="svc-group__items">
                {g.items.map((it, i) => (
                  <li className="svc-item" key={it.name} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                    <span className="svc-item__index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="svc-item__name">{it.name}</h4>
                      <p className="svc-item__desc">{it.desc}</p>
                    </div>
                    <span className="svc-item__arrow" aria-hidden="true">→</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
