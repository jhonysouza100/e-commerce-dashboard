"use server";

import { cookies } from "next/headers";

export async function setSessionCookie(name: string, value: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: `${name}`,
    value: value,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Permitido redirecciones
    maxAge: 60 * 60 * 24, // 24 horas en segundos
    path: "/",
  });
}

// Función para eliminar el token de las cookies (logout)
export async function removeSessionCookie(cookieName: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(`${cookieName}`);
}

// Función para obtener el token de las cookies (login)
export async function getSessionCookie(cookieName: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(`${cookieName}`);
  return tokenCookie?.value;
}
