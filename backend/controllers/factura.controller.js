const dte = require('../services/dte.service');
exports.generar = (req,res) => { try { res.json({ok:true,dte:dte.crearFacturaConsumidorFinal(req.body)}); } catch(e){ res.status(400).json({ok:false,error:e.message}); } };
