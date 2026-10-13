# Screen — Detalle de producto

- **Route:** `/productos/:id`
- **Feature:** Catálogo de productos
- **Design reference:** N/A (componentes estándar de Ionic)

---

## Purpose

Consultar todos los datos de un producto y, desde ahí, editarlo o eliminarlo.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonToolbar` + `IonBackButton` | Título «Detalle del producto», regreso a `/productos` |
| Body | `IonList` con `IonItem` | Id, nombre, categoría, precio en COP, stock y etiqueta de stock |
| Footer / CTA | `IonButton` «Editar» y «Eliminar» | Eliminar muestra una confirmación en pantalla |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | `GET /api/products/:id` en curso | Texto «Cargando producto…» |
| Loaded | La API devolvió el producto | Campos del producto y botones |
| Not found | La API respondió 404 | `EmptyState` «No encontramos ese producto» con botón para volver |
| Error | Falla de red u otro error | `EmptyState` con el mensaje y botón «Reintentar» |
| Confirmando eliminación | Se tocó «Eliminar» | Texto «¿Eliminar este producto?» con «Confirmar» y «Cancelar» |

---

## Actions

| Action | Result |
|--------|--------|
| Tocar «Editar» | Navega a `/productos/:id/editar` |
| Tocar «Eliminar» | Muestra la confirmación simple |
| Tocar «Confirmar» | `DELETE /api/products/:id` y regresa a la lista |
| Tocar «Cancelar» | Oculta la confirmación |
