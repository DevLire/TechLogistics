# TechLogistics - Backend API

Backend del ecosistema **TechLogistics**, desarrollado con **Node.js y TypeScript**, responsable de la lógica de negocio, autenticación, autorización, persistencia de datos y comunicación en tiempo real con los clientes del sistema.

El backend expone una **API RESTful** para las operaciones del sistema y utiliza **Socket.IO** para transmitir eventos que requieren actualizaciones inmediatas en los dispositivos conectados.

---

# Arquitectura

El backend está organizado siguiendo una arquitectura por capas, separando las responsabilidades de dominio, infraestructura y presentación.

```text id="8v4kqj"
backend/
├── generated/           # Cliente Prisma generado
├── prisma/              # Schema y migraciones de Prisma
├── postgres/            # Recursos relacionados con PostgreSQL
└── src/
    ├── config/          # Configuración y adaptadores
    ├── data/            # Persistencia y acceso a PostgreSQL
    ├── domain/          # DTOs y estructuras del dominio
    ├── infrastructure/  # Integraciones externas y tiempo real
    ├── middlewares/     # Autenticación y autorización HTTP
    └── presentation/    # Controladores, rutas y servidor
```

La comunicación con los clientes se divide en dos mecanismos:

```text id="0r6y1s"
                         ┌──────────────────────┐
                         │       Backend        │
                         │ Node.js + TypeScript │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                 REST API                        Socket.IO
                    │                               │
                    ▼                               ▼
             Operaciones HTTP              Eventos en tiempo real
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │      Clientes       │
                         │  Web / Mobile App   │
                         └─────────────────────┘
```

---

# Tecnologías

* **Node.js**
* **TypeScript**
* **Express**
* **PostgreSQL**
* **Prisma ORM**
* **Socket.IO**
* **JWT**
* **bcrypt**
* **Docker / Docker Compose**
* **pnpm**

---

# Persistencia

El backend utiliza **PostgreSQL** como sistema de gestión de base de datos y **Prisma ORM** como capa de acceso.

Prisma se encarga de:

* Definición del esquema de datos.
* Migraciones.
* Generación del cliente tipado.
* Acceso a los modelos desde TypeScript.

El cliente generado se encuentra dentro de:

```text id="3v8h1a"
backend/generated/prisma/
```

Las migraciones se almacenan en:

```text id="0tj7y6"
backend/prisma/migrations/
```

---

# Autenticación y Autorización

## JWT

La autenticación HTTP utiliza **JSON Web Tokens (JWT)** para mantener la identidad del usuario durante las solicitudes protegidas.

El backend valida el token mediante middleware antes de permitir el acceso a los recursos correspondientes.

## RBAC

El sistema implementa **Role-Based Access Control (RBAC)**.

Los permisos se determinan según el rol del usuario y se aplican mediante middleware de autorización.

Los roles principales del sistema son:

* Administrador
* Supervisor
* Operario

---

# Comunicación en Tiempo Real

El backend utiliza **Socket.IO** para comunicar cambios críticos de seguridad a los clientes conectados.

La infraestructura de tiempo real se encuentra en:

```text id="rr5zj6"
src/infrastructure/realtime/
├── core/
├── middleware/
└── types/
```

Las conexiones Socket.IO utilizan autenticación para identificar al usuario y al dispositivo conectado.

## Rooms

Las conexiones autenticadas pueden asociarse a rooms relacionadas con la identidad del usuario y del dispositivo.

Esto permite emitir eventos de manera selectiva sin enviar información innecesaria a otros clientes conectados.

## Eventos de seguridad

Entre los eventos gestionados actualmente se encuentran:

* Cambios en el permiso para registrar dispositivos.
* Deshabilitación de usuarios.
* Cambios de estado que requieren una reacción inmediata de los dispositivos conectados.

Por ejemplo, cuando un administrador modifica el permiso de registro de dispositivos de un usuario, el backend puede emitir el cambio inmediatamente al cliente móvil correspondiente.

---

# Estructura del Proyecto

```text id="1u6knb"
backend/
├── generated/
│   └── prisma/                 # Cliente Prisma generado
│
├── postgres/                   # Recursos de PostgreSQL
│
├── prisma/
│   ├── migrations/             # Migraciones de base de datos
│   ├── schema.prisma           # Modelo de datos
│   └── prisma.config.ts        # Configuración de Prisma
│
└── src/
    ├── config/
    │   ├── bcrypt.adapter.ts   # Adaptador de bcrypt
    │   ├── envs.ts             # Variables de entorno
    │   └── jwt.adapter.ts      # Adaptador JWT
    │
    ├── data/
    │   └── posgres/
    │       └── index.ts        # Configuración de PostgreSQL
    │
    ├── domain/
    │   └── dtos/               # DTOs organizados por dominio
    │       ├── accesos_biometricos/
    │       ├── auth/
    │       ├── categorias/
    │       ├── dispositivos/
    │       ├── movimientos/
    │       ├── movimientos_ingresos/
    │       ├── movimientos_salidas/
    │       ├── productos/
    │       ├── proveedores/
    │       ├── usuarios/
    │       └── ventas/
    │
    ├── infrastructure/
    │   └── realtime/
    │       ├── core/            # Servidor Socket.IO
    │       ├── middleware/      # Autenticación Socket.IO
    │       └── types/           # Tipos de tiempo real
    │
    ├── middlewares/
    │   ├── auth.middleware.ts   # Autenticación HTTP
    │   └── role.middleware.ts   # Autorización RBAC
    │
    ├── presentation/
    │   ├── accesos_biometricos/
    │   ├── auth/
    │   ├── categorias/
    │   ├── dispositivos/
    │   ├── movimientos/
    │   ├── movimientos_ingresos/
    │   ├── movimientos_salidas/
    │   ├── productos/
    │   ├── proveedores/
    │   ├── seed/
    │   ├── usuarios/
    │   ├── utils/
    │   │   └── formatErrors.ts
    │   ├── routes.ts
    │   └── server.ts
    │
    └── app.ts
```

---

# Requisitos Previos

Para desarrollar el backend localmente necesitas:

* **Node.js**
* **pnpm**
* **Docker**
* **Docker Compose**
* **PostgreSQL** mediante el entorno Docker del proyecto

---

# Desarrollo Local

## 1. Variables de entorno

Copia el archivo de plantilla:

```bash id="9f4b1v"
cp .env.template .env
```

Completa las variables necesarias, incluyendo:

* Puerto del servidor.
* URL de conexión a PostgreSQL.
* Secretos utilizados para JWT.
* Configuración necesaria para el entorno.

---

## 2. Levantar PostgreSQL

Inicia el contenedor de PostgreSQL:

```bash id="4u3y2c"
docker compose up -d
```

Comprueba que el contenedor se encuentre ejecutándose antes de continuar.

---

## 3. Instalar dependencias

Si estás trabajando directamente dentro de `backend`:

```bash id="x8n9rq"
pnpm install
```

Al tratarse de un workspace pnpm, también puedes instalar las dependencias desde la raíz del monorepo:

```bash id="6n3v7d"
pnpm install
```

---

## 4. Ejecutar migraciones

Durante el desarrollo local utiliza:

```bash id="0m4b7n"
pnpm exec prisma migrate dev
```

Este comando aplica las migraciones pendientes y permite crear nuevas migraciones cuando se modifica el esquema.

---

## 5. Generar Prisma Client

Genera el cliente de Prisma:

```bash id="8w9d2x"
pnpm exec prisma generate
```

El cliente será generado en:

```text id="4x4u8w"
generated/prisma/
```

---

## 6. Iniciar el servidor

Desde `backend`:

```bash id="3f4t2k"
pnpm dev
```

O desde la raíz del monorepo:

```bash id="7b2n5c"
pnpm dev:backend
```

El servidor se ejecutará en el puerto configurado mediante las variables de entorno.

---

# Build

El backend puede construirse desde la raíz del monorepo:

```bash id="k6w0xj"
pnpm build:backend
```

Este comando ejecuta el proceso de build del paquete compartido y posteriormente del backend.

El build del backend incluye:

1. Limpieza del directorio `dist`.
2. Generación de Prisma Client.
3. Compilación de TypeScript.
4. Aplicación de migraciones mediante `prisma migrate deploy`.

El código compilado se genera en:

```text id="n3k4bp"
backend/dist/
```

---

# Producción

Una vez construido el backend, puede iniciarse mediante:

```bash id="8d1m6a"
pnpm start:backend
```

Este comando ejecuta:

```bash id="w9h2r7"
node dist/app.js
```

Las migraciones de producción se ejecutan mediante `prisma migrate deploy` durante el proceso de build.

---

# Scripts

Desde la raíz del monorepo:

| Comando              | Descripción                          |
| -------------------- | ------------------------------------ |
| `pnpm dev:backend`   | Inicia el backend en modo desarrollo |
| `pnpm build:backend` | Construye shared y backend           |
| `pnpm start:backend` | Inicia el backend compilado          |

Desde `backend`:

| Comando                    | Descripción                               |
| -------------------------- | ----------------------------------------- |
| `pnpm dev`                 | Inicia el servidor con recarga automática |
| `pnpm build`               | Genera Prisma Client y compila el backend |
| `pnpm start`               | Ejecuta el backend compilado              |
| `pnpm prisma:migrate:prod` | Aplica migraciones de producción          |
| `pnpm format`              | Formatea el código con Prettier           |
| `pnpm format:check`        | Comprueba el formato del código           |

---

# Relación con otros proyectos

El backend constituye el núcleo de servicios de TechLogistics y es consumido principalmente por la aplicación móvil y el panel web.

Para consultar la documentación de los clientes:

* [Aplicación Móvil](../app/README.md)
* [Panel Web](../web/README.md)

---