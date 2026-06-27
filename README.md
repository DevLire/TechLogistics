# Techlogistics - Ecosistema de Gestión Logística y Biometría

Plataforma **full-stack** diseñada para la gestión de inventarios y el control seguro de accesos a instalaciones mediante **hardware binding** y autenticación biométrica nativa.

---

# Estructura del Monorepo

Este proyecto está gestionado como un **monorepo**.

```text
.
├── backend/   # API REST (Node.js, Prisma, PostgreSQL)
├── app/       # Aplicación móvil (Expo, React Native)
└── web/       # Panel administrativo (React, Vite)
```

## Proyectos

- **[backend/](./backend)**  
  API RESTful estructurada en capas (Dominio, Aplicación, Infraestructura y Presentación), responsable de la lógica de negocio, autenticación, autorización y persistencia.

- **[app/](./app)**  
  Aplicación móvil nativa enfocada en la autenticación biométrica, almacenamiento seguro y validación por hardware de los operarios.

- **[web/](./web)**  
  Dashboard administrativo y terminal POS para la gestión remota de dispositivos, control RBAC y supervisión analítica.

---

# Arquitectura y Características Core

- **Control de Acceso basado en Roles (RBAC):** Jerarquía de tres niveles (Administrador, Supervisor y Operario) protegida mediante middlewares en el backend y *Route Guards* síncronos en el frontend.

- **Hardware Binding + Biometría:** Middleware restrictivo (`DeviceChecker`) y autenticación biométrica nativa (huella dactilar o reconocimiento facial) vinculada al hardware seguro del dispositivo.

- **Estrategia de Auditoría:** Registro exhaustivo de accesos en la base de datos, discriminando el método de autenticación utilizado (biometría o contraseña).

- **Persistencia de Datos:** Estrategia de **Soft Delete** sobre PostgreSQL para desvincular hardware sin romper restricciones `UNIQUE` ni comprometer la integridad histórica del inventario.

---

# Instalación

## ¿Cómo levantar cada servicio?

Cada proyecto dispone de su propio **README.md** con instrucciones específicas para su configuración y ejecución.

- **[Guía de inicio del Backend](./backend/README.md)**  
  Configuración de variables de entorno, Docker, PostgreSQL, Prisma y ejecución del servidor.

- **[Guía de inicio de la App Móvil](./app/README.md)**  
  Configuración del entorno, Expo y ejecución del bundler.

- **[Guía de inicio del Panel Web](./web/README.md)**  
  Variables de entorno, instalación de dependencias y servidor de desarrollo con Vite.

---

# Licencia

Proyecto desarrollado con fines académicos y de investigación para la gestión logística segura mediante autenticación biométrica y control de dispositivos.