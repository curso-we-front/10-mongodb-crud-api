const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app');

let mongod;

const seed = [
  {
    title: 'Node.js Básico',
    content: 'Aprende Node.js desde cero',
    author: 'Ana',
    published: true,
    tags: ['nodejs', 'javascript'],
  },
  {
    title: 'Guía de Express',
    content: 'Construye APIs con Express',
    author: 'Carlos',
    published: true,
    tags: ['express', 'nodejs'],
  },
  {
    title: 'Borrador: MongoDB Avanzado',
    content: 'Este artículo aún no está listo',
    author: 'Ana',
    published: false,
    tags: ['mongodb'],
  },
  {
    title: 'Tutorial de MongoDB',
    content: 'Trabajando con MongoDB y Mongoose',
    author: 'María',
    published: true,
    tags: ['mongodb', 'database'],
  },
  {
    title: 'Diseño de APIs REST',
    content: 'Principios de diseño de APIs',
    author: 'Carlos',
    published: true,
    tags: ['api', 'rest'],
  },
];

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  for (const article of seed) {
    await request(app).post('/articles').send(article);
  }
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// ─── GET /articles ────────────────────────────────────────────────────────────

describe('GET /articles — publicados', () => {
  test('devuelve solo artículos publicados', async () => {
    const res = await request(app).get('/articles');
    expect(res.status).toBe(200);
    expect(res.body.data.every((a) => a.published === true)).toBe(true);
  });

  test('no incluye artículos no publicados', async () => {
    const res = await request(app).get('/articles');
    const titles = res.body.data.map((a) => a.title);
    expect(titles).not.toContain('Borrador: MongoDB Avanzado');
  });
});

describe('GET /articles — metadatos de paginación', () => {
  test('incluye data, total, page, limit y totalPages', async () => {
    const res = await request(app).get('/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.page).toBe('number');
    expect(typeof res.body.limit).toBe('number');
    expect(typeof res.body.totalPages).toBe('number');
  });

  test('paginación con page=1&limit=2 devuelve máximo 2 resultados', async () => {
    const res = await request(app).get('/articles?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
  });

  test('page=2 devuelve resultados distintos a page=1', async () => {
    const page1 = await request(app).get('/articles?page=1&limit=2');
    const page2 = await request(app).get('/articles?page=2&limit=2');
    const ids1 = page1.body.data.map((a) => a._id);
    const ids2 = page2.body.data.map((a) => a._id);
    expect(ids1).not.toEqual(ids2);
  });
});

describe('GET /articles — filtro por tag', () => {
  test('filtra correctamente por tag', async () => {
    const res = await request(app).get('/articles?tag=nodejs');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((a) => a.tags.includes('nodejs'))).toBe(true);
  });

  test('no devuelve artículos sin el tag solicitado', async () => {
    const res = await request(app).get('/articles?tag=database');
    expect(res.status).toBe(200);
    expect(res.body.data.every((a) => a.tags.includes('database'))).toBe(true);
  });
});

describe('GET /articles — búsqueda con search', () => {
  test('busca en el título (case-insensitive)', async () => {
    const res = await request(app).get('/articles?search=express');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const match = res.body.data.some(
      (a) =>
        a.title.toLowerCase().includes('express') ||
        a.content.toLowerCase().includes('express')
    );
    expect(match).toBe(true);
  });

  test('busca en el contenido', async () => {
    const res = await request(app).get('/articles?search=Mongoose');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('la búsqueda es case-insensitive (mayúsculas = minúsculas)', async () => {
    const lower = await request(app).get('/articles?search=mongodb');
    const upper = await request(app).get('/articles?search=MONGODB');
    expect(lower.body.data.length).toBe(upper.body.data.length);
  });

  test('devuelve array vacío si no hay coincidencias', async () => {
    const res = await request(app).get('/articles?search=zzz-no-existe-zzz');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});
