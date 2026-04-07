const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// ─── POST /articles ───────────────────────────────────────────────────────────

describe('POST /articles', () => {
  test('crea un artículo y devuelve 201', async () => {
    const res = await request(app).post('/articles').send({
      title: 'Test Article',
      content: 'Test content',
      author: 'Test Author',
      published: true,
      tags: ['nodejs'],
    });
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe('Test Article');
  });

  test('devuelve 422 si faltan campos requeridos', async () => {
    const res = await request(app).post('/articles').send({ content: 'Sin título' });
    expect(res.status).toBe(422);
    expect(res.body.fields).toBeDefined();
  });
});

// ─── GET /articles/:id ────────────────────────────────────────────────────────

describe('GET /articles/:id', () => {
  let articleId;

  beforeEach(async () => {
    const res = await request(app).post('/articles').send({
      title: 'Article for GET',
      content: 'Content',
      author: 'Author',
      published: true,
    });
    articleId = res.body._id;
  });

  test('devuelve el artículo por id', async () => {
    const res = await request(app).get(`/articles/${articleId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(articleId);
  });

  test('devuelve 400 con un id con formato inválido', async () => {
    const res = await request(app).get('/articles/id-invalido');
    expect(res.status).toBe(400);
  });

  test('devuelve 404 si el id es válido pero no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/articles/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

// ─── PUT /articles/:id ────────────────────────────────────────────────────────

describe('PUT /articles/:id', () => {
  let articleId;

  beforeEach(async () => {
    const res = await request(app).post('/articles').send({
      title: 'Original',
      content: 'Original content',
      author: 'Author',
      published: true,
    });
    articleId = res.body._id;
  });

  test('reemplaza el artículo completo', async () => {
    const res = await request(app).put(`/articles/${articleId}`).send({
      title: 'Reemplazado',
      content: 'Nuevo contenido',
      author: 'Nuevo Autor',
      published: false,
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Reemplazado');
    expect(res.body.author).toBe('Nuevo Autor');
    expect(res.body.published).toBe(false);
  });

  test('devuelve 400 con id inválido', async () => {
    const res = await request(app).put('/articles/bad-id').send({
      title: 'T',
      content: 'C',
      author: 'A',
    });
    expect(res.status).toBe(400);
  });

  test('devuelve 404 si el artículo no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/articles/${fakeId}`).send({
      title: 'T',
      content: 'C',
      author: 'A',
    });
    expect(res.status).toBe(404);
  });
});

// ─── PATCH /articles/:id ──────────────────────────────────────────────────────

describe('PATCH /articles/:id', () => {
  let articleId;

  beforeEach(async () => {
    const res = await request(app).post('/articles').send({
      title: 'Original',
      content: 'Original content',
      author: 'Author',
      published: true,
    });
    articleId = res.body._id;
  });

  test('actualiza solo los campos enviados', async () => {
    const res = await request(app)
      .patch(`/articles/${articleId}`)
      .send({ title: 'Solo el título cambia' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Solo el título cambia');
    expect(res.body.content).toBe('Original content');
  });

  test('devuelve 400 con id inválido', async () => {
    const res = await request(app).patch('/articles/not-an-id').send({ title: 'X' });
    expect(res.status).toBe(400);
  });
});

// ─── DELETE /articles/:id ─────────────────────────────────────────────────────

describe('DELETE /articles/:id', () => {
  test('elimina el artículo y devuelve 204', async () => {
    const post = await request(app).post('/articles').send({
      title: 'To delete',
      content: 'Content',
      author: 'Author',
    });
    const id = post.body._id;

    const del = await request(app).delete(`/articles/${id}`);
    expect(del.status).toBe(204);

    const check = await request(app).get(`/articles/${id}`);
    expect(check.status).toBe(404);
  });

  test('devuelve 400 con id inválido', async () => {
    const res = await request(app).delete('/articles/not-an-id');
    expect(res.status).toBe(400);
  });

  test('devuelve 404 si el artículo no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/articles/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
