"use client";

import { LoginDto } from "@/common/dtos/login.dto";
import { SessionInterface } from "@/common/interfaces/session.interface";
import { verifyRequest, loginRequest } from "@/hooks/useAuthRequests";
import { create } from "zustand";
import { toast } from "sonner";
import { createAuthTokenCookie, getTokenCookie, removeTokenCookie } from "@/utils/handleCookies";

interface AuthContextType {
  session: SessionInterface | null;
  isLoading: boolean;
  isError: string | null;
  login: (credentials: LoginDto, cookieName: string) => Promise<void>;
  logout: (cookieName: string) => Promise<void>;
  verify: (cookieName: string) => Promise<void>;
}

export const useAuthContext = create<AuthContextType>((set) => ({
  session: null,
  isLoading: false,
  isError: null,

  // Función para iniciar sesión
  login: async (credentials: LoginDto, cookieName: string): Promise<void> => {
    try {
      set((state) => ({ ...state, isLoading: true, isError: null }));
      const data = await loginRequest(credentials);
      if (!data)  return;
      // Establecer el token en las cookies
      await createAuthTokenCookie(cookieName, data.token);
      set((state) => ({ ...state, session: data.payload }));
      toast(`Hola de nuevo ${data.payload.name}`);
    } catch (error) {
      set((state) => ({ ...state, session: null, isError: (error as Error).message }));
      throw error;
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  logout: async (cookieName: string) => {
    try {
      set((state) => ({ ...state, session: null, isLoading: true, isError: null }));
      await removeTokenCookie(`${cookieName}`);
      toast("Gracias, hasta luego");
      // Redirigir a la página de "/login" después del logout
    } catch (error) {
      set((state) => ({ ...state, isError: (error as Error).message, }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  // Función para verificar si el usuario está autenticado
  verify: async (cookieName: string) => {
    try {
      const authorizationToken = await getTokenCookie(cookieName);
      const userSession = await verifyRequest(authorizationToken);
      set((state) => ({ ...state, session: userSession }));
    } catch (error) {
      set((state) => ({ ...state, session: null, isError: (error as Error).message, }));
      await removeTokenCookie(`${cookieName}`);
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
