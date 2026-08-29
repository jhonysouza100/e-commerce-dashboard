"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { RiMoonClearFill, RiSunFill } from "@remixicon/react";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      id="theme-button"
      className="sidebar_link gap-x-4 relative grid pl-8 [transition:color_.4s,_opacity_.4s] grid-cols-[max-content] px-8 hover:text-foreground cursor-pointer sm:grid-cols-max2"
      type="button"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <RiSunFill size={20} /> : <RiMoonClearFill size={20} />}
      <span className="font-semibold text-normal lg:[transition:opacity_.4s] hidden sm:block">
        Tema
      </span>
    </button>
  );
}
