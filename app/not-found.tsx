import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="intro">
      <span className="deco-circle deco-circle-hero" aria-hidden="true" />
      <div className="container not-found">
        <p className="eyebrow">
          <span>404</span> / Not found
        </p>
        <h1>Không tìm thấy trang này.</h1>
        <Link href="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
