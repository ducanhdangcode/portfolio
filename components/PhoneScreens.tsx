import Image from "next/image";
import type { Project } from "@/content/projects";
import { asset } from "@/lib/asset";

type Props = { screens: NonNullable<Project["screens"]>; size: "card" | "large"; decorative?: boolean };

// Ảnh chụp màn hình điện thoại đặt trong khung máy, xếp cạnh nhau và lệch nhẹ.
// Ảnh đã được nén sẵn sang WebP bằng `npm run images`.
export function PhoneScreens({ screens, size, decorative = false }: Props) {
  return (
    <div className={`phones phones-${size}`}>
      {screens.map((s) => (
        <div key={s.src} className="phone">
          <Image
            src={asset(s.src)}
            alt={decorative ? "" : s.alt}
            width={828}
            height={1792}
          />
        </div>
      ))}
    </div>
  );
}
