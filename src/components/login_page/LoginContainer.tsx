"use client";

import { useEffect } from "react";
import LoginForm from "./LoginForm";
import { useLoginContainerContext } from "./context/useLoginContainerContext";
import RegisterForm from "./RegisterForm";
// import { useAuthContext } from "@/components/auth/context/authContext";
// import Link from "next/link";
// import { RiAddLargeFill } from "@remixicon/react";
// import { RiCloseLine } from "@remixicon/react";

function LoginContainer() {
  const { openModal, handleOpenModal } = useLoginContainerContext();
  // const { isLogged } = useAuthContext();
  
  
  useEffect(() => {
    // if(isLogged) {
    //   handleOpenModal(false);
    // }
    
    const sessionModal = document.getElementById('login_container');
    sessionModal?.classList.toggle('right-0', Boolean(openModal));

    const close = document.getElementById('login_container_close');
    close?.addEventListener('click',() => handleOpenModal(false));

    return () => {
      close?.removeEventListener('click', () => handleOpenModal());
    }

  }, [openModal]);

  return (
    <div className="login_container flex justify-center items-center h-[calc(100vh_-_1rem)] w-full bg-background" id="login_container">
      <div className="relative bg-background w-[350px] h-[500px] overflow-hidden rounded-lg shadow-lg">
        {/* <div className="login_container_close text-foreground-light cursor-pointer inline-flex absolute right-2 top-2" id="login_container_close"><RiCloseLine /></div> */}
        {/* <Link href={'/register'} className="text-foreground cursor-pointer inline-flex absolute right-4 top-4">
          <RiAddLargeFill />
        </Link> */}
        <input type="checkbox" name="session_chk" id="session_chk" aria-hidden="true" />
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}

export default LoginContainer;