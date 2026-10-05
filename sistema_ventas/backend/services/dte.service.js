const crypto = require('crypto');
function crearFacturaConsumidorFinal(venta) {
  const now = new Date();
  const items = Array.isArray(venta.items) ? venta.items : [];
  const total = items.reduce((s,i)=>s + Number(i.price||0)*Number(i.quantity||0),0);
  return {
    identificacion:{version:1, ambiente:process.env.DTE_AMBIENTE||'00', tipoDte:'01', codigoGeneracion:crypto.randomUUID().toUpperCase(), numeroControl:'', tipoModelo:1, tipoOperacion:1, fecEmi:now.toISOString().slice(0,10), horEmi:now.toTimeString().slice(0,8)},
    documentoRelacionado:null,
    emisor:{nit:process.env.EMISOR_NIT||'', nrc:process.env.EMISOR_NRC||'', nombre:process.env.EMISOR_NOMBRE||'', actividadEconomica:process.env.EMISOR_ACTIVIDAD||'', direccion:process.env.EMISOR_DIRECCION||''},
    receptor:{tipoDocumento:null,numDocumento:null,nombre:venta.receptor?.nombre||'CONSUMIDOR FINAL'},
    cuerpoDocumento:items.map((i,n)=>({numItem:n+1,tipoItem:1,cantidad:Number(i.quantity),codigo:i.barcode||null,descripcion:i.name,precioUni:Number(i.price),ventaGravada:Number(i.price)*Number(i.quantity)})),
    resumen:{totalGravada:total,totalPagar:total},
    extension:null,
    apendice:null
  };
}
module.exports={crearFacturaConsumidorFinal};
