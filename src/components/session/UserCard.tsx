"use client";

import Link from "next/link";
import { useAuthContext } from "./context/useAuthContext";
import Avatar from "../ui/Avatar";

interface UserCardProps {
  order?: "1" | "0",
  size?: "small" | "medium" | "large";
}

const UserCard: React.FC<UserCardProps> = ({ order = "0", size="medium" }) => {
  const orders = {
    0: 'order-0',
    1: 'order-1',
  };

  const align = {
    0: 'items-start',
    1: 'items-end',
  };

  const sizes = {
    small: 'h-10 w-10 min-h-10 min-w-10',
    medium: 'h-12 w-12 min-w-12 min-h-12',
    large: 'h-16 w-16 min-h-16 min-w-16',
  };

  const { session } = useAuthContext();

  return (
    <>
    {!session ? (
          <>
          {/* USER PROFILE - SKELETON */}
            <div className="user_profile_skeleton sidebar_user lg:w-60 flex items-center justify-center sm:gap-x-2 lg:[transition:padding_.4s,_box-shadow_.4s,_margin_.4s,column-gap_.4s]">
              <div className={`user_picture_skeleton bg-gray-300 animate-pulse rounded-full aspect-square ${sizes[size]} ${orders[order]}`}></div>
              <div className={`user_data_skeleton hidden sm:flex flex-col gap-2 flex-1 ${align[order]}`}>
                <div className={`w-3/4 h-4 bg-gray-300 animate-pulse rounded`}></div>
                <div className={`w-1/2 h-3 bg-gray-300 animate-pulse rounded`}></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href={"/profile"} title={`Abrir el perfil de ${session.role.toLowerCase()} para ${session.name}`}
              className="sidebar_user cursor-pointer lg:w-60 flex items-center justify-center sm:gap-x-2 overflow-hidden lg:[transition:padding_.4s,_box-shadow_.4s,_margin_.4s,column-gap_.4s]"
            >
              <Avatar
                className={`sidebar_user-img relative bg-primary text-background ${orders[order]}`}
                src={session?.picture}
                alt={session?.name}
                size={size}
              >
                {!session.picture && <i className="w-8 h-8">icon</i>}
              </Avatar>
                <div className={`sidebar_user-info w-full hidden sm:flex flex-col opacity-[1] lg:[transition:all_.4s] ${align[order]}`}>
                  <h3
                    className="text-normal text-foreground font-bold hidden sm:block [transition:color_.4s] max-w-min truncate"
                  >
                    {session?.name}
                  </h3>
                  <span
                    className="hidden text-smaller lg:block text-clip text-wrap truncate"
                  >
                    {/* {session?.email} */}
                  </span>
                </div>
            </Link>
          </>
        )}
    </>
  )

}

export default UserCard;