"use client";

import { useEffect, useState } from "react";

export function Clock({ timeZone }: { timeZone: string }) {
  // Render "--:--" trên server, điền giờ thật sau khi mount để tránh lệch hydration
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <time className="tabular">{time ?? "--:--"}</time>;
}
