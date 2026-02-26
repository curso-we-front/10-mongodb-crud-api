# 10 — API CRUD Completa con MongoDB y Mongoose

## Objetivo

Construir la API REST completa del blog usando Express + Mongoose, equivalente al ejercicio 05 pero con MongoDB.

## Tareas

### Tarea 1 — Conectar la app a MongoDB
Configura la conexión a Mongoose en `src/db/connection.js` y conéctala al arrancar el servidor.

### Tarea 2 — CRUD completo de artículos
Implementa los endpoints usando el modelo `Article` de Mongoose:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/articles` | Artículos publicados (con paginación y búsqueda) |
| GET | `/articles/:id` | Por id (usa `_id` de Mongo) |
| POST | `/articles` | Crea artículo |
| PUT | `/articles/:id` | Reemplaza artículo |
| PATCH | `/articles/:id` | Actualiza parcialmente |
| DELETE | `/articles/:id` | Elimina |

### Tarea 3 — Filtros y paginación
`GET /articles?tag=nodejs&search=express&page=1&limit=10`
- `tag`: filtra por tag
- `search`: busca en title y content con regex
- Paginación con metadatos igual que en el ejercicio 05

### Tarea 4 — Gestión de errores de Mongoose
Crea un middleware `mongooseErrorHandler` que convierta:
- `ValidationError` → 422 con los campos con error
- `CastError` (id inválido) → 400
- `MongoServerError` code 11000 (duplicado) → 409

## Estructura esperada

```
10-mongodb-crud-api/
├── src/
│   ├── controllers/
│   │   └── articles.js
│   ├── db/
│   │   └── connection.js
│   ├── models/
│   │   └── Article.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── mongooseErrorHandler.js  ← Tarea 4
│   ├── routes/
│   │   └── articles.js
│   └── app.js
├── tests/
│   ├── crud.test.js
│   └── filters.test.js
└── package.json
```

## Criterios de evaluación

- [ ] Los endpoints CRUD funcionan con MongoDB
- [ ] IDs inválidos devuelven 400 (no 500)
- [ ] La búsqueda con regex es case-insensitive
- [ ] La paginación incluye metadatos
- [ ] Los tests pasan
