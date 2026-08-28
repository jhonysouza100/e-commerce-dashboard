"use client";

// import { useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

function ThemeProvider({children}: {children: React.ReactNode}) {
  // useEffect(() => {
  //   // Previously selected topic (if user selected)
  //   const selectedTheme = localStorage.getItem("selected-theme");
  //    // We validate if the user previously chose a topic
  //    if (selectedTheme) {
  //     // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  //     document.body.classList[selectedTheme === "dark" ? "add" : "remove"]("isDark");
  //   }
  // }, [])
  
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="selected-theme">
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;
