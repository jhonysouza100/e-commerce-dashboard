"use client";

import { useAuthContext } from "@/components/session/context/useAuthContext";
import { SESSION_COOKIE } from "@/const/constants";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function SessionInitializer() {
  const { verify } = useAuthContext();
  const pathname = usePathname();
  
  // Iicializar/restaurar la sesión a partir de la cookie al cambiar de ruta.
  useEffect(() => {
    const initializeSession = async () => {
      await verify(SESSION_COOKIE); 
    };
    initializeSession();
  }, [verify, pathname]);

  return null;
}

export default SessionInitializer;