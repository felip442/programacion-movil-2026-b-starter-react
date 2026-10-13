# Endpoint Integration — Productos

- **Feature:** Catálogo de productos
- **Base:** `${API_URL}/api/products` (por defecto `http://localhost:3000`)
- **Auth required:** No

Formato de error común a todos los endpoints:

```json
{ "error": "Datos inválidos", "details": ["price debe ser un número mayor que 0"] }
```

---

## 1. `GET /api/products`

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `search` | query | string | No | El nombre contiene el texto, sin distinguir mayúsculas |
| `category` | query | string | No | Categoría exacta |

**Success (200):** arreglo de productos (puede ser `[]`).
```json
[{ "id": 1, "name": "Agua mineral 600 ml", "price": 1800, "category": "Bebidas", "stock": 120 }]
```

| Status | Meaning | App behavior |
|--------|---------|--------------|
| — | Sin errores propios | Red caída → estado error con «Reintentar» |

---

## 2. `GET /api/products/:id`

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Solo dígitos |

**Success (200):** el producto.

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico | Mensaje de error |
| 404 | No existe | «No encontramos ese producto» con botón para volver |

---

## 3. `POST /api/products`

**Body:**
```json
{ "name": "Café molido 500 g", "price": 18500, "category": "Bebidas", "stock": 12 }
```

**Success (201):** el producto creado con su `id` nuevo (incremental).

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | Datos inválidos (un mensaje por problema en `details`) | Muestra el mensaje y la lista de `details` en el formulario |

---

## 4. `PUT /api/products/:id`

Mismo cuerpo y reglas que POST; reemplaza los campos del producto.

**Success (200):** el producto actualizado.

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico o datos inválidos | Mensaje y `details` en el formulario |
| 404 | No existe | Mensaje «No encontramos ese producto» |

---

## 5. `DELETE /api/products/:id`

**Success (204):** sin cuerpo.

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico | Mensaje de error en el detalle |
| 404 | No existe | Mensaje de error en el detalle |

---

## Errores generales

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | JSON malformado (manejador central) | Mensaje del servidor |
| 404 | Ruta desconocida (manejador 404) | Mensaje del servidor |
| 500 | Error inesperado (manejador central) | Mensaje y «Reintentar» |
| red | La API no responde | `ApiError` de red: «No fue posible conectar con el servidor» |

---

## DTO → domain mapping

| DTO field | Domain field | Transform |
|-----------|--------------|-----------|
| `price` | `ProductView.priceLabel` | `formatCOP` |
| `stock` | `ProductView.stockLabel` | «Agotado» / «Pocas unidades» / «Disponible» |

---

## Caching / offline

- **Strategy:** online-only; sin caché. Al volver a la lista se recarga.
