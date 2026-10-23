import { SplitChars } from "./SplitChars";

type Props = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
  // "code": tiêu đề bọc kiểu thẻ code, ví dụ /Dự án cá nhân./>
  variant?: "code";
  // Dòng lệnh terminal phía trên nhãn, "giải mã" khi tiêu đề hiện: ~/projects $ ls
  cmd?: { path: string; run: string };
};

export function SectionHeader({ id, index, eyebrow, title, lead, variant, cmd }: Props) {
  return (
    <header className={`section-header${variant ? ` section-header-${variant}` : ""}`} data-reveal>
      {cmd && (
        <p className="section-cmd mono" aria-hidden="true">
          <span className="board-cmd-path">{cmd.path}</span> ${" "}
          <span data-scramble={cmd.run}>{cmd.run}</span>
          <span className="caret">_</span>
        </p>
      )}
      <p className="eyebrow">
        <span className="eyebrow-num">{index}</span>
        {eyebrow}
        <span className="eyebrow-rule" aria-hidden="true" />
      </p>
      <h2 id={id}>
        <SplitChars text={title} />
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}
