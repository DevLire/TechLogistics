# TechLogistics - Aplicación Móvil

Cliente móvil desarrollado con **Expo y React Native**, orientado al control seguro de accesos a instalaciones mediante autenticación biométrica, vinculación de dispositivos y comunicación en tiempo real con el backend.

La aplicación forma parte del monorepo de **TechLogistics** y está diseñada para el uso operativo de los trabajadores y dispositivos autorizados.

---

## Arquitectura

La aplicación utiliza una arquitectura modular que separa presentación, estado, infraestructura y lógica de seguridad.

```text
src/
├── app/                 # Navegación y pantallas
├── constants/           # Constantes globales
├── core/                # Actions
├── infrastructure/      # Comunicación, seguridad e integraciones
├── lib/                 # Utilidades
├── presentation/        # Componentes, hooks y providers
└── stores/              # Estado global
```

La aplicación se comunica con el backend mediante dos canales principales:

```text
                    ┌─────────────────────┐
                    │       Backend       │
                    │   Node.js + Express │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
              HTTP/REST                  Socket.IO
                 │                           │
                 ▼                           ▼
        ┌────────────────────────────────────────┐
        │             Aplicación móvil           │
        │          React Native + Expo           │
        └────────────────────────────────────────┘
```

**HTTP/REST** se utiliza para operaciones tradicionales de autenticación, consulta y modificación de datos.

**Socket.IO** se utiliza para eventos que requieren una actualización inmediata del estado de seguridad del dispositivo.

---

# Características

## Hardware Binding

La aplicación utiliza **vinculación de dispositivos** para asociar un dispositivo móvil con un usuario autorizado.

El identificador del dispositivo se obtiene mediante APIs nativas y se utiliza durante el proceso de autenticación y registro.

Las credenciales y datos sensibles relacionados con la sesión se almacenan mediante **Expo Secure Store**.

---

## Autenticación Biométrica

La aplicación utiliza los mecanismos biométricos nativos disponibles en el dispositivo, como:

* Huella dactilar.

La biometría se utiliza como mecanismo de autenticación para dispositivos previamente vinculados.

Cuando el sistema lo permite, existe además un mecanismo secundario mediante contraseña.

---

## Control de Estado del Dispositivo

El acceso a la aplicación depende del estado de autorización del dispositivo en el backend.

Un dispositivo puede encontrarse, entre otros estados, como:

* Registrado y autorizado.
* No registrado con permiso para enrolamiento.
* No registrado sin permiso para enrolamiento.
* Deshabilitado.

La aplicación adapta la interfaz y las acciones disponibles según este estado.

---

## Device Checker

El sistema incorpora un mecanismo de protección global que verifica si el dispositivo actual se encuentra autorizado.

Cuando el dispositivo deja de estar autorizado, la aplicación puede bloquear la interacción con la interfaz y requerir que el usuario cierre su sesión.

Este mecanismo funciona conjuntamente con la comunicación en tiempo real para reaccionar ante cambios realizados desde el panel administrativo.

---

# Comunicación en Tiempo Real

La aplicación mantiene una conexión autenticada mediante **Socket.IO** mientras el usuario tiene una sesión activa.

El canal de tiempo real permite recibir cambios críticos de seguridad sin necesidad de cerrar y volver a abrir la aplicación.

Entre los eventos gestionados se encuentran:

### Cambio de permiso de registro

Cuando un administrador habilita o deshabilita el permiso de un usuario para registrar un dispositivo, la aplicación recibe el cambio inmediatamente y actualiza su estado de seguridad.

### Deshabilitación del usuario

Si un usuario es deshabilitado desde el backend, la aplicación puede reaccionar inmediatamente y finalizar o la sesión correspondiente.

La conexión Socket.IO se establece únicamente cuando existe una sesión autenticada y utiliza las credenciales necesarias para validar la identidad del usuario y del dispositivo.

---

# Flujo de Autenticación

## 1. Inicio de sesión

Antes de enviar las credenciales al backend se realizan validaciones locales.

Entre ellas:

* Correo electrónico obligatorio.
* Contraseña obligatoria.
* Validación del formato del correo.
* Longitud mínima de la contraseña.

El backend determina posteriormente si el usuario y el dispositivo pueden continuar con el proceso de autenticación.

---

## 2. Validación del dispositivo

Una vez autenticado el usuario, la aplicación determina el flujo correspondiente según el estado del dispositivo.

### Dispositivo registrado

Cuando el dispositivo pertenece al usuario:

1. Se solicita autenticación biométrica.
2. Si la biometría es válida, se permite el acceso.
3. Si está habilitado el mecanismo de contingencia, el usuario puede autenticarse mediante contraseña.

---

### Dispositivo no registrado con permiso de enrolamiento

Cuando el usuario tiene autorización para registrar un nuevo dispositivo:

1. Se muestra el flujo de registro.
2. El dispositivo se vincula al usuario.
3. La operación puede requerir autenticación biométrica.
4. Cuando está habilitado el mecanismo secundario, también puede utilizarse la contraseña.

---

### Dispositivo no registrado sin autorización

Cuando el usuario no posee permiso para registrar el dispositivo:

1. El acceso queda bloqueado.
2. Se muestra el estado de autorización correspondiente.
3. El usuario únicamente puede cerrar sesión.

Si el administrador concede posteriormente el permiso, la aplicación puede recibir el cambio mediante Socket.IO sin necesidad de reiniciarse.

---

# Seguridad y Almacenamiento

La aplicación utiliza **Expo Secure Store** para almacenar información sensible relacionada con la autenticación y vinculación del dispositivo.

Los datos relacionados con la sesión no se almacenan directamente en mecanismos de almacenamiento convencional cuando requieren protección adicional.

La autenticación biométrica utiliza las APIs nativas del sistema operativo y no almacena directamente información biométrica dentro de la aplicación.

---

# Desarrollo Local

## 1. Configurar variables de entorno

Copie el archivo de plantilla:

```bash
cp .env.template .env
```

Configure la dirección de la API del backend:

```env
EXPO_PUBLIC_API_URL=http://<SU_IP_LOCAL_IPV4>:3000/api
EXPO_PUBLIC_SOCKET_URL=http://<SU_IP_LOCAL_IPV4>:3000
```

Durante el desarrollo local, la dirección debe corresponder a una interfaz accesible desde el dispositivo o emulador donde se ejecuta la aplicación.

> En Windows puede obtener la dirección IP mediante `ipconfig`. En Linux o WSL2 puede utilizar `ip addr`.

---

## 2. Instalar dependencias

Si está trabajando desde el directorio de la aplicación:

```bash
pnpm install
```

Si el proyecto se encuentra dentro del workspace de TechLogistics, también puede instalar todas las dependencias desde la raíz del monorepo:

```bash
pnpm install
```

---

## 3. Ejecutar el proyecto

Desde el directorio `app`:

```bash
pnpm start
```

O desde la raíz del monorepo:

```bash
pnpm dev:app
```

Esto inicia el servidor de desarrollo de Expo.

La aplicación puede ejecutarse utilizando:

* Un dispositivo físico mediante Expo.
* Un emulador de Android.
* Un simulador de iOS en macOS.

---

# Tecnologías

* React Native
* Expo
* TypeScript
* Expo Secure Store
* Expo Local Authentication
* Axios
* Zustand
* React Context
* Socket.IO Client
* React Navigation

---

# Relación con el Backend

La aplicación depende del backend de TechLogistics para las operaciones de autenticación, autorización y gestión de dispositivos.

Para configurar y ejecutar el backend, consulta:

[README del Backend](../backend/README.md)

---