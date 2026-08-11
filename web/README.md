# TechLogistics - Panel Administrativo Web

Aplicación web tipo **SPA (Single Page Application)** desarrollada con **React**, **Vite** y **Tailwind CSS**, diseñada para la supervisión analítica de accesos, auditoría de inventarios y control centralizado de los dispositivos autorizados en el ecosistema TechLogistics.

La aplicación forma parte del **monorepo administrado con pnpm** y se comunica con el backend mediante la API REST.

---

# Estructura del Proyecto

La aplicación organiza su código fuente dentro del directorio `src` bajo una estructura modular:

```text id="8s7f2c"
src/
├── actions/        # Acciones y operaciones de la aplicación.
├── api/            # Clientes HTTP y comunicación con el backend.
├── components/     # Componentes de interfaz reutilizables.
├── constants/      # Rutas, constantes y valores estáticos.
├── infrastructure/ # Adaptadores e interfaces de acceso a datos.
├── pages/          # Vistas principales de la aplicación.
├── stores/         # Estado global, incluyendo autenticación.
└── app.router.tsx  # Configuración de rutas.
```

---

# Características Principales

## Control de Acceso Basado en Roles (RBAC)

El panel implementa control de acceso según el rol del usuario autenticado.

Incluye:

* Protección de vistas mediante **Route Guards**.
* Evaluación de permisos según el perfil autenticado.
* Roles soportados:

  * Administrador
  * Supervisor
  * Operario

---

## Terminal POS Logístico

Módulo destinado al despacho de inventario mediante una interfaz orientada a operaciones rápidas.

Incluye:

* Validación del stock disponible.
* Validación reactiva de las cantidades solicitadas.
* Bloqueo de operaciones cuando la cantidad solicitada supera el inventario disponible.

---

## Gestión de Accesos y Dispositivos

El panel administrativo permite gestionar centralizadamente los recursos del sistema.

Entre sus funciones se encuentran:

* Consulta y administración de dispositivos registrados.
* Gestión de permisos de enrolamiento móvil.
* Configuración de métodos de autenticación.
* Gestión de usuarios y roles.
* Operaciones CRUD sobre las entidades administrativas del sistema.

---

# Flujo de Autorización de Dispositivos Móviles

El proceso de vinculación de dispositivos está controlado por reglas de negocio implementadas en el backend.

## Módulo de Dispositivos

Permite consultar los dispositivos registrados y filtrarlos por estado:

* Todos
* Activos
* Inactivos

El panel web **no registra directamente nuevos dispositivos**.

El enrolamiento inicial se realiza desde la aplicación móvil y posteriormente el dispositivo queda disponible para su administración desde el panel.

Desde la interfaz web se pueden desactivar dispositivos previamente registrados.

---

## Configuración Remota por Usuario

El panel permite modificar determinados parámetros de seguridad asociados a cada usuario.

### `puede_registrar_dispositivo`

Permite autorizar temporalmente al usuario para registrar un nuevo dispositivo móvil.

Una vez completado correctamente el proceso de enrolamiento, el backend establece automáticamente este valor en `false`.

### `permite_fallback_password`

Permite utilizar la contraseña como mecanismo alternativo de autenticación cuando el registro del dispositivo se encuentra habilitado.

Una vez registrado el dispositivo, el usuario puede autenticarse utilizando los mecanismos habilitados por el sistema.

El backend registra de forma auditable el método de autenticación utilizado durante cada acceso.

---

# Comunicación con el Backend

El panel web utiliza la **API REST del backend** para realizar operaciones de consulta y modificación de datos.

Actualmente, la comunicación del panel se realiza mediante HTTP/REST.

La implementación de comunicación en tiempo real mediante Socket.IO se encuentra actualmente en la aplicación móvil y el backend.

---

# Desarrollo Local

## 1. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash id="o2x9fk"
cp .env.template .env
```

Configura la URL del backend:

```env id="s7y4ph"
VITE_API_URL=http://localhost:3000/api
```

---

## 2. Instalar dependencias

Si trabajas directamente dentro del directorio `web`:

```bash id="4x0j8d"
pnpm install
```

Al formar parte del monorepo, también puedes instalar las dependencias desde la raíz:

```bash id="p3c6yr"
pnpm install
```

---

## 3. Ejecutar el proyecto

### Desde `web`

Inicia Vite en modo desarrollo:

```bash id="0f7x4k"
pnpm dev
```

### Desde la raíz del monorepo

También puedes iniciar el panel mediante el script del workspace:

```bash id="2v9m1n"
pnpm dev:web
```

---

# Scripts Disponibles

## Servidor de desarrollo

Inicia Vite en modo desarrollo.

```bash id="9f3q7m"
pnpm dev
```

## Compilación para producción

Valida TypeScript y genera la versión optimizada dentro del directorio `dist`.

```bash id="7r5k2a"
pnpm build
```

Desde la raíz del monorepo también puede ejecutarse mediante:

```bash id="1c8n4v"
pnpm build:web
```

## Análisis estático del código

Ejecuta ESLint sobre el proyecto:

```bash id="6m2x9p"
pnpm lint
```

## Previsualización del build

Levanta un servidor local utilizando la compilación generada:

```bash id="3q7w5k"
pnpm preview
```

Desde la raíz del monorepo:

```bash id="8h4d1s"
pnpm preview:web
```

---

# Tecnologías

* React
* Vite
* TypeScript
* Tailwind CSS
* Axios
* Zustand
* React Router
* TanStack Query

---

# Relación con otros proyectos

El panel web consume los servicios proporcionados por el backend de TechLogistics.

Para consultar la documentación del resto del ecosistema:

* [Backend](../backend/README.md)
* [Aplicación Móvil](../app/README.md)
* [Documentación del Monorepo](../README.md)

---

# Licencia

Proyecto desarrollado con fines académicos y de investigación para la gestión logística segura mediante autenticación biométrica y control de dispositivos.
