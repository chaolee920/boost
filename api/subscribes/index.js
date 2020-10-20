const express = require('express');
const controller = require('./subscribe.controller');
const router = express.Router();
const authService = require('../auth.service');

router.post('/', authService.checkAuthentication, controller.create);
router.delete('/:id', authService.checkAuthentication, controller.delete);
router.get('/', authService.checkAuthentication, controller.getSubscribes);
router.get('/:id', authService.checkAuthentication, controller.getUserSubscribesByPromo);

module.exports = router;
