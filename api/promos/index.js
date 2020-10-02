const express = require('express');
const controller = require('./promo.controller');
const router = express.Router();
const authService = require('../auth.service');

router.post('/', authService.checkAuthentication, controller.create);
router.put('/:id', authService.checkAuthentication, controller.update);
router.delete('/:id', authService.checkAuthentication, controller.delete);
router.get('/:id', authService.checkAuthentication, controller.getPromo);
router.get('/', authService.checkAuthentication, controller.getPromos);

module.exports = router;
