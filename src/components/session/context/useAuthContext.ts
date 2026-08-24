"use client";

import { LoginDto } from "@/components/session/dto/login.dto";
import { SessionInterface } from "@/components/session/interfaces/session.interface";
import { verifyRequest, loginRequest, logoutRequest } from "@/components/session/hooks/useAuthRequests";
import { create } from "zustand";

interface AuthContextType {
  session: SessionInterface | null;
  isLoading: boolean;
  errorMessage: string | null;
  login: (credentials: LoginDto, cookieName: string) => Promise<void>;
  logout: (cookieName: string) => Promise<void>;
  verify: (cookieName: string) => Promise<void>;
}

export const useAuthContext = create<AuthContextType>((set) => ({
  session: null,
  isLoading: false,
  errorMessage: null,

  // Función para iniciar sesión
  login: async (credentials: LoginDto): Promise<void> => {
    try {
      set((state) => ({ ...state, isLoading: true, errorMessage: null }));
      const data = await loginRequest(credentials);
      if (!data)  return;
      set((state) => ({ ...state, session: data.payload }));
    } catch (error) {
      set((state) => ({ ...state, session: null, errorMessage: (error as Error).message }));
      throw error;
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  logout: async () => {
    try {
      set((state) => ({ ...state, session: null, isLoading: true, errorMessage: null }));
      await logoutRequest();
    } catch (error) {
      set((state) => ({ ...state, errorMessage: (error as Error).message, }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  // Función para verificar si el usuario está autenticado
  verify: async () => {
    try {
      const userSession = await verifyRequest();
      set((state) => ({ ...state, session: userSession }));
    } catch (error) {
      set((state) => ({ ...state, session: null, errorMessage: (error as Error).message, }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
