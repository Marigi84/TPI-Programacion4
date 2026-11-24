# Food Store — Trabajo Práctico Integrador

**Alumna:** Marina Giselle Cordero · Programación 4 · UTN

Aplicación para comprar comidas: catálogo público, carrito, registro e inicio de sesión, pedidos y administración de productos, categorías, usuarios y stock.

## Requisitos

- Python 3.11 a 3.13, pip y entorno virtual.
- Node.js 20.19 o superior y pnpm 9 o superior.
- PostgreSQL 15 o superior para la entrega; para desarrollo local se puede usar SQLite cambiando `DATABASE_URL`.

## Backend

Desde `backend/`:

```bash
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
```

**Crear la base de datos.** Con PostgreSQL instalado y corriendo, crear una base vacía llamada `foodstore_db`, de una de estas dos formas:

- **Desde la terminal:** `psql -U postgres -c "CREATE DATABASE foodstore_db;"` (pide la contraseña del usuario `postgres`).
- **Desde pgAdmin:** clic derecho en *Databases* → *Create* → *Database…*, nombre `foodstore_db` → *Save*.

No hace falta crear las tablas: las cinco tablas las crea `python -m app.db.seed` (y también el backend al iniciar).

**Configurar `backend/.env`.** En `DATABASE_URL`, reemplazar `TU_CONTRASENA` por la contraseña local del usuario `postgres` y cambiar también `SECRET_KEY` por una clave propia de al menos 32 caracteres. Si la contraseña contiene caracteres reservados de URL (como `@`, `:`, `/` o `#`), codificarlos en formato URL. En Windows PowerShell se copia el ejemplo con `Copy-Item .env.example .env`.

Después, desde `backend/` y con el entorno virtual activado:

```bash
python -m app.db.seed
uvicorn app.main:app --reload
```

La API queda en `http://localhost:8000/api/v1`; documentación en `http://localhost:8000/docs` y `/redoc`.

El seed es idempotente: crea el administrador **admin / Admin1234!**, tres categorías y ocho productos con stock. Ejecutarlo de nuevo no duplica esos registros. La contraseña inicial es solo para desarrollo y demostración.

### Variables de `backend/.env`

| Variable | Función | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql+psycopg2://postgres:TU_CONTRASENA@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Firma del JWT, al menos 32 caracteres | Reemplazar el valor de ejemplo por una clave propia |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token y la cookie | `30` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |
| `COOKIE_SECURE` | Cookie solo HTTPS; en localhost usar `false` | `false` |

El JWT se entrega en la cookie HttpOnly `access_token`, nunca en el cuerpo del login ni en el almacenamiento del navegador. El registro público asigna rol `user`.

## Frontend

Desde `frontend/`, en otra terminal:

```bash
pnpm install
cp .env.example .env
pnpm build
pnpm dev
```

En Windows, usar `Copy-Item .env.example .env`. Abrir `http://localhost:5173`. `VITE_API_URL` en `frontend/.env` debe apuntar a `http://localhost:8000/api/v1`. Primero iniciar el backend y ejecutar el seed.

## Estructura del proyecto

```
backend/app/
├── main.py                 FastAPI, CORS con credenciales y routers bajo /api/v1
├── core/                   config, database, security, deps, unit_of_work, base_repository
├── db/                     models.py (registro de las 5 tablas) y seed.py
└── modules/
    ├── auth/               router, service, schemas (usa el modelo Usuario)
    ├── usuarios/           models, schemas, repository, unit_of_work, service, router
    ├── categorias/         misma cadena de archivos
    ├── productos/          misma cadena de archivos
    └── pedidos/            misma cadena; reglas RN-01 a RN-06 y máquina de estados

frontend/src/
├── shared/                 api (axios, handleApiError, queryClient), ui, components, layout
├── features/               auth, usuarios, categorias, productos, pedidos
│   └── <feature>/          api, hooks, types, components, pages
├── store/                  authStore y cartStore (Zustand + persist)
├── routes/                 AppRouter y ProtectedRoute
└── App.tsx                 checkSession al montar y AppRouter
```

En cada módulo del backend, el Router obtiene el Service con `Depends`, el Service abre `with self.uow as uow:` y devuelve el schema de salida, y el commit o rollback ocurre en el `__exit__` del Unit of Work.

## Recorrido de demostración

1. Abrir el catálogo sin sesión, buscar y filtrar productos.
2. Registrar un cliente e iniciar sesión con su `username` y contraseña.
3. Agregar productos al carrito y confirmar un pedido con dirección y forma de pago.
4. Consultar el pedido en **Mis pedidos** y cancelar uno pendiente.
5. Ingresar como `admin`, revisar resumen, categorías, productos, usuarios y pedidos; comprobar que el stock se restituyó.

## Repositorio público y video

- **Repositorio público de GitHub:** PENDIENTE_DE_URL_REAL
- **Video público (10 a 15 minutos):** PENDIENTE_DE_URL_REAL

Antes de entregar, reemplazar los dos marcadores por enlaces públicos comprobados. El video debe mostrar a la alumna con cámara encendida al inicio, registro, compra, gestión de admin y cancelación con restitución de stock. El video se comparte por enlace; no se incluye un `.mp4` en este ZIP.
