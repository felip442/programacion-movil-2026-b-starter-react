# Feature — Catálogo de productos

- **Owner:** afcardenas-2024a
- **Status:** In progress
- **Related stories:** HU-PROD-001 (listar y buscar), HU-PROD-002 (ver detalle), HU-PROD-003 (crear), HU-PROD-004 (editar), HU-PROD-005 (eliminar)

---

## Purpose

Permitir que una persona administre el catálogo de una tienda pequeña: consultar los productos, buscarlos por nombre, filtrarlos por categoría y crear, editar o eliminar productos contra una API propia en Express.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Lista de productos | `/productos` | Ver todos los productos, buscar por texto y filtrar por categoría |
| Detalle de producto | `/productos/:id` | Ver todos los campos; ir a editar o eliminar con confirmación |
| Formulario (crear) | `/productos/nuevo` | Registrar un producto nuevo con validación en línea |
| Formulario (editar) | `/productos/:id/editar` | Modificar un producto existente (campos precargados) |

> Cada pantalla tiene su ficha en `docs/screens/`.

---

## State

- **Pattern:** estado local por pantalla con `useState` + `useEffect` (ver ADR-001).
- **State object(s):** lista: `products`, `status` (`loading | ready | error`), `errorMessage`, `search`, `category`; detalle: `product`, `status`, `isConfirmingDelete`; formulario: campos, `errors` por campo, `serverError`, `isSaving`.
- **Key transitions:** `loading → ready` (datos recibidos) · `loading → error` (falla de red o HTTP) · `error → loading` (botón «Reintentar») · `ready` + filtros → «sin resultados» cuando `filterProducts` devuelve vacío.

---

## Data

- **Use cases:** listar, obtener uno, crear, actualizar y eliminar productos.
- **Repositories:** `data/products-api.ts` (`getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`).
- **Remote sources / endpoints:** `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` (ver `docs/api/products-endpoints.md`).
- **Local persistence:** N/A. La API guarda los datos en memoria y se reinician con el servidor.

---

## Edge cases & states

- [x] Loading: texto «Cargando…» mientras llega la respuesta.
- [x] Empty: la API devuelve una lista vacía → `EmptyState` «No hay productos».
- [x] Sin resultados: los filtros no encuentran nada → `EmptyState` con opción de limpiar filtros.
- [x] Error / retry: `EmptyState` con el mensaje de `getErrorMessage` y botón «Reintentar».
- [x] Offline: se trata como error de red (`ApiError` con `status` null).
- [ ] Permission denied: N/A (la API no tiene autenticación).
- [x] Producto inexistente (404) en detalle y edición: mensaje «No encontramos ese producto».
- [x] Datos inválidos: validación en línea con `validateProduct` y, si la API responde 400, sus `details`.
- [x] Id no numérico: la ruta de la app solo acepta dígitos; la API responde 400.

---

## Tests planned

- Unitarias: `validateProduct` (campos inválidos y caso válido), `toProductView` (precio en COP y etiquetas de stock), `filterProducts` (texto sin mayúsculas y categoría).
- API (`startTestServer`): POST inválido → 400 con `details`; GET de id inexistente → 404; id no numérico → 400; ciclo crear → actualizar → eliminar.

---

## Decisions

- [ADR-001 — Manejo del estado](../decisions/ADR-001-estado.md)
- [ADR-002 — Consumo de la API](../decisions/ADR-002-consumo-api.md)
