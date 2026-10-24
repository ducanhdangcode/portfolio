import { SplitChars } from "./SplitChars";

type Props = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
};

// Đầu section: "(02) — Stack" bên trái, tiêu đề hẹp khổng lồ lật lên từng chữ, đoạn dẫn ở cột phải
export function SectionHeader({ id, index, eyebrow, title, lead }: Props) {
  return (
    <header className="sh" data-reveal>
      <p className="sh-index mono">
        <span>({index})</span>
        {eyebrow}
      </p>
      <h2 id={id} className="sh-title">
        <SplitChars text={title} />
      </h2>
      {lead && <p className="sh-lead">{lead}</p>}
      <span className="sh-rule" aria-hidden="true" />
    </header>
  );
}
