"use client";

import { Moon, Sun } from "./icons";

export function ThemeToggle() {
  // Mặc định là giao diện sáng; tối chỉ bật khi người dùng chọn
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // Cả hai icon đều render, CSS quyết định icon nào hiện theo theme
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label="Đổi giao diện sáng/tối">
      <Sun className="theme-icon-sun" />
      <Moon className="theme-icon-moon" />
    </button>
  );
}
