# Techlogistics - Backend API

API RESTful desarrollada con **Node.js** y **TypeScript**, encargada de la lógica de negocio, autenticación, autorización y persistencia de datos del ecosistema Techlogistics.

---

## Arquitectura y Tecnologías

- **Arquitectura en Capas:** Estructura organizada en Dominio, Aplicación, Infraestructura y Presentación.
- **ORM y Base de Datos:** Persistencia sobre PostgreSQL utilizando Prisma ORM.
- **Seguridad:** Autenticación basada en JWT y control de acceso mediante middlewares RBAC.
- **Validación:** Implementación del patrón DTO mediante tuplas estáticas (`[error?, dto?]`) para validar entradas.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- Node.js
- pnpm
- Docker
- Docker Compose

---

## Guía de Desarrollo Local

Sigue estos pasos para configurar y ejecutar el servidor en tu entorno local.

### 1. Configurar variables de entorno

Copia el archivo de plantilla y completa las variables necesarias (puerto, credenciales de la base de datos, secretos JWT, etc).

```bash
cp .env.template .env
```

### 2. Levantar la base de datos

Inicializa el contenedor de PostgreSQL utilizando Docker.

```bash
docker compose up -d
```

### 3. Instalar dependencias

Instala todas las dependencias del proyecto.

```bash
pnpm install
```

### 4. Ejecutar migraciones

Crea las tablas y aplica el esquema inicial en la base de datos.

```bash
pnpm exec prisma migrate dev
```

> **Nota:** Si es la primera vez que ejecutas este comando, Prisma solicitará un nombre para la migración.

### 5. Generar Prisma Client

Genera el cliente de Prisma para habilitar el tipado y autocompletado de los modelos en TypeScript.

```bash
pnpm exec prisma generate
```

### 6. Iniciar el servidor

Ejecuta la aplicación en modo desarrollo con recarga automática.

```bash
pnpm run dev
```

---

## Estructura del Proyecto

```text
backend/
├── prisma/               # Esquema de Prisma y migraciones 
├── src/
│   ├── app.ts            # Punto de entrada del servidor 
│   ├── config/           # Variables de entorno y adaptadores 
│   ├── data/             # Configuración de base de datos (PostgreSQL) 
│   ├── domain/           # Estructura de DTOs
│   ├── middlewares/      # Control de autenticación y roles 
│   └── presentation/     # Controladores y rutas modulares 
├── docker-compose.yml
└── package.json
```

---

## Características

- Arquitectura limpia basada en capas.
- Autenticación mediante JWT.
- Control de acceso basado en roles (RBAC).
- Validación de DTOs mediante tuplas estáticas.
- Persistencia con Prisma ORM y PostgreSQL.
- Tipado estricto utilizando TypeScript.
- Preparado para ejecutarse mediante Docker.

---

## Licencia

Proyecto desarrollado con fines académicos y de investigación para la gestión logística segura mediante autenticación biométrica y control de dispositivos.