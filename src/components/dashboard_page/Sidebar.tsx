"use client";

import {
  RiHome3Fill,
  RiBox3Fill,
  RiTodoFill,
  RiGroupFill,
  RiLogoutBoxFill,
} from "@remixicon/react";
import Link from "next/link";
import { useAuthContext } from "@/components/authentication_page/context/useAuthContext";
import Avatar from "@/ui/Avatar";
import { usePathname } from "next/navigation";
import LogoutButton from "../authentication_page/LogoutButton";

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
  const { session } = useAuthContext();

  const pathname = usePathname();

  return (
    <aside
      className="sidebar w-max fixed -left-[120%] top-0 bottom-0 z-50 bg-background shadow-md py-6 m-3 rounded-2xl [transition:left_.4s,_background-color_.4s_ease-in-out,_width_.4s] lg:left-0 lg:w-[250px] lg:m-4"
      id="sidebar"
    >
      <div className="sidebar_container flex flex-col gap-y-12 h-full overflow-hidden">
        {/* Sidebar User Profile */}
        {!session ? (
          <>
            <div className="user_profile_skeleton sidebar_user flex items-center mx-4 sm:p-4 gap-x-4 sm:shadow-xs rounded-md lg:[transition:padding_.4s,_box-shadow_.4s,_margin_.4s]">
              <div className="user_picture_skeleton w-12 h-12 bg-gray-300 animate-pulse rounded-full aspect-square"></div>
              <div className="user_data_skeleton flex flex-col gap-2 flex-1">
                <div className="w-3/4 h-4 bg-gray-300 animate-pulse rounded"></div>
                <div className="w-1/2 h-3 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href={"/profile"}
              className="sidebar_user cursor-pointer mx-4 sm:p-4 grid justify-center grid-cols-1 overflow-hidden items-center justify-items-center                                                gap-y-2 sm:shadow-xs rounded-md lg:[transition:padding_.4s,_box-shadow_.4s,_margin_.4s]"
            >
              <Avatar
                className="sidebar_user-img relative w-12 h-12 bg-primary text-background overflow-hidden grid justify-items-center items-center rounded-full"
                src={session?.picture}
                alt={session?.name}
              >
                {!session.picture && <i className="w-8 h-8">icon</i>}
              </Avatar>
                <div className="sidebar_user-info lg:[transition:opacity_.4s]">                                                                           
                <h3
                  className="text-normal text-foreground font-bold [transition:color_.4s] max-w-min truncate"
                  title={session?.name}
                >
                  {session?.name}
                </h3>
                <span
                  className="hidden text-smaller sm:block text-clip text-wrap truncate"
                  title={session?.email}
                >
                  {/* {session?.email} */}
                </span>
                </div>
            </Link>
          </>
        )}
        {/* Sidebar Content */}
        <nav className="sidebar_content flex flex-col gap-y-12 overflow-y-auto overflow-x-hidden">
          {menuItems.map((el, first) => (
            <div key={el.section}>
              <h3 className="sidebar_title w-[90px] sm:w-[150px] text-tiny text-center font-semibold mb-6 lg:[transition:width_.4s]">
                {el.section}
              </h3>
              <div className="sidebar_list justify-center grid gap-y-6 sm:justify-start">
                {el.items.map((item, index) => (
                  <Link
                    key={index}
                    href={`${item.href}`}
                    className={`${pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard") ? "active-link" : first}  sidebar_link relative grid-cols-[max-content] grid sm:grid-cols-max2 items-center pl-8 px-8 gap-x-4 cursor-pointer [transition:color_.4s,_opacity_.4s] hover:text-primary`}
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
          <LogoutButton
            containerClass="sidebar_link relative grid grid-cols-[max-content] sm:grid-cols-max2 items-center pl-8 px-8 gap-x-4 cursor-pointer hover:text-primary [transition:color_.4s,_opacity_.4s] hover:text-primary"
            contentClass="font-semibold text-normal lg:[transition:opacity_.4s] hidden sm:block"
            icon={<RiLogoutBoxFill />} 
            />
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;