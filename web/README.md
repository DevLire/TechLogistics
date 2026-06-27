# Techlogistics - Panel Administrativo Web

Aplicación web tipo **SPA (Single Page Application)** desarrollada con **React**, **Vite** y **Tailwind CSS**, diseñada para la supervisión analítica de accesos, auditoría de inventarios y control centralizado de los dispositivos autorizados en el ecosistema.

---

# Estructura del Proyecto

La aplicación organiza su código fuente dentro del directorio `src` bajo la siguiente distribución modular:

```text
src/
├── actions/        # Funciones encargadas de despachar eventos o mutaciones de estado.
├── api/            # Configuración de clientes HTTP y llamadas a endpoints del backend.
├── components/     # Componentes de interfaz de usuario reutilizables y atómicos.
├── constants/      # Variables de entorno internas, rutas y valores estáticos.
├── infrastructure/ # Adaptadores e interfaces de acceso a datos.
├── pages/          # Vistas principales asociadas al enrutamiento.
├── stores/         # Gestión del estado global, incluyendo autenticación.
└── app.router.tsx  # Configuración de rutas de la aplicación.
```

---

# Características Principales

## Control de Acceso Basado en Roles (RBAC)

* Protección integral de las vistas mediante **Route Guards** síncronos.
* Evaluación de permisos según el perfil autenticado.
* Roles soportados:

  * Administrador
  * Supervisor
  * Operario

## Terminal POS Logístico

Módulo de despacho de inventario con validación reactiva en tiempo real.

Características:

* Validación inmediata del stock disponible.
* Bloqueo automático de la interfaz cuando la cantidad solicitada supera el inventario disponible.

## Control Centralizado de Accesos y Dispositivos

Panel administrativo para la gestión de:

* Terminales autorizados.
* Permisos de enrolamiento móvil.
* Métodos de autenticación.
* Operaciones CRUD sobre tablas maestras del negocio.

---

# Flujo de Autorización de Dispositivos Móviles

El proceso de vinculación de dispositivos móviles sigue un flujo controlado por reglas de negocio.

## Módulo de Dispositivos

Permite:

* Consultar todos los dispositivos registrados.
* Filtrar dispositivos:

  * Todos
  * Activos
  * Inactivos

## Restricción de Registro

El panel web **no permite registrar dispositivos nuevos**.

El alta inicial únicamente puede realizarse desde la aplicación móvil.

Desde la interfaz web únicamente es posible desactivar dispositivos previamente registrados.

## Configuración Remota por Usuario

Cada usuario dispone de dos indicadores de configuración.

### `puede_registrar_dispositivo`

Habilita temporalmente el registro de un nuevo dispositivo móvil.

Una vez completado correctamente el proceso desde la aplicación móvil, el backend cambia automáticamente este valor a `false`.

### `permite_fallback_password`

Permite registrar el dispositivo utilizando contraseña cuando también se encuentre activo `puede_registrar_dispositivo`.

Después del enrolamiento, el usuario podrá autenticarse mediante:

* Huella dactilar.
* Contraseña.

El backend registra de forma auditable el método de autenticación utilizado en cada acceso.

---

# Desarrollo Local

## 1. Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.template .env
```

Configurar la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 2. Instalar dependencias

```bash
pnpm install
```

---

## 3. Scripts Disponibles

### Servidor de desarrollo

Inicia Vite en modo desarrollo.

```bash
pnpm run dev
```

### Compilación para producción

Valida TypeScript y genera la versión optimizada dentro del directorio `dist`.

```bash
pnpm run build
```

### Análisis estático del código

Ejecuta ESLint sobre el proyecto.

```bash
pnpm run lint
```

### Previsualización del build

Levanta un servidor local utilizando la compilación generada.

```bash
pnpm run preview
```
