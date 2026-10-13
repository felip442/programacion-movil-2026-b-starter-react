# Screen — Lista de productos

- **Route:** `/productos`
- **Feature:** Catálogo de productos
- **Design reference:** N/A (sin mockup; se usan componentes estándar de Ionic)

---

## Purpose

Ver el catálogo completo, buscar productos por nombre, filtrarlos por categoría y entrar al detalle o al formulario de creación.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` | Título «Productos» |
| Filtros | `IonInput` + 5 `IonButton` | Buscador por texto y botones «Todas», «Bebidas», «Snacks», «Aseo», «Hogar» (el activo se resalta) |
| Body | `IonList` de `ProductCard` | Nombre, categoría, precio en COP y etiqueta de stock |
| Footer / CTA | `IonButton` «Nuevo producto» | Navega a `/productos/nuevo` |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Petición `GET /api/products` en curso | Texto «Cargando productos…» |
| Loaded | La API respondió con productos | Lista de `ProductCard` filtrada |
| Empty | La API devolvió `[]` | `EmptyState` «No hay productos» con botón para crear |
| Sin resultados | `filterProducts` devuelve `[]` | `EmptyState` «Sin resultados» con botón «Limpiar filtros» |
| Error | Falla de red o respuesta no exitosa | `EmptyState` con el mensaje y botón «Reintentar» |
| Offline | No hay conexión con la API | Igual que Error (mensaje de red) |

---

## Actions

| Action | Result |
|--------|--------|
| Escribir en el buscador | Filtra por nombre sin distinguir mayúsculas |
| Tocar una categoría | Filtra por categoría exacta («Todas» quita el filtro) |
| Tocar un producto | Navega a `/productos/:id` |
| Tocar «Nuevo producto» | Navega a `/productos/nuevo` |
| Tocar «Reintentar» | Vuelve a cargar la lista |
| Volver a la pantalla | Recarga la lista (`useIonViewWillEnter`) |
