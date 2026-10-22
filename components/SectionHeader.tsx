type Props = { id: string; index: string; eyebrow: string; title: string; lead?: string };

export function SectionHeader({ id, index, eyebrow, title, lead }: Props) {
  return (
    <header className="section-header" data-reveal>
      <div className="section-header-text">
        <p className="eyebrow">
          <span className="eyebrow-num">{index}</span>
          <span className="eyebrow-rule" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={id}>{title}</h2>
        {lead && <p className="section-lead">{lead}</p>}
      </div>
      <span className="section-bignum" aria-hidden="true">
        {index}
      </span>
    </header>
  );
}
