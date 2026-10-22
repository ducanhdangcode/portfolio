import Image from "next/image";
import type { Project } from "@/content/projects";

type Props = { screens: NonNullable<Project["screens"]>; size: "card" | "large"; decorative?: boolean };

// Ảnh chụp màn hình điện thoại đặt trong khung máy, xếp cạnh nhau và lệch nhẹ.
// Chữ trên ảnh điện thoại đủ to nên để Next.js tối ưu (WebP, đúng kích thước) cho nhẹ.
export function PhoneScreens({ screens, size, decorative = false }: Props) {
  return (
    <div className={`phones phones-${size}`}>
      {screens.map((s) => (
        <div key={s.src} className="phone">
          <Image
            src={s.src}
            alt={decorative ? "" : s.alt}
            width={828}
            height={1792}
            sizes={size === "card" ? "220px" : "(min-width: 768px) 300px, 45vw"}
          />
        </div>
      ))}
    </div>
  );
}
