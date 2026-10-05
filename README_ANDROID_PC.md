# Sistema de Ventas DTE — Android + PC

Esta versión está preparada para empaquetar el sistema web original como:

- **Android:** Capacitor
- **Windows/PC:** Electron + electron-builder

## 1. Requisitos

- Node.js 20+ (se recomienda una versión LTS).
- Para Android: Android Studio + Android SDK.
- Para Windows: Windows 10/11 para generar el instalador.

## 2. Android

En Windows:

1. Ejecuta `INSTALAR_Y_PREPARAR.bat`.
2. Abre Android Studio con `npm run android`.
3. Espera a que Gradle termine de descargar/configurar dependencias.
4. Para generar APK de prueba, ejecuta `GENERAR_APK.bat`.

La APK debug quedará en:

`android/app/build/outputs/apk/debug/app-debug.apk`

## 3. PC / Windows

Ejecuta:

`GENERAR_PC.bat`

Los archivos generados aparecerán en `dist/` (instalador y/o portable).

Para probar sin empaquetar:

`npm run desktop`

## 4. Backend DTE

El backend original está en `backend/` y usa:

`http://localhost:3000/api/dte`

Para iniciar el backend:

```bash
cd backend
npm install
npm start
```

**Importante para Android:** dentro de un teléfono, `localhost` significa el propio teléfono, no tu PC. Si el backend DTE se ejecuta en una PC de la misma red Wi-Fi, configura la URL del backend usando la IP de esa PC, por ejemplo:

`http://192.168.1.100:3000/api/dte`

La aplicación guarda esta dirección en `localStorage` con la clave `DTE_API_URL`. En la consola del navegador/app puedes ejecutar:

```js
setDteApiUrl('http://192.168.1.100:3000/api/dte')
```

## 5. Datos

El inventario y el historial de ventas del frontend se guardan actualmente con `localStorage`. Esto significa que cada instalación/dispositivo mantiene sus propios datos.

El sistema sigue siendo el proyecto original: inventario, código de barras, carrito, total, dinero recibido, cambio, reportes y estructura DTE.

## Nota

Este ZIP deja preparada la estructura para generar las aplicaciones. No contiene una APK/EXE ya compilada porque la compilación Android requiere Android SDK/Gradle y la compilación de Windows requiere las herramientas de empaquetado instaladas en el equipo.
