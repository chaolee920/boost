const express = require('express');
const controller = require('./sale.controller');
const router = express.Router();
const authService = require('../auth.service');

router.post('/', authService.checkAuthentication, controller.create);
router.delete('/:id', authService.checkAuthentication, controller.delete);
router.get('/:id/user', authService.checkAuthentication, controller.getSalesByUser);
router.get('/:id/promo', authService.checkAuthentication, controller.getSalesByPromo);

module.exports = router;
