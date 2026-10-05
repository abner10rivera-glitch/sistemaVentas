function validar(dte){
  const errores=[];
  if(!dte?.identificacion) errores.push('Falta identificacion');
  if(!dte?.identificacion?.codigoGeneracion) errores.push('Falta codigoGeneracion');
  if(!dte?.identificacion?.tipoDte) errores.push('Falta tipoDte');
  if(!Array.isArray(dte?.cuerpoDocumento)) errores.push('cuerpoDocumento debe ser un arreglo');
  if(!dte?.resumen) errores.push('Falta resumen');
  return {ok:errores.length===0,errores};
}
module.exports={validar};
