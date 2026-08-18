type Props = { eyebrow: string; num: string };

/** Rótulo de seção consistente: losango + label + número da narrativa. */
export default function SectionHeading({ eyebrow, num }: Props) {
  return (
    <p className="eyebrow" data-reveal>
      <span className="eyebrow__dot" aria-hidden="true" />
      <span>{eyebrow}</span>
      <span className="eyebrow__num" aria-hidden="true">
        / {num}
      </span>
    </p>
  );
}
