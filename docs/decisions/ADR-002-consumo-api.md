# ADR-002 — Consumo de la API desde la app

- **ID:** ADR-002
- **Date:** 2026-10-10
- **Status:** Accepted
- **Authors:** afcardenas-2024a

---

## Context

La app Ionic debe consumir la API Express de productos (`/api/products`). Hay que decidir con qué se hacen las peticiones, de dónde sale la dirección de la API y en qué capa se traducen los errores HTTP a mensajes para la persona usuaria, de modo que las pantallas no dependan de detalles de `fetch`.

**Known constraints:**
- La API corre en `http://localhost:3000` y la app en `http://localhost:5173` (orígenes distintos → CORS).
- La API responde todos los errores con `{ error, details[] }` (400, 404 y 500).
- No se agregan dependencias (sin Axios).

---

## Decision

**We decided:** usar `fetch` nativo dentro de una función `request<T>()` en `data/products-api.ts`, con la dirección base en `API_URL` (`data/config.ts`, leída de `VITE_API_URL`) y convertir todo fallo en un `ApiError` que las pantallas traducen con `getErrorMessage`.

**Justification:**
`request` concentra el manejo de errores en un solo lugar: si `fetch` lanza una excepción es un **error de red** (`ApiError` con `status` null); si la respuesta no es `ok`, lee el cuerpo `{ error, details }` y lanza un `ApiError` con el código HTTP; si es 204 no lee cuerpo. Las funciones `getProducts`, `getProduct`, `createProduct`, `updateProduct` y `deleteProduct` solo arman la ruta, el método y el cuerpo JSON. En el servidor, `express.json()` convierte el cuerpo, `cors()` permite el origen de la app, el manejador 404 responde rutas desconocidas y el manejador central de errores responde 400 para JSON malformado y 500 para cualquier excepción, siempre con el mismo formato.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `fetch` + `request` + `ApiError` — chosen | Nativo, sin dependencias, errores tipados | Hay que revisar `response.ok` a mano | — (chosen) |
| Axios | Interceptores, lanza en 4xx/5xx | Dependencia nueva | No es necesaria para 5 endpoints |
| `fetch` directo en cada pantalla | Menos archivos | Lógica de errores repetida, viola las capas | Rompe la regla presentation → data |

---

## Consequences

**Positive:**
- Las pantallas solo conocen `ApiError` y `getErrorMessage`, no códigos HTTP sueltos.
- Cambiar la dirección de la API es editar `.env`, sin tocar código.

**Negative / trade-offs:**
- No hay reintentos automáticos ni caché; el reintento es manual (botón «Reintentar»).
- Si la API cambia su formato de error, hay que ajustar `request`.
