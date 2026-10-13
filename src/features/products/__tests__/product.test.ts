import { describe, expect, it } from 'vitest';
import seedProducts from '../../../../server/data/products.json';
import {
  CATEGORIES,
  filterProducts,
  formatCOP,
  LOW_STOCK_THRESHOLD,
  toProductView,
  validateProduct,
  type Product,
} from '../domain/product';

/**
 * Pruebas unitarias de EJEMPLO (ya vienen dadas) para que `npm test` corra desde el inicio.
 * Muestran el estilo esperado: describe / it / expect, sin red ni pantallas.
 */
describe('datos semilla de la API (ejemplo)', () => {
  it('trae 8 productos con ids 1 a 8', () => {
    expect(seedProducts).toHaveLength(8);
    expect(seedProducts.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('usa solo categorías permitidas y stock entero no negativo', () => {
    for (const item of seedProducts) {
      expect(CATEGORIES).toContain(item.category);
      expect(Number.isInteger(item.stock)).toBe(true);
      expect(item.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades para probar las etiquetas', () => {
    expect(seedProducts.some((item) => item.stock === 0)).toBe(true);
    expect(seedProducts.some((item) => item.stock > 0 && item.stock < LOW_STOCK_THRESHOLD)).toBe(true);
  });
});

describe('formatCOP (ejemplo)', () => {
  it('separa los miles con punto y antepone el signo de pesos', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
    expect(formatCOP(8500)).toBe('$ 8.500');
    expect(formatCOP(950)).toBe('$ 950');
  });
});

// Pruebas unitarias del dominio (Parte 5).
describe('validateProduct', () => {
  it('rechaza un nombre vacío, un precio menor o igual que 0 y una categoría no permitida', () => {
    const result = validateProduct({ name: '   ', price: 0, category: 'Ropa', stock: 1.5 });
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['category', 'name', 'price', 'stock']);
  });

  it('acepta un producto válido y rechaza un nombre de más de 60 caracteres', () => {
    expect(validateProduct({ name: 'Café 500 g', price: 18500, category: 'Bebidas', stock: 0 })).toEqual({
      isValid: true,
      errors: {},
    });
    const longName = validateProduct({ name: 'a'.repeat(61), price: 1, category: 'Hogar', stock: 1 });
    expect(longName.errors.name).toBeDefined();
  });
});

describe('toProductView', () => {
  const base: Product = { id: 9, name: '  Olla  ', price: 1250000, category: 'Hogar', stock: 10 };

  it('formatea el precio en pesos y marca «Agotado» y «Pocas unidades»', () => {
    expect(toProductView(base)).toMatchObject({ name: 'Olla', priceLabel: '$ 1.250.000', stockLabel: 'Disponible' });
    expect(toProductView({ ...base, stock: 0 })).toMatchObject({ stockLabel: 'Agotado', isOutOfStock: true, isLowStock: false });
    expect(toProductView({ ...base, stock: 4 })).toMatchObject({ stockLabel: 'Pocas unidades', isLowStock: true });
  });
});

describe('filterProducts', () => {
  it('filtra por texto sin distinguir mayúsculas y por categoría exacta', () => {
    const products = seedProducts as Product[];
    expect(filterProducts(products, { search: 'JUGO', category: '' }).map((item) => item.id)).toEqual([2]);
    expect(filterProducts(products, { search: '', category: 'Aseo' }).map((item) => item.id)).toEqual([6, 7]);
    expect(filterProducts(products, { search: '  ', category: '' })).toHaveLength(8);
    expect(filterProducts(products, { search: 'zzz', category: '' })).toEqual([]);
  });
  
});
