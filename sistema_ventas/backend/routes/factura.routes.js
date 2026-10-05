const router = require('express').Router();
const controller = require('../controllers/factura.controller');
router.post('/generar', controller.generar);
module.exports = router;
