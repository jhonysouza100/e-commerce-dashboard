import { NextResponse, type NextRequest } from "next/server"

// Rutas protegidas que requieren autenticación
const PROTECTED_ROUTES = {
  "/": "user-token",
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Logging de solicitudes
  // console.log(`middleware [${new Date().toISOString()}] ${request.method} ${pathname}`)

  // Verificar autenticación para rutas protegidas
  for (const [route, tokenName] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      // Obtener el token correspondiente de las cookies
      const token = request.cookies.get(tokenName)?.value

      // console.log(`Token presente para ${route}: ${!!token}`)

      if (!token) {
        // Redirigir a la página de inicio de sesión correspondiente
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }
  }

  return NextResponse.next()
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    "/:path*",
  ],
}