# Slot del encabezado del dashboard

La carpeta `@header` implementa un **parallel route** de Next.js. Su contenido se entrega al layout del dashboard mediante la prop `header` y se renderiza dentro del componente común `Header`. Así, la estructura fija del encabezado (por ejemplo, el selector de compañía y el botón del menú) permanece en un solo lugar, mientras que cada ruta puede aportar contenido específico.

## Rutas actuales

- `products/page.tsx`: muestra la barra de búsqueda y el botón de filtros para la sección de productos.
- `default.tsx`: devuelve `null` como contenido predeterminado del slot.
- `[...catchAll]/page.tsx`: devuelve `null` para las demás rutas internas que no tienen un encabezado específico. Al no ser opcional, no coincide con `/`.

El slot sólo controla el contenido que se inserta en el encabezado común; no reemplaza ni modifica el contenido principal de la página.

## Cómo añadir contenido para otra ruta

1. Crea una ruta dentro de `@header` que corresponda a la ruta del dashboard. Por ejemplo, para `/orders`, añade `@header/orders/page.tsx`.
2. Exporta un componente React por defecto desde ese archivo.
3. Mantén en ese componente únicamente los controles propios de esa ruta. El layout exterior se encarga de renderizarlo dentro de `Header`.
4. Comprueba también el fallback: si la ruta debe mostrar controles, crea su página específica en el slot; de lo contrario, deja que devuelva `null`.

No dupliques aquí la estructura compartida del encabezado. Para cambiar elementos comunes, modifica el componente `Header`; para cambiar la búsqueda o los filtros de productos, modifica la ruta `products` del slot o los componentes que ésta utiliza.
