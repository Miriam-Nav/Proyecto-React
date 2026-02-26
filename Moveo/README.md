# 🎮 Moveo - Sistema de Gestión de Alquiler de Videojuegos

> Aplicación móvil para gestionar alquileres de videojuegos con control de stock automático, notificaciones push y sincronización en tiempo real.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Base de Datos](#-base-de-datos)
- [Funcionalidades](#-funcionalidades)
- [Documentación Adicional](#-documentación-adicional)

---

## 🎯 Descripción

**Moveo** es una aplicación móvil desarrollada con React Native y Expo que permite gestionar de forma eficiente el alquiler de videojuegos. Incluye control automático de inventario, seguimiento de clientes, notificaciones push y sincronización en tiempo real con Supabase.

---

## ✨ Características

- ✅ **Gestión de Videojuegos**: CRUD completo con stock automático
- ✅ **Gestión de Clientes**: Perfiles con avatar, historial de alquileres
- ✅ **Gestión de Alquileres**: Crear, editar, finalizar y cancelar alquileres
- ✅ **Control de Stock Automático**: Triggers SQL que gestionan el inventario
- ✅ **Notificaciones Push**: Alertas automáticas al registrar clientes
- ✅ **Autenticación**: Sistema de login/registro con Supabase Auth
- ✅ **Búsqueda Inteligente**: Dropdown con autocompletado
- ✅ **Tema Personalizado**: Material Design 3 con React Native Paper
- ✅ **Validación de Formularios**: React Hook Form + Zod
- ✅ **Estado Global**: Zustand para manejo de usuario
- ✅ **Caché Optimizado**: TanStack Query con invalidación automática

---

## 🛠️ Tecnologías

### Frontend
- **React Native** 0.81.5
- **Expo** ~54.0.33
- **Expo Router** ~6.0.23 (File-based routing)
- **TypeScript** ~5.3.3

### UI/UX
- **React Native Paper** ^5.14.5 (Material Design 3)
- **Expo Vector Icons** ^15.0.3
- **Expo Linear Gradient** ~15.0.8

### Estado y Datos
- **TanStack Query** ^5.90.20 (React Query)
- **Zustand** ^5.0.9
- **React Hook Form** ^7.70.0
- **Zod** ^3.23.8

### Backend
- **Supabase** ^2.95.3
  - PostgreSQL Database
  - Authentication
  - Storage (avatars)
  - Realtime subscriptions
  - Row Level Security (RLS)

### Otros
- **Expo Notifications** ^0.32.16
- **Expo Image Picker** ~17.0.10
- **Expo Secure Store** ~15.0.8
- **Date Time Picker** 8.4.4

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** (en tu dispositivo móvil) o un emulador Android/iOS
- Cuenta en **Supabase** (gratuita)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Moveo
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

> **Nota**: Obtén estas credenciales desde tu proyecto en [Supabase Dashboard](https://app.supabase.com) → Settings → API

### 4. Configurar la base de datos

Ejecuta los scripts SQL en Supabase SQL Editor en el siguiente orden:

1. **Crear tablas** (crear manualmente o usar migrations)
2. `supabase/avatars_bucket.sql` - Storage para avatares
3. `supabase/push_tokens.sql` - Tabla de tokens de notificaciones
4. `supabase/notificaciones_auto_clientes.sql` - Notificaciones automáticas
5. `supabase/gestion_stock_alquileres.sql` - Control automático de stock
6. `supabase/enable_realtime.sql` - Habilitar realtime (opcional)

### 5. Iniciar la aplicación

```bash
npm start
# o
npx expo start
```

Escanea el código QR con **Expo Go** (Android) o **Camera** (iOS).

---

## ⚙️ Configuración

### Notificaciones Push

1. Instala Expo Go en tu dispositivo
2. La app registrará automáticamente el token push
3. Las notificaciones se envían al crear nuevos clientes

### Autenticación

- Los usuarios deben registrarse con email/contraseña
- Supabase maneja la autenticación y sesiones
- El estado global se mantiene con Zustand

### Storage

- Los avatares se almacenan en el bucket `avatars` de Supabase
- Uso: Perfil de usuario y clientes

---

## 📁 Estructura del Proyecto

```
Moveo/
├── src/
│   ├── app/                      # Expo Router (file-based routing)
│   │   ├── index.tsx            # Pantalla login
│   │   ├── _layout.tsx          # Layout raíz
│   │   └── (protected)/         # Rutas protegidas
│   │       ├── preferences.tsx
│   │       ├── profile.tsx
│   │       └── (tabs)/          # Navegación por pestañas
│   │           ├── home.tsx
│   │           ├── alquileres/  # CRUD alquileres
│   │           ├── clientes/    # CRUD clientes
│   │           └── videojuegos/ # CRUD videojuegos (archivo unificado)
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── ButtonApp.tsx
│   │   ├── CardApp.tsx
│   │   ├── ControlledTextInput.tsx
│   │   ├── DateInputField.tsx
│   │   ├── HeaderApp.tsx
│   │   ├── RentalSummary.tsx
│   │   └── SearchDropdown.tsx
│   │
│   ├── config/
│   │   └── supabaseClient.ts    # Cliente Supabase configurado
│   │
│   ├── features/
│   │   └── storage/             # Gestión de archivos
│   │       ├── pickImage.ts
│   │       └── uploadAvatar.ts
│   │
│   ├── hooks/                   # React Query hooks
│   │   ├── useAlquileres.ts
│   │   ├── useClientes.ts
│   │   ├── useNotifications.ts
│   │   └── useVideojuegos.ts
│   │
│   ├── providers/               # Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   │
│   ├── schemas/                 # Validación Zod
│   │   ├── alquiler.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── cliente.schema.ts
│   │   └── usuario.schema.ts
│   │
│   ├── services/                # Servicios Supabase
│   │   ├── alquilerService.ts
│   │   ├── authService.ts
│   │   ├── clienteService.ts
│   │   ├── notificationService.ts
│   │   ├── profileService.ts
│   │   └── videojuegoService.ts
│   │
│   ├── stores/                  # Estado global Zustand
│   │   ├── createSelectors.ts
│   │   └── userStore.ts
│   │
│   ├── styles/                  # Estilos compartidos
│   │   ├── client.styles.ts
│   │   ├── common.styles.ts
│   │   ├── form.styles.ts
│   │   ├── id.styles.ts
│   │   ├── loggin.styles.ts
│   │   └── modal.styles.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── Alquiler.ts
│   │   ├── Clientes.ts
│   │   ├── User.ts
│   │   └── Videojuegos.ts
│   │
│   ├── constants.ts             # Constantes globales
│   └── theme.ts                 # Tema Material Design
│
├── supabase/                    # Scripts SQL
│   ├── avatars_bucket.sql
│   ├── notificaciones_auto_clientes.sql
│   ├── push_tokens.sql
│   ├── gestion_stock_alquileres.sql
│   └── enable_realtime.sql
│
├── assets/                      # Imágenes e iconos
├── .env                         # Variables de entorno (NO SUBIR A GIT)
├── .env.example                # Ejemplo de variables
├── app.json                    # Configuración Expo
├── package.json
└── tsconfig.json
```

---

## 📜 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en navegador
npm run web
```

---

## 🗄️ Base de Datos

### Tablas Principales

#### `videojuegos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Primary Key |
| titulo | text | Nombre del videojuego |
| plataforma | text | PS5, Xbox, PC, etc. |
| genero | text | Acción, RPG, etc. |
| precio_alquiler_dia | numeric | Precio diario |
| stock | integer | Unidades disponibles |
| imagen_url | text | URL imagen (opcional) |
| created_at | timestamp | Fecha creación |

#### `clientes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Primary Key |
| nombre | text | Nombre completo |
| email | text | Email único |
| telefono | text | Teléfono |
| activo | boolean | Estado del cliente |
| avatar_url | text | URL avatar |
| created_at | timestamp | Fecha creación |

#### `alquileres`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Primary Key |
| cliente_id | integer | FK a clientes |
| videojuego_id | integer | FK a videojuegos |
| fecha_inicio | date | Inicio del alquiler |
| fecha_fin_prevista | date | Fin estimado |
| estado | text | activo/finalizado/cancelado |
| total_pagado | numeric | Monto total |
| created_at | timestamp | Fecha creación |
| updated_at | timestamp | Última actualización |

#### `push_tokens`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Primary Key |
| token | text | Token Expo Push |
| user_id | uuid | FK a auth.users (opcional) |
| created_at | timestamp | Fecha creación |

### Triggers SQL Implementados

#### 1. **Control de Stock en Alquileres**
- **Validación**: No permite alquilar si `stock <= 0`
- **Reducción**: Al crear alquiler con estado "activo" → `stock - 1`
- **Devolución**: Al finalizar/cancelar → `stock + 1`
- **Reactivación**: Al cambiar de finalizado/cancelado a activo → `stock - 1` (con validación)
- **Eliminación**: Al borrar alquiler activo → `stock + 1`

#### 2. **Notificaciones Automáticas**
- Se envía push notification al crear un nuevo cliente
- Usa la API de Expo Push Notifications
- Requiere extensión `pg_net` en PostgreSQL

#### 3. **Timestamps Automáticos**
- `created_at` se establece automáticamente
- `updated_at` se actualiza en cada modificación

---

## 🎨 Funcionalidades

### 🎮 Gestión de Videojuegos

- **Crear/Editar videojuegos** con formulario unificado
- **Listado** con tarjetas visuales
- Control de **stock** automático
- Validación de datos con Zod
- Búsqueda y filtrado (futuro)

### 👥 Gestión de Clientes

- **CRUD completo** de clientes
- **Avatar personalizado** (subida de imagen)
- Estado activo/inactivo
- **Historial de alquileres** por cliente
- Modal de detalles con información completa

### 📦 Gestión de Alquileres

- **Crear alquiler** seleccionando cliente y videojuego
- **Búsqueda inteligente** con dropdown autocomplete
- **Cálculo automático** de días y total a pagar
- **Cambio de estado**: activo → finalizado/cancelado
- **Resumen visual** del alquiler con RentalSummary
- **Validaciones**:
  - No permite alquilar sin stock
  - Fechas coherentes
  - Cliente y videojuego obligatorios

### 🔔 Notificaciones

- Push notifications al registrar clientes
- Registro automático de tokens
- Gestión de permisos en tiempo real

### 🔐 Autenticación

- Login/Registro con email/password
- Sesión persistente con Supabase Auth
- Rutas protegidas con Expo Router
- Perfil de usuario editable

### 🎨 UI/UX

- **Material Design 3** con React Native Paper
- Tema personalizado con colores consistentes
- Componentes reutilizables (ButtonApp, CardApp)
- Formularios controlados con validación en tiempo real
- Snackbars para feedback de acciones
- ScrollViews optimizados para todos los formularios

---

## 📚 Documentación Adicional

- [DOCUMENTACIÓN.md](DOCUMENTACIÓN.md) - Documentación detallada del proyecto
- [EXPLICACION_TECNICA.md](EXPLICACION_TECNICA.md) - Detalles técnicos de la implementación

---

## 🐛 Solución de Problemas

### Error: "No hay stock disponible"
- Verifica que el videojuego tenga stock > 0
- Revisa que no haya alquileres activos que no se hayan finalizado

### Notificaciones no llegan
- Verifica que la extensión `pg_net` esté habilitada en Supabase
- Comprueba que el token push esté registrado en la tabla `push_tokens`
- Revisa los logs de Supabase SQL Editor

### Error de autenticación
- Verifica las variables de entorno `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Asegúrate de que RLS esté configurado correctamente en Supabase

### Scroll no funciona en formularios
- Verifica que `ScrollView` use `style={commonS.screen}` y no `contentContainerStyle={{ flex: 1 }}`

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso educativo.

---

## 👨‍💻 Autor

**Miriam** - Desarrollo Full Stack con React Native y Supabase

---

## 🙏 Agradecimientos

- **Expo Team** por el increíble framework
- **Supabase** por el backend as a service
- **React Native Paper** por los componentes Material Design
- **TanStack Query** por la gestión de estado del servidor

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026
