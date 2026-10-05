function imprimirFactura(datosFactura) {
    const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Factura #${datosFactura.id || ''}</title>
      <style>
        body { font-family: Arial, sans-serif; width: 80mm; margin: 0 auto; padding: 10px; font-size: 12px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 4px 0; text-align: left; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        @media print { @page { margin: 0; } body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="text-center">
        <h2>${datosFactura.empresa || 'Mi Empresa'}</h2>
        <p>${datosFactura.direccion || ''}</p>
        <p class="bold">FACTURA #${datosFactura.id || ''}</p>
        <p>Fecha: ${datosFactura.fecha || new Date().toLocaleDateString()}</p>
      </div>
      <div class="divider"></div>
      <table>
        <thead>
          <tr><th>Cant.</th><th>Producto</th><th class="text-right">Total</th></tr>
        </thead>
        <tbody>
          ${(datosFactura.items || []).map(item => `
            <tr>
              <td>${item.cantidad}</td>
              <td>${item.nombre}</td>
              <td class="text-right">$${Number(item.total).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="divider"></div>
      <div class="text-right">
        <p class="bold">Total: $${Number(datosFactura.total || 0).toFixed(2)}</p>
      </div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      </script>
    </body>
    </html>
  `;

  const ventana = window.open('', '_blank', 'width=400,height=600');
  ventana.document.write(contenidoHTML);
  ventana.document.close();
}