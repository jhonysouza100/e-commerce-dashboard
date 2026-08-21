"use client";

import { RiAdminLine, RiLockLine, RiMailAddLine, RiUserReceivedLine } from "@remixicon/react";
import { toast } from "sonner";

// import { useAccountMenuContext } from "@/components/account/context/accountMenuContext";

function RegisterForm() {
  // const { handleOpenModal } = useAccountMenuContext();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const credentials = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
    };

    // await register(credentials);
    toast("Caracteristica en desarrollo...");
  }

  return (
    <div className="session_signup h-[460px] bg-black rounded-[60%_/_10%] -translate-y-[180px] transition-all duration-1000 ease-in-out">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">

        <label htmlFor="session_chk" aria-hidden="true"
          className="session_label text-3xl flex justify-center m-14 font-bold cursor-pointer leading-loose transition-all duration-700 ease-in-out text-background scale-75"
        >Registro</label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-20 flex items-center pointer-events-none">
            <RiUserReceivedLine className="h-5 w-5 text-gray-400" />
          </div>
          <input required type="text" name="username" placeholder="Nombre de usuario"
            className="block w-3/5 mx-auto pl-10 pr-3 py-2 border placeholder-foreground-light text-background border-foreground-light rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-20 flex items-center pointer-events-none">
            <RiMailAddLine className="h-5 w-5 text-gray-400" />
          </div>
          <input required type="email" name="email" placeholder="Correo electrónico"
            className="block w-3/5 mx-auto pl-10 pr-3 py-2 border placeholder-foreground-light text-background border-foreground-light rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <button type="submit"
          className="w-3/5 h-10 mx-auto my-3 block justify-center text-foreground bg-background text-[1em] font-bold mt-5 rounded-md cursor-pointer transition-all duration-200 ease-in  hover:bg-blue-800 hover:text-background disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >Registrar</button>
      </form>
    </div>
  );
}

export default RegisterForm;