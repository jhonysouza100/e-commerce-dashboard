"use client";

import {
  RiHome3Fill,
  RiBox3Fill,
  RiTodoFill,
  RiSettings3Fill,
  RiGroupFill,
} from "@remixicon/react";
// import ThemeButton from "@/components/ui/ThemeButton";
import Link from "next/link";
// import { useAuthContext } from "@/context/useAuthContext";
// import LogoutButton from "@/components/auth/LogoutButton";
import Avatar from "@/ui/Avatar";
import { usePathname } from "next/navigation";

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
  // const { session } = useAuthContext();
  const session = {
    id: 1,
    name: "MC Lovin",
    email: "mclovin@hotmail.com",
    role: "ADMIN",
    picture: "data:image/jpeg;base64,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",
  }

  const pathname = usePathname();

  return (
    <aside
      className="sidebar w-max fixed -left-[120%] top-0 bottom-0 z-50 bg-background shadow-md py-6 m-3 rounded-2xl [transition:left_.4s,_background-color_.4s,_width_.4s] lg:left-0 lg:w-[250px] lg:m-4"
      id="sidebar"
    >
      <div className="sidebar_container flex flex-col gap-y-12 h-full overflow-hidden">
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
            <Link href={"/dashboard/profile"}
              className="sidebar_user cursor-pointer mx-4 sm:p-4 grid justify-center grid-cols-[auto_1fr] overflow-hidden items-center gap-x-4 sm:shadow-xs rounded-md sm:justify-start sm:grid-cols-max2 lg:[transition:padding_.4s,_box-shadow_.4s,_margin_.4s]"
            >
              <Avatar
                className="sidebar_img relative w-12 h-12 bg-primary text-background overflow-hidden grid justify-items-center items-center rounded-full"
                src={session?.picture}
                alt={session?.name}
              >
                {!session.picture && <i className="w-8 h-8">icon</i>}
              </Avatar>
                <div className="sidebar_info hidden overflow-hidden sm:block lg:[transition:opacity_.4s]">
                <h3
                  className="text-normal text-foreground font-bold [transition:color_.4s] truncate"
                  title={session?.name}
                >
                  {session?.name}
                </h3>
                <span
                  className="hidden text-smaller sm:block text-clip text-wrap truncate"
                  title={session?.email}
                >
                  {session?.email}
                </span>
                </div>
            </Link>
          </>
        )}

        <nav className="sidebar_content flex flex-col gap-y-12 overflow-y-auto overflow-x-hidden">
          {menuItems.map((el, first) => (
            <div key={el.section}>
              <h3 className="sidebar_title px-2 mx-auto w-max text-tiny font-semibold mb-6 sm:mx-0 sm:pl-8 sm:pr-0 lg:pr-1 lg:[transition:padding_.4s]">
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

        <div className="sidebar_actions justify-center grid gap-y-6 mt-auto sm:justify-start">
          {/* Theme button */}
          {/* Logout button */}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
