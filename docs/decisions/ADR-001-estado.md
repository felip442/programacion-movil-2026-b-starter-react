# ADR-001 — Manejo del estado de las pantallas

- **ID:** ADR-001
- **Date:** 2026-10-10
- **Status:** Accepted
- **Authors:** afcardenas-2024a

---

## Context

La app tiene cuatro pantallas (lista, detalle, crear y editar) que cargan datos desde la API y deben mostrar estados de carga, vacío, sin resultados y error. Hay que decidir dónde vive ese estado antes de escribir las pantallas, porque condiciona cómo se recarga la lista al volver de otra pantalla y cómo se prueban los componentes.

**Known constraints:**
- Tiempo corto (parcial de un día) y alcance de las semanas 6 a 9 (React con hooks).
- Una sola funcionalidad y sin datos compartidos entre muchas pantallas.
- Sin dependencias nuevas en `package.json`.

---

## Decision

**We decided:** el estado de cada pantalla vive en la propia página con `useState` y `useEffect`; la lógica pura (validar, filtrar, formatear) está en `domain/product.ts` y las llamadas HTTP en `data/products-api.ts`.

**Justification:**
Cada pantalla pide a la API lo que necesita y nada más se comparte entre pantallas, así que un store global no aporta. Con hooks locales el flujo es fácil de seguir y de explicar, y la lista se mantiene al día recargando con `useIonViewWillEnter` al volver. Un `status` de tipo `'loading' | 'ready' | 'error'` evita combinaciones imposibles de booleanos.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `useState` + `useEffect` por página — chosen | Sin dependencias, simple, visto en clase | Algo de código repetido entre pantallas | — (chosen) |
| Hook propio `useProducts` | Reutiliza la carga | Más archivos para una sola lista | No compensa con una sola funcionalidad |
| Context de React | Estado compartido sin librerías | Re-renderiza todo el árbol, más complejo | No hay estado realmente compartido |
| Store (Redux / Zustand) | Escala bien, herramientas de depuración | Dependencia nueva y mucho código base | Fuera del alcance del parcial |

---

## Consequences

**Positive:**
- Cada pantalla se entiende leyendo un solo archivo.
- El dominio queda puro y se prueba sin React.

**Negative / trade-offs:**
- La lista se vuelve a pedir cada vez que se entra a la pantalla (sin caché).
- Si la app crece (carrito, sesión), habrá que migrar a un hook propio o a un store.
