"use client";

// import { RiMenuFill } from "@remixicon/react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="header fixed top-0 left-0 right-0 m-3 z-50 lg:m-4 lg:pl-sidebar lg:[transition:padding_.4s]" id="header">
      <div className="header_container px-4 w-full h-header bg-background shadow-md flex justify-between items-center rounded-2xl [transition:background-color_.4s] sm:px-6 lg:h-[calc(var(--header-height)_+_2rem)] lg:px-8">
        <Link href="/" className="header_logo inline-flex items-center gap-x-1 lg:order-1">
          <span className="text-xl font-extrabold text-foreground">Panel</span>
        </Link>

        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between gap-x-2">
            {/* <Account /> */}
            <button className="header_toggle text-foreground cursor-pointer" id="header-toggle">
              {/* <RiMenuFill /> */}
              Menu
            </button>
          </div>

        </div>

      </div>
    </header>
  )
}