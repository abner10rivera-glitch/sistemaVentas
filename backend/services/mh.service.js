async function transmitir(dteFirmado){
  if(!process.env.MH_API_URL) throw new Error('MH_API_URL no está configurado en .env');
  // TODO: implementar autenticación, endpoint y payload según especificación vigente del MH.
  return {ok:false,pendiente:true,mensaje:'Conector MH preparado; falta configurar endpoint, autenticación y transmisión oficial.',dteFirmado};
}
module.exports={transmitir};
