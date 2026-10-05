# Sistema de Ventas

Sistema web local desarrollado con HTML, CSS y JavaScript para:

- Registrar productos.
- Ingresar código de barras.
- Usar lectores USB de códigos de barras que funcionen como teclado.
- Controlar inventario y stock.
- Agregar productos a una venta.
- Calcular subtotal y total.
- Registrar dinero recibido.
- Calcular el cambio.
- Guardar las ventas.
- Consultar ventas del día, semana y mes.

## Estructura

```text
sistema_ventas/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── img/
└── data/
```

## Cómo abrirlo

1. Abre la carpeta en Visual Studio Code.
2. Abre `index.html`.
3. Puedes usar Live Server para ejecutarlo.
4. Los datos se guardan en `localStorage` del navegador.

## Lector de códigos

Conecta un lector USB. Normalmente el lector escribe el código como si fuera un teclado y termina con Enter. Escanea un código en el campo correspondiente.

## Importante

Esta versión es un prototipo local. Para una tienda real conviene agregar una base de datos y un backend, usuarios, respaldos, facturación y control de permisos.
