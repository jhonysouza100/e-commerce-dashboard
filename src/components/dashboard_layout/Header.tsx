"use client";

import { RiMenuFill } from "@remixicon/react";
import SearchBar from "../ui/SearchBar";
import UserCard from "../session/UserCard";

export default function Header() {
  return (
    <header className="header fixed top-0 left-0 right-0 m-3 z-50 lg:m-4 lg:pl-sidebar lg:transition-padding" id="header">
      <div className="header_container px-4 w-full h-header bg-background shadow-md flex justify-between items-center gap-x-4 rounded-2xl sm:px-6 lg:h-[calc(var(--header-height)_+_2rem)] lg:px-8">

        <div className="hidden lg:block lg:order-1">
          <UserCard order="1" size="small" />
        </div>

        <div className="w-[70%] sm:w-[50%]">
          <SearchBar placeholder="Buscar..." />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between gap-x-2">
            {/* <Account /> */}
            <button className="header_toggle text-foreground cursor-pointer lg:hidden" id="header-toggle">
              <RiMenuFill />
            </button>
          </div>

        </div>

      </div>
    </header>
  )
}