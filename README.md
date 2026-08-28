# Design System del dashboard

> Fuente de verdad del sistema existente. Auditoría realizada sobre el código presente en `src/` el 25 de agosto de 2026. Este documento describe el estado actual; no propone un rediseño.

## 1. Arquitectura del dashboard

### Stack

- Next.js `16.2.5` con App Router y TypeScript estricto.
- React `19.2.4`.
- Tailwind CSS `4` mediante `@import "tailwindcss"` en `src/app/globals.css` y `@tailwindcss/postcss`.
- Zustand para estado cliente; TanStack React Query para provider, mutaciones y devtools; Axios para peticiones; Sonner para toasts; `@remixicon/react` para iconos; `use-debounce` para búsqueda.
- No hay `components.json`, ni componentes shadcn/ui, Radix, Material UI, Chakra UI u otra librería de componentes.

### Estructura relevante

```text
src/
  app/
    layout.tsx                         # Root layout y providers globales
    globals.css                        # Tokens CSS, Tailwind y reglas globales
    (authentication)/login/page.tsx    # Ruta /login
    (dashboard)/layout.tsx             # Layout compartido del dashboard
    (dashboard)/page.tsx               # Ruta / (página principal actual)
  components/
    dashboard_layout/                  # Header, Sidebar y comportamiento DOM
    login_page/                        # Contenedor, login, registro y store de login
    session/                           # Sesión, usuario, logout y requests
    ui/                                # Avatar, Button, Pagination, SearchBar
  providers/                           # Google, React Query y restauración de sesión
  const/constants.ts                   # Cookie, API, paginación y OAuth
  proxy.ts                             # Archivo de proxy (su contenido no forma parte del dashboard visual)
  utils/                               # Cookies y respuestas Axios
```

### Composición y rutas

`src/app/layout.tsx` es el root layout. Renderiza `<html lang="es-AR">`, el `<body>` con `font-sans`, `text-normal`, `bg-background` y `text-foreground-muted`, y envuelve el árbol en este orden: `GoogleSessionWrapper` → `QueryWrapper` → `SessionInitializer` + `Suspense` de páginas + `Toaster`.

El route group `src/app/(dashboard)/` comparte `src/app/(dashboard)/layout.tsx`; el nombre entre paréntesis no aparece en la URL. Por tanto, `src/app/(dashboard)/page.tsx` se sirve en `/`. La navegación del sidebar ya apunta a `/users`, `/products` y `/orders`, aunque esas páginas no están presentes en esta auditoría. `src/app/(authentication)/login/page.tsx` se sirve en `/login` y renderiza exclusivamente `LoginContainer`; no usa el layout del dashboard.

El layout del dashboard mantiene una envoltura fija con `left-4 right-4`, altura basada en `--header-height`, padding superior y padding izquierdo en desktop basado en `--sidebar-width`. Dentro renderiza `Header`, `Sidebar`, `DashboardDOMHydratation` y un `<main className="main my-2">` para el contenido.

### Providers y autenticación

- `GoogleSessionWrapper` monta `GoogleOAuthProvider` usando `OAUTH_GOOGLE_CLIENT_ID`.
- `QueryWrapper` crea un `QueryClient` a nivel de módulo, monta `QueryClientProvider`, `ReactQueryDevtools` cerrado inicialmente y un `<div>` contenedor.
- `SessionInitializer` llama `verify(SESSION_COOKIE)` en un `useEffect` al cambiar `pathname`; la sesión vive en el store Zustand `useAuthContext`.
- `useAuthContext` expone `session`, `isLoading`, `errorMessage`, `login`, `logout` y `verify`. Las peticiones reales están en `useAuthRequests.ts` y usan Axios contra `https://restful-api-v4.vercel.app/api/v1/auth`.
- `handleCookies.ts` usa `cookies()` de `next/headers` para guardar, leer y borrar `SESSION-COOKIE`. La cookie actual tiene `httpOnly: false`, `sameSite: "lax"`, duración de 24 horas y `secure` solo en producción.
- `LogoutButton` usa una mutación de React Query, llama al logout, invalida queries y ejecuta `router.refresh()`.

### Navegación y responsive

`Sidebar` es un componente cliente que calcula el enlace activo con `usePathname()`. Los items están declarados en el array local `menuItems`: Inicio (`/`), Usuarios (`/users`), Productos (`/products`) y Pedidos (`/orders`). Cada item combina un icono Remix, label y `Link`.

En móvil el sidebar empieza fuera de pantalla con `-left-[120%]`; la clase `.show-sidebar` lo lleva a `left: 0`. En desktop empieza visible en `lg:left-0`; puede reducirse a 90px mediante `.show-sidebar` desde `min-width: 968px`. `Header` usa `RiMenuFill` para abrir/cerrar en móvil y el botón lateral con `RiArrowLeftWideLine` para desktop.

`DashboardDOMHydratation` conecta estos botones mediante listeners imperativos y guarda `sidebarState` en `localStorage`. También aplica `.left-pd` a header y layout y permite alternar el sidebar con `Ctrl + D`. La navegación tiene un segundo mecanismo: el click agrega `.active-link` de forma imperativa, mientras `Sidebar` también calcula la clase según la ruta.

Breakpoints definidos en `@theme`: `sm: 425px`, `md: 620px`, `lg: 968px`, `xl: 1280px`; existe también `2x`, actualmente definido como `1440p`.

## 2. Sistema de diseño existente

### Tokens y colores

Los tokens reales están en `src/app/globals.css`:

| Token | Valor actual | Uso observado |
|---|---|---|
| `--primary-color` | `#1d1d1d` | color primario, enlace activo y avatar |
| `--secondary-color` | `#2563eb` | color secundario y gradiente |
| `--background-color` | `hsl(0, 100%, 100%)` | fondo principal y contenedores |
| `--foreground-color` | `hsl(0, 0%, 11%)` | texto foreground |
| `--foreground-color-muted` | `hsl(220, 9%, 46%)` | texto secundario |
| `--foreground-color-light` | `hsl(228, 8%, 56%)` | placeholders/texto ligero |
| `--transparent-color-sm` | `#ffffffbb` | token transparente |
| `--transparent-color-md` | `#ffffff66` | token transparente |
| `--transparent-color-row` | `hsl(0, 0%, 85%)` | hover de filas |
| `--gradient` | `linear-gradient(180deg, rgba(37, 99, 235, 1) 0%, rgba(147, 197, 253, 1) 100%)` | definido, no usado en componentes auditados |

Tokens Tailwind publicados por `@theme inline`: `primary`, `background`, `foreground`, `foreground-muted`, `foreground-light`, `container`, `container-alt`, `container-foreground`, `secondary`, `secondary-muted`, `error`, `error-soft`, `success`, `success-soft`, `info`, `info-soft`, `alert`, `alert-soft`, `transparent`, `transparent-sm` y `transparent-md`. Los tokens `container*` y `secondary-muted` apuntan a variables no declaradas en el archivo actual.

Estados semánticos publicados: error `rgb(196, 28, 28)`, success `rgb(31, 122, 31)`, info `rgb(11, 107, 203)` y alert `rgb(154, 91, 19)`, con sus fondos soft correspondientes. También aparecen colores directos en componentes y CSS: grises de Tailwind, `#86e49d/#006b21` para delivered, `#d893a3/#b30021` para cancelled, `#ebc474` para pending, `#6fcaea` para aproved, rojo Tailwind en Button danger y azul del input de búsqueda.

No hay un tema oscuro implementado en tokens: el bloque `@media (prefers-color-scheme: dark)` está vacío. Sí existen reglas de scrollbar bajo `.isDark`, pero no se encontró el mecanismo que agregue esa clase.

### Tipografía

`layout.tsx` no importa una fuente de `next/font`; el token `--font-sans` apunta a `var(--font-roboto), ui-sans-serif, system-ui, sans-serif`, pero `--font-roboto` no se declara en los archivos auditados. El cuerpo usa `font-sans`. Tamaños propios: `--normal-font: .938rem` (cambia a `1rem` desde 968px), `--smaller-font: .65rem` y `--tiny-font: .75rem`. Tailwind también aporta clases como `text-sm`, `text-base`, `text-lg`, `text-3xl` y `text-4xl` en los componentes existentes.

### Spacing, radios, bordes y sombras

No existe una escala propia de spacing: los componentes usan la escala Tailwind y algunos valores arbitrarios. Patrones observados: `m-3/m-4`, `p-2`, `p-4`, `py-6`, `px-4/sm:px-6/lg:px-8`, `gap-2`, `gap-y-6`, `gap-y-12`, `my-2`, `mt-5`.

Radios observados: `rounded-2xl` en header/sidebar, `rounded-lg` en el contenedor de login, `rounded-md` en Button e inputs, `rounded-full` en búsqueda, avatar, paginación y estados, y `rounded-[60%_/_10%]` en el panel de registro. Sombras: `shadow-md` en header/sidebar/paginación y `shadow-lg` en el contenedor de login; `sidebar-append` usa una sombra compuesta explícita.

No hay utilidades de borde compartidas. Inputs usan `border-gray-300` o `border-foreground-light`; focus usa `focus:ring-blue-500/focus:ring-blue-200` y `focus:border-blue-500`.

### Interacciones y animación

- Transiciones habituales: `transition-all duration-200`, `transition-all duration-300`, `transition-all duration-700/1000 ease-in-out` y transiciones arbitrarias de color, padding, width, opacity y background.
- Button reduce escala a `.98` en active.
- Sidebar anima posición, ancho y color de fondo; `.active-link::after` muestra una barra izquierda de `0.25rem × 1.25rem`.
- Tabla define animación de salida mediante `.hide`: opacity, translateX, padding, font-size y tamaño de imágenes.
- Hay animación `ripples` definida en CSS, pero no se observó un componente que la consuma.
- Disabled de Button: fondo `gray-400`, cursor bloqueado y sin escala active.

## 3. Componentes reutilizables

Solo se documentan componentes que existen en el código auditado. No se encontraron implementaciones propias de `Input`, `Select`, `Card`, `Modal`, `Table`, `Dropdown`, `Badge`, `Alert` ni `Loader` como componentes independientes.

### Button

- **Ubicación:** `src/components/ui/Button.tsx`, también importable con el alias `@/ui/Button`.
- **Propósito:** botón propio con icono, orientación, variante, tamaño, disabled y props nativas.
- **Props:** `ButtonHTMLAttributes<HTMLButtonElement>` más `icon?: ReactNode`, `orientation?: "left" | "right"`, `variant?: "primary" | "secondary" | "danger"`, `size?: "small" | "normal" | "large"`, `children`.
- **Variantes:** primary (`bg-background text-foreground hover:opacity-90`), secondary (`bg-foreground text-background hover:opacity-90`), danger (`bg-red-600 text-white hover:bg-red-700`).
- **Tamaños:** small `px-3 py-1.5 text-sm gap-1.5`; normal `px-4 py-2 text-base gap-2`; large `px-5 py-3 text-lg gap-2.5`.
- **Icono:** siempre renderiza un `<span>` para `icon`; el contenido va dentro de un `<div>`. La orientación cambia entre `flex-row` y `flex-row-reverse`.
- **Estados:** `cursor-pointer`, `transition-all duration-200`, `active:scale-[0.98]`, disabled con `bg-gray-400`, cursor bloqueado y sin escala.
- **Base:** ocupa `w-full`, usa `inline-flex`, centra contenido, `font-bold` y `rounded-md`.
- **Ejemplos reales:** LoginForm usa `variant="secondary"`, `type="submit"`, `disabled={isLoading}` y muestra `RiLoader2Fill`; RegisterForm usa la variante por defecto y el mismo patrón de loading.

### Avatar

- **Ubicación:** `src/components/ui/Avatar.tsx`.
- **Props:** `className?`, `src?`, `alt?`, `size?: "small" | "medium" | "large"`, `children?`.
- **Tamaños:** small `h-10 w-10 min-h-10 min-w-10`; medium `h-12 w-12 min-w-12 min-h-12`; large `h-16 w-16 min-h-16 min-w-16`.
- **Comportamiento:** contenedor circular con `grid`, `aspect-square` y `overflow-hidden`. Prioriza `children`; si hay `src`, usa `next/image` lazy de 100×100; si no, muestra la primera letra de `alt`.
- **Uso real:** `UserCard` le pasa imagen, nombre, tamaño y clases `bg-primary text-background`; también puede pasar contenido alternativo.

### Pagination

- **Ubicación:** `src/components/ui/Pagination.tsx`.
- **Props:** `{ count: number }`.
- **Comportamiento:** lee `page` desde `useSearchParams`, usa `ITEMS_PER_PAGE` (12), calcula prev/next y reemplaza la URL con `router.replace` conservando parámetros. Renderiza botones con `RiArrowLeftSLine` y `RiArrowRightSLine`.
- **Estilo/estados:** contenedor flex con `bg-white p-2 gap-2 shadow-md rounded-full`; botones circulares con estados disabled transparentes, cursor bloqueado y texto muted.
- **Uso:** no se encontró un consumidor en las páginas presentes; está preparado para listados paginados.

### SearchBar

- **Ubicación:** `src/components/ui/SearchBar.tsx`.
- **Props:** interfaz local `AvatarProps` con `placeholder?: string`.
- **Comportamiento:** input controlado solo por el DOM, icono `RiSearch2Line`, debouncing de 1000 ms y actualización de `q` y `page=1` mediante `router.replace`.
- **Estilo:** wrapper relativo; input `w-full bg-gray-100 rounded-full py-1 pl-10 pr-4 text-sm text-gray-600`, focus con `ring-2 ring-blue-200`.
- **Uso real:** `Header` lo renderiza con `placeholder="Buscar..."`.

### UserCard

- **Ubicación:** `src/components/session/UserCard.tsx`.
- **Props:** `order?: "1" | "0"` y `size?: "small" | "medium" | "large"`; defaults `"0"` y `"medium"`.
- **Comportamiento:** si no hay sesión muestra skeleton con `animate-pulse`, círculos y barras grises; si hay sesión muestra un `Link` a `/profile`, `Avatar`, nombre y metadata.
- **Uso real:** Header usa `order="1" size="small"`; Sidebar usa defaults en móvil.

### LogoutButton

- **Ubicación:** `src/components/session/LogoutButton.tsx`.
- **Props:** `containerClass?`, `contentClass?`, `icon?`.
- **Comportamiento:** se envuelve en `AlertDialog`; al confirmar dispara la mutación de React Query con `SESSION_COOKIE`, invalida queries y refresca el router. Tiene `title="Cerrar sesión"` y `aria-label="Logout"`.

### AlertDialog

- **Ubicación:** `src/components/ui/AlertDialog.tsx`.
- **Propósito:** confirmación modal reutilizable para acciones destructivas o sensibles, sin dependencias externas.
- **Props:** `children` es el elemento disparador; `message` es el contenido del mensaje; `title?` personaliza el título; `confirmButtonProps?` y `cancelButtonProps?` aceptan las props del `Button` propio.
- **Comportamiento:** el click del trigger solo abre el diálogo; el `onClick` original del trigger se ejecuta al confirmar. Cancelar, Escape o click fuera cierran el diálogo. Mientras está abierto, el contenido queda bloqueado con overlay y `backdrop-blur-sm`.
- **Accesibilidad:** usa `role="alertdialog"`, `aria-modal`, título y descripción asociados, además de `aria-haspopup`/`aria-expanded` en el trigger.

```tsx
<AlertDialog
  message="Esta acción no se puede deshacer."
  confirmButtonProps={{ children: "Eliminar", variant: "danger" }}
  cancelButtonProps={{ children: "Cancelar", variant: "secondary" }}
>
  <Button variant="danger" onClick={handleDelete}>
    Eliminar
  </Button>
</AlertDialog>
```
- **Uso real:** Sidebar lo compone con icono `RiLogoutBoxFill` y clases del patrón `sidebar_link`.

### Header

- **Ubicación:** `src/components/dashboard_layout/Header.tsx`.
- **Composición:** contenedor fixed con `SearchBar`, `UserCard` desktop y toggle móvil `RiMenuFill`.
- **Responsive:** user card oculto hasta `lg`; búsqueda `w-[70%]` y `sm:w-[50%]`; header cambia padding/alto en `lg`.

### Sidebar

- **Ubicación:** `src/components/dashboard_layout/Sidebar.tsx`.
- **Composición:** `UserCard`, navegación agrupada en secciones, `LogoutButton` y control desktop.
- **Responsive:** drawer fuera de pantalla en móvil, fijo y visible en desktop; modo reducido de 90px en desktop cuando está abierto según la lógica actual.

## 4. Patrones del dashboard

- **Página:** el layout de dashboard aporta la estructura; cada página hija debe renderizar solo su contenido dentro de `<main>`. La página actual es mínima: `<div>`, texto `Página principal` y un div vacío `w-1/5 mx-auto`.
- **Título/sección:** no existe un componente de título, breadcrumb o sección documentado. En la ruta actual tampoco hay título visual estructurado.
- **Acciones:** se usa el `Button` propio; logout tiene un botón especializado. No existe toolbar compartida.
- **Formularios:** LoginForm y RegisterForm usan `<form onSubmit>`, `FormData`, inputs nativos, iconos absolutos a la izquierda, wrapper `relative` y contenedor de acción `w-3/5 h-10 mx-auto mt-5`. Login tiene nombre + contraseña; registro tiene username + email.
- **Filtros/búsqueda:** SearchBar escribe `q` y reinicia `page` en query params con debounce de 1000 ms.
- **Tablas:** no existe componente Table, pero `globals.css` define estilos globales para `tbody tr`, filas pares, hover, `.hide` y `.table_container` con scrollbar.
- **Paginación:** usar `Pagination` con el conteo total; se basa en query params y `ITEMS_PER_PAGE=12`.
- **Cards:** no existe Card reusable. El login usa un contenedor ad hoc `w-[350px] h-[500px] rounded-lg shadow-lg`; header/sidebar usan contenedores ad hoc con `rounded-2xl shadow-md`.
- **Estadísticas:** no hay componentes ni patrones de estadísticas presentes.
- **Modal:** el store `useLoginContainerContext` contiene `openModal`, `handleOpenModal` y `anchorEl`, pero el modal está comentado/no implementado en `LoginContainer`. No debe asumirse que existe un Modal reusable.
- **Loading:** login/registro usan `RiLoader2Fill animate-spin`; UserCard usa skeleton `animate-pulse`; no existe Loader reusable.
- **Errores/toasts:** auth transforma errores con utilidades Axios y usa Sonner; no existe Alert reusable. El login propaga `Login fallido`; verify propaga `Verificación fallida`.
- **Confirmaciones/destructivas:** usar `AlertDialog` para confirmar acciones sensibles; logout lo utiliza antes de cerrar la sesión.

## 5. Convenciones

- Usar App Router y route groups existentes; ubicar páginas bajo `src/app` y piezas por dominio bajo `src/components`.
- Mantener nombres PascalCase para componentes (`Header`, `Sidebar`, `Button`) y camelCase para hooks, funciones, stores y variables. El proyecto aún tiene excepciones como `RegsiterForm.tsx`, `function page()` y `DashboardDOMHydratation`.
- Reutilizar alias `@/*` para `src/*` y `@/ui/*` para `src/components/ui/*`; también existe el alias usado en imports de `Button`.
- Escribir TypeScript con interfaces/types explícitos para props y aprovechar tipos de React para props nativas.
- Mantener Tailwind CSS como sistema visual. Priorizar tokens publicados (`bg-background`, `text-foreground`, `text-foreground-muted`, `bg-primary`) y las clases ya usadas; no crear colores, spacing o radios nuevos sin razón explícita.
- Para iconos, usar `@remixicon/react` y el patrón de tamaño existente (`w-5 h-5` o tamaños nativos del icono).
- Para componentes interactivos, marcar el archivo `"use client"` y seguir los patrones existentes de Next Navigation, Zustand o React Query según corresponda.
- Mantener accesibilidad mínima ya empleada: `label htmlFor`, `title`, `aria-label`, `aria-hidden` donde aplica y `alt` para imágenes.
- Responsive primero según los breakpoints del proyecto; usar `sm`, `md`, `lg`, `xl` existentes y respetar las variables `--header-height`/`--sidebar-width`.
- En formularios, reutilizar `Button` y el patrón de `FormData`; no duplicar un botón propio equivalente.

## 6. Reglas obligatorias para futuras implementaciones

1. Reutilizar componentes existentes antes de crear nuevos.
2. No introducir dependencias nuevas.
3. No utilizar componentes de terceros.
4. Mantener Tailwind CSS como sistema de estilos.
5. Mantener los tokens y variables existentes.
6. Mantener los patrones visuales existentes.
7. Mantener la arquitectura actual y sus route groups.
8. No duplicar componentes.
9. No crear estilos arbitrarios cuando exista un patrón existente.
10. No cambiar colores, spacing, typography, radios, sombras o componentes sin una razón explícita.
11. Priorizar composición de componentes existentes.
12. No convertir esta documentación en una justificación para refactorizar código no relacionado.
13. Documentar inconsistencias nuevas sin corregirlas automáticamente, salvo que la tarea lo pida explícitamente.

## 7. Ejemplos reales

### Página del dashboard

Extraído de `src/app/(dashboard)/page.tsx`:

```tsx
function page() {
  return (
    <div>
      Página principal
      <div className="w-1/5 mx-auto"></div>
    </div>
  );
}

export default page;
```

La página se compone dentro de `src/app/(dashboard)/layout.tsx`, que ya aporta header, sidebar y `<main>`.

### Layout y sección principal

Extraído de `src/app/(dashboard)/layout.tsx`:

```tsx
<div id="dashboard-layout" className="dashboard_layout fixed left-4 right-4 pt-[calc(var(--header-height)_+_1rem)] h-[calc(100vh_-_var(--header-height))] lg:pt-[calc(var(--header-height)_+_3.5rem)] lg:pl-sidebar lg:[transition:_padding_.4s]">
  <Header />
  <Sidebar />
  <DashboardDOMHydratation />
  <main className="main my-2">{children}</main>
</div>
```

### Formulario y acción con Button

Extraído de `LoginForm.tsx`:

```tsx
<form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
  <label htmlFor="session_chk" aria-hidden="true" className="session_label text-foreground-light text-4xl flex justify-center m-14 font-bold cursor-pointer transition-all duration-700 ease-in-out">
    Login
  </label>
  <input required type="text" name="name" placeholder="Nombre de usuario" className="block w-3/5 mx-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
  <div className="w-3/5 h-10 mx-auto mt-5">
    <Button disabled={isLoading} title="Iniciar sesión" type="submit" variant="secondary">
      {isLoading ? <RiLoader2Fill className="justify-self-center animate-spin" /> : "LogIn"}
    </Button>
  </div>
</form>
```

### Búsqueda y paginación

```tsx
// Header.tsx
<SearchBar placeholder="Buscar..." />

// Consumidor futuro de un listado
<Pagination count={count} />
```

El primer ejemplo es un uso real en Header; el segundo representa la API real del componente, aunque no se encontró consumidor en las rutas presentes.

### Vista responsive

Extraído de `Header.tsx` y `Sidebar.tsx`:

```tsx
<header className="header fixed top-0 left-0 right-0 m-3 z-50 lg:m-4 lg:pl-sidebar">
  <div className="header_container px-4 w-full h-header ... sm:px-6 lg:h-[calc(var(--header-height)_+_2rem)] lg:px-8">
    <div className="hidden lg:block lg:order-1"><UserCard order="1" size="small" /></div>
    <div className="w-[70%] sm:w-[50%]"><SearchBar placeholder="Buscar..." /></div>
    <button className="header_toggle ... lg:hidden" id="header-toggle"><RiMenuFill /></button>
  </div>
</header>
```

En Sidebar, el patrón móvil es `-left-[120%]` y `lg:left-0 lg:w-sidebar`; el botón desktop se oculta fuera de `lg`.

### Tabla

No existe una tabla real ni un ejemplo JSX de tabla en el proyecto actual. Lo único real es el patrón CSS global de `globals.css`: `tbody tr:nth-child(even)` para filas pares, `tbody tr:hover` para hover, `.hide` para salida animada y `.table_container` para scrollbar. Una futura tabla debe documentarse/implementarse tomando esas reglas, no inventando un componente externo.

### Modal

No existe un modal funcional que pueda mostrarse como ejemplo real. `LoginContainer` contiene markup comentado para `login_container_close`, y el store mantiene estado potencial de modal. Esto queda registrado como inconsistencia, no como API reusable.

## 8. Theme System

El tema se gestiona con `next-themes` desde `src/providers/ThemeProvider.tsx`. Usa `attribute="class"`, `defaultTheme="system"`, `enableSystem` y `storageKey="selected-theme"`; `src/app/layout.tsx` mantiene `suppressHydrationWarning`. `ThemeButton` consume `resolvedTheme` y `setTheme`, esperando el montaje para evitar hydration mismatch. Tailwind consume los tokens mediante `@theme inline` en `src/app/globals.css`.

### Tokens semánticos

| Token | Propósito | Light | Dark |
|---|---|---|---|
| `background` | Fondo principal | `hsl(210 20% 98%)` | `hsl(222 47% 8%)` |
| `foreground` | Texto principal | `hsl(222 47% 11%)` | `hsl(210 20% 96%)` |
| `surface` | Cards y paneles | `hsl(0 0% 100%)` | `hsl(222 38% 12%)` |
| `surface-secondary` | Superficie auxiliar e inputs | `hsl(210 20% 96%)` | `hsl(222 34% 15%)` |
| `surface-hover` | Hover/disabled | `hsl(210 20% 93%)` | `hsl(222 30% 19%)` |
| `border` | Bordes | `hsl(214 20% 88%)` | `hsl(217 22% 27%)` |
| `primary` / `secondary` | Acciones | `hsl(222 47% 11%)` / `hsl(214 32% 91%)` | `hsl(210 20% 96%)` / `hsl(217 28% 23%)` |
| `danger` | Acción destructiva | `hsl(0 72% 51%)` | `hsl(0 70% 62%)` |
| `success` / `warning` | Estados | `hsl(142 55% 35%)` / `hsl(32 90% 42%)` | `hsl(142 55% 52%)` / `hsl(36 92% 58%)` |
| `foreground-muted` / `foreground-light` | Texto secundario | `hsl(215 16% 42%)` / `52%` | `hsl(215 15% 70%)` / `58%` |

Usar `bg-background`, `bg-surface`, `text-foreground`, `text-foreground-muted`, `border-border`, `bg-primary`, `text-primary-foreground` y `focus:ring-secondary`. `dark:*` solo cuando no exista un token equivalente. Los componentes nuevos no deben duplicar paletas ni usar colores arbitrarios, `bg-white`/`bg-black` o `text-white`/`text-black`; deben reutilizar componentes propios y mantener `next-themes` y Tailwind sin instalar librerías.

## 8. Product UX

El módulo de productos reutiliza los componentes propios y prioriza un flujo administrativo claro: `/products/add` y `/products/[id]` comparten formulario, con encabezado contextual, campos agrupados, inputs con foco visible, sección de inventario/variante y confirmación previa en las acciones de guardar, descartar y eliminar. El DTO de creación se representa con nombre, slug, descripción, categoría, marca, modelo, imágenes, especificaciones, precio, stock, descuento, estado, límites de compra y color.

La tabla permite selección individual, selección total de los productos visibles, navegación por teclado y acceso rápido a edición haciendo click en una fila. Las acciones destructivas usan `AlertDialog`; los estados de stock y disponibilidad utilizan tokens semánticos para conservar contraste en Light y Dark. No se agregan dependencias ni componentes externos.

## 9. Observaciones e inconsistencias existentes

- La página principal solo muestra `Página principal`; los imports de `Button`, `Pagination` y `Ri24HoursFill` están presentes pero no se usan.
- `Sidebar` apunta a `/users`, `/products`, `/orders` y `/profile`, pero esas páginas no están en el árbol auditado.
- `DashboardDOMHydratation` depende de `localStorage` y listeners imperativos, mientras `Sidebar` también calcula el enlace activo declarativamente; existen dos fuentes para active state.
- `localStorage` se utiliza únicamente para el estado visual del sidebar; no es una persistencia de datos de negocio.
- `handleOpenModal` tipa/guarda un booleano opcional en un estado booleano y el modal/close están comentados; la lógica de modal no está completa.
- `LoginForm` y `RegisterForm` importan `Button` por `@/ui/Button`, mientras el resto puede usar `@/components/ui/Button`; ambos aliases existen.
- Hay nombres/ortografía inconsistentes: `RegsiterForm.tsx`, `DashboardDOMHydratation`, `isLogued` comentado, `Pagína`, `Pagina siguinte`, `aproved` y `Crtl + D`.
- `SessionInitializer` verifica sesión en cada cambio de ruta y puede generar requests repetidos.
- `useAuthContext` declara argumentos `cookieName` en la interfaz, pero las implementaciones `login`, `logout` y `verify` los ignoran; las llamadas sí los pasan.
- `setSessionCookie` deja el token accesible a JavaScript (`httpOnly: false`), una decisión de seguridad existente que no se modifica en esta auditoría.
- `globals.css` tiene referencias a variables no declaradas (`--container-color`, `--container-color-alt`, `--container-color-foreground`, `--secondary-color-muted`, `--background` en selectores de formulario y `--font-roboto`).
- La configuración de imagen permite cualquier hostname HTTP/HTTPS y `unoptimized: true`.
- `prefers-color-scheme: dark` está vacío; solo hay reglas parciales para `.isDark`.
- Hay colores directos y valores arbitrarios mezclados con tokens, por ejemplo `bg-white`, `text-gray-600`, `bg-red-600`, `w-[350px]` y radios arbitrarios.
- `next.config.ts` no define headers de seguridad.
- No se encontraron componentes propios de Card, Input, Select, Table, Modal, Dropdown, Badge, Alert o Loader; no deben citarse como existentes.

## 9. Checklist para futuras tareas

- [ ] Revisé la fuente de verdad de este `README.md` antes de modificar el dashboard.
- [ ] Revisé si ya existe un componente que resuelve esta necesidad.
- [ ] No instalé nuevas dependencias.
- [ ] Utilicé componentes propios del proyecto.
- [ ] Utilicé los tokens de diseño existentes.
- [ ] Respeté los patrones visuales existentes.
- [ ] Respeté la arquitectura y los route groups actuales.
- [ ] Verifiqué responsive con los breakpoints existentes.
- [ ] Verifiqué estados loading, error y empty cuando corresponda.
- [ ] Añadí labels/aria/alt apropiados.
- [ ] No dupliqué componentes.
- [ ] No introduje un sistema de diseño nuevo.
- [ ] Documenté cualquier inconsistencia sin corregirla fuera del alcance.
- [ ] Confirmé que los cambios de producción son estrictamente los solicitados.
