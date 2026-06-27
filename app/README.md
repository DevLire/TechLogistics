# Techlogistics - Aplicación Móvil

Cliente móvil desarrollado con **Expo SDK 56** y **React Native**, orientado al control de accesos a instalaciones, autenticación biométrica y gestión segura de operarios. La aplicación utiliza **Expo Router** para implementar un sistema de navegación basado en archivos.

---

## Arquitectura

La aplicación está organizada siguiendo una estructura modular que separa la lógica de negocio, infraestructura y presentación.

```text
src/
├── app/              # Rutas y pantallas (Expo Router)
├── config/           # Configuración global
├── constants/        # Constantes compartidas
├── core/             # Cliente API y lógica central
├── hooks/            # Hooks globales
├── infrastructure/   # Seguridad e interfaces
├── lib/              # Utilidades
├── presentation/     # Componentes y contexto
└── stores/           # Estado global
```

---

## Características

### Hardware Binding

La aplicación vincula cada usuario a un único dispositivo mediante un identificador persistente almacenado en el dispositivo.

Las credenciales sensibles se almacenan utilizando **expo-secure-store**, mientras que la autenticación biométrica aprovecha los mecanismos nativos del sistema operativo (huella dactilar o reconocimiento facial).

---

### DeviceChecker

Toda la aplicación está protegida por un proveedor (`DeviceChecker`) ubicado en la raíz del árbol de componentes.

Si el dispositivo no se encuentra autorizado por el backend, se muestra un overlay que bloquea completamente la interfaz hasta que el usuario cierre sesión o el dispositivo sea habilitado por un administrador.

---

### Estrategia Anti-Caché

Las solicitudes HTTP incorporan mecanismos para evitar respuestas almacenadas en caché, incluyendo:

- Cabeceras HTTP de no almacenamiento.
- Parámetros dinámicos en las peticiones para forzar la revalidación de la sesión.

---

## Flujo de Autenticación

### 1. Inicio de sesión

Antes de enviar las credenciales al servidor se realizan validaciones locales:

- Correo electrónico obligatorio.
- Contraseña obligatoria.
- Validación del formato del correo.
- Longitud mínima de seis caracteres para la contraseña.

Además, la aplicación maneja respuestas específicas para distintos escenarios:

- Credenciales inválidas.
- Dispositivo asociado a otro usuario.
- Error interno del servidor.

---

### 2. Validación del dispositivo

Una vez autenticado el usuario, el comportamiento depende del estado del dispositivo.

#### Dispositivo registrado

Si el dispositivo pertenece al usuario:

- Se solicita autenticación biométrica.
- El usuario accede a la aplicación.

Si el administrador habilitó el acceso mediante contraseña como contingencia, el usuario también puede autenticarse utilizando nuevamente sus credenciales, registrándose el método de acceso utilizado.

---

#### Dispositivo no registrado con permiso de enrolamiento

Si el usuario tiene autorización para registrar un nuevo dispositivo:

- Es redirigido a la pantalla de registro.
- Puede enrolar el dispositivo mediante biometría.
- Si el administrador habilitó el modo de contingencia, también puede completar el proceso utilizando su contraseña.

---

#### Dispositivo no registrado sin autorización

Cuando el usuario no posee permisos para registrar el dispositivo:

- La aplicación bloquea completamente la interfaz.
- Se muestra un mensaje indicando que el dispositivo no está autorizado.
- La única acción disponible es cerrar sesión.

---

### 3. Perfil del usuario

La aplicación dispone de una pantalla de perfil donde el usuario puede consultar su información y finalizar la sesión de forma segura.

---

## Desarrollo Local

### 1. Configurar variables de entorno

Copie el archivo de plantilla.

```bash
cp .env.template .env
```

Configure la dirección de la API del backend utilizando la dirección IPv4 de la máquina donde se encuentra ejecutándose.

```env
EXPO_PUBLIC_API_URL=http://<SU_IP_LOCAL_IPV4>:3000/api
```

> En Windows puede obtener la dirección IP ejecutando `ipconfig`. En Linux o WSL2 puede utilizar `ifconfig` o `ip addr`.

---

### 2. Instalar dependencias

```bash
pnpm install
```

---

### 3. Ejecutar el proyecto

Inicie el servidor de desarrollo de Expo.

```bash
pnpm start
```

Una vez iniciado Metro Bundler, podrá:

- Escanear el código QR desde **Expo Go v56**.
- Ejecutar la aplicación en un emulador de Android.
- Ejecutarla en el simulador de iOS (macOS).

---

## Tecnologías

- React Native
- Expo SDK 56
- Expo Router
- Expo Secure Store
- Expo Local Authentication
- TypeScript
- Axios
- Zustand
- React Context

---

## Licencia

Proyecto desarrollado con fines académicos y de investigación para la gestión logística segura mediante autenticación biométrica y control de dispositivos.