const express = require('express');
const controller = require('./user.controller');
const router = express.Router();
const authService = require('../auth.service');

router.post('/', controller.signup);
router.post('/login', controller.login);
router.get('/me', authService.checkAuthentication, controller.getMe);
router.put('/', authService.checkAuthentication, controller.update);

module.exports = router;
