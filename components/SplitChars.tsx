import { Fragment } from "react";

// Tách chữ thành từng ký tự (--c là thứ tự) để hiện lần lượt; bản đầy đủ để cho trình đọc màn hình.
// Mỗi từ bọc trong .split-word để không bị xuống dòng giữa từ.
export function SplitChars({ text }: { text: string }) {
  let c = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text
          .normalize("NFC")
          .split(" ")
          .map((word, wi) => (
            <Fragment key={wi}>
              {wi > 0 && " "}
              <span className="split-word">
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} className="split-char" style={{ "--c": c++ } as React.CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
      </span>
    </>
  );
}
