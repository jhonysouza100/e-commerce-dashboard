"use client";

import { RiAdminLine, RiLoader2Fill, RiLockLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../session/context/useAuthContext";
import { LoginDto } from "../session/dto/login.dto";
import { SESSION_COOKIE } from "@/const/constants";

function LoginForm() {
  const { login, isLoading } = useAuthContext();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const credential: LoginDto = {
      name: formData.get('name') as string,
      password: formData.get('password') as string,
    };

    await login(credential, SESSION_COOKIE);

    const redirect = new URLSearchParams(window.location.search).get("redirect");
    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/");
    }
  };
  
  return (
    <div className="session_signin relative w-full h-full">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">

        <label htmlFor="session_chk" aria-hidden="true"
          className="session_label text-foreground-light text-4xl flex justify-center m-14 font-bold cursor-pointer transition-all duration-700 ease-in-out"
        >Login</label>

        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-20 flex items-center pointer-events-none">
              <RiAdminLine className="h-5 w-5 text-gray-400" />
            </div>
          <input required type="text" name="name" placeholder="Nombre de usuario"
            className="block w-3/5 mx-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
    
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-20 flex items-center pointer-events-none">
            <RiLockLine className="h-5 w-5 text-gray-400" />
          </div>
          <input required type="password" name="password" placeholder="Contraseña"
            className="block w-3/5 mx-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        <button type="submit"
          title="Iniciar sesión"
          disabled={isLoading}
          className="w-3/5 h-10 mx-auto my-3 block justify-center text-white bg-black text-[1em] font-bold mt-5 rounded-md cursor-pointer transition-all duration-200 ease-in hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          {isLoading ? <RiLoader2Fill className="justify-self-center animate-spin" /> : "LogIn"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;