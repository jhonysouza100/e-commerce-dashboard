# Autenticación y sesión

## Componentes

- **Frontend:** [LoginForm](./frontend/src/components/login_page/LoginForm.tsx) recoge las credenciales; [useAuthRequests](./frontend/src/components/session/hooks/useAuthRequests.ts) hace las peticiones; [useAuthContext](./frontend/src/components/session/context/useAuthContext.ts) conserva la sesión en Zustand.
- **Backend:** [AuthController](./backend/src/core/auth/auth.controller.ts) expone las rutas y [AuthService](./backend/src/core/auth/auth.service.ts) valida credenciales y firma el JWT.
- **Configuración:** el backend aplica el prefijo `/api` y versiona la API como `/v1` en [main.ts](./backend/src/main.ts). El frontend toma la URL base de [constants.ts](./frontend/src/const/constants.ts).

## Inicio de sesión

1. El formulario envía las credenciales a `POST /api/v1/auth/login`.
2. NestJS valida el cuerpo con el [DTO de login](./backend/src/core/auth/dto/login.dto.ts) y `ValidationPipe`. El servicio busca la cuenta por nombre de usuario, compara la contraseña con bcrypt y firma un JWT.
3. La respuesta es `{ "token": "<JWT>" }`. El token contiene `id`, `username`, `email`, `role` y `picture`; su vigencia configurada es de un día.
4. El frontend guarda el token en la cookie `SESSION-COOKIE`, decodifica el payload para actualizar el estado de sesión y redirige a la ruta indicada por `?redirect=` o a `/`.

## Restauración y verificación

[SessionInitializer](./frontend/src/providers/SessionInitializer.tsx) llama a `verify` al cargar la aplicación y al cambiar de ruta. El frontend lee la cookie y envía el JWT en la cabecera de autorización que consume [BearerGuard](./backend/src/core/auth/guards/bearer.guard.ts), en `GET /api/v1/auth/verify`. El guard valida la firma y expiración; la ruta devuelve el payload autenticado. Si falla la verificación, el frontend elimina la cookie y limpia la sesión.

La [cookie de sesión](./frontend/src/utils/handleCookies.ts) dura 24 horas, es `SameSite=Lax`, `Secure` solo en producción y actualmente **no** es `HttpOnly`. El JWT se decodifica en el navegador; esa decodificación no valida su firma: la validación la realiza el backend en `/verify`.

## Cierre y control de rutas

- El cierre de sesión elimina la cookie y limpia el estado local; no llama a un endpoint del backend ni revoca el JWT.
- [proxy.ts](./frontend/src/proxy.ts) protege únicamente las rutas incluidas en `matcher` (`/`, `/products` y `/orders` con los patrones configurados). Redirige a `/login` si no encuentra la cookie, pero solo comprueba su presencia, no su validez. La verificación efectiva depende de `/verify`.
- El wrapper de Google está montado en la aplicación, pero este flujo de inicio de sesión usa usuario y contraseña; no se encontró una autenticación Google conectada a `/auth`.

## Contrato de datos

- El login envía `username` y `password`, conforme al DTO del backend.
- El payload de sesión del frontend refleja los campos del JWT: `id`, `username`, `email`, `role` y `picture`. No incluye `company`.
- **Rutas:** `/login` no aparece en el `matcher` del [proxy](./frontend/src/proxy.ts), por lo que un usuario con sesión puede abrir esa página e iniciar sesión con otra cuenta.
