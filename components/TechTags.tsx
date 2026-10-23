import { site, type TechIconName } from "@/content/site";
import { TechIcon, techBrand } from "./TechIcon";

const byName = new Map(site.tech.flatMap((g) => g.items.map((t) => [t.name, t.icon] as const)));

// Khớp đúng tên trong site.tech, hoặc tên kèm hậu tố (".NET 8" → .NET, "React Native" → React)
function techIconFor(label: string): TechIconName | undefined {
  const exact = byName.get(label);
  if (exact) return exact;
  for (const [name, icon] of byName) if (label.startsWith(`${name} `)) return icon;
}

// Tag stack: mục nào có trong site.tech thì kèm logo, nền hover theo màu thương hiệu.
// data-stagger đánh --i để tag hiện lần lượt.
export function TechTags({ items, pill = false }: { items: string[]; pill?: boolean }) {
  return (
    <ul className={`tags tags-brand${pill ? " tags-pill" : ""}`} aria-label="Tech stack" data-stagger>
      {items.map((t) => {
        const icon = techIconFor(t);
        return (
          <li
            key={t}
            className="tag"
            style={{ "--brand": icon ? techBrand(icon) : "var(--accent-ink)" } as React.CSSProperties}
          >
            {icon && <TechIcon name={icon} size={pill ? 16 : 14} />}
            {t}
          </li>
        );
      })}
    </ul>
  );
}
