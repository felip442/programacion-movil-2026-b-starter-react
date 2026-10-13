# Local Entity — Product

- **Store:** N/A (almacenamiento en memoria en la API; la app no persiste datos)
- **Table/collection:** `products` (arreglo en memoria, semilla en `server/data/products.json`)
- **Schema version introduced:** 1

---

## Fields

| Column | Type | Null | Notes |
|--------|------|------|-------|
| `id` | integer | No | Clave primaria; la asigna la API de forma incremental (máximo actual + 1) |
| `name` | string | No | Obligatorio, sin quedar vacío tras `trim()`, máximo 60 caracteres |
| `price` | number | No | Número finito mayor que 0 (pesos colombianos) |
| `category` | string | No | Una de «Bebidas», «Snacks», «Aseo», «Hogar» |
| `stock` | integer | No | Entero mayor o igual que 0 |
| `created_at` / `updated_at` | — | — | N/A (almacenamiento en memoria) |

---

## Indexes

| Index | Columns | Reason |
|-------|---------|--------|
| N/A (almacenamiento en memoria) | — | Búsqueda lineal sobre 8 elementos |

---

## Relationships

| Related entity | Key | Cardinality |
|----------------|-----|-------------|
| N/A (almacenamiento en memoria) | — | — |

---

## Sync

- **Synced?** No. N/A (almacenamiento en memoria; se reinicia con el servidor).

---

## Reglas derivadas (vista)

- Etiqueta de stock: 0 → «Agotado»; 1 a 4 → «Pocas unidades»; 5 o más → «Disponible».
- Precio mostrado con `formatCOP` (p. ej. `$ 1.250.000`).
