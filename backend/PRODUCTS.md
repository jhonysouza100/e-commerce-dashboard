# Módulo de productos

Guía de integración del contrato implementado por [ProductsController](./modules/products/products.controller.ts) y [ProductsService](./modules/products/products.service.ts).

## Base y acceso

La base de las rutas es `/api/v1/products` (prefijo y versión configurados en [main.ts](./main.ts)).

| Ruta | Acceso | Uso |
|---|---|---|
| `GET /` | Público | Listar y filtrar productos |
| `GET /:slug` | Tenant | Obtener un producto por slug |
| `GET /slug/sitemap` | Tenant | Listar slugs e imágenes de productos activos |
| `POST /` | Bearer, rol `ADMIN` o `ROOT` | Crear |
| `PATCH /:id` | Bearer, rol `ADMIN` o `ROOT` | Actualizar |
| `DELETE /:id?companyId={id}` | Bearer, rol `ADMIN` o `ROOT` | Eliminar uno o varios |
| `POST /duplicate` | Bearer válido | Duplicar IDs |
| `PATCH /desactive` | Bearer válido | Alternar el estado activo |

Las rutas de tenant requieren `x-api-key` válido o un `Origin` asociado al dominio de la compañía. El guard busca primero la API key. Las rutas administrativas usan `Authorization: Bearer <token>`; `ROOT` también pasa el control de rol `ADMIN`.

## Listado y búsqueda

`GET /api/v1/products` devuelve `{ data: Product[], count }`. `count` contiene `page`, `limit`, `total`, `totalPages`, `hasNextPage` y `hasPreviousPage`. El orden es por `updatedAt` descendente; `page` inicia en 1 y `limit` por defecto es 12, con máximo 100.

Parámetros admitidos:

| Parámetro | Comportamiento |
|---|---|
| `id` | ID exacto, entero positivo |
| `q` | Búsqueda por términos en nombre, alias, marca, modelo y descripción |
| `name` | Alias de búsqueda usado solo si no se envía `q` |
| `topic` | Coincidencia parcial |
| `page`, `limit` | Paginación |
| `minPrice`, `maxPrice` | Límites inclusivos; `minPrice` no puede superar `maxPrice` |
| `isActive` | Filtra el estado; acepta `true` o `false` |
| `stock` | `true`: stock mayor que cero; `false`: stock cero o menor |
| `tenant_id` | Filtra por ID de compañía; no se obtiene automáticamente del tenant en esta ruta |

Cada término de `q` debe coincidir con al menos uno de los campos buscables. No hay filtros implementados para categoría ni `status`. La aplicación rechaza parámetros de query no declarados en el DTO.

## Crear y actualizar

Ambas rutas reciben `multipart/form-data`. El campo `product` contiene el DTO serializado como JSON; `image` es un archivo opcional y `gallery` puede repetirse hasta 20 veces. `image` admite un archivo. Los archivos se guardan en Cloudinary y el producto conserva cada imagen como `{ public_id, secure_url }`.

Ejemplo del campo `product` al crear:

```json
{
  "company_id": 1,
  "name": "Laptop",
  "description": "Laptop de ejemplo",
  "price": 999.99,
  "category": "COMPUTING",
  "stock": 10,
  "discount": 0,
  "isActive": true,
  "specifications": [{ "label": "Conectividad", "value": "USB-C" }]
}
```

`company_id`, `name`, `description` y `price` son los campos requeridos para crear. El ID de compañía va en el JSON (`company_id`), no en `companyId` como sugieren algunas anotaciones Swagger. En actualización `company_id` también es obligatorio; identifica y autoriza la compañía propietaria del producto. El resto de los campos se puede omitir.

El producto incluye además `alias`, `topic`, `brand`, `model`, `dimensions` (`height`, `length`, `weight`, `width`), `color` (`name`, `value`), `image`, `gallery`, `maxCount`, `minCount` y `performance` (`sales`, `rating`). Las categorías disponibles están definidas en [products.enum.ts](./modules/products/enums/products.enum.ts). Al crear, el slug se genera desde el nombre; al actualizar, solo se regenera si se envía un nombre.

En actualización, `gallery` en el JSON representa la galería que se conserva: si se omite, el servicio elimina las imágenes actuales de la galería. Los archivos nuevos de `gallery` se agregan a la lista indicada. Si se envía un archivo `image`, reemplaza la imagen principal existente.

## Operaciones por lote y respuestas

- `POST /duplicate`: `{ "ids": [1, 2] }`. Duplica los productos accesibles al administrador autenticado; conserva la compañía y genera nombres con sufijo `(Copia N)`.
- `PATCH /desactive`: `{ "ids": [1, 2] }`. Alterna `isActive` de cada producto accesible.
- `DELETE /:id?companyId=1`: el segmento `id` contiene un array JSON, por ejemplo `/products/[1,2]?companyId=1`. Todos los IDs deben pertenecer a esa compañía; se eliminan también las imágenes asociadas.

Las operaciones de escritura responden con HTTP 200 y un objeto Nest con `statusCode` y `message` (por ejemplo, `{ "statusCode": 200, "message": "..." }`). Los errores usan excepciones HTTP, como 400 para filtros/JSON inválidos y 404 para productos no encontrados.

`GET /:slug` devuelve el producto directamente. `GET /slug/sitemap` devuelve un array directo con `slug`, `image` y `updatedAt` de productos activos de la compañía identificada. La relación tenant-product y los campos persistidos están en [product.entity.ts](./modules/products/entities/product.entity.ts).

## Diferencias con el cliente actual

Antes de reutilizar las peticiones existentes en [useProductsRequests](../src/components/product/hooks/useProductsRequests.ts), tener en cuenta:

- La API expone el sitemap en `/slug/sitemap`; el cliente pide `/name/sitemap` y espera otra forma de respuesta.
- El cliente manda `category` y `status` en algunos listados; el backend no admite esos parámetros. Para estado, el nombre soportado es `isActive`; no hay filtro de categoría.
- El cliente elimina con una ruta de IDs sin `companyId`; el backend requiere `DELETE /:id?companyId=...`.
- `GET /:slug` busca por slug y requiere identidad de tenant; no busca por nombre ni por ID.

El [ValidationPipe global](./main.ts) tiene `whitelist` y `forbidNonWhitelisted` activos. Los DTOs de creación y actualización documentan campos con Swagger, pero no declaran reglas de `class-validator`; no asumir que las anotaciones Swagger validan el JSON enviado.
