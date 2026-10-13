// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from './test-server';

/**
 * Prueba de la API de EJEMPLO (ya viene dada). Patrón que se espera en las pruebas de la API:
 *  1. `startTestServer()` levanta la API en un puerto libre antes de cada prueba.
 *  2. `fetch` (el de Node, sin dependencias extra) llama a la API como lo haría la app.
 *  3. Se comprueba el código de estado y el cuerpo.
 *  4. `close()` cierra el servidor al terminar.
 */
let baseUrl = '';
let close: () => Promise<void>;

beforeEach(async () => {
  ({ baseUrl, close } = await startTestServer());
});

afterEach(async () => {
  await close();
});

describe('API de productos (ejemplo)', () => {
  it('arranca y responde 404 con el formato de error en una ruta desconocida', async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: expect.any(String), details: expect.any(Array) });
  });
});

// Pruebas de la API (Parte 5).
const validProduct = { name: 'Café molido 500 g', price: 18500, category: 'Bebidas', stock: 12 };
const jsonHeaders = { 'Content-Type': 'application/json' };

describe('GET /api/products', () => {
  it('filtra por search (sin mayúsculas) y por category', async () => {
    const response = await fetch(`${baseUrl}/api/products?search=AGUA&category=Bebidas`);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.map((item: { id: number }) => item.id)).toEqual([1]);
  });
});

describe('POST /api/products', () => {
  it('responde 400 con { error, details } cuando los datos no validan', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ name: '', price: -5, category: 'Ropa', stock: 2.5 }),
    });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toEqual(expect.any(String));
    expect(body.details).toHaveLength(4);
  });

  it('responde 201 y asigna el id incremental 9', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(validProduct),
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 9, ...validProduct });
  });
});

describe('GET /api/products/:id', () => {
  it('responde 404 cuando el producto no existe', async () => {
    const response = await fetch(`${baseUrl}/api/products/999`);
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body).toEqual({ error: expect.any(String), details: expect.any(Array) });
  });

  it('responde 400 cuando el id no es numérico', async () => {
    const response = await fetch(`${baseUrl}/api/products/abc`);
    expect(response.status).toBe(400);
  });
});

describe('PUT y DELETE /api/products/:id', () => {
  it('actualiza con 200, elimina con 204 sin cuerpo y luego responde 404', async () => {
    const updated = await fetch(`${baseUrl}/api/products/1`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({ ...validProduct, stock: 3 }),
    });
    expect(updated.status).toBe(200);
    expect((await updated.json()).stock).toBe(3);

    const deleted = await fetch(`${baseUrl}/api/products/1`, { method: 'DELETE' });
    expect(deleted.status).toBe(204);
    expect(await deleted.text()).toBe('');

    const again = await fetch(`${baseUrl}/api/products/1`, { method: 'DELETE' });
    expect(again.status).toBe(404);
  });
});
