"use client";

import {
  RiHome3Fill,
  RiBox3Fill,
  RiTodoFill,
  RiGroupFill,
  RiLogoutBoxFill,
  RiArrowLeftWideLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../session/LogoutButton";
import UserCard from "../session/UserCard";
import ThemeButton from "@/ui/ThemeButton";

// Objeto con la configuración de los iconos y su información
const menuItems = [
  {
    section: "Dashboard",
    items: [
      { icon: RiHome3Fill, label: "Inicio", href: "/" },
      { icon: RiGroupFill, label: "Usuarios", href: "/users" },
      { icon: RiBox3Fill, label: "Productos", href: "/products" },
      { icon: RiTodoFill, label: "Pedidos", href: "/orders" },
    ],
  },
  // {
  //   section: "Otros",
  //   items: [
  //     { icon: RiSettings3Fill, label: "Etc", href: "/settings" },
  //   ],
  // },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sidebar w-max fixed -left-[120%] top-0 bottom-0 z-50 bg-background shadow-md py-6 m-3 rounded-2xl [transition:left_.4s,_width_.4s] lg:left-0 lg:w-sidebar lg:m-4"
      id="sidebar"
    >
      <div className="sidebar_container flex flex-col gap-y-12 h-full overflow-hidden">
        {/* Sidebar User Profile */}
        <div className="block mx-auto lg:hidden overflow-hidden">
          <UserCard />
        </div>
        {/* Sidebar Navigation */}
        <nav className="sidebar_navigation flex flex-col gap-y-12 overflow-y-auto overflow-x-hidden">
          {menuItems.map((el, first) => (
            <div key={el.section}>
              <h3 className="sidebar_title w-full sm:w-[150px] text-tiny text-center font-semibold mb-6 lg:[transition:width_.4s]">
                {el.section}
              </h3>
              <div className="sidebar_list justify-center grid gap-y-6 sm:justify-start">
                {el.items.map((item, index) => (
                  <Link
                    key={index}
                    href={`${item.href}`}
                    className={`${pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/") ? "active-link" : first} sidebar_link relative grid-cols-[max-content] grid sm:grid-cols-max2 items-center pl-8 px-8 gap-x-4 cursor-pointer [transition:color_.4s,_opacity_.4s] hover:text-primary`}
                  >
                    {/* <Link key={index} href={`${item.href}`} className={`${first === 0 && index === 0 ? 'active-link' : ''} sidebar_link gap-x-4 relative grid items-center sm:grid-cols-max2 pl-8 [transition:color_.4s,_opacity_.4s] grid-cols-[max-content] px-8 hover:text-primary`}> */}
                    <item.icon className="w-5 h-5" />
                    <span className="font-semibold lg:[transition:opacity_.4s] hidden sm:block">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        {/* Sidebar Actions */}
        <div className="sidebar_actions justify-center grid gap-y-6 mt-auto sm:justify-start">
          {/* Theme button */}
          <ThemeButton />
          <LogoutButton
            containerClass="sidebar_link relative grid grid-cols-[max-content] sm:grid-cols-max2 items-center pl-8 px-8 gap-x-4 cursor-pointer hover:text-primary [transition:color_.4s,_opacity_.4s] hover:text-primary"
            contentClass="font-semibold text-normal lg:[transition:opacity_.4s] hidden sm:block"
            icon={<RiLogoutBoxFill />} 
            />
        </div>
      </div>

      <div className="sidebar-append items-center justify-center hidden lg:flex">
        <button className="header_toggle text-foreground cursor-pointer" id="header-toggle-desktop" title="Crtl + D">
          <RiArrowLeftWideLine size={16} className="rotate-0 [transition:all_.6s_ease-in-out]" id="toggle-icon-desktop"/>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;