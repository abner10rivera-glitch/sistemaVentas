const router = require('express').Router();
const controller = require('../controllers/dte.controller');
router.post('/consumidor-final', controller.crearConsumidorFinal);
router.post('/validar', controller.validar);
router.post('/transmitir', controller.transmitir);
module.exports = router;
