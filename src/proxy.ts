import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/const/constants"

const LOGIN_ROUTE = "/login"
const AUTH_COOKIE = SESSION_COOKIE

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const token = request.cookies.get(AUTH_COOKIE)?.value

  // ─────────────────────────────────────────────
  // 1. Usuario está en /login
  // ─────────────────────────────────────────────
  if (pathname === LOGIN_ROUTE) {
    // Si ya está autenticado, no tiene sentido
    // mostrar nuevamente el login.
    if (token) {
      const redirectUrl = request.nextUrl.clone()

      redirectUrl.pathname = "/"
      redirectUrl.search = ""
      return NextResponse.redirect(redirectUrl)
    }

    // No autenticado → puede acceder al login
    return NextResponse.next()
  }

  // ─────────────────────────────────────────────
  // 2. Cualquier otra ruta requiere autenticación
  // ─────────────────────────────────────────────
  if (!token) {
    const loginUrl = request.nextUrl.clone()

    loginUrl.pathname = LOGIN_ROUTE

    // Guardamos la ruta que el usuario originalmente quería visitar.
    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${search}`,
    )

    return NextResponse.redirect(loginUrl)
  }

  // ─────────────────────────────────────────────
  // 3. Usuario autenticado
  // ─────────────────────────────────────────────
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
  ],
}