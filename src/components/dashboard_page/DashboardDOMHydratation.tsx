"use client"

import { useEffect } from "react";

export default function DashboardDOMHydratation() {
  useEffect(() => {
    const toggle = document.getElementById("header-toggle") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const header = document.getElementById("header") as HTMLElement;
    const main = document.getElementById("dashboard-layout") as HTMLElement;

    // Retrieve sidebar state from localStorage
    const isSidebarOpen = localStorage.getItem("sidebarState") === "open";

    if (isSidebarOpen) {
      sidebar?.classList.add("show-sidebar");
      header?.classList.add("left-pd");
      main?.classList.add("left-pd");
    }

    // ====== SHOW SIDEBAR ======
    const showSideBar = () => {
      const isOpen = sidebar?.classList.toggle("show-sidebar");
      header?.classList.toggle("left-pd");
      main?.classList.toggle("left-pd");

      // Save sidebar state to localStorage
      localStorage.setItem("sidebarState", isOpen ? "open" : "closed");
    };

    // ====== ACTIVE LINK ======
    const sidebarLink =
      document.querySelectorAll<HTMLElement>(".sidebar_list a");
    const linkColor = (event: Event) => {
      sidebarLink.forEach((el) => el.classList.remove("active-link"));
      (event.currentTarget as HTMLElement).classList.add("active-link");
    };

    // Evento de teclado ctrl+D para ocultar/mostrar el sidebar
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        showSideBar();
      }
    };

    sidebarLink.forEach((el) => el?.addEventListener("click", linkColor));
    toggle?.addEventListener("click", showSideBar);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      sidebarLink.forEach((el) => el.removeEventListener("click", linkColor));
      toggle?.removeEventListener("click", showSideBar);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}