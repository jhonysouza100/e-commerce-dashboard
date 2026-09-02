export default function handleGoBackRoute(router: any) {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);

    // Removemos el último segmento
    pathSegments.pop();

    // Armamos la nueva ruta base
    const parentPath = `/${pathSegments.join("/")}`;

    // Si por alguna razón queda vacío, aseguramos que vaya a la raíz
    router.push(parentPath || "/");
  }
}