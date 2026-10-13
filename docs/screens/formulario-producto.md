# Screen — Formulario de producto (crear / editar)

- **Route:** `/productos/nuevo` y `/productos/:id/editar`
- **Feature:** Catálogo de productos
- **Design reference:** N/A (componentes estándar de Ionic)

---

## Purpose

Crear un producto nuevo o modificar uno existente, con validación en línea antes de enviar a la API.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonToolbar` + `IonBackButton` | «Nuevo producto» o «Editar producto» |
| Body | `IonInput` (nombre, precio, stock) + `IonButton` por categoría | Cada campo muestra su error debajo |
| Mensaje del servidor | `IonText` color `danger` | Mensaje y `details` cuando la API responde 400 |
| Footer / CTA | `IonButton` «Guardar» | Deshabilitado mientras se guarda |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading (solo editar) | `GET /api/products/:id` en curso | Texto «Cargando producto…» |
| Listo | Formulario vacío (crear) o precargado (editar) | Campos editables |
| Error de validación | `validateProduct` devuelve errores | Mensaje bajo cada campo inválido |
| Guardando | Petición POST/PUT en curso | Botón deshabilitado con texto «Guardando…» |
| Error del servidor | La API respondió 400/404/500 o no respondió | Mensaje y lista de `details` |
| Error al cargar | Producto a editar no existe | `EmptyState` con el mensaje |

---

## Actions

| Action | Result |
|--------|--------|
| Escribir en un campo | Actualiza el estado del campo |
| Tocar una categoría | Selecciona esa categoría |
| Tocar «Guardar» con datos inválidos | Muestra los errores en línea, no llama a la API |
| Tocar «Guardar» con datos válidos | POST (crear) o PUT (editar) y regresa a la lista |
