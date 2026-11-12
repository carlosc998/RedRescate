# 🐾 Red Rescate - Aplicación Móvil (TFI)

**Red Rescate** es una aplicación móvil desarrollada con **React Native**, **Expo** y **TypeScript**, orientada a facilitar el reporte, búsqueda y adopción de mascotas dentro de una comunidad activa. 

Este proyecto fue desarrollado como **Trabajo Práctico Integrador (TFI)** para la materia *Desarrollo de Aplicaciones para Dispositivos Móviles* de la **Tecnicatura Superior en Desarrollo de Software** (IFTS N° 16).

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Características y Funcionalidades](#-características-y-funcionalidades)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instalación y Ejecución](#-instalación-y-ejecución)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Tecnologías y Dependencias](#-tecnologías-y-dependencias)
7. [Decisiones de Diseño y Arquitectura](#-decisiones-de-diseño-y-arquitectura)
8. [Declaración del Uso de Inteligencia Artificial](#-declaración-del-uso-de-inteligencia-artificial)

---

## 🐶 Descripción del Proyecto

La aplicación permite a los usuarios publicar reportes de animales perdidos, encontrados o en adopción. Cuenta con un sistema de perfiles simulados (autenticación local) para vincular la autoría de cada publicación, un CRUD completo sobre el listado dinámico de reportes, filtrado por categorías, integración con la cámara y galería del dispositivo, uso de la geolocalización y un panel de estadísticas de la red.

---

## ✨ Características y Funcionalidades

- **CRUD Completo de Reportes:**
  - **Alta (Create):** Creación de reportes con formulario validado, selector de tipo de animal, ubicación, contacto y fotografía.
  - **Lectura (Read):** Listado optimizado con `FlatList` que renderiza las tarjetas de mascotas en tiempo real.
  - **Edición/Estado (Update):** Modificación del estado del reporte (Perdido 🔴, Encontrado 🟢, En adopción 🔵).
  - **Eliminación (Delete):** Borrado de reportes restringido al usuario creador de la publicación.

- **Navegación y Vistas:**
  - **Menú Lateral Hamburguesa:** Sistema de navegación modal fluido para cambiar entre Inicio, Mis Publicaciones, Formulario de Reporte y Estadísticas.
  - **Filtros Rápidos:** Selección de categorías por chips en la parte superior y filtro exclusivo de "Mis Publicaciones" por usuario activo.
  - **Simulador de Sesión de Usuario:** Conmutador de perfiles para testear permisos y autoría de reportes.

- **Integración Nativa:**
  - Geolocalización y GPS (expo-location): Captura automática de coordenadas geográficas en tiempo real mediante el chip GPS del dispositivo, con solicitud de permisos en primer plano.
  - Geocodificación Inversa: Conversión inteligente de coordenadas (latitud/longitud) a direcciones físicas legibles (calle, número y ciudad) para facilitar la ubicación de los hallazgos o extravíos.
  - Enlace Externo a Mapas (Linking): Redirección directa a Google Maps con el punto de encuentro o zona reportada.
  - Cámara Nativa (expo-image-picker): Captura directa desde la cámara del celular con manejo defensivo de excepciones.
  - Galería del Dispositivo: Selección de imágenes almacenadas en el teléfono con compresión y ajuste de resolución para optimización de RAM.

- **Panel de Estadísticas:**
  - Modal con métricas en vivo sobre totales acumulados por estado (Perdidos, Encontrados, Adopción) y especies (Perros, Gatos, Otros).

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de contar con los siguientes elementos en tu entorno de desarrollo:

- [Node.js](https://nodejs.org/) (Versión LTS 18.x o 20.x recomendada).
- [Git](https://git-scm.com/).
- Aplicación **Expo Go** instalada en tu smartphone (Android o iOS) o un emulador configurado (Android Studio / Xcode).
- Conexión a la misma red Wi-Fi entre la computadora y el celular.

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para clonar e iniciar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/carlosc998/RedRescate
   cd RedRescate
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo de Expo:**
   ```bash
   npx expo start

   o

   npx expo start --tunnel ngrok
   ```

4. **Visualizar la aplicación:**
   - Abre la app **Expo Go** en tu smartphone.
   - Escanea el código QR que se despliega en la terminal.

---

## 📁 Estructura del Proyecto

El código está organizado siguiendo buenas prácticas de separación de responsabilidades y tipado estricto:

```text
red-rescate-tfi/
├── assets/                    # Imágenes estáticas e íconos de la app
├── src/
│   ├── components/            # Componentes reutilizables UI
│   │   ├── LoginModal.tsx     # Selector/Modal de usuarios simulados
│   │   ├── MascotaCard.tsx    # Tarjeta individual de reporte
│   │   └── MascotaForm.tsx    # Formulario de alta con cámara/galería
│   ├── types/                 # Definiciones de TypeScript (Interfaces)
│   │   ├── mascota.ts         # Tipado de Mascota y Estados
│   │   └── usuario.ts         # Tipado de Usuario
│   └── utils/                 # Datos en memoria (Mock Data)
│       ├── mockMascotas.ts    # Listado inicial de reportes
│       └── mockUsuarios.ts    # Usuarios preconfigurados para pruebas
├── App.tsx                    # Componente principal, estado global y navegación
├── app.json                   # Configuración del proyecto Expo
├── package.json               # Dependencias del proyecto
├── tsconfig.json              # Configuración de TypeScript
└── README.md                  # Documentación del proyecto
```

---

## 📦 Tecnologías y Dependencias

- **Core:**
  - `react`: 18.x
  - `react-native`: 0.74.x (o versión del SDK de Expo en uso)
  - `expo`: ~51.x
  - `typescript`: ^5.x

- **Módulos y Librerías Adicionales:**
  - **`expo-image-picker`:** Permite interactuar con el hardware nativo de la cámara y seleccionar imágenes de la galería del teléfono.
  - **`react-native-safe-area-context`:** Garantiza la correcta visualización de elementos respetando bordes y barras de estado nativas.

---

## 💡 Decisiones de Diseño y Arquitectura

1. **Componentes Funcionales y Hooks:** Toda la lógica de negocio y presentación fue construida utilizando componentes funcionales de React Native combinados con `useState` para el control de datos.
2. **Navegación Personalizada (Modal Drawers):** En lugar de recargar la aplicación con configuraciones complejas de librerías externas de navegación, se implementó un sistema de navegación mediante `Modal` nativo, permitiendo transiciones limpias e inmediatas entre vistas.
3. **Optimización de Memoria en Hardware:** Para evitar desbordes de memoria en dispositivos móviles al usar la cámara nativa, se configuró una estrategia de compresión en `expo-image-picker` (`quality: 0.4`), logrando imágenes livianas y fluidas.
4. **Tipado Estricto (TypeScript):** Se definieron tipos e interfaces explicitas para las entidades `Mascota`, `EstadoMascota` y `Usuario`, garantizando la solidez del código y previniendo errores en tiempo de desarrollo.

---

## 🤖 Declaración del Uso de Inteligencia Artificial

De acuerdo con los lineamientos del Trabajo Práctico Integrador, se declara el uso asistido de herramientas de **Inteligencia Artificial (IA)** como apoyo durante el proceso de desarrollo:

- **Herramienta utilizada:** Gemini (Asistente de desarrollo).
- **Propósitos:**
  - Consulta y resolución de errores de compilación de TypeScript en `expo-image-picker` y `FlatList`.
  - Sugerencias para el diseño responsive y estructuración de la interfaz con Flexbox.
  - Optimización de la gestión de memoria en el uso de la cámara nativa en dispositivos Android.
- **Autoría:** La comprensión de la arquitectura, la integración del código y la justificación técnica de cada componente fueron auditadas y asumidas íntegramente por el desarrollador.

---

### 👨‍💻 Autor
Carlos Cortez - Estudiante de la Tecnicatura Superior en Desarrollo de Software - **IFTS N° 16**