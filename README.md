# TechLogistics - Ecosistema de Gestión Logística y Biometría

Plataforma **full-stack** diseñada para la gestión de inventarios y el control seguro de accesos a instalaciones mediante **hardware binding** y autenticación biométrica nativa.

El proyecto está organizado como un **monorepo administrado con pnpm**, que centraliza el backend, panel administrativo, aplicación móvil y paquetes de código compartido.

---

# Estructura del Monorepo

```text
.
├── app/                  # Aplicación móvil (Expo, React Native)
├── backend/              # API REST (Node.js, Prisma, PostgreSQL)
├── web/                  # Panel administrativo (React, Vite)
├── packages/
│   └── shared/           # Código compartido entre proyectos
├── package.json          # Scripts y configuración del workspace
├── pnpm-workspace.yaml   # Configuración del monorepo
└── pnpm-lock.yaml        # Lockfile global del workspace
```

## Proyectos

### [Backend](./backend)

API RESTful estructurada en capas de **Dominio, Aplicación, Infraestructura y Presentación**.

Es responsable de:

* Lógica de negocio.
* Autenticación y autorización.
* Control de acceso basado en roles.
* Persistencia de datos mediante Prisma y PostgreSQL.
* Comunicación en tiempo real mediante Socket.IO.
* Gestión y vinculación de dispositivos.
* Auditoría de operaciones relevantes.

Consulta la [guía de configuración del Backend](./backend/README.md).

### [App Móvil](./app)

Aplicación móvil desarrollada con **Expo y React Native**, orientada a la autenticación biométrica, almacenamiento seguro y validación por hardware de los operarios.

Incluye:

* Autenticación biométrica nativa.
* Hardware binding de dispositivos.
* Almacenamiento seguro de credenciales.
* Control de sesiones.
* Comunicación en tiempo real mediante Socket.IO.
* Funcionalidades orientadas al control de asistencia y accesos.

Consulta la [guía de configuración de la App Móvil](./app/README.md).

### [Panel Web](./web)

Dashboard administrativo desarrollado con **React y Vite**.

Permite:

* Gestión de usuarios y roles.
* Gestión de dispositivos.
* Control de permisos.
* Administración de inventarios.
* Supervisión de operaciones.

Consulta la [guía de configuración del Panel Web](./web/README.md).

### [Shared](./packages/shared)

Paquete interno del workspace que contiene código reutilizable entre los diferentes proyectos del monorepo.

Se utiliza principalmente para mantener contratos y lógica compartida sin duplicación entre aplicaciones.

---

# Arquitectura y Características Core

## Control de Acceso basado en Roles

El sistema implementa **RBAC (Role-Based Access Control)** con tres niveles principales:

* **Administrador**
* **Supervisor**
* **Operario**

La autorización se aplica en el backend mediante middlewares y en los clientes mediante mecanismos de protección de rutas y permisos.

## Hardware Binding + Biometría

Los dispositivos móviles pueden vincularse de forma segura a un usuario.

El sistema combina:

* Identificación única del dispositivo.
* Almacenamiento seguro de credenciales.
* Autenticación biométrica nativa.
* Validación de dispositivo desde el backend.

Esto permite restringir el acceso a usuarios y dispositivos autorizados.

## Comunicación en Tiempo Real

El sistema utiliza **Socket.IO** para propagar eventos importantes entre backend y clientes.

Entre otros casos:

* Cambios en permisos de registro de dispositivos.
* Deshabilitación de usuarios.
* Cambios que requieren una reacción inmediata de los dispositivos conectados.

La arquitectura utiliza conexiones autenticadas y rooms asociadas a usuarios y dispositivos.

## Auditoría

Las operaciones relevantes del sistema quedan registradas para mantener trazabilidad sobre los accesos y acciones realizadas.

La auditoría permite identificar, entre otros datos, el método de autenticación utilizado.

## Persistencia

El backend utiliza **PostgreSQL** como base de datos y **Prisma ORM** como capa de acceso.

Se utiliza **Soft Delete** en determinadas entidades para preservar la integridad histórica de los registros y evitar conflictos con restricciones `UNIQUE`.

---

# Requisitos

Para trabajar con el monorepo se requiere:

* **Node.js**
* **pnpm**
* **PostgreSQL**

Para el desarrollo de la aplicación móvil:

* **Expo**
* **Android Studio** para desarrollo y emulación Android

---

# Instalación

Clona el repositorio y entra en su directorio raíz.

Desde la raíz del monorepo instala todas las dependencias:

```bash
pnpm install
```

Esto instala las dependencias de los proyectos y paquetes incluidos en el workspace.

> Las configuraciones específicas de cada proyecto, como variables de entorno, base de datos o configuración de Expo, se encuentran en sus respectivos README.

---

# Desarrollo

Los principales servicios pueden ejecutarse desde la raíz mediante los scripts del workspace.

## Backend

```bash
pnpm dev:backend
```

## Panel Web

```bash
pnpm dev:web
```

## Aplicación Móvil

```bash
pnpm dev:app
```

Para conocer los requisitos específicos de cada servicio:

* [Backend](./backend/README.md)
* [App Móvil](./app/README.md)
* [Panel Web](./web/README.md)

---

# Build

## Backend

El build del backend también construye primero el paquete compartido:

```bash
pnpm build:backend
```

Internamente se ejecutan los procesos necesarios para generar el código compartido, generar el cliente de Prisma y compilar el backend.

## Panel Web

```bash
pnpm build:web
```

---

# Producción

## Backend

Para iniciar el backend compilado:

```bash
pnpm start:backend
```

El proceso utiliza el código generado en `backend/dist`.

Las migraciones de Prisma se gestionan durante el proceso de build del backend.

---

# Scripts principales

| Comando              | Descripción                            |
| -------------------- | -------------------------------------- |
| `pnpm install`       | Instala las dependencias del workspace |
| `pnpm dev:backend`   | Inicia el backend en desarrollo        |
| `pnpm dev:web`       | Inicia el panel web en desarrollo      |
| `pnpm dev:app`       | Inicia la aplicación móvil             |
| `pnpm build:backend` | Construye shared y backend             |
| `pnpm build:web`     | Construye el panel web                 |
| `pnpm start:backend` | Inicia el backend compilado            |
| `pnpm preview:web`   | Previsualiza el build del panel web    |

---

# Despliegue

El repositorio está preparado para desplegar sus diferentes aplicaciones de forma independiente.

El **backend** puede desplegarse como un servicio Node.js utilizando los scripts del workspace:

```bash
pnpm build:backend
```

```bash
pnpm start:backend
```

El **panel web** puede desplegarse como una aplicación utilizando:

```bash
pnpm build:web
```

La configuración específica de cada plataforma de despliegue y las variables de entorno deben mantenerse en la configuración correspondiente del servicio.

---