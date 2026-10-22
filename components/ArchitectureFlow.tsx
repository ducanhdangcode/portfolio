import { Fragment } from "react";
import type { Project } from "@/content/projects";

const order = (k: number) => ({ "--k": k }) as React.CSSProperties;

// Sơ đồ luồng dạng HTML: tự đổi theo theme, cuộn ngang trên mobile
export function ArchitectureFlow({ nodes }: { nodes: Project["architecture"] }) {
  return (
    <div className="flow" role="img" aria-label={`Kiến trúc: ${nodes.map((n) => n.label).join(" → ")}`}>
      <ol className="flow-track">
        {nodes.map((node, i) => (
          <Fragment key={node.label}>
            {i > 0 && <li className="flow-edge" aria-hidden="true" style={order(i * 2 - 1)} />}
            <li className="flow-node" style={order(i * 2)}>
              <strong>{node.label}</strong>
              <span>{node.sub}</span>
            </li>
          </Fragment>
        ))}
      </ol>
    </div>
  );
}
