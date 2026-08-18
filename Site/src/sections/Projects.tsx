import { projects, projectsCopy } from "../content/site";
import SectionHeading from "../components/SectionHeading";

/** Portfólio: funciona com poucos ou muitos projetos. Estado vazio honesto. */
export default function Projects() {
  const hasProjects = projects.length > 0;

  return (
    <section id="projetos" className="section projects">
      <div className="container">
        <SectionHeading eyebrow={projectsCopy.eyebrow} num={projectsCopy.num} />

        {hasProjects ? (
          <ul className="projects__grid">
            {projects.map((p) => (
              <li className="project-card" key={p.slug} data-reveal>
                <div className="project-card__media" aria-hidden="true">
                  <span className="project-card__cat">{p.category}</span>
                </div>
                <div className="project-card__body">
                  <div className="project-card__row">
                    <h3 className="project-card__name">{p.name}</h3>
                    <span className="project-card__year">{p.year}</span>
                  </div>
                  <p className="project-card__summary">{p.summary}</p>
                  <ul className="project-card__tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="projects__empty">
            <div className="projects__empty-frame" aria-hidden="true">
              <span className="diamond" />
            </div>
            <div className="projects__empty-copy">
              <h2 className="projects__empty-title" data-reveal>
                {projectsCopy.title}
              </h2>
              <p className="projects__empty-lead" data-reveal style={{ transitionDelay: "80ms" }}>
                {projectsCopy.emptyLead}
              </p>
              <a className="btn btn--ghost" href={projectsCopy.emptyCta.href} data-reveal style={{ transitionDelay: "140ms" }}>
                {projectsCopy.emptyCta.label}
                <span className="diamond" style={{ width: 7, height: 7 }} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
