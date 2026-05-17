"use client";

import { useEffect } from "react";
import LoginForm from "./LoginForm";
import { useAccountMenuContext } from "./accountMenuContext";
// import { useAuthContext } from "@/components/auth/context/authContext";
// import RegisterAdmin from "../register/RegisterAdmin";
// import Link from "next/link";
// import { RiAddLargeFill } from "@remixicon/react";
// import { RiCloseLine } from "@remixicon/react";

function AccountModalSession() {
  const { openModal, handleOpenModal } = useAccountMenuContext();
  // const { isLogued } = useAuthContext();
  
  
  useEffect(() => {
    // if(isLogued) {
    //   handleOpenModal(false);
    // }
    
    const sessionModal = document.getElementById('session_modal');
    sessionModal?.classList.toggle('right-0', Boolean(openModal));

    const close = document.getElementById('session_modal_close');
    close?.addEventListener('click',() => handleOpenModal(false));

    return () => {
      close?.removeEventListener('click', () => handleOpenModal());
    }

  }, [openModal]);

  return (
    // <div className="session_modal fixed -right-full top-0 flex justify-center items-center min-h-screen w-full bg-background transition-all duration-300" id="session_modal">
    <div className="session_modal flex justify-center items-center h-[calc(100vh_-_1rem)] w-full bg-background transition-all duration-300" id="session_modal">
      <div className="session_container relative bg-blue-900 w-[350px] h-[500px] overflow-hidden rounded-lg shadow-lg">
        {/* <div className="session_modal_close text-background cursor-pointer inline-flex absolute right-2 top-2" id="session_modal_close"><RiCloseLine /></div> */}
        {/* <Link href={'/register'} className="text-foreground cursor-pointer inline-flex absolute right-4 top-4">
          <RiAddLargeFill />
        </Link> */}
        <input type="checkbox" name="session_chk" id="session_chk" aria-hidden="true" />
        <LoginForm />
        {/* <RegisterAdmin /> */}
      </div>
    </div>
  );
}

export default AccountModalSession;