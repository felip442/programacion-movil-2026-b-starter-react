/**
 * Capa DOMAIN de la funcionalidad «Productos» (nombres de capa del framework:
 * `01-architecture/layers-and-state` → data / domain / presentation).
 *
 * Solo tipos, constantes y funciones puras: aquí no hay HTTP, ni React, ni Ionic
 * (regla de dependencias del framework: el dominio no depende de nada de afuera).
 *
 * Los tipos, las constantes y `formatCOP` ya vienen dados; `toProductView`,
 * `validateProduct` y `filterProducts` se implementan en la Parte 3.
 */

/** Producto tal como lo entrega la API. */
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Datos que captura el formulario (aún sin id). */
export interface ProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Producto listo para mostrarse en la interfaz. */
export interface ProductView {
  id: number;
  name: string;
  /** Precio en pesos colombianos, p. ej. "$ 1.250.000". */
  priceLabel: string;
  category: string;
  stock: number;
  /** "Agotado" (0) · "Pocas unidades" (menos de LOW_STOCK_THRESHOLD) · "Disponible". */
  stockLabel: string;
  /** true cuando quedan entre 1 y LOW_STOCK_THRESHOLD - 1 unidades. */
  isLowStock: boolean;
  /** true cuando no quedan unidades (stock = 0). */
  isOutOfStock: boolean;
}

/** Campos del formulario que pueden tener un error de validación. */
export type ProductField = 'name' | 'price' | 'category' | 'stock';

/** Resultado de validar un `ProductInput`. */
export interface ValidationResult {
  isValid: boolean;
  /** Mensaje de error por campo. Vacío si `isValid` es true. */
  errors: Partial<Record<ProductField, string>>;
}

/** Filtros de la lista. `category` vacío significa «todas». */
export interface ProductFilters {
  search: string;
  category: string;
}

/** Categorías permitidas (las mismas que valida la API). */
export const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'] as const;

/** Longitud máxima del nombre. */
export const NAME_MAX_LENGTH = 60;

/** Umbral de «pocas unidades»: un stock menor que este valor (y mayor que 0). */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * YA DADO. Formatea un número como pesos colombianos con separador de miles «.»:
 * formatCOP(1250000) → "$ 1.250.000"; formatCOP(8500) → "$ 8.500".
 * (El separador se pone con una expresión regular sobre el número redondeado.)
 */
export function formatCOP(value: number): string {
  const digits = Math.round(value).toString();
  return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** Etiqueta de stock: «Agotado» (0), «Pocas unidades» (< LOW_STOCK_THRESHOLD) o «Disponible». */
export function getStockLabel(stock: number): string {
  if (stock === 0) return 'Agotado';
  if (stock < LOW_STOCK_THRESHOLD) return 'Pocas unidades';
  return 'Disponible';
}

/**
 * Convierte un `Product` en un `ProductView`.
 *  - `name` sin espacios sobrantes; `priceLabel` con `formatCOP`;
 *  - `stockLabel`, `isOutOfStock` e `isLowStock` coherentes entre sí.
 */
export function toProductView(product: Product): ProductView {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD;
  return {
    id: product.id,
    name: product.name.trim(),
    priceLabel: formatCOP(product.price),
    category: product.category,
    stock: product.stock,
    stockLabel: getStockLabel(product.stock),
    isLowStock,
    isOutOfStock,
  };
}

/**
 * Valida los datos del formulario con las MISMAS reglas que la API.
 * Devuelve un mensaje por cada campo inválido; `isValid` es true solo si no hay errores.
 */
export function validateProduct(input: ProductInput): ValidationResult {
  const errors: Partial<Record<ProductField, string>> = {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';

  if (name === '') {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `El nombre debe tener máximo ${NAME_MAX_LENGTH} caracteres.`;
  }
  if (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price <= 0) {
    errors.price = 'El precio debe ser un número mayor que 0.';
  }
  if (!input.category) {
    errors.category = 'La categoría es obligatoria.';
  } else if (!(CATEGORIES as readonly string[]).includes(input.category)) {
    errors.category = `La categoría debe ser una de: ${CATEGORIES.join(', ')}.`;
  }
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    errors.stock = 'El stock debe ser un entero mayor o igual que 0.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Filtra la lista en memoria por texto (sin distinguir mayúsculas) y categoría exacta.
 * Devuelve un arreglo nuevo; no modifica el original.
 */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const search = filters.search.trim().toLowerCase();
  return products.filter((product) => {
    const matchesSearch = search === '' || product.name.toLowerCase().includes(search);
    const matchesCategory = filters.category === '' || product.category === filters.category;
    return matchesSearch && matchesCategory;
  });
}
