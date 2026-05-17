"use client";

import { useAuthContext } from "@/components/authentication_page/context/useAuthContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function Verify() {
  const { verify } = useAuthContext();
  const pathname = usePathname();
  
  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      await verify("user-token"); 
    };
    checkAuth();
  }, [verify, pathname]);

  return null;
}

export default Verify;