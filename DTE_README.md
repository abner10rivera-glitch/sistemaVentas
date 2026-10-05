# Integración DTE - Sistema de Ventas

Esta carpeta deja preparada la arquitectura para integrar el sistema con Factura Electrónica/DTE de El Salvador.

## Flujo
1. Venta desde el POS.
2. Generación del DTE en backend.
3. Validación del JSON.
4. Firma electrónica (pendiente de configurar con el mecanismo autorizado).
5. Transmisión al Ministerio de Hacienda (conector pendiente de configurar con endpoints/credenciales oficiales vigentes).
6. Guardado de respuesta, código de generación, número de control y sello de recepción.
7. Generación de representación gráfica/PDF.

## Seguridad
No coloques credenciales, certificados o contraseñas en JavaScript del navegador. Usa `.env` y almacenamiento seguro del certificado.

## Inicio del backend
```bash
cd backend
npm install
npm start
```

Luego el frontend puede comunicarse con `http://localhost:3000/api/dte`.

> El proyecto es una estructura de integración/prototipo. Antes de producción deben incorporarse las especificaciones, catálogos, validaciones, firma, autenticación y endpoints oficiales vigentes del Ministerio de Hacienda.
