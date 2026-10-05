const service = require('../services/dte.service');
exports.crearConsumidorFinal = async (req,res) => { try { res.json({ ok:true, dte: service.crearFacturaConsumidorFinal(req.body) }); } catch(e){ res.status(400).json({ok:false,error:e.message}); } };
exports.validar = async (req,res) => { const result = require('../validators/dte.validator').validar(req.body); res.status(result.ok?200:400).json(result); };
exports.transmitir = async (req,res) => { const mh = require('../services/mh.service'); try { res.json(await mh.transmitir(req.body)); } catch(e){ res.status(502).json({ok:false,error:e.message}); } };
